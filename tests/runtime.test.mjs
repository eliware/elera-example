import { expect, jest, test } from '@jest/globals';
import { runExample } from '../dist/src/runtime.js';

test('starts the observation client with endpoint and token and shuts down cleanly', async () => {
  const emit = jest.fn();
  const close = jest.fn();
  const stream = { close };
  const db = {
    attachRoutingStream: jest.fn(async () => undefined),
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
      .mockResolvedValueOnce([[{ writer_node: 'writer' }]]),
  };
  const shutdown = await runExample(
    { endpoint: 'http://router', token: 'application-token', debug: false },
    {
      emit,
      dependencies: {
        fetchImpl: async () => ({ ok: true, async json() { return { data: { database: 'sample_app', credentials: { username: 'u', password: 'p' }, routes: { primary: [{ host: 'writer', port: 3306 }], balanced: [{ host: 'reader', port: 3306 }] }, bundleVersion: 'v1' } }; } }),
        createDb: async () => db,
        createRoutingStream: () => stream,
      },
    },
  );
  await shutdown();
  expect(db.attachRoutingStream).toHaveBeenCalledWith(stream);
  expect(db.close).toHaveBeenCalled();
  expect(close).toHaveBeenCalled();
  expect(emit).toHaveBeenCalledWith(expect.objectContaining({ event: 'sql.probe', generatedId: 1 }));
});

test('uses defaults, reports routing errors, and rejects unusable bundles', async () => {
  jest.useFakeTimers();
  await expect(runExample({ endpoint: 'http://router', token: 'token' }, {
    dependencies: {
      fetchImpl: async () => ({ ok: true, async json() { return { data: { database: 'db', credentials: { username: 'u', password: 'p' }, routes: { primary: [] } } }; } }),
    },
  })).rejects.toThrow('usable primary connection');

  const emit = jest.fn();
  const stream = { close: jest.fn() };
  const db = {
    attachRoutingStream: jest.fn(async () => undefined), close: jest.fn(async () => undefined),
    bundle: () => ({ bundleVersion: 'v1', routes: { primary: [], balanced: [] } }),
    classify: () => 'read', nodeStates: () => [], telemetry: { snapshot: () => ({}) },
    query: jest.fn().mockResolvedValue([[{ node: 'reader' }]]),
  };
  const stop = await runExample({ endpoint: 'http://router', token: 'token' }, {
    emit,
    dependencies: {
      fetchImpl: async () => ({ ok: true, async json() { return { data: { database: 'db', credentials: { username: 'u', password: 'p' }, routes: { primary: [{ host: 'writer', port: 3306 }] }, bundleVersion: 'v1' } }; } }),
      createDb: async () => db,
      createRoutingStream: (options) => { options.onError(new Error('stream down')); options.onUpdate({ type: 'routing.update', version: 'v2', bundle: { routes: {} } }); return stream; },
    },
  });
  jest.advanceTimersByTime(1000);
  await stop();
  await stop();
  expect(emit).toHaveBeenCalledWith(expect.objectContaining({ event: 'routing.error', error: 'stream down' }));
  expect(emit).toHaveBeenCalledWith(expect.objectContaining({ event: 'routing.update', version: 'v2' }));
  expect(stream.close).toHaveBeenCalledTimes(1);
  jest.useRealTimers();
});
