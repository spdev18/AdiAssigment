/**
 * Normalizes one raw JSON record into the shape stored in MongoDB:
 * - "" numeric fields become null
 * - date strings like "January, 20 2017 03:51:25" become Date objects
 * - string fields are trimmed
 */

function toNumberOrNull(value) {
  if (value === '' || value === null || value === undefined) return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function toDateOrNull(value) {
  if (!value) return null;
  // Raw format: "January, 20 2017 03:51:25" — drop the comma so Date can parse it.
  const parsed = new Date(String(value).replace(',', ''));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function toTrimmedString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function transformRecord(raw) {
  return {
    end_year: toNumberOrNull(raw.end_year),
    start_year: toNumberOrNull(raw.start_year),
    intensity: toNumberOrNull(raw.intensity),
    relevance: toNumberOrNull(raw.relevance),
    likelihood: toNumberOrNull(raw.likelihood),
    sector: toTrimmedString(raw.sector),
    topic: toTrimmedString(raw.topic),
    region: toTrimmedString(raw.region),
    country: toTrimmedString(raw.country),
    pestle: toTrimmedString(raw.pestle),
    source: toTrimmedString(raw.source),
    insight: toTrimmedString(raw.insight),
    title: toTrimmedString(raw.title),
    url: toTrimmedString(raw.url),
    impact: toTrimmedString(raw.impact),
    added: toDateOrNull(raw.added),
    published: toDateOrNull(raw.published),
  };
}
