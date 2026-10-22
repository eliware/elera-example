export function runWithTelemetry(operation, telemetry) {
  return async function run() {
    const context = telemetry.start();
    try {
      Object.assign(context, await operation());
      telemetry.success(context);
      return true;
    } catch (error) {
      try {
        telemetry.failure(context, error);
      } catch {}
      return false;
    }
  };
}
