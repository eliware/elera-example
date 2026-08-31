export function summarizeResult(result) {
  return { mysql2Tuple: Array.isArray(result) && result.length === 2, rowsPresent: Array.isArray(result[0]), fieldsPresent: Array.isArray(result[1]), rowCount: result[0].length, fieldCount: result[1].length };
}

export function createProbeTelemetry({ emit, now, clock }) {
  let sequence = 0;
  let previousProbeAt;
  let writes = 0;
  return {
    start() { return { startedAt: now(), started: clock(), sequence: ++sequence }; },
    success(context) {
      writes += 1;
      const finishedAt = now();
      emit({ event: 'sql.probe', sequence: context.sequence, startedAt: context.startedAt.toISOString(), finishedAt: finishedAt.toISOString(), operation: 'read+write', latencyMs: Math.round(clock() - context.started), gapSincePreviousMs: previousProbeAt ? Math.round(context.startedAt - previousProbeAt) : null, route: context.clientProbe.route, transaction: context.clientProbe.transaction, released: context.clientProbe.released, resultSummary: summarizeResult(context.clientProbe.result), readNode: context.rows[0]?.node, readbackNode: context.readbackNode, generatedId: context.generatedId, writes, wsrepState: context.status.wsrep_local_state_comment, clusterStatus: context.status.wsrep_cluster_status });
      previousProbeAt = finishedAt;
    },
    failure(context, error) {
      emit({ event: 'sql.error', sequence: context.sequence, startedAt: context.startedAt.toISOString(), finishedAt: now().toISOString(), durationMs: Math.round(clock() - context.started), gapSincePreviousMs: previousProbeAt ? Math.round(context.startedAt - previousProbeAt) : null, error: error.message, code: error.code });
      previousProbeAt = now();
    },
  };
}
