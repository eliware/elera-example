import { expect, jest, test } from "@jest/globals";
import { ensureProbeTable } from "../../src/probe/schema.mjs";

test("ensures the smoke probe table exists", async () => {
  const db = { execute: jest.fn().mockResolvedValue([]) };
  await ensureProbeTable(db);
  expect(db.execute).toHaveBeenCalledWith(
    expect.stringContaining("CREATE TABLE IF NOT EXISTS e2e_probe"),
  );
});
