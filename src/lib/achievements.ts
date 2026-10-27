import type { Achievement, PlayerStats } from '../types';

export const ALL_ACHIEVEMENTS: Achievement[] = [
  // Beginner
  { id: 'first_win', title: 'First Victory', description: 'Complete your first puzzle', icon: "win", xpReward: 50, unlocked: false, rarity: 'common' },
  { id: 'easy_master', title: 'Easy Rider', description: 'Complete 10 Easy puzzles', icon: "easy", xpReward: 100, unlocked: false, rarity: 'common' },
  { id: 'no_mistakes', title: 'Perfectionist', description: 'Complete a puzzle with no mistakes', icon: "perfect", xpReward: 150, unlocked: false, rarity: 'rare' },
  { id: 'speed_demon', title: 'Speed Demon', description: 'Complete Easy puzzle under 3 minutes', icon: "speed", xpReward: 200, unlocked: false, rarity: 'rare' },
  
  // Streak
  { id: 'streak_3', title: 'On a Roll', description: 'Play 3 days in a row', icon: "streak", xpReward: 100, unlocked: false, rarity: 'common' },
  { id: 'streak_7', title: 'Week Warrior', description: 'Play 7 days in a row', icon: "streak", xpReward: 250, unlocked: false, rarity: 'rare' },
  { id: 'streak_30', title: 'Month Master', description: 'Play 30 days in a row', icon: "streak", xpReward: 1000, unlocked: false, rarity: 'legendary' },
  { id: 'streak_100', title: 'Century Streak', description: 'Play 100 days in a row', icon: "xp", xpReward: 5000, unlocked: false, rarity: 'legendary' },
  
  // Difficulty
  { id: 'hard_first', title: 'Challenge Accepted', description: 'Complete your first Hard puzzle', icon: "hint", xpReward: 200, unlocked: false, rarity: 'rare' },
  { id: 'expert_first', title: 'Expert Mind', description: 'Complete your first Expert puzzle', icon: "mind", xpReward: 350, unlocked: false, rarity: 'epic' },
  { id: 'master_first', title: 'Grand Master', description: 'Complete your first Master puzzle', icon: "master", xpReward: 500, unlocked: false, rarity: 'legendary' },
  { id: 'master_10', title: 'Puzzle Legend', description: 'Complete 10 Master puzzles', icon: "xp", xpReward: 2000, unlocked: false, rarity: 'legendary' },
  
  // Daily
  { id: 'daily_first', title: 'Daily Devotee', description: 'Complete your first Daily Challenge', icon: "daily", xpReward: 100, unlocked: false, rarity: 'common' },
  { id: 'daily_7', title: 'Weekly Champion', description: 'Complete 7 Daily Challenges', icon: "win", xpReward: 500, unlocked: false, rarity: 'rare' },
  { id: 'daily_30', title: 'Monthly Maestro', description: 'Complete 30 Daily Challenges', icon: "gold", xpReward: 2000, unlocked: false, rarity: 'epic' },
  
  // Volume
  { id: 'games_10', title: 'Getting Started', description: 'Play 10 games', icon: "play", xpReward: 100, unlocked: false, rarity: 'common' },
  { id: 'games_50', title: 'Dedicated Player', description: 'Play 50 games', icon: "play", xpReward: 300, unlocked: false, rarity: 'rare' },
  { id: 'games_100', title: 'Century Club', description: 'Play 100 games', icon: "play", xpReward: 750, unlocked: false, rarity: 'epic' },
  { id: 'games_500', title: 'Sudoku Addict', description: 'Play 500 games', icon: "play", xpReward: 3000, unlocked: false, rarity: 'legendary' },
  
  // XP
  { id: 'xp_1000', title: 'Rising Star', description: 'Earn 1,000 XP', icon: "xp", xpReward: 50, unlocked: false, rarity: 'common' },
  { id: 'xp_10000', title: 'Veteran', description: 'Earn 10,000 XP', icon: "xp", xpReward: 200, unlocked: false, rarity: 'rare' },
  { id: 'xp_100000', title: 'Elite', description: 'Earn 100,000 XP', icon: "xp", xpReward: 1000, unlocked: false, rarity: 'legendary' },
  
  // Special
  { id: 'no_hints', title: 'Purist', description: 'Complete 10 puzzles with no hints', icon: "purist", xpReward: 500, unlocked: false, rarity: 'epic' },
  { id: 'speedrun_sub2', title: 'Lightning Fast', description: 'Complete a Medium puzzle under 2 minutes', icon: "speed", xpReward: 400, unlocked: false, rarity: 'epic' },
  { id: 'comeback', title: 'Comeback Kid', description: 'Win after using all 3 hints', icon: "undo", xpReward: 150, unlocked: false, rarity: 'rare' },
  { id: 'night_owl', title: 'Night Owl', description: 'Complete a puzzle after midnight', icon: "night", xpReward: 100, unlocked: false, rarity: 'rare' },
];

