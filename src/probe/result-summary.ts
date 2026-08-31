export function summarizeResult(result) {
  return { mysql2Tuple: Array.isArray(result) && result.length === 2, rowsPresent: Array.isArray(result[0]), fieldsPresent: Array.isArray(result[1]), rowCount: result[0].length, fieldCount: result[1].length };
}
