// function: normalizePath
function normalizePath(path12) {
  if (typeof path12 !== "string")
    throw Error("string expected");
  path12 = sysPath2.normalize(path12), path12 = path12.replace(/\\/g, "/");
  let prepend = !1;
  if (path12.startsWith("//"))
    prepend = !0;
  let DOUBLE_SLASH_RE2 = /\/\//;
  while (path12.match(DOUBLE_SLASH_RE2))
    path12 = path12.replace(DOUBLE_SLASH_RE2, "/");
  if (prepend)
    path12 = "/" + path12;
  return path12;
}
