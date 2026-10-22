import { startProbeSchedule } from "./scheduler/index.mjs";
export function scheduleExample({ running, probe, emit }) {
  const reportError = (error) =>
    emit({ event: "sql.error", error: error.message, code: error.code });
  return startProbeSchedule(running, probe, reportError);
}
