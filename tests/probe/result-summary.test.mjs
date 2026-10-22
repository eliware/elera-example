import { expect, test } from "@jest/globals";
import { summarizeResult } from "../../src/probe/result-summary.mjs";

test("summarizes a mysql tuple result", () => {
  expect(summarizeResult([[{ id: 1 }], [{ name: "id" }]])).toEqual({
    mysql2Tuple: true,
    rowsPresent: true,
    fieldsPresent: true,
    rowCount: 1,
    fieldCount: 1,
  });
});

test("summarizes malformed results without throwing", () => {
  expect(summarizeResult(null)).toEqual({
    mysql2Tuple: false,
    rowsPresent: false,
    fieldsPresent: false,
    rowCount: 0,
    fieldCount: 0,
  });
});
