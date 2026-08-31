export async function readHealth(db) {
  return db.probe('SELECT 1 AS healthy, @@hostname AS node');
}
