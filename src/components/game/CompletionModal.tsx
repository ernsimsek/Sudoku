import { Icon } from '../ui/Icon';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { formatTime, getXPForNextLevel } from '../../lib/xp';

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

export default function CompletionModal() {
  const {
    isComplete,
    difficulty,
    elapsedTime,
    mistakes,
    hintsUsed,
    xpGained,
    stats,
    startGame,
    setPage,
    isDaily,
  } = useGameStore();

  if (!isComplete) return null;

  const accentColor = DIFFICULTY_COLORS[difficulty] || '#547563';
  const isPerfect = mistakes === 0 && hintsUsed === 0;
  const xpInfo = getXPForNextLevel(stats.totalXP);

  const rating = isPerfect ? 3 : mistakes <= 1 ? 2 : 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px',
        }}
      >
        {/* Confetti */}
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'fixed',
              width: `${4 + Math.random() * 8}px`,
              height: `${4 + Math.random() * 8}px`,
              borderRadius: Math.random() > 0.5 ? '50%' : '0%',
              background: [
                '#547563', '#708875', '#b78372', '#5c8068',
                '#a58048', '#688392', '#b36357', '#86738b', '#ffd700',
              ][i % 9],
              left: `${Math.random() * 100}%`,
              top: '-20px',
              zIndex: 99,
            }}
            animate={{
              y: ['0vh', '110vh'],
              x: [(Math.random() - 0.5) * 200],
              rotate: [0, Math.random() * 720],
              opacity: [1, 0.8, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              delay: Math.random() * 0.8,
              ease: 'easeIn',
            }}
          />
        ))}

        <motion.div
          className="completion-card"
          style={{
            background: 'var(--bg-card)',
            border: `2px solid ${accentColor}44`,
            borderRadius: '24px',
            padding: 'clamp(24px, 5vw, 40px)',
            maxWidth: '420px',
            width: '100%',
            boxShadow: 'none',
            textAlign: 'center',
          }}
        >
          {/* Stars */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2 + i * 0.15, type: 'spring', stiffness: 300 }}
                style={{ fontSize: '32px', filter: i < rating ? 'none' : 'grayscale(1) opacity(0.3)' }}
              >
                <Icon name="xp" />
              </motion.div>
            ))}
          </div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              fontSize: 'clamp(22px, 5vw, 32px)',
              fontWeight: '800',
              marginBottom: '6px',
              background: `linear-gradient(135deg, ${accentColor}, #86738b)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {isPerfect ? <><Icon name="win" /> Perfect!</> : 'Puzzle Complete!'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '14px' }}
          >
            {isDaily ? <><Icon name="daily" /> Daily Challenge Complete</> : `${DIFFICULTY_LABELS[difficulty]} puzzle solved`}
          </motion.p>

          {/* Stats grid */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              marginBottom: '20px',
            }}
          >
            {[
              { label: 'Time', value: formatTime(elapsedTime), icon: "time" },
              { label: 'Errors', value: mistakes.toString(), icon: "error", warn: mistakes > 0 },
              { label: 'Hints', value: hintsUsed.toString(), icon: "hint", warn: hintsUsed > 0 },
            ].map(stat => (
              <div
                key={stat.label}
                style={{
                  background: stat.warn ? 'rgba(179,99,87,0.08)' : 'var(--bg-secondary)',
                  borderRadius: '12px',
                  padding: '12px 8px',
                  border: `1px solid ${stat.warn ? 'rgba(179,99,87,0.2)' : 'var(--border)'}`,
                }}
              >
                <div style={{ fontSize: '20px', marginBottom: '4px' }}><Icon name={stat.icon} /></div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: stat.warn ? '#b36357' : 'var(--text-primary)',
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', fontWeight: '600' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* XP gained */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: 'spring' }}
            style={{
              background: 'rgba(84,117,99,0.1)',
              border: '1px solid rgba(84,117,99,0.3)',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '20px',
            }}
          >
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: '600' }}>
              <Icon name="perfect" /> XP EARNED
            </div>
            <div style={{
              fontSize: '36px',
              fontWeight: '900',
              color: '#547563',
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: '-0.02em',
            }}>
              +{xpGained}
            </div>

            {/* XP Progress bar */}
            <div style={{ marginTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                <span>Level {xpInfo.level}</span>
                <span>{xpInfo.current} / {xpInfo.needed} XP</span>
              </div>
              <div className="progress-bar">
                <motion.div
                  className="progress-fill"
                  initial={{ width: `${Math.max(0, ((xpInfo.current - xpGained) / xpInfo.needed) * 100)}%` }}
                  animate={{ width: `${(xpInfo.current / xpInfo.needed) * 100}%` }}
                  transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
                  style={{ background: '#547563' }}
                />
              </div>
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            style={{ display: 'flex', gap: '10px' }}
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setPage('landing')}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '12px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              Menu
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => startGame(difficulty, 'classic', false)}
              style={{
                flex: 2,
                padding: '12px',
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${accentColor}, #547563)`,
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '700',
                boxShadow: 'none',
              }}
            >
              Play Again
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}



