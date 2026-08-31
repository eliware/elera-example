import { log, registerHandlers, registerSignals } from '@eliware/common';
import type { SignalsRegistration } from '@eliware/common';

export function registerExampleLifecycle(shutdown: () => Promise<void>): { signals: SignalsRegistration; remove(): void } {
  const handlers = registerHandlers({ log, events: ['uncaughtException', 'unhandledRejection', 'warning'] });
  const signals = registerSignals({ log, shutdownHook: shutdown, exitCode: 0 });
  return { signals, remove: () => { signals.removeHandlers(); handlers.removeHandlers(); } };
}
