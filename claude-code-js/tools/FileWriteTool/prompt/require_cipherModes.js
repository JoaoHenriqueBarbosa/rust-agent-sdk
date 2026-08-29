// var: require_cipherModes
var require_cipherModes = __commonJS((exports, module) => {
  var forge = require_forge();
  require_util3();
  forge.cipher = forge.cipher || {};
  var modes = module.exports = forge.cipher.modes = forge.cipher.modes || {};
  modes.ecb = function(options) {
    options = options || {}, this.name = "ECB", this.cipher = options.cipher, this.blockSize = options.blockSize || 16, this._ints = this.blockSize / 4, this._inBlock = Array(this._ints), this._outBlock = Array(this._ints);
  };
  modes.ecb.prototype.start = function(options) {};
  modes.ecb.prototype.encrypt = function(input, output, finish) {
    if (input.length() < this.blockSize && !(finish && input.length() > 0))
      return !0;
    for (var i5 = 0;i5 < this._ints; ++i5)
      this._inBlock[i5] = input.getInt32();
    this.cipher.encrypt(this._inBlock, this._outBlock);
    for (var i5 = 0;i5 < this._ints; ++i5)
      output.putInt32(this._outBlock[i5]);
  };
  modes.ecb.prototype.decrypt = function(input, output, finish) {
    if (input.length() < this.blockSize && !(finish && input.length() > 0))
      return !0;
    for (var i5 = 0;i5 < this._ints; ++i5)
      this._inBlock[i5] = input.getInt32();
    this.cipher.decrypt(this._inBlock, this._outBlock);
    for (var i5 = 0;i5 < this._ints; ++i5)
      output.putInt32(this._outBlock[i5]);
  };
  modes.ecb.prototype.pad = function(input, options) {
    var padding = input.length() === this.blockSize ? this.blockSize : this.blockSize - input.length();
    return input.fillWithByte(padding, padding), !0;
  };
  modes.ecb.prototype.unpad = function(output, options) {
    if (options.overflow > 0)
      return !1;
    var len = output.length(), count3 = output.at(len - 1);
    if (count3 > this.blockSize << 2)
      return !1;
    return output.truncate(count3), !0;
  };
  modes.cbc = function(options) {
    options = options || {}, this.name = "CBC", this.cipher = options.cipher, this.blockSize = options.blockSize || 16, this._ints = this.blockSize / 4, this._inBlock = Array(this._ints), this._outBlock = Array(this._ints);
  };
  modes.cbc.prototype.start = function(options) {
    if (options.iv === null) {
      if (!this._prev)
        throw Error("Invalid IV parameter.");
      this._iv = this._prev.slice(0);
    } else if (!("iv" in options))
      throw Error("Invalid IV parameter.");
    else
      this._iv = transformIV(options.iv, this.blockSize), this._prev = this._iv.slice(0);
  };
  modes.cbc.prototype.encrypt = function(input, output, finish) {
    if (input.length() < this.blockSize && !(finish && input.length() > 0))
      return !0;
    for (var i5 = 0;i5 < this._ints; ++i5)
      this._inBlock[i5] = this._prev[i5] ^ input.getInt32();
    this.cipher.encrypt(this._inBlock, this._outBlock);
    for (var i5 = 0;i5 < this._ints; ++i5)
      output.putInt32(this._outBlock[i5]);
    this._prev = this._outBlock;
  };
  modes.cbc.prototype.decrypt = function(input, output, finish) {
    if (input.length() < this.blockSize && !(finish && input.length() > 0))
      return !0;
    for (var i5 = 0;i5 < this._ints; ++i5)
      this._inBlock[i5] = input.getInt32();
    this.cipher.decrypt(this._inBlock, this._outBlock);
    for (var i5 = 0;i5 < this._ints; ++i5)
      output.putInt32(this._prev[i5] ^ this._outBlock[i5]);
    this._prev = this._inBlock.slice(0);
  };
  modes.cbc.prototype.pad = function(input, options) {
    var padding = input.length() === this.blockSize ? this.blockSize : this.blockSize - input.length();
    return input.fillWithByte(padding, padding), !0;
  };
  modes.cbc.prototype.unpad = function(output, options) {
    if (options.overflow > 0)
      return !1;
    var len = output.length(), count3 = output.at(len - 1);
    if (count3 > this.blockSize << 2)
      return !1;
    return output.truncate(count3), !0;
  };
  modes.cfb = function(options) {
    options = options || {}, this.name = "CFB", this.cipher = options.cipher, this.blockSize = options.blockSize || 16, this._ints = this.blockSize / 4, this._inBlock = null, this._outBlock = Array(this._ints), this._partialBlock = Array(this._ints), this._partialOutput = forge.util.createBuffer(), this._partialBytes = 0;
  };
  modes.cfb.prototype.start = function(options) {
    if (!("iv" in options))
      throw Error("Invalid IV parameter.");
    this._iv = transformIV(options.iv, this.blockSize), this._inBlock = this._iv.slice(0), this._partialBytes = 0;
  };
  modes.cfb.prototype.encrypt = function(input, output, finish) {
    var inputLength = input.length();
    if (inputLength === 0)
      return !0;
    if (this.cipher.encrypt(this._inBlock, this._outBlock), this._partialBytes === 0 && inputLength >= this.blockSize) {
      for (var i5 = 0;i5 < this._ints; ++i5)
        this._inBlock[i5] = input.getInt32() ^ this._outBlock[i5], output.putInt32(this._inBlock[i5]);
      return;
    }
    var partialBytes = (this.blockSize - inputLength) % this.blockSize;
    if (partialBytes > 0)
      partialBytes = this.blockSize - partialBytes;
    this._partialOutput.clear();
    for (var i5 = 0;i5 < this._ints; ++i5)
      this._partialBlock[i5] = input.getInt32() ^ this._outBlock[i5], this._partialOutput.putInt32(this._partialBlock[i5]);
    if (partialBytes > 0)
      input.read -= this.blockSize;
    else
      for (var i5 = 0;i5 < this._ints; ++i5)
        this._inBlock[i5] = this._partialBlock[i5];
    if (this._partialBytes > 0)
      this._partialOutput.getBytes(this._partialBytes);
    if (partialBytes > 0 && !finish)
      return output.putBytes(this._partialOutput.getBytes(partialBytes - this._partialBytes)), this._partialBytes = partialBytes, !0;
    output.putBytes(this._partialOutput.getBytes(inputLength - this._partialBytes)), this._partialBytes = 0;
  };
  modes.cfb.prototype.decrypt = function(input, output, finish) {
    var inputLength = input.length();
    if (inputLength === 0)
      return !0;
    if (this.cipher.encrypt(this._inBlock, this._outBlock), this._partialBytes === 0 && inputLength >= this.blockSize) {
      for (var i5 = 0;i5 < this._ints; ++i5)
        this._inBlock[i5] = input.getInt32(), output.putInt32(this._inBlock[i5] ^ this._outBlock[i5]);
      return;
    }
    var partialBytes = (this.blockSize - inputLength) % this.blockSize;
    if (partialBytes > 0)
      partialBytes = this.blockSize - partialBytes;
    this._partialOutput.clear();
    for (var i5 = 0;i5 < this._ints; ++i5)
      this._partialBlock[i5] = input.getInt32(), this._partialOutput.putInt32(this._partialBlock[i5] ^ this._outBlock[i5]);
    if (partialBytes > 0)
      input.read -= this.blockSize;
    else
      for (var i5 = 0;i5 < this._ints; ++i5)
        this._inBlock[i5] = this._partialBlock[i5];
    if (this._partialBytes > 0)
      this._partialOutput.getBytes(this._partialBytes);
    if (partialBytes > 0 && !finish)
      return output.putBytes(this._partialOutput.getBytes(partialBytes - this._partialBytes)), this._partialBytes = partialBytes, !0;
    output.putBytes(this._partialOutput.getBytes(inputLength - this._partialBytes)), this._partialBytes = 0;
  };
  modes.ofb = function(options) {
    options = options || {}, this.name = "OFB", this.cipher = options.cipher, this.blockSize = options.blockSize || 16, this._ints = this.blockSize / 4, this._inBlock = null, this._outBlock = Array(this._ints), this._partialOutput = forge.util.createBuffer(), this._partialBytes = 0;
  };
  modes.ofb.prototype.start = function(options) {
    if (!("iv" in options))
      throw Error("Invalid IV parameter.");
    this._iv = transformIV(options.iv, this.blockSize), this._inBlock = this._iv.slice(0), this._partialBytes = 0;
  };
  modes.ofb.prototype.encrypt = function(input, output, finish) {
    var inputLength = input.length();
    if (input.length() === 0)
      return !0;
    if (this.cipher.encrypt(this._inBlock, this._outBlock), this._partialBytes === 0 && inputLength >= this.blockSize) {
      for (var i5 = 0;i5 < this._ints; ++i5)
        output.putInt32(input.getInt32() ^ this._outBlock[i5]), this._inBlock[i5] = this._outBlock[i5];
      return;
    }
    var partialBytes = (this.blockSize - inputLength) % this.blockSize;
    if (partialBytes > 0)
      partialBytes = this.blockSize - partialBytes;
    this._partialOutput.clear();
    for (var i5 = 0;i5 < this._ints; ++i5)
      this._partialOutput.putInt32(input.getInt32() ^ this._outBlock[i5]);
    if (partialBytes > 0)
      input.read -= this.blockSize;
    else
      for (var i5 = 0;i5 < this._ints; ++i5)
        this._inBlock[i5] = this._outBlock[i5];
    if (this._partialBytes > 0)
      this._partialOutput.getBytes(this._partialBytes);
    if (partialBytes > 0 && !finish)
      return output.putBytes(this._partialOutput.getBytes(partialBytes - this._partialBytes)), this._partialBytes = partialBytes, !0;
    output.putBytes(this._partialOutput.getBytes(inputLength - this._partialBytes)), this._partialBytes = 0;
  };
  modes.ofb.prototype.decrypt = modes.ofb.prototype.encrypt;
  modes.ctr = function(options) {
    options = options || {}, this.name = "CTR", this.cipher = options.cipher, this.blockSize = options.blockSize || 16, this._ints = this.blockSize / 4, this._inBlock = null, this._outBlock = Array(this._ints), this._partialOutput = forge.util.createBuffer(), this._partialBytes = 0;
  };
  modes.ctr.prototype.start = function(options) {
    if (!("iv" in options))
      throw Error("Invalid IV parameter.");
    this._iv = transformIV(options.iv, this.blockSize), this._inBlock = this._iv.slice(0), this._partialBytes = 0;
  };
  modes.ctr.prototype.encrypt = function(input, output, finish) {
    var inputLength = input.length();
    if (inputLength === 0)
      return !0;
    if (this.cipher.encrypt(this._inBlock, this._outBlock), this._partialBytes === 0 && inputLength >= this.blockSize)
      for (var i5 = 0;i5 < this._ints; ++i5)
        output.putInt32(input.getInt32() ^ this._outBlock[i5]);
    else {
      var partialBytes = (this.blockSize - inputLength) % this.blockSize;
      if (partialBytes > 0)
        partialBytes = this.blockSize - partialBytes;
      this._partialOutput.clear();
      for (var i5 = 0;i5 < this._ints; ++i5)
        this._partialOutput.putInt32(input.getInt32() ^ this._outBlock[i5]);
      if (partialBytes > 0)
        input.read -= this.blockSize;
      if (this._partialBytes > 0)
        this._partialOutput.getBytes(this._partialBytes);
      if (partialBytes > 0 && !finish)
        return output.putBytes(this._partialOutput.getBytes(partialBytes - this._partialBytes)), this._partialBytes = partialBytes, !0;
      output.putBytes(this._partialOutput.getBytes(inputLength - this._partialBytes)), this._partialBytes = 0;
    }
    inc32(this._inBlock);
  };
  modes.ctr.prototype.decrypt = modes.ctr.prototype.encrypt;
  modes.gcm = function(options) {
    options = options || {}, this.name = "GCM", this.cipher = options.cipher, this.blockSize = options.blockSize || 16, this._ints = this.blockSize / 4, this._inBlock = Array(this._ints), this._outBlock = Array(this._ints), this._partialOutput = forge.util.createBuffer(), this._partialBytes = 0, this._R = 3774873600;
  };
  modes.gcm.prototype.start = function(options) {
    if (!("iv" in options))
      throw Error("Invalid IV parameter.");
    var iv = forge.util.createBuffer(options.iv);
    this._cipherLength = 0;
    var additionalData;
    if ("additionalData" in options)
      additionalData = forge.util.createBuffer(options.additionalData);
    else
      additionalData = forge.util.createBuffer();
    if ("tagLength" in options)
      this._tagLength = options.tagLength;
    else
      this._tagLength = 128;
    if (this._tag = null, options.decrypt) {
      if (this._tag = forge.util.createBuffer(options.tag).getBytes(), this._tag.length !== this._tagLength / 8)
        throw Error("Authentication tag does not match tag length.");
    }
    this._hashBlock = Array(this._ints), this.tag = null, this._hashSubkey = Array(this._ints), this.cipher.encrypt([0, 0, 0, 0], this._hashSubkey), this.componentBits = 4, this._m = this.generateHashTable(this._hashSubkey, this.componentBits);
    var ivLength = iv.length();
    if (ivLength === 12)
      this._j0 = [iv.getInt32(), iv.getInt32(), iv.getInt32(), 1];
    else {
      this._j0 = [0, 0, 0, 0];
      while (iv.length() > 0)
        this._j0 = this.ghash(this._hashSubkey, this._j0, [iv.getInt32(), iv.getInt32(), iv.getInt32(), iv.getInt32()]);
      this._j0 = this.ghash(this._hashSubkey, this._j0, [0, 0].concat(from64To32(ivLength * 8)));
    }
    this._inBlock = this._j0.slice(0), inc32(this._inBlock), this._partialBytes = 0, additionalData = forge.util.createBuffer(additionalData), this._aDataLength = from64To32(additionalData.length() * 8);
    var overflow = additionalData.length() % this.blockSize;
    if (overflow)
      additionalData.fillWithByte(0, this.blockSize - overflow);
    this._s = [0, 0, 0, 0];
    while (additionalData.length() > 0)
      this._s = this.ghash(this._hashSubkey, this._s, [
        additionalData.getInt32(),
        additionalData.getInt32(),
        additionalData.getInt32(),
        additionalData.getInt32()
      ]);
  };
  modes.gcm.prototype.encrypt = function(input, output, finish) {
    var inputLength = input.length();
    if (inputLength === 0)
      return !0;
    if (this.cipher.encrypt(this._inBlock, this._outBlock), this._partialBytes === 0 && inputLength >= this.blockSize) {
      for (var i5 = 0;i5 < this._ints; ++i5)
        output.putInt32(this._outBlock[i5] ^= input.getInt32());
      this._cipherLength += this.blockSize;
    } else {
      var partialBytes = (this.blockSize - inputLength) % this.blockSize;
      if (partialBytes > 0)
        partialBytes = this.blockSize - partialBytes;
      this._partialOutput.clear();
      for (var i5 = 0;i5 < this._ints; ++i5)
        this._partialOutput.putInt32(input.getInt32() ^ this._outBlock[i5]);
      if (partialBytes <= 0 || finish) {
        if (finish) {
          var overflow = inputLength % this.blockSize;
          this._cipherLength += overflow, this._partialOutput.truncate(this.blockSize - overflow);
        } else
          this._cipherLength += this.blockSize;
        for (var i5 = 0;i5 < this._ints; ++i5)
          this._outBlock[i5] = this._partialOutput.getInt32();
        this._partialOutput.read -= this.blockSize;
      }
      if (this._partialBytes > 0)
        this._partialOutput.getBytes(this._partialBytes);
      if (partialBytes > 0 && !finish)
        return input.read -= this.blockSize, output.putBytes(this._partialOutput.getBytes(partialBytes - this._partialBytes)), this._partialBytes = partialBytes, !0;
      output.putBytes(this._partialOutput.getBytes(inputLength - this._partialBytes)), this._partialBytes = 0;
    }
    this._s = this.ghash(this._hashSubkey, this._s, this._outBlock), inc32(this._inBlock);
  };
  modes.gcm.prototype.decrypt = function(input, output, finish) {
    var inputLength = input.length();
    if (inputLength < this.blockSize && !(finish && inputLength > 0))
      return !0;
    this.cipher.encrypt(this._inBlock, this._outBlock), inc32(this._inBlock), this._hashBlock[0] = input.getInt32(), this._hashBlock[1] = input.getInt32(), this._hashBlock[2] = input.getInt32(), this._hashBlock[3] = input.getInt32(), this._s = this.ghash(this._hashSubkey, this._s, this._hashBlock);
    for (var i5 = 0;i5 < this._ints; ++i5)
      output.putInt32(this._outBlock[i5] ^ this._hashBlock[i5]);
    if (inputLength < this.blockSize)
      this._cipherLength += inputLength % this.blockSize;
    else
      this._cipherLength += this.blockSize;
  };
  modes.gcm.prototype.afterFinish = function(output, options) {
    var rval = !0;
    if (options.decrypt && options.overflow)
      output.truncate(this.blockSize - options.overflow);
    this.tag = forge.util.createBuffer();
    var lengths = this._aDataLength.concat(from64To32(this._cipherLength * 8));
    this._s = this.ghash(this._hashSubkey, this._s, lengths);
    var tag = [];
    this.cipher.encrypt(this._j0, tag);
    for (var i5 = 0;i5 < this._ints; ++i5)
      this.tag.putInt32(this._s[i5] ^ tag[i5]);
    if (this.tag.truncate(this.tag.length() % (this._tagLength / 8)), options.decrypt && this.tag.bytes() !== this._tag)
      rval = !1;
    return rval;
  };
  modes.gcm.prototype.multiply = function(x4, y2) {
    var z_i = [0, 0, 0, 0], v_i = y2.slice(0);
    for (var i5 = 0;i5 < 128; ++i5) {
      var x_i = x4[i5 / 32 | 0] & 1 << 31 - i5 % 32;
      if (x_i)
        z_i[0] ^= v_i[0], z_i[1] ^= v_i[1], z_i[2] ^= v_i[2], z_i[3] ^= v_i[3];
      this.pow(v_i, v_i);
    }
    return z_i;
  };
  modes.gcm.prototype.pow = function(x4, out) {
    var lsb = x4[3] & 1;
    for (var i5 = 3;i5 > 0; --i5)
      out[i5] = x4[i5] >>> 1 | (x4[i5 - 1] & 1) << 31;
    if (out[0] = x4[0] >>> 1, lsb)
      out[0] ^= this._R;
  };
  modes.gcm.prototype.tableMultiply = function(x4) {
    var z2 = [0, 0, 0, 0];
    for (var i5 = 0;i5 < 32; ++i5) {
      var idx = i5 / 8 | 0, x_i = x4[idx] >>> (7 - i5 % 8) * 4 & 15, ah = this._m[i5][x_i];
      z2[0] ^= ah[0], z2[1] ^= ah[1], z2[2] ^= ah[2], z2[3] ^= ah[3];
    }
    return z2;
  };
  modes.gcm.prototype.ghash = function(h4, y2, x4) {
    return y2[0] ^= x4[0], y2[1] ^= x4[1], y2[2] ^= x4[2], y2[3] ^= x4[3], this.tableMultiply(y2);
  };
  modes.gcm.prototype.generateHashTable = function(h4, bits2) {
    var multiplier = 8 / bits2, perInt = 4 * multiplier, size = 16 * multiplier, m4 = Array(size);
    for (var i5 = 0;i5 < size; ++i5) {
      var tmp = [0, 0, 0, 0], idx = i5 / perInt | 0, shft2 = (perInt - 1 - i5 % perInt) * bits2;
      tmp[idx] = 1 << bits2 - 1 << shft2, m4[i5] = this.generateSubHashTable(this.multiply(tmp, h4), bits2);
    }
    return m4;
  };
  modes.gcm.prototype.generateSubHashTable = function(mid, bits2) {
    var size = 1 << bits2, half = size >>> 1, m4 = Array(size);
    m4[half] = mid.slice(0);
    var i5 = half >>> 1;
    while (i5 > 0)
      this.pow(m4[2 * i5], m4[i5] = []), i5 >>= 1;
    i5 = 2;
    while (i5 < half) {
      for (var j4 = 1;j4 < i5; ++j4) {
        var m_i = m4[i5], m_j = m4[j4];
        m4[i5 + j4] = [
          m_i[0] ^ m_j[0],
          m_i[1] ^ m_j[1],
          m_i[2] ^ m_j[2],
          m_i[3] ^ m_j[3]
        ];
      }
      i5 *= 2;
    }
    m4[0] = [0, 0, 0, 0];
    for (i5 = half + 1;i5 < size; ++i5) {
      var c3 = m4[i5 ^ half];
      m4[i5] = [mid[0] ^ c3[0], mid[1] ^ c3[1], mid[2] ^ c3[2], mid[3] ^ c3[3]];
    }
    return m4;
  };
  function transformIV(iv, blockSize) {
    if (typeof iv === "string")
      iv = forge.util.createBuffer(iv);
    if (forge.util.isArray(iv) && iv.length > 4) {
      var tmp = iv;
      iv = forge.util.createBuffer();
      for (var i5 = 0;i5 < tmp.length; ++i5)
        iv.putByte(tmp[i5]);
    }
    if (iv.length() < blockSize)
      throw Error("Invalid IV length; got " + iv.length() + " bytes and expected " + blockSize + " bytes.");
    if (!forge.util.isArray(iv)) {
      var ints = [], blocks = blockSize / 4;
      for (var i5 = 0;i5 < blocks; ++i5)
        ints.push(iv.getInt32());
      iv = ints;
    }
    return iv;
  }
  function inc32(block) {
    block[block.length - 1] = block[block.length - 1] + 1 & 4294967295;
  }
  function from64To32(num) {
    return [num / 4294967296 | 0, num & 4294967295];
  }
});
