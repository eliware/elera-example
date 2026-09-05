import { expect, jest, test } from '@jest/globals';
import { readbackProbe } from '../../dist/src/probe/readback.js';

test('reads the writer node for the generated probe id', async () => {
  const db = { execute: jest.fn().mockResolvedValue([[{ writer_node: 'writer-1' }]]) };
  await expect(readbackProbe(db, 7)).resolves.toBe('writer-1');
  expect(db.execute).toHaveBeenCalledWith('SELECT writer_node FROM e2e_probe WHERE id = ?', [7]);
});
