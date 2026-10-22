# [![eliware.org](https://eliware.org/logos/brand.png)](https://discord.gg/M6aTR9eTwN)

## @eliware/elera-example [![License](https://img.shields.io/github/license/eliware/elera-example)](https://github.com/eliware/elera-example/blob/main/LICENSE) [![CI](https://github.com/eliware/elera-example/actions/workflows/ci.yaml/badge.svg)](https://github.com/eliware/elera-example/actions/workflows/ci.yaml)

Runnable Elera client example for routing, telemetry, and graceful lifecycle testing

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Setup](#setup)
- [Usage](#usage)
- [Development](#development)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Security](#security)
- [Configuration](#configuration)
- [Operations](#operations)
- [Commands](#commands)
- [Exit codes](#exit-codes)
- [Support](#support)
- [Links](#links)
- [License](#license)

## Features

The example checks Elera routing, cluster status, database writes, telemetry, and shutdown.

## Requirements

Use Node.js 26 or later.

## Setup

Run `npm ci` from the repository root to install the locked packages.

## Usage

Run `node --env-file=.env bin/elera-example.mjs` from the repository root.
Run `node bin/elera-example.mjs --help` to print command help.
Read the [documentation index](docs/README.md) and [specifications index](specs/README.md).
Read [release notes](RELEASE_NOTES.md) for release history.

## Development

Read [AGENTS.md](AGENTS.md) for repository development rules.

## Testing

Run `npm test` for aggregate validation.

## Troubleshooting

Read [troubleshooting](docs/troubleshooting.md) when a command fails.

## Security

Keep tokens, passwords, keys, and runtime data out of Git.

## Configuration

Copy `.env.example` to `.env` and load it with `node --env-file=.env`.
Keep `.env` out of Git.

| Variable          | Required | Default | Example                     |
| ----------------- | -------- | ------- | --------------------------- |
| `ELERA_API_URL`   | Yes      | None    | `http://127.0.0.1:8088`     |
| `ELERA_API_TOKEN` | Yes      | None    | `replace-with-scoped-token` |

## Operations

The application starts a check immediately, then schedules checks once each second. Use Ctrl+C to stop it and close its client.
Build a local container with `docker build -t elera-example .`.
Run the container with `docker run --env-file .env elera-example`.
The Dockerfile installs production dependencies and runs the example as the `node` user.

## Commands

Run `node bin/elera-example.mjs --help` to print help.
Run `node bin/elera-example.mjs --version` to print the package version.
Run the command without options to start the example.
For any other argument, the command prints an error and exits with code 2.

## Exit codes

Help and version commands return zero.
The application returns a nonzero code when configuration or startup fails.
SIGINT and SIGTERM return code zero after shutdown completes.

## Support

For help, questions, or to chat with the author and community, visit:

[![Discord](https://eliware.org/logos/discord_96.png)](https://discord.gg/M6aTR9eTwN)[![eliware.org](https://eliware.org/logos/eliware_96.png)](https://discord.gg/M6aTR9eTwN)

**[eliware.org on Discord](https://discord.gg/M6aTR9eTwN)**

## Links

- [Home Page](https://eliware.org)
- [GitHub Org](https://github.com/eliware)
- [GitHub Repo](https://github.com/eliware/elera-example)
- [Bug Reports](https://github.com/eliware/elera-example/issues)
- [Discord](https://discord.gg/M6aTR9eTwN)

## License

[MIT © Eliware](LICENSE)
