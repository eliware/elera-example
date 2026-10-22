export function emitFailure({ emit, state, context, error, now, clock }) {
  const previousProbeAt = state.previousProbeAt;
  const finishedAt = now();
  state.previousProbeAt = finishedAt;
  emit({
    event: "sql.error",
    sequence: context.sequence,
    startedAt: context.startedAt.toISOString(),
    finishedAt: finishedAt.toISOString(),
    durationMs: Math.round(clock() - context.started),
    gapSincePreviousMs: previousProbeAt ? Math.round(context.startedAt - previousProbeAt) : null,
    error: error.message,
    code: error.code,
  });
}
