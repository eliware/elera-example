import { createDb } from "@eliware/elera-client";
export async function createExampleClient(configuration, createClient = createDb) {
  return createClient({ endpoint: configuration.url, token: configuration.token });
}
