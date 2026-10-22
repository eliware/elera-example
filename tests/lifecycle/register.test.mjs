import { expect, jest, test } from "@jest/globals";

const registerHandlers = jest.fn();
const registerSignals = jest.fn();
const createExampleLifecycleHandle = jest.fn();
await jest.unstable_mockModule("@eliware/common", () => ({
  log: {},
  registerHandlers,
  registerSignals,
}));
await jest.unstable_mockModule("../../src/lifecycle/handle.mjs", () => ({
  createExampleLifecycleHandle,
}));
const { registerExampleLifecycle } = await import("../../src/lifecycle/register.mjs");

test("registers process handlers and creates a lifecycle handle", () => {
  const signals = {};
  const handlers = {};
  const lifecycle = {};
  registerSignals.mockReturnValue(signals);
  registerHandlers.mockReturnValue(handlers);
  createExampleLifecycleHandle.mockReturnValue(lifecycle);
  const shutdown = jest.fn();

  expect(registerExampleLifecycle(shutdown)).toBe(lifecycle);
  expect(registerHandlers).toHaveBeenCalledWith({
    log: expect.anything(),
    events: ["uncaughtException", "unhandledRejection", "warning"],
  });
  expect(registerSignals).toHaveBeenCalledWith({
    log: expect.anything(),
    shutdownHook: shutdown,
    exitCode: 0,
  });
  expect(createExampleLifecycleHandle).toHaveBeenCalledWith(signals, handlers);
});
