import { createProbeRunner } from '../probe/index.js';

export async function startExample({ db, emit }) {
  emit({ event: 'client.started', timestamp: new Date().toISOString() });
  const probe = createProbeRunner({ db, emit });
  await probe();
  return probe;
}
