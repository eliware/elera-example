import { expect, jest, test } from "@jest/globals";
import { startProbeSchedule } from "../../../src/runtime/scheduler/index.mjs";

test("does not overlap scheduled probes", async () => {
  jest.useFakeTimers();
  let finishProbe;
  const probe = jest.fn(
    () =>
      new Promise((resolve) => {
        finishProbe = resolve;
      }),
  );
  const { timer, waitForIdle } = startProbeSchedule(() => true, probe, jest.fn(), 50);
  await waitForIdle();
  await jest.advanceTimersByTimeAsync(50);
  await jest.advanceTimersByTimeAsync(100);
  expect(probe).toHaveBeenCalledTimes(1);
  let idle = false;
  const idleResult = waitForIdle().then(() => {
    idle = true;
  });
  await Promise.resolve();
  expect(idle).toBe(false);
  finishProbe();
  await idleResult;
  await Promise.resolve();
  await jest.advanceTimersByTimeAsync(50);
  clearInterval(timer);
  jest.useRealTimers();
  expect(probe).toHaveBeenCalledTimes(2);
});
