import { useMemo } from 'react';
import { useDashboard } from '../../context/DashboardContext.jsx';
import { avgBy, topAvgEntries, round1 } from '../../utils/aggregate.js';
import BarRankChart from './BarRankChart.jsx';

export default function LikelihoodByCountryChart() {
  const { insights } = useDashboard();

  const entries = useMemo(() => {
    const byCountry = avgBy(insights, 'country', 'likelihood');
    return topAvgEntries(byCountry, 10, 3).map(([label, { avg, count }]) => ({
      label,
      value: round1(avg),
      count,
    }));
  }, [insights]);

  return (
    <BarRankChart
      title="Average likelihood by country"
      subtitle="Top 10 countries by mean likelihood (at least 3 insights each)"
      entries={entries}
      valueName="Avg likelihood"
    />
  );
}
