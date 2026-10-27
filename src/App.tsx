import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from './store/gameStore';
import LandingPage from './pages/LandingPage';
import GamePage from './pages/GamePage';
import StatsPage from './pages/StatsPage';
import DailyPage from './pages/DailyPage';
import AchievementsPage from './pages/AchievementsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import SettingsPage from './pages/SettingsPage';
import AchievementToast from './components/ui/AchievementToast';
import XPPopups from './components/ui/XPPopup';
import { Icon } from './components/ui/Icon';
import { setSoundEnabled } from './lib/sound';

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      style={{ minHeight: '100vh' }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const { currentPage, settings } = useGameStore();

  // Apply theme class to document
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
    root.style.removeProperty('--border');
    root.style.removeProperty('--border-strong');
    // Apply theme-aware contrast
    if (settings.highContrast) {
      root.style.setProperty('--border', settings.theme === 'light' ? 'rgba(48,56,47,0.4)' : 'rgba(255,255,255,0.4)');
      root.style.setProperty('--border-strong', settings.theme === 'light' ? 'rgba(48,56,47,0.7)' : 'rgba(255,255,255,0.7)');
    }
  }, [settings.theme, settings.highContrast]);

  // Sync sound setting
  useEffect(() => {
    setSoundEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  const renderPage = () => {
    switch (currentPage) {
      case 'landing': return <LandingPage />;
      case 'game': return <GamePage />;
      case 'stats': return <StatsPage />;
      case 'daily': return <DailyPage />;
      case 'achievements': return <AchievementsPage />;
      case 'leaderboard': return <LeaderboardPage />;
      case 'settings': return <SettingsPage />;
      default: return <LandingPage />;
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        fontFamily: "'Inter', system-ui, sans-serif",
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      {/* Page content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <AnimatePresence mode="wait">
          <PageTransition key={currentPage}>
            {renderPage()}
          </PageTransition>
        </AnimatePresence>
      </div>
      {/* Global UI overlays */}
      <AchievementToast />
      <XPPopups />

      {/* Bottom nav on mobile for quick access */}
      {currentPage !== 'game' && (
        <MobileNav />
      )}
    </div>
  );
}

function MobileNav() {
  const { currentPage, setPage, startGame } = useGameStore();

  const items = [
    { icon: 'home', label: 'Home', page: 'landing' },
    { icon: 'play', label: 'Play', action: () => startGame('medium') },
    { icon: 'daily', label: 'Daily', page: 'daily' },
    { icon: 'stats', label: 'Stats', page: 'stats' },
    { icon: 'collection', label: 'Badges', page: 'achievements' },
  ];

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.3 }}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '64px',
        background: 'var(--bg-card)',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 50,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        // Only show on mobile
        visibility: typeof window !== 'undefined' && window.innerWidth < 768 ? 'visible' : 'hidden',
      }}
      className="mobile-nav"
    >
      {items.map(item => {
        const isActive = item.page && currentPage === item.page;
        return (
          <motion.button
            key={item.label}
            whileTap={{ scale: 0.9 }}
            onClick={() => item.action ? item.action() : item.page && setPage(item.page)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              padding: '8px 12px',
              borderRadius: '12px',
              border: 'none',
              background: isActive ? 'rgba(84,117,99,0.1)' : 'transparent',
              cursor: 'pointer',
              color: isActive ? '#547563' : 'var(--text-muted)',
            }}
          >
            <Icon name={item.icon} size={19} />
            <span style={{ fontSize: '9px', fontWeight: '600', letterSpacing: '0.02em' }}>{item.label}</span>
          </motion.button>
        );
      })}
    </motion.nav>
  );
}



