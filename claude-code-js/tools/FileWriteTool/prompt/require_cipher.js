// var: require_cipher
var require_cipher = __commonJS((exports, module) => {
  var forge = require_forge();
  require_util3();
  module.exports = forge.cipher = forge.cipher || {};
  forge.cipher.algorithms = forge.cipher.algorithms || {};
  forge.cipher.createCipher = function(algorithm, key2) {
    var api2 = algorithm;
    if (typeof api2 === "string") {
      if (api2 = forge.cipher.getAlgorithm(api2), api2)
        api2 = api2();
    }
    if (!api2)
      throw Error("Unsupported algorithm: " + algorithm);
    return new forge.cipher.BlockCipher({
      algorithm: api2,
      key: key2,
      decrypt: !1
    });
  };
  forge.cipher.createDecipher = function(algorithm, key2) {
    var api2 = algorithm;
    if (typeof api2 === "string") {
      if (api2 = forge.cipher.getAlgorithm(api2), api2)
        api2 = api2();
    }
    if (!api2)
      throw Error("Unsupported algorithm: " + algorithm);
    return new forge.cipher.BlockCipher({
      algorithm: api2,
      key: key2,
      decrypt: !0
    });
  };
  forge.cipher.registerAlgorithm = function(name3, algorithm) {
    name3 = name3.toUpperCase(), forge.cipher.algorithms[name3] = algorithm;
  };
  forge.cipher.getAlgorithm = function(name3) {
    if (name3 = name3.toUpperCase(), name3 in forge.cipher.algorithms)
      return forge.cipher.algorithms[name3];
    return null;
  };
  var BlockCipher = forge.cipher.BlockCipher = function(options) {
    this.algorithm = options.algorithm, this.mode = this.algorithm.mode, this.blockSize = this.mode.blockSize, this._finish = !1, this._input = null, this.output = null, this._op = options.decrypt ? this.mode.decrypt : this.mode.encrypt, this._decrypt = options.decrypt, this.algorithm.initialize(options);
  };
  BlockCipher.prototype.start = function(options) {
    options = options || {};
    var opts = {};
    for (var key2 in options)
      opts[key2] = options[key2];
    opts.decrypt = this._decrypt, this._finish = !1, this._input = forge.util.createBuffer(), this.output = options.output || forge.util.createBuffer(), this.mode.start(opts);
  };
  BlockCipher.prototype.update = function(input) {
    if (input)
      this._input.putBuffer(input);
    while (!this._op.call(this.mode, this._input, this.output, this._finish) && !this._finish)
      ;
    this._input.compact();
  };
  BlockCipher.prototype.finish = function(pad) {
    if (pad && (this.mode.name === "ECB" || this.mode.name === "CBC"))
      this.mode.pad = function(input) {
        return pad(this.blockSize, input, !1);
      }, this.mode.unpad = function(output) {
        return pad(this.blockSize, output, !0);
      };
    var options = {};
    if (options.decrypt = this._decrypt, options.overflow = this._input.length() % this.blockSize, !this._decrypt && this.mode.pad) {
      if (!this.mode.pad(this._input, options))
        return !1;
    }
    if (this._finish = !0, this.update(), this._decrypt && this.mode.unpad) {
      if (!this.mode.unpad(this.output, options))
        return !1;
    }
    if (this.mode.afterFinish) {
      if (!this.mode.afterFinish(this.output, options))
        return !1;
    }
    return !0;
  };
});
