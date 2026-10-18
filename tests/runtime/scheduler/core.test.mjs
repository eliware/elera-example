import { expect, jest, test } from "@jest/globals";
import { scheduleProbe } from "../../../src/runtime/scheduler/core.mjs";

test("runs only while active", () => {
  const probe = jest.fn();
  scheduleProbe(true, probe);
  scheduleProbe(false, probe);
  expect(probe).toHaveBeenCalledTimes(1);
  expect(probe).toHaveBeenCalledWith();
});
