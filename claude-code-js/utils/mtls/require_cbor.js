// var: require_cbor
var require_cbor = __commonJS((exports) => {
  var serde3 = require_serde(), utilUtf8 = require_dist_cjs17(), protocols = require_protocols(), protocolHttp = require_dist_cjs28(), utilBodyLengthBrowser = require_dist_cjs78(), schema2 = require_schema(), utilMiddleware = require_dist_cjs30(), utilBase64 = require_dist_cjs34(), majorUint64 = 0, majorNegativeInt64 = 1, majorUnstructuredByteString = 2, majorUtf8String = 3, majorList = 4, majorMap = 5, majorTag = 6, majorSpecial = 7, specialFalse = 20, specialTrue = 21, specialNull = 22, specialUndefined = 23, extendedOneByte = 24, extendedFloat16 = 25, extendedFloat32 = 26, extendedFloat64 = 27, minorIndefinite = 31;
  function alloc(size) {
    return typeof Buffer < "u" ? Buffer.alloc(size) : new Uint8Array(size);
  }
  var tagSymbol = Symbol("@smithy/core/cbor::tagSymbol");
  function tag(data2) {
    return data2[tagSymbol] = !0, data2;
  }
  var USE_TEXT_DECODER = typeof TextDecoder < "u", USE_BUFFER$1 = typeof Buffer < "u", payload = alloc(0), dataView$1 = new DataView(payload.buffer, payload.byteOffset, payload.byteLength), textDecoder2 = USE_TEXT_DECODER ? /* @__PURE__ */ new TextDecoder : null, _offset = 0;
  function setPayload(bytes) {
    payload = bytes, dataView$1 = new DataView(payload.buffer, payload.byteOffset, payload.byteLength);
  }
  function decode(at, to) {
    if (at >= to)
      throw Error("unexpected end of (decode) payload.");
    let major = (payload[at] & 224) >> 5, minor = payload[at] & 31;
    switch (major) {
      case majorUint64:
      case majorNegativeInt64:
      case majorTag:
        let unsignedInt, offset;
        if (minor < 24)
          unsignedInt = minor, offset = 1;
        else
          switch (minor) {
            case extendedOneByte:
            case extendedFloat16:
            case extendedFloat32:
            case extendedFloat64:
              let countLength = minorValueToArgumentLength[minor], countOffset = countLength + 1;
              if (offset = countOffset, to - at < countOffset)
                throw Error(`countLength ${countLength} greater than remaining buf len.`);
              let countIndex = at + 1;
              if (countLength === 1)
                unsignedInt = payload[countIndex];
              else if (countLength === 2)
                unsignedInt = dataView$1.getUint16(countIndex);
              else if (countLength === 4)
                unsignedInt = dataView$1.getUint32(countIndex);
              else
                unsignedInt = dataView$1.getBigUint64(countIndex);
              break;
            default:
              throw Error(`unexpected minor value ${minor}.`);
          }
        if (major === majorUint64)
          return _offset = offset, castBigInt(unsignedInt);
        else if (major === majorNegativeInt64) {
          let negativeInt;
          if (typeof unsignedInt === "bigint")
            negativeInt = BigInt(-1) - unsignedInt;
          else
            negativeInt = -1 - unsignedInt;
          return _offset = offset, castBigInt(negativeInt);
        } else if (minor === 2 || minor === 3) {
          let length = decodeCount(at + offset, to), b = BigInt(0), start = at + offset + _offset;
          for (let i2 = start;i2 < start + length; ++i2)
            b = b << BigInt(8) | BigInt(payload[i2]);
          return _offset = offset + _offset + length, minor === 3 ? -b - BigInt(1) : b;
        } else if (minor === 4) {
          let decimalFraction = decode(at + offset, to), [exponent, mantissa] = decimalFraction, normalizer = mantissa < 0 ? -1 : 1, mantissaStr = "0".repeat(Math.abs(exponent) + 1) + String(BigInt(normalizer) * BigInt(mantissa)), numericString, sign = mantissa < 0 ? "-" : "";
          if (numericString = exponent === 0 ? mantissaStr : mantissaStr.slice(0, mantissaStr.length + exponent) + "." + mantissaStr.slice(exponent), numericString = numericString.replace(/^0+/g, ""), numericString === "")
            numericString = "0";
          if (numericString[0] === ".")
            numericString = "0" + numericString;
          return numericString = sign + numericString, _offset = offset + _offset, serde3.nv(numericString);
        } else {
          let value = decode(at + offset, to);
          return _offset = offset + _offset, tag({ tag: castBigInt(unsignedInt), value });
        }
      case majorUtf8String:
      case majorMap:
      case majorList:
      case majorUnstructuredByteString:
        if (minor === minorIndefinite)
          switch (major) {
            case majorUtf8String:
              return decodeUtf8StringIndefinite(at, to);
            case majorMap:
              return decodeMapIndefinite(at, to);
            case majorList:
              return decodeListIndefinite(at, to);
            case majorUnstructuredByteString:
              return decodeUnstructuredByteStringIndefinite(at, to);
          }
        else
          switch (major) {
            case majorUtf8String:
              return decodeUtf8String(at, to);
            case majorMap:
              return decodeMap(at, to);
            case majorList:
              return decodeList(at, to);
            case majorUnstructuredByteString:
              return decodeUnstructuredByteString(at, to);
          }
      default:
        return decodeSpecial(at, to);
    }
  }
  function bytesToUtf8(bytes, at, to) {
    if (USE_BUFFER$1 && bytes.constructor?.name === "Buffer")
      return bytes.toString("utf-8", at, to);
    if (textDecoder2)
      return textDecoder2.decode(bytes.subarray(at, to));
    return utilUtf8.toUtf8(bytes.subarray(at, to));
  }
  function demote(bigInteger) {
    let num = Number(bigInteger);
    if (num < Number.MIN_SAFE_INTEGER || Number.MAX_SAFE_INTEGER < num)
      console.warn(Error(`@smithy/core/cbor - truncating BigInt(${bigInteger}) to ${num} with loss of precision.`));
    return num;
  }
  var minorValueToArgumentLength = {
    [extendedOneByte]: 1,
    [extendedFloat16]: 2,
    [extendedFloat32]: 4,
    [extendedFloat64]: 8
  };
  function bytesToFloat16(a2, b) {
    let sign = a2 >> 7, exponent = (a2 & 124) >> 2, fraction = (a2 & 3) << 8 | b, scalar = sign === 0 ? 1 : -1, exponentComponent, summation;
    if (exponent === 0)
      if (fraction === 0)
        return 0;
      else
        exponentComponent = Math.pow(2, -14), summation = 0;
    else if (exponent === 31)
      if (fraction === 0)
        return scalar * (1 / 0);
      else
        return NaN;
    else
      exponentComponent = Math.pow(2, exponent - 15), summation = 1;
    return summation += fraction / 1024, scalar * (exponentComponent * summation);
  }
  function decodeCount(at, to) {
    let minor = payload[at] & 31;
    if (minor < 24)
      return _offset = 1, minor;
    if (minor === extendedOneByte || minor === extendedFloat16 || minor === extendedFloat32 || minor === extendedFloat64) {
      let countLength = minorValueToArgumentLength[minor];
      if (_offset = countLength + 1, to - at < _offset)
        throw Error(`countLength ${countLength} greater than remaining buf len.`);
      let countIndex = at + 1;
      if (countLength === 1)
        return payload[countIndex];
      else if (countLength === 2)
        return dataView$1.getUint16(countIndex);
      else if (countLength === 4)
        return dataView$1.getUint32(countIndex);
      return demote(dataView$1.getBigUint64(countIndex));
    }
    throw Error(`unexpected minor value ${minor}.`);
  }
  function decodeUtf8String(at, to) {
    let length = decodeCount(at, to), offset = _offset;
    if (at += offset, to - at < length)
      throw Error(`string len ${length} greater than remaining buf len.`);
    let value = bytesToUtf8(payload, at, at + length);
    return _offset = offset + length, value;
  }
  function decodeUtf8StringIndefinite(at, to) {
    at += 1;
    let vector = [];
    for (let base2 = at;at < to; ) {
      if (payload[at] === 255) {
        let data2 = alloc(vector.length);
        return data2.set(vector, 0), _offset = at - base2 + 2, bytesToUtf8(data2, 0, data2.length);
      }
      let major = (payload[at] & 224) >> 5, minor = payload[at] & 31;
      if (major !== majorUtf8String)
        throw Error(`unexpected major type ${major} in indefinite string.`);
      if (minor === minorIndefinite)
        throw Error("nested indefinite string.");
      let bytes = decodeUnstructuredByteString(at, to);
      at += _offset;
      for (let i2 = 0;i2 < bytes.length; ++i2)
        vector.push(bytes[i2]);
    }
    throw Error("expected break marker.");
  }
  function decodeUnstructuredByteString(at, to) {
    let length = decodeCount(at, to), offset = _offset;
    if (at += offset, to - at < length)
      throw Error(`unstructured byte string len ${length} greater than remaining buf len.`);
    let value = payload.subarray(at, at + length);
    return _offset = offset + length, value;
  }
  function decodeUnstructuredByteStringIndefinite(at, to) {
    at += 1;
    let vector = [];
    for (let base2 = at;at < to; ) {
      if (payload[at] === 255) {
        let data2 = alloc(vector.length);
        return data2.set(vector, 0), _offset = at - base2 + 2, data2;
      }
      let major = (payload[at] & 224) >> 5, minor = payload[at] & 31;
      if (major !== majorUnstructuredByteString)
        throw Error(`unexpected major type ${major} in indefinite string.`);
      if (minor === minorIndefinite)
        throw Error("nested indefinite string.");
      let bytes = decodeUnstructuredByteString(at, to);
      at += _offset;
      for (let i2 = 0;i2 < bytes.length; ++i2)
        vector.push(bytes[i2]);
    }
    throw Error("expected break marker.");
  }
  function decodeList(at, to) {
    let listDataLength = decodeCount(at, to), offset = _offset;
    at += offset;
    let base2 = at, list = Array(listDataLength);
    for (let i2 = 0;i2 < listDataLength; ++i2) {
      let item = decode(at, to), itemOffset = _offset;
      list[i2] = item, at += itemOffset;
    }
    return _offset = offset + (at - base2), list;
  }
  function decodeListIndefinite(at, to) {
    at += 1;
    let list = [];
    for (let base2 = at;at < to; ) {
      if (payload[at] === 255)
        return _offset = at - base2 + 2, list;
      let item = decode(at, to);
      at += _offset, list.push(item);
    }
    throw Error("expected break marker.");
  }
  function decodeMap(at, to) {
    let mapDataLength = decodeCount(at, to), offset = _offset;
    at += offset;
    let base2 = at, map3 = {};
    for (let i2 = 0;i2 < mapDataLength; ++i2) {
      if (at >= to)
        throw Error("unexpected end of map payload.");
      let major = (payload[at] & 224) >> 5;
      if (major !== majorUtf8String)
        throw Error(`unexpected major type ${major} for map key at index ${at}.`);
      let key = decode(at, to);
      at += _offset;
      let value = decode(at, to);
      at += _offset, map3[key] = value;
    }
    return _offset = offset + (at - base2), map3;
  }
  function decodeMapIndefinite(at, to) {
    at += 1;
    let base2 = at, map3 = {};
    for (;at < to; ) {
      if (at >= to)
        throw Error("unexpected end of map payload.");
      if (payload[at] === 255)
        return _offset = at - base2 + 2, map3;
      let major = (payload[at] & 224) >> 5;
      if (major !== majorUtf8String)
        throw Error(`unexpected major type ${major} for map key.`);
      let key = decode(at, to);
      at += _offset;
      let value = decode(at, to);
      at += _offset, map3[key] = value;
    }
    throw Error("expected break marker.");
  }
  function decodeSpecial(at, to) {
    let minor = payload[at] & 31;
    switch (minor) {
      case specialTrue:
      case specialFalse:
        return _offset = 1, minor === specialTrue;
      case specialNull:
        return _offset = 1, null;
      case specialUndefined:
        return _offset = 1, null;
      case extendedFloat16:
        if (to - at < 3)
          throw Error("incomplete float16 at end of buf.");
        return _offset = 3, bytesToFloat16(payload[at + 1], payload[at + 2]);
      case extendedFloat32:
        if (to - at < 5)
          throw Error("incomplete float32 at end of buf.");
        return _offset = 5, dataView$1.getFloat32(at + 1);
      case extendedFloat64:
        if (to - at < 9)
          throw Error("incomplete float64 at end of buf.");
        return _offset = 9, dataView$1.getFloat64(at + 1);
      default:
        throw Error(`unexpected minor value ${minor}.`);
    }
  }
  function castBigInt(bigInt) {
    if (typeof bigInt === "number")
      return bigInt;
    let num = Number(bigInt);
    if (Number.MIN_SAFE_INTEGER <= num && num <= Number.MAX_SAFE_INTEGER)
      return num;
    return bigInt;
  }
  var USE_BUFFER = typeof Buffer < "u", initialSize = 2048, data = alloc(initialSize), dataView = new DataView(data.buffer, data.byteOffset, data.byteLength), cursor = 0;
  function ensureSpace(bytes) {
    if (data.byteLength - cursor < bytes)
      if (cursor < 16000000)
        resize(Math.max(data.byteLength * 4, data.byteLength + bytes));
      else
        resize(data.byteLength + bytes + 16000000);
  }
  function toUint8Array() {
    let out = alloc(cursor);
    return out.set(data.subarray(0, cursor), 0), cursor = 0, out;
  }
  function resize(size) {
    let old = data;
    if (data = alloc(size), old)
      if (old.copy)
        old.copy(data, 0, 0, old.byteLength);
      else
        data.set(old, 0);
    dataView = new DataView(data.buffer, data.byteOffset, data.byteLength);
  }
  function encodeHeader(major, value) {
    if (value < 24)
      data[cursor++] = major << 5 | value;
    else if (value < 256)
      data[cursor++] = major << 5 | 24, data[cursor++] = value;
    else if (value < 65536)
      data[cursor++] = major << 5 | extendedFloat16, dataView.setUint16(cursor, value), cursor += 2;
    else if (value < 4294967296)
      data[cursor++] = major << 5 | extendedFloat32, dataView.setUint32(cursor, value), cursor += 4;
    else
      data[cursor++] = major << 5 | extendedFloat64, dataView.setBigUint64(cursor, typeof value === "bigint" ? value : BigInt(value)), cursor += 8;
  }
  function encode4(_input) {
    let encodeStack = [_input];
    while (encodeStack.length) {
      let input = encodeStack.pop();
      if (ensureSpace(typeof input === "string" ? input.length * 4 : 64), typeof input === "string") {
        if (USE_BUFFER)
          encodeHeader(majorUtf8String, Buffer.byteLength(input)), cursor += data.write(input, cursor);
        else {
          let bytes = utilUtf8.fromUtf8(input);
          encodeHeader(majorUtf8String, bytes.byteLength), data.set(bytes, cursor), cursor += bytes.byteLength;
        }
        continue;
      } else if (typeof input === "number") {
        if (Number.isInteger(input)) {
          let nonNegative = input >= 0, major = nonNegative ? majorUint64 : majorNegativeInt64, value = nonNegative ? input : -input - 1;
          if (value < 24)
            data[cursor++] = major << 5 | value;
          else if (value < 256)
            data[cursor++] = major << 5 | 24, data[cursor++] = value;
          else if (value < 65536)
            data[cursor++] = major << 5 | extendedFloat16, data[cursor++] = value >> 8, data[cursor++] = value;
          else if (value < 4294967296)
            data[cursor++] = major << 5 | extendedFloat32, dataView.setUint32(cursor, value), cursor += 4;
          else
            data[cursor++] = major << 5 | extendedFloat64, dataView.setBigUint64(cursor, BigInt(value)), cursor += 8;
          continue;
        }
        data[cursor++] = majorSpecial << 5 | extendedFloat64, dataView.setFloat64(cursor, input), cursor += 8;
        continue;
      } else if (typeof input === "bigint") {
        let nonNegative = input >= 0, major = nonNegative ? majorUint64 : majorNegativeInt64, value = nonNegative ? input : -input - BigInt(1), n2 = Number(value);
        if (n2 < 24)
          data[cursor++] = major << 5 | n2;
        else if (n2 < 256)
          data[cursor++] = major << 5 | 24, data[cursor++] = n2;
        else if (n2 < 65536)
          data[cursor++] = major << 5 | extendedFloat16, data[cursor++] = n2 >> 8, data[cursor++] = n2 & 255;
        else if (n2 < 4294967296)
          data[cursor++] = major << 5 | extendedFloat32, dataView.setUint32(cursor, n2), cursor += 4;
        else if (value < BigInt("18446744073709551616"))
          data[cursor++] = major << 5 | extendedFloat64, dataView.setBigUint64(cursor, value), cursor += 8;
        else {
          let binaryBigInt = value.toString(2), bigIntBytes = new Uint8Array(Math.ceil(binaryBigInt.length / 8)), b = value, i2 = 0;
          while (bigIntBytes.byteLength - ++i2 >= 0)
            bigIntBytes[bigIntBytes.byteLength - i2] = Number(b & BigInt(255)), b >>= BigInt(8);
          if (ensureSpace(bigIntBytes.byteLength * 2), data[cursor++] = nonNegative ? 194 : 195, USE_BUFFER)
            encodeHeader(majorUnstructuredByteString, Buffer.byteLength(bigIntBytes));
          else
            encodeHeader(majorUnstructuredByteString, bigIntBytes.byteLength);
          data.set(bigIntBytes, cursor), cursor += bigIntBytes.byteLength;
        }
        continue;
      } else if (input === null) {
        data[cursor++] = majorSpecial << 5 | specialNull;
        continue;
      } else if (typeof input === "boolean") {
        data[cursor++] = majorSpecial << 5 | (input ? specialTrue : specialFalse);
        continue;
      } else if (typeof input > "u")
        throw Error("@smithy/core/cbor: client may not serialize undefined value.");
      else if (Array.isArray(input)) {
        for (let i2 = input.length - 1;i2 >= 0; --i2)
          encodeStack.push(input[i2]);
        encodeHeader(majorList, input.length);
        continue;
      } else if (typeof input.byteLength === "number") {
        ensureSpace(input.length * 2), encodeHeader(majorUnstructuredByteString, input.length), data.set(input, cursor), cursor += input.byteLength;
        continue;
      } else if (typeof input === "object") {
        if (input instanceof serde3.NumericValue) {
          let decimalIndex = input.string.indexOf("."), exponent = decimalIndex === -1 ? 0 : decimalIndex - input.string.length + 1, mantissa = BigInt(input.string.replace(".", ""));
          data[cursor++] = 196, encodeStack.push(mantissa), encodeStack.push(exponent), encodeHeader(majorList, 2);
          continue;
        }
        if (input[tagSymbol])
          if ("tag" in input && "value" in input) {
            encodeStack.push(input.value), encodeHeader(majorTag, input.tag);
            continue;
          } else
            throw Error("tag encountered with missing fields, need 'tag' and 'value', found: " + JSON.stringify(input));
        let keys2 = Object.keys(input);
        for (let i2 = keys2.length - 1;i2 >= 0; --i2) {
          let key = keys2[i2];
          encodeStack.push(input[key]), encodeStack.push(key);
        }
        encodeHeader(majorMap, keys2.length);
        continue;
      }
      throw Error(`data type ${input?.constructor?.name ?? typeof input} not compatible for encoding.`);
    }
  }
  var cbor = {
    deserialize(payload2) {
      return setPayload(payload2), decode(0, payload2.length);
    },
    serialize(input) {
      try {
        return encode4(input), toUint8Array();
      } catch (e) {
        throw toUint8Array(), e;
      }
    },
    resizeEncodingBuffer(size) {
      resize(size);
    }
  }, parseCborBody = (streamBody, context) => {
    return protocols.collectBody(streamBody, context).then(async (bytes) => {
      if (bytes.length)
        try {
          return cbor.deserialize(bytes);
        } catch (e) {
          throw Object.defineProperty(e, "$responseBodyText", {
            value: context.utf8Encoder(bytes)
          }), e;
        }
      return {};
    });
  }, dateToTag = (date5) => {
    return tag({
      tag: 1,
      value: date5.getTime() / 1000
    });
  }, parseCborErrorBody = async (errorBody, context) => {
    let value = await parseCborBody(errorBody, context);
    return value.message = value.message ?? value.Message, value;
  }, loadSmithyRpcV2CborErrorCode = (output, data2) => {
    let sanitizeErrorCode = (rawValue) => {
      let cleanValue = rawValue;
      if (typeof cleanValue === "number")
        cleanValue = cleanValue.toString();
      if (cleanValue.indexOf(",") >= 0)
        cleanValue = cleanValue.split(",")[0];
      if (cleanValue.indexOf(":") >= 0)
        cleanValue = cleanValue.split(":")[0];
      if (cleanValue.indexOf("#") >= 0)
        cleanValue = cleanValue.split("#")[1];
      return cleanValue;
    };
    if (data2.__type !== void 0)
      return sanitizeErrorCode(data2.__type);
    let codeKey = Object.keys(data2).find((key) => key.toLowerCase() === "code");
    if (codeKey && data2[codeKey] !== void 0)
      return sanitizeErrorCode(data2[codeKey]);
  }, checkCborResponse = (response2) => {
    if (String(response2.headers["smithy-protocol"]).toLowerCase() !== "rpc-v2-cbor")
      throw Error("Malformed RPCv2 CBOR response, status: " + response2.statusCode);
  }, buildHttpRpcRequest = async (context, headers, path9, resolvedHostname, body) => {
    let endpoint2 = await context.endpoint(), { hostname: hostname2, protocol = "https", port, path: basePath } = endpoint2, contents = {
      protocol,
      hostname: hostname2,
      port,
      method: "POST",
      path: basePath.endsWith("/") ? basePath.slice(0, -1) + path9 : basePath + path9,
      headers: {
        ...headers
      }
    };
    if (resolvedHostname !== void 0)
      contents.hostname = resolvedHostname;
    if (endpoint2.headers)
      for (let [name, value] of Object.entries(endpoint2.headers))
        contents.headers[name] = value;
    if (body !== void 0) {
      contents.body = body;
      try {
        contents.headers["content-length"] = String(utilBodyLengthBrowser.calculateBodyLength(body));
      } catch (e) {}
    }
    return new protocolHttp.HttpRequest(contents);
  };

  class CborCodec extends protocols.SerdeContext {
    createSerializer() {
      let serializer = new CborShapeSerializer;
      return serializer.setSerdeContext(this.serdeContext), serializer;
    }
    createDeserializer() {
      let deserializer = new CborShapeDeserializer;
      return deserializer.setSerdeContext(this.serdeContext), deserializer;
    }
  }

  class CborShapeSerializer extends protocols.SerdeContext {
    value;
    write(schema3, value) {
      this.value = this.serialize(schema3, value);
    }
    serialize(schema$1, source) {
      let ns = schema2.NormalizedSchema.of(schema$1);
      if (source == null) {
        if (ns.isIdempotencyToken())
          return serde3.generateIdempotencyToken();
        return source;
      }
      if (ns.isBlobSchema()) {
        if (typeof source === "string")
          return (this.serdeContext?.base64Decoder ?? utilBase64.fromBase64)(source);
        return source;
      }
      if (ns.isTimestampSchema()) {
        if (typeof source === "number" || typeof source === "bigint")
          return dateToTag(new Date(Number(source) / 1000 | 0));
        return dateToTag(source);
      }
      if (typeof source === "function" || typeof source === "object") {
        let sourceObject = source;
        if (ns.isListSchema() && Array.isArray(sourceObject)) {
          let sparse = !!ns.getMergedTraits().sparse, newArray = [], i2 = 0;
          for (let item of sourceObject) {
            let value = this.serialize(ns.getValueSchema(), item);
            if (value != null || sparse)
              newArray[i2++] = value;
          }
          return newArray;
        }
        if (sourceObject instanceof Date)
          return dateToTag(sourceObject);
        let newObject = {};
        if (ns.isMapSchema()) {
          let sparse = !!ns.getMergedTraits().sparse;
          for (let key of Object.keys(sourceObject)) {
            let value = this.serialize(ns.getValueSchema(), sourceObject[key]);
            if (value != null || sparse)
              newObject[key] = value;
          }
        } else if (ns.isStructSchema()) {
          for (let [key, memberSchema] of ns.structIterator()) {
            let value = this.serialize(memberSchema, sourceObject[key]);
            if (value != null)
              newObject[key] = value;
          }
          if (ns.isUnionSchema() && Array.isArray(sourceObject.$unknown)) {
            let [k, v] = sourceObject.$unknown;
            newObject[k] = v;
          } else if (typeof sourceObject.__type === "string") {
            for (let [k, v] of Object.entries(sourceObject))
              if (!(k in newObject))
                newObject[k] = this.serialize(15, v);
          }
        } else if (ns.isDocumentSchema())
          for (let key of Object.keys(sourceObject))
            newObject[key] = this.serialize(ns.getValueSchema(), sourceObject[key]);
        else if (ns.isBigDecimalSchema())
          return sourceObject;
        return newObject;
      }
      return source;
    }
    flush() {
      let buffer = cbor.serialize(this.value);
      return this.value = void 0, buffer;
    }
  }

  class CborShapeDeserializer extends protocols.SerdeContext {
    read(schema3, bytes) {
      let data2 = cbor.deserialize(bytes);
      return this.readValue(schema3, data2);
    }
    readValue(_schema, value) {
      let ns = schema2.NormalizedSchema.of(_schema);
      if (ns.isTimestampSchema()) {
        if (typeof value === "number")
          return serde3._parseEpochTimestamp(value);
        if (typeof value === "object") {
          if (value.tag === 1 && "value" in value)
            return serde3._parseEpochTimestamp(value.value);
        }
      }
      if (ns.isBlobSchema()) {
        if (typeof value === "string")
          return (this.serdeContext?.base64Decoder ?? utilBase64.fromBase64)(value);
        return value;
      }
      if (typeof value > "u" || typeof value === "boolean" || typeof value === "number" || typeof value === "string" || typeof value === "bigint" || typeof value === "symbol")
        return value;
      else if (typeof value === "object") {
        if (value === null)
          return null;
        if ("byteLength" in value)
          return value;
        if (value instanceof Date)
          return value;
        if (ns.isDocumentSchema())
          return value;
        if (ns.isListSchema()) {
          let newArray = [], memberSchema = ns.getValueSchema();
          for (let item of value) {
            let itemValue = this.readValue(memberSchema, item);
            newArray.push(itemValue);
          }
          return newArray;
        }
        let newObject = {};
        if (ns.isMapSchema()) {
          let targetSchema = ns.getValueSchema();
          for (let key of Object.keys(value)) {
            let itemValue = this.readValue(targetSchema, value[key]);
            newObject[key] = itemValue;
          }
        } else if (ns.isStructSchema()) {
          let isUnion = ns.isUnionSchema(), keys2;
          if (isUnion)
            keys2 = new Set(Object.keys(value).filter((k) => k !== "__type"));
          for (let [key, memberSchema] of ns.structIterator()) {
            if (isUnion)
              keys2.delete(key);
            if (value[key] != null)
              newObject[key] = this.readValue(memberSchema, value[key]);
          }
          if (isUnion && keys2?.size === 1 && Object.keys(newObject).length === 0) {
            let k = keys2.values().next().value;
            newObject.$unknown = [k, value[k]];
          } else if (typeof value.__type === "string") {
            for (let [k, v] of Object.entries(value))
              if (!(k in newObject))
                newObject[k] = v;
          }
        } else if (value instanceof serde3.NumericValue)
          return value;
        return newObject;
      } else
        return value;
    }
  }

  class SmithyRpcV2CborProtocol extends protocols.RpcProtocol {
    codec = new CborCodec;
    serializer = this.codec.createSerializer();
    deserializer = this.codec.createDeserializer();
    constructor({ defaultNamespace, errorTypeRegistries }) {
      super({ defaultNamespace, errorTypeRegistries });
    }
    getShapeId() {
      return "smithy.protocols#rpcv2Cbor";
    }
    getPayloadCodec() {
      return this.codec;
    }
    async serializeRequest(operationSchema, input, context) {
      let request2 = await super.serializeRequest(operationSchema, input, context);
      if (Object.assign(request2.headers, {
        "content-type": this.getDefaultContentType(),
        "smithy-protocol": "rpc-v2-cbor",
        accept: this.getDefaultContentType()
      }), schema2.deref(operationSchema.input) === "unit")
        delete request2.body, delete request2.headers["content-type"];
      else {
        if (!request2.body)
          this.serializer.write(15, {}), request2.body = this.serializer.flush();
        try {
          request2.headers["content-length"] = String(request2.body.byteLength);
        } catch (e) {}
      }
      let { service, operation } = utilMiddleware.getSmithyContext(context), path9 = `/service/${service}/operation/${operation}`;
      if (request2.path.endsWith("/"))
        request2.path += path9.slice(1);
      else
        request2.path += path9;
      return request2;
    }
    async deserializeResponse(operationSchema, context, response2) {
      return super.deserializeResponse(operationSchema, context, response2);
    }
    async handleError(operationSchema, context, response2, dataObject, metadata) {
      let errorName = loadSmithyRpcV2CborErrorCode(response2, dataObject) ?? "Unknown", errorMetadata = {
        $metadata: metadata,
        $fault: response2.statusCode <= 500 ? "client" : "server"
      }, namespace = this.options.defaultNamespace;
      if (errorName.includes("#"))
        [namespace] = errorName.split("#");
      let registry2 = this.compositeErrorRegistry, nsRegistry = schema2.TypeRegistry.for(namespace);
      registry2.copyFrom(nsRegistry);
      let errorSchema;
      try {
        errorSchema = registry2.getSchema(errorName);
      } catch (e) {
        if (dataObject.Message)
          dataObject.message = dataObject.Message;
        let syntheticRegistry = schema2.TypeRegistry.for("smithy.ts.sdk.synthetic." + namespace);
        registry2.copyFrom(syntheticRegistry);
        let baseExceptionSchema = registry2.getBaseException();
        if (baseExceptionSchema) {
          let ErrorCtor2 = registry2.getErrorCtor(baseExceptionSchema);
          throw Object.assign(new ErrorCtor2({ name: errorName }), errorMetadata, dataObject);
        }
        throw Object.assign(Error(errorName), errorMetadata, dataObject);
      }
      let ns = schema2.NormalizedSchema.of(errorSchema), ErrorCtor = registry2.getErrorCtor(errorSchema), message = dataObject.message ?? dataObject.Message ?? "Unknown", exception = new ErrorCtor(message), output = {};
      for (let [name, member] of ns.structIterator())
        output[name] = this.deserializer.readValue(member, dataObject[name]);
      throw Object.assign(exception, errorMetadata, {
        $fault: ns.getMergedTraits().error,
        message
      }, output);
    }
    getDefaultContentType() {
      return "application/cbor";
    }
  }
  exports.CborCodec = CborCodec;
  exports.CborShapeDeserializer = CborShapeDeserializer;
  exports.CborShapeSerializer = CborShapeSerializer;
  exports.SmithyRpcV2CborProtocol = SmithyRpcV2CborProtocol;
  exports.buildHttpRpcRequest = buildHttpRpcRequest;
  exports.cbor = cbor;
  exports.checkCborResponse = checkCborResponse;
  exports.dateToTag = dateToTag;
  exports.loadSmithyRpcV2CborErrorCode = loadSmithyRpcV2CborErrorCode;
  exports.parseCborBody = parseCborBody;
  exports.parseCborErrorBody = parseCborErrorBody;
  exports.tag = tag;
  exports.tagSymbol = tagSymbol;
});
