import { expect, jest, test } from "@jest/globals";
import { writeProbe } from "../../src/probe/write.mjs";

test("writes in a transaction and releases the connection", async () => {
  const connection = {
    beginTransaction: jest.fn(),
    commit: jest.fn(),
    rollback: jest.fn(),
    release: jest.fn(),
    execute: jest.fn().mockResolvedValue([{ insertId: 9 }]),
  };
  await expect(
    writeProbe({ getConnection: jest.fn().mockResolvedValue(connection) }),
  ).resolves.toBe(9);
  expect(connection.commit).toHaveBeenCalled();
  expect(connection.release).toHaveBeenCalled();
});

test("rolls back and releases when the write fails", async () => {
  const error = Object.assign(new Error("write failed"), { code: "EWRITE" });
  const connection = {
    beginTransaction: jest.fn(),
    commit: jest.fn(),
    rollback: jest.fn(),
    release: jest.fn(),
    execute: jest.fn().mockRejectedValue(error),
  };
  await expect(writeProbe({ getConnection: jest.fn().mockResolvedValue(connection) })).rejects.toBe(
    error,
  );
  expect(connection.rollback).toHaveBeenCalledTimes(1);
  expect(connection.release).toHaveBeenCalledTimes(1);
});

test("propagates connection acquisition errors", async () => {
  const error = new Error("connection unavailable");
  const db = { getConnection: jest.fn().mockRejectedValue(error) };

  await expect(writeProbe(db)).rejects.toBe(error);
  expect(db.getConnection).toHaveBeenCalledTimes(1);
});

test("preserves the write error when rollback fails", async () => {
  const error = new Error("write failed");
  const connection = {
    beginTransaction: jest.fn(),
    commit: jest.fn(),
    rollback: jest.fn().mockRejectedValue(new Error("rollback failed")),
    release: jest.fn(),
    execute: jest.fn().mockRejectedValue(error),
  };

  await expect(writeProbe({ getConnection: jest.fn().mockResolvedValue(connection) })).rejects.toBe(
    error,
  );
  expect(connection.rollback).toHaveBeenCalledTimes(1);
  expect(connection.release).toHaveBeenCalledTimes(1);
});
