import { Icon } from './Icon';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { RARITY_COLORS, RARITY_BG } from '../../lib/achievements';

export default function AchievementToast() {
  const { newAchievements, dismissNewAchievements } = useGameStore();

  return (
    <div style={{
      position: 'fixed', top: '20px', right: '20px',
      zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '10px',
      pointerEvents: newAchievements.length > 0 ? 'auto' : 'none',
    }}>
      <AnimatePresence>
        {newAchievements.map((ach, i) => (
          <motion.div
            key={ach.id}
            initial={{ opacity: 0, x: 80, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25, delay: i * 0.1 }}
            onClick={dismissNewAchievements}
            style={{
              background: RARITY_BG[ach.rarity],
              border: `1px solid ${RARITY_COLORS[ach.rarity]}55`,
              borderRadius: '16px', padding: '14px 18px',
              display: 'flex', alignItems: 'center', gap: '12px',
              cursor: 'pointer', maxWidth: '320px',
              backdropFilter: 'blur(20px)',
              boxShadow: 'none',
            }}
          >
            {/* Animated badge */}
            <motion.div
              animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{ fontSize: '32px', flexShrink: 0 }}
            >
              <Icon name={ach.id} />
            </motion.div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: RARITY_COLORS[ach.rarity], letterSpacing: '0.1em', marginBottom: '2px', textTransform: 'uppercase' }}>
                Achievement Unlocked • {ach.rarity}
              </div>
              <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)', marginBottom: '2px' }}>
                {ach.title}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                {ach.description}
              </div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#547563' }}>
                +{ach.xpReward} XP
              </div>
            </div>
            {/* Shimmer overlay */}
            <motion.div
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 1.5, delay: 0.3 }}
              style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                borderRadius: '16px', pointerEvents: 'none',
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}




