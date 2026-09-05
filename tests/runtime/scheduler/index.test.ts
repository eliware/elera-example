import { expect, jest, test } from '@jest/globals';
import { startProbeSchedule } from '../../../dist/src/runtime/scheduler/index.js';

test('starts a scheduler that invokes the probe repeatedly while active', () => {
  jest.useFakeTimers();
  const probe = jest.fn();
  const timer = startProbeSchedule(() => true, probe, 50);
  jest.advanceTimersByTime(100);
  clearInterval(timer);
  jest.useRealTimers();
  expect(probe).toHaveBeenCalledTimes(2);
});
