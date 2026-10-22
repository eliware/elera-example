export function emitFailure({ emit, state, context, error, now, clock }) {
  const previousProbeAt = state.previousProbeAt;
  let finishedAt;
  try {
    finishedAt = now();
    finishedAt.toISOString();
  } catch {
    finishedAt = new Date();
  }
  state.previousProbeAt = finishedAt;
  let startedAt;
  try {
    startedAt = context.startedAt.toISOString();
  } catch {}
  let durationMs;
  try {
    durationMs = Math.round(clock() - context.started);
  } catch {}
  let gapSincePreviousMs;
  try {
    gapSincePreviousMs = previousProbeAt ? Math.round(context.startedAt - previousProbeAt) : null;
  } catch {}
  emit({
    event: "sql.error",
    sequence: context.sequence,
    startedAt,
    finishedAt: finishedAt.toISOString(),
    durationMs,
    gapSincePreviousMs,
    error: error.message,
    code: error.code,
  });
}
