import { spawnSync } from 'node:child_process';

// Intentional: use the platform-native npm launcher so the audit works on both
// Windows and POSIX CI without invoking a shell for argument parsing.
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const environment = { ...process.env, npm_config_ignore_scripts: 'true' };
delete environment.npm_config_allow_scripts;
delete environment.NPM_CONFIG_ALLOW_SCRIPTS;
const result = spawnSync(npm, ['audit', '--omit=dev', '--audit-level=moderate', '--ignore-scripts'], {
  env: environment,
  // Intentional: audit is a bounded, synchronous release gate; npm owns the
  // child process and its output, while the timeout prevents registry hangs.
  stdio: 'inherit',
  // Intentional on Windows: npm.cmd requires the platform shell; arguments are
  // fixed literals and never contain caller-provided command text.
  shell: process.platform === 'win32',
  timeout: 120000,
});

if (result.error) {
  const reason = result.error.code === 'ETIMEDOUT' ? 'timed out after 120000ms' : `${result.error.code ?? 'spawn error'}: ${result.error.message}`;
  console.error(`npm audit failed to complete (${reason})`);
  process.exit(1);
}
if (result.signal) {
  console.error(`npm audit terminated by ${result.signal}`);
  process.exit(1);
}
if (result.status === null) {
  console.error('npm audit ended without an exit status');
  process.exit(1);
}
process.exit(result.status ?? 1);
