// var: require_stringify3
var require_stringify3 = __commonJS((exports, module) => {
  var BigNumber = require_bignumber(), JSON2 = exports;
  (function() {
    function f(n5) {
      return n5 < 10 ? "0" + n5 : n5;
    }
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = {
      "\b": "\\b",
      "\t": "\\t",
      "\n": "\\n",
      "\f": "\\f",
      "\r": "\\r",
      '"': "\\\"",
      "\\": "\\\\"
    }, rep;
    function quote(string4) {
      return escapable.lastIndex = 0, escapable.test(string4) ? '"' + string4.replace(escapable, function(a2) {
        var c3 = meta[a2];
        return typeof c3 === "string" ? c3 : "\\u" + ("0000" + a2.charCodeAt(0).toString(16)).slice(-4);
      }) + '"' : '"' + string4 + '"';
    }
    function str(key, holder) {
      var i4, k3, v2, length, mind = gap, partial2, value = holder[key], isBigNumber = value != null && (value instanceof BigNumber || BigNumber.isBigNumber(value));
      if (value && typeof value === "object" && typeof value.toJSON === "function")
        value = value.toJSON(key);
      if (typeof rep === "function")
        value = rep.call(holder, key, value);
      switch (typeof value) {
        case "string":
          if (isBigNumber)
            return value;
          else
            return quote(value);
        case "number":
          return isFinite(value) ? String(value) : "null";
        case "boolean":
        case "null":
        case "bigint":
          return String(value);
        case "object":
          if (!value)
            return "null";
          if (gap += indent, partial2 = [], Object.prototype.toString.apply(value) === "[object Array]") {
            length = value.length;
            for (i4 = 0;i4 < length; i4 += 1)
              partial2[i4] = str(i4, value) || "null";
            return v2 = partial2.length === 0 ? "[]" : gap ? `[
` + gap + partial2.join(`,
` + gap) + `
` + mind + "]" : "[" + partial2.join(",") + "]", gap = mind, v2;
          }
          if (rep && typeof rep === "object") {
            length = rep.length;
            for (i4 = 0;i4 < length; i4 += 1)
              if (typeof rep[i4] === "string") {
                if (k3 = rep[i4], v2 = str(k3, value), v2)
                  partial2.push(quote(k3) + (gap ? ": " : ":") + v2);
              }
          } else
            Object.keys(value).forEach(function(k4) {
              var v6 = str(k4, value);
              if (v6)
                partial2.push(quote(k4) + (gap ? ": " : ":") + v6);
            });
          return v2 = partial2.length === 0 ? "{}" : gap ? `{
` + gap + partial2.join(`,
` + gap) + `
` + mind + "}" : "{" + partial2.join(",") + "}", gap = mind, v2;
      }
    }
    if (typeof JSON2.stringify !== "function")
      JSON2.stringify = function(value, replacer, space) {
        var i4;
        if (gap = "", indent = "", typeof space === "number")
          for (i4 = 0;i4 < space; i4 += 1)
            indent += " ";
        else if (typeof space === "string")
          indent = space;
        if (rep = replacer, replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number"))
          throw Error("JSON.stringify");
        return str("", { "": value });
      };
  })();
});
