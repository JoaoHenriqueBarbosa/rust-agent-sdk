// var: require_asn1
var require_asn1 = __commonJS((exports, module) => {
  var forge = require_forge();
  require_util3();
  require_oids();
  var asn1 = module.exports = forge.asn1 = forge.asn1 || {};
  asn1.Class = {
    UNIVERSAL: 0,
    APPLICATION: 64,
    CONTEXT_SPECIFIC: 128,
    PRIVATE: 192
  };
  asn1.Type = {
    NONE: 0,
    BOOLEAN: 1,
    INTEGER: 2,
    BITSTRING: 3,
    OCTETSTRING: 4,
    NULL: 5,
    OID: 6,
    ODESC: 7,
    EXTERNAL: 8,
    REAL: 9,
    ENUMERATED: 10,
    EMBEDDED: 11,
    UTF8: 12,
    ROID: 13,
    SEQUENCE: 16,
    SET: 17,
    PRINTABLESTRING: 19,
    IA5STRING: 22,
    UTCTIME: 23,
    GENERALIZEDTIME: 24,
    BMPSTRING: 30
  };
  asn1.maxDepth = 256;
  asn1.create = function(tagClass, type, constructed, value, options) {
    if (forge.util.isArray(value)) {
      var tmp = [];
      for (var i5 = 0;i5 < value.length; ++i5)
        if (value[i5] !== void 0)
          tmp.push(value[i5]);
      value = tmp;
    }
    var obj = {
      tagClass,
      type,
      constructed,
      composed: constructed || forge.util.isArray(value),
      value
    };
    if (options && "bitStringContents" in options)
      obj.bitStringContents = options.bitStringContents, obj.original = asn1.copy(obj);
    return obj;
  };
  asn1.copy = function(obj, options) {
    var copy;
    if (forge.util.isArray(obj)) {
      copy = [];
      for (var i5 = 0;i5 < obj.length; ++i5)
        copy.push(asn1.copy(obj[i5], options));
      return copy;
    }
    if (typeof obj === "string")
      return obj;
    if (copy = {
      tagClass: obj.tagClass,
      type: obj.type,
      constructed: obj.constructed,
      composed: obj.composed,
      value: asn1.copy(obj.value, options)
    }, options && !options.excludeBitStringContents)
      copy.bitStringContents = obj.bitStringContents;
    return copy;
  };
  asn1.equals = function(obj1, obj2, options) {
    if (forge.util.isArray(obj1)) {
      if (!forge.util.isArray(obj2))
        return !1;
      if (obj1.length !== obj2.length)
        return !1;
      for (var i5 = 0;i5 < obj1.length; ++i5)
        if (!asn1.equals(obj1[i5], obj2[i5]))
          return !1;
      return !0;
    }
    if (typeof obj1 !== typeof obj2)
      return !1;
    if (typeof obj1 === "string")
      return obj1 === obj2;
    var equal = obj1.tagClass === obj2.tagClass && obj1.type === obj2.type && obj1.constructed === obj2.constructed && obj1.composed === obj2.composed && asn1.equals(obj1.value, obj2.value);
    if (options && options.includeBitStringContents)
      equal = equal && obj1.bitStringContents === obj2.bitStringContents;
    return equal;
  };
  asn1.getBerValueLength = function(b) {
    var b22 = b.getByte();
    if (b22 === 128)
      return;
    var length, longForm = b22 & 128;
    if (!longForm)
      length = b22;
    else
      length = b.getInt((b22 & 127) << 3);
    return length;
  };
  function _checkBufferLength(bytes, remaining, n5) {
    if (n5 > remaining) {
      var error44 = Error("Too few bytes to parse DER.");
      throw error44.available = bytes.length(), error44.remaining = remaining, error44.requested = n5, error44;
    }
  }
  var _getValueLength = function(bytes, remaining) {
    var b22 = bytes.getByte();
    if (remaining--, b22 === 128)
      return;
    var length, longForm = b22 & 128;
    if (!longForm)
      length = b22;
    else {
      var longFormBytes = b22 & 127;
      _checkBufferLength(bytes, remaining, longFormBytes), length = bytes.getInt(longFormBytes << 3);
    }
    if (length < 0)
      throw Error("Negative length: " + length);
    return length;
  };
  asn1.fromDer = function(bytes, options) {
    if (options === void 0)
      options = {
        strict: !0,
        parseAllBytes: !0,
        decodeBitStrings: !0
      };
    if (typeof options === "boolean")
      options = {
        strict: options,
        parseAllBytes: !0,
        decodeBitStrings: !0
      };
    if (!("strict" in options))
      options.strict = !0;
    if (!("parseAllBytes" in options))
      options.parseAllBytes = !0;
    if (!("decodeBitStrings" in options))
      options.decodeBitStrings = !0;
    if (!("maxDepth" in options))
      options.maxDepth = asn1.maxDepth;
    if (typeof bytes === "string")
      bytes = forge.util.createBuffer(bytes);
    var byteCount = bytes.length(), value = _fromDer(bytes, bytes.length(), 0, options);
    if (options.parseAllBytes && bytes.length() !== 0) {
      var error44 = Error("Unparsed DER bytes remain after ASN.1 parsing.");
      throw error44.byteCount = byteCount, error44.remaining = bytes.length(), error44;
    }
    return value;
  };
  function _fromDer(bytes, remaining, depth, options) {
    if (depth >= options.maxDepth)
      throw Error("ASN.1 parsing error: Max depth exceeded.");
    var start;
    _checkBufferLength(bytes, remaining, 2);
    var b1 = bytes.getByte();
    remaining--;
    var tagClass = b1 & 192, type = b1 & 31;
    start = bytes.length();
    var length = _getValueLength(bytes, remaining);
    if (remaining -= start - bytes.length(), length !== void 0 && length > remaining) {
      if (options.strict) {
        var error44 = Error("Too few bytes to read ASN.1 value.");
        throw error44.available = bytes.length(), error44.remaining = remaining, error44.requested = length, error44;
      }
      length = remaining;
    }
    var value, bitStringContents, constructed = (b1 & 32) === 32;
    if (constructed)
      if (value = [], length === void 0)
        for (;; ) {
          if (_checkBufferLength(bytes, remaining, 2), bytes.bytes(2) === String.fromCharCode(0, 0)) {
            bytes.getBytes(2), remaining -= 2;
            break;
          }
          start = bytes.length(), value.push(_fromDer(bytes, remaining, depth + 1, options)), remaining -= start - bytes.length();
        }
      else
        while (length > 0)
          start = bytes.length(), value.push(_fromDer(bytes, length, depth + 1, options)), remaining -= start - bytes.length(), length -= start - bytes.length();
    if (value === void 0 && tagClass === asn1.Class.UNIVERSAL && type === asn1.Type.BITSTRING)
      bitStringContents = bytes.bytes(length);
    if (value === void 0 && options.decodeBitStrings && tagClass === asn1.Class.UNIVERSAL && type === asn1.Type.BITSTRING && length > 1) {
      var savedRead = bytes.read, savedRemaining = remaining, unused = 0;
      if (type === asn1.Type.BITSTRING)
        _checkBufferLength(bytes, remaining, 1), unused = bytes.getByte(), remaining--;
      if (unused === 0)
        try {
          start = bytes.length();
          var subOptions = {
            strict: !0,
            decodeBitStrings: !0
          }, composed = _fromDer(bytes, remaining, depth + 1, subOptions), used = start - bytes.length();
          if (remaining -= used, type == asn1.Type.BITSTRING)
            used++;
          var tc = composed.tagClass;
          if (used === length && (tc === asn1.Class.UNIVERSAL || tc === asn1.Class.CONTEXT_SPECIFIC))
            value = [composed];
        } catch (ex) {}
      if (value === void 0)
        bytes.read = savedRead, remaining = savedRemaining;
    }
    if (value === void 0) {
      if (length === void 0) {
        if (options.strict)
          throw Error("Non-constructed ASN.1 object of indefinite length.");
        length = remaining;
      }
      if (type === asn1.Type.BMPSTRING) {
        value = "";
        for (;length > 0; length -= 2)
          _checkBufferLength(bytes, remaining, 2), value += String.fromCharCode(bytes.getInt16()), remaining -= 2;
      } else
        value = bytes.getBytes(length), remaining -= length;
    }
    var asn1Options = bitStringContents === void 0 ? null : {
      bitStringContents
    };
    return asn1.create(tagClass, type, constructed, value, asn1Options);
  }
  asn1.toDer = function(obj) {
    var bytes = forge.util.createBuffer(), b1 = obj.tagClass | obj.type, value = forge.util.createBuffer(), useBitStringContents = !1;
    if ("bitStringContents" in obj) {
      if (useBitStringContents = !0, obj.original)
        useBitStringContents = asn1.equals(obj, obj.original);
    }
    if (useBitStringContents)
      value.putBytes(obj.bitStringContents);
    else if (obj.composed) {
      if (obj.constructed)
        b1 |= 32;
      else
        value.putByte(0);
      for (var i5 = 0;i5 < obj.value.length; ++i5)
        if (obj.value[i5] !== void 0)
          value.putBuffer(asn1.toDer(obj.value[i5]));
    } else if (obj.type === asn1.Type.BMPSTRING)
      for (var i5 = 0;i5 < obj.value.length; ++i5)
        value.putInt16(obj.value.charCodeAt(i5));
    else if (obj.type === asn1.Type.INTEGER && obj.value.length > 1 && (obj.value.charCodeAt(0) === 0 && (obj.value.charCodeAt(1) & 128) === 0 || obj.value.charCodeAt(0) === 255 && (obj.value.charCodeAt(1) & 128) === 128))
      value.putBytes(obj.value.substr(1));
    else
      value.putBytes(obj.value);
    if (bytes.putByte(b1), value.length() <= 127)
      bytes.putByte(value.length() & 127);
    else {
      var len = value.length(), lenBytes = "";
      do
        lenBytes += String.fromCharCode(len & 255), len = len >>> 8;
      while (len > 0);
      bytes.putByte(lenBytes.length | 128);
      for (var i5 = lenBytes.length - 1;i5 >= 0; --i5)
        bytes.putByte(lenBytes.charCodeAt(i5));
    }
    return bytes.putBuffer(value), bytes;
  };
  asn1.oidToDer = function(oid) {
    var values3 = oid.split("."), bytes = forge.util.createBuffer();
    bytes.putByte(40 * parseInt(values3[0], 10) + parseInt(values3[1], 10));
    var last2, valueBytes, value, b;
    for (var i5 = 2;i5 < values3.length; ++i5) {
      if (last2 = !0, valueBytes = [], value = parseInt(values3[i5], 10), value > 4294967295)
        throw Error("OID value too large; max is 32-bits.");
      do {
        if (b = value & 127, value = value >>> 7, !last2)
          b |= 128;
        valueBytes.push(b), last2 = !1;
      } while (value > 0);
      for (var n5 = valueBytes.length - 1;n5 >= 0; --n5)
        bytes.putByte(valueBytes[n5]);
    }
    return bytes;
  };
  asn1.derToOid = function(bytes) {
    var oid;
    if (typeof bytes === "string")
      bytes = forge.util.createBuffer(bytes);
    var b = bytes.getByte();
    oid = Math.floor(b / 40) + "." + b % 40;
    var value = 0;
    while (bytes.length() > 0) {
      if (value > 70368744177663)
        throw Error("OID value too large; max is 53-bits.");
      if (b = bytes.getByte(), value = value * 128, b & 128)
        value += b & 127;
      else
        oid += "." + (value + b), value = 0;
    }
    return oid;
  };
  asn1.utcTimeToDate = function(utc) {
    var date5 = /* @__PURE__ */ new Date, year = parseInt(utc.substr(0, 2), 10);
    year = year >= 50 ? 1900 + year : 2000 + year;
    var MM = parseInt(utc.substr(2, 2), 10) - 1, DD = parseInt(utc.substr(4, 2), 10), hh = parseInt(utc.substr(6, 2), 10), mm = parseInt(utc.substr(8, 2), 10), ss = 0;
    if (utc.length > 11) {
      var c3 = utc.charAt(10), end = 10;
      if (c3 !== "+" && c3 !== "-")
        ss = parseInt(utc.substr(10, 2), 10), end += 2;
    }
    if (date5.setUTCFullYear(year, MM, DD), date5.setUTCHours(hh, mm, ss, 0), end) {
      if (c3 = utc.charAt(end), c3 === "+" || c3 === "-") {
        var hhoffset = parseInt(utc.substr(end + 1, 2), 10), mmoffset = parseInt(utc.substr(end + 4, 2), 10), offset = hhoffset * 60 + mmoffset;
        if (offset *= 60000, c3 === "+")
          date5.setTime(+date5 - offset);
        else
          date5.setTime(+date5 + offset);
      }
    }
    return date5;
  };
  asn1.generalizedTimeToDate = function(gentime) {
    var date5 = /* @__PURE__ */ new Date, YYYY = parseInt(gentime.substr(0, 4), 10), MM = parseInt(gentime.substr(4, 2), 10) - 1, DD = parseInt(gentime.substr(6, 2), 10), hh = parseInt(gentime.substr(8, 2), 10), mm = parseInt(gentime.substr(10, 2), 10), ss = parseInt(gentime.substr(12, 2), 10), fff = 0, offset = 0, isUTC = !1;
    if (gentime.charAt(gentime.length - 1) === "Z")
      isUTC = !0;
    var end = gentime.length - 5, c3 = gentime.charAt(end);
    if (c3 === "+" || c3 === "-") {
      var hhoffset = parseInt(gentime.substr(end + 1, 2), 10), mmoffset = parseInt(gentime.substr(end + 4, 2), 10);
      if (offset = hhoffset * 60 + mmoffset, offset *= 60000, c3 === "+")
        offset *= -1;
      isUTC = !0;
    }
    if (gentime.charAt(14) === ".")
      fff = parseFloat(gentime.substr(14), 10) * 1000;
    if (isUTC)
      date5.setUTCFullYear(YYYY, MM, DD), date5.setUTCHours(hh, mm, ss, fff), date5.setTime(+date5 + offset);
    else
      date5.setFullYear(YYYY, MM, DD), date5.setHours(hh, mm, ss, fff);
    return date5;
  };
  asn1.dateToUtcTime = function(date5) {
    if (typeof date5 === "string")
      return date5;
    var rval = "", format4 = [];
    format4.push(("" + date5.getUTCFullYear()).substr(2)), format4.push("" + (date5.getUTCMonth() + 1)), format4.push("" + date5.getUTCDate()), format4.push("" + date5.getUTCHours()), format4.push("" + date5.getUTCMinutes()), format4.push("" + date5.getUTCSeconds());
    for (var i5 = 0;i5 < format4.length; ++i5) {
      if (format4[i5].length < 2)
        rval += "0";
      rval += format4[i5];
    }
    return rval += "Z", rval;
  };
  asn1.dateToGeneralizedTime = function(date5) {
    if (typeof date5 === "string")
      return date5;
    var rval = "", format4 = [];
    format4.push("" + date5.getUTCFullYear()), format4.push("" + (date5.getUTCMonth() + 1)), format4.push("" + date5.getUTCDate()), format4.push("" + date5.getUTCHours()), format4.push("" + date5.getUTCMinutes()), format4.push("" + date5.getUTCSeconds());
    for (var i5 = 0;i5 < format4.length; ++i5) {
      if (format4[i5].length < 2)
        rval += "0";
      rval += format4[i5];
    }
    return rval += "Z", rval;
  };
  asn1.integerToDer = function(x4) {
    var rval = forge.util.createBuffer();
    if (x4 >= -128 && x4 < 128)
      return rval.putSignedInt(x4, 8);
    if (x4 >= -32768 && x4 < 32768)
      return rval.putSignedInt(x4, 16);
    if (x4 >= -8388608 && x4 < 8388608)
      return rval.putSignedInt(x4, 24);
    if (x4 >= -2147483648 && x4 < 2147483648)
      return rval.putSignedInt(x4, 32);
    var error44 = Error("Integer too large; max is 32-bits.");
    throw error44.integer = x4, error44;
  };
  asn1.derToInteger = function(bytes) {
    if (typeof bytes === "string")
      bytes = forge.util.createBuffer(bytes);
    var n5 = bytes.length() * 8;
    if (n5 > 32)
      throw Error("Integer too large; max is 32-bits.");
    return bytes.getSignedInt(n5);
  };
  asn1.validate = function(obj, v2, capture, errors8) {
    var rval = !1;
    if ((obj.tagClass === v2.tagClass || typeof v2.tagClass > "u") && (obj.type === v2.type || typeof v2.type > "u")) {
      if (obj.constructed === v2.constructed || typeof v2.constructed > "u") {
        if (rval = !0, v2.value && forge.util.isArray(v2.value)) {
          var j4 = 0;
          for (var i5 = 0;rval && i5 < v2.value.length; ++i5) {
            var schemaItem = v2.value[i5];
            rval = !!schemaItem.optional;
            var objChild = obj.value[j4];
            if (!objChild) {
              if (!schemaItem.optional) {
                if (rval = !1, errors8)
                  errors8.push("[" + v2.name + '] Missing required element. Expected tag class "' + schemaItem.tagClass + '", type "' + schemaItem.type + '"');
              }
              continue;
            }
            var schemaHasTag = typeof schemaItem.tagClass < "u" && typeof schemaItem.type < "u";
            if (schemaHasTag && (objChild.tagClass !== schemaItem.tagClass || objChild.type !== schemaItem.type))
              if (schemaItem.optional) {
                rval = !0;
                continue;
              } else {
                if (rval = !1, errors8)
                  errors8.push("[" + v2.name + "] Tag mismatch. Expected (" + schemaItem.tagClass + "," + schemaItem.type + "), got (" + objChild.tagClass + "," + objChild.type + ")");
                break;
              }
            var childRval = asn1.validate(objChild, schemaItem, capture, errors8);
            if (childRval)
              ++j4, rval = !0;
            else if (schemaItem.optional)
              rval = !0;
            else {
              rval = !1;
              break;
            }
          }
        }
        if (rval && capture) {
          if (v2.capture)
            capture[v2.capture] = obj.value;
          if (v2.captureAsn1)
            capture[v2.captureAsn1] = obj;
          if (v2.captureBitStringContents && "bitStringContents" in obj)
            capture[v2.captureBitStringContents] = obj.bitStringContents;
          if (v2.captureBitStringValue && "bitStringContents" in obj) {
            var value;
            if (obj.bitStringContents.length < 2)
              capture[v2.captureBitStringValue] = "";
            else {
              var unused = obj.bitStringContents.charCodeAt(0);
              if (unused !== 0)
                throw Error("captureBitStringValue only supported for zero unused bits");
              capture[v2.captureBitStringValue] = obj.bitStringContents.slice(1);
            }
          }
        }
      } else if (errors8)
        errors8.push("[" + v2.name + '] Expected constructed "' + v2.constructed + '", got "' + obj.constructed + '"');
    } else if (errors8) {
      if (obj.tagClass !== v2.tagClass)
        errors8.push("[" + v2.name + '] Expected tag class "' + v2.tagClass + '", got "' + obj.tagClass + '"');
      if (obj.type !== v2.type)
        errors8.push("[" + v2.name + '] Expected type "' + v2.type + '", got "' + obj.type + '"');
    }
    return rval;
  };
  var _nonLatinRegex = /[^\\u0000-\\u00ff]/;
  asn1.prettyPrint = function(obj, level, indentation) {
    var rval = "";
    if (level = level || 0, indentation = indentation || 2, level > 0)
      rval += `
`;
    var indent = "";
    for (var i5 = 0;i5 < level * indentation; ++i5)
      indent += " ";
    switch (rval += indent + "Tag: ", obj.tagClass) {
      case asn1.Class.UNIVERSAL:
        rval += "Universal:";
        break;
      case asn1.Class.APPLICATION:
        rval += "Application:";
        break;
      case asn1.Class.CONTEXT_SPECIFIC:
        rval += "Context-Specific:";
        break;
      case asn1.Class.PRIVATE:
        rval += "Private:";
        break;
    }
    if (obj.tagClass === asn1.Class.UNIVERSAL)
      switch (rval += obj.type, obj.type) {
        case asn1.Type.NONE:
          rval += " (None)";
          break;
        case asn1.Type.BOOLEAN:
          rval += " (Boolean)";
          break;
        case asn1.Type.INTEGER:
          rval += " (Integer)";
          break;
        case asn1.Type.BITSTRING:
          rval += " (Bit string)";
          break;
        case asn1.Type.OCTETSTRING:
          rval += " (Octet string)";
          break;
        case asn1.Type.NULL:
          rval += " (Null)";
          break;
        case asn1.Type.OID:
          rval += " (Object Identifier)";
          break;
        case asn1.Type.ODESC:
          rval += " (Object Descriptor)";
          break;
        case asn1.Type.EXTERNAL:
          rval += " (External or Instance of)";
          break;
        case asn1.Type.REAL:
          rval += " (Real)";
          break;
        case asn1.Type.ENUMERATED:
          rval += " (Enumerated)";
          break;
        case asn1.Type.EMBEDDED:
          rval += " (Embedded PDV)";
          break;
        case asn1.Type.UTF8:
          rval += " (UTF8)";
          break;
        case asn1.Type.ROID:
          rval += " (Relative Object Identifier)";
          break;
        case asn1.Type.SEQUENCE:
          rval += " (Sequence)";
          break;
        case asn1.Type.SET:
          rval += " (Set)";
          break;
        case asn1.Type.PRINTABLESTRING:
          rval += " (Printable String)";
          break;
        case asn1.Type.IA5String:
          rval += " (IA5String (ASCII))";
          break;
        case asn1.Type.UTCTIME:
          rval += " (UTC time)";
          break;
        case asn1.Type.GENERALIZEDTIME:
          rval += " (Generalized time)";
          break;
        case asn1.Type.BMPSTRING:
          rval += " (BMP String)";
          break;
      }
    else
      rval += obj.type;
    if (rval += `
`, rval += indent + "Constructed: " + obj.constructed + `
`, obj.composed) {
      var subvalues = 0, sub = "";
      for (var i5 = 0;i5 < obj.value.length; ++i5)
        if (obj.value[i5] !== void 0) {
          if (subvalues += 1, sub += asn1.prettyPrint(obj.value[i5], level + 1, indentation), i5 + 1 < obj.value.length)
            sub += ",";
        }
      rval += indent + "Sub values: " + subvalues + sub;
    } else {
      if (rval += indent + "Value: ", obj.type === asn1.Type.OID) {
        var oid = asn1.derToOid(obj.value);
        if (rval += oid, forge.pki && forge.pki.oids) {
          if (oid in forge.pki.oids)
            rval += " (" + forge.pki.oids[oid] + ") ";
        }
      }
      if (obj.type === asn1.Type.INTEGER)
        try {
          rval += asn1.derToInteger(obj.value);
        } catch (ex) {
          rval += "0x" + forge.util.bytesToHex(obj.value);
        }
      else if (obj.type === asn1.Type.BITSTRING) {
        if (obj.value.length > 1)
          rval += "0x" + forge.util.bytesToHex(obj.value.slice(1));
        else
          rval += "(none)";
        if (obj.value.length > 0) {
          var unused = obj.value.charCodeAt(0);
          if (unused == 1)
            rval += " (1 unused bit shown)";
          else if (unused > 1)
            rval += " (" + unused + " unused bits shown)";
        }
      } else if (obj.type === asn1.Type.OCTETSTRING) {
        if (!_nonLatinRegex.test(obj.value))
          rval += "(" + obj.value + ") ";
        rval += "0x" + forge.util.bytesToHex(obj.value);
      } else if (obj.type === asn1.Type.UTF8)
        try {
          rval += forge.util.decodeUtf8(obj.value);
        } catch (e) {
          if (e.message === "URI malformed")
            rval += "0x" + forge.util.bytesToHex(obj.value) + " (malformed UTF8)";
          else
            throw e;
        }
      else if (obj.type === asn1.Type.PRINTABLESTRING || obj.type === asn1.Type.IA5String)
        rval += obj.value;
      else if (_nonLatinRegex.test(obj.value))
        rval += "0x" + forge.util.bytesToHex(obj.value);
      else if (obj.value.length === 0)
        rval += "[null]";
      else
        rval += obj.value;
    }
    return rval;
  };
});
