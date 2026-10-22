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

Runnable Elera client example for routing, telemetry, and graceful lifecycle testing.

## Requirements

Use Node.js 26 or later and npm 12 or later.

## Setup

Run `npm ci` from the repository root to install the locked packages.
Copy `.env.example` to `.env`. Set `ELERA_API_URL` and `ELERA_API_TOKEN` in `.env`.

## Usage

Run `node --env-file=.env bin/elera-example.mjs` from the repository root.
Run `node bin/elera-example.mjs --help` to print command help.
Read the [documentation index](docs/README.md) and [specifications index](specs/README.md).
Read [release notes](RELEASE_NOTES.md) for release history.

## Development

Read [AGENTS.md](AGENTS.md) before you change files. Keep code and tests in their assigned folders.

## Testing

Run `npm test` for aggregate validation. The command runs tests, lint, format, audit, and package checks.

## Troubleshooting

Read [troubleshooting](docs/troubleshooting.md) when a command fails.

## Security

Keep tokens, passwords, keys, and runtime data out of Git.

## Configuration

Set `ELERA_API_URL` to the Elera endpoint. Set `ELERA_API_TOKEN` to a token with read and write access.
Copy `.env.example` to `.env` and load it with `node --env-file=.env`.
Keep `.env` out of Git.

## Operations

The application checks client health and database access once each second. Use Ctrl+C to stop it and close its client.
Build a local container with `docker build -t elera-example .`.
Run the container with `docker run --env-file .env elera-example`.

## Commands

Run `node bin/elera-example.mjs --help` to print help.
Run `node bin/elera-example.mjs --version` to print the package version.
Run the command without options to start the example.

## Exit codes

Help and version commands return zero.
The application returns a nonzero code when configuration or startup fails.
The application returns zero after SIGINT or SIGTERM completes shutdown.

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
