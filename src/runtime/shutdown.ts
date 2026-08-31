export function createShutdown({ isRunning, stop, timer, db, emit }) {
  return async function shutdown() {
    if (!isRunning()) return;
    stop();
    clearInterval(timer);
    await db.end();
    emit({ event: 'client.stopped', timestamp: new Date().toISOString() });
  };
}
