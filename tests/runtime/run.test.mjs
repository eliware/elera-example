import { expect, jest, test } from "@jest/globals";

const createDb = jest.fn();
await jest.unstable_mockModule("@eliware/elera-client", () => ({ createDb }));
const { runExample } = await import("../../src/runtime/run.mjs");

test("assembles the runtime dependencies", async () => {
  const db = {
    probe: jest.fn().mockRejectedValue(new Error("offline")),
    end: jest.fn().mockResolvedValue(undefined),
  };
  const emit = jest.fn();
  const shutdown = await runExample(
    { url: "http://router", token: "token" },
    { emit, dependencies: { createDb: async () => db } },
  );
  await shutdown();
  expect(db.end).toHaveBeenCalledTimes(1);
  expect(emit).toHaveBeenCalledWith(expect.objectContaining({ event: "client.started" }));
  expect(emit).toHaveBeenCalledWith(
    expect.objectContaining({ event: "sql.error", error: "offline" }),
  );
});

test("uses default output and client dependencies", async () => {
  const db = {
    probe: jest.fn().mockRejectedValue(new Error("offline")),
    end: jest.fn().mockResolvedValue(undefined),
  };
  const log = jest.spyOn(console, "log").mockImplementation(() => {});
  jest.useFakeTimers();
  createDb.mockResolvedValue(db);
  const shutdown = await runExample({ url: "http://router", token: "token" });
  await jest.advanceTimersByTimeAsync(1000);
  await shutdown();
  expect(createDb).toHaveBeenCalledWith({ endpoint: "http://router", token: "token" });
  expect(db.end).toHaveBeenCalledTimes(1);
  jest.useRealTimers();
  log.mockRestore();
});
