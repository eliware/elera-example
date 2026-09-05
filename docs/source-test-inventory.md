# Source-to-test inventory

Each non-barrel source module is exercised by a focused or composition test
under the matching `tests/` subtree. `index.ts` files are composition modules;
`app.ts` is wiring-only and is validated by the build plus the lifecycle and
runtime composition tests rather than imported directly (to avoid installing
process signal handlers during the unit suite).

| Source | Test | Coverage focus |
| --- | --- | --- |
| `src/configuration/index.ts` | `tests/configuration/index.test.ts` | Configuration barrel |
| `src/configuration/read.ts` | `tests/configuration/read.test.ts` | Environment configuration parsing |
| `src/lifecycle/index.ts` | `tests/lifecycle/index.test.ts` | Signal and process-handler registration |
| `src/lifecycle/register.ts` | `tests/lifecycle/register.test.ts` | Lifecycle registration implementation |
| `src/probe/runner.ts` | `tests/probe/runner.test.ts` | Read/write composition and errors |
| `src/probe/health.ts` | `tests/probe/health.test.ts` | Health query |
| `src/probe/status.ts` | `tests/probe/status.test.ts` | Status mapping |
| `src/probe/schema.ts` | `tests/probe/schema.test.ts` | Table creation |
| `src/probe/write.ts` | `tests/probe/write.test.ts` | Transactional write |
| `src/probe/readback.ts` | `tests/probe/readback.test.ts` | Writer readback |
| `src/probe/result-summary.ts` | `tests/probe/result-summary.test.ts` | Result summary |
| `src/probe/telemetry-state.ts` | `tests/probe/telemetry-state.test.ts` | State initialization |
| `src/probe/events.ts` | `tests/probe/events.test.ts` | Success/failure events |
| `src/probe/events/success.ts` | `tests/probe/events/success.test.ts` | Success event formatting |
| `src/probe/events/failure.ts` | `tests/probe/events/failure.test.ts` | Failure event formatting |
| `src/probe/telemetry.ts` | `tests/probe/telemetry.test.ts` | Telemetry lifecycle |
| `src/probe/queries.ts` | `tests/probe/queries.test.ts` | Probe composition |
| `src/runtime/index.ts` | `tests/runtime/index.test.ts` | Startup, scheduling, and cleanup |
| `src/runtime/run.ts` | `tests/runtime/run.test.ts` | Runtime assembly |
| `src/runtime/startup.ts` | `tests/runtime/startup.test.ts` | Initial startup/probe |
| `src/runtime/schedule.ts` | `tests/runtime/schedule.test.ts` | Recurring schedule wiring |
| `src/runtime/client.ts` | `tests/runtime/client.test.ts` | Public client construction |
| `src/runtime/shutdown.ts` | `tests/runtime/shutdown.test.ts` | Idempotent cleanup |
| `src/runtime/scheduler/core.ts` | `tests/runtime/scheduler/core.test.ts` | Active scheduling gate |
| `src/runtime/scheduler/index.ts` | `tests/runtime/scheduler/index.test.ts` | Interval scheduling |
| `src/probe/index.ts` | `tests/probe/index.test.ts` | Public barrel/client contract smoke test |

The application is private and is not a published library, so package
`exports` and declaration files are intentionally not provided. Build output
is generated in `dist/` and ignored by Git.

Composition-test exception: runtime scheduling, shutdown, and error paths are
covered in the runtime composition suite in addition to focused module tests.
The focused tests intentionally do not duplicate every branch already covered
by those composition cases.
