import { expect, jest, test } from '@jest/globals';
import { emitSuccess } from '../../../dist/src/probe/events/success.js';

test('emits a successful probe event and increments writes', () => {
  const emit = jest.fn(); const state = { writes: 0, previousProbeAt: undefined }; const now = new Date(2000);
  emitSuccess({ emit, state, context: { sequence: 1, startedAt: new Date(1000), started: 10, clientProbe: { route: 'primary', transaction: 'started', released: true, result: [[], []] }, rows: [], status: {} }, now: () => now, clock: () => 25 });
  expect(state.writes).toBe(1); expect(emit).toHaveBeenCalledWith(expect.objectContaining({ event: 'sql.probe', writes: 1 }));
});
