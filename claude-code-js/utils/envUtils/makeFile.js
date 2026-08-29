// function: makeFile
function makeFile(fileBits, fileName, options) {
  return checkFileSupport(), new File(fileBits, fileName ?? "unknown_file", options);
}
