export function scheduleProbe(running: boolean, probe: () => unknown): void {
  if (running) void probe();
}
