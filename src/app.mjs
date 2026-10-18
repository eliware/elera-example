import { readConfiguration } from "./configuration/read.mjs";
import { runExample } from "./runtime/run.mjs";
import { log } from "@eliware/common";
import { registerExampleLifecycle } from "./lifecycle/register.mjs";
const shutdown = await runExample(readConfiguration());
// Keep process handlers active for the process lifetime.
const _lifecycle = registerExampleLifecycle(shutdown);
log.info("Elera example client is running");
