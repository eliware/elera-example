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
  const probe = await startExample({ db, emit });
  const timer = scheduleExample({ running: () => running, probe });
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
