import { expect, jest, test } from "@jest/globals";
import { createShutdown } from "../../src/runtime/shutdown.mjs";

test("stops once and emits the stopped marker", async () => {
  const db = { end: jest.fn().mockResolvedValue(undefined) };
  const emit = jest.fn();
  const clear = jest.spyOn(globalThis, "clearInterval");
  let running = true;
  const shutdown = createShutdown({
    isRunning: () => running,
    stop: () => {
      running = false;
    },
    timer: 1,
    db,
    emit,
  });
  await shutdown();
  await shutdown();
  expect(db.end).toHaveBeenCalledTimes(1);
  expect(emit).toHaveBeenCalledWith(expect.objectContaining({ event: "client.stopped" }));
  expect(clear).toHaveBeenCalledWith(1);
  clear.mockRestore();
});

test("reports close errors and does not emit a stopped marker", async () => {
  const error = Object.assign(new Error("close failed"), { code: "ECONNRESET" });
  const db = { end: jest.fn().mockRejectedValue(error) };
  const emit = jest.fn();
  const shutdown = createShutdown({
    isRunning: () => true,
    stop: jest.fn(),
    timer: 2,
    db,
    emit,
  });

  await expect(shutdown()).rejects.toBe(error);
  expect(emit).toHaveBeenCalledWith({
    event: "client.error",
    error: "close failed",
    code: "ECONNRESET",
  });
  expect(emit).not.toHaveBeenCalledWith(expect.objectContaining({ event: "client.stopped" }));
});

test("waits for an active probe before closing the client", async () => {
  let finishProbe;
  let probeFinished = false;
  const waitForIdle = jest.fn(
    () =>
      new Promise((resolve) => {
        finishProbe = () => {
          probeFinished = true;
          resolve();
        };
      }),
  );
  const db = {
    end: jest.fn(() => {
      expect(probeFinished).toBe(true);
      return Promise.resolve();
    }),
  };
  const shutdown = createShutdown({
    isRunning: () => true,
    stop: jest.fn(),
    timer: 3,
    waitForIdle,
    db,
    emit: jest.fn(),
  });

  const shutdownResult = shutdown();
  await Promise.resolve();
  expect(db.end).not.toHaveBeenCalled();
  finishProbe();
  await shutdownResult;
  expect(db.end).toHaveBeenCalledTimes(1);
});
