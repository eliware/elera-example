import { expect, test } from "@jest/globals";
import { parseCliArguments } from "../../src/cli/arguments.mjs";

test("selects help, version, and startup actions", () => {
  expect(parseCliArguments([])).toEqual({ action: "start" });
  expect(parseCliArguments(["--help"])).toEqual({ action: "help" });
  expect(parseCliArguments(["-h"])).toEqual({ action: "help" });
  expect(parseCliArguments(["--version"])).toEqual({ action: "version" });
});

test("rejects unrecognized arguments", () => {
  expect(parseCliArguments(["--verbose"])).toEqual({
    action: "invalid",
    unsupportedArguments: ["--verbose"],
  });
});
