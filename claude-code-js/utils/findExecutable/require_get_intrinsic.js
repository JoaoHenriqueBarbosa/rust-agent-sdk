// var: require_get_intrinsic
var require_get_intrinsic = __commonJS((exports, module) => {
  var undefined2, $Object = require_es_object_atoms(), $Error = require_es_errors(), $EvalError = require_eval(), $RangeError = require_range(), $ReferenceError = require_ref(), $SyntaxError = require_syntax(), $TypeError = require_type(), $URIError = require_uri(), abs = require_abs(), floor = require_floor(), max = require_max(), min = require_min(), pow = require_pow(), round = require_round(), sign = require_sign(), $Function = Function, getEvalledConstructor = function(expressionSyntax) {
    try {
      return $Function('"use strict"; return (' + expressionSyntax + ").constructor;")();
    } catch (e) {}
  }, $gOPD = require_gopd(), $defineProperty = require_es_define_property(), throwTypeError = function() {
    throw new $TypeError;
  }, ThrowTypeError = $gOPD ? function() {
    try {
      return arguments.callee, throwTypeError;
    } catch (calleeThrows) {
      try {
        return $gOPD(arguments, "callee").get;
      } catch (gOPDthrows) {
        return throwTypeError;
      }
    }
  }() : throwTypeError, hasSymbols = require_has_symbols()(), getProto = require_get_proto(), $ObjectGPO = require_Object_getPrototypeOf(), $ReflectGPO = require_Reflect_getPrototypeOf(), $apply = require_functionApply(), $call = require_functionCall(), needsEval = {}, TypedArray = typeof Uint8Array > "u" || !getProto ? undefined2 : getProto(Uint8Array), INTRINSICS = {
    __proto__: null,
    "%AggregateError%": typeof AggregateError > "u" ? undefined2 : AggregateError,
    "%Array%": Array,
    "%ArrayBuffer%": typeof ArrayBuffer > "u" ? undefined2 : ArrayBuffer,
    "%ArrayIteratorPrototype%": hasSymbols && getProto ? getProto([][Symbol.iterator]()) : undefined2,
    "%AsyncFromSyncIteratorPrototype%": undefined2,
    "%AsyncFunction%": needsEval,
    "%AsyncGenerator%": needsEval,
    "%AsyncGeneratorFunction%": needsEval,
    "%AsyncIteratorPrototype%": needsEval,
    "%Atomics%": typeof Atomics > "u" ? undefined2 : Atomics,
    "%BigInt%": typeof BigInt > "u" ? undefined2 : BigInt,
    "%BigInt64Array%": typeof BigInt64Array > "u" ? undefined2 : BigInt64Array,
    "%BigUint64Array%": typeof BigUint64Array > "u" ? undefined2 : BigUint64Array,
    "%Boolean%": Boolean,
    "%DataView%": typeof DataView > "u" ? undefined2 : DataView,
    "%Date%": Date,
    "%decodeURI%": decodeURI,
    "%decodeURIComponent%": decodeURIComponent,
    "%encodeURI%": encodeURI,
    "%encodeURIComponent%": encodeURIComponent,
    "%Error%": $Error,
    "%eval%": eval,
    "%EvalError%": $EvalError,
    "%Float16Array%": typeof Float16Array > "u" ? undefined2 : Float16Array,
    "%Float32Array%": typeof Float32Array > "u" ? undefined2 : Float32Array,
    "%Float64Array%": typeof Float64Array > "u" ? undefined2 : Float64Array,
    "%FinalizationRegistry%": typeof FinalizationRegistry > "u" ? undefined2 : FinalizationRegistry,
    "%Function%": $Function,
    "%GeneratorFunction%": needsEval,
    "%Int8Array%": typeof Int8Array > "u" ? undefined2 : Int8Array,
    "%Int16Array%": typeof Int16Array > "u" ? undefined2 : Int16Array,
    "%Int32Array%": typeof Int32Array > "u" ? undefined2 : Int32Array,
    "%isFinite%": isFinite,
    "%isNaN%": isNaN,
    "%IteratorPrototype%": hasSymbols && getProto ? getProto(getProto([][Symbol.iterator]())) : undefined2,
    "%JSON%": typeof JSON === "object" ? JSON : undefined2,
    "%Map%": typeof Map > "u" ? undefined2 : Map,
    "%MapIteratorPrototype%": typeof Map > "u" || !hasSymbols || !getProto ? undefined2 : getProto((/* @__PURE__ */ new Map())[Symbol.iterator]()),
    "%Math%": Math,
    "%Number%": Number,
    "%Object%": $Object,
    "%Object.getOwnPropertyDescriptor%": $gOPD,
    "%parseFloat%": parseFloat,
    "%parseInt%": parseInt,
    "%Promise%": typeof Promise > "u" ? undefined2 : Promise,
    "%Proxy%": typeof Proxy > "u" ? undefined2 : Proxy,
    "%RangeError%": $RangeError,
    "%ReferenceError%": $ReferenceError,
    "%Reflect%": typeof Reflect > "u" ? undefined2 : Reflect,
    "%RegExp%": RegExp,
    "%Set%": typeof Set > "u" ? undefined2 : Set,
    "%SetIteratorPrototype%": typeof Set > "u" || !hasSymbols || !getProto ? undefined2 : getProto((/* @__PURE__ */ new Set())[Symbol.iterator]()),
    "%SharedArrayBuffer%": typeof SharedArrayBuffer > "u" ? undefined2 : SharedArrayBuffer,
    "%String%": String,
    "%StringIteratorPrototype%": hasSymbols && getProto ? getProto(""[Symbol.iterator]()) : undefined2,
    "%Symbol%": hasSymbols ? Symbol : undefined2,
    "%SyntaxError%": $SyntaxError,
    "%ThrowTypeError%": ThrowTypeError,
    "%TypedArray%": TypedArray,
    "%TypeError%": $TypeError,
    "%Uint8Array%": typeof Uint8Array > "u" ? undefined2 : Uint8Array,
    "%Uint8ClampedArray%": typeof Uint8ClampedArray > "u" ? undefined2 : Uint8ClampedArray,
    "%Uint16Array%": typeof Uint16Array > "u" ? undefined2 : Uint16Array,
    "%Uint32Array%": typeof Uint32Array > "u" ? undefined2 : Uint32Array,
    "%URIError%": $URIError,
    "%WeakMap%": typeof WeakMap > "u" ? undefined2 : WeakMap,
    "%WeakRef%": typeof WeakRef > "u" ? undefined2 : WeakRef,
    "%WeakSet%": typeof WeakSet > "u" ? undefined2 : WeakSet,
    "%Function.prototype.call%": $call,
    "%Function.prototype.apply%": $apply,
    "%Object.defineProperty%": $defineProperty,
    "%Object.getPrototypeOf%": $ObjectGPO,
    "%Math.abs%": abs,
    "%Math.floor%": floor,
    "%Math.max%": max,
    "%Math.min%": min,
    "%Math.pow%": pow,
    "%Math.round%": round,
    "%Math.sign%": sign,
    "%Reflect.getPrototypeOf%": $ReflectGPO
  };
  if (getProto)
    try {
      null.error;
    } catch (e) {
      errorProto = getProto(getProto(e)), INTRINSICS["%Error.prototype%"] = errorProto;
    }
  var errorProto, doEval = function doEval(name) {
    var value;
    if (name === "%AsyncFunction%")
      value = getEvalledConstructor("async function () {}");
    else if (name === "%GeneratorFunction%")
      value = getEvalledConstructor("function* () {}");
    else if (name === "%AsyncGeneratorFunction%")
      value = getEvalledConstructor("async function* () {}");
    else if (name === "%AsyncGenerator%") {
      var fn = doEval("%AsyncGeneratorFunction%");
      if (fn)
        value = fn.prototype;
    } else if (name === "%AsyncIteratorPrototype%") {
      var gen = doEval("%AsyncGenerator%");
      if (gen && getProto)
        value = getProto(gen.prototype);
    }
    return INTRINSICS[name] = value, value;
  }, LEGACY_ALIASES = {
    __proto__: null,
    "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
    "%ArrayPrototype%": ["Array", "prototype"],
    "%ArrayProto_entries%": ["Array", "prototype", "entries"],
    "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
    "%ArrayProto_keys%": ["Array", "prototype", "keys"],
    "%ArrayProto_values%": ["Array", "prototype", "values"],
    "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
    "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
    "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
    "%BooleanPrototype%": ["Boolean", "prototype"],
    "%DataViewPrototype%": ["DataView", "prototype"],
    "%DatePrototype%": ["Date", "prototype"],
    "%ErrorPrototype%": ["Error", "prototype"],
    "%EvalErrorPrototype%": ["EvalError", "prototype"],
    "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
    "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
    "%FunctionPrototype%": ["Function", "prototype"],
    "%Generator%": ["GeneratorFunction", "prototype"],
    "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
    "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
    "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
    "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
    "%JSONParse%": ["JSON", "parse"],
    "%JSONStringify%": ["JSON", "stringify"],
    "%MapPrototype%": ["Map", "prototype"],
    "%NumberPrototype%": ["Number", "prototype"],
    "%ObjectPrototype%": ["Object", "prototype"],
    "%ObjProto_toString%": ["Object", "prototype", "toString"],
    "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
    "%PromisePrototype%": ["Promise", "prototype"],
    "%PromiseProto_then%": ["Promise", "prototype", "then"],
    "%Promise_all%": ["Promise", "all"],
    "%Promise_reject%": ["Promise", "reject"],
    "%Promise_resolve%": ["Promise", "resolve"],
    "%RangeErrorPrototype%": ["RangeError", "prototype"],
    "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
    "%RegExpPrototype%": ["RegExp", "prototype"],
    "%SetPrototype%": ["Set", "prototype"],
    "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
    "%StringPrototype%": ["String", "prototype"],
    "%SymbolPrototype%": ["Symbol", "prototype"],
    "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
    "%TypedArrayPrototype%": ["TypedArray", "prototype"],
    "%TypeErrorPrototype%": ["TypeError", "prototype"],
    "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
    "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
    "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
    "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
    "%URIErrorPrototype%": ["URIError", "prototype"],
    "%WeakMapPrototype%": ["WeakMap", "prototype"],
    "%WeakSetPrototype%": ["WeakSet", "prototype"]
  }, bind2 = require_function_bind(), hasOwn2 = require_hasown(), $concat = bind2.call($call, Array.prototype.concat), $spliceApply = bind2.call($apply, Array.prototype.splice), $replace = bind2.call($call, String.prototype.replace), $strSlice = bind2.call($call, String.prototype.slice), $exec = bind2.call($call, RegExp.prototype.exec), rePropName2 = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g, reEscapeChar2 = /\\(\\)?/g, stringToPath2 = function(string4) {
    var first = $strSlice(string4, 0, 1), last = $strSlice(string4, -1);
    if (first === "%" && last !== "%")
      throw new $SyntaxError("invalid intrinsic syntax, expected closing `%`");
    else if (last === "%" && first !== "%")
      throw new $SyntaxError("invalid intrinsic syntax, expected opening `%`");
    var result = [];
    return $replace(string4, rePropName2, function(match, number4, quote, subString) {
      result[result.length] = quote ? $replace(subString, reEscapeChar2, "$1") : number4 || match;
    }), result;
  }, getBaseIntrinsic = function(name, allowMissing) {
    var intrinsicName = name, alias;
    if (hasOwn2(LEGACY_ALIASES, intrinsicName))
      alias = LEGACY_ALIASES[intrinsicName], intrinsicName = "%" + alias[0] + "%";
    if (hasOwn2(INTRINSICS, intrinsicName)) {
      var value = INTRINSICS[intrinsicName];
      if (value === needsEval)
        value = doEval(intrinsicName);
      if (typeof value > "u" && !allowMissing)
        throw new $TypeError("intrinsic " + name + " exists, but is not available. Please file an issue!");
      return {
        alias,
        name: intrinsicName,
        value
      };
    }
    throw new $SyntaxError("intrinsic " + name + " does not exist!");
  };
  module.exports = function(name, allowMissing) {
    if (typeof name !== "string" || name.length === 0)
      throw new $TypeError("intrinsic name must be a non-empty string");
    if (arguments.length > 1 && typeof allowMissing !== "boolean")
      throw new $TypeError('"allowMissing" argument must be a boolean');
    if ($exec(/^%?[^%]*%?$/, name) === null)
      throw new $SyntaxError("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
    var parts = stringToPath2(name), intrinsicBaseName = parts.length > 0 ? parts[0] : "", intrinsic = getBaseIntrinsic("%" + intrinsicBaseName + "%", allowMissing), intrinsicRealName = intrinsic.name, value = intrinsic.value, skipFurtherCaching = !1, alias = intrinsic.alias;
    if (alias)
      intrinsicBaseName = alias[0], $spliceApply(parts, $concat([0, 1], alias));
    for (var i2 = 1, isOwn = !0;i2 < parts.length; i2 += 1) {
      var part = parts[i2], first = $strSlice(part, 0, 1), last = $strSlice(part, -1);
      if ((first === '"' || first === "'" || first === "`" || (last === '"' || last === "'" || last === "`")) && first !== last)
        throw new $SyntaxError("property names with quotes must have matching quotes");
      if (part === "constructor" || !isOwn)
        skipFurtherCaching = !0;
      if (intrinsicBaseName += "." + part, intrinsicRealName = "%" + intrinsicBaseName + "%", hasOwn2(INTRINSICS, intrinsicRealName))
        value = INTRINSICS[intrinsicRealName];
      else if (value != null) {
        if (!(part in value)) {
          if (!allowMissing)
            throw new $TypeError("base intrinsic for " + name + " exists, but the property is not available.");
          return;
        }
        if ($gOPD && i2 + 1 >= parts.length) {
          var desc = $gOPD(value, part);
          if (isOwn = !!desc, isOwn && "get" in desc && !("originalValue" in desc.get))
            value = desc.get;
          else
            value = value[part];
        } else
          isOwn = hasOwn2(value, part), value = value[part];
        if (isOwn && !skipFurtherCaching)
          INTRINSICS[intrinsicRealName] = value;
      }
    }
    return value;
  };
});
