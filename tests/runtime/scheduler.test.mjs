import { expect, jest, test } from '@jest/globals';
import { scheduleProbe } from '../../dist/src/runtime/scheduler-core.js';

test('runs only while active', () => {
  const probe = jest.fn();
  scheduleProbe(true, probe);
  scheduleProbe(false, probe);
  expect(probe).toHaveBeenCalledTimes(1);
});
