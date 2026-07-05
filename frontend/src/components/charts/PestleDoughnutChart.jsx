import { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { useDashboard } from '../../context/DashboardContext.jsx';
import { countBy, topWithOther } from '../../utils/aggregate.js';
import { getToken, getSeriesColors, baseOptions } from '../../utils/chartTheme.js';
import ChartCard from './ChartCard.jsx';

export default function PestleDoughnutChart() {
  const { insights, theme } = useDashboard();

  // Part-to-whole stays readable at <= 6 segments: top 5 categories + "Other".
  const entries = useMemo(() => topWithOther(countBy(insights, 'pestle'), 5), [insights]);

  const { data, options } = useMemo(() => {
    const surface = getToken('--surface-1');
    const secondary = getToken('--text-secondary');
    const muted = getToken('--text-muted');
    const slots = getSeriesColors();
    const base = baseOptions();

    // Categorical slots in fixed order; the folded "Other" bucket is not an
    // identity, so it wears the muted neutral instead of a series hue.
    const colors = entries.map(([label], index) => (label === 'Other' ? muted : slots[index]));

    return {
      data: {
        labels: entries.map(([label]) => label),
        datasets: [
          {
            data: entries.map(([, count]) => count),
            backgroundColor: colors,
            borderColor: surface,
            borderWidth: 2,
            hoverOffset: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '62%',
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: { color: secondary, boxWidth: 12, boxHeight: 12, padding: 14 },
          },
          tooltip: {
            ...base.plugins.tooltip,
            callbacks: {
              label: (context) => {
                const total = entries.reduce((sum, [, count]) => sum + count, 0);
                const pct = total ? Math.round((context.parsed / total) * 100) : 0;
                return ` ${context.parsed} insights (${pct}%)`;
              },
            },
          },
        },
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries, theme]);

  return (
    <ChartCard
      title="PESTLE distribution"
      subtitle="Share of insights by PESTLE classification (top 5 + other)"
    >
      {entries.length ? <Doughnut data={data} options={options} /> : <div className="chart-empty">No data for this selection</div>}
    </ChartCard>
  );
}
