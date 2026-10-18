import { expect, test } from "@jest/globals";
import { createTelemetryState } from "../../src/probe/telemetry-state.mjs";

test("creates empty telemetry state", () => {
  expect(createTelemetryState()).toEqual({ sequence: 0, previousProbeAt: undefined, writes: 0 });
});
