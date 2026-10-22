export function createShutdown({
  isRunning,
  stop,
  timer,
  waitForIdle = () => Promise.resolve(),
  db,
  emit,
}) {
  let stopped = false;
  let closed = false;
  let shutdownPromise;
  return async function shutdown() {
    if (closed) return;
    if (shutdownPromise) return shutdownPromise;
    if (!stopped) {
      if (!isRunning()) return;
      stop();
      clearInterval(timer);
      stopped = true;
    }
    shutdownPromise = (async () => {
      try {
        await waitForIdle();
        await db.end();
      } catch (error) {
        try {
          emit({ event: "client.error", error: error.message, code: error.code });
        } catch {}
        throw error;
      }
      closed = true;
      emit({ event: "client.stopped", timestamp: new Date().toISOString() });
    })();
    try {
      await shutdownPromise;
    } finally {
      shutdownPromise = undefined;
    }
  };
}
