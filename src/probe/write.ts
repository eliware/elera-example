export async function writeProbe(db) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [result] = await connection.execute('INSERT INTO e2e_probe (touched_at, writer_node) SELECT NOW(6), @@hostname');
    await connection.commit();
    return result.insertId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally { connection.release(); }
}
