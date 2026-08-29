// var: createIterable
var createIterable = (subprocess, encoding, {
  from,
  binary: binaryOption = !1,
  preserveNewlines = !1
} = {}) => {
  let binary = binaryOption || BINARY_ENCODINGS.has(encoding), subprocessStdout = getFromStream(subprocess, from), onStdoutData = iterateOnSubprocessStream({
    subprocessStdout,
    subprocess,
    binary,
    shouldEncode: !0,
    encoding,
    preserveNewlines
  });
  return iterateOnStdoutData(onStdoutData, subprocessStdout, subprocess);
}, iterateOnStdoutData = async function* (onStdoutData, subprocessStdout, subprocess) {
  try {
    yield* onStdoutData;
  } finally {
    if (subprocessStdout.readable)
      subprocessStdout.destroy();
    await subprocess;
  }
};
