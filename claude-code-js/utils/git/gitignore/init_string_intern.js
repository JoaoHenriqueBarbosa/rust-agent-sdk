// var: init_string_intern
var init_string_intern = __esm(() => {
  cachedSpaces = Array(20).fill(0).map((_, index) => {
    return " ".repeat(index);
  }), cachedBreakLinesWithSpaces = {
    " ": {
      "\n": Array(200).fill(0).map((_, index) => {
        return `
` + " ".repeat(index);
      }),
      "\r": Array(200).fill(0).map((_, index) => {
        return "\r" + " ".repeat(index);
      }),
      "\r\n": Array(200).fill(0).map((_, index) => {
        return `\r
` + " ".repeat(index);
      })
    },
    "\t": {
      "\n": Array(200).fill(0).map((_, index) => {
        return `
` + "\t".repeat(index);
      }),
      "\r": Array(200).fill(0).map((_, index) => {
        return "\r" + "\t".repeat(index);
      }),
      "\r\n": Array(200).fill(0).map((_, index) => {
        return `\r
` + "\t".repeat(index);
      })
    }
  }, supportedEols = [`
`, "\r", `\r
`];
});
