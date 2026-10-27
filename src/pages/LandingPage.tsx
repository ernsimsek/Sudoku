import { Icon } from '../components/ui/Icon';
import { useGameStore } from '../store/gameStore';
import type { Difficulty } from '../types';

const difficulties: { id: Difficulty; label: string; description: string; time: string }[] = [
  { id: 'easy', label: 'Easy', description: 'A gentle place to begin.', time: '5–15 min' },
  { id: 'medium', label: 'Medium', description: 'Find your rhythm.', time: '10–25 min' },
  { id: 'hard', label: 'Hard', description: 'Look a little closer.', time: '20–40 min' },
  { id: 'expert', label: 'Expert', description: 'Room for deeper thinking.', time: '30–60 min' },
  { id: 'master', label: 'Master', description: 'Take the scenic route.', time: '45–90 min' },
];
const sample = '530070000600195000098000060800060003400803001700020006060000280000419005000080079';

export default function LandingPage() {
  const { startGame, setPage, stats, settings, isGameActive, isComplete, difficulty } = useGameStore();
  return (
    <main className="home">
      <header className="home-header">
        <button className="wordmark" onClick={() => setPage('landing')} aria-label="Sudoku Master home"><span className="brand-grid" aria-hidden="true">{Array.from({ length: 9 }, (_, i) => <i key={i} />)}</span> sudoku<span className="wordmark-secondary">master</span></button>
        <nav className="home-nav" aria-label="Main navigation">
          <button onClick={() => setPage('daily')}><Icon name="daily" size={16} /> Daily</button>
          <button onClick={() => setPage('stats')}><Icon name="stats" size={16} /> Statistics</button>
          <button onClick={() => setPage('achievements')}><Icon name="collection" size={16} /> Collection</button>
          <button onClick={() => setPage('settings')} aria-label="Settings"><Icon name="settings" size={18} /></button>
        </nav>
      </header>
      <section className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow"><span /> A LITTLE SPACE TO THINK</p>
          <h1>Nine numbers.<br />Endless <em>possibilities.</em></h1>
          <p className="hero-description">Slow down. Follow a hunch. Let the next number fall into place. A quiet corner for your daily Sudoku.</p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => startGame(settings.preferredDifficulty, settings.preferredMode)}>Find a fresh puzzle <Icon name="next" size={17} /></button>
            {isGameActive && !isComplete && <button className="text-button" onClick={() => setPage('game')}>Continue {difficulty} puzzle <Icon name="outward" size={16} /></button>}
          </div>
          <p className="hero-footnote">No sign-up. Just you and the grid.</p>
        </div>
        <figure className="puzzle-study">
          <div className="study-heading"><span>THE DAILY PRACTICE</span><span>No. 09 / 81</span></div>
          <div className="study-grid" aria-label="An example Sudoku puzzle">{sample.split('').map((n, i) => <span key={i} className={`${i % 9 === 2 || i % 9 === 5 ? 'box-right' : ''} ${Math.floor(i / 9) === 2 || Math.floor(i / 9) === 5 ? 'box-bottom' : ''} ${i === 40 ? 'study-selected' : ''}`}>{n === '0' ? '' : n}</span>)}</div>
          <figcaption><span>A small ritual. A clearer mind.</span><span>01—09</span></figcaption>
        </figure>
      </section>
      <section className="difficulty-section" aria-labelledby="difficulty-heading">
        <div className="section-heading"><div><p className="eyebrow">AT YOUR OWN PACE</p><h2 id="difficulty-heading">What feels right today?</h2></div><span className="section-note">Choose a level to begin</span></div>
        <div className="difficulty-list">{difficulties.map((d, i) => <button key={d.id} className="difficulty-option" onClick={() => startGame(d.id, settings.preferredMode)}><span className="difficulty-index">0{i + 1}</span><div className="difficulty-bars" aria-hidden="true">{difficulties.map((_, j) => <i key={j} className={j <= i ? 'filled' : ''} />)}</div><h3>{d.label}</h3><p>{d.description}</p><div className="difficulty-bottom"><span>{d.time}</span><Icon name="outward" size={18} /></div></button>)}</div>
      </section>
      <section className="home-notes">
        <button className="daily-note" onClick={() => setPage('daily')}><div className="daily-date"><span>{new Date().toLocaleDateString('en-US', { month: 'short' })}</span><strong>{new Date().getDate()}</strong></div><div><p className="eyebrow">ONE DAY, ONE PUZZLE</p><h2>Your daily moment.</h2><p>A new grid to come back to, every day.</p></div><Icon name="outward" size={22} /></button>
        <div className="practice-note"><p className="eyebrow">A PRACTICE THAT ADDS UP</p><h2>{stats.totalWins > 0 ? `${stats.totalWins} puzzles, thoughtfully solved.` : 'Make yourself at home.'}</h2><p>{stats.totalWins > 0 ? `${stats.currentStreak} day streak · ${stats.totalXP.toLocaleString()} XP collected` : 'Pencil notes, a hint when you need it, and progress saved as you go.'}</p><button className="text-button" onClick={() => setPage('stats')}>Your progress <Icon name="next" size={15} /></button></div>
      </section>
      <footer className="home-footer"><span>Sudoku Master</span><span>A little less noise. A little more focus.</span><button className="text-button" onClick={() => setPage('settings')}>Make it yours <Icon name="settings" size={14} /></button></footer>
    </main>
  );
}



