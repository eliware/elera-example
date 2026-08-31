export function emitFailure({ emit, state, context, error, now, clock }) {
  emit({ event: 'sql.error', sequence: context.sequence, startedAt: context.startedAt.toISOString(), finishedAt: now().toISOString(), durationMs: Math.round(clock() - context.started), gapSincePreviousMs: state.previousProbeAt ? Math.round(context.startedAt - state.previousProbeAt) : null, error: error.message, code: error.code });
  state.previousProbeAt = now();
}
