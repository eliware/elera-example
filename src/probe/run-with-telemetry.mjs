export function runWithTelemetry(operation, telemetry) {
  return async function run() {
    const context = telemetry.start();
    let result;
    try {
      result = await operation();
    } catch (error) {
      telemetry.failure(context, error);
      return false;
    }
    Object.assign(context, result);
    try {
      telemetry.success(context);
    } catch {}
    return true;
  };
}
