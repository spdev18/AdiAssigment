import { useDashboard } from '../../context/DashboardContext.jsx';
import StatCard from './StatCard.jsx';

export default function StatGrid() {
  const { stats } = useDashboard();

  return (
    <section className="stat-grid" aria-label="Key metrics">
      <StatCard
        label="Insights"
        value={stats ? stats.totalRecords.toLocaleString() : null}
        hint="records in current selection"
      />
      <StatCard label="Avg intensity" value={stats?.avgIntensity ?? null} hint="scale of impact strength" />
      <StatCard label="Avg likelihood" value={stats?.avgLikelihood ?? null} hint="probability estimate (1–4)" />
      <StatCard label="Avg relevance" value={stats?.avgRelevance ?? null} hint="relevance score (1–7)" />
      <StatCard label="Countries" value={stats?.countryCount ?? null} hint="covered by selection" />
      <StatCard label="Topics" value={stats?.topicCount ?? null} hint="distinct topics" />
    </section>
  );
}
