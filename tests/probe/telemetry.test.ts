import { expect, test } from '@jest/globals';
import { createProbeTelemetry } from '../../dist/src/probe/telemetry.js';

test('starts numbered telemetry contexts', () => {
  const telemetry = createProbeTelemetry({ emit: () => {}, now: () => new Date(0), clock: () => 1 });
  expect(telemetry.start()).toEqual({ startedAt: new Date(0), started: 1, sequence: 1 });
});
