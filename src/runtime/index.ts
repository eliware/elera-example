import { createDb } from '@eliware/elera-client';
import { createProbeRunner } from '../probe/index.js';
import { createExampleClient } from './client.js';
import { startProbeSchedule } from './scheduler.js';
import { createShutdown } from './shutdown.js';

export async function runExample(configuration, { emit = console.log, dependencies = { createDb } } = {}) {
  const db = await createExampleClient(configuration, dependencies.createDb);
  let running = true;
  emit({ event: 'client.started', timestamp: new Date().toISOString() });
  const probe = createProbeRunner({ db, emit });
  await probe();
  const timer = startProbeSchedule(() => running, probe);
  return createShutdown({ isRunning: () => running, stop: () => { running = false; }, timer, db, emit });
}
