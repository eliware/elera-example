import { createDb } from "@eliware/elera-client";
import { createExampleClient } from "./client.mjs";
import { createShutdown } from "./shutdown.mjs";
import { startExample } from "./startup.mjs";
import { scheduleExample } from "./schedule.mjs";
export async function runExample(
  configuration,
  { emit = console.log, dependencies = { createDb } } = {},
) {
  const db = await createExampleClient(configuration, dependencies.createDb);
  let running = true;
  let probe;
  try {
    probe = await startExample({ db, emit });
  } catch (error) {
    try {
      await db.end();
    } catch (closeError) {
      try {
        emit({ event: "client.error", error: closeError.message, code: closeError.code });
      } catch {}
    }
    throw error;
  }
  const timer = scheduleExample({ running: () => running, probe, emit });
  return createShutdown({
    isRunning: () => running,
    stop: () => {
      running = false;
    },
    timer,
    db,
    emit,
  });
}
