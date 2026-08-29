// var: concatenateShell
var concatenateShell = (file2, commandArguments, options) => options.shell && commandArguments.length > 0 ? [[file2, ...commandArguments].join(" "), [], options] : [file2, commandArguments, options];

// node_modules/strip-final-newline/index.js
function stripFinalNewline(input) {
  if (typeof input === "string")
    return stripFinalNewlineString(input);
  if (!(ArrayBuffer.isView(input) && input.BYTES_PER_ELEMENT === 1))
    throw Error("Input must be a string or a Uint8Array");
  return stripFinalNewlineBinary(input);
}
