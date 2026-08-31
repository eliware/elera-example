import { expect, test } from '@jest/globals';
import { createDb } from '@eliware/elera-client';

const bundle = { apiVersion: 'v1', application: 'example', database: 'example_db', physicalDatabase: 'elera_db_123', identity: 'example-client', credentials: { username: 'example', password: 'test-only' }, routes: { primary: [{ host: 'elera-0', port: 3306 }], balanced: [{ host: 'elera-0', port: 3306 }] }, writer: { host: 'elera-0', port: 3306 }, readers: [], failover: [], bundleVersion: 1, nodeIdentity: 'elera-0', ports: { sql: 3306, http: 8080 }, expiresAt: '2099-01-01T00:00:00Z' };

class MockSupervisorSocket {
  constructor(url) { this.url = url; this.readyState = 0; queueMicrotask(() => { this.readyState = 1; this.onopen?.(); }); }
  close() { this.readyState = 3; this.onclose?.(); }
}

test('uses only endpoint and token with a mock supervisor', async () => {
  const fetchImpl = async (url, options) => {
    expect(url).toBe('http://mock-supervisor:8080/api/v1/routing/bundle');
    expect(options.headers.authorization).toBe('Bearer example-token');
    return { ok: true, json: async () => ({ ok: true, operation: 'routing.bundle', data: bundle }) };
  };
  const db = await createDb({ endpoint: 'http://mock-supervisor:8080', token: 'example-token', fetchImpl, WebSocketImpl: MockSupervisorSocket });
  expect(typeof db.query).toBe('function');
  expect(typeof db.execute).toBe('function');
  expect(typeof db.getConnection).toBe('function');
  expect(typeof db.end).toBe('function');
  await db.end();
});
