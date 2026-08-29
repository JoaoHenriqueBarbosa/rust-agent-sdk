// var: init_esm17
var init_esm17 = __esm(() => {
  require2 = createRequire("/");
  try {
    Worker2 = require2("worker_threads").Worker;
  } catch (e) {}
  wk = Worker2 ? function(c3, _, msg, transfer7, cb) {
    var done = !1, w2 = new Worker2(c3 + workerAdd, { eval: !0 }).on("error", function(e) {
      return cb(e, null);
    }).on("message", function(m4) {
      return cb(null, m4);
    }).on("exit", function(c4) {
      if (c4 && !done)
        cb(Error("exited with code " + c4), null);
    });
    return w2.postMessage(msg, transfer7), w2.terminate = function() {
      return done = !0, Worker2.prototype.terminate.call(w2);
    }, w2;
  } : function(_, __, ___, ____, cb) {
    setImmediate(function() {
      return cb(Error("async operations unsupported - update to Node 12+ (or Node 10-11 with the --experimental-worker CLI flag)"), null);
    });
    var NOP = function() {};
    return {
      terminate: NOP,
      postMessage: NOP
    };
  }, u8 = Uint8Array, u16 = Uint16Array, i32 = Int32Array, fleb = new u8([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0, 0]), fdeb = new u8([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 0, 0]), clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]), _a2 = freb(fleb, 2), fl = _a2.b, revfl = _a2.r;
  fl[28] = 258, revfl[258] = 28;
  _b = freb(fdeb, 0), fd = _b.b, revfd = _b.r, rev = new u16(32768);
  for (i4 = 0;i4 < 32768; ++i4)
    x3 = (i4 & 43690) >> 1 | (i4 & 21845) << 1, x3 = (x3 & 52428) >> 2 | (x3 & 13107) << 2, x3 = (x3 & 61680) >> 4 | (x3 & 3855) << 4, rev[i4] = ((x3 & 65280) >> 8 | (x3 & 255) << 8) >> 1;
  flt = new u8(288);
  for (i4 = 0;i4 < 144; ++i4)
    flt[i4] = 8;
  for (i4 = 144;i4 < 256; ++i4)
    flt[i4] = 9;
  for (i4 = 256;i4 < 280; ++i4)
    flt[i4] = 7;
  for (i4 = 280;i4 < 288; ++i4)
    flt[i4] = 8;
  fdt = new u8(32);
  for (i4 = 0;i4 < 32; ++i4)
    fdt[i4] = 5;
  flm = /* @__PURE__ */ hMap(flt, 9, 0), flrm = /* @__PURE__ */ hMap(flt, 9, 1), fdm = /* @__PURE__ */ hMap(fdt, 5, 0), fdrm = /* @__PURE__ */ hMap(fdt, 5, 1), FlateErrorCode = {
    UnexpectedEOF: 0,
    InvalidBlockType: 1,
    InvalidLengthLiteral: 2,
    InvalidDistance: 3,
    StreamFinished: 4,
    NoStreamHandler: 5,
    InvalidHeader: 6,
    NoCallback: 7,
    InvalidUTF8: 8,
    ExtraFieldTooLong: 9,
    InvalidDate: 10,
    FilenameTooLong: 11,
    StreamFinishing: 12,
    InvalidZipData: 13,
    UnknownCompressionMethod: 14
  }, ec = [
    "unexpected EOF",
    "invalid block type",
    "invalid length/literal",
    "invalid distance",
    "stream finished",
    "no stream handler",
    ,
    "no callback",
    "invalid UTF-8 data",
    "extra field too long",
    "date not in range 1980-2099",
    "filename too long",
    "stream finishing",
    "invalid zip data"
  ], deo = /* @__PURE__ */ new i32([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]), et = /* @__PURE__ */ new u8(0), crct = /* @__PURE__ */ function() {
    var t2 = new Int32Array(256);
    for (var i5 = 0;i5 < 256; ++i5) {
      var c3 = i5, k3 = 9;
      while (--k3)
        c3 = (c3 & 1 && -306674912) ^ c3 >>> 1;
      t2[i5] = c3;
    }
    return t2;
  }(), ch = [];
  Deflate = /* @__PURE__ */ function() {
    function Deflate2(opts, cb) {
      if (typeof opts == "function")
        cb = opts, opts = {};
      if (this.ondata = cb, this.o = opts || {}, this.s = { l: 0, i: 32768, w: 32768, z: 32768 }, this.b = new u8(98304), this.o.dictionary) {
        var dict = this.o.dictionary.subarray(-32768);
        this.b.set(dict, 32768 - dict.length), this.s.i = 32768 - dict.length;
      }
    }
    return Deflate2.prototype.p = function(c3, f) {
      this.ondata(dopt(c3, this.o, 0, 0, this.s), f);
    }, Deflate2.prototype.push = function(chunk, final) {
      if (!this.ondata)
        err(5);
      if (this.s.l)
        err(4);
      var endLen = chunk.length + this.s.z;
      if (endLen > this.b.length) {
        if (endLen > 2 * this.b.length - 32768) {
          var newBuf = new u8(endLen & -32768);
          newBuf.set(this.b.subarray(0, this.s.z)), this.b = newBuf;
        }
        var split2 = this.b.length - this.s.z;
        this.b.set(chunk.subarray(0, split2), this.s.z), this.s.z = this.b.length, this.p(this.b, !1), this.b.set(this.b.subarray(-32768)), this.b.set(chunk.subarray(split2), 32768), this.s.z = chunk.length - split2 + 32768, this.s.i = 32766, this.s.w = 32768;
      } else
        this.b.set(chunk, this.s.z), this.s.z += chunk.length;
      if (this.s.l = final & 1, this.s.z > this.s.w + 8191 || final)
        this.p(this.b, final || !1), this.s.w = this.s.i, this.s.i -= 2;
    }, Deflate2.prototype.flush = function() {
      if (!this.ondata)
        err(5);
      if (this.s.l)
        err(4);
      this.p(this.b, !1), this.s.w = this.s.i, this.s.i -= 2;
    }, Deflate2;
  }(), AsyncDeflate = /* @__PURE__ */ function() {
    function AsyncDeflate2(opts, cb) {
      astrmify([
        bDflt,
        function() {
          return [astrm, Deflate];
        }
      ], this, StrmOpt.call(this, opts, cb), function(ev) {
        var strm = new Deflate(ev.data);
        onmessage = astrm(strm);
      }, 6, 1);
    }
    return AsyncDeflate2;
  }();
  Inflate = /* @__PURE__ */ function() {
    function Inflate2(opts, cb) {
      if (typeof opts == "function")
        cb = opts, opts = {};
      this.ondata = cb;
      var dict = opts && opts.dictionary && opts.dictionary.subarray(-32768);
      if (this.s = { i: 0, b: dict ? dict.length : 0 }, this.o = new u8(32768), this.p = new u8(0), dict)
        this.o.set(dict);
    }
    return Inflate2.prototype.e = function(c3) {
      if (!this.ondata)
        err(5);
      if (this.d)
        err(4);
      if (!this.p.length)
        this.p = c3;
      else if (c3.length) {
        var n5 = new u8(this.p.length + c3.length);
        n5.set(this.p), n5.set(c3, this.p.length), this.p = n5;
      }
    }, Inflate2.prototype.c = function(final) {
      this.s.i = +(this.d = final || !1);
      var bts = this.s.b, dt = inflt(this.p, this.s, this.o);
      this.ondata(slc(dt, bts, this.s.b), this.d), this.o = slc(dt, this.s.b - 32768), this.s.b = this.o.length, this.p = slc(this.p, this.s.p / 8 | 0), this.s.p &= 7;
    }, Inflate2.prototype.push = function(chunk, final) {
      this.e(chunk), this.c(final);
    }, Inflate2;
  }(), AsyncInflate = /* @__PURE__ */ function() {
    function AsyncInflate2(opts, cb) {
      astrmify([
        bInflt,
        function() {
          return [astrm, Inflate];
        }
      ], this, StrmOpt.call(this, opts, cb), function(ev) {
        var strm = new Inflate(ev.data);
        onmessage = astrm(strm);
      }, 7, 0);
    }
    return AsyncInflate2;
  }();
  Gzip = /* @__PURE__ */ function() {
    function Gzip2(opts, cb) {
      this.c = crc(), this.l = 0, this.v = 1, Deflate.call(this, opts, cb);
    }
    return Gzip2.prototype.push = function(chunk, final) {
      this.c.p(chunk), this.l += chunk.length, Deflate.prototype.push.call(this, chunk, final);
    }, Gzip2.prototype.p = function(c3, f) {
      var raw = dopt(c3, this.o, this.v && gzhl(this.o), f && 8, this.s);
      if (this.v)
        gzh(raw, this.o), this.v = 0;
      if (f)
        wbytes(raw, raw.length - 8, this.c.d()), wbytes(raw, raw.length - 4, this.l);
      this.ondata(raw, f);
    }, Gzip2.prototype.flush = function() {
      Deflate.prototype.flush.call(this);
    }, Gzip2;
  }(), AsyncGzip = /* @__PURE__ */ function() {
    function AsyncGzip2(opts, cb) {
      astrmify([
        bDflt,
        gze,
        function() {
          return [astrm, Deflate, Gzip];
        }
      ], this, StrmOpt.call(this, opts, cb), function(ev) {
        var strm = new Gzip(ev.data);
        onmessage = astrm(strm);
      }, 8, 1);
    }
    return AsyncGzip2;
  }();
  Gunzip = /* @__PURE__ */ function() {
    function Gunzip2(opts, cb) {
      this.v = 1, this.r = 0, Inflate.call(this, opts, cb);
    }
    return Gunzip2.prototype.push = function(chunk, final) {
      if (Inflate.prototype.e.call(this, chunk), this.r += chunk.length, this.v) {
        var p4 = this.p.subarray(this.v - 1), s2 = p4.length > 3 ? gzs(p4) : 4;
        if (s2 > p4.length) {
          if (!final)
            return;
        } else if (this.v > 1 && this.onmember)
          this.onmember(this.r - p4.length);
        this.p = p4.subarray(s2), this.v = 0;
      }
      if (Inflate.prototype.c.call(this, final), this.s.f && !this.s.l && !final)
        this.v = shft(this.s.p) + 9, this.s = { i: 0 }, this.o = new u8(0), this.push(new u8(0), final);
    }, Gunzip2;
  }(), AsyncGunzip = /* @__PURE__ */ function() {
    function AsyncGunzip2(opts, cb) {
      var _this = this;
      astrmify([
        bInflt,
        guze,
        function() {
          return [astrm, Inflate, Gunzip];
        }
      ], this, StrmOpt.call(this, opts, cb), function(ev) {
        var strm = new Gunzip(ev.data);
        strm.onmember = function(offset) {
          return postMessage(offset);
        }, onmessage = astrm(strm);
      }, 9, 0, function(offset) {
        return _this.onmember && _this.onmember(offset);
      });
    }
    return AsyncGunzip2;
  }();
  Zlib = /* @__PURE__ */ function() {
    function Zlib2(opts, cb) {
      this.c = adler(), this.v = 1, Deflate.call(this, opts, cb);
    }
    return Zlib2.prototype.push = function(chunk, final) {
      this.c.p(chunk), Deflate.prototype.push.call(this, chunk, final);
    }, Zlib2.prototype.p = function(c3, f) {
      var raw = dopt(c3, this.o, this.v && (this.o.dictionary ? 6 : 2), f && 4, this.s);
      if (this.v)
        zlh(raw, this.o), this.v = 0;
      if (f)
        wbytes(raw, raw.length - 4, this.c.d());
      this.ondata(raw, f);
    }, Zlib2.prototype.flush = function() {
      Deflate.prototype.flush.call(this);
    }, Zlib2;
  }(), AsyncZlib = /* @__PURE__ */ function() {
    function AsyncZlib2(opts, cb) {
      astrmify([
        bDflt,
        zle,
        function() {
          return [astrm, Deflate, Zlib];
        }
      ], this, StrmOpt.call(this, opts, cb), function(ev) {
        var strm = new Zlib(ev.data);
        onmessage = astrm(strm);
      }, 10, 1);
    }
    return AsyncZlib2;
  }();
  Unzlib = /* @__PURE__ */ function() {
    function Unzlib2(opts, cb) {
      Inflate.call(this, opts, cb), this.v = opts && opts.dictionary ? 2 : 1;
    }
    return Unzlib2.prototype.push = function(chunk, final) {
      if (Inflate.prototype.e.call(this, chunk), this.v) {
        if (this.p.length < 6 && !final)
          return;
        this.p = this.p.subarray(zls(this.p, this.v - 1)), this.v = 0;
      }
      if (final) {
        if (this.p.length < 4)
          err(6, "invalid zlib data");
        this.p = this.p.subarray(0, -4);
      }
      Inflate.prototype.c.call(this, final);
    }, Unzlib2;
  }(), AsyncUnzlib = /* @__PURE__ */ function() {
    function AsyncUnzlib2(opts, cb) {
      astrmify([
        bInflt,
        zule,
        function() {
          return [astrm, Inflate, Unzlib];
        }
      ], this, StrmOpt.call(this, opts, cb), function(ev) {
        var strm = new Unzlib(ev.data);
        onmessage = astrm(strm);
      }, 11, 0);
    }
    return AsyncUnzlib2;
  }();
  Decompress = /* @__PURE__ */ function() {
    function Decompress2(opts, cb) {
      this.o = StrmOpt.call(this, opts, cb) || {}, this.G = Gunzip, this.I = Inflate, this.Z = Unzlib;
    }
    return Decompress2.prototype.i = function() {
      var _this = this;
      this.s.ondata = function(dat, final) {
        _this.ondata(dat, final);
      };
    }, Decompress2.prototype.push = function(chunk, final) {
      if (!this.ondata)
        err(5);
      if (!this.s) {
        if (this.p && this.p.length) {
          var n5 = new u8(this.p.length + chunk.length);
          n5.set(this.p), n5.set(chunk, this.p.length);
        } else
          this.p = chunk;
        if (this.p.length > 2)
          this.s = this.p[0] == 31 && this.p[1] == 139 && this.p[2] == 8 ? new this.G(this.o) : (this.p[0] & 15) != 8 || this.p[0] >> 4 > 7 || (this.p[0] << 8 | this.p[1]) % 31 ? new this.I(this.o) : new this.Z(this.o), this.i(), this.s.push(this.p, final), this.p = null;
      } else
        this.s.push(chunk, final);
    }, Decompress2;
  }(), AsyncDecompress = /* @__PURE__ */ function() {
    function AsyncDecompress2(opts, cb) {
      Decompress.call(this, opts, cb), this.queuedSize = 0, this.G = AsyncGunzip, this.I = AsyncInflate, this.Z = AsyncUnzlib;
    }
    return AsyncDecompress2.prototype.i = function() {
      var _this = this;
      this.s.ondata = function(err2, dat, final) {
        _this.ondata(err2, dat, final);
      }, this.s.ondrain = function(size) {
        if (_this.queuedSize -= size, _this.ondrain)
          _this.ondrain(size);
      };
    }, AsyncDecompress2.prototype.push = function(chunk, final) {
      this.queuedSize += chunk.length, Decompress.prototype.push.call(this, chunk, final);
    }, AsyncDecompress2;
  }();
  te = typeof TextEncoder < "u" && /* @__PURE__ */ new TextEncoder, td = typeof TextDecoder < "u" && /* @__PURE__ */ new TextDecoder;
  try {
    td.decode(et, { stream: !0 }), tds = 1;
  } catch (e) {}
  DecodeUTF8 = /* @__PURE__ */ function() {
    function DecodeUTF82(cb) {
      if (this.ondata = cb, tds)
        this.t = /* @__PURE__ */ new TextDecoder;
      else
        this.p = et;
    }
    return DecodeUTF82.prototype.push = function(chunk, final) {
      if (!this.ondata)
        err(5);
      if (final = !!final, this.t) {
        if (this.ondata(this.t.decode(chunk, { stream: !0 }), final), final) {
          if (this.t.decode().length)
            err(8);
          this.t = null;
        }
        return;
      }
      if (!this.p)
        err(4);
      var dat = new u8(this.p.length + chunk.length);
      dat.set(this.p), dat.set(chunk, this.p.length);
      var _a3 = dutf8(dat), s2 = _a3.s, r4 = _a3.r;
      if (final) {
        if (r4.length)
          err(8);
        this.p = null;
      } else
        this.p = r4;
      this.ondata(s2, final);
    }, DecodeUTF82;
  }(), EncodeUTF8 = /* @__PURE__ */ function() {
    function EncodeUTF82(cb) {
      this.ondata = cb;
    }
    return EncodeUTF82.prototype.push = function(chunk, final) {
      if (!this.ondata)
        err(5);
      if (this.d)
        err(4);
      this.ondata(strToU8(chunk), this.d = final || !1);
    }, EncodeUTF82;
  }();
  ZipPassThrough = /* @__PURE__ */ function() {
    function ZipPassThrough2(filename) {
      this.filename = filename, this.c = crc(), this.size = 0, this.compression = 0;
    }
    return ZipPassThrough2.prototype.process = function(chunk, final) {
      this.ondata(null, chunk, final);
    }, ZipPassThrough2.prototype.push = function(chunk, final) {
      if (!this.ondata)
        err(5);
      if (this.c.p(chunk), this.size += chunk.length, final)
        this.crc = this.c.d();
      this.process(chunk, final || !1);
    }, ZipPassThrough2;
  }(), ZipDeflate = /* @__PURE__ */ function() {
    function ZipDeflate2(filename, opts) {
      var _this = this;
      if (!opts)
        opts = {};
      ZipPassThrough.call(this, filename), this.d = new Deflate(opts, function(dat, final) {
        _this.ondata(null, dat, final);
      }), this.compression = 8, this.flag = dbf(opts.level);
    }
    return ZipDeflate2.prototype.process = function(chunk, final) {
      try {
        this.d.push(chunk, final);
      } catch (e) {
        this.ondata(e, null, final);
      }
    }, ZipDeflate2.prototype.push = function(chunk, final) {
      ZipPassThrough.prototype.push.call(this, chunk, final);
    }, ZipDeflate2;
  }(), AsyncZipDeflate = /* @__PURE__ */ function() {
    function AsyncZipDeflate2(filename, opts) {
      var _this = this;
      if (!opts)
        opts = {};
      ZipPassThrough.call(this, filename), this.d = new AsyncDeflate(opts, function(err2, dat, final) {
        _this.ondata(err2, dat, final);
      }), this.compression = 8, this.flag = dbf(opts.level), this.terminate = this.d.terminate;
    }
    return AsyncZipDeflate2.prototype.process = function(chunk, final) {
      this.d.push(chunk, final);
    }, AsyncZipDeflate2.prototype.push = function(chunk, final) {
      ZipPassThrough.prototype.push.call(this, chunk, final);
    }, AsyncZipDeflate2;
  }(), Zip = /* @__PURE__ */ function() {
    function Zip2(cb) {
      this.ondata = cb, this.u = [], this.d = 1;
    }
    return Zip2.prototype.add = function(file2) {
      var _this = this;
      if (!this.ondata)
        err(5);
      if (this.d & 2)
        this.ondata(err(4 + (this.d & 1) * 8, 0, 1), null, !1);
      else {
        var f = strToU8(file2.filename), fl_1 = f.length, com = file2.comment, o5 = com && strToU8(com), u5 = fl_1 != file2.filename.length || o5 && com.length != o5.length, hl_1 = fl_1 + exfl(file2.extra) + 30;
        if (fl_1 > 65535)
          this.ondata(err(11, 0, 1), null, !1);
        var header = new u8(hl_1);
        wzh(header, 0, file2, f, u5, -1);
        var chks_1 = [header], pAll_1 = function() {
          for (var _i = 0, chks_2 = chks_1;_i < chks_2.length; _i++) {
            var chk = chks_2[_i];
            _this.ondata(null, chk, !1);
          }
          chks_1 = [];
        }, tr_1 = this.d;
        this.d = 0;
        var ind_1 = this.u.length, uf_1 = mrg(file2, {
          f,
          u: u5,
          o: o5,
          t: function() {
            if (file2.terminate)
              file2.terminate();
          },
          r: function() {
            if (pAll_1(), tr_1) {
              var nxt = _this.u[ind_1 + 1];
              if (nxt)
                nxt.r();
              else
                _this.d = 1;
            }
            tr_1 = 1;
          }
        }), cl_1 = 0;
        file2.ondata = function(err2, dat, final) {
          if (err2)
            _this.ondata(err2, dat, final), _this.terminate();
          else if (cl_1 += dat.length, chks_1.push(dat), final) {
            var dd = new u8(16);
            if (wbytes(dd, 0, 134695760), wbytes(dd, 4, file2.crc), wbytes(dd, 8, cl_1), wbytes(dd, 12, file2.size), chks_1.push(dd), uf_1.c = cl_1, uf_1.b = hl_1 + cl_1 + 16, uf_1.crc = file2.crc, uf_1.size = file2.size, tr_1)
              uf_1.r();
            tr_1 = 1;
          } else if (tr_1)
            pAll_1();
        }, this.u.push(uf_1);
      }
    }, Zip2.prototype.end = function() {
      var _this = this;
      if (this.d & 2) {
        this.ondata(err(4 + (this.d & 1) * 8, 0, 1), null, !0);
        return;
      }
      if (this.d)
        this.e();
      else
        this.u.push({
          r: function() {
            if (!(_this.d & 1))
              return;
            _this.u.splice(-1, 1), _this.e();
          },
          t: function() {}
        });
      this.d = 3;
    }, Zip2.prototype.e = function() {
      var bt = 0, l3 = 0, tl = 0;
      for (var _i = 0, _a3 = this.u;_i < _a3.length; _i++) {
        var f = _a3[_i];
        tl += 46 + f.f.length + exfl(f.extra) + (f.o ? f.o.length : 0);
      }
      var out = new u8(tl + 22);
      for (var _b2 = 0, _c19 = this.u;_b2 < _c19.length; _b2++) {
        var f = _c19[_b2];
        wzh(out, bt, f, f.f, f.u, -f.c - 2, l3, f.o), bt += 46 + f.f.length + exfl(f.extra) + (f.o ? f.o.length : 0), l3 += f.b;
      }
      wzf(out, bt, this.u.length, tl, l3), this.ondata(null, out, !0), this.d = 2;
    }, Zip2.prototype.terminate = function() {
      for (var _i = 0, _a3 = this.u;_i < _a3.length; _i++) {
        var f = _a3[_i];
        f.t();
      }
      this.d = 2;
    }, Zip2;
  }();
  UnzipPassThrough = /* @__PURE__ */ function() {
    function UnzipPassThrough2() {}
    return UnzipPassThrough2.prototype.push = function(data, final) {
      this.ondata(null, data, final);
    }, UnzipPassThrough2.compression = 0, UnzipPassThrough2;
  }(), UnzipInflate = /* @__PURE__ */ function() {
    function UnzipInflate2() {
      var _this = this;
      this.i = new Inflate(function(dat, final) {
        _this.ondata(null, dat, final);
      });
    }
    return UnzipInflate2.prototype.push = function(data, final) {
      try {
        this.i.push(data, final);
      } catch (e) {
        this.ondata(e, null, final);
      }
    }, UnzipInflate2.compression = 8, UnzipInflate2;
  }(), AsyncUnzipInflate = /* @__PURE__ */ function() {
    function AsyncUnzipInflate2(_, sz) {
      var _this = this;
      if (sz < 320000)
        this.i = new Inflate(function(dat, final) {
          _this.ondata(null, dat, final);
        });
      else
        this.i = new AsyncInflate(function(err2, dat, final) {
          _this.ondata(err2, dat, final);
        }), this.terminate = this.i.terminate;
    }
    return AsyncUnzipInflate2.prototype.push = function(data, final) {
      if (this.i.terminate)
        data = slc(data, 0);
      this.i.push(data, final);
    }, AsyncUnzipInflate2.compression = 8, AsyncUnzipInflate2;
  }(), Unzip = /* @__PURE__ */ function() {
    function Unzip2(cb) {
      this.onfile = cb, this.k = [], this.o = {
        0: UnzipPassThrough
      }, this.p = et;
    }
    return Unzip2.prototype.push = function(chunk, final) {
      var _this = this;
      if (!this.onfile)
        err(5);
      if (!this.p)
        err(4);
      if (this.c > 0) {
        var len = Math.min(this.c, chunk.length), toAdd = chunk.subarray(0, len);
        if (this.c -= len, this.d)
          this.d.push(toAdd, !this.c);
        else
          this.k[0].push(toAdd);
        if (chunk = chunk.subarray(len), chunk.length)
          return this.push(chunk, final);
      } else {
        var f = 0, i5 = 0, is = void 0, buf = void 0;
        if (!this.p.length)
          buf = chunk;
        else if (!chunk.length)
          buf = this.p;
        else
          buf = new u8(this.p.length + chunk.length), buf.set(this.p), buf.set(chunk, this.p.length);
        var l3 = buf.length, oc = this.c, add = oc && this.d, _loop_2 = function() {
          var _a3, sig = b4(buf, i5);
          if (sig == 67324752) {
            f = 1, is = i5, this_1.d = null, this_1.c = 0;
            var bf = b2(buf, i5 + 6), cmp_1 = b2(buf, i5 + 8), u5 = bf & 2048, dd = bf & 8, fnl = b2(buf, i5 + 26), es = b2(buf, i5 + 28);
            if (l3 > i5 + 30 + fnl + es) {
              var chks_3 = [];
              this_1.k.unshift(chks_3), f = 2;
              var sc_1 = b4(buf, i5 + 18), su_1 = b4(buf, i5 + 22), fn_1 = strFromU8(buf.subarray(i5 + 30, i5 += 30 + fnl), !u5);
              if (sc_1 == 4294967295)
                _a3 = dd ? [-2] : z64e(buf, i5), sc_1 = _a3[0], su_1 = _a3[1];
              else if (dd)
                sc_1 = -1;
              i5 += es, this_1.c = sc_1;
              var d_1, file_1 = {
                name: fn_1,
                compression: cmp_1,
                start: function() {
                  if (!file_1.ondata)
                    err(5);
                  if (!sc_1)
                    file_1.ondata(null, et, !0);
                  else {
                    var ctr = _this.o[cmp_1];
                    if (!ctr)
                      file_1.ondata(err(14, "unknown compression type " + cmp_1, 1), null, !1);
                    d_1 = sc_1 < 0 ? new ctr(fn_1) : new ctr(fn_1, sc_1, su_1), d_1.ondata = function(err2, dat3, final2) {
                      file_1.ondata(err2, dat3, final2);
                    };
                    for (var _i = 0, chks_4 = chks_3;_i < chks_4.length; _i++) {
                      var dat2 = chks_4[_i];
                      d_1.push(dat2, !1);
                    }
                    if (_this.k[0] == chks_3 && _this.c)
                      _this.d = d_1;
                    else
                      d_1.push(et, !0);
                  }
                },
                terminate: function() {
                  if (d_1 && d_1.terminate)
                    d_1.terminate();
                }
              };
              if (sc_1 >= 0)
                file_1.size = sc_1, file_1.originalSize = su_1;
              this_1.onfile(file_1);
            }
            return "break";
          } else if (oc) {
            if (sig == 134695760)
              return is = i5 += 12 + (oc == -2 && 8), f = 3, this_1.c = 0, "break";
            else if (sig == 33639248)
              return is = i5 -= 4, f = 3, this_1.c = 0, "break";
          }
        }, this_1 = this;
        for (;i5 < l3 - 4; ++i5) {
          var state_1 = _loop_2();
          if (state_1 === "break")
            break;
        }
        if (this.p = et, oc < 0) {
          var dat = f ? buf.subarray(0, is - 12 - (oc == -2 && 8) - (b4(buf, is - 16) == 134695760 && 4)) : buf.subarray(0, i5);
          if (add)
            add.push(dat, !!f);
          else
            this.k[+(f == 2)].push(dat);
        }
        if (f & 2)
          return this.push(buf.subarray(i5), final);
        this.p = buf.subarray(i5);
      }
      if (final) {
        if (this.c)
          err(13);
        this.p = null;
      }
    }, Unzip2.prototype.register = function(decoder) {
      this.o[decoder.compression] = decoder;
    }, Unzip2;
  }(), mt = typeof queueMicrotask == "function" ? queueMicrotask : typeof setTimeout == "function" ? setTimeout : function(fn) {
    fn();
  };
});
