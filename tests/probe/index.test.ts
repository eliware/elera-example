import { expect, test } from '@jest/globals';
import { createProbeRunner } from '../../dist/src/probe/index.js';

test('exports the public probe runner from the barrel', () => {
  expect(createProbeRunner).toEqual(expect.any(Function));
});
