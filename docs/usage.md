# Usage

This guide explains how to install, configure, and run the Elera Example.

## Requirements

Use Node.js 26 or later and npm 12 or later. Connect to an Elera endpoint that the host can contact.
Use a token with permission to read cluster status and create, read, and write the example table.

## Install

Clone this repository and change to its root directory. Run `npm ci` to install the locked packages.
The package is private, so run it from the repository checkout. Do not install it from npm.

## Configure

Copy `.env.example` to `.env`. Set `ELERA_API_URL` to the endpoint URL and replace the sample
value of `ELERA_API_TOKEN` with your token. Keep `.env` out of Git and do not share its contents.

The example needs permission to run a health query, read Galera cluster status, create the
`e2e_probe` table, and select or insert rows in that table. Configure access through your Elera
environment before you start the application.

## Run

Run `node --env-file=.env bin/elera-example.mjs` from the repository root. The first database
check starts immediately. The application schedules a check every second.

If the first check fails, the application closes the client and exits with a nonzero status.

Each check reads client health and Galera status. It creates `e2e_probe` if needed, inserts a row
inside a transaction, and reads the row to report its writer node. The application does not remove
the table or its rows. Repeated runs add rows to the table.

## Read the output

The application writes structured log records. A `sql.probe` event reports a completed check.
Its fields report timing, routing, transaction status, read and write nodes, generated row ID, and
cluster status. A `sql.error` event reports a failed check with its error message and code.

The application continues scheduling checks after a database check fails. Examine the `sql.error`
record and see [Troubleshooting](troubleshooting.md) for common causes. Check log records before
sharing them because error text can contain operational details.

## Stop the application

Use Ctrl+C or send SIGTERM to stop the application. The shutdown handler stops the schedule, waits
for any active check, and closes the Elera client.

## Run in a container

Build the image from the repository root with `docker build -t elera-example .`. Start it with
`docker run --env-file .env elera-example`. The container reads the same two environment variables.

Set `ELERA_API_URL` to an endpoint that the container can contact. The sample address `127.0.0.1`
points to the container itself when the application runs in Docker. This repository provides a
Dockerfile and does not provide a Compose file.

## CLI commands

Run `node bin/elera-example.mjs --help` to print usage. Run
`node bin/elera-example.mjs --version` to print the package version. These commands do not require
the Elera endpoint or token.
For any other argument, the command prints an error and exits with code 2.

## Validate a checkout

Run `npm test` from the repository root to run the tests and repository checks.
