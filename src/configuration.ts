export function readConfiguration(environment = process.env) {
  const configuration = {
    endpoint: environment.ELERA_API_ENDPOINT,
    token: environment.ELERA_API_TOKEN,
    debug: environment.ELERA_DEBUG === '1',
  };
  const missing = ['endpoint', 'token'].filter((name) => !configuration[name]);
  if (missing.length > 0) throw new Error(`sample app requires: ${missing.join(', ')}`);
  return configuration;
}
