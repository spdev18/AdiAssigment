/**
 * Thin client for the insights REST API. In development Vite proxies /api
 * to the Express server (see vite.config.js); in production set
 * VITE_API_BASE_URL to the deployed API origin.
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

function buildQuery(filters = {}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== '' && value !== null && value !== undefined) params.set(key, value);
  }
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

async function request(path) {
  const response = await fetch(`${BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`API request failed (${response.status}): ${path}`);
  }
  const body = await response.json();
  if (!body.success) {
    throw new Error(body.message || 'API returned an error');
  }
  return body;
}

export function fetchInsights(filters) {
  return request(`/api/insights${buildQuery({ ...filters, limit: 1000 })}`);
}

export function fetchFilterOptions() {
  return request('/api/insights/filters');
}

export function fetchStats(filters) {
  return request(`/api/insights/stats${buildQuery(filters)}`);
}
