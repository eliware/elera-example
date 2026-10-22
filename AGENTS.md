# AGENTS.md

## Project

Build `@eliware/elera-example` with Node.js 26 or later and native ESM.

## Scope and boundaries

Provide a runnable Elera client example for routing, telemetry, and graceful lifecycle checks.
Do not publish or deploy during validation.

## Layout

Keep runtime code in `src/`, tests in `tests/`, docs in `docs/`, and specifications in `specs/`.

## Development

Give each source module one purpose. Keep source files under 100 lines. Keep test files under 200 lines.

## Validation

Use Node.js 26 or later and npm 12 or later.

Run `npm test` for aggregate validation.
Run `npm run lint` for lint checks.
Run `npm run audit` for dependency checks.
Run `npm run format` to format files.
Run `npm run format:check` to check formatting.
Run `npm run pack` to check package contents.

## Security

Keep credentials, tokens, secrets, and private data out of logs.

## Changes

Keep docs current. Follow the shared repository rules.

## Application

Keep application code under `src/`. Keep launchers under `bin/`. Keep app settings out of source files.

Run focused tests first during development.
Run one test file with `npm test -- tests/path/to/example.test.mjs`.
Run multiple test files with `npm test -- tests/path/to/first.test.mjs tests/path/to/second.test.mjs`.
Prevent repeated full-suite runs during development.
Run the full `npm test` suite for final validation before a commit, milestone, or release.

## CLI

Provide `--help` and `--version`.
Return the package version from `--version`.
