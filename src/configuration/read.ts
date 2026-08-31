export function readConfiguration(environment = process.env) {
  const configuration = {
    url: environment.ELERA_API_URL,
    token: environment.ELERA_API_TOKEN,
    debug: environment.ELERA_DEBUG === '1',
  };
  const missing = ['url', 'token'].filter((name) => !configuration[name]);
  if (missing.length > 0) throw new Error(`sample app requires: ${missing.join(', ')}`);
  return configuration;
}
