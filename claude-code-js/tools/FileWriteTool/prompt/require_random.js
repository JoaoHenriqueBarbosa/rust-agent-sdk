// var: require_random
var require_random = __commonJS((exports, module) => {
  var forge = require_forge();
  require_aes();
  require_sha256();
  require_prng();
  require_util3();
  (function() {
    if (forge.random && forge.random.getBytes) {
      module.exports = forge.random;
      return;
    }
    (function(jQuery2) {
      var prng_aes = {}, _prng_aes_output = Array(4), _prng_aes_buffer = forge.util.createBuffer();
      prng_aes.formatKey = function(key3) {
        var tmp = forge.util.createBuffer(key3);
        return key3 = Array(4), key3[0] = tmp.getInt32(), key3[1] = tmp.getInt32(), key3[2] = tmp.getInt32(), key3[3] = tmp.getInt32(), forge.aes._expandKey(key3, !1);
      }, prng_aes.formatSeed = function(seed) {
        var tmp = forge.util.createBuffer(seed);
        return seed = Array(4), seed[0] = tmp.getInt32(), seed[1] = tmp.getInt32(), seed[2] = tmp.getInt32(), seed[3] = tmp.getInt32(), seed;
      }, prng_aes.cipher = function(key3, seed) {
        return forge.aes._updateBlock(key3, seed, _prng_aes_output, !1), _prng_aes_buffer.putInt32(_prng_aes_output[0]), _prng_aes_buffer.putInt32(_prng_aes_output[1]), _prng_aes_buffer.putInt32(_prng_aes_output[2]), _prng_aes_buffer.putInt32(_prng_aes_output[3]), _prng_aes_buffer.getBytes();
      }, prng_aes.increment = function(seed) {
        return ++seed[3], seed;
      }, prng_aes.md = forge.md.sha256;
      function spawnPrng() {
        var ctx = forge.prng.create(prng_aes);
        return ctx.getBytes = function(count3, callback) {
          return ctx.generate(count3, callback);
        }, ctx.getBytesSync = function(count3) {
          return ctx.generate(count3);
        }, ctx;
      }
      var _ctx = spawnPrng(), getRandomValues = null, globalScope = forge.util.globalScope, _crypto = globalScope.crypto || globalScope.msCrypto;
      if (_crypto && _crypto.getRandomValues)
        getRandomValues = function(arr) {
          return _crypto.getRandomValues(arr);
        };
      if (forge.options.usePureJavaScript || !forge.util.isNodejs && !getRandomValues) {
        if (typeof window > "u" || window.document === void 0)
          ;
        if (_ctx.collectInt(+/* @__PURE__ */ new Date, 32), typeof navigator < "u") {
          var _navBytes = "";
          for (var key2 in navigator)
            try {
              if (typeof navigator[key2] == "string")
                _navBytes += navigator[key2];
            } catch (e) {}
          _ctx.collect(_navBytes), _navBytes = null;
        }
        if (jQuery2)
          jQuery2().mousemove(function(e) {
            _ctx.collectInt(e.clientX, 16), _ctx.collectInt(e.clientY, 16);
          }), jQuery2().keypress(function(e) {
            _ctx.collectInt(e.charCode, 8);
          });
      }
      if (!forge.random)
        forge.random = _ctx;
      else
        for (var key2 in _ctx)
          forge.random[key2] = _ctx[key2];
      forge.random.createInstance = spawnPrng, module.exports = forge.random;
    })(typeof jQuery < "u" ? jQuery : null);
  })();
});
