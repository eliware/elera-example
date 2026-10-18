import { readHealth } from "./health.mjs";
import { readStatus } from "./status.mjs";
import { ensureProbeTable } from "./schema.mjs";
import { writeProbe } from "./write.mjs";
import { readbackProbe } from "./readback.mjs";
export async function readProbe(db) {
  const clientProbe = await readHealth(db);
  const [rows] = clientProbe.result;
  const status = await readStatus(db);
  await ensureProbeTable(db);
  const generatedId = await writeProbe(db);
  return {
    clientProbe,
    rows,
    status,
    generatedId,
    readbackNode: await readbackProbe(db, generatedId),
  };
}
