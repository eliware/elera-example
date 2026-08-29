import { generate } from '@eliware/snowflake';

export function createClientIdentity(generator: () => string = generate): string {
  const identity = generator();
  if (typeof identity !== 'string' || identity.length === 0) throw new Error('Snowflake client identity must be a non-empty string');
  return identity;
}
