import { createDb, createRoutingStream, type RoutingBundle } from '@eliware/elera-lib';
import { createBundleLoader } from './bundle.js';
import { createProbeRunner } from './probe.js';
import { createClientIdentity } from './client-identity.js';
import { createExampleRoutingStream } from './runtime-dependencies.js';
import { scheduleProbe } from './probe-scheduler.js';

function profilesFromBundle(bundle: RoutingBundle) {
  const route = bundle.routes.primary?.[0];
  const credentials = bundle.credentials;
  if (!route || !credentials?.username || typeof credentials.password !== 'string' || !bundle.database) {
    throw new Error('routing bundle does not contain a usable primary connection');
  }
  const primary = { host: route.host, port: route.port, user: credentials.username, password: credentials.password, database: bundle.database };
  const balancedRoute = bundle.routes.balanced?.[0];
  const balanced = balancedRoute ? { ...primary, host: balancedRoute.host, port: balancedRoute.port } : undefined;
  return { primary, balanced };
}

export async function runExample(configuration, { emit = console.log, dependencies = {} }: { emit?: (value: unknown) => void; dependencies?: { fetchImpl?: typeof fetch; createDb?: typeof createDb; createRoutingStream?: typeof createRoutingStream } } = {}) {
  const loadBundle = createBundleLoader({ endpoint: configuration.endpoint, token: configuration.token, fetchImpl: dependencies.fetchImpl });
  const bundle = await loadBundle();
  const createClient = dependencies.createDb ?? createDb;
  const clientIdentity = createClientIdentity();
  const db = await createClient({ ...profilesFromBundle(bundle), bundle, identity: clientIdentity, telemetry: true });
  const stream = createExampleRoutingStream(dependencies.createRoutingStream, { endpoint: configuration.endpoint, token: configuration.token, fetchBundle: loadBundle, onUpdate: (event: any) => emit({ event: event.type, timestamp: new Date().toISOString(), version: event.version, routes: event.bundle?.routes }), onError: (error: any) => emit({ event: 'routing.error', timestamp: new Date().toISOString(), error: error.message }) });
  await db.attachRoutingStream(stream);
  let running = true;
  emit({ event: 'client.started', timestamp: new Date().toISOString(), clientIdentity });
  const probe = createProbeRunner({ db, emit });
  const timer = setInterval(() => scheduleProbe(running, probe), 1000);
  await probe();
  return async function shutdown() {
    if (!running) return;
    running = false;
    clearInterval(timer);
    stream.close();
    await db.close();
  };
}