export function checkAchievements(stats: PlayerStats, newlyCompleted: {
  difficulty?: string;
  isDaily?: boolean;
  mistakes?: number;
  hintsUsed?: number;
  time?: number;
}): Achievement[] {
  const newAchievements: Achievement[] = [];
  const alreadyUnlocked = new Set(stats.achievements);

  function check(id: string, condition: boolean): void {
    if (!alreadyUnlocked.has(id) && condition) {
      const ach = ALL_ACHIEVEMENTS.find(a => a.id === id);
      if (ach) newAchievements.push({ ...ach, unlocked: true, unlockedDate: new Date().toISOString() });
    }
  }

  check('first_win', stats.totalWins >= 1);
  check('easy_master', (stats.gamesWonByDifficulty['easy'] || 0) >= 10);
  check('no_mistakes', newlyCompleted.mistakes === 0 && stats.totalWins >= 1);
  check('speed_demon', newlyCompleted.difficulty === 'easy' && (newlyCompleted.time || 999) < 180);
  
  check('streak_3', stats.currentStreak >= 3);
  check('streak_7', stats.currentStreak >= 7);
  check('streak_30', stats.currentStreak >= 30);
  check('streak_100', stats.currentStreak >= 100);
  
  check('hard_first', (stats.gamesWonByDifficulty['hard'] || 0) >= 1);
  check('expert_first', (stats.gamesWonByDifficulty['expert'] || 0) >= 1);
  check('master_first', (stats.gamesWonByDifficulty['master'] || 0) >= 1);
  check('master_10', (stats.gamesWonByDifficulty['master'] || 0) >= 10);
  
  check('daily_first', stats.dailyChallengesCompleted >= 1);
  check('daily_7', stats.dailyChallengesCompleted >= 7);
  check('daily_30', stats.dailyChallengesCompleted >= 30);
  
  check('games_10', stats.totalGames >= 10);
  check('games_50', stats.totalGames >= 50);
  check('games_100', stats.totalGames >= 100);
  check('games_500', stats.totalGames >= 500);
  
  check('xp_1000', stats.totalXP >= 1000);
  check('xp_10000', stats.totalXP >= 10000);
  check('xp_100000', stats.totalXP >= 100000);
  
  check('speedrun_sub2', newlyCompleted.difficulty === 'medium' && (newlyCompleted.time || 999) < 120);
  check('comeback', (newlyCompleted.hintsUsed || 0) >= 3 && stats.totalWins >= 1);
  
  const hour = new Date().getHours();
  check('night_owl', hour >= 0 && hour < 5);

  return newAchievements;
}

export const RARITY_COLORS = {
  common: '#6b7280',
  rare: '#688392',
  epic: '#86738b',
  legendary: '#a58048',
};

export const RARITY_BG = {
  common: 'rgba(107,114,128,0.1)',
  rare: 'rgba(59,130,246,0.1)',
  epic: 'rgba(168,85,247,0.1)',
  legendary: 'rgba(245,158,11,0.1)',
};

