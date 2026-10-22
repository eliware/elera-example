import { log, registerHandlers, registerSignals } from "@eliware/common";
import { createExampleLifecycleHandle } from "./handle.mjs";
export function registerExampleLifecycle(shutdown) {
  const handlers = registerHandlers({
    log,
    events: ["uncaughtException", "unhandledRejection", "warning"],
  });
  const signals = registerSignals({ log, shutdownHook: shutdown, exitCode: 0 });
  return createExampleLifecycleHandle(signals, handlers);
}
