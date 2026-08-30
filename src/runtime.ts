import { createDb, type DbClient } from '@eliware/elera-client';
import { createProbeRunner } from './probe.js';
import { scheduleProbe } from './probe-scheduler.js';

export async function runExample(configuration, { emit = console.log, dependencies = {} }: { emit?: (value: unknown) => void; dependencies?: { createDb?: typeof createDb; fetchImpl?: typeof fetch } } = {}) {
  const createClient = dependencies.createDb ?? createDb;
  const db: DbClient = await createClient({ endpoint: configuration.endpoint, token: configuration.token, fetchImpl: dependencies.fetchImpl, telemetry: true });
  let running = true;
  emit({ event: 'client.started', timestamp: new Date().toISOString() });
  const probe = createProbeRunner({ db, emit });
  const timer = setInterval(() => scheduleProbe(running, probe), 1000);
  await probe();
  return async function shutdown() {
    if (!running) return;
    running = false;
    clearInterval(timer);
    await db.close();
  };
}
