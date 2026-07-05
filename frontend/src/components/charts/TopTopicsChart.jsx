import { useMemo } from 'react';
import { useDashboard } from '../../context/DashboardContext.jsx';
import { countBy, topEntries } from '../../utils/aggregate.js';
import BarRankChart from './BarRankChart.jsx';

export default function TopTopicsChart() {
  const { insights } = useDashboard();

  const entries = useMemo(() => {
    const byTopic = countBy(insights, 'topic');
    return topEntries(byTopic, 10).map(([label, count]) => ({ label, value: count }));
  }, [insights]);

  return (
    <BarRankChart
      title="Most covered topics"
      subtitle="Top 10 topics by number of insights in the current selection"
      entries={entries}
      valueName="Insights"
    />
  );
}
