import { expect, jest, test } from '@jest/globals';
import { createBundleLoader, defaultBundleDelay } from '../dist/src/bundle.js';

test('default bundle delay resolves', async () => {
  await expect(defaultBundleDelay(0)).resolves.toBeUndefined();
});

test('loads wrapped bundles and retries metadata convergence responses', async () => {
  const fetchImpl = jest.fn().mockResolvedValueOnce({ ok: false, status: 404 }).mockResolvedValue({ ok: true, json: async () => ({ data: { bundleVersion: '1', routes: { primary: [] } } }) });
  const bundle = await createBundleLoader({ endpoint: 'http://router/', token: 'secret', fetchImpl, delay: async () => {} })();
  expect(bundle.bundleVersion).toBe('1');
  expect(fetchImpl).toHaveBeenCalledTimes(2);
  expect(fetchImpl.mock.calls[0][0]).toBe('http://router/api/v1/routing/bundle');
});

test('accepts an unwrapped bundle and uses the default retry delay', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ bundleVersion: '2', routes: { primary: [] } }) });
  try {
    const bundle = await createBundleLoader({ endpoint: 'http://router', token: 'secret' })();
    expect(bundle.bundleVersion).toBe('2');
  } finally { globalThis.fetch = originalFetch; }
});

test('fails on unexpected HTTP responses and exhausted retries', async () => {
  await expect(createBundleLoader({ endpoint: 'http://router', token: 'secret', fetchImpl: async () => ({ ok: false, status: 500 }), delay: async () => {} })()).rejects.toThrow('500');
  await expect(createBundleLoader({ endpoint: 'http://router', token: 'secret', fetchImpl: async () => ({ ok: false, status: 404 }), delay: async () => {} })()).rejects.toThrow('after metadata convergence retries');
});
