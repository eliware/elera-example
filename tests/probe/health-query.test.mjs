import { expect, jest, test } from "@jest/globals";
import { readHealthQuery } from "../../src/probe/health-query.mjs";

test("returns client health and its rows", async () => {
  const clientProbe = { result: [[{ node: "reader" }], []] };
  const db = { probe: jest.fn().mockResolvedValue(clientProbe) };

  await expect(readHealthQuery(db)).resolves.toEqual({ clientProbe, rows: [{ node: "reader" }] });
});
