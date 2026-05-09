// var: SLASH
var SLASH = "/", SLASH_SLASH = "//", ONE_DOT = ".", TWO_DOTS = "..", STRING_TYPE = "string", BACK_SLASH_RE, DOUBLE_SLASH_RE, DOT_RE, REPLACER_RE, isMatcherObject = (matcher) => typeof matcher === "object" && matcher !== null && !(matcher instanceof RegExp), unifyPaths = (paths_) => {
  let paths2 = arrify(paths_).flat();
  if (!paths2.every((p4) => typeof p4 === STRING_TYPE))
    throw TypeError(`Non-string provided as watch path: ${paths2}`);
  return paths2.map(normalizePathToUnix);
}, toUnix = (string4) => {
  let str = string4.replace(BACK_SLASH_RE, SLASH), prepend = !1;
  if (str.startsWith(SLASH_SLASH))
    prepend = !0;
  while (str.match(DOUBLE_SLASH_RE))
    str = str.replace(DOUBLE_SLASH_RE, SLASH);
  if (prepend)
    str = SLASH + str;
  return str;
}, normalizePathToUnix = (path12) => toUnix(sysPath2.normalize(toUnix(path12))), normalizeIgnored = (cwd2 = "") => (path12) => {
  if (typeof path12 === "string")
    return normalizePathToUnix(sysPath2.isAbsolute(path12) ? path12 : sysPath2.join(cwd2, path12));
  else
    return path12;
}, getAbsolutePath = (path12, cwd2) => {
  if (sysPath2.isAbsolute(path12))
    return path12;
  return sysPath2.join(cwd2, path12);
}, EMPTY_SET, STAT_METHOD_F = "stat", STAT_METHOD_L = "lstat", FSWatcher, esm_default;
