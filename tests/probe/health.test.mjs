import { expect, jest, test } from "@jest/globals";
import { readHealth } from "../../src/probe/health.mjs";

test("reads health through the client probe API", async () => {
  const db = { probe: jest.fn().mockResolvedValue({ ok: true }) };
  await expect(readHealth(db)).resolves.toEqual({ ok: true });
  expect(db.probe).toHaveBeenCalledWith("SELECT 1 AS healthy, @@hostname AS node");
});
