export async function readbackProbe(db, generatedId) {
  const [rows] = await db.execute('SELECT writer_node FROM e2e_probe WHERE id = ?', [generatedId]);
  return rows[0]?.writer_node;
}
