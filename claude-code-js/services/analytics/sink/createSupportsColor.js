// function: createSupportsColor
function createSupportsColor(stream, options = {}) {
  let level = _supportsColor(stream, {
    streamIsTTY: stream && stream.isTTY,
    ...options
  });
  return translateLevel(level);
}
