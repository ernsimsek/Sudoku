import { Icon } from '../ui/Icon';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';

const DIFFICULTY_COLORS = {
  easy: '#5c8068',
  medium: '#688392',
  hard: '#a58048',
  expert: '#b36357',
  master: '#86738b',
};

export default function NumberPad() {
  const {
    cells,
    selectedCell,
    isComplete,
    difficulty,
    placeNumber,
    eraseCell,
    undo,
    useHint,
    toggleNotesMode,
    isNotesMode,
    hintsUsed,
    undoStack,
  } = useGameStore();

  const accentColor = DIFFICULTY_COLORS[difficulty as keyof typeof DIFFICULTY_COLORS] || '#547563';

  // Count how many of each number have been placed correctly
  const numberCounts = Array.from({ length: 9 }, (_, i) => {
    const num = i + 1;
    const count = cells.filter(c => c.value === num).length;
    return { num, count, complete: count >= 9 };
  });

  const handleNumber = (num: number) => {
    if (isComplete) return;
    placeNumber(num);
  };

  return (
    <div style={{ width: '100%', maxWidth: '360px' }}>
      {/* Number grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(9, 1fr)',
          gap: '6px',
          marginBottom: '12px',
        }}
      >
        {numberCounts.map(({ num, count, complete }) => (
          <motion.button
            key={num}
            className="num-btn"
            onClick={() => handleNumber(num)}
            disabled={complete || isComplete}
            whileHover={!complete && !isComplete ? { scale: 1.08, y: -2 } : {}}
            whileTap={!complete && !isComplete ? { scale: 0.94 } : {}}
            style={{
              opacity: complete ? 0.25 : 1,
              background: complete
                ? 'var(--bg-tertiary)'
                : selectedCell !== null && cells[selectedCell]?.value === num
                  ? `${accentColor}22`
                  : 'var(--bg-card)',
              border: `1px solid ${
                complete
                  ? 'var(--border)'
                  : selectedCell !== null && cells[selectedCell]?.value === num
                    ? `${accentColor}66`
                    : 'var(--border)'
              }`,
              color: complete ? 'var(--text-muted)' : accentColor,
              fontSize: 'clamp(14px, 3vw, 20px)',
              fontWeight: '700',
              borderRadius: '10px',
              cursor: complete || isComplete ? 'default' : 'pointer',
              position: 'relative',
              fontFamily: "'JetBrains Mono', monospace",
            }}
            aria-label={`Place ${num}`}
          >
            {num}
            {/* Count indicator */}
            {count > 0 && count < 9 && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '3px',
                  fontSize: '7px',
                  color: 'var(--text-muted)',
                  lineHeight: 1,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {count}
              </div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Action row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
        }}
      >
        {/* Notes */}
        <motion.button
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={toggleNotesMode}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            padding: '10px 8px',
            borderRadius: '12px',
            border: `1px solid ${isNotesMode ? accentColor : 'var(--border)'}`,
            background: isNotesMode ? `${accentColor}22` : 'var(--bg-card)',
            cursor: 'pointer',
            color: isNotesMode ? accentColor : 'var(--text-secondary)',
            transition: 'all 0.2s ease',
          }}
        >
          <Icon name="notes" size={18} />
          <span style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.02em' }}>Notes</span>
        </motion.button>

        {/* Erase */}
        <motion.button
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={eraseCell}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            padding: '10px 8px',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            background: 'var(--bg-card)',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
          }}
        >
          <Icon name="erase" size={18} />
          <span style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.02em' }}>Erase</span>
        </motion.button>

        {/* Undo */}
        <motion.button
          whileHover={undoStack.length > 0 ? { scale: 1.04, y: -2 } : {}}
          whileTap={undoStack.length > 0 ? { scale: 0.96 } : {}}
          onClick={undo}
          disabled={undoStack.length === 0}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            padding: '10px 8px',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            background: 'var(--bg-card)',
            cursor: undoStack.length === 0 ? 'default' : 'pointer',
            color: undoStack.length === 0 ? 'var(--text-muted)' : 'var(--text-secondary)',
            opacity: undoStack.length === 0 ? 0.4 : 1,
          }}
        >
          <Icon name="undo" size={18} />
          <span style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.02em' }}>Undo</span>
        </motion.button>

        {/* Hint */}
        <motion.button
          whileHover={hintsUsed < 3 ? { scale: 1.04, y: -2 } : {}}
          whileTap={hintsUsed < 3 ? { scale: 0.96 } : {}}
          onClick={useHint}
          disabled={hintsUsed >= 3 || isComplete}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            padding: '10px 8px',
            borderRadius: '12px',
            border: `1px solid ${hintsUsed < 3 ? '#a5804844' : 'var(--border)'}`,
            background: hintsUsed < 3 ? 'rgba(245,158,11,0.08)' : 'var(--bg-card)',
            cursor: hintsUsed >= 3 || isComplete ? 'default' : 'pointer',
            color: hintsUsed < 3 ? '#a58048' : 'var(--text-muted)',
            opacity: hintsUsed >= 3 ? 0.4 : 1,
            position: 'relative',
          }}
        >
          <Icon name="hint" size={18} />
          <span style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.02em' }}>
            {3 - hintsUsed} left
          </span>
        </motion.button>
      </div>
    </div>
  );
}



