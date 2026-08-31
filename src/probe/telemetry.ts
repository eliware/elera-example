import { createTelemetryState } from './telemetry-state.js';
import { emitSuccess, emitFailure } from './events.js';

export function createProbeTelemetry({ emit, now, clock }) {
  const state = createTelemetryState();
  return {
    start() { return { startedAt: now(), started: clock(), sequence: ++state.sequence }; },
    success(context) { emitSuccess({ emit, state, context, now, clock }); },
    failure(context, error) { emitFailure({ emit, state, context, error, now, clock }); },
  };
}
