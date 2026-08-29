// function: toStream
function toStream(source) {
  if (source instanceof Uint8Array)
    return Readable8.from(Buffer.from(source));
  else if (isBlob2(source))
    return ensureNodeStream(source.stream());
  else
    return ensureNodeStream(source);
}
