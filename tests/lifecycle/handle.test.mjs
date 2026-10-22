import { expect, jest, test } from "@jest/globals";

const cleanupExampleLifecycle = jest.fn();
await jest.unstable_mockModule("../../src/lifecycle/cleanup.mjs", () => ({
  cleanupExampleLifecycle,
}));
const { createExampleLifecycleHandle } = await import("../../src/lifecycle/handle.mjs");

test("returns the signal handle and delegates cleanup", () => {
  const signals = {};
  const handlers = {};
  const lifecycle = createExampleLifecycleHandle(signals, handlers);

  expect(lifecycle.signals).toBe(signals);
  lifecycle.remove();
  expect(cleanupExampleLifecycle).toHaveBeenCalledWith(signals, handlers);
});
