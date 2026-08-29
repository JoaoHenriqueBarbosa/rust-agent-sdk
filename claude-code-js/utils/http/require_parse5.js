// var: require_parse5
var require_parse5 = __commonJS((exports, module) => {
  var BigNumber = null, suspectProtoRx = /(?:_|\\u005[Ff])(?:_|\\u005[Ff])(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006[Ff])(?:t|\\u0074)(?:o|\\u006[Ff])(?:_|\\u005[Ff])(?:_|\\u005[Ff])/, suspectConstructorRx = /(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)/, json_parse = function(options) {
    var _options = {
      strict: !1,
      storeAsString: !1,
      alwaysParseAsBig: !1,
      useNativeBigInt: !1,
      protoAction: "error",
      constructorAction: "error"
    };
    if (options !== void 0 && options !== null) {
      if (options.strict === !0)
        _options.strict = !0;
      if (options.storeAsString === !0)
        _options.storeAsString = !0;
      if (_options.alwaysParseAsBig = options.alwaysParseAsBig === !0 ? options.alwaysParseAsBig : !1, _options.useNativeBigInt = options.useNativeBigInt === !0 ? options.useNativeBigInt : !1, typeof options.constructorAction < "u")
        if (options.constructorAction === "error" || options.constructorAction === "ignore" || options.constructorAction === "preserve")
          _options.constructorAction = options.constructorAction;
        else
          throw Error(`Incorrect value for constructorAction option, must be "error", "ignore" or undefined but passed ${options.constructorAction}`);
      if (typeof options.protoAction < "u")
        if (options.protoAction === "error" || options.protoAction === "ignore" || options.protoAction === "preserve")
          _options.protoAction = options.protoAction;
        else
          throw Error(`Incorrect value for protoAction option, must be "error", "ignore" or undefined but passed ${options.protoAction}`);
    }
    var at, ch, escapee = {
      '"': '"',
      "\\": "\\",
      "/": "/",
      b: "\b",
      f: "\f",
      n: `
`,
      r: "\r",
      t: "\t"
    }, text, error43 = function(m4) {
      throw {
        name: "SyntaxError",
        message: m4,
        at,
        text
      };
    }, next = function(c3) {
      if (c3 && c3 !== ch)
        error43("Expected '" + c3 + "' instead of '" + ch + "'");
      return ch = text.charAt(at), at += 1, ch;
    }, number4 = function() {
      var number5, string5 = "";
      if (ch === "-")
        string5 = "-", next("-");
      while (ch >= "0" && ch <= "9")
        string5 += ch, next();
      if (ch === ".") {
        string5 += ".";
        while (next() && ch >= "0" && ch <= "9")
          string5 += ch;
      }
      if (ch === "e" || ch === "E") {
        if (string5 += ch, next(), ch === "-" || ch === "+")
          string5 += ch, next();
        while (ch >= "0" && ch <= "9")
          string5 += ch, next();
      }
      if (number5 = +string5, !isFinite(number5))
        error43("Bad number");
      else {
        if (BigNumber == null)
          BigNumber = require_bignumber();
        if (string5.length > 15)
          return _options.storeAsString ? string5 : _options.useNativeBigInt ? BigInt(string5) : new BigNumber(string5);
        else
          return !_options.alwaysParseAsBig ? number5 : _options.useNativeBigInt ? BigInt(number5) : new BigNumber(number5);
      }
    }, string4 = function() {
      var hex, i4, string5 = "", uffff;
      if (ch === '"') {
        var startAt = at;
        while (next()) {
          if (ch === '"') {
            if (at - 1 > startAt)
              string5 += text.substring(startAt, at - 1);
            return next(), string5;
          }
          if (ch === "\\") {
            if (at - 1 > startAt)
              string5 += text.substring(startAt, at - 1);
            if (next(), ch === "u") {
              uffff = 0;
              for (i4 = 0;i4 < 4; i4 += 1) {
                if (hex = parseInt(next(), 16), !isFinite(hex))
                  break;
                uffff = uffff * 16 + hex;
              }
              string5 += String.fromCharCode(uffff);
            } else if (typeof escapee[ch] === "string")
              string5 += escapee[ch];
            else
              break;
            startAt = at;
          }
        }
      }
      error43("Bad string");
    }, white2 = function() {
      while (ch && ch <= " ")
        next();
    }, word = function() {
      switch (ch) {
        case "t":
          return next("t"), next("r"), next("u"), next("e"), !0;
        case "f":
          return next("f"), next("a"), next("l"), next("s"), next("e"), !1;
        case "n":
          return next("n"), next("u"), next("l"), next("l"), null;
      }
      error43("Unexpected '" + ch + "'");
    }, value, array2 = function() {
      var array3 = [];
      if (ch === "[") {
        if (next("["), white2(), ch === "]")
          return next("]"), array3;
        while (ch) {
          if (array3.push(value()), white2(), ch === "]")
            return next("]"), array3;
          next(","), white2();
        }
      }
      error43("Bad array");
    }, object2 = function() {
      var key, object3 = Object.create(null);
      if (ch === "{") {
        if (next("{"), white2(), ch === "}")
          return next("}"), object3;
        while (ch) {
          if (key = string4(), white2(), next(":"), _options.strict === !0 && Object.hasOwnProperty.call(object3, key))
            error43('Duplicate key "' + key + '"');
          if (suspectProtoRx.test(key) === !0)
            if (_options.protoAction === "error")
              error43("Object contains forbidden prototype property");
            else if (_options.protoAction === "ignore")
              value();
            else
              object3[key] = value();
          else if (suspectConstructorRx.test(key) === !0)
            if (_options.constructorAction === "error")
              error43("Object contains forbidden constructor property");
            else if (_options.constructorAction === "ignore")
              value();
            else
              object3[key] = value();
          else
            object3[key] = value();
          if (white2(), ch === "}")
            return next("}"), object3;
          next(","), white2();
        }
      }
      error43("Bad object");
    };
