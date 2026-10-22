import { readProbe } from "./queries.mjs";
import { createProbeTelemetry } from "./telemetry.mjs";
import { runWithTelemetry } from "./run-with-telemetry.mjs";
export function createProbeRunner({
  db,
  emit,
  now = () => new Date(),
  clock = () => performance.now(),
}) {
  const telemetry = createProbeTelemetry({ emit, now, clock });
  return runWithTelemetry(() => readProbe(db), telemetry);
}
