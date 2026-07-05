import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Insight from '../models/Insight.js';
import { transformRecord } from './transformRecord.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.resolve(__dirname, '../../data/jsondata.json');

/**
 * Loads data/jsondata.json into the insights collection.
 * With { onlyIfEmpty: true } it becomes a no-op when data already exists —
 * used on server boot so a fresh database is always usable.
 */
export async function seedDatabase({ onlyIfEmpty = false } = {}) {
  const existing = await Insight.estimatedDocumentCount();
  if (onlyIfEmpty && existing > 0) {
    return { seeded: false, count: existing };
  }

  const raw = JSON.parse(await readFile(DATA_FILE, 'utf-8'));
  const records = raw.map(transformRecord);

  await Insight.deleteMany({});
  await Insight.insertMany(records);

  console.log(`[seed] Inserted ${records.length} insights into MongoDB`);
  return { seeded: true, count: records.length };
}
