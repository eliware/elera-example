import { scheduleProbe } from "./core.mjs";
export function startProbeSchedule(running, probe, onError, intervalMs = 1000) {
  let activeProbe;
  const timer = setInterval(() => {
    if (activeProbe || !running()) return;
    activeProbe = scheduleProbe(true, probe, onError).finally(() => {
      activeProbe = undefined;
    });
  }, intervalMs);
  return {
    timer,
    waitForIdle: () => activeProbe ?? Promise.resolve(),
  };
}
