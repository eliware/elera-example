# Troubleshooting

## Missing configuration

If the application reports that it requires `url` and `token`, set
`ELERA_API_URL` and `ELERA_API_TOKEN` in the process environment or in `.env`.
Use `node --env-file=.env bin/elera-example.mjs` to load `.env`.

## Connection or authentication errors

Check that the endpoint is reachable and the token has read and write access.
Keep the token out of logs and support messages.

## Check errors

The application logs a `sql.error` event when a check fails. Check the endpoint,
token, and database health before you run the check again.

## Repository validation

Run `npm ci`, then run `npm test` from the repository root.
