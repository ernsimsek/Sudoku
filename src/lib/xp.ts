import type { Difficulty, RankTier } from '../types';

export const XP_CONFIG = {
  baseXP: {
    easy: 50,
    medium: 100,
    hard: 200,
    expert: 350,
    master: 500,
  },
  timeBonus: {
    easy: 600,    // seconds for max bonus
    medium: 900,
    hard: 1500,
    expert: 2400,
    master: 3600,
  },
  mistakePenalty: 20,
  hintPenalty: 30,
  streakMultiplier: 0.1, // 10% per streak day
  perfectBonus: 100,     // no mistakes
  zenBonus: 50,
  speedrunBonus: 150,
  dailyBonus: 200,
};

export function calculateXP(
  difficulty: Difficulty,
  timeSeconds: number,
  mistakes: number,
  hintsUsed: number,
  streak: number,
  isDaily: boolean,
  isPerfect: boolean
): number {
  const base = XP_CONFIG.baseXP[difficulty];
  const timeLimit = XP_CONFIG.timeBonus[difficulty];

  // Time bonus (0-100% of base)
  const timeRatio = Math.max(0, 1 - timeSeconds / timeLimit);
  const timeBonus = Math.floor(base * timeRatio * 0.5);

  // Penalties
  const mistakeCost = mistakes * XP_CONFIG.mistakePenalty;
  const hintCost = hintsUsed * XP_CONFIG.hintPenalty;

  // Streak multiplier
  const streakMult = 1 + Math.min(streak, 30) * XP_CONFIG.streakMultiplier;

  // Bonuses
  const perfectBonusXP = isPerfect ? XP_CONFIG.perfectBonus : 0;
  const dailyBonusXP = isDaily ? XP_CONFIG.dailyBonus : 0;

  const total = Math.max(
    10, // minimum XP
    Math.floor((base + timeBonus + perfectBonusXP + dailyBonusXP - mistakeCost - hintCost) * streakMult)
  );

  return total;
}

export function getLevelFromXP(xp: number): number {
  // Level curve: each level requires ~15% more XP
  let level = 1;
  let threshold = 100;
  let totalXP = 0;
  
  while (totalXP + threshold <= xp) {
    totalXP += threshold;
    level++;
    threshold = Math.floor(threshold * 1.15);
  }
  
  return level;
}

export function getXPForNextLevel(currentXP: number): { current: number; needed: number; level: number } {
  let level = 1;
  let threshold = 100;
  let totalXP = 0;

  while (totalXP + threshold <= currentXP) {
    totalXP += threshold;
    level++;
    threshold = Math.floor(threshold * 1.15);
  }

  return {
    current: currentXP - totalXP,
    needed: threshold,
    level,
  };
}

export function getRankFromRating(rating: number): RankTier {
  if (rating < 800) return 'bronze';
  if (rating < 1200) return 'silver';
  if (rating < 1600) return 'gold';
  if (rating < 2000) return 'platinum';
  if (rating < 2500) return 'diamond';
  return 'master';
}

export function getRankFromLevel(level: number): RankTier {
  if (level < 5) return 'bronze';
  if (level < 15) return 'silver';
  if (level < 30) return 'gold';
  if (level < 50) return 'platinum';
  if (level < 80) return 'diamond';
  return 'master';
}

export const RANK_LABELS: Record<RankTier, string> = {
  bronze: 'Bronze',
  silver: 'Silver',
  gold: 'Gold',
  platinum: 'Platinum',
  diamond: 'Diamond',
  master: 'Master',
};

export const RANK_COLORS: Record<RankTier, string> = {
  bronze: '#cd7f32',
  silver: '#c0c0c0',
  gold: '#ffd700',
  platinum: '#e5e4e2',
  diamond: '#b9f2ff',
  master: '#86738b',
};

export function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m < 60) return `${m}:${s.toString().padStart(2, '0')}`;
  const h = Math.floor(m / 60);
  return `${h}:${(m % 60).toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

