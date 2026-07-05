/**
 * Standalone seeder: node scripts/seed.js
 * Reads data/jsondata.json, normalizes every record and replaces the
 * contents of the insights collection in the configured MongoDB.
 */
import { connectDatabase, disconnectDatabase } from '../src/config/db.js';
import { seedDatabase } from '../src/utils/seedDatabase.js';

async function run() {
  try {
    const { inMemory } = await connectDatabase();
    if (inMemory) {
      console.warn(
        '[seed] Warning: seeding an in-memory database — data will not persist. ' +
          'Point MONGO_URI at a real MongoDB instance to keep the data.'
      );
    }
    await seedDatabase();
  } catch (error) {
    console.error('[seed] Failed:', error.message);
    process.exitCode = 1;
  } finally {
    await disconnectDatabase();
  }
}

run();
