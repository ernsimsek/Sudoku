import React, { useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';

const DIFFICULTY_COLORS = {
  easy: '#5c8068',
  medium: '#688392',
  hard: '#a58048',
  expert: '#b36357',
  master: '#86738b',
};

interface CellProps {
  value: number;
  given: boolean;
  notes: Set<number>;
  isError: boolean;
  isHighlighted: boolean;
  isSameNumber: boolean;
  isSelected: boolean;
  isShaking: boolean;
  isCorrect: boolean;
  onClick: () => void;
  row: number;
  col: number;
  difficulty: string;
}

const SudokuCell = React.memo(({
  value,
  given,
  notes,
  isError,
  isHighlighted,
  isSameNumber,
  isSelected,
  isShaking,
  isCorrect,
  onClick,
  row,
  col,
  difficulty,
}: CellProps) => {
  const accentColor = DIFFICULTY_COLORS[difficulty as keyof typeof DIFFICULTY_COLORS] || '#547563';
  
  const getCellBg = () => {
    if (isSelected) return 'rgba(84,117,99,0.22)';
    if (isError) return 'rgba(179,99,87,0.12)';
    if (isSameNumber) return 'rgba(84,117,99,0.1)';
    if (isHighlighted) return 'rgba(84,117,99,0.05)';
    return 'transparent';
  };

  const getCellBorder = () => {
    if (isSelected) return `inset 0 0 0 2px ${accentColor}`;
    if (isError) return 'inset 0 0 0 1px rgba(179,99,87,0.5)';
    return 'none';
  };

  const boxShadow = [
    getCellBorder(),
    isCorrect ? `0 0 12px ${accentColor}44` : '',
  ].filter(Boolean).join(', ');

  const borderRight = col % 3 === 2 && col !== 8 ? '2px solid var(--border-strong)' : '1px solid var(--border)';
  const borderBottom = row % 3 === 2 && row !== 8 ? '2px solid var(--border-strong)' : '1px solid var(--border)';

  const noteArray = Array.from({ length: 9 }, (_, i) => i + 1);

  return (
    <motion.div
      className="sudoku-cell"
      style={{
        background: getCellBg(),
        boxShadow,
        borderRight,
        borderBottom,
        borderTop: 'none',
        borderLeft: 'none',
        transition: 'background 0.15s ease',
        cursor: given ? 'default' : 'pointer',
      }}
      onClick={onClick}
      animate={isShaking ? { x: [-4, 4, -4, 4, -3, 3, -2, 2, 0] } : {}}
      transition={isShaking ? { duration: 0.4 } : {}}
    >
      {value !== 0 ? (
        <motion.span
          key={`${value}-${isCorrect}`}
          initial={isCorrect ? { scale: 0.6, opacity: 0 } : false}
          animate={isCorrect ? { scale: 1, opacity: 1 } : {}}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          style={{
            fontSize: 'clamp(14px, 3.5vw, 22px)',
            fontWeight: given ? '700' : '500',
            color: isError
              ? '#b36357'
              : given
              ? 'var(--text-primary)'
              : accentColor,
            fontFamily: "'JetBrains Mono', monospace",
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            userSelect: 'none',
          }}
        >
          {value}
        </motion.span>
      ) : notes.size > 0 ? (
        <div className="notes-grid" style={{ padding: 'clamp(1px, 0.4vw, 3px)' }}>
          {noteArray.map(n => (
            <div
              key={n}
              className="note-cell"
              style={{
                color: notes.has(n) ? '#547563' : 'transparent',
                fontSize: 'clamp(6px, 1.2vw, 9px)',
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: '500',
              }}
            >
              {n}
            </div>
          ))}
        </div>
      ) : null}
    </motion.div>
  );
});

SudokuCell.displayName = 'SudokuCell';

export default function SudokuBoard() {
  const {
    cells,
    selectedCell,
    difficulty,
    shakingCell,
    correctCell,
    selectCell,
    isComplete,
  } = useGameStore();

  const boardRef = useRef<HTMLDivElement>(null);

  const handleCellClick = useCallback((idx: number) => {
    selectCell(idx);
  }, [selectCell]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (selectedCell === null) return;
      const row = Math.floor(selectedCell / 9);
      const col = selectedCell % 9;
      
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          if (row > 0) selectCell((row - 1) * 9 + col);
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (row < 8) selectCell((row + 1) * 9 + col);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (col > 0) selectCell(row * 9 + (col - 1));
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (col < 8) selectCell(row * 9 + (col + 1));
          break;
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedCell, selectCell]);

  if (cells.length === 0) return null;

  return (
    <div style={{ position: 'relative' }}>
      {/* Glow effect behind board */}


      <motion.div
        ref={boardRef}
        className="sudoku-board"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{
          position: 'relative',
          zIndex: 1,
          background: 'var(--bg-card)',
          border: `2px solid ${isComplete
            ? DIFFICULTY_COLORS[difficulty as keyof typeof DIFFICULTY_COLORS] || '#547563'
            : 'var(--border-strong)'}`,
          boxShadow: '0 8px 24px rgba(48,56,47,0.08)',
          transition: 'border-color 0.5s ease, box-shadow 0.5s ease',
        }}
      >
        {cells.map((cell, idx) => {
          const row = Math.floor(idx / 9);
          const col = idx % 9;
          return (
            <SudokuCell
              key={idx}
              value={cell.value}
              given={cell.given}
              notes={cell.notes}
              isError={cell.isError}
              isHighlighted={cell.isHighlighted}
              isSameNumber={cell.isSameNumber}
              isSelected={cell.isSelected}
              isShaking={shakingCell === idx}
              isCorrect={correctCell === idx}
              onClick={() => handleCellClick(idx)}
              row={row}
              col={col}
              difficulty={difficulty}
            />
          );
        })}
      </motion.div>

      {/* Completion overlay particles */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              borderRadius: '12px',
              overflow: 'hidden',
              zIndex: 5,
            }}
          >
            {Array.from({ length: 16 }).map((_, i) => (
              <motion.div
                key={i}
                style={{
                  position: 'absolute',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: [
                    '#547563', '#708875', '#b78372', '#5c8068',
                    '#a58048', '#688392', '#b36357', '#86738b',
                  ][i % 8],
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                initial={{ opacity: 1, scale: 0, y: 0 }}
                animate={{
                  opacity: [1, 1, 0],
                  scale: [0, 1.5, 0.5],
                  y: [0, -80 - Math.random() * 60],
                  x: [(Math.random() - 0.5) * 80],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.05,
                  ease: 'easeOut',
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}




