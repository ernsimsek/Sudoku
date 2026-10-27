import { Icon } from '../ui/Icon';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { formatTime } from '../../lib/xp';

const DIFFICULTY_COLORS = {
  easy: '#5c8068',
  medium: '#688392',
  hard: '#a58048',
  expert: '#b36357',
  master: '#86738b',
};

const DIFFICULTY_LABELS = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  expert: 'Expert',
  master: 'Master',
};

export default function GameHeader() {
  const {
    difficulty,
    elapsedTime,
    mistakes,
    maxMistakes,
    stats,
    isPaused,
    isComplete,
    isNotesMode,
    settings,
    togglePause,
    setPage,
  } = useGameStore();

  const accentColor = DIFFICULTY_COLORS[difficulty] || '#547563';

  return (
    <div style={{ width: '100%', maxWidth: '520px' }}>
      {/* Top row: back + difficulty + pause */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}
      >
        {/* Back button */}
        <motion.button
          whileHover={{ scale: 1.05, x: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setPage('landing')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            borderRadius: '10px',
            border: '1px solid var(--border)',
            background: 'var(--bg-card)',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            fontSize: '13px',
            fontWeight: '500',
          }}
        >
          <Icon name="back" size={16} />
          Menu
        </motion.button>

        {/* Difficulty badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '20px',
            background: `${accentColor}15`,
            border: `1px solid ${accentColor}44`,
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: accentColor,
              boxShadow: 'none',
            }}
          />
          <span style={{ color: accentColor, fontSize: '13px', fontWeight: '700', letterSpacing: '0.05em' }}>
            {DIFFICULTY_LABELS[difficulty]}
          </span>
          {isNotesMode && (
            <span style={{
              background: '#547563',
              color: 'white',
              fontSize: '10px',
              fontWeight: '700',
              padding: '2px 6px',
              borderRadius: '6px',
              letterSpacing: '0.05em',
            }}>
              NOTES
            </span>
          )}
        </div>

        {/* Pause / streak */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          onClick={togglePause}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            borderRadius: '10px',
            border: '1px solid var(--border)',
            background: 'var(--bg-card)',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            fontSize: '13px',
            fontWeight: '500',
          }}
        >
          {isPaused ? (
            <Icon name="play" size={16} />
          ) : (
            <Icon name="pause" size={16} />
          )}
          {isPaused ? 'Resume' : 'Pause'}
        </motion.button>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
        }}
      >
        {/* Timer */}
        {settings.showTimer && (
          <motion.div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '10px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px', letterSpacing: '0.08em', fontWeight: '600' }}>
              TIME
            </div>
            <div style={{
              fontSize: 'clamp(14px, 3vw, 18px)',
              fontWeight: '700',
              color: isPaused ? '#a58048' : isComplete ? '#5c8068' : 'var(--text-primary)',
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: '0.02em',
            }}>
              {isPaused ? <Icon name="pause" /> : formatTime(elapsedTime)}
            </div>
          </motion.div>
        )}

        {/* Mistakes */}
        <motion.div
          style={{
            background: 'var(--bg-card)',
            border: `1px solid ${mistakes > 0 ? '#b3635722' : 'var(--border)'}`,
            borderRadius: '12px',
            padding: '10px',
            textAlign: 'center',
          }}
          animate={mistakes > 0 ? { borderColor: '#b3635733' } : {}}
        >
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px', letterSpacing: '0.08em', fontWeight: '600' }}>
            ERRORS
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
            {Array.from({ length: maxMistakes }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: i < mistakes ? '#b36357' : 'var(--border-strong)',
                  transition: 'background 0.3s ease',
                  boxShadow: i < mistakes ? '0 0 6px #b3635788' : 'none',
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Streak */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '10px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px', letterSpacing: '0.08em', fontWeight: '600' }}>
            STREAK
          </div>
          <div style={{ fontSize: '16px', fontWeight: '700', color: stats.currentStreak > 0 ? '#a58048' : 'var(--text-muted)' }}>
            {stats.currentStreak > 0 ? (
              <span><Icon name="streak" /> {stats.currentStreak}</span>
            ) : (
              <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>0</span>
            )}
          </div>
        </div>

        {/* XP */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '10px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px', letterSpacing: '0.08em', fontWeight: '600' }}>
            LEVEL
          </div>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#547563', fontFamily: "'JetBrains Mono', monospace" }}>
            {stats.level}
          </div>
        </div>
      </div>

      {/* Pause overlay */}
      <AnimatePresence>
        {isPaused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 50,
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-strong)',
                borderRadius: '24px',
                padding: '40px',
                textAlign: 'center',
                maxWidth: '300px',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}><Icon name="pause" /></div>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>Game Paused</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '14px' }}>
                Take a breather. Your progress is saved.
              </p>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={togglePause}
                style={{
                  padding: '12px 32px',
                  borderRadius: '12px',
                  background: accentColor,
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: '700',
                  width: '100%',
                }}
              >
                Continue Playing
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}



