/**
 * Client-side aggregation helpers. The API returns the filtered slice of the
 * dataset (max 1,000 records); each chart derives its own grouping from that
 * one response so every visual always agrees with the active filters.
 */

/** Groups records by `key` and counts them. Skips empty keys. */
export function countBy(records, key) {
  const map = new Map();
  for (const record of records) {
    const value = record[key];
    if (value === '' || value === null || value === undefined) continue;
    map.set(value, (map.get(value) || 0) + 1);
  }
  return map;
}

/**
 * Groups records by `key` and averages `valueKey` (ignoring null values).
 * Returns Map<groupValue, { avg, count }>.
 */
export function avgBy(records, key, valueKey) {
  const sums = new Map();
  for (const record of records) {
    const group = record[key];
    const value = record[valueKey];
    if (group === '' || group === null || group === undefined) continue;
    if (value === null || value === undefined) continue;
    const entry = sums.get(group) || { sum: 0, count: 0 };
    entry.sum += value;
    entry.count += 1;
    sums.set(group, entry);
  }
  const result = new Map();
  for (const [group, { sum, count }] of sums) {
    result.set(group, { avg: sum / count, count });
  }
  return result;
}

/** Top N entries of a Map by numeric value (descending). */
export function topEntries(map, n, valueOf = (v) => v) {
  return [...map.entries()].sort((a, b) => valueOf(b[1]) - valueOf(a[1])).slice(0, n);
}

/**
 * Top N groups of an avgBy() Map ranked by average, ignoring groups backed by
 * fewer than minCount records — a single-record average is noise, not signal.
 * Falls back to all groups when the filter selection is too small to qualify.
 */
export function topAvgEntries(map, n, minCount = 1) {
  const eligible = [...map.entries()].filter(([, value]) => value.count >= minCount);
  const pool = eligible.length ? eligible : [...map.entries()];
  return pool.sort((a, b) => b[1].avg - a[1].avg).slice(0, n);
}

/**
 * Top N entries plus a folded "Other" bucket for part-to-whole charts,
 * so the segment count stays readable (never more than n + 1 classes).
 */
export function topWithOther(map, n) {
  const sorted = [...map.entries()].sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, n);
  const rest = sorted.slice(n).reduce((sum, [, count]) => sum + count, 0);
  if (rest > 0) top.push(['Other', rest]);
  return top;
}

export function round1(value) {
  return Math.round(value * 10) / 10;
}
