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
      const [rows] = await db.query('SELECT 1 AS healthy, @@hostname AS node');
      const [statusRows] = await db.query("SHOW STATUS WHERE Variable_name IN ('wsrep_local_state_comment', 'wsrep_cluster_status')");
      const status = Object.fromEntries(statusRows.map((entry) => [entry.Variable_name, entry.Value]));
      await db.query('CREATE TABLE IF NOT EXISTS sample_app.e2e_probe (id BIGINT AUTO_INCREMENT PRIMARY KEY, touched_at TIMESTAMP(6) NOT NULL, writer_node VARCHAR(255) NOT NULL)');
      const [writeResult] = await db.query('INSERT INTO sample_app.e2e_probe (touched_at, writer_node) SELECT NOW(6), @@hostname');
      const generatedId = writeResult.insertId;
      const [writeRows] = await db.query('SELECT writer_node FROM sample_app.e2e_probe WHERE id = ?', [generatedId]);
      writes += 1;
      const finishedAt = now();
      emit({ event: 'sql.probe', sequence: currentSequence, startedAt: startedAt.toISOString(), finishedAt: finishedAt.toISOString(), operation: 'read+write', selectedNode: db.bundle()?.writer?.host, retryCount: db.telemetry?.snapshot?.()?.retries ?? 0, reconnectCount: db.telemetry?.snapshot?.()?.reconnects ?? 0, latencyMs: Math.round(clock() - started), gapSincePreviousMs: previousProbeAt ? Math.round(startedAt - previousProbeAt) : null, bundleVersion: db.bundle()?.bundleVersion, readRoute: db.classify('SELECT 1'), writeRoute: db.classify('INSERT INTO sample_app.e2e_probe (touched_at, writer_node) SELECT NOW(6), @@hostname'), readNode: rows[0]?.node, writeNode: db.bundle()?.writer?.host, readbackNode: writeRows[0]?.writer_node, generatedId, writes, wsrepState: status.wsrep_local_state_comment, clusterStatus: status.wsrep_cluster_status, nodes: db.nodeStates() });
      previousProbeAt = finishedAt;
    } catch (error) {
      emit({ event: 'sql.error', sequence: currentSequence, startedAt: startedAt.toISOString(), finishedAt: now().toISOString(), durationMs: Math.round(clock() - started), gapSincePreviousMs: previousProbeAt ? Math.round(startedAt - previousProbeAt) : null, error: error.message, code: error.code, nodes: db.nodeStates() });
      previousProbeAt = now();
    }
  };
}
