export async function readProbe(db) {
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
  return { clientProbe, rows, status, generatedId, readbackNode: writeRows[0]?.writer_node };
}
