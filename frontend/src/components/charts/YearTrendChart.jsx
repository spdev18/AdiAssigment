import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { useDashboard } from '../../context/DashboardContext.jsx';
import { avgBy, round1 } from '../../utils/aggregate.js';
import { getToken, hexToRgba, baseOptions } from '../../utils/chartTheme.js';
import ChartCard from './ChartCard.jsx';

export default function YearTrendChart() {
  const { insights, theme } = useDashboard();

  const yearly = useMemo(() => {
    const byYear = avgBy(insights, 'end_year', 'intensity');
    return [...byYear.entries()].sort((a, b) => a[0] - b[0]);
  }, [insights]);

  const { data, options } = useMemo(() => {
    const series = getToken('--series-1');
    const surface = getToken('--surface-1');
    const base = baseOptions();

    return {
      data: {
        labels: yearly.map(([year]) => String(year)),
        datasets: [
          {
            label: 'Insights',
            data: yearly.map(([, { count }]) => count),
            borderColor: series,
            borderWidth: 2,
            borderJoinStyle: 'round',
            borderCapStyle: 'round',
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: series,
            pointBorderColor: surface,
            pointBorderWidth: 2,
            fill: true,
            backgroundColor: hexToRgba(series, 0.1),
            tension: 0.25,
          },
        ],
      },
      options: {
        ...base,
        interaction: { mode: 'index', intersect: false },
        scales: {
          x: { ...base.scales.x, grid: { display: false } },
          y: { ...base.scales.y, beginAtZero: true, ticks: { ...base.scales.y.ticks, precision: 0 } },
        },
        plugins: {
          ...base.plugins,
          tooltip: {
            ...base.plugins.tooltip,
            callbacks: {
              label: (context) => {
                const [, { avg }] = yearly[context.dataIndex];
                return [`Insights: ${context.parsed.y}`, `Avg intensity: ${round1(avg)}`];
              },
            },
          },
        },
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearly, theme]);

  return (
    <ChartCard
      title="Insights by end year"
      subtitle="Number of insights whose projection ends in each year — hover for average intensity"
    >
      {yearly.length ? <Line data={data} options={options} /> : <div className="chart-empty">No data for this selection</div>}
    </ChartCard>
  );
}
