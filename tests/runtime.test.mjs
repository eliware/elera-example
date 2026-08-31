import { expect, jest, test } from '@jest/globals';
import { runExample } from '../dist/src/runtime.js';

function fakeDb() {
  return {
    probe: jest.fn(async () => ({ ok: true, route: 'primary', result: [[{ node: 'reader' }], []], transaction: 'started', released: true })),
    end: jest.fn(async () => undefined),
    getConnection: jest.fn(async () => ({ beginTransaction: jest.fn(), commit: jest.fn(), rollback: jest.fn(), release: jest.fn(), execute: jest.fn().mockResolvedValue([{ insertId: 1 }]) })),
    execute: jest.fn()
      .mockResolvedValueOnce([[{ node: 'reader' }]])
      .mockResolvedValueOnce([[{ Variable_name: 'wsrep_local_state_comment', Value: 'Synced' }, { Variable_name: 'wsrep_cluster_status', Value: 'Primary' }]])
      .mockResolvedValueOnce([{}])
      .mockResolvedValueOnce([[{ writer_node: 'writer' }]])
      .mockResolvedValue([[]]),
  };
}

test('starts the client with endpoint and token and shuts down cleanly', async () => {
  const emit = jest.fn();
  const db = fakeDb();
  const createClient = jest.fn(async () => db);
  const shutdown = await runExample(
    { url: 'http://router', token: 'application-token', debug: false },
    { emit, dependencies: { createDb: createClient } },
  );
  await shutdown();
  await shutdown();
  expect(db.end).toHaveBeenCalledTimes(1);
  expect(emit).toHaveBeenCalledWith(expect.objectContaining({ event: 'client.stopped', timestamp: expect.any(String) }));
  expect(createClient).toHaveBeenCalledWith({ endpoint: 'http://router', token: 'application-token' });
  expect(emit).toHaveBeenCalledWith(expect.objectContaining({ event: 'client.started', timestamp: expect.any(String) }));
  expect(emit).toHaveBeenCalledWith(expect.objectContaining({ event: 'sql.probe', generatedId: 1 }));
});

test('waits for the initial probe before scheduling recurring probes', async () => {
  jest.useFakeTimers();
  const events = [];
  const db = fakeDb();
  db.probe.mockImplementationOnce(async () => {
    events.push('initial-start');
    await Promise.resolve();
    events.push('initial-end');
    return { ok: true, route: 'primary', result: [[{ node: 'reader' }], []], transaction: 'started', released: true };
  });
  const shutdown = await runExample({ url: 'http://router', token: 'token' }, {
    emit: () => {}, dependencies: { createDb: async () => db },
  });
  expect(events).toEqual(['initial-start', 'initial-end']);
  await shutdown();
  jest.useRealTimers();
});

test('schedules recurring probes while running', async () => {
  jest.useFakeTimers();
  const db = fakeDb();
  const shutdown = await runExample({ url: 'http://router', token: 'token' }, {
    emit: jest.fn(), dependencies: { createDb: async () => db },
  });
  jest.advanceTimersByTime(1000);
  await Promise.resolve();
  await shutdown();
  jest.useRealTimers();
  expect(db.execute).toHaveBeenCalled();
});

test('rejects a client creation failure before starting the example', async () => {
  await expect(runExample({ url: 'http://router', token: 'token' }, {
    dependencies: { createDb: async () => { throw new Error('primary.host is required'); } },
})).rejects.toThrow('primary.host is required');
});

test('emits no stopped marker when db.end fails', async () => {
  const emit = jest.fn();
  const db = fakeDb();
  db.end.mockRejectedValueOnce(new Error('close failed'));
  const shutdown = await runExample({ url: 'http://router', token: 'token' }, {
    emit, dependencies: { createDb: async () => db },
  });
  await expect(shutdown()).rejects.toThrow('close failed');
  expect(emit).not.toHaveBeenCalledWith(expect.objectContaining({ event: 'client.stopped' }));
});
