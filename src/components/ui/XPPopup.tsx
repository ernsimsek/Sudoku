import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';

export default function XPPopups() {
  const { xpPopups } = useGameStore();

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 200 }}>
      <AnimatePresence>
        {xpPopups.map(popup => (
          <motion.div
            key={popup.id}
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: -60, scale: 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              left: popup.x,
              top: popup.y,
              transform: 'translate(-50%, -50%)',
              fontSize: '16px',
              fontWeight: '800',
              color: '#547563',
              textShadow: '0 2px 8px rgba(84,117,99,0.5)',
              fontFamily: "'JetBrains Mono', monospace",
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            +{popup.amount} XP
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}




