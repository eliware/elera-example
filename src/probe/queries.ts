import { readHealth } from './health.js';
import { readStatus } from './status.js';
import { ensureProbeTable } from './schema.js';
import { writeProbe } from './write.js';
import { readbackProbe } from './readback.js';

export async function readProbe(db) {
  const clientProbe = await readHealth(db);
  const [rows] = clientProbe.result;
  const status = await readStatus(db);
  await ensureProbeTable(db);
  const generatedId = await writeProbe(db);
  return { clientProbe, rows, status, generatedId, readbackNode: await readbackProbe(db, generatedId) };
}
