export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert' | 'master';

export type GameMode = 'classic' | 'zen' | 'speedrun' | 'competitive';

export type Theme = 'dark' | 'light' | 'midnight' | 'aurora' | 'sunset';

export type RankTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master';

export interface Cell {
  value: number;          // 0 = empty
  given: boolean;         // is it a pre-filled cell
  notes: Set<number>;     // pencil marks
  isError: boolean;
  isHighlighted: boolean;
  isSameNumber: boolean;
  isSelected: boolean;
}

export interface SudokuBoard {
  cells: Cell[];           // 81 cells, row-major
  solution: number[];      // 81 numbers
  puzzle: number[];        // original puzzle
}

export interface GameState {
  board: SudokuBoard | null;
  selectedCell: number | null;   // index 0-80
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
  undoStack: Cell[][];
  redoStack: Cell[][];
  streak: number;
  lastPlayedDate: string;
  xpGained: number;
  dailyPuzzleDate: string | null;
}

export interface PlayerStats {
  totalGames: number;
  totalWins: number;
  totalXP: number;
  level: number;
  rank: RankTier;
  skillRating: number;
  currentStreak: number;
  longestStreak: number;
  lastPlayedDate: string;
  fastestTimes: Record<Difficulty, number>;   // in seconds
  averageTimes: Record<Difficulty, number>;
  gamesWonByDifficulty: Record<Difficulty, number>;
  totalPlayTime: number;   // seconds
  mistakeRate: number;
  hintsUsed: number;
  dailyChallengesCompleted: number;
  achievements: string[];
  weeklyXP: number;
  weeklyStart: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  unlocked: boolean;
  unlockedDate?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface DailyChallenge {
  date: string;
  puzzle: number[];
  solution: number[];
  difficulty: Difficulty;
  completedBy: number;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar: string;
  time: number;
  difficulty: Difficulty;
  date: string;
  xp: number;
  rankTier: RankTier;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  target: number;
  xpReward: number;
  completed: boolean;
}

export interface Settings {
  theme: Theme;
  soundEnabled: boolean;
  animationsEnabled: boolean;
  autoCheck: boolean;
  highlightPeers: boolean;
  highlightSameNumbers: boolean;
  showTimer: boolean;
  colorblindMode: boolean;
  highContrast: boolean;
  preferredDifficulty: Difficulty;
  preferredMode: GameMode;
  zenMode: boolean;
  hapticFeedback: boolean;
}

export interface XPPopup {
  id: string;
  amount: number;
  x: number;
  y: number;
}

