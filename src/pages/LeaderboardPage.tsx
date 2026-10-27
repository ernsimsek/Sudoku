import { Icon, GridAvatar } from '../components/ui/Icon';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { formatTime, RANK_LABELS, RANK_COLORS } from '../lib/xp';
import type { RankTier } from '../types';

type TabType = 'global' | 'daily' | 'weekly';

const GLOBAL_DATA = [
  { rank: 1, name: 'NeuronNexus', time: 89, wins: 1247, xp: 87650, rankTier: 'master' as RankTier },
  { rank: 2, name: 'SudokuSage', time: 95, wins: 1102, xp: 79200, rankTier: 'master' as RankTier },
  { rank: 3, name: 'GridGuru', time: 112, wins: 998, xp: 72100, rankTier: 'diamond' as RankTier },
  { rank: 4, name: 'LogicLegend', time: 124, wins: 876, xp: 65400, rankTier: 'diamond' as RankTier },
  { rank: 5, name: 'PuzzlePro', time: 138, wins: 754, xp: 58700, rankTier: 'platinum' as RankTier },
  { rank: 6, name: 'CellSorcerer', time: 145, wins: 698, xp: 52300, rankTier: 'platinum' as RankTier },
  { rank: 7, name: 'NumberNinja', time: 156, wins: 621, xp: 46800, rankTier: 'gold' as RankTier },
  { rank: 8, name: 'ThinkTank99', time: 167, wins: 589, xp: 43200, rankTier: 'gold' as RankTier },
  { rank: 9, name: 'BrainBoss', time: 178, wins: 543, xp: 39600, rankTier: 'gold' as RankTier },
  { rank: 10, name: 'MatrixMind', time: 189, wins: 512, xp: 37100, rankTier: 'silver' as RankTier },
];

const DAILY_DATA = [
  { rank: 1, name: 'SpeedSolver', time: 178, wins: 0, xp: 480, rankTier: 'gold' as RankTier },
  { rank: 2, name: 'QuickFox', time: 203, wins: 0, xp: 450, rankTier: 'platinum' as RankTier },
  { rank: 3, name: 'RapidRook', time: 234, wins: 0, xp: 420, rankTier: 'gold' as RankTier },
  { rank: 4, name: 'FlashMind', time: 267, wins: 0, xp: 390, rankTier: 'silver' as RankTier },
  { rank: 5, name: 'ZapZen', time: 289, wins: 0, xp: 360, rankTier: 'gold' as RankTier },
  { rank: 6, name: 'NimbleNerd', time: 312, wins: 0, xp: 330, rankTier: 'silver' as RankTier },
  { rank: 7, name: 'SwiftStar', time: 334, wins: 0, xp: 300, rankTier: 'bronze' as RankTier },
  { rank: 8, name: 'AgileMind', time: 356, wins: 0, xp: 270, rankTier: 'silver' as RankTier },
];

function getMedalColor(rank: number) {
  if (rank === 1) return '#ffd700';
  if (rank === 2) return '#c0c0c0';
  if (rank === 3) return '#cd7f32';
  return 'transparent';
}

