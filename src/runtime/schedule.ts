import { startProbeSchedule } from './scheduler/index.js';

export function scheduleExample({ running, probe }) {
  return startProbeSchedule(running, probe);
}
