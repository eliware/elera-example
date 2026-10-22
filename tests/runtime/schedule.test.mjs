import { expect, jest, test } from "@jest/globals";
import { scheduleExample } from "../../src/runtime/schedule.mjs";

test("creates the recurring probe schedule", async () => {
  jest.useFakeTimers();
  const probe = jest.fn();
  const { timer } = scheduleExample({ running: () => true, probe, emit: jest.fn() });
  await jest.advanceTimersByTimeAsync(1000);
  clearInterval(timer);
  jest.useRealTimers();
  expect(probe).toHaveBeenCalledTimes(1);
});

test("reports a failed recurring probe", async () => {
  jest.useFakeTimers();
  const error = new Error("offline");
  const emit = jest.fn();
  const probe = jest.fn().mockRejectedValue(error);
  const { timer } = scheduleExample({ running: () => true, probe, emit });
  await jest.advanceTimersByTimeAsync(1000);
  clearInterval(timer);
  jest.useRealTimers();
  expect(emit).toHaveBeenCalledWith({ event: "sql.error", error: "offline", code: undefined });
});
