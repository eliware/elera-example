import { createDb, type DbPool } from '@eliware/elera-client';

export async function createExampleClient(configuration, createClient = createDb): Promise<DbPool> {
  return createClient({ endpoint: configuration.url, token: configuration.token });
}
