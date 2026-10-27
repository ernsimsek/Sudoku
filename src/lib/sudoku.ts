/**
 * Premium Sudoku Engine
 * - Backtracking generator with unique solution guarantee
 * - Difficulty-based puzzle creation
 * - Smart hint system
 * - Validation
 */

import type { Difficulty } from '../types';

type Board = number[];

// ─── Helpers ────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function cloneBoard(board: Board): Board {
  return [...board];
}

// ─── Validation ─────────────────────────────────────────────────────────────

function isValidPlacement(board: Board, idx: number, num: number): boolean {
  const row = Math.floor(idx / 9);
  const col = idx % 9;
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;

  for (let c = 0; c < 9; c++) {
    if (board[row * 9 + c] === num) return false;
  }
  for (let r = 0; r < 9; r++) {
    if (board[r * 9 + col] === num) return false;
  }
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (board[(boxRow + r) * 9 + (boxCol + c)] === num) return false;
    }
  }
  return true;
}

export function isValidBoard(board: Board): boolean {
  for (let i = 0; i < 81; i++) {
    if (board[i] === 0) return false;
    const val = board[i];
    board[i] = 0;
    const valid = isValidPlacement(board, i, val);
    board[i] = val;
    if (!valid) return false;
  }
  return true;
}

// ─── Solver (backtracking) ───────────────────────────────────────────────────

function findEmpty(board: Board): number {
  // MRV heuristic: find cell with fewest candidates
  let bestIdx = -1;
  let bestCount = 10;

  for (let i = 0; i < 81; i++) {
    if (board[i] === 0) {
      let count = 0;
      for (let n = 1; n <= 9; n++) {
        if (isValidPlacement(board, i, n)) count++;
      }
      if (count < bestCount) {
        bestCount = count;
        bestIdx = i;
        if (count === 1) break; // can't do better
      }
    }
  }
  return bestIdx;
}

export function solve(board: Board, randomize = false): Board | null {
  const b = cloneBoard(board);
  
  function backtrack(): boolean {
    const idx = findEmpty(b);
    if (idx === -1) return true;

    const nums = randomize ? shuffle([1,2,3,4,5,6,7,8,9]) : [1,2,3,4,5,6,7,8,9];
    
    for (const num of nums) {
      if (isValidPlacement(b, idx, num)) {
        b[idx] = num;
        if (backtrack()) return true;
        b[idx] = 0;
      }
    }
    return false;
  }

  return backtrack() ? b : null;
}

// Count solutions (stop at 2 to check uniqueness)
function countSolutions(board: Board, limit = 2): number {
  let count = 0;
  
  function backtrack(): void {
    if (count >= limit) return;
    
    const idx = findEmpty(board);
    if (idx === -1) {
      count++;
      return;
    }

    for (let num = 1; num <= 9; num++) {
      if (isValidPlacement(board, idx, num)) {
        board[idx] = num;
        backtrack();
        board[idx] = 0;
        if (count >= limit) return;
      }
    }
  }

  backtrack();
  return count;
}

// ─── Difficulty Config ───────────────────────────────────────────────────────

const DIFFICULTY_CONFIG: Record<Difficulty, { givens: number; min: number; max: number }> = {
  easy:   { givens: 46, min: 44, max: 50 },
  medium: { givens: 36, min: 33, max: 39 },
  hard:   { givens: 28, min: 26, max: 32 },
  expert: { givens: 24, min: 22, max: 27 },
  master: { givens: 20, min: 17, max: 23 },
};

// ─── Generator ──────────────────────────────────────────────────────────────

export function generatePuzzle(difficulty: Difficulty): { puzzle: number[]; solution: number[] } {
  // 1. Generate a complete solved board
  const emptyBoard: Board = new Array(81).fill(0);
  const solution = solve(emptyBoard, true)!;

  // 2. Remove cells to create puzzle
  const config = DIFFICULTY_CONFIG[difficulty];
  const puzzle = cloneBoard(solution);
  const positions = shuffle(Array.from({ length: 81 }, (_, i) => i));
  
  let removed = 0;
  const target = 81 - config.givens;

  for (const pos of positions) {
    if (removed >= target) break;
    
    const backup = puzzle[pos];
    puzzle[pos] = 0;

    // Check unique solution
    const testBoard = cloneBoard(puzzle);
    const solutions = countSolutions(testBoard, 2);
    
    if (solutions !== 1) {
      puzzle[pos] = backup; // restore
    } else {
      removed++;
    }
  }

  return { puzzle, solution };
}

// ─── Daily Puzzle (seeded) ───────────────────────────────────────────────────

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xFFFFFFFF;
  };
}

function shuffleSeeded<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getDailyPuzzle(dateStr: string): { puzzle: number[]; solution: number[] } {
  const seed = dateStr.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) * 31337;
  const rand = seededRandom(seed);

  // Seeded solver
  const emptyBoard: Board = new Array(81).fill(0);
  
  function solveSeeded(b: Board): boolean {
    const idx = findEmpty(b);
    if (idx === -1) return true;
    const nums = shuffleSeeded([1,2,3,4,5,6,7,8,9], rand);
    for (const num of nums) {
      if (isValidPlacement(b, idx, num)) {
        b[idx] = num;
        if (solveSeeded(b)) return true;
        b[idx] = 0;
      }
    }
    return false;
  }

  solveSeeded(emptyBoard);
  const solution = cloneBoard(emptyBoard);
  const puzzle = cloneBoard(solution);
  
  // Remove cells with seeded positions
  const positions = shuffleSeeded(Array.from({ length: 81 }, (_, i) => i), rand);
  const target = 81 - 32; // medium difficulty
  let removed = 0;

  for (const pos of positions) {
    if (removed >= target) break;
    const backup = puzzle[pos];
    puzzle[pos] = 0;
    const testBoard = cloneBoard(puzzle);
    const sols = countSolutions(testBoard, 2);
    if (sols !== 1) {
      puzzle[pos] = backup;
    } else {
      removed++;
    }
  }

  return { puzzle, solution };
}

// ─── Hint System ─────────────────────────────────────────────────────────────

export function getHint(currentBoard: number[], _solution: number[]): number | null {
  const empties = [];
  for (let i = 0; i < 81; i++) {
    if (currentBoard[i] === 0) empties.push(i);
  }
  if (empties.length === 0) return null;
  const idx = empties[Math.floor(Math.random() * empties.length)];
  return idx;
}

// ─── Cell Relationships ──────────────────────────────────────────────────────

export function getRelatedCells(idx: number): Set<number> {
  const related = new Set<number>();
  const row = Math.floor(idx / 9);
  const col = idx % 9;
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;

  for (let i = 0; i < 9; i++) {
    related.add(row * 9 + i);
    related.add(i * 9 + col);
  }
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      related.add((boxRow + r) * 9 + (boxCol + c));
    }
  }
  related.delete(idx);
  return related;
}

// ─── Candidates ──────────────────────────────────────────────────────────────

export function getCandidates(board: number[], idx: number): number[] {
  if (board[idx] !== 0) return [];
  const candidates = [];
  for (let n = 1; n <= 9; n++) {
    if (isValidPlacement(board, idx, n)) candidates.push(n);
  }
  return candidates;
}

// ─── Verify ──────────────────────────────────────────────────────────────────

export function isBoardComplete(board: number[]): boolean {
  return board.every(v => v !== 0);
}

export function checkCell(board: number[], solution: number[], idx: number): boolean {
  if (board[idx] === 0) return true;
  return board[idx] === solution[idx];
}

