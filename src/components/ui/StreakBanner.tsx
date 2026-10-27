import { Icon } from './Icon';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';

export default function StreakBanner() {
  const { stats } = useGameStore();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show streak banner when streak is notable
    if (stats.currentStreak >= 3) {
      const timer = setTimeout(() => setShow(true), 1000);
      const hideTimer = setTimeout(() => setShow(false), 5000);
      return () => {
        clearTimeout(timer);
        clearTimeout(hideTimer);
      };
    }
  }, [stats.currentStreak]);

  if (stats.currentStreak < 3) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -60 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 500,
            background: 'var(--bg-tertiary)',
            border: '1px solid rgba(245,158,11,0.5)',
            borderRadius: '20px',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backdropFilter: 'blur(20px)',
            boxShadow: 'none',
            color: 'white',
            whiteSpace: 'nowrap',
          }}
        >
          <motion.span
            animate={{ rotate: [-10, 10, -10] }}
            transition={{ duration: 0.5, repeat: 3 }}
            style={{ fontSize: '24px' }}
          >
            <Icon name="streak" />
          </motion.span>
          <div>
            <div style={{ fontWeight: '800', fontSize: '15px' }}>
              {stats.currentStreak} Day Streak!
            </div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>
              Keep it up — you're on fire!
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => setShow(false)}
            aria-label="Dismiss streak notification"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white', fontSize: '18px', padding: '0 4px', opacity: 0.8 }}
          >
            <Icon name="close" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}




