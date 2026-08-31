# Source-to-test inventory

Each non-barrel source module is exercised by a focused or composition test
under the matching `tests/` subtree. `index.ts` files are composition modules;
`app.ts` is wiring-only and is exercised through the runtime-entrypoint tests.

| Source | Test | Coverage focus |
| --- | --- | --- |
| `src/configuration/index.ts` | `tests/configuration/index.test.ts` | Configuration |
| `src/lifecycle/index.ts` | `tests/lifecycle/index.test.mjs` | Signal and process-handler registration |
| `src/probe/runner.ts` | `tests/probe/runner.test.ts` | Read/write composition and errors |
| `src/probe/{health,status,schema,write,readback}.ts` | `tests/probe/runner.test.ts` | Query, schema, transaction, and readback composition |
| `src/probe/{events,result-summary,telemetry-state,telemetry,queries}.ts` | `tests/probe/runner.test.ts` | Telemetry composition and summaries |
| `src/runtime/index.ts` | `tests/runtime/lifecycle.test.mjs` | Startup and initial probe |
| `src/runtime/client.ts` | `tests/runtime/lifecycle.test.mjs` | Public client construction |
| `src/runtime/shutdown.ts` | `tests/runtime/lifecycle.test.mjs` | Idempotent cleanup and stop telemetry |
| `src/runtime/scheduler/{core,index}.ts` | `tests/runtime/scheduler/index.test.mjs` | Scheduling |
| `src/probe/index.ts`, `src/runtime/scheduler/index.ts` | Composition imports | Barrels only |

The application is private and is not a published library, so package
`exports` and declaration files are intentionally not provided. Build output
is generated in `dist/` and ignored by Git.
