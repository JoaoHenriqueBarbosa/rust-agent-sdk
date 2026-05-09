// function: breakLines
function breakLines(content, width) {
  return content.split(`
`).flatMap((line) => import_wrap_ansi2.default(line, width, { trim: !1, hard: !0 }).split(`
`).map((str) => str.trimEnd())).join(`
`);
}
