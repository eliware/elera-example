import { expect, jest, test } from "@jest/globals";
import { createProbeTelemetry } from "../../src/probe/telemetry.mjs";

test("starts numbered telemetry contexts", () => {
  const telemetry = createProbeTelemetry({
    emit: () => {},
    now: () => new Date(0),
    clock: () => 1,
  });
  expect(telemetry.start()).toEqual({ startedAt: new Date(0), started: 1, sequence: 1 });
});

test("reports elapsed gaps and write totals across successful checks", () => {
  let time = 100;
  const emit = jest.fn();
  const telemetry = createProbeTelemetry({
    emit,
    now: () => new Date(time),
    clock: () => time,
  });
  const result = {
    clientProbe: {
      route: "primary",
      transaction: "started",
      released: true,
      result: [[{ node: "reader" }], []],
    },
    rows: [{ node: "reader" }],
    status: { wsrep_cluster_status: "Primary" },
    generatedId: 5,
    readbackNode: "writer",
  };

  telemetry.success({ ...telemetry.start(), ...result });
  time += 25;
  telemetry.success({ ...telemetry.start(), ...result });

  expect(emit).toHaveBeenLastCalledWith(
    expect.objectContaining({ gapSincePreviousMs: 25, writes: 2 }),
  );
});

test("reports elapsed gap and error code after a later check fails", () => {
  let time = 100;
  const emit = jest.fn();
  const telemetry = createProbeTelemetry({
    emit,
    now: () => new Date(time),
    clock: () => time,
  });
  const result = {
    clientProbe: {
      route: "primary",
      transaction: "started",
      released: true,
      result: [[{ node: "reader" }], []],
    },
    rows: [{ node: "reader" }],
    status: { wsrep_cluster_status: "Primary" },
    generatedId: 5,
    readbackNode: "writer",
  };
  telemetry.success({ ...telemetry.start(), ...result });
  time += 25;

  telemetry.failure(telemetry.start(), Object.assign(new Error("offline"), { code: "ECONNRESET" }));

  expect(emit).toHaveBeenLastCalledWith(
    expect.objectContaining({ event: "sql.error", gapSincePreviousMs: 25, code: "ECONNRESET" }),
  );
});
