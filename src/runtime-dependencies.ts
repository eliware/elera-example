import { createRoutingStream, type RoutingStream } from '@eliware/elera-lib';

export function createExampleRoutingStream(factory: typeof createRoutingStream | undefined, options: Parameters<typeof createRoutingStream>[0]): RoutingStream {
  return (factory ?? createRoutingStream)(options);
}
