export async function writeProbe(db) {
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();
    const [result] = await connection.execute(
      "INSERT INTO e2e_probe (touched_at, writer_node) SELECT NOW(6), @@hostname",
    );
    await connection.commit();
    return result.insertId;
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch {}
    }
    throw error;
  } finally {
    connection?.release();
  }
}
