import { expect, jest, test } from "@jest/globals";
import { createProbeRunner } from "../../src/probe/runner.mjs";

test("coordinates a successful database workflow with telemetry", async () => {
  const connection = {
    beginTransaction: jest.fn(),
    commit: jest.fn(),
    rollback: jest.fn(),
    release: jest.fn(),
    execute: jest.fn().mockResolvedValue([{ insertId: 4 }]),
  };
  const db = {
    probe: jest.fn().mockResolvedValue({ result: [[{ node: "elera-0" }], []] }),
    execute: jest
      .fn()
      .mockResolvedValueOnce([[{ Variable_name: "wsrep_cluster_status", Value: "Primary" }]])
      .mockResolvedValueOnce([{}])
      .mockResolvedValueOnce([[{ writer_node: "elera-0" }]]),
    getConnection: jest.fn().mockResolvedValue(connection),
  };
  const emit = jest.fn();

  await createProbeRunner({ db, emit })();

  expect(db.probe).toHaveBeenCalledWith("SELECT 1 AS healthy, @@hostname AS node");
  expect(db.execute).toHaveBeenCalledTimes(3);
  expect(connection.commit).toHaveBeenCalledTimes(1);
  expect(connection.release).toHaveBeenCalledTimes(1);
  expect(emit).toHaveBeenCalledTimes(1);
});

test("reports a failed database workflow through telemetry", async () => {
  const db = { probe: jest.fn().mockRejectedValue(new Error("offline")), execute: jest.fn() };
  const emit = jest.fn();

  await createProbeRunner({ db, emit })();

  expect(db.probe).toHaveBeenCalledTimes(1);
  expect(db.execute).not.toHaveBeenCalled();
  expect(emit).toHaveBeenCalledTimes(1);
});
