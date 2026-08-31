import { expect, jest, test } from '@jest/globals';
import { scheduleExample } from '../../dist/src/runtime/schedule.js';

test('creates the recurring probe schedule', () => {
  jest.useFakeTimers(); const probe = jest.fn(); const timer = scheduleExample({ running: () => true, probe });
  jest.advanceTimersByTime(1000); clearInterval(timer); jest.useRealTimers();
  expect(probe).toHaveBeenCalledTimes(1);
});
