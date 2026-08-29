// var: stripFinalNewlineString
var stripFinalNewlineString = (input) => input.at(-1) === LF ? input.slice(0, input.at(-2) === CR ? -2 : -1) : input, stripFinalNewlineBinary = (input) => input.at(-1) === LF_BINARY ? input.subarray(0, input.at(-2) === CR_BINARY ? -2 : -1) : input, LF = `
`, LF_BINARY, CR = "\r", CR_BINARY;
var init_strip_final_newline = __esm(() => {
  LF_BINARY = LF.codePointAt(0), CR_BINARY = CR.codePointAt(0);
});
