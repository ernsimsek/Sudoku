import { Icon } from './Icon';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';

export default function DailyMissions() {
  const { missions } = useGameStore();
  const completedCount = missions.filter(m => m.completed).length;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '16px',
        width: '100%',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <h3 style={{ fontWeight: '700', fontSize: '14px' }}>Daily Missions</h3>
        <span style={{ fontSize: '12px', color: '#547563', fontWeight: '700' }}>
          {completedCount}/{missions.length}
        </span>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            animate={{ width: `${(completedCount / missions.length) * 100}%` }}
            transition={{ duration: 0.5 }}
            style={{ background: '#547563' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {missions.map(mission => (
          <div
            key={mission.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px',
              borderRadius: '10px',
              background: mission.completed ? 'rgba(16,185,129,0.08)' : 'var(--bg-secondary)',
              border: `1px solid ${mission.completed ? 'rgba(16,185,129,0.2)' : 'var(--border)'}`,
            }}
          >
            <div style={{ fontSize: '18px' }}><span className="icon-chip"><Icon name={mission.id} size={21} /></span></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '12px',
                fontWeight: '600',
                color: mission.completed ? '#5c8068' : 'var(--text-primary)',
                marginBottom: '1px',
                textDecoration: mission.completed ? 'line-through' : 'none',
                opacity: mission.completed ? 0.7 : 1,
              }}>
                {mission.title}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                +{mission.xpReward} XP
              </div>
            </div>
            {mission.completed ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{
                  width: '20px', height: '20px', borderRadius: '50%',
                  background: '#5c8068', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '10px', color: 'white', flexShrink: 0,
                }}
              >
                <Icon name="check" />
              </motion.div>
            ) : (
              <div style={{
                fontSize: '11px',
                color: 'var(--text-muted)',
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: '600',
                flexShrink: 0,
              }}>
                {mission.progress}/{mission.target}
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}




