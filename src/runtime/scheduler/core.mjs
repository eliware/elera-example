export function scheduleProbe(running, probe) {
  if (running) void probe();
}
