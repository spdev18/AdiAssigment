import mongoose from 'mongoose';

/**
 * One record of the Blackcoffer insights dataset.
 * Numeric fields arrive as "" in the raw JSON when absent — the seeder
 * normalizes those to null so range queries and averages stay correct.
 */
const insightSchema = new mongoose.Schema(
  {
    end_year: { type: Number, default: null, index: true },
    start_year: { type: Number, default: null },
    intensity: { type: Number, default: null },
    relevance: { type: Number, default: null },
    likelihood: { type: Number, default: null },
    sector: { type: String, default: '', index: true },
    topic: { type: String, default: '', index: true },
    region: { type: String, default: '', index: true },
    country: { type: String, default: '', index: true },
    pestle: { type: String, default: '', index: true },
    source: { type: String, default: '', index: true },
    insight: { type: String, default: '' },
    title: { type: String, default: '' },
    url: { type: String, default: '' },
    impact: { type: String, default: '' },
    added: { type: Date, default: null },
    published: { type: Date, default: null },
  },
  {
    collection: 'insights',
    timestamps: false,
    versionKey: false,
  }
);

const Insight = mongoose.model('Insight', insightSchema);

export default Insight;
