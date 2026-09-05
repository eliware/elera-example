import { readConfiguration } from './src/configuration/index.js';
import { runExample } from './src/runtime/index.js';
import { log } from '@eliware/common';
import { registerExampleLifecycle } from './src/lifecycle/index.js';

const shutdown = await runExample(readConfiguration());
// Intentional: retain registered signal/exception handlers for process life.
const _lifecycle = registerExampleLifecycle(shutdown);
log.info('Elera example client is running');
