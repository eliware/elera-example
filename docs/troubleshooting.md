# Troubleshooting

## Missing configuration

If startup reports missing `url` or `token`, check that `ELERA_API_URL` and `ELERA_API_TOKEN` are
set in the process environment or in `.env`. Use `node --env-file=.env bin/elera-example.mjs` to
load the file. Run the command from the repository root so Node.js can find `.env`.

## Endpoint connection errors

Check that the endpoint URL uses the correct protocol, host, and port. Confirm that the host or
container can contact the endpoint through its network and firewall rules. In Docker, `127.0.0.1`
refers to the container itself, not the host machine.

## Authentication errors

Check that the token is current and belongs to the intended Elera environment. Confirm that the
token identity can access the endpoint. Keep the token out of logs, screenshots, and support
messages.

## Permission errors

The application reads Galera status and creates the `e2e_probe` table when needed. It also inserts
and reads rows in that table. Grant the token identity access for these operations, then start the
application again.

## Database check errors

The application logs a `sql.error` event when a check fails. The message and code can help identify
an endpoint, permission, or database issue. The application continues to schedule checks, so use
the event sequence and timestamps to compare later attempts.

## Unexpected cluster status

The application reads `wsrep_local_state_comment` and `wsrep_cluster_status`. Check that the
endpoint routes to a Galera cluster and that the token identity can read these status values.

## Shutdown errors

Use Ctrl+C or send SIGTERM to stop the application. The shutdown handler closes the Elera client.
If logs report a close error, check endpoint health and client connectivity before restarting.

## Repository validation

Run `npm ci` from the repository root to restore locked dependencies. Then run `npm test` to run
the tests and repository checks.
