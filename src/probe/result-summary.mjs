export function summarizeResult(result) {
  const rowsPresent = Array.isArray(result?.[0]);
  const fieldsPresent = Array.isArray(result?.[1]);
  return {
    mysql2Tuple: Array.isArray(result) && result.length === 2,
    rowsPresent,
    fieldsPresent,
    rowCount: rowsPresent ? result[0].length : 0,
    fieldCount: fieldsPresent ? result[1].length : 0,
  };
}
