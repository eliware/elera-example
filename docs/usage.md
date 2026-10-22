# Usage

This guide explains how to install, configure, and run the Elera Example.

## Requirements

Install Node.js 26 or later and npm 12 or later.

## Install

Run `npm ci` from the repository root to install the locked dependencies.

## Configure

Copy `.env.example` to `.env`. Set `ELERA_API_URL` to the Elera endpoint and set
`ELERA_API_TOKEN` to a token with read and write access. Keep `.env` out of Git.

## Run

Run `node --env-file=.env bin/elera-example.mjs` from the repository root.
The application checks the client, reads cluster status, writes an example row, and reads
that row. It repeats these checks every second.

The application logs `sql.probe` after a check completes. It logs `sql.error` when a
check fails. Use Ctrl+C to stop the application and close the client.

Run `node bin/elera-example.mjs --help` to print command help. Run
`node bin/elera-example.mjs --version` to print the package version.
