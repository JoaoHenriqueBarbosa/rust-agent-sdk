// function: isStreamComplete
function isStreamComplete(stream10) {
  if (stream10.readable === !1)
    return Promise.resolve();
  return new Promise((resolve9) => {
    let handler = () => {
      resolve9(), stream10.removeListener("close", handler), stream10.removeListener("end", handler), stream10.removeListener("error", handler);
    };
    stream10.on("close", handler), stream10.on("end", handler), stream10.on("error", handler);
  });
}
