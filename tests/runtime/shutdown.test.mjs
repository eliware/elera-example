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

test("reports close errors and retries the client close", async () => {
  const error = Object.assign(new Error("close failed"), { code: "ECONNRESET" });
  const db = {
    end: jest.fn().mockRejectedValueOnce(error).mockResolvedValue(undefined),
  };
  const emit = jest.fn();
  const shutdown = createShutdown({
    isRunning: () => true,
    stop: jest.fn(),
    timer: 2,
    db,
    emit,
  });

  await expect(shutdown()).rejects.toBe(error);
  await expect(shutdown()).resolves.toBeUndefined();
  expect(emit).toHaveBeenCalledWith({
    event: "client.error",
    error: "close failed",
    code: "ECONNRESET",
  });
  expect(emit).toHaveBeenCalledWith(expect.objectContaining({ event: "client.stopped" }));
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

test("shares concurrent shutdown work and ignores an inactive client", async () => {
  let finishClose;
  const db = {
    end: jest.fn(
      () =>
        new Promise((resolve) => {
          finishClose = resolve;
        }),
    ),
  };
  const shutdown = createShutdown({
    isRunning: () => true,
    stop: jest.fn(),
    timer: 4,
    db,
    emit: jest.fn(),
  });
  const first = shutdown();
  const second = shutdown();
  await Promise.resolve();
  expect(db.end).toHaveBeenCalledTimes(1);
  finishClose();
  await Promise.all([first, second]);

  const inactiveDb = { end: jest.fn() };
  const inactiveShutdown = createShutdown({
    isRunning: () => false,
    stop: jest.fn(),
    timer: 5,
    db: inactiveDb,
    emit: jest.fn(),
  });
  await inactiveShutdown();
  expect(inactiveDb.end).not.toHaveBeenCalled();
});
