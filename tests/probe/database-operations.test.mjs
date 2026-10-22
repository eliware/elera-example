import { expect, jest, test } from "@jest/globals";
import { runDatabaseOperations } from "../../src/probe/database-operations.mjs";

test("runs status, schema, write, and readback operations in order", async () => {
  const calls = [];
  const connection = {
    beginTransaction: jest.fn(async () => calls.push("begin")),
    commit: jest.fn(async () => calls.push("commit")),
    rollback: jest.fn(),
    release: jest.fn(() => calls.push("release")),
    execute: jest.fn(async () => {
      calls.push("insert");
      return [{ insertId: 3 }];
    }),
  };
  const db = {
    execute: jest.fn(async (sql) => {
      calls.push(
        sql.startsWith("SHOW STATUS")
          ? "status"
          : sql.startsWith("CREATE TABLE")
            ? "schema"
            : "readback",
      );
      return sql.startsWith("SHOW STATUS")
        ? [[{ Variable_name: "wsrep_cluster_status", Value: "Primary" }]]
        : sql.startsWith("SELECT writer_node")
          ? [[{ writer_node: "writer" }]]
          : [];
    }),
    getConnection: jest.fn(async () => {
      calls.push("connection");
      return connection;
    }),
  };

  await expect(runDatabaseOperations(db)).resolves.toEqual({
    status: { wsrep_cluster_status: "Primary" },
    generatedId: 3,
    readbackNode: "writer",
  });
  expect(calls).toEqual([
    "status",
    "schema",
    "connection",
    "begin",
    "insert",
    "commit",
    "release",
    "readback",
  ]);
});
