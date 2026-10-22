import { readHealth } from "./health.mjs";

export async function readHealthQuery(db) {
  const clientProbe = await readHealth(db);
  const [rows] = clientProbe.result;
  return { clientProbe, rows };
}
