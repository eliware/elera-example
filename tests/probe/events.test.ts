import { expect, jest, test } from '@jest/globals';
import { emitFailure, emitSuccess } from '../../dist/src/probe/events.js';

const context = { sequence: 1, startedAt: new Date(1000), started: 10, clientProbe: { route: 'primary', transaction: 'started', released: true, result: [[], []] }, rows: [], readbackNode: undefined, generatedId: 2, status: {} };
test('emits success telemetry and updates counters', () => {
  const emit = jest.fn(); const state = { writes: 0, previousProbeAt: undefined };
  emitSuccess({ emit, state, context, now: () => new Date(2000), clock: () => 25 });
  expect(emit).toHaveBeenCalledWith(expect.objectContaining({ event: 'sql.probe', writes: 1, gapSincePreviousMs: null }));
});
test('emits failure telemetry and preserves error code', () => {
  const emit = jest.fn(); const state = { writes: 0, previousProbeAt: undefined };
  emitFailure({ emit, state, context, error: Object.assign(new Error('offline'), { code: 'ECONNRESET' }), now: () => new Date(2000), clock: () => 25 });
  expect(emit).toHaveBeenCalledWith(expect.objectContaining({ event: 'sql.error', error: 'offline', code: 'ECONNRESET' }));
});
