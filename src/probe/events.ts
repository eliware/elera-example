import { summarizeResult } from './result-summary.js';

export function emitSuccess({ emit, state, context, now, clock }) {
  state.writes += 1;
  const finishedAt = now();
  emit({ event: 'sql.probe', sequence: context.sequence, startedAt: context.startedAt.toISOString(), finishedAt: finishedAt.toISOString(), operation: 'read+write', latencyMs: Math.round(clock() - context.started), gapSincePreviousMs: state.previousProbeAt ? Math.round(context.startedAt - state.previousProbeAt) : null, route: context.clientProbe.route, transaction: context.clientProbe.transaction, released: context.clientProbe.released, resultSummary: summarizeResult(context.clientProbe.result), readNode: context.rows[0]?.node, readbackNode: context.readbackNode, generatedId: context.generatedId, writes: state.writes, wsrepState: context.status.wsrep_local_state_comment, clusterStatus: context.status.wsrep_cluster_status });
  state.previousProbeAt = finishedAt;
}

export function emitFailure({ emit, state, context, error, now, clock }) {
  emit({ event: 'sql.error', sequence: context.sequence, startedAt: context.startedAt.toISOString(), finishedAt: now().toISOString(), durationMs: Math.round(clock() - context.started), gapSincePreviousMs: state.previousProbeAt ? Math.round(context.startedAt - state.previousProbeAt) : null, error: error.message, code: error.code });
  state.previousProbeAt = now();
}
