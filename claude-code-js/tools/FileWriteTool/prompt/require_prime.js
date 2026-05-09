// var: require_prime
var require_prime = __commonJS((exports, module) => {
  var forge = require_forge();
  require_util3();
  require_jsbn();
  require_random();
  (function() {
    if (forge.prime) {
      module.exports = forge.prime;
      return;
    }
    var prime = module.exports = forge.prime = forge.prime || {}, BigInteger = forge.jsbn.BigInteger, GCD_30_DELTA = [6, 4, 2, 4, 2, 4, 6, 2], THIRTY = new BigInteger(null);
    THIRTY.fromInt(30);
    var op_or = function(x4, y2) {
      return x4 | y2;
    };
    prime.generateProbablePrime = function(bits2, options, callback) {
      if (typeof options === "function")
        callback = options, options = {};
      options = options || {};
      var algorithm = options.algorithm || "PRIMEINC";
      if (typeof algorithm === "string")
        algorithm = { name: algorithm };
      algorithm.options = algorithm.options || {};
      var prng = options.prng || forge.random, rng = {
        nextBytes: function(x4) {
          var b = prng.getBytesSync(x4.length);
          for (var i5 = 0;i5 < x4.length; ++i5)
            x4[i5] = b.charCodeAt(i5);
        }
      };
      if (algorithm.name === "PRIMEINC")
        return primeincFindPrime(bits2, rng, algorithm.options, callback);
      throw Error("Invalid prime generation algorithm: " + algorithm.name);
    };
    function primeincFindPrime(bits2, rng, options, callback) {
      if ("workers" in options)
        return primeincFindPrimeWithWorkers(bits2, rng, options, callback);
      return primeincFindPrimeWithoutWorkers(bits2, rng, options, callback);
    }
    function primeincFindPrimeWithoutWorkers(bits2, rng, options, callback) {
      var num = generateRandom(bits2, rng), deltaIdx = 0, mrTests = getMillerRabinTests(num.bitLength());
      if ("millerRabinTests" in options)
        mrTests = options.millerRabinTests;
      var maxBlockTime = 10;
      if ("maxBlockTime" in options)
        maxBlockTime = options.maxBlockTime;
      _primeinc(num, bits2, rng, deltaIdx, mrTests, maxBlockTime, callback);
    }
    function _primeinc(num, bits2, rng, deltaIdx, mrTests, maxBlockTime, callback) {
      var start = +/* @__PURE__ */ new Date;
      do {
        if (num.bitLength() > bits2)
          num = generateRandom(bits2, rng);
        if (num.isProbablePrime(mrTests))
          return callback(null, num);
        num.dAddOffset(GCD_30_DELTA[deltaIdx++ % 8], 0);
      } while (maxBlockTime < 0 || +/* @__PURE__ */ new Date - start < maxBlockTime);
      forge.util.setImmediate(function() {
        _primeinc(num, bits2, rng, deltaIdx, mrTests, maxBlockTime, callback);
      });
    }
    function primeincFindPrimeWithWorkers(bits2, rng, options, callback) {
      if (typeof Worker > "u")
        return primeincFindPrimeWithoutWorkers(bits2, rng, options, callback);
      var num = generateRandom(bits2, rng), numWorkers = options.workers, workLoad = options.workLoad || 100, range = workLoad * 30 / 8, workerScript = options.workerScript || "forge/prime.worker.js";
      if (numWorkers === -1)
        return forge.util.estimateCores(function(err2, cores) {
          if (err2)
            cores = 2;
          numWorkers = cores - 1, generate2();
        });
      generate2();
      function generate2() {
        numWorkers = Math.max(1, numWorkers);
        var workers = [];
        for (var i5 = 0;i5 < numWorkers; ++i5)
          workers[i5] = new Worker(workerScript);
        var running = numWorkers;
        for (var i5 = 0;i5 < numWorkers; ++i5)
          workers[i5].addEventListener("message", workerMessage);
        var found = !1;
        function workerMessage(e) {
          if (found)
            return;
          --running;
          var data = e.data;
          if (data.found) {
            for (var i6 = 0;i6 < workers.length; ++i6)
              workers[i6].terminate();
            return found = !0, callback(null, new BigInteger(data.prime, 16));
          }
          if (num.bitLength() > bits2)
            num = generateRandom(bits2, rng);
          var hex = num.toString(16);
          e.target.postMessage({
            hex,
            workLoad
          }), num.dAddOffset(range, 0);
        }
      }
    }
    function generateRandom(bits2, rng) {
      var num = new BigInteger(bits2, rng), bits1 = bits2 - 1;
      if (!num.testBit(bits1))
        num.bitwiseTo(BigInteger.ONE.shiftLeft(bits1), op_or, num);
      return num.dAddOffset(31 - num.mod(THIRTY).byteValue(), 0), num;
    }
    function getMillerRabinTests(bits2) {
      if (bits2 <= 100)
        return 27;
      if (bits2 <= 150)
        return 18;
      if (bits2 <= 200)
        return 15;
      if (bits2 <= 250)
        return 12;
      if (bits2 <= 300)
        return 9;
      if (bits2 <= 350)
        return 8;
      if (bits2 <= 400)
        return 7;
      if (bits2 <= 500)
        return 6;
      if (bits2 <= 600)
        return 5;
      if (bits2 <= 800)
        return 4;
      if (bits2 <= 1250)
        return 3;
      return 2;
    }
  })();
});
