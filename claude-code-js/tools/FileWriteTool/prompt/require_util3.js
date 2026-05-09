// var: require_util3
var require_util3 = __commonJS((exports, module) => {
  var forge = require_forge(), baseN = require_baseN(), util12 = module.exports = forge.util = forge.util || {};
  (function() {
    if (typeof process < "u" && process.nextTick) {
      if (util12.nextTick = process.nextTick, typeof setImmediate === "function")
        util12.setImmediate = setImmediate;
      else
        util12.setImmediate = util12.nextTick;
      return;
    }
    if (typeof setImmediate === "function") {
      util12.setImmediate = function() {
        return setImmediate.apply(void 0, arguments);
      }, util12.nextTick = function(callback) {
        return setImmediate(callback);
      };
      return;
    }
    if (util12.setImmediate = function(callback) {
      setTimeout(callback, 0);
    }, typeof window < "u" && typeof window.postMessage === "function") {
      let handler2 = function(event) {
        if (event.source === window && event.data === msg) {
          event.stopPropagation();
          var copy = callbacks.slice();
          callbacks.length = 0, copy.forEach(function(callback) {
            callback();
          });
        }
      };
      var handler = handler2, msg = "forge.setImmediate", callbacks = [];
      util12.setImmediate = function(callback) {
        if (callbacks.push(callback), callbacks.length === 1)
          window.postMessage(msg, "*");
      }, window.addEventListener("message", handler2, !0);
    }
    if (typeof MutationObserver < "u") {
      var now2 = Date.now(), attr = !0, div = document.createElement("div"), callbacks = [];
      new MutationObserver(function() {
        var copy = callbacks.slice();
        callbacks.length = 0, copy.forEach(function(callback) {
          callback();
        });
      }).observe(div, { attributes: !0 });
      var oldSetImmediate = util12.setImmediate;
      util12.setImmediate = function(callback) {
        if (Date.now() - now2 > 15)
          now2 = Date.now(), oldSetImmediate(callback);
        else if (callbacks.push(callback), callbacks.length === 1)
          div.setAttribute("a", attr = !attr);
      };
    }
    util12.nextTick = util12.setImmediate;
  })();
  util12.isNodejs = typeof process < "u" && process.versions && process.versions.node;
  util12.globalScope = function() {
    if (util12.isNodejs)
      return global;
    return typeof self > "u" ? window : self;
  }();
  util12.isArray = Array.isArray || function(x4) {
    return Object.prototype.toString.call(x4) === "[object Array]";
  };
  util12.isArrayBuffer = function(x4) {
    return typeof ArrayBuffer < "u" && x4 instanceof ArrayBuffer;
  };
  util12.isArrayBufferView = function(x4) {
    return x4 && util12.isArrayBuffer(x4.buffer) && x4.byteLength !== void 0;
  };
  function _checkBitsParam(n5) {
    if (!(n5 === 8 || n5 === 16 || n5 === 24 || n5 === 32))
      throw Error("Only 8, 16, 24, or 32 bits supported: " + n5);
  }
  util12.ByteBuffer = ByteStringBuffer;
  function ByteStringBuffer(b) {
    if (this.data = "", this.read = 0, typeof b === "string")
      this.data = b;
    else if (util12.isArrayBuffer(b) || util12.isArrayBufferView(b))
      if (typeof Buffer < "u" && b instanceof Buffer)
        this.data = b.toString("binary");
      else {
        var arr = new Uint8Array(b);
        try {
          this.data = String.fromCharCode.apply(null, arr);
        } catch (e) {
          for (var i5 = 0;i5 < arr.length; ++i5)
            this.putByte(arr[i5]);
        }
      }
    else if (b instanceof ByteStringBuffer || typeof b === "object" && typeof b.data === "string" && typeof b.read === "number")
      this.data = b.data, this.read = b.read;
    this._constructedStringLength = 0;
  }
  util12.ByteStringBuffer = ByteStringBuffer;
  var _MAX_CONSTRUCTED_STRING_LENGTH = 4096;
  util12.ByteStringBuffer.prototype._optimizeConstructedString = function(x4) {
    if (this._constructedStringLength += x4, this._constructedStringLength > _MAX_CONSTRUCTED_STRING_LENGTH)
      this.data.substr(0, 1), this._constructedStringLength = 0;
  };
  util12.ByteStringBuffer.prototype.length = function() {
    return this.data.length - this.read;
  };
  util12.ByteStringBuffer.prototype.isEmpty = function() {
    return this.length() <= 0;
  };
  util12.ByteStringBuffer.prototype.putByte = function(b) {
    return this.putBytes(String.fromCharCode(b));
  };
  util12.ByteStringBuffer.prototype.fillWithByte = function(b, n5) {
    b = String.fromCharCode(b);
    var d = this.data;
    while (n5 > 0) {
      if (n5 & 1)
        d += b;
      if (n5 >>>= 1, n5 > 0)
        b += b;
    }
    return this.data = d, this._optimizeConstructedString(n5), this;
  };
  util12.ByteStringBuffer.prototype.putBytes = function(bytes) {
    return this.data += bytes, this._optimizeConstructedString(bytes.length), this;
  };
  util12.ByteStringBuffer.prototype.putString = function(str) {
    return this.putBytes(util12.encodeUtf8(str));
  };
  util12.ByteStringBuffer.prototype.putInt16 = function(i5) {
    return this.putBytes(String.fromCharCode(i5 >> 8 & 255) + String.fromCharCode(i5 & 255));
  };
  util12.ByteStringBuffer.prototype.putInt24 = function(i5) {
    return this.putBytes(String.fromCharCode(i5 >> 16 & 255) + String.fromCharCode(i5 >> 8 & 255) + String.fromCharCode(i5 & 255));
  };
  util12.ByteStringBuffer.prototype.putInt32 = function(i5) {
    return this.putBytes(String.fromCharCode(i5 >> 24 & 255) + String.fromCharCode(i5 >> 16 & 255) + String.fromCharCode(i5 >> 8 & 255) + String.fromCharCode(i5 & 255));
  };
  util12.ByteStringBuffer.prototype.putInt16Le = function(i5) {
    return this.putBytes(String.fromCharCode(i5 & 255) + String.fromCharCode(i5 >> 8 & 255));
  };
  util12.ByteStringBuffer.prototype.putInt24Le = function(i5) {
    return this.putBytes(String.fromCharCode(i5 & 255) + String.fromCharCode(i5 >> 8 & 255) + String.fromCharCode(i5 >> 16 & 255));
  };
  util12.ByteStringBuffer.prototype.putInt32Le = function(i5) {
    return this.putBytes(String.fromCharCode(i5 & 255) + String.fromCharCode(i5 >> 8 & 255) + String.fromCharCode(i5 >> 16 & 255) + String.fromCharCode(i5 >> 24 & 255));
  };
  util12.ByteStringBuffer.prototype.putInt = function(i5, n5) {
    _checkBitsParam(n5);
    var bytes = "";
    do
      n5 -= 8, bytes += String.fromCharCode(i5 >> n5 & 255);
    while (n5 > 0);
    return this.putBytes(bytes);
  };
  util12.ByteStringBuffer.prototype.putSignedInt = function(i5, n5) {
    if (i5 < 0)
      i5 += 2 << n5 - 1;
    return this.putInt(i5, n5);
  };
  util12.ByteStringBuffer.prototype.putBuffer = function(buffer) {
    return this.putBytes(buffer.getBytes());
  };
  util12.ByteStringBuffer.prototype.getByte = function() {
    return this.data.charCodeAt(this.read++);
  };
  util12.ByteStringBuffer.prototype.getInt16 = function() {
    var rval = this.data.charCodeAt(this.read) << 8 ^ this.data.charCodeAt(this.read + 1);
    return this.read += 2, rval;
  };
  util12.ByteStringBuffer.prototype.getInt24 = function() {
    var rval = this.data.charCodeAt(this.read) << 16 ^ this.data.charCodeAt(this.read + 1) << 8 ^ this.data.charCodeAt(this.read + 2);
    return this.read += 3, rval;
  };
  util12.ByteStringBuffer.prototype.getInt32 = function() {
    var rval = this.data.charCodeAt(this.read) << 24 ^ this.data.charCodeAt(this.read + 1) << 16 ^ this.data.charCodeAt(this.read + 2) << 8 ^ this.data.charCodeAt(this.read + 3);
    return this.read += 4, rval;
  };
  util12.ByteStringBuffer.prototype.getInt16Le = function() {
    var rval = this.data.charCodeAt(this.read) ^ this.data.charCodeAt(this.read + 1) << 8;
    return this.read += 2, rval;
  };
  util12.ByteStringBuffer.prototype.getInt24Le = function() {
    var rval = this.data.charCodeAt(this.read) ^ this.data.charCodeAt(this.read + 1) << 8 ^ this.data.charCodeAt(this.read + 2) << 16;
    return this.read += 3, rval;
  };
  util12.ByteStringBuffer.prototype.getInt32Le = function() {
    var rval = this.data.charCodeAt(this.read) ^ this.data.charCodeAt(this.read + 1) << 8 ^ this.data.charCodeAt(this.read + 2) << 16 ^ this.data.charCodeAt(this.read + 3) << 24;
    return this.read += 4, rval;
  };
  util12.ByteStringBuffer.prototype.getInt = function(n5) {
    _checkBitsParam(n5);
    var rval = 0;
    do
      rval = (rval << 8) + this.data.charCodeAt(this.read++), n5 -= 8;
    while (n5 > 0);
    return rval;
  };
  util12.ByteStringBuffer.prototype.getSignedInt = function(n5) {
    var x4 = this.getInt(n5), max2 = 2 << n5 - 2;
    if (x4 >= max2)
      x4 -= max2 << 1;
    return x4;
  };
  util12.ByteStringBuffer.prototype.getBytes = function(count3) {
    var rval;
    if (count3)
      count3 = Math.min(this.length(), count3), rval = this.data.slice(this.read, this.read + count3), this.read += count3;
    else if (count3 === 0)
      rval = "";
    else
      rval = this.read === 0 ? this.data : this.data.slice(this.read), this.clear();
    return rval;
  };
  util12.ByteStringBuffer.prototype.bytes = function(count3) {
    return typeof count3 > "u" ? this.data.slice(this.read) : this.data.slice(this.read, this.read + count3);
  };
  util12.ByteStringBuffer.prototype.at = function(i5) {
    return this.data.charCodeAt(this.read + i5);
  };
  util12.ByteStringBuffer.prototype.setAt = function(i5, b) {
    return this.data = this.data.substr(0, this.read + i5) + String.fromCharCode(b) + this.data.substr(this.read + i5 + 1), this;
  };
  util12.ByteStringBuffer.prototype.last = function() {
    return this.data.charCodeAt(this.data.length - 1);
  };
  util12.ByteStringBuffer.prototype.copy = function() {
    var c3 = util12.createBuffer(this.data);
    return c3.read = this.read, c3;
  };
  util12.ByteStringBuffer.prototype.compact = function() {
    if (this.read > 0)
      this.data = this.data.slice(this.read), this.read = 0;
    return this;
  };
  util12.ByteStringBuffer.prototype.clear = function() {
    return this.data = "", this.read = 0, this;
  };
  util12.ByteStringBuffer.prototype.truncate = function(count3) {
    var len = Math.max(0, this.length() - count3);
    return this.data = this.data.substr(this.read, len), this.read = 0, this;
  };
  util12.ByteStringBuffer.prototype.toHex = function() {
    var rval = "";
    for (var i5 = this.read;i5 < this.data.length; ++i5) {
      var b = this.data.charCodeAt(i5);
      if (b < 16)
        rval += "0";
      rval += b.toString(16);
    }
    return rval;
  };
  util12.ByteStringBuffer.prototype.toString = function() {
    return util12.decodeUtf8(this.bytes());
  };
  function DataBuffer(b, options) {
    options = options || {}, this.read = options.readOffset || 0, this.growSize = options.growSize || 1024;
    var isArrayBuffer9 = util12.isArrayBuffer(b), isArrayBufferView2 = util12.isArrayBufferView(b);
    if (isArrayBuffer9 || isArrayBufferView2) {
      if (isArrayBuffer9)
        this.data = new DataView(b);
      else
        this.data = new DataView(b.buffer, b.byteOffset, b.byteLength);
      this.write = "writeOffset" in options ? options.writeOffset : this.data.byteLength;
      return;
    }
    if (this.data = new DataView(new ArrayBuffer(0)), this.write = 0, b !== null && b !== void 0)
      this.putBytes(b);
    if ("writeOffset" in options)
      this.write = options.writeOffset;
  }
  util12.DataBuffer = DataBuffer;
  util12.DataBuffer.prototype.length = function() {
    return this.write - this.read;
  };
  util12.DataBuffer.prototype.isEmpty = function() {
    return this.length() <= 0;
  };
  util12.DataBuffer.prototype.accommodate = function(amount, growSize) {
    if (this.length() >= amount)
      return this;
    growSize = Math.max(growSize || this.growSize, amount);
    var src = new Uint8Array(this.data.buffer, this.data.byteOffset, this.data.byteLength), dst = new Uint8Array(this.length() + growSize);
    return dst.set(src), this.data = new DataView(dst.buffer), this;
  };
  util12.DataBuffer.prototype.putByte = function(b) {
    return this.accommodate(1), this.data.setUint8(this.write++, b), this;
  };
  util12.DataBuffer.prototype.fillWithByte = function(b, n5) {
    this.accommodate(n5);
    for (var i5 = 0;i5 < n5; ++i5)
      this.data.setUint8(b);
    return this;
  };
  util12.DataBuffer.prototype.putBytes = function(bytes, encoding) {
    if (util12.isArrayBufferView(bytes)) {
      var src = new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength), len = src.byteLength - src.byteOffset;
      this.accommodate(len);
      var dst = new Uint8Array(this.data.buffer, this.write);
      return dst.set(src), this.write += len, this;
    }
    if (util12.isArrayBuffer(bytes)) {
      var src = new Uint8Array(bytes);
      this.accommodate(src.byteLength);
      var dst = new Uint8Array(this.data.buffer);
      return dst.set(src, this.write), this.write += src.byteLength, this;
    }
    if (bytes instanceof util12.DataBuffer || typeof bytes === "object" && typeof bytes.read === "number" && typeof bytes.write === "number" && util12.isArrayBufferView(bytes.data)) {
      var src = new Uint8Array(bytes.data.byteLength, bytes.read, bytes.length());
      this.accommodate(src.byteLength);
      var dst = new Uint8Array(bytes.data.byteLength, this.write);
      return dst.set(src), this.write += src.byteLength, this;
    }
    if (bytes instanceof util12.ByteStringBuffer)
      bytes = bytes.data, encoding = "binary";
    if (encoding = encoding || "binary", typeof bytes === "string") {
      var view;
      if (encoding === "hex")
        return this.accommodate(Math.ceil(bytes.length / 2)), view = new Uint8Array(this.data.buffer, this.write), this.write += util12.binary.hex.decode(bytes, view, this.write), this;
      if (encoding === "base64")
        return this.accommodate(Math.ceil(bytes.length / 4) * 3), view = new Uint8Array(this.data.buffer, this.write), this.write += util12.binary.base64.decode(bytes, view, this.write), this;
      if (encoding === "utf8")
        bytes = util12.encodeUtf8(bytes), encoding = "binary";
      if (encoding === "binary" || encoding === "raw")
        return this.accommodate(bytes.length), view = new Uint8Array(this.data.buffer, this.write), this.write += util12.binary.raw.decode(view), this;
      if (encoding === "utf16")
        return this.accommodate(bytes.length * 2), view = new Uint16Array(this.data.buffer, this.write), this.write += util12.text.utf16.encode(view), this;
      throw Error("Invalid encoding: " + encoding);
    }
    throw Error("Invalid parameter: " + bytes);
  };
  util12.DataBuffer.prototype.putBuffer = function(buffer) {
    return this.putBytes(buffer), buffer.clear(), this;
  };
  util12.DataBuffer.prototype.putString = function(str) {
    return this.putBytes(str, "utf16");
  };
  util12.DataBuffer.prototype.putInt16 = function(i5) {
    return this.accommodate(2), this.data.setInt16(this.write, i5), this.write += 2, this;
  };
  util12.DataBuffer.prototype.putInt24 = function(i5) {
    return this.accommodate(3), this.data.setInt16(this.write, i5 >> 8 & 65535), this.data.setInt8(this.write, i5 >> 16 & 255), this.write += 3, this;
  };
  util12.DataBuffer.prototype.putInt32 = function(i5) {
    return this.accommodate(4), this.data.setInt32(this.write, i5), this.write += 4, this;
  };
  util12.DataBuffer.prototype.putInt16Le = function(i5) {
    return this.accommodate(2), this.data.setInt16(this.write, i5, !0), this.write += 2, this;
  };
  util12.DataBuffer.prototype.putInt24Le = function(i5) {
    return this.accommodate(3), this.data.setInt8(this.write, i5 >> 16 & 255), this.data.setInt16(this.write, i5 >> 8 & 65535, !0), this.write += 3, this;
  };
  util12.DataBuffer.prototype.putInt32Le = function(i5) {
    return this.accommodate(4), this.data.setInt32(this.write, i5, !0), this.write += 4, this;
  };
  util12.DataBuffer.prototype.putInt = function(i5, n5) {
    _checkBitsParam(n5), this.accommodate(n5 / 8);
    do
      n5 -= 8, this.data.setInt8(this.write++, i5 >> n5 & 255);
    while (n5 > 0);
    return this;
  };
  util12.DataBuffer.prototype.putSignedInt = function(i5, n5) {
    if (_checkBitsParam(n5), this.accommodate(n5 / 8), i5 < 0)
      i5 += 2 << n5 - 1;
    return this.putInt(i5, n5);
  };
  util12.DataBuffer.prototype.getByte = function() {
    return this.data.getInt8(this.read++);
  };
  util12.DataBuffer.prototype.getInt16 = function() {
    var rval = this.data.getInt16(this.read);
    return this.read += 2, rval;
  };
  util12.DataBuffer.prototype.getInt24 = function() {
    var rval = this.data.getInt16(this.read) << 8 ^ this.data.getInt8(this.read + 2);
    return this.read += 3, rval;
  };
  util12.DataBuffer.prototype.getInt32 = function() {
    var rval = this.data.getInt32(this.read);
    return this.read += 4, rval;
  };
  util12.DataBuffer.prototype.getInt16Le = function() {
    var rval = this.data.getInt16(this.read, !0);
    return this.read += 2, rval;
  };
  util12.DataBuffer.prototype.getInt24Le = function() {
    var rval = this.data.getInt8(this.read) ^ this.data.getInt16(this.read + 1, !0) << 8;
    return this.read += 3, rval;
  };
  util12.DataBuffer.prototype.getInt32Le = function() {
    var rval = this.data.getInt32(this.read, !0);
    return this.read += 4, rval;
  };
  util12.DataBuffer.prototype.getInt = function(n5) {
    _checkBitsParam(n5);
    var rval = 0;
    do
      rval = (rval << 8) + this.data.getInt8(this.read++), n5 -= 8;
    while (n5 > 0);
    return rval;
  };
  util12.DataBuffer.prototype.getSignedInt = function(n5) {
    var x4 = this.getInt(n5), max2 = 2 << n5 - 2;
    if (x4 >= max2)
      x4 -= max2 << 1;
    return x4;
  };
  util12.DataBuffer.prototype.getBytes = function(count3) {
    var rval;
    if (count3)
      count3 = Math.min(this.length(), count3), rval = this.data.slice(this.read, this.read + count3), this.read += count3;
    else if (count3 === 0)
      rval = "";
    else
      rval = this.read === 0 ? this.data : this.data.slice(this.read), this.clear();
    return rval;
  };
  util12.DataBuffer.prototype.bytes = function(count3) {
    return typeof count3 > "u" ? this.data.slice(this.read) : this.data.slice(this.read, this.read + count3);
  };
  util12.DataBuffer.prototype.at = function(i5) {
    return this.data.getUint8(this.read + i5);
  };
  util12.DataBuffer.prototype.setAt = function(i5, b) {
    return this.data.setUint8(i5, b), this;
  };
  util12.DataBuffer.prototype.last = function() {
    return this.data.getUint8(this.write - 1);
  };
  util12.DataBuffer.prototype.copy = function() {
    return new util12.DataBuffer(this);
  };
  util12.DataBuffer.prototype.compact = function() {
    if (this.read > 0) {
      var src = new Uint8Array(this.data.buffer, this.read), dst = new Uint8Array(src.byteLength);
      dst.set(src), this.data = new DataView(dst), this.write -= this.read, this.read = 0;
    }
    return this;
  };
  util12.DataBuffer.prototype.clear = function() {
    return this.data = new DataView(new ArrayBuffer(0)), this.read = this.write = 0, this;
  };
  util12.DataBuffer.prototype.truncate = function(count3) {
    return this.write = Math.max(0, this.length() - count3), this.read = Math.min(this.read, this.write), this;
  };
  util12.DataBuffer.prototype.toHex = function() {
    var rval = "";
    for (var i5 = this.read;i5 < this.data.byteLength; ++i5) {
      var b = this.data.getUint8(i5);
      if (b < 16)
        rval += "0";
      rval += b.toString(16);
    }
    return rval;
  };
  util12.DataBuffer.prototype.toString = function(encoding) {
    var view = new Uint8Array(this.data, this.read, this.length());
    if (encoding = encoding || "utf8", encoding === "binary" || encoding === "raw")
      return util12.binary.raw.encode(view);
    if (encoding === "hex")
      return util12.binary.hex.encode(view);
    if (encoding === "base64")
      return util12.binary.base64.encode(view);
    if (encoding === "utf8")
      return util12.text.utf8.decode(view);
    if (encoding === "utf16")
      return util12.text.utf16.decode(view);
    throw Error("Invalid encoding: " + encoding);
  };
  util12.createBuffer = function(input, encoding) {
    if (encoding = encoding || "raw", input !== void 0 && encoding === "utf8")
      input = util12.encodeUtf8(input);
    return new util12.ByteBuffer(input);
  };
  util12.fillString = function(c3, n5) {
    var s2 = "";
    while (n5 > 0) {
      if (n5 & 1)
        s2 += c3;
      if (n5 >>>= 1, n5 > 0)
        c3 += c3;
    }
    return s2;
  };
  util12.xorBytes = function(s1, s2, n5) {
    var s3 = "", b = "", t2 = "", i5 = 0, c3 = 0;
    for (;n5 > 0; --n5, ++i5) {
      if (b = s1.charCodeAt(i5) ^ s2.charCodeAt(i5), c3 >= 10)
        s3 += t2, t2 = "", c3 = 0;
      t2 += String.fromCharCode(b), ++c3;
    }
    return s3 += t2, s3;
  };
  util12.hexToBytes = function(hex) {
    var rval = "", i5 = 0;
    if (hex.length & !0)
      i5 = 1, rval += String.fromCharCode(parseInt(hex[0], 16));
    for (;i5 < hex.length; i5 += 2)
      rval += String.fromCharCode(parseInt(hex.substr(i5, 2), 16));
    return rval;
  };
  util12.bytesToHex = function(bytes) {
    return util12.createBuffer(bytes).toHex();
  };
  util12.int32ToBytes = function(i5) {
    return String.fromCharCode(i5 >> 24 & 255) + String.fromCharCode(i5 >> 16 & 255) + String.fromCharCode(i5 >> 8 & 255) + String.fromCharCode(i5 & 255);
  };
  var _base642 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", _base64Idx = [
    62,
    -1,
    -1,
    -1,
    63,
    52,
    53,
    54,
    55,
    56,
    57,
    58,
    59,
    60,
    61,
    -1,
    -1,
    -1,
    64,
    -1,
    -1,
    -1,
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51
  ], _base58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  util12.encode64 = function(input, maxline) {
    var line = "", output = "", chr1, chr2, chr3, i5 = 0;
    while (i5 < input.length) {
      if (chr1 = input.charCodeAt(i5++), chr2 = input.charCodeAt(i5++), chr3 = input.charCodeAt(i5++), line += _base642.charAt(chr1 >> 2), line += _base642.charAt((chr1 & 3) << 4 | chr2 >> 4), isNaN(chr2))
        line += "==";
      else
        line += _base642.charAt((chr2 & 15) << 2 | chr3 >> 6), line += isNaN(chr3) ? "=" : _base642.charAt(chr3 & 63);
      if (maxline && line.length > maxline)
        output += line.substr(0, maxline) + `\r
`, line = line.substr(maxline);
    }
    return output += line, output;
  };
  util12.decode64 = function(input) {
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    var output = "", enc1, enc2, enc3, enc4, i5 = 0;
    while (i5 < input.length)
      if (enc1 = _base64Idx[input.charCodeAt(i5++) - 43], enc2 = _base64Idx[input.charCodeAt(i5++) - 43], enc3 = _base64Idx[input.charCodeAt(i5++) - 43], enc4 = _base64Idx[input.charCodeAt(i5++) - 43], output += String.fromCharCode(enc1 << 2 | enc2 >> 4), enc3 !== 64) {
        if (output += String.fromCharCode((enc2 & 15) << 4 | enc3 >> 2), enc4 !== 64)
          output += String.fromCharCode((enc3 & 3) << 6 | enc4);
      }
    return output;
  };
  util12.encodeUtf8 = function(str) {
    return unescape(encodeURIComponent(str));
  };
  util12.decodeUtf8 = function(str) {
    return decodeURIComponent(escape(str));
  };
  util12.binary = {
    raw: {},
    hex: {},
    base64: {},
    base58: {},
    baseN: {
      encode: baseN.encode,
      decode: baseN.decode
    }
  };
  util12.binary.raw.encode = function(bytes) {
    return String.fromCharCode.apply(null, bytes);
  };
  util12.binary.raw.decode = function(str, output, offset) {
    var out = output;
    if (!out)
      out = new Uint8Array(str.length);
    offset = offset || 0;
    var j4 = offset;
    for (var i5 = 0;i5 < str.length; ++i5)
      out[j4++] = str.charCodeAt(i5);
    return output ? j4 - offset : out;
  };
  util12.binary.hex.encode = util12.bytesToHex;
  util12.binary.hex.decode = function(hex, output, offset) {
    var out = output;
    if (!out)
      out = new Uint8Array(Math.ceil(hex.length / 2));
    offset = offset || 0;
    var i5 = 0, j4 = offset;
    if (hex.length & 1)
      i5 = 1, out[j4++] = parseInt(hex[0], 16);
    for (;i5 < hex.length; i5 += 2)
      out[j4++] = parseInt(hex.substr(i5, 2), 16);
    return output ? j4 - offset : out;
  };
  util12.binary.base64.encode = function(input, maxline) {
    var line = "", output = "", chr1, chr2, chr3, i5 = 0;
    while (i5 < input.byteLength) {
      if (chr1 = input[i5++], chr2 = input[i5++], chr3 = input[i5++], line += _base642.charAt(chr1 >> 2), line += _base642.charAt((chr1 & 3) << 4 | chr2 >> 4), isNaN(chr2))
        line += "==";
      else
        line += _base642.charAt((chr2 & 15) << 2 | chr3 >> 6), line += isNaN(chr3) ? "=" : _base642.charAt(chr3 & 63);
      if (maxline && line.length > maxline)
        output += line.substr(0, maxline) + `\r
`, line = line.substr(maxline);
    }
    return output += line, output;
  };
  util12.binary.base64.decode = function(input, output, offset) {
    var out = output;
    if (!out)
      out = new Uint8Array(Math.ceil(input.length / 4) * 3);
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, ""), offset = offset || 0;
    var enc1, enc2, enc3, enc4, i5 = 0, j4 = offset;
    while (i5 < input.length)
      if (enc1 = _base64Idx[input.charCodeAt(i5++) - 43], enc2 = _base64Idx[input.charCodeAt(i5++) - 43], enc3 = _base64Idx[input.charCodeAt(i5++) - 43], enc4 = _base64Idx[input.charCodeAt(i5++) - 43], out[j4++] = enc1 << 2 | enc2 >> 4, enc3 !== 64) {
        if (out[j4++] = (enc2 & 15) << 4 | enc3 >> 2, enc4 !== 64)
          out[j4++] = (enc3 & 3) << 6 | enc4;
      }
    return output ? j4 - offset : out.subarray(0, j4);
  };
  util12.binary.base58.encode = function(input, maxline) {
    return util12.binary.baseN.encode(input, _base58, maxline);
  };
  util12.binary.base58.decode = function(input, maxline) {
    return util12.binary.baseN.decode(input, _base58, maxline);
  };
  util12.text = {
    utf8: {},
    utf16: {}
  };
  util12.text.utf8.encode = function(str, output, offset) {
    str = util12.encodeUtf8(str);
    var out = output;
    if (!out)
      out = new Uint8Array(str.length);
    offset = offset || 0;
    var j4 = offset;
    for (var i5 = 0;i5 < str.length; ++i5)
      out[j4++] = str.charCodeAt(i5);
    return output ? j4 - offset : out;
  };
  util12.text.utf8.decode = function(bytes) {
    return util12.decodeUtf8(String.fromCharCode.apply(null, bytes));
  };
  util12.text.utf16.encode = function(str, output, offset) {
    var out = output;
    if (!out)
      out = new Uint8Array(str.length * 2);
    var view = new Uint16Array(out.buffer);
    offset = offset || 0;
    var j4 = offset, k3 = offset;
    for (var i5 = 0;i5 < str.length; ++i5)
      view[k3++] = str.charCodeAt(i5), j4 += 2;
    return output ? j4 - offset : out;
  };
  util12.text.utf16.decode = function(bytes) {
    return String.fromCharCode.apply(null, new Uint16Array(bytes.buffer));
  };
  util12.deflate = function(api2, bytes, raw) {
    if (bytes = util12.decode64(api2.deflate(util12.encode64(bytes)).rval), raw) {
      var start = 2, flg = bytes.charCodeAt(1);
      if (flg & 32)
        start = 6;
      bytes = bytes.substring(start, bytes.length - 4);
    }
    return bytes;
  };
  util12.inflate = function(api2, bytes, raw) {
    var rval = api2.inflate(util12.encode64(bytes)).rval;
    return rval === null ? null : util12.decode64(rval);
  };
  var _setStorageObject = function(api2, id, obj) {
    if (!api2)
      throw Error("WebStorage not available.");
    var rval;
    if (obj === null)
      rval = api2.removeItem(id);
    else
      obj = util12.encode64(JSON.stringify(obj)), rval = api2.setItem(id, obj);
    if (typeof rval < "u" && rval.rval !== !0) {
      var error44 = Error(rval.error.message);
      throw error44.id = rval.error.id, error44.name = rval.error.name, error44;
    }
  }, _getStorageObject = function(api2, id) {
    if (!api2)
      throw Error("WebStorage not available.");
    var rval = api2.getItem(id);
    if (api2.init)
      if (rval.rval === null) {
        if (rval.error) {
          var error44 = Error(rval.error.message);
          throw error44.id = rval.error.id, error44.name = rval.error.name, error44;
        }
        rval = null;
      } else
        rval = rval.rval;
    if (rval !== null)
      rval = JSON.parse(util12.decode64(rval));
    return rval;
  }, _setItem = function(api2, id, key2, data) {
    var obj = _getStorageObject(api2, id);
    if (obj === null)
      obj = {};
    obj[key2] = data, _setStorageObject(api2, id, obj);
  }, _getItem = function(api2, id, key2) {
    var rval = _getStorageObject(api2, id);
    if (rval !== null)
      rval = key2 in rval ? rval[key2] : null;
    return rval;
  }, _removeItem = function(api2, id, key2) {
    var obj = _getStorageObject(api2, id);
    if (obj !== null && key2 in obj) {
      delete obj[key2];
      var empty = !0;
      for (var prop in obj) {
        empty = !1;
        break;
      }
      if (empty)
        obj = null;
      _setStorageObject(api2, id, obj);
    }
  }, _clearItems = function(api2, id) {
    _setStorageObject(api2, id, null);
  }, _callStorageFunction = function(func, args, location) {
    var rval = null;
    if (typeof location > "u")
      location = ["web", "flash"];
    var type, done = !1, exception = null;
    for (var idx in location) {
      type = location[idx];
      try {
        if (type === "flash" || type === "both") {
          if (args[0] === null)
            throw Error("Flash local storage not available.");
          rval = func.apply(this, args), done = type === "flash";
        }
        if (type === "web" || type === "both")
          args[0] = localStorage, rval = func.apply(this, args), done = !0;
      } catch (ex) {
        exception = ex;
      }
      if (done)
        break;
    }
    if (!done)
      throw exception;
    return rval;
  };
  util12.setItem = function(api2, id, key2, data, location) {
    _callStorageFunction(_setItem, arguments, location);
  };
  util12.getItem = function(api2, id, key2, location) {
    return _callStorageFunction(_getItem, arguments, location);
  };
  util12.removeItem = function(api2, id, key2, location) {
    _callStorageFunction(_removeItem, arguments, location);
  };
  util12.clearItems = function(api2, id, location) {
    _callStorageFunction(_clearItems, arguments, location);
  };
  util12.isEmpty = function(obj) {
    for (var prop in obj)
      if (obj.hasOwnProperty(prop))
        return !1;
    return !0;
  };
  util12.format = function(format4) {
    var re = /%./g, match, part, argi = 0, parts = [], last2 = 0;
    while (match = re.exec(format4)) {
      if (part = format4.substring(last2, re.lastIndex - 2), part.length > 0)
        parts.push(part);
      last2 = re.lastIndex;
      var code = match[0][1];
      switch (code) {
        case "s":
        case "o":
          if (argi < arguments.length)
            parts.push(arguments[argi++ + 1]);
          else
            parts.push("<?>");
          break;
        case "%":
          parts.push("%");
          break;
        default:
          parts.push("<%" + code + "?>");
      }
    }
    return parts.push(format4.substring(last2)), parts.join("");
  };
  util12.formatNumber = function(number4, decimals, dec_point, thousands_sep) {
    var n5 = number4, c3 = isNaN(decimals = Math.abs(decimals)) ? 2 : decimals, d = dec_point === void 0 ? "," : dec_point, t2 = thousands_sep === void 0 ? "." : thousands_sep, s2 = n5 < 0 ? "-" : "", i5 = parseInt(n5 = Math.abs(+n5 || 0).toFixed(c3), 10) + "", j4 = i5.length > 3 ? i5.length % 3 : 0;
    return s2 + (j4 ? i5.substr(0, j4) + t2 : "") + i5.substr(j4).replace(/(\d{3})(?=\d)/g, "$1" + t2) + (c3 ? d + Math.abs(n5 - i5).toFixed(c3).slice(2) : "");
  };
  util12.formatSize = function(size) {
    if (size >= 1073741824)
      size = util12.formatNumber(size / 1073741824, 2, ".", "") + " GiB";
    else if (size >= 1048576)
      size = util12.formatNumber(size / 1048576, 2, ".", "") + " MiB";
    else if (size >= 1024)
      size = util12.formatNumber(size / 1024, 0) + " KiB";
    else
      size = util12.formatNumber(size, 0) + " bytes";
    return size;
  };
  util12.bytesFromIP = function(ip) {
    if (ip.indexOf(".") !== -1)
      return util12.bytesFromIPv4(ip);
    if (ip.indexOf(":") !== -1)
      return util12.bytesFromIPv6(ip);
    return null;
  };
  util12.bytesFromIPv4 = function(ip) {
    if (ip = ip.split("."), ip.length !== 4)
      return null;
    var b = util12.createBuffer();
    for (var i5 = 0;i5 < ip.length; ++i5) {
      var num = parseInt(ip[i5], 10);
      if (isNaN(num))
        return null;
      b.putByte(num);
    }
    return b.getBytes();
  };
  util12.bytesFromIPv6 = function(ip) {
    var blanks = 0;
    ip = ip.split(":").filter(function(e) {
      if (e.length === 0)
        ++blanks;
      return !0;
    });
    var zeros = (8 - ip.length + blanks) * 2, b = util12.createBuffer();
    for (var i5 = 0;i5 < 8; ++i5) {
      if (!ip[i5] || ip[i5].length === 0) {
        b.fillWithByte(0, zeros), zeros = 0;
        continue;
      }
      var bytes = util12.hexToBytes(ip[i5]);
      if (bytes.length < 2)
        b.putByte(0);
      b.putBytes(bytes);
    }
    return b.getBytes();
  };
  util12.bytesToIP = function(bytes) {
    if (bytes.length === 4)
      return util12.bytesToIPv4(bytes);
    if (bytes.length === 16)
      return util12.bytesToIPv6(bytes);
    return null;
  };
  util12.bytesToIPv4 = function(bytes) {
    if (bytes.length !== 4)
      return null;
    var ip = [];
    for (var i5 = 0;i5 < bytes.length; ++i5)
      ip.push(bytes.charCodeAt(i5));
    return ip.join(".");
  };
  util12.bytesToIPv6 = function(bytes) {
    if (bytes.length !== 16)
      return null;
    var ip = [], zeroGroups = [], zeroMaxGroup = 0;
    for (var i5 = 0;i5 < bytes.length; i5 += 2) {
      var hex = util12.bytesToHex(bytes[i5] + bytes[i5 + 1]);
      while (hex[0] === "0" && hex !== "0")
        hex = hex.substr(1);
      if (hex === "0") {
        var last2 = zeroGroups[zeroGroups.length - 1], idx = ip.length;
        if (!last2 || idx !== last2.end + 1)
          zeroGroups.push({ start: idx, end: idx });
        else if (last2.end = idx, last2.end - last2.start > zeroGroups[zeroMaxGroup].end - zeroGroups[zeroMaxGroup].start)
          zeroMaxGroup = zeroGroups.length - 1;
      }
      ip.push(hex);
    }
    if (zeroGroups.length > 0) {
      var group = zeroGroups[zeroMaxGroup];
      if (group.end - group.start > 0) {
        if (ip.splice(group.start, group.end - group.start + 1, ""), group.start === 0)
          ip.unshift("");
        if (group.end === 7)
          ip.push("");
      }
    }
    return ip.join(":");
  };
  util12.estimateCores = function(options, callback) {
    if (typeof options === "function")
      callback = options, options = {};
    if (options = options || {}, "cores" in util12 && !options.update)
      return callback(null, util12.cores);
    if (typeof navigator < "u" && "hardwareConcurrency" in navigator && navigator.hardwareConcurrency > 0)
      return util12.cores = navigator.hardwareConcurrency, callback(null, util12.cores);
    if (typeof Worker > "u")
      return util12.cores = 1, callback(null, util12.cores);
    if (typeof Blob > "u")
      return util12.cores = 2, callback(null, util12.cores);
    var blobUrl = URL.createObjectURL(new Blob([
      "(",
      function() {
        self.addEventListener("message", function(e) {
          var st = Date.now(), et2 = st + 4;
          while (Date.now() < et2)
            ;
          self.postMessage({ st, et: et2 });
        });
      }.toString(),
      ")()"
    ], { type: "application/javascript" }));
    sample2([], 5, 16);
    function sample2(max2, samples, numWorkers) {
      if (samples === 0) {
        var avg = Math.floor(max2.reduce(function(avg2, x4) {
          return avg2 + x4;
        }, 0) / max2.length);
        return util12.cores = Math.max(1, avg), URL.revokeObjectURL(blobUrl), callback(null, util12.cores);
      }
      map7(numWorkers, function(err2, results) {
        max2.push(reduce(numWorkers, results)), sample2(max2, samples - 1, numWorkers);
      });
    }
    function map7(numWorkers, callback2) {
      var workers = [], results = [];
      for (var i5 = 0;i5 < numWorkers; ++i5) {
        var worker = new Worker(blobUrl);
        worker.addEventListener("message", function(e) {
          if (results.push(e.data), results.length === numWorkers) {
            for (var i6 = 0;i6 < numWorkers; ++i6)
              workers[i6].terminate();
            callback2(null, results);
          }
        }), workers.push(worker);
      }
      for (var i5 = 0;i5 < numWorkers; ++i5)
        workers[i5].postMessage(i5);
    }
    function reduce(numWorkers, results) {
      var overlaps = [];
      for (var n5 = 0;n5 < numWorkers; ++n5) {
        var r1 = results[n5], overlap = overlaps[n5] = [];
        for (var i5 = 0;i5 < numWorkers; ++i5) {
          if (n5 === i5)
            continue;
          var r22 = results[i5];
          if (r1.st > r22.st && r1.st < r22.et || r22.st > r1.st && r22.st < r1.et)
            overlap.push(i5);
        }
      }
      return overlaps.reduce(function(max2, overlap2) {
        return Math.max(max2, overlap2.length);
      }, 0);
    }
  };
});
