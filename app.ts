import { readConfiguration } from './src/configuration.js';
import { runExample } from './src/runtime.js';
import { log } from '@eliware/common';
import { registerExampleLifecycle } from './src/lifecycle.js';

const shutdown = await runExample(readConfiguration());
const lifecycle = registerExampleLifecycle(shutdown);
log.info('Elera example client is running');
