import { expect, jest, test } from '@jest/globals';
import { createExampleClient } from '../../dist/src/runtime/client.js';

test('maps application configuration to the public client contract', async () => {
  const create = jest.fn().mockResolvedValue('db');
  await expect(createExampleClient({ url: 'http://router', token: 'token' }, create)).resolves.toBe('db');
  expect(create).toHaveBeenCalledWith({ endpoint: 'http://router', token: 'token' });
});
