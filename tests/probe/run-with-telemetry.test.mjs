import { expect, jest, test } from "@jest/globals";
import { runWithTelemetry } from "../../src/probe/run-with-telemetry.mjs";

test("adds operation results to the telemetry context on success", async () => {
  const context = { sequence: 1 };
  const telemetry = { start: jest.fn(() => context), success: jest.fn(), failure: jest.fn() };
  const operation = jest.fn().mockResolvedValue({ readNode: "node-a" });

  await expect(runWithTelemetry(operation, telemetry)()).resolves.toBe(true);

  expect(telemetry.success).toHaveBeenCalledWith({ sequence: 1, readNode: "node-a" });
  expect(telemetry.failure).not.toHaveBeenCalled();
});

test("reports operation errors without rejecting", async () => {
  const context = { sequence: 2 };
  const error = new Error("offline");
  const telemetry = { start: jest.fn(() => context), success: jest.fn(), failure: jest.fn() };
  const operation = jest.fn().mockRejectedValue(error);

  await expect(runWithTelemetry(operation, telemetry)()).resolves.toBe(false);

  expect(telemetry.failure).toHaveBeenCalledWith(context, error);
  expect(telemetry.success).not.toHaveBeenCalled();
});

test("swallows errors from failure telemetry", async () => {
  const error = new Error("offline");
  const telemetry = {
    start: jest.fn(() => ({})),
    success: jest.fn(),
    failure: jest.fn(() => {
      throw new Error("logger failed");
    }),
  };
  const operation = jest.fn().mockRejectedValue(error);

  await expect(runWithTelemetry(operation, telemetry)()).resolves.toBe(false);
  expect(telemetry.failure).toHaveBeenCalledWith({}, error);
});
