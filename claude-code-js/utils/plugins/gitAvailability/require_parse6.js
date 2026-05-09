// var: require_parse6
var require_parse6 = __commonJS((exports, module) => {
  var CONTROL = "(?:" + [
    "\\|\\|",
    "\\&\\&",
    ";;",
    "\\|\\&",
    "\\<\\(",
    "\\<\\<\\<",
    ">>",
    ">\\&",
    "<\\&",
    "[&;()|<>]"
  ].join("|") + ")", controlRE = new RegExp("^" + CONTROL + "$"), META = "|&;()<> \\t", SINGLE_QUOTE = '"((\\\\"|[^"])*?)"', DOUBLE_QUOTE = "'((\\\\'|[^'])*?)'", hash = /^#$/, SQ = "'", DQ = '"', DS = "$", TOKEN = "", mult = 4294967296;
  for (i4 = 0;i4 < 4; i4++)
    TOKEN += (mult * Math.random()).toString(16);
  var i4, startsWithToken = new RegExp("^" + TOKEN);
  function matchAll2(s2, r4) {
    var origIndex = r4.lastIndex, matches = [], matchObj;
    while (matchObj = r4.exec(s2))
      if (matches.push(matchObj), r4.lastIndex === matchObj.index)
        r4.lastIndex += 1;
    return r4.lastIndex = origIndex, matches;
  }
  function getVar(env5, pre, key) {
    var r4 = typeof env5 === "function" ? env5(key) : env5[key];
    if (typeof r4 > "u" && key != "")
      r4 = "";
    else if (typeof r4 > "u")
      r4 = "$";
    if (typeof r4 === "object")
      return pre + TOKEN + JSON.stringify(r4) + TOKEN;
    return pre + r4;
  }
  function parseInternal(string4, env5, opts) {
    if (!opts)
      opts = {};
    var BS = opts.escape || "\\", BAREWORD = "(\\" + BS + `['"` + META + `]|[^\\s'"` + META + "])+", chunker = new RegExp([
      "(" + CONTROL + ")",
      "(" + BAREWORD + "|" + SINGLE_QUOTE + "|" + DOUBLE_QUOTE + ")+"
    ].join("|"), "g"), matches = matchAll2(string4, chunker);
    if (matches.length === 0)
      return [];
    if (!env5)
      env5 = {};
    var commented = !1;
    return matches.map(function(match) {
      var s2 = match[0];
      if (!s2 || commented)
        return;
      if (controlRE.test(s2))
        return { op: s2 };
      var quote = !1, esc2 = !1, out = "", isGlob = !1, i5;
      function parseEnvVar() {
        i5 += 1;
        var varend, varname, char = s2.charAt(i5);
        if (char === "{") {
          if (i5 += 1, s2.charAt(i5) === "}")
            throw Error("Bad substitution: " + s2.slice(i5 - 2, i5 + 1));
          if (varend = s2.indexOf("}", i5), varend < 0)
            throw Error("Bad substitution: " + s2.slice(i5));
          varname = s2.slice(i5, varend), i5 = varend;
        } else if (/[*@#?$!_-]/.test(char))
          varname = char, i5 += 1;
        else {
          var slicedFromI = s2.slice(i5);
          if (varend = slicedFromI.match(/[^\w\d_]/), !varend)
            varname = slicedFromI, i5 = s2.length;
          else
            varname = slicedFromI.slice(0, varend.index), i5 += varend.index - 1;
        }
        return getVar(env5, "", varname);
      }
      for (i5 = 0;i5 < s2.length; i5++) {
        var c3 = s2.charAt(i5);
        if (isGlob = isGlob || !quote && (c3 === "*" || c3 === "?"), esc2)
          out += c3, esc2 = !1;
        else if (quote)
          if (c3 === quote)
            quote = !1;
          else if (quote == SQ)
            out += c3;
          else if (c3 === BS)
            if (i5 += 1, c3 = s2.charAt(i5), c3 === DQ || c3 === BS || c3 === DS)
              out += c3;
            else
              out += BS + c3;
          else if (c3 === DS)
            out += parseEnvVar();
          else
            out += c3;
        else if (c3 === DQ || c3 === SQ)
          quote = c3;
        else if (controlRE.test(c3))
          return { op: s2 };
        else if (hash.test(c3)) {
          commented = !0;
          var commentObj = { comment: string4.slice(match.index + i5 + 1) };
          if (out.length)
            return [out, commentObj];
          return [commentObj];
        } else if (c3 === BS)
          esc2 = !0;
        else if (c3 === DS)
          out += parseEnvVar();
        else
          out += c3;
      }
      if (isGlob)
        return { op: "glob", pattern: out };
      return out;
    }).reduce(function(prev, arg) {
      return typeof arg > "u" ? prev : prev.concat(arg);
    }, []);
  }
