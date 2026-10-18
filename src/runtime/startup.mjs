import { createProbeRunner } from "../probe/runner.mjs";
export async function startExample({ db, emit }) {
  emit({ event: "client.started", timestamp: new Date().toISOString() });
  const probe = createProbeRunner({ db, emit });
  await probe();
  return probe;
}
