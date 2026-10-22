import { createProbeRunner } from "../probe/runner.mjs";
export async function startExample({ db, emit, createProbe = createProbeRunner }) {
  emit({ event: "client.started", timestamp: new Date().toISOString() });
  const probe = createProbe({ db, emit });
  if (!(await probe())) throw new Error("Initial Elera check failed");
  return probe;
}
