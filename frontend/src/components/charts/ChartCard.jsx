export default function ChartCard({ title, subtitle, span2 = false, children }) {
  return (
    <div className={`chart-card${span2 ? ' span-2' : ''}`}>
      <h2>{title}</h2>
      {subtitle ? <p className="chart-subtitle">{subtitle}</p> : null}
      <div className="chart-body">{children}</div>
    </div>
  );
}
