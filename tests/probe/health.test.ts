import { expect, jest, test } from '@jest/globals';
import { readHealth } from '../../dist/src/probe/health.js';

test('reads health through the client probe API', async () => {
  const db = { probe: jest.fn().mockResolvedValue({ ok: true }) };
  await expect(readHealth(db)).resolves.toEqual({ ok: true });
  expect(db.probe).toHaveBeenCalledWith('SELECT 1 AS healthy, @@hostname AS node');
});
