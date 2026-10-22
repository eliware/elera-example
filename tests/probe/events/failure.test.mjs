import { expect, jest, test } from "@jest/globals";
import { emitFailure } from "../../../src/probe/events/failure.mjs";

test("emits a failed probe event and records the failure time", () => {
  const emit = jest.fn();
  const state = { writes: 0, previousProbeAt: undefined };
  const finishedAt = new Date(2000);
  const now = jest.fn(() => finishedAt);
  emitFailure({
    emit,
    state,
    context: { sequence: 1, startedAt: new Date(1000), started: 10 },
    error: Object.assign(new Error("offline"), { code: "ECONNRESET" }),
    now,
    clock: () => 25,
  });
  expect(now).toHaveBeenCalledTimes(1);
  expect(state.previousProbeAt).toBe(finishedAt);
  expect(emit).toHaveBeenCalledWith(
    expect.objectContaining({
      event: "sql.error",
      code: "ECONNRESET",
      finishedAt: finishedAt.toISOString(),
    }),
  );
});

test("uses a null gap when no previous probe exists", () => {
  const emit = jest.fn();
  emitFailure({
    emit,
    state: {},
    context: { sequence: 1, startedAt: new Date(1000), started: 1000 },
    error: new Error("offline"),
    now: () => new Date(2000),
    clock: () => 3000,
  });
  expect(emit).toHaveBeenCalledWith(expect.objectContaining({ gapSincePreviousMs: null }));
});
