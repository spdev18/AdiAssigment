import { useDashboard } from '../../context/DashboardContext.jsx';

const FILTER_FIELDS = [
  { key: 'end_year', label: 'End year' },
  { key: 'topic', label: 'Topic' },
  { key: 'sector', label: 'Sector' },
  { key: 'region', label: 'Region' },
  { key: 'pestle', label: 'PESTLE' },
  { key: 'source', label: 'Source' },
  { key: 'country', label: 'Country' },
];

export default function FilterBar() {
  const { filters, setFilter, resetFilters, hasActiveFilters, filterOptions } = useDashboard();

  return (
    <section className="filter-bar" aria-label="Dashboard filters">
      {FILTER_FIELDS.map(({ key, label }) => (
        <div className="filter-field" key={key}>
          <label htmlFor={`filter-${key}`}>{label}</label>
          <select
            id={`filter-${key}`}
            value={filters[key]}
            onChange={(event) => setFilter(key, event.target.value)}
          >
            <option value="">All</option>
            {(filterOptions?.[key] ?? []).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      ))}
      <button
        type="button"
        className="filter-reset"
        onClick={resetFilters}
        disabled={!hasActiveFilters}
      >
        Reset filters
      </button>
    </section>
  );
}
