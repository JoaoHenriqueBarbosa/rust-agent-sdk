// function: _stringFormat
function _stringFormat(Class2, format, fnOrRegex, _params = {}) {
  let params = normalizeParams(_params), def = {
    ...normalizeParams(_params),
    check: "string_format",
    type: "string",
    format,
    fn: typeof fnOrRegex === "function" ? fnOrRegex : (val) => fnOrRegex.test(val),
    ...params
  };
  if (fnOrRegex instanceof RegExp)
    def.pattern = fnOrRegex;
  return new Class2(def);
}
