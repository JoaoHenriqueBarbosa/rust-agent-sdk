// var: init_split
var init_split = __esm(() => {
  linesStringInfo = {
    windowsNewline: `\r
`,
    unixNewline: `
`,
    LF: `
`,
    concatBytes: concatString
  }, linesUint8ArrayInfo = {
    windowsNewline: new Uint8Array([13, 10]),
    unixNewline: new Uint8Array([10]),
    LF: 10,
    concatBytes: concatUint8Array
  };
});
