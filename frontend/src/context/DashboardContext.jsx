import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { fetchInsights, fetchFilterOptions, fetchStats } from '../api/insightsApi.js';

const EMPTY_FILTERS = {
  end_year: '',
  topic: '',
  sector: '',
  region: '',
  pestle: '',
  source: '',
  country: '',
};

const DashboardContext = createContext(null);

function getInitialTheme() {
  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function DashboardProvider({ children }) {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [filterOptions, setFilterOptions] = useState(null);
  const [insights, setInsights] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState(getInitialTheme);

  // Theme is applied on the root element; charts read tokens from there.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }, []);

  // Filter options only need to load once.
  useEffect(() => {
    fetchFilterOptions()
      .then((body) => setFilterOptions(body.data))
      .catch((err) => setError(err.message));
  }, []);

  // Data + stats reload whenever the filter selection changes.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([fetchInsights(filters), fetchStats(filters)])
      .then(([insightsBody, statsBody]) => {
        if (cancelled) return;
        setInsights(insightsBody.data);
        setStats(statsBody.data);
        setError(null);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [filters]);

  const setFilter = useCallback((field, value) => {
    setFilters((current) => ({ ...current, [field]: value }));
  }, []);

  const resetFilters = useCallback(() => setFilters(EMPTY_FILTERS), []);

  const hasActiveFilters = useMemo(
    () => Object.values(filters).some((value) => value !== ''),
    [filters]
  );

  const value = useMemo(
    () => ({
      filters,
      setFilter,
      resetFilters,
      hasActiveFilters,
      filterOptions,
      insights,
      stats,
      loading,
      error,
      theme,
      toggleTheme,
    }),
    [filters, setFilter, resetFilters, hasActiveFilters, filterOptions, insights, stats, loading, error, theme, toggleTheme]
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) throw new Error('useDashboard must be used inside DashboardProvider');
  return context;
}
