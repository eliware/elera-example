import { expect, jest, test } from '@jest/globals';
import { runExample } from '../dist/src/runtime.js';

function fakeDb() {
  return {
    close: jest.fn(async () => undefined),
    bundle: () => ({ bundleVersion: 'v1', writer: { host: 'writer' }, routes: { primary: [], balanced: [] } }),
    classify: (sql) => sql.startsWith('SELECT') ? 'read' : 'write',
    nodeStates: () => [],
    telemetry: { snapshot: () => ({ retries: 0, reconnects: 0 }) },
    query: jest.fn()
      .mockResolvedValueOnce([[{ node: 'reader' }]])
      .mockResolvedValueOnce([[{ Variable_name: 'wsrep_local_state_comment', Value: 'Synced' }, { Variable_name: 'wsrep_cluster_status', Value: 'Primary' }]])
      .mockResolvedValueOnce([{}])
      .mockResolvedValueOnce([{ insertId: 1 }])
      .mockResolvedValueOnce([[{ writer_node: 'writer' }]])
      .mockResolvedValue([[]]),
  };
}

test('starts the client with endpoint and token and shuts down cleanly', async () => {
  const emit = jest.fn();
  const db = fakeDb();
  const shutdown = await runExample(
    { endpoint: 'http://router', token: 'application-token', debug: false },
    { emit, dependencies: { createDb: async () => db } },
  );
  await shutdown();
  await shutdown();
  expect(db.close).toHaveBeenCalled();
  expect(emit).toHaveBeenCalledWith(expect.objectContaining({ event: 'sql.probe', generatedId: 1 }));
});

test('schedules recurring probes while running', async () => {
  jest.useFakeTimers();
  const db = fakeDb();
  const shutdown = await runExample({ endpoint: 'http://router', token: 'token' }, {
    emit: jest.fn(), dependencies: { createDb: async () => db },
  });
  jest.advanceTimersByTime(1000);
  await Promise.resolve();
  await shutdown();
  jest.useRealTimers();
  expect(db.query).toHaveBeenCalled();
});

test('rejects an unusable bundle before starting the example', async () => {
  await expect(runExample({ endpoint: 'http://router', token: 'token' }, {
      dependencies: { fetchImpl: async () => ({ ok: true, async json() { return { apiVersion: 'v1', application: 'example', database: 'db', identity: 'client', credentials: { username: 'u', password: 'p' }, routes: { primary: [], balanced: [] }, writer: { host: 'writer', port: 3306 }, readers: [], failover: [], bundleVersion: 1, nodeIdentity: 'writer', ports: { sql: 3306, http: 8080 }, expiresAt: '2099-01-01T00:00:00Z' }; } }) },
  })).rejects.toThrow('primary.host is required');
});
