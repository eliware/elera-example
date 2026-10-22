import { expect, jest, test } from "@jest/globals";
import { cleanupExampleLifecycle } from "../../src/lifecycle/cleanup.mjs";

test("removes signal handlers before process event handlers", () => {
  const calls = [];
  const signals = { removeHandlers: jest.fn(() => calls.push("signals")) };
  const handlers = { removeHandlers: jest.fn(() => calls.push("events")) };

  cleanupExampleLifecycle(signals, handlers);

  expect(calls).toEqual(["signals", "events"]);
});
