import { expect, jest, test } from "@jest/globals";
import { scheduleProbe } from "../../../src/runtime/scheduler/core.mjs";

test("runs only while active", async () => {
  const probe = jest.fn();
  await scheduleProbe(true, probe, jest.fn());
  await scheduleProbe(false, probe, jest.fn());
  expect(probe).toHaveBeenCalledTimes(1);
  expect(probe).toHaveBeenCalledWith();
});

test("reports rejected probes", async () => {
  const error = new Error("offline");
  const onError = jest.fn();
  await scheduleProbe(true, () => Promise.reject(error), onError);
  expect(onError).toHaveBeenCalledWith(error);
});
