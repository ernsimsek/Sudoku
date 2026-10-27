import { Icon } from '../components/ui/Icon';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import SudokuBoard from '../components/game/SudokuBoard';
import NumberPad from '../components/game/NumberPad';
import GameHeader from '../components/game/GameHeader';
import CompletionModal from '../components/game/CompletionModal';
import DailyMissions from '../components/ui/DailyMissions';
import { getXPForNextLevel } from '../lib/xp';

export default function GamePage() {
  const {
    tick,
    isComplete,
    isPaused,
    placeNumber,
    eraseCell,
    undo,
    toggleNotesMode,
    cells,
    stats,
    achievements,
  } = useGameStore();

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const xpInfo = getXPForNextLevel(stats.totalXP);
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  useEffect(() => {
    timerRef.current = setInterval(() => {
      tick();
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [tick]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (isComplete || isPaused) return;

      if (e.key >= '1' && e.key <= '9') {
        e.preventDefault();
        placeNumber(parseInt(e.key));
      }
      if (e.key === 'Delete' || e.key === 'Backspace' || e.key === '0') {
        e.preventDefault();
        eraseCell();
      }
      if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        undo();
      }
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        toggleNotesMode();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isComplete, isPaused, placeNumber, eraseCell, undo, toggleNotesMode]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 'clamp(12px, 3vw, 28px) clamp(12px, 2vw, 24px)',
        paddingBottom: '40px',
      }}
    >
      {/* Header */}
      <div style={{ width: '100%', maxWidth: '1200px', display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
        <GameHeader />
      </div>

      {/* Main layout */}
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        display: 'flex',
        gap: '24px',
        alignItems: 'flex-start',
        justifyContent: 'center',
      }}>
        {/* Left sidebar — desktop only */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            width: '220px',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            position: 'sticky',
            top: '24px',
          }}
          className="sidebar-desktop"
        >
          {/* Player card */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{
                width: '38px', height: '38px', borderRadius: '50%',
                background: '#547563',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px', flexShrink: 0, color: 'var(--bg-card)',
              }}>
                <Icon name="home" size={22} />
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '13px' }}>Level {stats.level}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {stats.totalXP.toLocaleString()} XP
                </div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                <span>Level {xpInfo.level}</span>
                <span>{xpInfo.current}/{xpInfo.needed}</span>
              </div>
              <div className="progress-bar">
                <motion.div
                  className="progress-fill"
                  animate={{ width: `${(xpInfo.current / xpInfo.needed) * 100}%` }}
                  style={{ background: '#547563' }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <div><Icon name="streak" /> {stats.currentStreak} streak</div>
              <div><Icon name="win" /> {stats.totalWins} wins</div>
            </div>
          </div>

          {/* Achievements quick view */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '16px',
          }}>
            <div style={{ fontWeight: '700', fontSize: '13px', marginBottom: '10px' }}>
              <Icon name="collection" size={16} /> Achievements
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              {unlockedCount} / {achievements.length} unlocked
            </div>
            <div className="progress-bar">
              <motion.div
                className="progress-fill"
                animate={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
                style={{ background: '#547563' }}
              />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '10px' }}>
              {achievements.filter(a => a.unlocked).slice(-6).map(a => (
                <span key={a.id} title={a.title} style={{ fontSize: '18px' }}><Icon name={a.id} /></span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Board area */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          flex: 'none',
        }}>
          {cells.length > 0 && <SudokuBoard />}
          <NumberPad />

          {/* Keyboard hints */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { key: '1-9', action: 'Place' },
              { key: 'N', action: 'Notes' },
              { key: '⌫', action: 'Erase' },
              { key: '⌘Z', action: 'Undo' },
              { key: "↑↓←→", action: 'Move' },
            ].map(({ key, action }) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--text-muted)' }}>
                <span style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '4px', padding: '2px 5px', fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: '600' }}>
                  {key}
                </span>
                <span>{action}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right sidebar — desktop only */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            width: '220px',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            position: 'sticky',
            top: '24px',
          }}
          className="sidebar-desktop"
        >
          {/* Daily Missions */}
          <DailyMissions />

          {/* Quick tips */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '16px',
          }}>
            <div style={{ fontWeight: '700', fontSize: '13px', marginBottom: '10px' }}><Icon name="hint" /> Pro Tips</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { tip: 'Use notes for candidates in complex cells', icon: "notes" },
                { tip: 'Look for cells with only one possible value', icon: "hint" },
                { tip: 'Check rows, columns, AND boxes', icon: "search" },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  <span style={{ flexShrink: 0 }}><Icon name={item.icon} /></span>
                  <span>{item.tip}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <CompletionModal />
    </motion.div>
  );
}




