// Original: src/ink/components/CursorDeclarationContext.ts
var import_react8, CursorDeclarationContext, CursorDeclarationContext_default;
var init_CursorDeclarationContext = __esm(() => {
  import_react8 = __toESM(require_react_development(), 1), CursorDeclarationContext = import_react8.createContext(() => {}), CursorDeclarationContext_default = CursorDeclarationContext;
});

// node_modules/convert-to-spaces/dist/index.js
var convertToSpaces = (input, spaces = 2) => {
  return input.replace(/^\t+/gm, ($1) => " ".repeat($1.length * spaces));
}, dist_default;
var init_dist2 = __esm(() => {
  dist_default = convertToSpaces;
});

// node_modules/code-excerpt/dist/index.js
var generateLineNumbers = (line, around) => {
  let lineNumbers = [], min = line - around, max = line + around;
  for (let lineNumber = min;lineNumber <= max; lineNumber++)
    lineNumbers.push(lineNumber);
  return lineNumbers;
}, codeExcerpt = (source, line, options = {}) => {
  var _a2;
  if (typeof source !== "string")
    throw TypeError("Source code is missing.");
  if (!line || line < 1)
    throw TypeError("Line number must start from `1`.");
  let lines = dist_default(source).split(/\r?\n/);
  if (line > lines.length)
    return;
  return generateLineNumbers(line, (_a2 = options.around) !== null && _a2 !== void 0 ? _a2 : 3).filter((line2) => lines[line2 - 1] !== void 0).map((line2) => ({ line: line2, value: lines[line2 - 1] }));
}, dist_default2;
var init_dist3 = __esm(() => {
  init_dist2();
  dist_default2 = codeExcerpt;
});

// node_modules/escape-string-regexp/index.js
var require_escape_string_regexp = __commonJS((exports, module) => {
  var matchOperatorsRegex = /[|\\{}()[\]^$+*?.-]/g;
  module.exports = (string4) => {
    if (typeof string4 !== "string")
      throw TypeError("Expected a string");
    return string4.replace(matchOperatorsRegex, "\\$&");
  };
});

