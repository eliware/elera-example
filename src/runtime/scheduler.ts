import { scheduleProbe } from '../probe-scheduler.js';

export function startProbeSchedule(running, probe, intervalMs = 1000) {
  return setInterval(() => scheduleProbe(running(), probe), intervalMs);
}
