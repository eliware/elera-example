import { expect, jest, test } from '@jest/globals';
import { writeProbe } from '../../dist/src/probe/write.js';

test('writes in a transaction and releases the connection', async () => {
  const connection = { beginTransaction: jest.fn(), commit: jest.fn(), rollback: jest.fn(), release: jest.fn(), execute: jest.fn().mockResolvedValue([{ insertId: 9 }]) };
  await expect(writeProbe({ getConnection: jest.fn().mockResolvedValue(connection) })).resolves.toBe(9);
  expect(connection.commit).toHaveBeenCalled(); expect(connection.release).toHaveBeenCalled();
});
