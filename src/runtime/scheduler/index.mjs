import { scheduleProbe } from "./core.mjs";
export function startProbeSchedule(running, probe, intervalMs = 1000) {
  return setInterval(() => scheduleProbe(running(), probe), intervalMs);
}
