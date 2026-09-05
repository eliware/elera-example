import { expect, jest, test } from '@jest/globals';
import { ensureProbeTable } from '../../dist/src/probe/schema.js';

test('ensures the smoke probe table exists', async () => {
  const db = { execute: jest.fn().mockResolvedValue([]) };
  await ensureProbeTable(db);
  expect(db.execute).toHaveBeenCalledWith(expect.stringContaining('CREATE TABLE IF NOT EXISTS e2e_probe'));
});
