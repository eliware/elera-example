import { expect, jest, test } from "@jest/globals";
import { emitSuccess } from "../../../src/probe/events/success.mjs";

test("reports routing, readback, and cluster details", () => {
  const emit = jest.fn();
  const state = { writes: 0, previousProbeAt: undefined };
  const now = new Date(2000);
  emitSuccess({
    emit,
    state,
    context: {
      sequence: 1,
      startedAt: new Date(1000),
      started: 10,
      clientProbe: {
        route: "primary",
        transaction: "started",
        released: true,
        result: [[{ node: "reader" }], []],
      },
      rows: [{ node: "reader" }],
      readbackNode: "writer",
      generatedId: 7,
      status: { wsrep_local_state_comment: "Synced", wsrep_cluster_status: "Primary" },
    },
    now: () => now,
    clock: () => 25,
  });
  expect(emit).toHaveBeenCalledWith(
    expect.objectContaining({
      event: "sql.probe",
      route: "primary",
      readNode: "reader",
      readbackNode: "writer",
      generatedId: 7,
      wsrepState: "Synced",
      clusterStatus: "Primary",
    }),
  );
});
