import { createDb } from '@eliware/elera-client';

const bundle = { apiVersion: 'v1', application: 'example', database: 'example_db', identity: 'example-client', credentials: { username: 'example', password: 'test-only' }, routes: { primary: [{ host: 'elera-0', port: 3306 }], balanced: [{ host: 'elera-0', port: 3306 }] }, writer: { host: 'elera-0', port: 3306 }, readers: [], failover: [], bundleVersion: 1, nodeIdentity: 'elera-0', ports: { sql: 3306, http: 8080 }, expiresAt: '2099-01-01T00:00:00Z' };

class MockSupervisorSocket {
  constructor(url) { this.url = url; this.readyState = 0; queueMicrotask(() => { this.readyState = 1; this.onopen?.(); }); }
  close() { this.readyState = 3; this.onclose?.(); }
}

function mockDriver() {
  const queries = [];
  return { queries, createPool: () => ({ query: async (sql) => { queries.push(sql); return [[{ value: 1 }]]; }, execute: async (sql) => { queries.push(sql); return [[{ value: 1 }]]; }, getConnection: async () => ({ query: async () => [[]], execute: async () => [[]], beginTransaction: async () => {}, commit: async () => {}, rollback: async () => {}, release: () => {} }), end: async () => {} }) };
}

test('uses only endpoint and token with a mock supervisor and SQL server', async () => {
  const driver = mockDriver();
  const fetchImpl = async (url, options) => {
    expect(url).toBe('http://mock-supervisor:8080/api/v1/routing/bundle');
    expect(options.headers.authorization).toBe('Bearer example-token');
    return { ok: true, json: async () => bundle };
  };
  const db = await createDb({ endpoint: 'http://mock-supervisor:8080', token: 'example-token', fetchImpl, WebSocketImpl: MockSupervisorSocket, mysqlLib: driver });
  await expect(db.query('SELECT 1')).resolves.toEqual([[{ value: 1 }]]);
  expect(driver.queries).toEqual(['SELECT 1']);
  await db.close();
});
