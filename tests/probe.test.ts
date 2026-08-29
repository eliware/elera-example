import { expect, jest, test } from '@jest/globals';
import { createProbeRunner } from '../src/probe.ts';

test('emits concise read/write probe telemetry', async () => {
  const db = { query: jest.fn().mockResolvedValueOnce([[{ node: 'elera-0' }]]).mockResolvedValueOnce([[{ Variable_name: 'wsrep_cluster_status', Value: 'Primary' }]]).mockResolvedValueOnce([{}]).mockResolvedValueOnce([{ insertId: 4 }]).mockResolvedValueOnce([[{ writer_node: 'elera-0' }]]), bundle: () => ({ writer: { host: 'elera-0' }, bundleVersion: '1' }), classify: () => 'writer', nodeStates: () => [] };
  const emit = jest.fn();
  await createProbeRunner({ db, emit })();
  expect(emit).toHaveBeenCalledWith(expect.objectContaining({ event: 'sql.probe', generatedId: 4, clusterStatus: 'Primary' }));
});

test('emits errors without throwing from the interval runner', async () => {
  const db = { query: jest.fn().mockRejectedValue(new Error('offline')), nodeStates: () => [] };
  const emit = jest.fn();
  await createProbeRunner({ db, emit })();
  expect(emit).toHaveBeenCalledWith(expect.objectContaining({ event: 'sql.error', error: 'offline' }));
});

test('reports elapsed gaps and current telemetry counters', async () => {
  let time = 100;
  const db = { query: jest.fn().mockImplementation(async (sql) => sql.startsWith('SELECT 1') ? [[{ node: 'elera-0' }]] : sql.startsWith('SHOW STATUS') ? [[{ Variable_name: 'wsrep_cluster_status', Value: 'Primary' }]] : sql.startsWith('INSERT') ? [{ insertId: 5 }] : sql.startsWith('SELECT writer') ? [[{ writer_node: 'elera-0' }]] : [{}]), bundle: () => ({ writer: { host: 'elera-0' }, bundleVersion: '1' }), telemetry: { snapshot: () => ({ retries: 2, reconnects: 3 }) }, classify: () => 'writer', nodeStates: () => [] };
  const emit = jest.fn();
  const runProbe = createProbeRunner({ db, emit, now: () => new Date(time), clock: () => time });
  await runProbe();
  time += 25;
  await runProbe();
  expect(emit).toHaveBeenLastCalledWith(expect.objectContaining({ gapSincePreviousMs: 25, retryCount: 2, reconnectCount: 3 }));
});

test('reports the previous interval when a later probe fails', async () => {
  let time = 100;
  const db = { query: jest.fn().mockResolvedValueOnce([[{ node: 'elera-0' }]]).mockResolvedValueOnce([[{ Variable_name: 'wsrep_cluster_status', Value: 'Primary' }]]).mockResolvedValueOnce([{}]).mockResolvedValueOnce([{ insertId: 6 }]).mockResolvedValueOnce([[{ writer_node: 'elera-0' }]]).mockRejectedValueOnce(Object.assign(new Error('offline'), { code: 'ECONNRESET' })), bundle: () => ({ writer: { host: 'elera-0' }, bundleVersion: '1' }), classify: () => 'writer', nodeStates: () => [] };
  const emit = jest.fn();
  const runProbe = createProbeRunner({ db, emit, now: () => new Date(time), clock: () => time });
  await runProbe();
  time += 25;
  await runProbe();
  expect(emit).toHaveBeenLastCalledWith(expect.objectContaining({ event: 'sql.error', gapSincePreviousMs: 25, code: 'ECONNRESET' }));
});
