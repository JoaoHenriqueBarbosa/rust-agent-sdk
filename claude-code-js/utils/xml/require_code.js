// var: require_code
var require_code = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.regexpCode = exports.getEsmExportName = exports.getProperty = exports.safeStringify = exports.stringify = exports.strConcat = exports.addCodeArg = exports.str = exports._ = exports.nil = exports._Code = exports.Name = exports.IDENTIFIER = exports._CodeOrName = void 0;

  class _CodeOrName {
  }
  exports._CodeOrName = _CodeOrName;
  exports.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;

  class Name extends _CodeOrName {
    constructor(s2) {
      super();
      if (!exports.IDENTIFIER.test(s2))
        throw Error("CodeGen: name must be a valid identifier");
      this.str = s2;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      return !1;
    }
    get names() {
      return { [this.str]: 1 };
    }
  }
  exports.Name = Name;

  class _Code extends _CodeOrName {
    constructor(code) {
      super();
      this._items = typeof code === "string" ? [code] : code;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1)
        return !1;
      let item = this._items[0];
      return item === "" || item === '""';
    }
    get str() {
      var _a3;
      return (_a3 = this._str) !== null && _a3 !== void 0 ? _a3 : this._str = this._items.reduce((s2, c3) => `${s2}${c3}`, "");
    }
    get names() {
      var _a3;
      return (_a3 = this._names) !== null && _a3 !== void 0 ? _a3 : this._names = this._items.reduce((names, c3) => {
        if (c3 instanceof Name)
          names[c3.str] = (names[c3.str] || 0) + 1;
        return names;
      }, {});
    }
  }
  exports._Code = _Code;
  exports.nil = new _Code("");
  function _(strs, ...args) {
    let code = [strs[0]], i5 = 0;
    while (i5 < args.length)
      addCodeArg(code, args[i5]), code.push(strs[++i5]);
    return new _Code(code);
  }
  exports._ = _;
  var plus = new _Code("+");
  function str(strs, ...args) {
    let expr = [safeStringify(strs[0])], i5 = 0;
    while (i5 < args.length)
      expr.push(plus), addCodeArg(expr, args[i5]), expr.push(plus, safeStringify(strs[++i5]));
    return optimize2(expr), new _Code(expr);
  }
  exports.str = str;
  function addCodeArg(code, arg) {
    if (arg instanceof _Code)
      code.push(...arg._items);
    else if (arg instanceof Name)
      code.push(arg);
    else
      code.push(interpolate(arg));
  }
  exports.addCodeArg = addCodeArg;
  function optimize2(expr) {
    let i5 = 1;
    while (i5 < expr.length - 1) {
      if (expr[i5] === plus) {
        let res = mergeExprItems(expr[i5 - 1], expr[i5 + 1]);
        if (res !== void 0) {
          expr.splice(i5 - 1, 3, res);
          continue;
        }
        expr[i5++] = "+";
      }
      i5++;
    }
  }
  function mergeExprItems(a2, b) {
    if (b === '""')
      return a2;
    if (a2 === '""')
      return b;
    if (typeof a2 == "string") {
      if (b instanceof Name || a2[a2.length - 1] !== '"')
        return;
      if (typeof b != "string")
        return `${a2.slice(0, -1)}${b}"`;
      if (b[0] === '"')
        return a2.slice(0, -1) + b.slice(1);
      return;
    }
    if (typeof b == "string" && b[0] === '"' && !(a2 instanceof Name))
      return `"${a2}${b.slice(1)}`;
    return;
  }
  function strConcat(c1, c22) {
    return c22.emptyStr() ? c1 : c1.emptyStr() ? c22 : str`${c1}${c22}`;
  }
  exports.strConcat = strConcat;
  function interpolate(x4) {
    return typeof x4 == "number" || typeof x4 == "boolean" || x4 === null ? x4 : safeStringify(Array.isArray(x4) ? x4.join(",") : x4);
  }
  function stringify2(x4) {
    return new _Code(safeStringify(x4));
  }
  exports.stringify = stringify2;
  function safeStringify(x4) {
    return JSON.stringify(x4).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  exports.safeStringify = safeStringify;
  function getProperty(key2) {
    return typeof key2 == "string" && exports.IDENTIFIER.test(key2) ? new _Code(`.${key2}`) : _`[${key2}]`;
  }
  exports.getProperty = getProperty;
  function getEsmExportName(key2) {
    if (typeof key2 == "string" && exports.IDENTIFIER.test(key2))
      return new _Code(`${key2}`);
    throw Error(`CodeGen: invalid export name: ${key2}, use explicit $id name mapping`);
  }
  exports.getEsmExportName = getEsmExportName;
  function regexpCode(rx) {
    return new _Code(rx.toString());
  }
  exports.regexpCode = regexpCode;
});
