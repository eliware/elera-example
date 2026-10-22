import { expect, jest, test } from "@jest/globals";

const createDb = jest.fn();
await jest.unstable_mockModule("@eliware/elera-client", () => ({ createDb }));
const { runExample } = await import("../../src/runtime/run.mjs");

test("closes the client when the initial probe fails", async () => {
  const db = {
    probe: jest.fn().mockRejectedValue(new Error("offline")),
    end: jest.fn().mockResolvedValue(undefined),
  };
  const emit = jest.fn();
  await expect(
    runExample(
      { url: "http://router", token: "token" },
      { emit, dependencies: { createDb: async () => db } },
    ),
  ).rejects.toThrow("Initial Elera check failed");
  expect(db.end).toHaveBeenCalledTimes(1);
  expect(emit).toHaveBeenCalledWith(expect.objectContaining({ event: "client.started" }));
  expect(emit).toHaveBeenCalledWith(
    expect.objectContaining({ event: "sql.error", error: "offline" }),
  );
});

test("reports a close error when startup cleanup fails", async () => {
  const db = {
    probe: jest.fn().mockRejectedValue(new Error("offline")),
    end: jest.fn().mockRejectedValue(new Error("close failed")),
  };
  const emit = jest.fn();
  await expect(
    runExample(
      { url: "http://router", token: "token" },
      { emit, dependencies: { createDb: async () => db } },
    ),
  ).rejects.toThrow("Initial Elera check failed");
  expect(emit).toHaveBeenCalledWith(
    expect.objectContaining({ event: "client.error", error: "close failed" }),
  );
});

test("preserves startup errors when the close error reporter fails", async () => {
  const db = {
    probe: jest.fn().mockRejectedValue(new Error("offline")),
    end: jest.fn().mockRejectedValue(new Error("close failed")),
  };
  const emit = jest.fn((entry) => {
    if (entry.event === "client.error") throw new Error("logger failed");
  });
  await expect(
    runExample(
      { url: "http://router", token: "token" },
      { emit, dependencies: { createDb: async () => db } },
    ),
  ).rejects.toThrow("Initial Elera check failed");
});

test("uses default output and shuts down after a scheduled run", async () => {
  const connection = {
    beginTransaction: jest.fn(),
    commit: jest.fn(),
    rollback: jest.fn(),
    release: jest.fn(),
    execute: jest.fn().mockResolvedValue([{ insertId: 1 }]),
  };
  const db = {
    probe: jest
      .fn()
      .mockResolvedValueOnce({ route: "primary", result: [[{ node: "node-a" }], []] })
      .mockRejectedValue(new Error("offline")),
    execute: jest
      .fn()
      .mockResolvedValueOnce([[{ Variable_name: "wsrep_cluster_status", Value: "Primary" }]])
      .mockResolvedValueOnce([{}])
      .mockResolvedValueOnce([[{ writer_node: "node-a" }]]),
    getConnection: jest.fn().mockResolvedValue(connection),
    end: jest.fn().mockResolvedValue(undefined),
  };
  const log = jest.spyOn(console, "log").mockImplementation(() => {});
  jest.useFakeTimers();
  createDb.mockResolvedValue(db);
  const shutdown = await runExample({ url: "http://router", token: "token" });
  await jest.advanceTimersByTimeAsync(1000);
  await shutdown();
  expect(log).toHaveBeenCalledWith(expect.objectContaining({ event: "client.started" }));
  expect(log).toHaveBeenCalledWith(
    expect.objectContaining({ event: "sql.error", error: "offline" }),
  );
  expect(db.end).toHaveBeenCalledTimes(1);
  jest.useRealTimers();
  log.mockRestore();
});
