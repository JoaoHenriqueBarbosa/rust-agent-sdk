// var: require_prng
var require_prng = __commonJS((exports, module) => {
  var forge = require_forge();
  require_util3();
  var _crypto = null;
  if (forge.util.isNodejs && !forge.options.usePureJavaScript && !process.versions["node-webkit"])
    _crypto = __require("crypto");
  var prng = module.exports = forge.prng = forge.prng || {};
  prng.create = function(plugin) {
    var ctx = {
      plugin,
      key: null,
      seed: null,
      time: null,
      reseeds: 0,
      generated: 0,
      keyBytes: ""
    }, md = plugin.md, pools = Array(32);
    for (var i5 = 0;i5 < 32; ++i5)
      pools[i5] = md.create();
    ctx.pools = pools, ctx.pool = 0, ctx.generate = function(count3, callback) {
      if (!callback)
        return ctx.generateSync(count3);
      var cipher = ctx.plugin.cipher, increment2 = ctx.plugin.increment, formatKey = ctx.plugin.formatKey, formatSeed = ctx.plugin.formatSeed, b = forge.util.createBuffer();
      ctx.key = null, generate2();
      function generate2(err2) {
        if (err2)
          return callback(err2);
        if (b.length() >= count3)
          return callback(null, b.getBytes(count3));
        if (ctx.generated > 1048575)
          ctx.key = null;
        if (ctx.key === null)
          return forge.util.nextTick(function() {
            _reseed(generate2);
          });
        var bytes = cipher(ctx.key, ctx.seed);
        ctx.generated += bytes.length, b.putBytes(bytes), ctx.key = formatKey(cipher(ctx.key, increment2(ctx.seed))), ctx.seed = formatSeed(cipher(ctx.key, ctx.seed)), forge.util.setImmediate(generate2);
      }
    }, ctx.generateSync = function(count3) {
      var cipher = ctx.plugin.cipher, increment2 = ctx.plugin.increment, formatKey = ctx.plugin.formatKey, formatSeed = ctx.plugin.formatSeed;
      ctx.key = null;
      var b = forge.util.createBuffer();
      while (b.length() < count3) {
        if (ctx.generated > 1048575)
          ctx.key = null;
        if (ctx.key === null)
          _reseedSync();
        var bytes = cipher(ctx.key, ctx.seed);
        ctx.generated += bytes.length, b.putBytes(bytes), ctx.key = formatKey(cipher(ctx.key, increment2(ctx.seed))), ctx.seed = formatSeed(cipher(ctx.key, ctx.seed));
      }
      return b.getBytes(count3);
    };
    function _reseed(callback) {
      if (ctx.pools[0].messageLength >= 32)
        return _seed(), callback();
      var needed = 32 - ctx.pools[0].messageLength << 5;
      ctx.seedFile(needed, function(err2, bytes) {
        if (err2)
          return callback(err2);
        ctx.collect(bytes), _seed(), callback();
      });
    }
    function _reseedSync() {
      if (ctx.pools[0].messageLength >= 32)
        return _seed();
      var needed = 32 - ctx.pools[0].messageLength << 5;
      ctx.collect(ctx.seedFileSync(needed)), _seed();
    }
    function _seed() {
      ctx.reseeds = ctx.reseeds === 4294967295 ? 0 : ctx.reseeds + 1;
      var md2 = ctx.plugin.md.create();
      md2.update(ctx.keyBytes);
      var _2powK = 1;
      for (var k3 = 0;k3 < 32; ++k3) {
        if (ctx.reseeds % _2powK === 0)
          md2.update(ctx.pools[k3].digest().getBytes()), ctx.pools[k3].start();
        _2powK = _2powK << 1;
      }
      ctx.keyBytes = md2.digest().getBytes(), md2.start(), md2.update(ctx.keyBytes);
      var seedBytes = md2.digest().getBytes();
      ctx.key = ctx.plugin.formatKey(ctx.keyBytes), ctx.seed = ctx.plugin.formatSeed(seedBytes), ctx.generated = 0;
    }
    function defaultSeedFile(needed) {
      var getRandomValues = null, globalScope = forge.util.globalScope, _crypto2 = globalScope.crypto || globalScope.msCrypto;
      if (_crypto2 && _crypto2.getRandomValues)
        getRandomValues = function(arr) {
          return _crypto2.getRandomValues(arr);
        };
      var b = forge.util.createBuffer();
      if (getRandomValues)
        while (b.length() < needed) {
          var count3 = Math.max(1, Math.min(needed - b.length(), 65536) / 4), entropy = new Uint32Array(Math.floor(count3));
          try {
            getRandomValues(entropy);
            for (var i6 = 0;i6 < entropy.length; ++i6)
              b.putInt32(entropy[i6]);
          } catch (e) {
            if (!(typeof QuotaExceededError < "u" && e instanceof QuotaExceededError))
              throw e;
          }
        }
      if (b.length() < needed) {
        var hi, lo, next, seed = Math.floor(Math.random() * 65536);
        while (b.length() < needed) {
          lo = 16807 * (seed & 65535), hi = 16807 * (seed >> 16), lo += (hi & 32767) << 16, lo += hi >> 15, lo = (lo & 2147483647) + (lo >> 31), seed = lo & 4294967295;
          for (var i6 = 0;i6 < 3; ++i6)
            next = seed >>> (i6 << 3), next ^= Math.floor(Math.random() * 256), b.putByte(next & 255);
        }
      }
      return b.getBytes(needed);
    }
    if (_crypto)
      ctx.seedFile = function(needed, callback) {
        _crypto.randomBytes(needed, function(err2, bytes) {
          if (err2)
            return callback(err2);
          callback(null, bytes.toString());
        });
      }, ctx.seedFileSync = function(needed) {
        return _crypto.randomBytes(needed).toString();
      };
    else
      ctx.seedFile = function(needed, callback) {
        try {
          callback(null, defaultSeedFile(needed));
        } catch (e) {
          callback(e);
        }
      }, ctx.seedFileSync = defaultSeedFile;
    return ctx.collect = function(bytes) {
      var count3 = bytes.length;
      for (var i6 = 0;i6 < count3; ++i6)
        ctx.pools[ctx.pool].update(bytes.substr(i6, 1)), ctx.pool = ctx.pool === 31 ? 0 : ctx.pool + 1;
    }, ctx.collectInt = function(i6, n5) {
      var bytes = "";
      for (var x4 = 0;x4 < n5; x4 += 8)
        bytes += String.fromCharCode(i6 >> x4 & 255);
      ctx.collect(bytes);
    }, ctx.registerWorker = function(worker) {
      if (worker === self)
        ctx.seedFile = function(needed, callback) {
          function listener2(e) {
            var data = e.data;
            if (data.forge && data.forge.prng)
              self.removeEventListener("message", listener2), callback(data.forge.prng.err, data.forge.prng.bytes);
          }
          self.addEventListener("message", listener2), self.postMessage({ forge: { prng: { needed } } });
        };
      else {
        var listener = function(e) {
          var data = e.data;
          if (data.forge && data.forge.prng)
            ctx.seedFile(data.forge.prng.needed, function(err2, bytes) {
              worker.postMessage({ forge: { prng: { err: err2, bytes } } });
            });
        };
        worker.addEventListener("message", listener);
      }
    }, ctx;
  };
});
