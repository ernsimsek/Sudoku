import { Icon } from '../components/ui/Icon';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { formatTime, RANK_LABELS, RANK_COLORS } from '../lib/xp';

const DIFF_LABELS = { easy: 'Easy', medium: 'Medium', hard: 'Hard', expert: 'Expert', master: 'Master' };
const DIFF_COLORS = { easy: '#5c8068', medium: '#688392', hard: '#a58048', expert: '#b36357', master: '#86738b' };
const DIFFICULTIES = ['easy', 'medium', 'hard', 'expert', 'master'] as const;

function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', ...style }}>
      {children}
    </div>
  );
}

function StatRow({ label, value, icon, color }: { label: string; value: string; icon: string; color?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '18px' }}><Icon name={icon} /></span>
        <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '500' }}>{label}</span>
      </div>
      <span style={{ fontSize: '15px', fontWeight: '700', color: color || 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>
        {value}
      </span>
    </div>
  );
}

export default function StatsPage() {
  const { stats, setPage } = useGameStore();
  const winRate = stats.totalGames > 0 ? Math.round((stats.totalWins / stats.totalGames) * 100) : 0;
  const rankColor = RANK_COLORS[stats.rank];

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
          <h1 style={{ fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: '800' }}>Your Statistics</h1>
        </div>

        {/* Rank card */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          style={{ marginBottom: '20px' }}>
          <Card style={{
            background: `linear-gradient(135deg, ${rankColor}20, ${rankColor}08)`,
            border: `1px solid ${rankColor}44`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: `linear-gradient(135deg, ${rankColor}, ${rankColor}88)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '32px', boxShadow: 'none',
              }}>
                <Icon name={stats.rank === "master" ? "master_rank" : stats.rank} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '0.08em', marginBottom: '4px' }}>CURRENT RANK</div>
                <div style={{ fontSize: '28px', fontWeight: '900', color: rankColor, letterSpacing: '-0.02em' }}>
                  {RANK_LABELS[stats.rank]}
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Level {stats.level} • {stats.totalXP.toLocaleString()} XP
                </div>
              </div>
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <div style={{ fontSize: '32px', fontWeight: '900', color: '#a58048' }}>{stats.currentStreak}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}><Icon name="streak" /> DAY STREAK</div>
              </div>
            </div>
          </Card>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          {/* Overview */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <h3 style={{ fontWeight: '700', marginBottom: '4px', fontSize: '15px' }}>Overview</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>All-time performance</p>
              <StatRow icon="play" label="Total Games" value={stats.totalGames.toString()} />
              <StatRow icon="win" label="Total Wins" value={stats.totalWins.toString()} color="#5c8068" />
              <StatRow icon="stats" label="Win Rate" value={`${winRate}%`} color={winRate >= 70 ? '#5c8068' : winRate >= 50 ? '#688392' : '#a58048'} />
              <StatRow icon="xp" label="Total XP" value={stats.totalXP.toLocaleString()} color="#547563" />
              <StatRow icon="hint" label="Hints Used" value={stats.hintsUsed.toString()} />
              <StatRow icon="daily" label="Daily Challenges" value={stats.dailyChallengesCompleted.toString()} color="#708875" />
            </Card>
          </motion.div>

          {/* Streaks */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Card>
              <h3 style={{ fontWeight: '700', marginBottom: '4px', fontSize: '15px' }}>Streaks & Time</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>Consistency stats</p>
              <StatRow icon="streak" label="Current Streak" value={`${stats.currentStreak} days`} color="#a58048" />
              <StatRow icon="win" label="Longest Streak" value={`${stats.longestStreak} days`} color="#a58048" />
              <StatRow icon="time" label="Total Play Time" value={formatTime(stats.totalPlayTime)} />
              <StatRow icon="daily" label="Last Played" value={stats.lastPlayedDate || 'Never'} />
              <div style={{ marginTop: '16px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>WEEKLY XP</div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#547563', fontFamily: "'JetBrains Mono', monospace" }}>
                  {stats.weeklyXP.toLocaleString()} <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>this week</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Difficulty breakdown */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ marginBottom: '20px' }}>
          <Card>
            <h3 style={{ fontWeight: '700', marginBottom: '4px', fontSize: '15px' }}>Difficulty Breakdown</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Performance by difficulty level</p>
            <div style={{ display: 'grid', gap: '12px' }}>
              {DIFFICULTIES.map(diff => {
                const wins = stats.gamesWonByDifficulty[diff] || 0;
                const fastest = stats.fastestTimes[diff] || 0;
                const color = DIFF_COLORS[diff];
                return (
                  <div key={diff} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '64px', fontSize: '12px', fontWeight: '700', color }}>
                      {DIFF_LABELS[diff]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        <span>{wins} won</span>
                        {fastest > 0 && <span>Best: {formatTime(fastest)}</span>}
                      </div>
                      <div className="progress-bar" style={{ height: '6px' }}>
                        <motion.div
                          className="progress-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, wins * 5)}%` }}
                          transition={{ delay: 0.5, duration: 0.8 }}
                          style={{ background: color, height: '6px' }}
                        />
                      </div>
                    </div>
                    <div style={{ width: '40px', textAlign: 'right', fontSize: '14px', fontWeight: '700', color, fontFamily: "'JetBrains Mono', monospace" }}>
                      {wins}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Best times */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card>
            <h3 style={{ fontWeight: '700', marginBottom: '4px', fontSize: '15px' }}>Best Times</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Personal records per difficulty</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
              {DIFFICULTIES.map(diff => {
                const time = stats.fastestTimes[diff];
                const color = DIFF_COLORS[diff];
                return (
                  <div key={diff} style={{ background: `${color}10`, border: `1px solid ${color}22`, borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', fontWeight: '700', color, marginBottom: '8px', letterSpacing: '0.05em' }}>{DIFF_LABELS[diff].toUpperCase()}</div>
                    <div style={{ fontSize: 'clamp(14px, 2.5vw, 20px)', fontWeight: '800', color: time > 0 ? 'var(--text-primary)' : 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
                      {time > 0 ? formatTime(time) : '—'}
                    </div>
                    {time > 0 && <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}><Icon name="win" /> Personal best</div>}
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}



