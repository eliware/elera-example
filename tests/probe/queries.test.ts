import { expect, jest, test } from '@jest/globals';
import { readProbe } from '../../dist/src/probe/queries.js';

test('composes health, status, schema, write, and readback operations', async () => {
  const connection = { beginTransaction: jest.fn(), commit: jest.fn(), rollback: jest.fn(), release: jest.fn(), execute: jest.fn().mockResolvedValue([{ insertId: 3 }]) };
  const db = { probe: jest.fn().mockResolvedValue({ result: [[{ node: 'r' }], []] }), execute: jest.fn().mockResolvedValueOnce([[{ Variable_name: 'wsrep_cluster_status', Value: 'Primary' }]]).mockResolvedValueOnce([]).mockResolvedValueOnce([[{ writer_node: 'w' }]]), getConnection: jest.fn().mockResolvedValue(connection) };
  await expect(readProbe(db)).resolves.toEqual(expect.objectContaining({ generatedId: 3, readbackNode: 'w', status: { wsrep_cluster_status: 'Primary' } }));
});
