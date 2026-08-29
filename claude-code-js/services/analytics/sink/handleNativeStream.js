// var: handleNativeStream
var handleNativeStream = ({ stdioItem, stdioItem: { type }, isStdioArray, fdNumber, direction, isSync }) => {
  if (!isStdioArray || type !== "native")
    return stdioItem;
  return isSync ? handleNativeStreamSync({ stdioItem, fdNumber, direction }) : handleNativeStreamAsync({ stdioItem, fdNumber });
}, handleNativeStreamSync = ({ stdioItem, stdioItem: { value, optionName }, fdNumber, direction }) => {
  let targetFd = getTargetFd({
    value,
    optionName,
    fdNumber,
    direction
  });
  if (targetFd !== void 0)
    return targetFd;
  if (isStream(value, { checkOpen: !1 }))
    throw TypeError(`The \`${optionName}: Stream\` option cannot both be an array and include a stream with synchronous methods.`);
  return stdioItem;
}, getTargetFd = ({ value, optionName, fdNumber, direction }) => {
  let targetFdNumber = getTargetFdNumber(value, fdNumber);
  if (targetFdNumber === void 0)
    return;
  if (direction === "output")
    return { type: "fileNumber", value: targetFdNumber, optionName };
  if (tty3.isatty(targetFdNumber))
    throw TypeError(`The \`${optionName}: ${serializeOptionValue(value)}\` option is invalid: it cannot be a TTY with synchronous methods.`);
  return { type: "uint8Array", value: bufferToUint8Array(readFileSync2(targetFdNumber)), optionName };
}, getTargetFdNumber = (value, fdNumber) => {
  if (value === "inherit")
    return fdNumber;
  if (typeof value === "number")
    return value;
  let standardStreamIndex = STANDARD_STREAMS.indexOf(value);
  if (standardStreamIndex !== -1)
    return standardStreamIndex;
}, handleNativeStreamAsync = ({ stdioItem, stdioItem: { value, optionName }, fdNumber }) => {
  if (value === "inherit")
    return { type: "nodeStream", value: getStandardStream(fdNumber, value, optionName), optionName };
  if (typeof value === "number")
    return { type: "nodeStream", value: getStandardStream(value, value, optionName), optionName };
  if (isStream(value, { checkOpen: !1 }))
    return { type: "nodeStream", value, optionName };
  return stdioItem;
}, getStandardStream = (fdNumber, value, optionName) => {
  let standardStream = STANDARD_STREAMS[fdNumber];
  if (standardStream === void 0)
    throw TypeError(`The \`${optionName}: ${value}\` option is invalid: no such standard stream.`);
  return standardStream;
};
