import { readProbe } from "./queries.mjs";
import { createProbeTelemetry } from "./telemetry.mjs";
export function createProbeRunner({
  db,
  emit,
  now = () => new Date(),
  clock = () => performance.now(),
}) {
  const telemetry = createProbeTelemetry({ emit, now, clock });
  return async function runProbe() {
    const context = telemetry.start();
    try {
      Object.assign(context, await readProbe(db));
      telemetry.success(context);
    } catch (error) {
      telemetry.failure(context, error);
    }
  };
}
