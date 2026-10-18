import { startProbeSchedule } from "./scheduler/index.mjs";
export function scheduleExample({ running, probe }) {
  return startProbeSchedule(running, probe);
}
