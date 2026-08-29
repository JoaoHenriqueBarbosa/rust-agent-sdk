// var: pipeStreams
var pipeStreams = (source, destination) => {
  source.pipe(destination), onSourceFinish(source, destination), onDestinationFinish(source, destination);
}, onSourceFinish = async (source, destination) => {
  if (isStandardStream(source) || isStandardStream(destination))
    return;
  try {
    await finished3(source, { cleanup: !0, readable: !0, writable: !1 });
  } catch {}
  endDestinationStream(destination);
}, endDestinationStream = (destination) => {
  if (destination.writable)
    destination.end();
}, onDestinationFinish = async (source, destination) => {
  if (isStandardStream(source) || isStandardStream(destination))
    return;
  try {
    await finished3(destination, { cleanup: !0, readable: !1, writable: !0 });
  } catch {}
  abortSourceStream(source);
}, abortSourceStream = (source) => {
  if (source.readable)
    source.destroy();
};
