import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { 
  Cell, PlayerStats, Settings, Achievement, 
  Difficulty, GameMode, XPPopup, DailyMission
} from '../types';
import { generatePuzzle, getRelatedCells, getDailyPuzzle, isBoardComplete } from '../lib/sudoku';
import { calculateXP, getLevelFromXP, getRankFromLevel } from '../lib/xp';
import { checkAchievements, ALL_ACHIEVEMENTS } from '../lib/achievements';
import { playSound, setSoundEnabled } from '../lib/sound';

// ─── Custom JSON serializer for Cell (handles Set) ────────────────────────────

function serializeCell(cell: Cell) {
  return { ...cell, notes: Array.from(cell.notes) };
}

function deserializeCell(raw: unknown): Cell {
  const obj = raw as { notes?: number[]; value?: number; given?: boolean; isError?: boolean; isHighlighted?: boolean; isSameNumber?: boolean; isSelected?: boolean };
  return {
    value: obj.value ?? 0,
    given: obj.given ?? false,
    isError: obj.isError ?? false,
    isHighlighted: obj.isHighlighted ?? false,
    isSameNumber: obj.isSameNumber ?? false,
    isSelected: obj.isSelected ?? false,
    notes: new Set<number>(Array.isArray(obj.notes) ? obj.notes : []),
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

function buildCells(puzzle: number[]): Cell[] {
  return puzzle.map(v => ({
    value: v,
    given: v !== 0,
    notes: new Set<number>(),
    isError: false,
    isHighlighted: false,
    isSameNumber: false,
    isSelected: false,
  }));
}

const DEFAULT_STATS: PlayerStats = {
  totalGames: 0,
  totalWins: 0,
  totalXP: 0,
  level: 1,
  rank: 'bronze',
  skillRating: 600,
  currentStreak: 0,
  longestStreak: 0,
  lastPlayedDate: '',
  fastestTimes: { easy: 0, medium: 0, hard: 0, expert: 0, master: 0 },
  averageTimes: { easy: 0, medium: 0, hard: 0, expert: 0, master: 0 },
  gamesWonByDifficulty: { easy: 0, medium: 0, hard: 0, expert: 0, master: 0 },
  totalPlayTime: 0,
  mistakeRate: 0,
  hintsUsed: 0,
  dailyChallengesCompleted: 0,
  achievements: [],
  weeklyXP: 0,
  weeklyStart: getTodayString(),
};

const DEFAULT_SETTINGS: Settings = {
  theme: 'light',
  soundEnabled: true,
  animationsEnabled: true,
  autoCheck: true,
  highlightPeers: true,
  highlightSameNumbers: true,
  showTimer: true,
  colorblindMode: false,
  highContrast: false,
  preferredDifficulty: 'medium',
  preferredMode: 'classic',
  zenMode: false,
  hapticFeedback: true,
};

const DEFAULT_MISSIONS: DailyMission[] = [
  { id: 'm1', title: 'Daily Starter', description: 'Complete 1 puzzle today', icon: "hint", progress: 0, target: 1, xpReward: 50, completed: false },
  { id: 'm2', title: 'No Mistakes', description: 'Finish a puzzle perfectly', icon: "perfect", progress: 0, target: 1, xpReward: 100, completed: false },
  { id: 'm3', title: 'Speed Run', description: 'Finish Easy under 5 minutes', icon: "speed", progress: 0, target: 1, xpReward: 75, completed: false },
  { id: 'm4', title: 'Challenger', description: 'Play a Hard+ puzzle', icon: "streak", progress: 0, target: 1, xpReward: 150, completed: false },
];

// ─── Store Interface ──────────────────────────────────────────────────────────

interface GameStore {
  cells: Cell[];
  puzzle: number[];
  solution: number[];
  selectedCell: number | null;
  difficulty: Difficulty;
  mode: GameMode;
  isNotesMode: boolean;
  autoCheck: boolean;
  startTime: number | null;
  elapsedTime: number;
  isPaused: boolean;
  isComplete: boolean;
  mistakes: number;
  maxMistakes: number;
  hintsUsed: number;
  undoStack: number[][];
  redoStack: number[][];
  isDaily: boolean;
  xpGained: number;
  lastXP: number;
  isGameActive: boolean;
  
  currentPage: string;
  xpPopups: XPPopup[];
  newAchievements: Achievement[];
  shakingCell: number | null;
  correctCell: number | null;
  
  stats: PlayerStats;
  settings: Settings;
  achievements: Achievement[];
  missions: DailyMission[];
  missionDate: string;

  startGame: (difficulty: Difficulty, mode?: GameMode, isDaily?: boolean) => void;
  selectCell: (idx: number) => void;
  placeNumber: (num: number) => void;
  toggleNote: (num: number) => void;
  eraseCell: () => void;
  useHint: () => void;
  undo: () => void;
  redo: () => void;
  toggleNotesMode: () => void;
  togglePause: () => void;
  toggleAutoCheck: () => void;
  setPage: (page: string) => void;
  tick: () => void;
  updateSettings: (s: Partial<Settings>) => void;
  dismissNewAchievements: () => void;
  addXPPopup: (amount: number, x: number, y: number) => void;
  removeXPPopup: (id: string) => void;
  resetGame: () => void;
  handleCompletion: () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      cells: [],
      puzzle: [],
      solution: [],
      selectedCell: null,
      difficulty: 'medium',
      mode: 'classic',
      isNotesMode: false,
      autoCheck: true,
      startTime: null,
      elapsedTime: 0,
      isPaused: false,
      isComplete: false,
      mistakes: 0,
      maxMistakes: 3,
      hintsUsed: 0,
      undoStack: [],
      redoStack: [],
      isDaily: false,
      xpGained: 0,
      lastXP: 0,
      isGameActive: false,
      
      currentPage: 'landing',
      xpPopups: [],
      newAchievements: [],
      shakingCell: null,
      correctCell: null,
      
      stats: DEFAULT_STATS,
      settings: DEFAULT_SETTINGS,
      achievements: ALL_ACHIEVEMENTS,
      missions: DEFAULT_MISSIONS,
      missionDate: getTodayString(),

      startGame: (difficulty, mode = 'classic', isDaily = false) => {
        const { puzzle, solution } = isDaily
          ? getDailyPuzzle(getTodayString())
          : generatePuzzle(difficulty);
        
        const cells = buildCells(puzzle);
        const { stats } = get();
        const today = getTodayString();
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        
        let newStreak = stats.currentStreak;
        if (stats.lastPlayedDate === yesterday) {
          newStreak = stats.currentStreak + 1;
        } else if (stats.lastPlayedDate !== today) {
          newStreak = 1;
        }

        set(s => ({
          cells,
          puzzle,
          solution,
          difficulty,
          mode,
          isDaily,
          selectedCell: null,
          isNotesMode: false,
          startTime: Date.now(),
          elapsedTime: 0,
          isPaused: false,
          isComplete: false,
          mistakes: 0,
          hintsUsed: 0,
          undoStack: [],
          redoStack: [],
          xpGained: 0,
          lastXP: 0,
          isGameActive: true,
          currentPage: 'game',
          stats: {
            ...s.stats,
            totalGames: s.stats.totalGames + 1,
            currentStreak: newStreak,
            longestStreak: Math.max(s.stats.longestStreak, newStreak),
            lastPlayedDate: today,
          }
        }));
      },

      selectCell: (idx) => {
        const { cells, settings } = get();
        playSound('select');

        const newCells = cells.map((cell, i) => ({
          ...cell,
          isSelected: i === idx,
          isHighlighted: false,
          isSameNumber: false,
        }));

        if (settings.highlightPeers) {
          const related = getRelatedCells(idx);
          related.forEach(ri => {
            newCells[ri] = { ...newCells[ri], isHighlighted: true };
          });
        }

        if (settings.highlightSameNumbers && cells[idx].value !== 0) {
          const val = cells[idx].value;
          newCells.forEach((cell, i) => {
            if (cell.value === val && i !== idx) {
              newCells[i] = { ...newCells[i], isSameNumber: true };
            }
          });
        }

        set({ selectedCell: idx, cells: newCells });
      },

      placeNumber: (num) => {
        const { selectedCell, cells, solution, autoCheck, isNotesMode, isComplete } = get();
        if (selectedCell === null || isComplete) return;
        
        const cell = cells[selectedCell];
        if (cell.given) return;

        if (isNotesMode) {
          get().toggleNote(num);
          return;
        }

        const currentValues = cells.map(c => c.value);
        const newCells = [...cells];
        const isCorrect = solution[selectedCell] === num;
        const isError = !isCorrect && autoCheck;

        if (isError) {
          playSound('wrong');
          set(s => ({
            mistakes: s.mistakes + 1,
            shakingCell: selectedCell,
          }));
          setTimeout(() => set({ shakingCell: null }), 500);
        } else if (isCorrect) {
          playSound('correct');
          set({ correctCell: selectedCell });
          setTimeout(() => set({ correctCell: null }), 300);
        }

        newCells[selectedCell] = {
          ...cell,
          value: num,
          isError,
          notes: new Set(),
        };

        const { settings } = get();
        if (settings.highlightSameNumbers && isCorrect) {
          newCells.forEach((c, i) => {
            if (c.value === num && i !== selectedCell) {
              newCells[i] = { ...c, isSameNumber: true };
            }
          });
        }

        const newUndoStack = [...get().undoStack, currentValues];
        set({ cells: newCells, undoStack: newUndoStack, redoStack: [] });

        const boardValues = newCells.map(c => c.value);
        if (isBoardComplete(boardValues)) {
          const allCorrect = boardValues.every((v, i) => v === solution[i]);
          if (allCorrect) {
            get().handleCompletion();
          }
        }
      },

      toggleNote: (num) => {
        const { selectedCell, cells } = get();
        if (selectedCell === null) return;
        const cell = cells[selectedCell];
        if (cell.given || cell.value !== 0) return;

        playSound('note');
        const newNotes = new Set(cell.notes);
        if (newNotes.has(num)) newNotes.delete(num);
        else newNotes.add(num);

        const newCells = [...cells];
        newCells[selectedCell] = { ...cell, notes: newNotes };
        set({ cells: newCells });
      },

      eraseCell: () => {
        const { selectedCell, cells } = get();
        if (selectedCell === null) return;
        const cell = cells[selectedCell];
        if (cell.given) return;

        playSound('erase');
        const currentValues = cells.map(c => c.value);
        const newCells = [...cells];
        newCells[selectedCell] = { ...cell, value: 0, isError: false, notes: new Set() };
        
        set({ 
          cells: newCells,
          undoStack: [...get().undoStack, currentValues],
          redoStack: [],
        });
      },

      useHint: () => {
        const { cells, solution, selectedCell } = get();
        playSound('hint');

        let hintIdx: number = typeof selectedCell === 'number' ? selectedCell : -1;
        if (hintIdx === -1 || cells[hintIdx].value !== 0) {
          hintIdx = cells.findIndex(c => !c.given && c.value === 0);
        }
        if (hintIdx === -1) return;

        const currentValues = cells.map(c => c.value);
        const newCells = [...cells];
        newCells[hintIdx] = {
          ...newCells[hintIdx],
          value: solution[hintIdx],
          isError: false,
          notes: new Set(),
          given: true,
        };

        set(s => ({
          cells: newCells,
          hintsUsed: s.hintsUsed + 1,
          undoStack: [...s.undoStack, currentValues],
          redoStack: [],
          selectedCell: hintIdx,
        }));

        const boardValues = newCells.map(c => c.value);
        if (isBoardComplete(boardValues)) {
          const allCorrect = boardValues.every((v, i) => v === solution[i]);
          if (allCorrect) get().handleCompletion();
        }
      },

      undo: () => {
        const { undoStack, cells, redoStack } = get();
        if (undoStack.length === 0) return;
        
        const prev = undoStack[undoStack.length - 1];
        const currentValues = cells.map(c => c.value);
        
        const restoredCells = cells.map((c, i) => ({
          ...c,
          value: prev[i],
          isError: false,
        }));

        set({
          cells: restoredCells,
          undoStack: undoStack.slice(0, -1),
          redoStack: [...redoStack, currentValues],
        });
      },

      redo: () => {
        const { redoStack, cells, undoStack } = get();
        if (redoStack.length === 0) return;
        
        const next = redoStack[redoStack.length - 1];
        const currentValues = cells.map(c => c.value);
        
        const restoredCells = cells.map((c, i) => ({
          ...c,
          value: next[i],
        }));

        set({
          cells: restoredCells,
          redoStack: redoStack.slice(0, -1),
          undoStack: [...undoStack, currentValues],
        });
      },

      toggleNotesMode: () => set(s => ({ isNotesMode: !s.isNotesMode })),
      togglePause: () => set(s => ({ isPaused: !s.isPaused })),
      toggleAutoCheck: () => set(s => ({ autoCheck: !s.autoCheck })),
      setPage: (page) => set({ currentPage: page }),
      
      tick: () => {
        const { isPaused, isComplete, startTime } = get();
        if (isPaused || isComplete || !startTime) return;
        set(s => ({ elapsedTime: s.elapsedTime + 1 }));
      },

      handleCompletion: () => {
        const { difficulty, elapsedTime, mistakes, hintsUsed, isDaily, stats, achievements, settings, missions, missionDate } = get();
        
        playSound('complete');
        
        const today = getTodayString();
        const streak = stats.currentStreak;
        const isPerfect = mistakes === 0;
        
        const xpEarned = calculateXP(
          difficulty,
          elapsedTime,
          mistakes,
          hintsUsed,
          streak,
          isDaily,
          isPerfect
        );

        const newStats: PlayerStats = {
          ...stats,
          totalWins: stats.totalWins + 1,
          totalXP: stats.totalXP + xpEarned,
          level: getLevelFromXP(stats.totalXP + xpEarned),
          rank: getRankFromLevel(getLevelFromXP(stats.totalXP + xpEarned)),
          gamesWonByDifficulty: {
            ...stats.gamesWonByDifficulty,
            [difficulty]: (stats.gamesWonByDifficulty[difficulty] || 0) + 1,
          },
          fastestTimes: {
            ...stats.fastestTimes,
            [difficulty]: stats.fastestTimes[difficulty] === 0
              ? elapsedTime
              : Math.min(stats.fastestTimes[difficulty], elapsedTime),
          },
          totalPlayTime: stats.totalPlayTime + elapsedTime,
          hintsUsed: stats.hintsUsed + hintsUsed,
          dailyChallengesCompleted: isDaily
            ? stats.dailyChallengesCompleted + 1
            : stats.dailyChallengesCompleted,
          weeklyXP: stats.weeklyXP + xpEarned,
        };

        const newAchs = checkAchievements(newStats, {
          difficulty,
          isDaily,
          mistakes,
          hintsUsed,
          time: elapsedTime,
        });

        const updatedAchievements = achievements.map(a => {
          const newA = newAchs.find(na => na.id === a.id);
          return newA ? newA : a;
        });

        if (newAchs.length > 0) {
          playSound('achievement');
          newStats.achievements = [...newStats.achievements, ...newAchs.map(a => a.id)];
          newStats.totalXP += newAchs.reduce((sum, a) => sum + a.xpReward, 0);
        }

        let updatedMissions = missions;
        if (missionDate === today) {
          updatedMissions = missions.map(m => {
            if (m.completed) return m;
            if (m.id === 'm1') return { ...m, progress: Math.min(m.progress + 1, m.target), completed: m.progress + 1 >= m.target };
            if (m.id === 'm2' && isPerfect) return { ...m, progress: 1, completed: true };
            if (m.id === 'm3' && difficulty === 'easy' && elapsedTime < 300) return { ...m, progress: 1, completed: true };
            if (m.id === 'm4' && ['hard', 'expert', 'master'].includes(difficulty)) return { ...m, progress: 1, completed: true };
            return m;
          });
        }

        set({
          isComplete: true,
          xpGained: xpEarned,
          lastXP: xpEarned,
          stats: newStats,
          achievements: updatedAchievements,
          newAchievements: newAchs,
          missions: updatedMissions,
        });

        if (settings.soundEnabled) {
          setTimeout(() => playSound('levelUp'), 800);
        }
      },

      updateSettings: (newSettings) => {
        set(s => {
          const merged = { ...s.settings, ...newSettings };
          setSoundEnabled(merged.soundEnabled);
          return { settings: merged };
        });
      },

      dismissNewAchievements: () => set({ newAchievements: [] }),

      addXPPopup: (amount, x, y) => {
        const id = Math.random().toString(36).slice(2);
        set(s => ({ xpPopups: [...s.xpPopups, { id, amount, x, y }] }));
        setTimeout(() => get().removeXPPopup(id), 1600);
      },

      removeXPPopup: (id) => {
        set(s => ({ xpPopups: s.xpPopups.filter(p => p.id !== id) }));
      },

      resetGame: () => {
        set({
          cells: [],
          puzzle: [],
          solution: [],
          selectedCell: null,
          isComplete: false,
          isGameActive: false,
          elapsedTime: 0,
          mistakes: 0,
          hintsUsed: 0,
          undoStack: [],
          redoStack: [],
        });
      },
    }),
    {
      name: 'sudoku-master-v2',
      storage: createJSONStorage(() => localStorage, {
        replacer: (_key, value) => {
          if (_key === 'cells' && Array.isArray(value)) {
            return value.map(serializeCell);
          }
          if (_key === 'undoStack' || _key === 'redoStack') return [];
          if (_key === 'xpPopups' || _key === 'newAchievements') return [];
          if (_key === 'shakingCell' || _key === 'correctCell') return null;
          return value;
        },
        reviver: (_key, value) => {
          if (_key === 'cells' && Array.isArray(value)) {
            return value.map(deserializeCell);
          }
          return value;
        },
      }),
      partialize: (state) => ({
        cells: state.cells,
        puzzle: state.puzzle,
        solution: state.solution,
        difficulty: state.difficulty,
        mode: state.mode,
        elapsedTime: state.elapsedTime,
        mistakes: state.mistakes,
        hintsUsed: state.hintsUsed,
        isComplete: state.isComplete,
        isGameActive: state.isGameActive,
        isNotesMode: state.isNotesMode,
        autoCheck: state.autoCheck,
        isDaily: state.isDaily,
        stats: state.stats,
        settings: state.settings,
        achievements: state.achievements,
        missions: state.missions,
        missionDate: state.missionDate,
        currentPage: state.currentPage,
      }),
    }
  )
);


