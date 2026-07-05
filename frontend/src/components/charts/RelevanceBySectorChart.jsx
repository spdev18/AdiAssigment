import { useMemo } from 'react';
import { useDashboard } from '../../context/DashboardContext.jsx';
import { avgBy, topAvgEntries, round1 } from '../../utils/aggregate.js';
import BarRankChart from './BarRankChart.jsx';

export default function RelevanceBySectorChart() {
  const { insights } = useDashboard();

  const entries = useMemo(() => {
    const bySector = avgBy(insights, 'sector', 'relevance');
    return topAvgEntries(bySector, 10, 3).map(([label, { avg, count }]) => ({
      label,
      value: round1(avg),
      count,
    }));
  }, [insights]);

  return (
    <BarRankChart
      title="Average relevance by sector"
      subtitle="Top 10 sectors by mean relevance (at least 3 insights each)"
      entries={entries}
      valueName="Avg relevance"
    />
  );
}
