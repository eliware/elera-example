import { expect, test } from '@jest/globals';
import { summarizeResult } from '../../dist/src/probe/result-summary.js';

test('summarizes a mysql tuple result', () => {
  expect(summarizeResult([[{ id: 1 }], [{ name: 'id' }]])).toEqual({ mysql2Tuple: true, rowsPresent: true, fieldsPresent: true, rowCount: 1, fieldCount: 1 });
});
