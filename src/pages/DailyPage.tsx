import { Icon, GridAvatar } from '../components/ui/Icon';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { formatTime } from '../lib/xp';

// Simulated leaderboard data for daily
const MOCK_LEADERBOARD = [
  { rank: 1, name: 'SudokuMaster99', time: 234, xp: 450 },
  { rank: 2, name: 'PuzzleKing', time: 287, xp: 420 },
  { rank: 3, name: 'LogicPro', time: 312, xp: 390 },
  { rank: 4, name: 'GridGenius', time: 356, xp: 360 },
  { rank: 5, name: 'NumberNinja', time: 401, xp: 330 },
  { rank: 6, name: 'ThinkTank', time: 445, xp: 300 },
  { rank: 7, name: 'BrainStorm', time: 489, xp: 270 },
  { rank: 8, name: 'CellSolver', time: 523, xp: 240 },
];

export default function DailyPage() {
  const { startGame, setPage, stats, isComplete, isDaily } = useGameStore();
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const todayKey = today.toISOString().split('T')[0];
  const alreadyCompleted = isComplete && isDaily;

  // Time remaining until next daily
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const secondsLeft = Math.floor((midnight.getTime() - now.getTime()) / 1000);
  const hoursLeft = Math.floor(secondsLeft / 3600);
  const minutesLeft = Math.floor((secondsLeft % 3600) / 60);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: 'clamp(16px, 4vw, 32px)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <motion.button whileHover={{ scale: 1.05, x: -2 }} whileTap={{ scale: 0.96 }}
            onClick={() => setPage('landing')}
            style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-card)', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Icon name="back" /> Back
          </motion.button>
          <div>
            <h1 style={{ fontSize: 'clamp(18px, 4vw, 26px)', fontWeight: '800' }}>Daily Challenge</h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{dateStr}</p>
          </div>
        </div>

        {/* Main challenge card */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          style={{ marginBottom: '24px' }}>
          <div style={{
            background: 'var(--bg-tertiary)',
            border: '1px solid rgba(84,117,99,0.4)', borderRadius: '24px',
            padding: 'clamp(24px, 4vw, 40px)', textAlign: 'center',
          }}>
            <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              style={{ fontSize: '64px', marginBottom: '16px', display: 'inline-block' }}>
              <Icon name="daily" />
            </motion.div>

            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: 'rgba(84,117,99,0.2)', padding: '4px 12px', borderRadius: '20px',
              fontSize: '11px', fontWeight: '700', color: '#547563', letterSpacing: '0.08em', marginBottom: '16px',
            }}>
              #{todayKey.replace(/-/g, '')} • MEDIUM DIFFICULTY
            </div>

            <h2 style={{ fontSize: 'clamp(20px, 4vw, 32px)', fontWeight: '900', marginBottom: '12px' }}>
              {alreadyCompleted ? <><Icon name="win" /> Completed!</> : "Today's Challenge"}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '24px', lineHeight: '1.6' }}>
              {alreadyCompleted
                ? 'You\'ve already completed today\'s puzzle. Come back tomorrow!'
                : 'Everyone plays the same puzzle today. Can you beat the leaderboard?'}
            </p>

            {/* Rewards */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '28px', flexWrap: 'wrap' }}>
              {[
                { icon: "xp", label: '+200 Bonus XP', color: '#a58048' },
                { icon: "streak", label: 'Streak +1', color: '#b36357' },
                { icon: "global", label: 'Global Rank', color: '#688392' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '10px 16px' }}>
                  <span style={{ fontSize: '20px' }}><Icon name={item.icon} /></span>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: item.color }}>{item.label}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            {alreadyCompleted ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#5c8068' }}><Icon name="check" /> Complete</div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  Next puzzle in <strong style={{ color: 'var(--text-primary)' }}>{hoursLeft}h {minutesLeft}m</strong>
                </div>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  onClick={() => startGame('medium')}
                  style={{ padding: '12px 28px', borderRadius: '12px', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
                  Play Random Medium <Icon name="next" />
                </motion.button>
              </div>
            ) : (
              <motion.button whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                onClick={() => startGame('medium', 'classic', true)}
                style={{
                  padding: '16px 48px', borderRadius: '16px',
                  background: '#547563', border: 'none',
                  color: 'white', fontSize: '16px', fontWeight: '700', cursor: 'pointer',
                  boxShadow: 'none',
                }}>
                Start Daily Challenge <Icon name="next" />
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
          {[
            { icon: "win", label: 'Your Best Streak', value: `${stats.longestStreak} days` },
            { icon: "daily", label: 'Daily Completed', value: stats.dailyChallengesCompleted.toString() },
            { icon: "time", label: 'Next Puzzle', value: `${hoursLeft}h ${minutesLeft}m` },
          ].map(stat => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '22px', marginBottom: '6px' }}><Icon name={stat.icon} /></div>
              <div style={{ fontSize: 'clamp(14px, 2.5vw, 18px)', fontWeight: '700', marginBottom: '4px', fontFamily: "'JetBrains Mono', monospace" }}>{stat.value}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Leaderboard */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', overflow: 'hidden' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontWeight: '700', fontSize: '16px' }}>Today's Leaderboard</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>Top solvers for today's puzzle</p>
            </div>
            {MOCK_LEADERBOARD.map((entry, i) => (
              <motion.div key={entry.rank}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + i * 0.04 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '16px',
                  padding: '14px 20px', borderBottom: i < MOCK_LEADERBOARD.length - 1 ? '1px solid var(--border)' : 'none',
                  background: i === 0 ? 'rgba(255,215,0,0.05)' : i === 1 ? 'rgba(192,192,192,0.05)' : i === 2 ? 'rgba(205,127,50,0.05)' : 'transparent',
                }}>
                {/* Rank */}
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', fontWeight: '800', fontFamily: "'JetBrains Mono', monospace",
                  background: i === 0 ? '#ffd700' : i === 1 ? '#c0c0c0' : i === 2 ? '#cd7f32' : 'var(--bg-secondary)',
                  color: i < 3 ? '#000' : 'var(--text-secondary)',
                }}>
                  {entry.rank}
                </div>
                {/* Avatar */}
                <div style={{ fontSize: '24px' }}><GridAvatar seed={entry.name} /></div>
                {/* Name */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', fontSize: '14px' }}>{entry.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>+{entry.xp} XP earned</div>
                </div>
                {/* Time */}
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: '700', fontSize: '15px', color: i === 0 ? '#ffd700' : 'var(--text-primary)' }}>
                  {formatTime(entry.time)}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}



