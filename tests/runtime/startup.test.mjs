import { expect, jest, test } from "@jest/globals";
import { startExample } from "../../src/runtime/startup.mjs";

test("emits startup and completes the initial probe", async () => {
  const emit = jest.fn();
  const probe = jest.fn().mockResolvedValue(true);
  const createProbe = jest.fn(() => probe);
  const db = {};
  const result = await startExample({ db, emit, createProbe });
  expect(result).toBe(probe);
  expect(createProbe).toHaveBeenCalledWith({ db, emit });
  expect(probe).toHaveBeenCalledTimes(1);
  expect(emit).toHaveBeenCalledWith(expect.objectContaining({ event: "client.started" }));
});

test("rejects startup when the initial database check fails", async () => {
  const emit = jest.fn();
  const probe = jest.fn().mockResolvedValue(false);
  const createProbe = jest.fn(() => probe);

  await expect(startExample({ db: {}, emit, createProbe })).rejects.toThrow(
    "Initial Elera check failed",
  );
});
