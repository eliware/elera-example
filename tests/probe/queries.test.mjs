import { expect, jest, test } from "@jest/globals";

const readHealthQuery = jest.fn();
const runDatabaseOperations = jest.fn();

await jest.unstable_mockModule("../../src/probe/health-query.mjs", () => ({ readHealthQuery }));
await jest.unstable_mockModule("../../src/probe/database-operations.mjs", () => ({
  runDatabaseOperations,
}));

const { readProbe } = await import("../../src/probe/queries.mjs");

test("combines client health with database operations", async () => {
  const db = {};
  const health = {
    clientProbe: { result: [[{ node: "reader" }], []] },
    rows: [{ node: "reader" }],
  };
  const databaseOperations = { status: { wsrep_cluster_status: "Primary" }, generatedId: 3 };
  readHealthQuery.mockResolvedValue(health);
  runDatabaseOperations.mockResolvedValue(databaseOperations);

  await expect(readProbe(db)).resolves.toEqual({
    ...health,
    ...databaseOperations,
  });
  expect(readHealthQuery).toHaveBeenCalledWith(db);
  expect(runDatabaseOperations).toHaveBeenCalledWith(db);
  expect(readHealthQuery.mock.invocationCallOrder[0]).toBeLessThan(
    runDatabaseOperations.mock.invocationCallOrder[0],
  );
});
