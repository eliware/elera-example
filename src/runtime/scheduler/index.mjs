import { scheduleProbe } from "./core.mjs";
export function startProbeSchedule(running, probe, onError, intervalMs = 1000) {
  let active = false;
  return setInterval(() => {
    if (active || !running()) return;
    active = true;
    void scheduleProbe(true, probe, onError).finally(() => {
      active = false;
    });
  }, intervalMs);
}
