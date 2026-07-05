import Insight from '../models/Insight.js';
import { buildFilterQuery } from '../utils/buildFilterQuery.js';

const MAX_LIMIT = 2000;

/**
 * GET /api/insights
 * Returns insights matching the requested filters.
 * Query params: end_year, topic, sector, region, pestle, source, country
 * (single value or comma-separated), plus limit / page for pagination.
 */
export async function getInsights(req, res, next) {
  try {
    const filter = buildFilterQuery(req.query);
    const limit = Math.min(Number(req.query.limit) || MAX_LIMIT, MAX_LIMIT);
    const page = Math.max(Number(req.query.page) || 1, 1);

    const [data, total] = await Promise.all([
      Insight.find(filter)
        .sort({ published: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Insight.countDocuments(filter),
    ]);

    res.json({ success: true, total, page, count: data.length, data });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/insights/filters
 * Returns the distinct, non-empty values of every filterable field —
 * used by the frontend to populate its filter controls.
 */
export async function getFilterOptions(req, res, next) {
  try {
    const fields = ['end_year', 'topic', 'sector', 'region', 'pestle', 'source', 'country'];
    const entries = await Promise.all(
      fields.map(async (field) => {
        const values = await Insight.distinct(field, { [field]: { $nin: [null, ''] } });
        return [field, values.sort((a, b) => (a > b ? 1 : -1))];
      })
    );
    res.json({ success: true, data: Object.fromEntries(entries) });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/insights/stats
 * Aggregated KPIs for the current filter selection, computed in MongoDB.
 */
export async function getStats(req, res, next) {
  try {
    const filter = buildFilterQuery(req.query);

    const [result] = await Insight.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalRecords: { $sum: 1 },
          avgIntensity: { $avg: '$intensity' },
          avgLikelihood: { $avg: '$likelihood' },
          avgRelevance: { $avg: '$relevance' },
          countries: { $addToSet: '$country' },
          topics: { $addToSet: '$topic' },
        },
      },
      {
        $project: {
          _id: 0,
          totalRecords: 1,
          avgIntensity: { $round: ['$avgIntensity', 2] },
          avgLikelihood: { $round: ['$avgLikelihood', 2] },
          avgRelevance: { $round: ['$avgRelevance', 2] },
          countryCount: {
            $size: { $filter: { input: '$countries', cond: { $ne: ['$$this', ''] } } },
          },
          topicCount: {
            $size: { $filter: { input: '$topics', cond: { $ne: ['$$this', ''] } } },
          },
        },
      },
    ]);

    res.json({
      success: true,
      data: result ?? {
        totalRecords: 0,
        avgIntensity: null,
        avgLikelihood: null,
        avgRelevance: null,
        countryCount: 0,
        topicCount: 0,
      },
    });
  } catch (error) {
    next(error);
  }
}
