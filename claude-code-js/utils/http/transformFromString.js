// function: transformFromString
function transformFromString(str, encoding) {
  if (encoding === "base64")
    return Uint8ArrayBlobAdapter.mutate(fromBase647(str));
  return Uint8ArrayBlobAdapter.mutate(fromUtf814(str));
}
