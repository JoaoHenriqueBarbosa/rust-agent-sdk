// var: require_baseN
var require_baseN = __commonJS((exports, module) => {
  var api2 = {};
  module.exports = api2;
  var _reverseAlphabets = {};
  api2.encode = function(input, alphabet, maxline) {
    if (typeof alphabet !== "string")
      throw TypeError('"alphabet" must be a string.');
    if (maxline !== void 0 && typeof maxline !== "number")
      throw TypeError('"maxline" must be a number.');
    var output = "";
    if (!(input instanceof Uint8Array))
      output = _encodeWithByteBuffer(input, alphabet);
    else {
      var i5 = 0, base2 = alphabet.length, first = alphabet.charAt(0), digits = [0];
      for (i5 = 0;i5 < input.length; ++i5) {
        for (var j4 = 0, carry = input[i5];j4 < digits.length; ++j4)
          carry += digits[j4] << 8, digits[j4] = carry % base2, carry = carry / base2 | 0;
        while (carry > 0)
          digits.push(carry % base2), carry = carry / base2 | 0;
      }
      for (i5 = 0;input[i5] === 0 && i5 < input.length - 1; ++i5)
        output += first;
      for (i5 = digits.length - 1;i5 >= 0; --i5)
        output += alphabet[digits[i5]];
    }
    if (maxline) {
      var regex2 = new RegExp(".{1," + maxline + "}", "g");
      output = output.match(regex2).join(`\r
`);
    }
    return output;
  };
  api2.decode = function(input, alphabet) {
    if (typeof input !== "string")
      throw TypeError('"input" must be a string.');
    if (typeof alphabet !== "string")
      throw TypeError('"alphabet" must be a string.');
    var table = _reverseAlphabets[alphabet];
    if (!table) {
      table = _reverseAlphabets[alphabet] = [];
      for (var i5 = 0;i5 < alphabet.length; ++i5)
        table[alphabet.charCodeAt(i5)] = i5;
    }
    input = input.replace(/\s/g, "");
    var base2 = alphabet.length, first = alphabet.charAt(0), bytes = [0];
    for (var i5 = 0;i5 < input.length; i5++) {
      var value = table[input.charCodeAt(i5)];
      if (value === void 0)
        return;
      for (var j4 = 0, carry = value;j4 < bytes.length; ++j4)
        carry += bytes[j4] * base2, bytes[j4] = carry & 255, carry >>= 8;
      while (carry > 0)
        bytes.push(carry & 255), carry >>= 8;
    }
    for (var k3 = 0;input[k3] === first && k3 < input.length - 1; ++k3)
      bytes.push(0);
    if (typeof Buffer < "u")
      return Buffer.from(bytes.reverse());
    return new Uint8Array(bytes.reverse());
  };
  function _encodeWithByteBuffer(input, alphabet) {
    var i5 = 0, base2 = alphabet.length, first = alphabet.charAt(0), digits = [0];
    for (i5 = 0;i5 < input.length(); ++i5) {
      for (var j4 = 0, carry = input.at(i5);j4 < digits.length; ++j4)
        carry += digits[j4] << 8, digits[j4] = carry % base2, carry = carry / base2 | 0;
      while (carry > 0)
        digits.push(carry % base2), carry = carry / base2 | 0;
    }
    var output = "";
    for (i5 = 0;input.at(i5) === 0 && i5 < input.length() - 1; ++i5)
      output += first;
    for (i5 = digits.length - 1;i5 >= 0; --i5)
      output += alphabet[digits[i5]];
    return output;
  }
});
