import { log, registerHandlers, registerSignals } from "@eliware/common";
export function registerExampleLifecycle(shutdown) {
  const handlers = registerHandlers({
    log,
    events: ["uncaughtException", "unhandledRejection", "warning"],
  });
  const signals = registerSignals({ log, shutdownHook: shutdown, exitCode: 0 });
  return {
    signals,
    remove: () => {
      signals.removeHandlers();
      handlers.removeHandlers();
    },
  };
}
