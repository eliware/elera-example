import { expect, jest, test } from '@jest/globals';
import { emitFailure } from '../../../dist/src/probe/events/failure.js';

test('emits a failed probe event and records the failure time', () => {
  const emit = jest.fn(); const state = { writes: 0, previousProbeAt: undefined }; const now = new Date(2000);
  emitFailure({ emit, state, context: { sequence: 1, startedAt: new Date(1000), started: 10 }, error: Object.assign(new Error('offline'), { code: 'ECONNRESET' }), now: () => now, clock: () => 25 });
  expect(state.previousProbeAt).toBe(now); expect(emit).toHaveBeenCalledWith(expect.objectContaining({ event: 'sql.error', code: 'ECONNRESET' }));
});
