import { expect, jest, test } from '@jest/globals';
import { createShutdown } from '../../dist/src/runtime/shutdown.js';

test('stops once and emits the stopped marker', async () => {
  const db = { end: jest.fn().mockResolvedValue(undefined) }; const emit = jest.fn(); const clear = jest.spyOn(globalThis, 'clearInterval'); let running = true;
  const shutdown = createShutdown({ isRunning: () => running, stop: () => { running = false; }, timer: 1, db, emit });
  await shutdown(); await shutdown();
  expect(db.end).toHaveBeenCalledTimes(1); expect(emit).toHaveBeenCalledWith(expect.objectContaining({ event: 'client.stopped' }));
  expect(clear).toHaveBeenCalledWith(1); clear.mockRestore();
});
