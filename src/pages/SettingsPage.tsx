import { Icon } from '../components/ui/Icon';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

function Toggle({ value, onChange, label, description }: { value: boolean; onChange: (v: boolean) => void; label: string; description?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
      <div>
        <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{label}</div>
        {description && <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{description}</div>}
      </div>
      <motion.div
        onClick={() => onChange(!value)}
        whileTap={{ scale: 0.95 }}
        style={{
          width: '44px', height: '24px', borderRadius: '12px',
          background: value ? '#547563' : 'var(--border-strong)',
          position: 'relative', cursor: 'pointer', flexShrink: 0,
          transition: 'background 0.2s ease',
        }}>
        <motion.div
          animate={{ x: value ? 22 : 2 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          style={{
            position: 'absolute', top: '2px', width: '20px', height: '20px',
            borderRadius: '50%', background: 'white',
            boxShadow: 'none',
          }} />
      </motion.div>
    </div>
  );
}

function Select({ value, onChange, options, label }: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string; icon?: string }[];
  label: string;
}) {
  return (
    <div style={{ padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>{label}</div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {options.map(opt => (
          <motion.button key={opt.value} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={() => onChange(opt.value)}
            style={{
              padding: '7px 14px', borderRadius: '10px',
              border: `1px solid ${value === opt.value ? '#547563' : 'var(--border)'}`,
              background: value === opt.value ? 'rgba(84,117,99,0.15)' : 'var(--bg-secondary)',
              color: value === opt.value ? '#547563' : 'var(--text-secondary)',
              cursor: 'pointer', fontSize: '13px', fontWeight: '600',
              transition: 'all 0.15s ease',
            }}>
            {opt.icon && <Icon name={opt.icon} size={15} />} {opt.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { settings, updateSettings, setPage } = useGameStore();

  const themeOptions = [
    { value: 'dark', label: "Dark", icon: "dark" },
    { value: 'light', label: "Light", icon: "light" },
  ];

  const difficultyOptions = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
    { value: 'expert', label: 'Expert' },
    { value: 'master', label: 'Master' },
  ];

  const sections = [
    {
      title: "Appearance", icon: "appearance",
      items: (
        <>
          <Select label="Theme" value={settings.theme} onChange={v => updateSettings({ theme: v as 'dark' | 'light' })} options={themeOptions} />
          <Toggle label="Highlight Related Cells" description="Dim row, column, and box on selection" value={settings.highlightPeers} onChange={v => updateSettings({ highlightPeers: v })} />
          <Toggle label="Highlight Same Numbers" description="Show identical numbers across the board" value={settings.highlightSameNumbers} onChange={v => updateSettings({ highlightSameNumbers: v })} />
        </>
      ),
    },
    {
      title: "Gameplay", icon: "play",
      items: (
        <>
          <Select label="Default Difficulty" value={settings.preferredDifficulty} onChange={v => updateSettings({ preferredDifficulty: v as 'easy' | 'medium' | 'hard' | 'expert' | 'master' })} options={difficultyOptions} />
          <Toggle label="Auto-Check Errors" description="Immediately show when a number is wrong" value={settings.autoCheck} onChange={v => updateSettings({ autoCheck: v })} />
          <Toggle label="Show Timer" description="Display elapsed time during gameplay" value={settings.showTimer} onChange={v => updateSettings({ showTimer: v })} />
          <Toggle label="Zen Mode" description="No timer pressure — pure relaxation" value={settings.zenMode} onChange={v => updateSettings({ zenMode: v })} />
        </>
      ),
    },
    {
      title: "Audio", icon: "audio",
      items: (
        <>
          <Toggle label="Sound Effects" description="Play sounds for placement, errors, completion" value={settings.soundEnabled} onChange={v => updateSettings({ soundEnabled: v })} />
          <Toggle label="Haptic Feedback" description="Vibration on mobile (if supported)" value={settings.hapticFeedback} onChange={v => updateSettings({ hapticFeedback: v })} />
        </>
      ),
    },
    {
      title: "Accessibility", icon: "accessibility",
      items: (
        <>
          <Toggle label="Reduce Animations" description="Minimize motion for accessibility" value={!settings.animationsEnabled} onChange={v => updateSettings({ animationsEnabled: !v })} />
          <Toggle label="Colorblind Mode" description="Adjust colors for color vision differences" value={settings.colorblindMode} onChange={v => updateSettings({ colorblindMode: v })} />
          <Toggle label="High Contrast" description="Increase contrast for better visibility" value={settings.highContrast} onChange={v => updateSettings({ highContrast: v })} />
        </>
      ),
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: 'clamp(16px, 4vw, 32px)' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <motion.button whileHover={{ scale: 1.05, x: -2 }} whileTap={{ scale: 0.96 }}
            onClick={() => setPage('landing')}
            style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-card)', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Icon name="back" /> Back
          </motion.button>
          <h1 style={{ fontSize: 'clamp(18px, 4vw, 26px)', fontWeight: '800' }}>Settings</h1>
        </div>

        {sections.map((section, i) => (
          <motion.div key={section.title}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
            <h3 style={{ fontWeight: '700', fontSize: '15px', marginBottom: '4px' }}><Icon name={section.icon} size={18} /> {section.title}</h3>
            {section.items}
          </motion.div>
        ))}

        {/* App info */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '12px' }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}><Icon name="home" /></div>
          <div style={{ fontWeight: '700', marginBottom: '4px' }}>SudokuMaster v1.0</div>
          <div>Premium Puzzle Experience</div>
          <div style={{ marginTop: '8px' }}>Made for puzzle lovers</div>
        </motion.div>
      </div>
    </motion.div>
  );
}





