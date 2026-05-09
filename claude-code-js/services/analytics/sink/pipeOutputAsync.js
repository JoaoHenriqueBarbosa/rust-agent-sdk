// var: pipeOutputAsync
var pipeOutputAsync = (subprocess, fileDescriptors, controller) => {
  let pipeGroups = /* @__PURE__ */ new Map;
  for (let [fdNumber, { stdioItems, direction }] of Object.entries(fileDescriptors)) {
    for (let { stream } of stdioItems.filter(({ type }) => TRANSFORM_TYPES.has(type)))
      pipeTransform(subprocess, stream, direction, fdNumber);
    for (let { stream } of stdioItems.filter(({ type }) => !TRANSFORM_TYPES.has(type)))
      pipeStdioItem({
        subprocess,
        stream,
        direction,
        fdNumber,
        pipeGroups,
        controller
      });
  }
  for (let [outputStream, inputStreams] of pipeGroups.entries()) {
    let inputStream = inputStreams.length === 1 ? inputStreams[0] : mergeStreams(inputStreams);
    pipeStreams(inputStream, outputStream);
  }
}, pipeTransform = (subprocess, stream, direction, fdNumber) => {
  if (direction === "output")
    pipeStreams(subprocess.stdio[fdNumber], stream);
  else
    pipeStreams(stream, subprocess.stdio[fdNumber]);
  let streamProperty = SUBPROCESS_STREAM_PROPERTIES[fdNumber];
  if (streamProperty !== void 0)
    subprocess[streamProperty] = stream;
  subprocess.stdio[fdNumber] = stream;
}, SUBPROCESS_STREAM_PROPERTIES, pipeStdioItem = ({ subprocess, stream, direction, fdNumber, pipeGroups, controller }) => {
  if (stream === void 0)
    return;
  setStandardStreamMaxListeners(stream, controller);
  let [inputStream, outputStream] = direction === "output" ? [stream, subprocess.stdio[fdNumber]] : [subprocess.stdio[fdNumber], stream], outputStreams = pipeGroups.get(inputStream) ?? [];
  pipeGroups.set(inputStream, [...outputStreams, outputStream]);
}, setStandardStreamMaxListeners = (stream, { signal }) => {
  if (isStandardStream(stream))
    incrementMaxListeners(stream, MAX_LISTENERS_INCREMENT, signal);
}, MAX_LISTENERS_INCREMENT = 2;
