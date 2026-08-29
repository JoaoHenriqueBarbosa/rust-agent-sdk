// function: getLength
function getLength(source) {
  if (source instanceof Uint8Array)
    return source.byteLength;
  else if (isBlob2(source))
    return source.size === -1 ? void 0 : source.size;
  else
    return;
}
