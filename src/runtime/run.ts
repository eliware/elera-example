import { createDb } from '@eliware/elera-client';
import { createExampleClient } from './client.js';
import { createShutdown } from './shutdown.js';
import { startExample } from './startup.js';
import { scheduleExample } from './schedule.js';

export async function runExample(configuration, { emit = console.log, dependencies = { createDb } } = {}) {
  const db = await createExampleClient(configuration, dependencies.createDb);
  let running = true;
  const probe = await startExample({ db, emit });
  const timer = scheduleExample({ running: () => running, probe });
  return createShutdown({ isRunning: () => running, stop: () => { running = false; }, timer, db, emit });
}