// node_modules/stack-utils/index.js
var require_stack_utils = __commonJS((exports, module) => {
  var escapeStringRegexp = require_escape_string_regexp(), cwd2 = typeof process === "object" && process && typeof process.cwd === "function" ? process.cwd() : ".", natives = [].concat(__require("module").builtinModules, "bootstrap_node", "node").map((n5) => new RegExp(`(?:\\((?:node:)?${n5}(?:\\.js)?:\\d+:\\d+\\)$|^\\s*at (?:node:)?${n5}(?:\\.js)?:\\d+:\\d+$)`));
  natives.push(/\((?:node:)?internal\/[^:]+:\d+:\d+\)$/, /\s*at (?:node:)?internal\/[^:]+:\d+:\d+$/, /\/\.node-spawn-wrap-\w+-\w+\/node:\d+:\d+\)?$/);

  class StackUtils {
    constructor(opts) {
      if (opts = {
        ignoredPackages: [],
        ...opts
      }, "internals" in opts === !1)
        opts.internals = StackUtils.nodeInternals();
      if ("cwd" in opts === !1)
        opts.cwd = cwd2;
      this._cwd = opts.cwd.replace(/\\/g, "/"), this._internals = [].concat(opts.internals, ignoredPackagesRegExp(opts.ignoredPackages)), this._wrapCallSite = opts.wrapCallSite || !1;
    }
    static nodeInternals() {
      return [...natives];
    }
    clean(stack, indent = 0) {
      if (indent = " ".repeat(indent), !Array.isArray(stack))
        stack = stack.split(`
`);
      if (!/^\s*at /.test(stack[0]) && /^\s*at /.test(stack[1]))
        stack = stack.slice(1);
      let outdent = !1, lastNonAtLine = null, result = [];
      return stack.forEach((st) => {
        if (st = st.replace(/\\/g, "/"), this._internals.some((internal) => internal.test(st)))
          return;
        let isAtLine = /^\s*at /.test(st);
        if (outdent)
          st = st.trimEnd().replace(/^(\s+)at /, "$1");
        else if (st = st.trim(), isAtLine)
          st = st.slice(3);
        if (st = st.replace(`${this._cwd}/`, ""), st)
          if (isAtLine) {
            if (lastNonAtLine)
              result.push(lastNonAtLine), lastNonAtLine = null;
            result.push(st);
          } else
            outdent = !0, lastNonAtLine = st;
      }), result.map((line) => `${indent}${line}
`).join("");
    }
    captureString(limit, fn = this.captureString) {
      if (typeof limit === "function")
        fn = limit, limit = 1 / 0;
      let { stackTraceLimit } = Error;
      if (limit)
        Error.stackTraceLimit = limit;
      let obj = {};
      Error.captureStackTrace(obj, fn);
      let { stack } = obj;
      return Error.stackTraceLimit = stackTraceLimit, this.clean(stack);
    }
    capture(limit, fn = this.capture) {
      if (typeof limit === "function")
        fn = limit, limit = 1 / 0;
      let { prepareStackTrace, stackTraceLimit } = Error;
      if (Error.prepareStackTrace = (obj2, site) => {
        if (this._wrapCallSite)
          return site.map(this._wrapCallSite);
        return site;
      }, limit)
        Error.stackTraceLimit = limit;
      let obj = {};
      Error.captureStackTrace(obj, fn);
      let { stack } = obj;
      return Object.assign(Error, { prepareStackTrace, stackTraceLimit }), stack;
    }
    at(fn = this.at) {
      let [site] = this.capture(1, fn);
      if (!site)
        return {};
      let res = {
        line: site.getLineNumber(),
        column: site.getColumnNumber()
      };
      if (setFile(res, site.getFileName(), this._cwd), site.isConstructor())
        Object.defineProperty(res, "constructor", {
          value: !0,
          configurable: !0
        });
      if (site.isEval())
        res.evalOrigin = site.getEvalOrigin();
      if (site.isNative())
        res.native = !0;
      let typename;
      try {
        typename = site.getTypeName();
      } catch (_) {}
      if (typename && typename !== "Object" && typename !== "[object Object]")
        res.type = typename;
      let fname = site.getFunctionName();
      if (fname)
        res.function = fname;
      let meth = site.getMethodName();
      if (meth && fname !== meth)
        res.method = meth;
      return res;
    }
    parseLine(line) {
      let match = line && line.match(re);
      if (!match)
        return null;
      let ctor = match[1] === "new", fname = match[2], evalOrigin = match[3], evalFile = match[4], evalLine = Number(match[5]), evalCol = Number(match[6]), file2 = match[7], lnum = match[8], col = match[9], native = match[10] === "native", closeParen = match[11] === ")", method, res = {};
      if (lnum)
        res.line = Number(lnum);
      if (col)
        res.column = Number(col);
      if (closeParen && file2) {
        let closes = 0;
        for (let i4 = file2.length - 1;i4 > 0; i4--)
          if (file2.charAt(i4) === ")")
            closes++;
          else if (file2.charAt(i4) === "(" && file2.charAt(i4 - 1) === " ") {
            if (closes--, closes === -1 && file2.charAt(i4 - 1) === " ") {
              let before = file2.slice(0, i4 - 1);
              file2 = file2.slice(i4 + 1), fname += ` (${before}`;
              break;
            }
          }
      }
      if (fname) {
        let methodMatch = fname.match(methodRe);
        if (methodMatch)
          fname = methodMatch[1], method = methodMatch[2];
      }
      if (setFile(res, file2, this._cwd), ctor)
        Object.defineProperty(res, "constructor", {
          value: !0,
          configurable: !0
        });
      if (evalOrigin)
        res.evalOrigin = evalOrigin, res.evalLine = evalLine, res.evalColumn = evalCol, res.evalFile = evalFile && evalFile.replace(/\\/g, "/");
      if (native)
        res.native = !0;
      if (fname)
        res.function = fname;
      if (method && fname !== method)
        res.method = method;
      return res;
    }
  }
  function setFile(result, filename, cwd3) {
    if (filename) {
      if (filename = filename.replace(/\\/g, "/"), filename.startsWith(`${cwd3}/`))
        filename = filename.slice(cwd3.length + 1);
      result.file = filename;
    }
  }
  function ignoredPackagesRegExp(ignoredPackages) {
    if (ignoredPackages.length === 0)
      return [];
    let packages = ignoredPackages.map((mod) => escapeStringRegexp(mod));
    return new RegExp(`[/\\\\]node_modules[/\\\\](?:${packages.join("|")})[/\\\\][^:]+:\\d+:\\d+`);
  }
  var re = new RegExp("^(?:\\s*at )?(?:(new) )?(?:(.*?) \\()?(?:eval at ([^ ]+) \\((.+?):(\\d+):(\\d+)\\), )?(?:(.+?):(\\d+):(\\d+)|(native))(\\)?)$"), methodRe = /^(.*?) \[as (.*?)\]$/;
  module.exports = StackUtils;
});