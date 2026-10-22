import { cleanupExampleLifecycle } from "./cleanup.mjs";

export function createExampleLifecycleHandle(signals, handlers) {
  return {
    signals,
    remove: () => cleanupExampleLifecycle(signals, handlers),
  };
}
