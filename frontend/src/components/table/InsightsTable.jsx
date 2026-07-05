import { useEffect, useMemo, useState } from 'react';
import { useDashboard } from '../../context/DashboardContext.jsx';

const PAGE_SIZE = 10;

/**
 * Table view of the filtered records — the accessible, WCAG-clean twin of the
 * charts above it: every value shown in a chart is reachable here as text.
 */
export default function InsightsTable() {
  const { insights } = useDashboard();
  const [page, setPage] = useState(1);

  // Snap back to the first page whenever the filtered set changes.
  useEffect(() => setPage(1), [insights]);

  const pageCount = Math.max(Math.ceil(insights.length / PAGE_SIZE), 1);
  const rows = useMemo(
    () => insights.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [insights, page]
  );

  return (
    <section className="table-card" aria-label="Insight records">
      <h2>Insight records</h2>
      <p className="chart-subtitle">
        Every record in the current selection — the table twin of the charts above
      </p>
      <div className="table-scroll">
        <table className="insights-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Sector</th>
              <th>Topic</th>
              <th>Region</th>
              <th>Country</th>
              <th className="num">Intensity</th>
              <th className="num">Likelihood</th>
              <th className="num">Relevance</th>
              <th className="num">End year</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row._id}>
                <td className="title-cell">
                  {row.url ? (
                    <a href={row.url} target="_blank" rel="noopener noreferrer">
                      {row.title || 'Untitled insight'}
                    </a>
                  ) : (
                    row.title || 'Untitled insight'
                  )}
                </td>
                <td>{row.sector || '—'}</td>
                <td>{row.topic || '—'}</td>
                <td>{row.region || '—'}</td>
                <td>{row.country || '—'}</td>
                <td className="num">{row.intensity ?? '—'}</td>
                <td className="num">{row.likelihood ?? '—'}</td>
                <td className="num">{row.relevance ?? '—'}</td>
                <td className="num">{row.end_year ?? '—'}</td>
                <td>{row.source || '—'}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', padding: 24 }}>
                  No records match the current filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="table-footer">
        <span>
          {insights.length.toLocaleString()} records · page {page} of {pageCount}
        </span>
        <div className="pager">
          <button type="button" onClick={() => setPage((p) => p - 1)} disabled={page <= 1}>
            Previous
          </button>
          <button type="button" onClick={() => setPage((p) => p + 1)} disabled={page >= pageCount}>
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
