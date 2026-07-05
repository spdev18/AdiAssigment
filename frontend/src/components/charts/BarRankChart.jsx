import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { useDashboard } from '../../context/DashboardContext.jsx';
import { getToken, baseOptions, BAR_STYLE } from '../../utils/chartTheme.js';
import ChartCard from './ChartCard.jsx';

/**
 * Shared single-series ranked bar chart. Nominal categories carry one hue
 * (categorical slot 1) — magnitude is encoded by length, not by a color ramp.
 *
 * entries: [{ label, value, count }] already sorted; count (optional) is the
 * number of records behind each bar, surfaced in the tooltip.
 */
export default function BarRankChart({
  title,
  subtitle,
  entries,
  valueName,
  horizontal = true,
  span2 = false,
}) {
  const { theme } = useDashboard();

  const { data, options } = useMemo(() => {
    const series = getToken('--series-1');
    const base = baseOptions();
    const valueScale = horizontal ? 'x' : 'y';
    const categoryScale = horizontal ? 'y' : 'x';

    return {
      data: {
        labels: entries.map((entry) => entry.label),
        datasets: [
          {
            label: valueName,
            data: entries.map((entry) => entry.value),
            backgroundColor: series,
            ...BAR_STYLE,
          },
        ],
      },
      options: {
        ...base,
        indexAxis: horizontal ? 'y' : 'x',
        scales: {
          [valueScale]: {
            ...base.scales[valueScale],
            beginAtZero: true,
            ticks: { ...base.scales[valueScale].ticks, precision: 0 },
          },
          [categoryScale]: {
            ...base.scales[categoryScale],
            grid: { display: false },
            ticks: {
              ...base.scales[categoryScale].ticks,
              autoSkip: !horizontal,
              callback(value) {
                const label = this.getLabelForValue(value);
                return label.length > 22 ? `${label.slice(0, 21)}…` : label;
              },
            },
          },
        },
        plugins: {
          ...base.plugins,
          tooltip: {
            ...base.plugins.tooltip,
            callbacks: {
              // Full (untruncated) category name in the tooltip title.
              title: (items) => entries[items[0].dataIndex].label,
              label: (context) => {
                const entry = entries[context.dataIndex];
                const value = horizontal ? context.parsed.x : context.parsed.y;
                const lines = [`${valueName}: ${value}`];
                if (entry.count !== undefined) lines.push(`Records: ${entry.count}`);
                return lines;
              },
            },
          },
        },
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries, valueName, horizontal, theme]);

  return (
    <ChartCard title={title} subtitle={subtitle} span2={span2}>
      {entries.length ? <Bar data={data} options={options} /> : <div className="chart-empty">No data for this selection</div>}
    </ChartCard>
  );
}
