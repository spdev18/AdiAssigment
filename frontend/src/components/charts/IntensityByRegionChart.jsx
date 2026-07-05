import { useMemo } from 'react';
import { useDashboard } from '../../context/DashboardContext.jsx';
import { avgBy, topAvgEntries, round1 } from '../../utils/aggregate.js';
import BarRankChart from './BarRankChart.jsx';

export default function IntensityByRegionChart() {
  const { insights } = useDashboard();

  const entries = useMemo(() => {
    const byRegion = avgBy(insights, 'region', 'intensity');
    return topAvgEntries(byRegion, 10, 3).map(([label, { avg, count }]) => ({
      label,
      value: round1(avg),
      count,
    }));
  }, [insights]);

  return (
    <BarRankChart
      title="Average intensity by region"
      subtitle="Top 10 regions by mean intensity (at least 3 insights each)"
      entries={entries}
      valueName="Avg intensity"
    />
  );
}