export default function LeaderboardPage() {
  const [tab, setTab] = useState<TabType>('global');
  const { setPage, stats } = useGameStore();

  const data = tab === 'daily' ? DAILY_DATA : GLOBAL_DATA;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: 'clamp(16px, 4vw, 32px)' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <motion.button whileHover={{ scale: 1.05, x: -2 }} whileTap={{ scale: 0.96 }}
            onClick={() => setPage('landing')}
            style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-card)', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Icon name="back" /> Back
          </motion.button>
          <h1 style={{ fontSize: 'clamp(18px, 4vw, 26px)', fontWeight: '800' }}>Leaderboard</h1>
        </div>

        {/* Your rank preview */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          style={{
            background: 'var(--bg-tertiary)',
            border: '1px solid rgba(84,117,99,0.3)', borderRadius: '16px',
            padding: '16px 20px', marginBottom: '20px',
            display: 'flex', alignItems: 'center', gap: '16px',
          }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(84,117,99,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
            <GridAvatar seed="You" size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '700', fontSize: '14px' }}>You</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {RANK_LABELS[stats.rank]} • Level {stats.level} • {stats.totalXP.toLocaleString()} XP
            </div>
          </div>
          <div style={{
            padding: '6px 12px', borderRadius: '20px',
            background: `${RANK_COLORS[stats.rank]}20`,
            border: `1px solid ${RANK_COLORS[stats.rank]}44`,
            color: RANK_COLORS[stats.rank], fontSize: '12px', fontWeight: '700',
          }}>
            {RANK_LABELS[stats.rank]}
          </div>
        </motion.div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {([
            { id: 'global', label: "Global", icon: "global" },
            { id: 'daily', label: "Daily", icon: "daily" },
            { id: 'weekly', label: "Weekly", icon: "stats" },
          ] as const).map(t => (
            <motion.button key={t.id} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => setTab(t.id)}
              style={{
                padding: '9px 18px', borderRadius: '12px', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                border: `1px solid ${tab === t.id ? '#547563' : 'var(--border)'}`,
                background: tab === t.id ? 'rgba(84,117,99,0.15)' : 'var(--bg-card)',
                color: tab === t.id ? '#547563' : 'var(--text-secondary)',
              }}>
              <Icon name={t.icon} size={15} /> {t.label}
            </motion.button>
          ))}
        </div>

        {/* Top 3 podium */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', justifyContent: 'center', marginBottom: '24px' }}>
          {[data[1], data[0], data[2]].map((entry, i) => {
            if (!entry) return null;
            const podiumHeight = i === 1 ? 100 : i === 0 ? 75 : 60;
            const isFirst = i === 1;
            return (
              <motion.div key={entry.rank}
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
                style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: isFirst ? '40px' : '32px', marginBottom: '8px' }}><GridAvatar seed={entry.name} /></div>
                <div style={{ fontWeight: '700', fontSize: isFirst ? '14px' : '12px', marginBottom: '4px', color: 'var(--text-primary)' }}>
                  {entry.name.substring(0, 10)}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontFamily: "'JetBrains Mono', monospace" }}>
                  {formatTime(entry.time)}
                </div>
                <div style={{
                  height: `${podiumHeight}px`, borderRadius: '12px 12px 0 0',
                  background: `linear-gradient(180deg, ${getMedalColor(entry.rank)}, ${getMedalColor(entry.rank)}88)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '20px', fontWeight: '900', color: '#000',
                }}>
                  <Icon name={["gold", "silver", "bronze"][entry.rank - 1]} />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Full list */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
            <div style={{ display: 'flex', fontWeight: '700', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
              <span style={{ width: '50px' }}>RANK</span>
              <span style={{ flex: 1 }}>PLAYER</span>
              <span style={{ width: '80px', textAlign: 'right' }}>
                {tab === 'global' ? 'WINS' : 'TIME'}
              </span>
              <span style={{ width: '70px', textAlign: 'right' }}>XP</span>
            </div>
          </div>

          {data.map((entry, i) => (
            <motion.div key={entry.rank}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.04 }}
              style={{
                display: 'flex', alignItems: 'center', padding: '14px 20px',
                borderBottom: i < data.length - 1 ? '1px solid var(--border)' : 'none',
                background: entry.rank <= 3 ? `${getMedalColor(entry.rank)}08` : 'transparent',
                gap: '12px',
              }}>
              <div style={{
                width: '38px', textAlign: 'center',
                fontSize: '14px', fontWeight: '800', color: entry.rank <= 3 ? getMedalColor(entry.rank) : 'var(--text-muted)',
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                {entry.rank <= 3 ? <Icon name={["gold", "silver", "bronze"][entry.rank - 1]} /> : `#${entry.rank}`}
              </div>
              <div style={{ fontSize: '22px' }}><GridAvatar seed={entry.name} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', fontSize: '14px' }}>{entry.name}</div>
                <div style={{
                  fontSize: '11px', color: RANK_COLORS[entry.rankTier],
                  fontWeight: '600', marginTop: '1px',
                }}>
                  {RANK_LABELS[entry.rankTier]}
                </div>
              </div>
              <div style={{ width: '80px', textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', fontWeight: '700' }}>
                {tab === 'global' ? entry.wins.toLocaleString() : formatTime(entry.time)}
              </div>
              <div style={{ width: '70px', textAlign: 'right', fontSize: '13px', fontWeight: '700', color: '#547563' }}>
                {entry.xp.toLocaleString()}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}



