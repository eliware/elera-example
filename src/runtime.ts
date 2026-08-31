import { createDb, type DbPool } from '@eliware/elera-client';
import { createProbeRunner } from './probe.js';
import { scheduleProbe } from './probe-scheduler.js';

export async function runExample(configuration, { emit = console.log, dependencies = { createDb } }: { emit?: (value: unknown) => void; dependencies?: { createDb?: typeof createDb } } = {}) {
  const createClient = dependencies.createDb!;
  const db: DbPool = await createClient({ endpoint: configuration.url, token: configuration.token });
  let running = true;
  emit({ event: 'client.started', timestamp: new Date().toISOString() });
  const probe = createProbeRunner({ db, emit });
  const timer = setInterval(() => scheduleProbe(running, probe), 1000);
  await probe();
  return async function shutdown() {
    if (!running) return;
    running = false;
    clearInterval(timer);
    await db.end();
    emit({ event: 'client.stopped', timestamp: new Date().toISOString() });
  };
}
