import { readStatus } from "./status.mjs";
import { ensureProbeTable } from "./schema.mjs";
import { writeProbe } from "./write.mjs";
import { readbackProbe } from "./readback.mjs";

export async function runDatabaseOperations(db) {
  const status = await readStatus(db);
  await ensureProbeTable(db);
  const generatedId = await writeProbe(db);
  const readbackNode = await readbackProbe(db, generatedId);
  return { status, generatedId, readbackNode };
}
