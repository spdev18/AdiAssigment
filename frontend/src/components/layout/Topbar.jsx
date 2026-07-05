import { useDashboard } from '../../context/DashboardContext.jsx';

export default function Topbar() {
  const { theme, toggleTheme } = useDashboard();

  return (
    <header className="topbar">
      <div>
        <h1>Insights Dashboard</h1>
        <p className="subtitle">
          Global energy &amp; market intelligence — Blackcoffer visualization assignment
        </p>
      </div>
      <button type="button" className="theme-toggle" onClick={toggleTheme}>
        {theme === 'dark' ? 'Light mode' : 'Dark mode'}
      </button>
    </header>
  );
}
