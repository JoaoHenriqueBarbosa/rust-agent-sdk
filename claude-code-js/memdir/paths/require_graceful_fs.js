// var: require_graceful_fs
var require_graceful_fs = __commonJS((exports, module) => {
  var fs4 = __require("fs"), polyfills = require_polyfills(), legacy = require_legacy_streams(), clone3 = require_clone(), util6 = __require("util"), gracefulQueue, previousSymbol;
  if (typeof Symbol === "function" && typeof Symbol.for === "function")
    gracefulQueue = Symbol.for("graceful-fs.queue"), previousSymbol = Symbol.for("graceful-fs.previous");
  else
    gracefulQueue = "___graceful-fs.queue", previousSymbol = "___graceful-fs.previous";
  function noop6() {}
  function publishQueue(context, queue2) {
    Object.defineProperty(context, gracefulQueue, {
      get: function() {
        return queue2;
      }
    });
  }
  var debug = noop6;
  if (util6.debuglog)
    debug = util6.debuglog("gfs4");
  else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || ""))
    debug = function() {
      var m3 = util6.format.apply(util6, arguments);
      m3 = "GFS4: " + m3.split(/\n/).join(`
GFS4: `), console.error(m3);
    };
  if (!fs4[gracefulQueue]) {
    if (queue = global[gracefulQueue] || [], publishQueue(fs4, queue), fs4.close = function(fs$close) {
      function close(fd, cb) {
        return fs$close.call(fs4, fd, function(err) {
          if (!err)
            resetQueue();
          if (typeof cb === "function")
            cb.apply(this, arguments);
        });
      }
      return Object.defineProperty(close, previousSymbol, {
        value: fs$close
      }), close;
    }(fs4.close), fs4.closeSync = function(fs$closeSync) {
      function closeSync3(fd) {
        fs$closeSync.apply(fs4, arguments), resetQueue();
      }
      return Object.defineProperty(closeSync3, previousSymbol, {
        value: fs$closeSync
      }), closeSync3;
    }(fs4.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || ""))
      process.on("exit", function() {
        debug(fs4[gracefulQueue]), __require("assert").equal(fs4[gracefulQueue].length, 0);
      });
  }
  var queue;
  if (!global[gracefulQueue])
    publishQueue(global, fs4[gracefulQueue]);
  module.exports = patch(clone3(fs4));
  if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !fs4.__patched)
    module.exports = patch(fs4), fs4.__patched = !0;
  function patch(fs5) {
    polyfills(fs5), fs5.gracefulify = patch, fs5.createReadStream = createReadStream2, fs5.createWriteStream = createWriteStream3;
    var fs$readFile = fs5.readFile;
    fs5.readFile = readFile7;
    function readFile7(path9, options, cb) {
      if (typeof options === "function")
        cb = options, options = null;
      return go$readFile(path9, options, cb);
      function go$readFile(path10, options2, cb2, startTime) {
        return fs$readFile(path10, options2, function(err) {
          if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
            enqueue([go$readFile, [path10, options2, cb2], err, startTime || Date.now(), Date.now()]);
          else if (typeof cb2 === "function")
            cb2.apply(this, arguments);
        });
      }
    }
    var fs$writeFile = fs5.writeFile;
    fs5.writeFile = writeFile4;
    function writeFile4(path9, data, options, cb) {
      if (typeof options === "function")
        cb = options, options = null;
      return go$writeFile(path9, data, options, cb);
      function go$writeFile(path10, data2, options2, cb2, startTime) {
        return fs$writeFile(path10, data2, options2, function(err) {
          if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
            enqueue([go$writeFile, [path10, data2, options2, cb2], err, startTime || Date.now(), Date.now()]);
          else if (typeof cb2 === "function")
            cb2.apply(this, arguments);
        });
      }
    }
    var fs$appendFile = fs5.appendFile;
    if (fs$appendFile)
      fs5.appendFile = appendFile3;
    function appendFile3(path9, data, options, cb) {
      if (typeof options === "function")
        cb = options, options = null;
      return go$appendFile(path9, data, options, cb);
      function go$appendFile(path10, data2, options2, cb2, startTime) {
        return fs$appendFile(path10, data2, options2, function(err) {
          if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
            enqueue([go$appendFile, [path10, data2, options2, cb2], err, startTime || Date.now(), Date.now()]);
          else if (typeof cb2 === "function")
            cb2.apply(this, arguments);
        });
      }
    }
    var fs$copyFile = fs5.copyFile;
    if (fs$copyFile)
      fs5.copyFile = copyFile;
    function copyFile(src, dest, flags, cb) {
      if (typeof flags === "function")
        cb = flags, flags = 0;
      return go$copyFile(src, dest, flags, cb);
      function go$copyFile(src2, dest2, flags2, cb2, startTime) {
        return fs$copyFile(src2, dest2, flags2, function(err) {
          if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
            enqueue([go$copyFile, [src2, dest2, flags2, cb2], err, startTime || Date.now(), Date.now()]);
          else if (typeof cb2 === "function")
            cb2.apply(this, arguments);
        });
      }
    }
    var fs$readdir = fs5.readdir;
    fs5.readdir = readdir4;
    var noReaddirOptionVersions = /^v[0-5]\./;
    function readdir4(path9, options, cb) {
      if (typeof options === "function")
        cb = options, options = null;
      var go$readdir = noReaddirOptionVersions.test(process.version) ? function(path10, options2, cb2, startTime) {
        return fs$readdir(path10, fs$readdirCallback(path10, options2, cb2, startTime));
      } : function(path10, options2, cb2, startTime) {
        return fs$readdir(path10, options2, fs$readdirCallback(path10, options2, cb2, startTime));
      };
      return go$readdir(path9, options, cb);
      function fs$readdirCallback(path10, options2, cb2, startTime) {
        return function(err, files) {
          if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
            enqueue([
              go$readdir,
              [path10, options2, cb2],
              err,
              startTime || Date.now(),
              Date.now()
            ]);
          else {
            if (files && files.sort)
              files.sort();
            if (typeof cb2 === "function")
              cb2.call(this, err, files);
          }
        };
      }
    }
    if (process.version.substr(0, 4) === "v0.8") {
      var legStreams = legacy(fs5);
      ReadStream = legStreams.ReadStream, WriteStream = legStreams.WriteStream;
    }
    var fs$ReadStream = fs5.ReadStream;
    if (fs$ReadStream)
      ReadStream.prototype = Object.create(fs$ReadStream.prototype), ReadStream.prototype.open = ReadStream$open;
    var fs$WriteStream = fs5.WriteStream;
    if (fs$WriteStream)
      WriteStream.prototype = Object.create(fs$WriteStream.prototype), WriteStream.prototype.open = WriteStream$open;
    Object.defineProperty(fs5, "ReadStream", {
      get: function() {
        return ReadStream;
      },
      set: function(val) {
        ReadStream = val;
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(fs5, "WriteStream", {
      get: function() {
        return WriteStream;
      },
      set: function(val) {
        WriteStream = val;
      },
      enumerable: !0,
      configurable: !0
    });
    var FileReadStream = ReadStream;
    Object.defineProperty(fs5, "FileReadStream", {
      get: function() {
        return FileReadStream;
      },
      set: function(val) {
        FileReadStream = val;
      },
      enumerable: !0,
      configurable: !0
    });
    var FileWriteStream = WriteStream;
    Object.defineProperty(fs5, "FileWriteStream", {
      get: function() {
        return FileWriteStream;
      },
      set: function(val) {
        FileWriteStream = val;
      },
      enumerable: !0,
      configurable: !0
    });
    function ReadStream(path9, options) {
      if (this instanceof ReadStream)
        return fs$ReadStream.apply(this, arguments), this;
      else
        return ReadStream.apply(Object.create(ReadStream.prototype), arguments);
    }
    function ReadStream$open() {
      var that = this;
      open3(that.path, that.flags, that.mode, function(err, fd) {
        if (err) {
          if (that.autoClose)
            that.destroy();
          that.emit("error", err);
        } else
          that.fd = fd, that.emit("open", fd), that.read();
      });
    }
    function WriteStream(path9, options) {
      if (this instanceof WriteStream)
        return fs$WriteStream.apply(this, arguments), this;
      else
        return WriteStream.apply(Object.create(WriteStream.prototype), arguments);
    }
    function WriteStream$open() {
      var that = this;
      open3(that.path, that.flags, that.mode, function(err, fd) {
        if (err)
          that.destroy(), that.emit("error", err);
        else
          that.fd = fd, that.emit("open", fd);
      });
    }
    function createReadStream2(path9, options) {
      return new fs5.ReadStream(path9, options);
    }
    function createWriteStream3(path9, options) {
      return new fs5.WriteStream(path9, options);
    }
    var fs$open = fs5.open;
    fs5.open = open3;
    function open3(path9, flags, mode, cb) {
      if (typeof mode === "function")
        cb = mode, mode = null;
      return go$open(path9, flags, mode, cb);
      function go$open(path10, flags2, mode2, cb2, startTime) {
        return fs$open(path10, flags2, mode2, function(err, fd) {
          if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
            enqueue([go$open, [path10, flags2, mode2, cb2], err, startTime || Date.now(), Date.now()]);
          else if (typeof cb2 === "function")
            cb2.apply(this, arguments);
        });
      }
    }
    return fs5;
  }
  function enqueue(elem) {
    debug("ENQUEUE", elem[0].name, elem[1]), fs4[gracefulQueue].push(elem), retry5();
  }
  var retryTimer;
  function resetQueue() {
    var now = Date.now();
    for (var i4 = 0;i4 < fs4[gracefulQueue].length; ++i4)
      if (fs4[gracefulQueue][i4].length > 2)
        fs4[gracefulQueue][i4][3] = now, fs4[gracefulQueue][i4][4] = now;
    retry5();
  }
  function retry5() {
    if (clearTimeout(retryTimer), retryTimer = void 0, fs4[gracefulQueue].length === 0)
      return;
    var elem = fs4[gracefulQueue].shift(), fn = elem[0], args = elem[1], err = elem[2], startTime = elem[3], lastTime = elem[4];
    if (startTime === void 0)
      debug("RETRY", fn.name, args), fn.apply(null, args);
    else if (Date.now() - startTime >= 60000) {
      debug("TIMEOUT", fn.name, args);
      var cb = args.pop();
      if (typeof cb === "function")
        cb.call(null, err);
    } else {
      var sinceAttempt = Date.now() - lastTime, sinceStart = Math.max(lastTime - startTime, 1), desiredDelay = Math.min(sinceStart * 1.2, 100);
      if (sinceAttempt >= desiredDelay)
        debug("RETRY", fn.name, args), fn.apply(null, args.concat([startTime]));
      else
        fs4[gracefulQueue].push(elem);
    }
    if (retryTimer === void 0)
      retryTimer = setTimeout(retry5, 0);
  }
});
