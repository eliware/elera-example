export async function readStatus(db) {
  const [rows] = await db.execute("SHOW STATUS WHERE Variable_name IN ('wsrep_local_state_comment', 'wsrep_cluster_status')");
  return Object.fromEntries(rows.map((entry) => [entry.Variable_name, entry.Value]));
}
