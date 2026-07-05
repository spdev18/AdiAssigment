/**
 * Translates request query parameters into a MongoDB filter object.
 * Every filter accepts a single value or a comma-separated list
 * (e.g. ?region=Asia,Europe). Unknown parameters are ignored.
 */

const STRING_FILTERS = ['topic', 'sector', 'region', 'pestle', 'source', 'country'];

function splitValues(value) {
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function buildFilterQuery(query) {
  const filter = {};

  for (const field of STRING_FILTERS) {
    if (query[field]) {
      const values = splitValues(query[field]);
      if (values.length === 1) filter[field] = values[0];
      else if (values.length > 1) filter[field] = { $in: values };
    }
  }

  if (query.end_year) {
    const years = splitValues(query.end_year).map(Number).filter(Number.isFinite);
    if (years.length === 1) filter.end_year = years[0];
    else if (years.length > 1) filter.end_year = { $in: years };
  }

  return filter;
}
