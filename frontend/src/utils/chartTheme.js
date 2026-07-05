/**
 * Bridges the CSS design tokens into Chart.js, so charts re-theme from the
 * same custom properties the rest of the UI uses. Components call these
 * helpers on every render and re-render when the theme changes.
 */

export function getToken(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** Fixed categorical hue order — assigned by slot, never cycled. */
export function getSeriesColors() {
  return [1, 2, 3, 4, 5, 6, 7, 8].map((i) => getToken(`--series-${i}`));
}

export function hexToRgba(hex, alpha) {
  const value = hex.replace('#', '');
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Shared scale/tooltip/legend options built from the current theme tokens. */
export function baseOptions() {
  const muted = getToken('--text-muted');
  const secondary = getToken('--text-secondary');
  const grid = getToken('--grid-line');
  const baseline = getToken('--baseline');
  const surface = getToken('--surface-1');
  const primary = getToken('--text-primary');

  return {
    responsive: true,
    maintainAspectRatio: false,
    font: { family: "system-ui, -apple-system, 'Segoe UI', sans-serif" },
    color: secondary,
    scales: {
      x: {
        grid: { color: grid, drawTicks: false },
        border: { color: baseline },
        ticks: { color: muted, font: { size: 11 } },
      },
      y: {
        grid: { color: grid, drawTicks: false },
        border: { color: baseline },
        ticks: { color: muted, font: { size: 11 } },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: primary,
        titleColor: surface,
        bodyColor: surface,
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
      },
    },
  };
}

/** Bar datasets: thin marks, rounded data-end, square baseline. */
export const BAR_STYLE = {
  maxBarThickness: 22,
  borderRadius: 4,
  borderSkipped: 'start',
};
