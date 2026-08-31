// @ts-nocheck
export function createProbeRunner({ db, emit, now = () => new Date(), clock = () => performance.now() }) {
  let sequence = 0;
  let previousProbeAt;
  let writes = 0;
  return async function runProbe() {
    const startedAt = now();
    const started = clock();
    const currentSequence = ++sequence;
    try {
      const clientProbe = await db.probe('SELECT 1 AS healthy, @@hostname AS node');
      const [rows] = clientProbe.result;
      const [statusRows] = await db.execute("SHOW STATUS WHERE Variable_name IN ('wsrep_local_state_comment', 'wsrep_cluster_status')");
      const status = Object.fromEntries(statusRows.map((entry) => [entry.Variable_name, entry.Value]));
      await db.execute('CREATE TABLE IF NOT EXISTS e2e_probe (id BIGINT AUTO_INCREMENT PRIMARY KEY, touched_at TIMESTAMP(6) NOT NULL, writer_node VARCHAR(255) NOT NULL)');
      const connection = await db.getConnection();
      let writeResult;
      try {
        await connection.beginTransaction();
        [writeResult] = await connection.execute('INSERT INTO e2e_probe (touched_at, writer_node) SELECT NOW(6), @@hostname');
        await connection.commit();
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
      const generatedId = writeResult.insertId;
      const [writeRows] = await db.execute('SELECT writer_node FROM e2e_probe WHERE id = ?', [generatedId]);
      writes += 1;
      const finishedAt = now();
      emit({ event: 'sql.probe', sequence: currentSequence, startedAt: startedAt.toISOString(), finishedAt: finishedAt.toISOString(), operation: 'read+write', latencyMs: Math.round(clock() - started), gapSincePreviousMs: previousProbeAt ? Math.round(startedAt - previousProbeAt) : null, route: clientProbe.route, transaction: clientProbe.transaction, released: clientProbe.released, readNode: rows[0]?.node, readbackNode: writeRows[0]?.writer_node, generatedId, writes, wsrepState: status.wsrep_local_state_comment, clusterStatus: status.wsrep_cluster_status });
      previousProbeAt = finishedAt;
    } catch (error) {
      emit({ event: 'sql.error', sequence: currentSequence, startedAt: startedAt.toISOString(), finishedAt: now().toISOString(), durationMs: Math.round(clock() - started), gapSincePreviousMs: previousProbeAt ? Math.round(startedAt - previousProbeAt) : null, error: error.message, code: error.code });
      previousProbeAt = now();
    }
  };
}
