import { Icon } from '../components/ui/Icon';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { RARITY_COLORS, RARITY_BG } from '../lib/achievements';
import { useState } from 'react';

type FilterType = 'all' | 'unlocked' | 'locked' | 'common' | 'rare' | 'epic' | 'legendary';

export default function AchievementsPage() {
  const { achievements, setPage } = useGameStore();
  const [filter, setFilter] = useState<FilterType>('all');

  const filtered = achievements.filter(a => {
    if (filter === 'unlocked') return a.unlocked;
    if (filter === 'locked') return !a.unlocked;
    if (filter === 'common') return a.rarity === 'common';
    if (filter === 'rare') return a.rarity === 'rare';
    if (filter === 'epic') return a.rarity === 'epic';
    if (filter === 'legendary') return a.rarity === 'legendary';
    return true;
  });

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalXPFromAch = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.xpReward, 0);

  const FILTERS: { id: FilterType; label: string; icon?: string; color?: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'unlocked', label: "Unlocked", icon: "check" },
    { id: 'locked', label: "Locked", icon: "locked" },
    { id: 'legendary', label: "Legendary", icon: "xp", color: RARITY_COLORS.legendary },
    { id: 'epic', label: "Epic", icon: "master", color: RARITY_COLORS.epic },
    { id: 'rare', label: "Rare", icon: "collection", color: RARITY_COLORS.rare },
    { id: 'common', label: 'Common', color: RARITY_COLORS.common },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: 'clamp(16px, 4vw, 32px)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <motion.button whileHover={{ scale: 1.05, x: -2 }} whileTap={{ scale: 0.96 }}
            onClick={() => setPage('landing')}
            style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-card)', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Icon name="back" /> Back
          </motion.button>
          <div>
            <h1 style={{ fontSize: 'clamp(18px, 4vw, 26px)', fontWeight: '800' }}>Achievements</h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {unlockedCount}/{achievements.length} unlocked • {totalXPFromAch.toLocaleString()} XP earned
            </p>
          </div>
        </div>

        {/* Progress overview */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', fontWeight: '600' }}>Overall Progress</span>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#547563' }}>
              {Math.round((unlockedCount / achievements.length) * 100)}%
            </span>
          </div>
          <div className="progress-bar" style={{ height: '8px' }}>
            <motion.div className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
              transition={{ delay: 0.3, duration: 1 }}
              style={{ background: 'linear-gradient(90deg, #547563, #708875, #b78372)', height: '8px' }} />
          </div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '12px', flexWrap: 'wrap' }}>
            {(['legendary', 'epic', 'rare', 'common'] as const).map(rarity => {
              const count = achievements.filter(a => a.rarity === rarity && a.unlocked).length;
              const total = achievements.filter(a => a.rarity === rarity).length;
              return (
                <div key={rarity} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: RARITY_COLORS[rarity] }} />
                  <span style={{ color: 'var(--text-muted)', textTransform: 'capitalize' }}>{rarity}</span>
                  <span style={{ color: RARITY_COLORS[rarity], fontWeight: '700' }}>{count}/{total}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '20px' }}>
          {FILTERS.map(f => (
            <motion.button key={f.id} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => setFilter(f.id)}
              style={{
                padding: '7px 14px', borderRadius: '20px', border: `1px solid ${filter === f.id ? (f.color || '#547563') : 'var(--border)'}`,
                background: filter === f.id ? `${f.color || '#547563'}20` : 'var(--bg-card)',
                color: filter === f.id ? (f.color || '#547563') : 'var(--text-secondary)',
                cursor: 'pointer', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap',
              }}>
              {f.icon && <Icon name={f.icon} size={14} />} {f.label}
            </motion.button>
          ))}
        </div>

        {/* Achievement grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
          {filtered.map((ach, i) => (
            <motion.div key={ach.id}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              whileHover={ach.unlocked ? { scale: 1.03, y: -2 } : { scale: 1.01 }}
              style={{
                background: ach.unlocked ? RARITY_BG[ach.rarity] : 'var(--bg-card)',
                border: `1px solid ${ach.unlocked ? RARITY_COLORS[ach.rarity] + '44' : 'var(--border)'}`,
                borderRadius: '16px', padding: '18px',
                opacity: ach.unlocked ? 1 : 0.5,
                filter: ach.unlocked ? 'none' : 'grayscale(0.6)',
                position: 'relative', overflow: 'hidden',
              }}>
              {/* Shimmer for unlocked */}
              {ach.unlocked && (
                <div style={{
                  position: 'absolute', inset: 0,
                  background: `linear-gradient(135deg, ${RARITY_COLORS[ach.rarity]}08, transparent)`,
                  pointerEvents: 'none',
                }} />
              )}

              {/* Rarity indicator */}
              <div style={{
                position: 'absolute', top: '12px', right: '12px',
                width: '8px', height: '8px', borderRadius: '50%',
                background: RARITY_COLORS[ach.rarity],
                boxShadow: 'none',
              }} />

              <div style={{ fontSize: '36px', marginBottom: '10px' }}><Icon name={ach.id} /></div>
              <h4 style={{ fontWeight: '700', fontSize: '14px', marginBottom: '5px', color: ach.unlocked ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                {ach.title}
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '10px' }}>
                {ach.description}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{
                  fontSize: '11px', fontWeight: '700', color: RARITY_COLORS[ach.rarity],
                  textTransform: 'capitalize', letterSpacing: '0.05em',
                }}>
                  {ach.rarity}
                </span>
                <span style={{
                  fontSize: '12px', fontWeight: '700',
                  color: ach.unlocked ? '#547563' : 'var(--text-muted)',
                }}>
                  +{ach.xpReward} XP
                </span>
              </div>
              {ach.unlocked && ach.unlockedDate && (
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '6px' }}>
                  Unlocked {new Date(ach.unlockedDate).toLocaleDateString()}
                </div>
              )}
              {!ach.unlocked && (
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Icon name="locked" /> Not yet unlocked
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}><Icon name="win" /></div>
            <p>No achievements match this filter</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}



