export function defaultBundleFetch(input, init) {
  return globalThis.fetch(input, init);
}

export function defaultBundleDelay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function createBundleLoader({ endpoint, token, fetchImpl = defaultBundleFetch, delay = defaultBundleDelay }) {
  return async function loadBundle() {
    for (let attempt = 0; attempt < 10; attempt += 1) {
      const response = await fetchImpl(`${endpoint.replace(/\/$/, '')}/api/v1/routing/bundle`, {
        headers: { accept: 'application/json', authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const body = await response.json() as { data?: unknown } & Record<string, unknown>;
        return (body.data ?? body) as RoutingBundle;
      }
      if (response.status !== 401 && response.status !== 404) throw new Error(`routing bundle request failed: ${response.status}`);
      await delay(1000);
    }
    throw new Error('routing bundle request failed after metadata convergence retries');
  };
}
import type { RoutingBundle } from '@eliware/elera-lib';
