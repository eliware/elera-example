import { expect, jest, test } from '@jest/globals';
import { createProbeRunner } from '../src/probe.ts';

test('emits concise read/write probe telemetry', async () => {
  const connection = { beginTransaction: jest.fn(), commit: jest.fn(), rollback: jest.fn(), release: jest.fn(), execute: jest.fn().mockResolvedValue([{ insertId: 4 }]) };
  const db = { execute: jest.fn().mockResolvedValueOnce([[{ node: 'elera-0' }]]).mockResolvedValueOnce([[{ Variable_name: 'wsrep_cluster_status', Value: 'Primary' }]]).mockResolvedValueOnce([{}]).mockResolvedValueOnce([[{ writer_node: 'elera-0' }]]), getConnection: jest.fn().mockResolvedValue(connection) };
  const emit = jest.fn();
  await createProbeRunner({ db, emit })();
  expect(emit).toHaveBeenCalledWith(expect.objectContaining({ event: 'sql.probe', operation: 'read+write', readNode: 'elera-0', readbackNode: 'elera-0', generatedId: 4, clusterStatus: 'Primary', latencyMs: expect.any(Number) }));
});

test('emits errors without throwing from the interval runner', async () => {
  const db = { execute: jest.fn().mockRejectedValue(new Error('offline')) };
  const emit = jest.fn();
  await createProbeRunner({ db, emit })();
  expect(emit).toHaveBeenCalledWith(expect.objectContaining({ event: 'sql.error', error: 'offline', startedAt: expect.any(String), finishedAt: expect.any(String), durationMs: expect.any(Number) }));
});

test('reports elapsed gaps and current telemetry counters', async () => {
  let time = 100;
  const connection = { beginTransaction: jest.fn(), commit: jest.fn(), rollback: jest.fn(), release: jest.fn(), execute: jest.fn().mockResolvedValue([{ insertId: 5 }]) };
  const db = { execute: jest.fn().mockImplementation(async (sql) => sql.startsWith('SELECT 1') ? [[{ node: 'elera-0' }]] : sql.startsWith('SHOW STATUS') ? [[{ Variable_name: 'wsrep_cluster_status', Value: 'Primary' }]] : sql.startsWith('SELECT writer') ? [[{ writer_node: 'elera-0' }]] : [{}]), getConnection: jest.fn().mockResolvedValue(connection) };
  const emit = jest.fn();
  const runProbe = createProbeRunner({ db, emit, now: () => new Date(time), clock: () => time });
  await runProbe();
  time += 25;
  await runProbe();
  expect(emit).toHaveBeenLastCalledWith(expect.objectContaining({ gapSincePreviousMs: 25 }));
});

test('reports the previous interval when a later probe fails', async () => {
  let time = 100;
  const connection = { beginTransaction: jest.fn(), commit: jest.fn(), rollback: jest.fn(), release: jest.fn(), execute: jest.fn().mockResolvedValue([{ insertId: 6 }]) };
  const db = { execute: jest.fn().mockResolvedValueOnce([[{ node: 'elera-0' }]]).mockResolvedValueOnce([[{ Variable_name: 'wsrep_cluster_status', Value: 'Primary' }]]).mockResolvedValueOnce([{}]).mockResolvedValueOnce([[{ writer_node: 'elera-0' }]]).mockRejectedValueOnce(Object.assign(new Error('offline'), { code: 'ECONNRESET' })), getConnection: jest.fn().mockResolvedValue(connection) };
  const emit = jest.fn();
  const runProbe = createProbeRunner({ db, emit, now: () => new Date(time), clock: () => time });
  await runProbe();
  time += 25;
  await runProbe();
  expect(emit).toHaveBeenLastCalledWith(expect.objectContaining({ event: 'sql.error', gapSincePreviousMs: 25, code: 'ECONNRESET' }));
});

test('rolls back and releases when the transaction write fails', async () => {
  const error = Object.assign(new Error('write failed'), { code: 'EWRITE' });
  const connection = { beginTransaction: jest.fn(), commit: jest.fn(), rollback: jest.fn(), release: jest.fn(), execute: jest.fn().mockRejectedValue(error) };
  const db = { execute: jest.fn().mockResolvedValueOnce([[{ node: 'elera-0' }]]).mockResolvedValueOnce([[]]).mockResolvedValueOnce([{}]), getConnection: jest.fn().mockResolvedValue(connection) };
  const emit = jest.fn();
  await createProbeRunner({ db, emit })();
  expect(connection.rollback).toHaveBeenCalledTimes(1);
  expect(connection.release).toHaveBeenCalledTimes(1);
  expect(emit).toHaveBeenCalledWith(expect.objectContaining({ event: 'sql.error', error: 'write failed', code: 'EWRITE' }));
});
