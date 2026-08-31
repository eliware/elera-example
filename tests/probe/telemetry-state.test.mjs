import { expect, test } from '@jest/globals';
import { createTelemetryState } from '../../dist/src/probe/telemetry-state.js';

test('creates empty telemetry state', () => {
  expect(createTelemetryState()).toEqual({ sequence: 0, previousProbeAt: undefined, writes: 0 });
});
