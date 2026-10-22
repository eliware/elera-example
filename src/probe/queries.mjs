import { readHealthQuery } from "./health-query.mjs";
import { runDatabaseOperations } from "./database-operations.mjs";
export async function readProbe(db) {
  const health = await readHealthQuery(db);
  const databaseOperations = await runDatabaseOperations(db);
  return { ...health, ...databaseOperations };
}
