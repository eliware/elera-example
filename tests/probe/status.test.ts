import { expect, jest, test } from '@jest/globals';
import { readStatus } from '../../dist/src/probe/status.js';

test('maps wsrep status rows by variable name', async () => {
  const db = { execute: jest.fn().mockResolvedValue([[{ Variable_name: 'wsrep_cluster_status', Value: 'Primary' }]]) };
  await expect(readStatus(db)).resolves.toEqual({ wsrep_cluster_status: 'Primary' });
});
