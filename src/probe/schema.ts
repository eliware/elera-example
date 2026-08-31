export function ensureProbeTable(db) {
  return db.execute('CREATE TABLE IF NOT EXISTS e2e_probe (id BIGINT AUTO_INCREMENT PRIMARY KEY, touched_at TIMESTAMP(6) NOT NULL, writer_node VARCHAR(255) NOT NULL)');
}
