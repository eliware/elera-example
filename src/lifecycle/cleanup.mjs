export function cleanupExampleLifecycle(signals, handlers) {
  signals.removeHandlers();
  handlers.removeHandlers();
}
