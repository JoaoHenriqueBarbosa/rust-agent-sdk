// function: parseWithCompat
function parseWithCompat(schema5, data) {
  let result = safeParse3(schema5, data);
  if (!result.success)
    throw result.error;
  return result.data;
}
