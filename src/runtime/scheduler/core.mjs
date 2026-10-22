export function scheduleProbe(running, probe, onError) {
  if (!running) return Promise.resolve();
  return Promise.resolve()
    .then(() => probe())
    .catch((error) => {
      try {
        onError(error);
      } catch {}
    });
}
