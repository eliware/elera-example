export function runWithTelemetry(operation, telemetry) {
  return async function run() {
    const context = telemetry.start();
    try {
      Object.assign(context, await operation());
      telemetry.success(context);
    } catch (error) {
      telemetry.failure(context, error);
    }
  };
}
