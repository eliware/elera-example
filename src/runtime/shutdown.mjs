export function createShutdown({ isRunning, stop, timer, db, emit }) {
  return async function shutdown() {
    if (!isRunning()) return;
    stop();
    clearInterval(timer);
    try {
      await db.end();
    } catch (error) {
      try {
        emit({ event: "client.error", error: error.message, code: error.code });
      } catch {}
      throw error;
    }
    emit({ event: "client.stopped", timestamp: new Date().toISOString() });
  };
}
