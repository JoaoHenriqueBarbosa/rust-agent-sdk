// function: createPattern
function createPattern(matcher) {
  if (typeof matcher === "function")
    return matcher;
  if (typeof matcher === "string")
    return (string4) => matcher === string4;
  if (matcher instanceof RegExp)
    return (string4) => matcher.test(string4);
  if (typeof matcher === "object" && matcher !== null)
    return (string4) => {
      if (matcher.path === string4)
        return !0;
      if (matcher.recursive) {
        let relative5 = sysPath2.relative(matcher.path, string4);
        if (!relative5)
          return !1;
        return !relative5.startsWith("..") && !sysPath2.isAbsolute(relative5);
      }
      return !1;
    };
  return () => !1;
}
