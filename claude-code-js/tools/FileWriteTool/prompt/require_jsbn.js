// var: require_jsbn
var require_jsbn = __commonJS((exports, module) => {
  var forge = require_forge();
  module.exports = forge.jsbn = forge.jsbn || {};
  var dbits, canary = 244837814094590, j_lm = (canary & 16777215) == 15715070;
  function BigInteger(a2, b, c3) {
    if (this.data = [], a2 != null)
      if (typeof a2 == "number")
        this.fromNumber(a2, b, c3);
      else if (b == null && typeof a2 != "string")
        this.fromString(a2, 256);
      else
        this.fromString(a2, b);
  }
  forge.jsbn.BigInteger = BigInteger;
  function nbi() {
    return new BigInteger(null);
  }
  function am1(i5, x4, w2, j4, c3, n5) {
    while (--n5 >= 0) {
      var v2 = x4 * this.data[i5++] + w2.data[j4] + c3;
      c3 = Math.floor(v2 / 67108864), w2.data[j4++] = v2 & 67108863;
    }
    return c3;
  }
  function am2(i5, x4, w2, j4, c3, n5) {
    var xl = x4 & 32767, xh = x4 >> 15;
    while (--n5 >= 0) {
      var l3 = this.data[i5] & 32767, h4 = this.data[i5++] >> 15, m4 = xh * l3 + h4 * xl;
      l3 = xl * l3 + ((m4 & 32767) << 15) + w2.data[j4] + (c3 & 1073741823), c3 = (l3 >>> 30) + (m4 >>> 15) + xh * h4 + (c3 >>> 30), w2.data[j4++] = l3 & 1073741823;
    }
    return c3;
  }
  function am3(i5, x4, w2, j4, c3, n5) {
    var xl = x4 & 16383, xh = x4 >> 14;
    while (--n5 >= 0) {
      var l3 = this.data[i5] & 16383, h4 = this.data[i5++] >> 14, m4 = xh * l3 + h4 * xl;
      l3 = xl * l3 + ((m4 & 16383) << 14) + w2.data[j4] + c3, c3 = (l3 >> 28) + (m4 >> 14) + xh * h4, w2.data[j4++] = l3 & 268435455;
    }
    return c3;
  }
  if (typeof navigator > "u")
    BigInteger.prototype.am = am3, dbits = 28;
  else if (j_lm && navigator.appName == "Microsoft Internet Explorer")
    BigInteger.prototype.am = am2, dbits = 30;
  else if (j_lm && navigator.appName != "Netscape")
    BigInteger.prototype.am = am1, dbits = 26;
  else
    BigInteger.prototype.am = am3, dbits = 28;
  BigInteger.prototype.DB = dbits;
  BigInteger.prototype.DM = (1 << dbits) - 1;
  BigInteger.prototype.DV = 1 << dbits;
  var BI_FP = 52;
  BigInteger.prototype.FV = Math.pow(2, BI_FP);
  BigInteger.prototype.F1 = BI_FP - dbits;
  BigInteger.prototype.F2 = 2 * dbits - BI_FP;
  var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz", BI_RC = [], rr, vv;
  rr = 48;
  for (vv = 0;vv <= 9; ++vv)
    BI_RC[rr++] = vv;
  rr = 97;
  for (vv = 10;vv < 36; ++vv)
    BI_RC[rr++] = vv;
  rr = 65;
  for (vv = 10;vv < 36; ++vv)
    BI_RC[rr++] = vv;
  function int2char(n5) {
    return BI_RM.charAt(n5);
  }
  function intAt(s2, i5) {
    var c3 = BI_RC[s2.charCodeAt(i5)];
    return c3 == null ? -1 : c3;
  }
  function bnpCopyTo(r4) {
    for (var i5 = this.t - 1;i5 >= 0; --i5)
      r4.data[i5] = this.data[i5];
    r4.t = this.t, r4.s = this.s;
  }
  function bnpFromInt(x4) {
    if (this.t = 1, this.s = x4 < 0 ? -1 : 0, x4 > 0)
      this.data[0] = x4;
    else if (x4 < -1)
      this.data[0] = x4 + this.DV;
    else
      this.t = 0;
  }
  function nbv(i5) {
    var r4 = nbi();
    return r4.fromInt(i5), r4;
  }
  function bnpFromString(s2, b) {
    var k3;
    if (b == 16)
      k3 = 4;
    else if (b == 8)
      k3 = 3;
    else if (b == 256)
      k3 = 8;
    else if (b == 2)
      k3 = 1;
    else if (b == 32)
      k3 = 5;
    else if (b == 4)
      k3 = 2;
    else {
      this.fromRadix(s2, b);
      return;
    }
    this.t = 0, this.s = 0;
    var i5 = s2.length, mi = !1, sh = 0;
    while (--i5 >= 0) {
      var x4 = k3 == 8 ? s2[i5] & 255 : intAt(s2, i5);
      if (x4 < 0) {
        if (s2.charAt(i5) == "-")
          mi = !0;
        continue;
      }
      if (mi = !1, sh == 0)
        this.data[this.t++] = x4;
      else if (sh + k3 > this.DB)
        this.data[this.t - 1] |= (x4 & (1 << this.DB - sh) - 1) << sh, this.data[this.t++] = x4 >> this.DB - sh;
      else
        this.data[this.t - 1] |= x4 << sh;
      if (sh += k3, sh >= this.DB)
        sh -= this.DB;
    }
    if (k3 == 8 && (s2[0] & 128) != 0) {
      if (this.s = -1, sh > 0)
        this.data[this.t - 1] |= (1 << this.DB - sh) - 1 << sh;
    }
    if (this.clamp(), mi)
      BigInteger.ZERO.subTo(this, this);
  }
  function bnpClamp() {
    var c3 = this.s & this.DM;
    while (this.t > 0 && this.data[this.t - 1] == c3)
      --this.t;
  }
  function bnToString(b) {
    if (this.s < 0)
      return "-" + this.negate().toString(b);
    var k3;
    if (b == 16)
      k3 = 4;
    else if (b == 8)
      k3 = 3;
    else if (b == 2)
      k3 = 1;
    else if (b == 32)
      k3 = 5;
    else if (b == 4)
      k3 = 2;
    else
      return this.toRadix(b);
    var km = (1 << k3) - 1, d, m4 = !1, r4 = "", i5 = this.t, p4 = this.DB - i5 * this.DB % k3;
    if (i5-- > 0) {
      if (p4 < this.DB && (d = this.data[i5] >> p4) > 0)
        m4 = !0, r4 = int2char(d);
      while (i5 >= 0) {
        if (p4 < k3)
          d = (this.data[i5] & (1 << p4) - 1) << k3 - p4, d |= this.data[--i5] >> (p4 += this.DB - k3);
        else if (d = this.data[i5] >> (p4 -= k3) & km, p4 <= 0)
          p4 += this.DB, --i5;
        if (d > 0)
          m4 = !0;
        if (m4)
          r4 += int2char(d);
      }
    }
    return m4 ? r4 : "0";
  }
  function bnNegate() {
    var r4 = nbi();
    return BigInteger.ZERO.subTo(this, r4), r4;
  }
  function bnAbs() {
    return this.s < 0 ? this.negate() : this;
  }
  function bnCompareTo(a2) {
    var r4 = this.s - a2.s;
    if (r4 != 0)
      return r4;
    var i5 = this.t;
    if (r4 = i5 - a2.t, r4 != 0)
      return this.s < 0 ? -r4 : r4;
    while (--i5 >= 0)
      if ((r4 = this.data[i5] - a2.data[i5]) != 0)
        return r4;
    return 0;
  }
  function nbits(x4) {
    var r4 = 1, t2;
    if ((t2 = x4 >>> 16) != 0)
      x4 = t2, r4 += 16;
    if ((t2 = x4 >> 8) != 0)
      x4 = t2, r4 += 8;
    if ((t2 = x4 >> 4) != 0)
      x4 = t2, r4 += 4;
    if ((t2 = x4 >> 2) != 0)
      x4 = t2, r4 += 2;
    if ((t2 = x4 >> 1) != 0)
      x4 = t2, r4 += 1;
    return r4;
  }
  function bnBitLength() {
    if (this.t <= 0)
      return 0;
    return this.DB * (this.t - 1) + nbits(this.data[this.t - 1] ^ this.s & this.DM);
  }
  function bnpDLShiftTo(n5, r4) {
    var i5;
    for (i5 = this.t - 1;i5 >= 0; --i5)
      r4.data[i5 + n5] = this.data[i5];
    for (i5 = n5 - 1;i5 >= 0; --i5)
      r4.data[i5] = 0;
    r4.t = this.t + n5, r4.s = this.s;
  }
  function bnpDRShiftTo(n5, r4) {
    for (var i5 = n5;i5 < this.t; ++i5)
      r4.data[i5 - n5] = this.data[i5];
    r4.t = Math.max(this.t - n5, 0), r4.s = this.s;
  }
  function bnpLShiftTo(n5, r4) {
    var bs = n5 % this.DB, cbs = this.DB - bs, bm = (1 << cbs) - 1, ds = Math.floor(n5 / this.DB), c3 = this.s << bs & this.DM, i5;
    for (i5 = this.t - 1;i5 >= 0; --i5)
      r4.data[i5 + ds + 1] = this.data[i5] >> cbs | c3, c3 = (this.data[i5] & bm) << bs;
    for (i5 = ds - 1;i5 >= 0; --i5)
      r4.data[i5] = 0;
    r4.data[ds] = c3, r4.t = this.t + ds + 1, r4.s = this.s, r4.clamp();
  }
  function bnpRShiftTo(n5, r4) {
    r4.s = this.s;
    var ds = Math.floor(n5 / this.DB);
    if (ds >= this.t) {
      r4.t = 0;
      return;
    }
    var bs = n5 % this.DB, cbs = this.DB - bs, bm = (1 << bs) - 1;
    r4.data[0] = this.data[ds] >> bs;
    for (var i5 = ds + 1;i5 < this.t; ++i5)
      r4.data[i5 - ds - 1] |= (this.data[i5] & bm) << cbs, r4.data[i5 - ds] = this.data[i5] >> bs;
    if (bs > 0)
      r4.data[this.t - ds - 1] |= (this.s & bm) << cbs;
    r4.t = this.t - ds, r4.clamp();
  }
  function bnpSubTo(a2, r4) {
    var i5 = 0, c3 = 0, m4 = Math.min(a2.t, this.t);
    while (i5 < m4)
      c3 += this.data[i5] - a2.data[i5], r4.data[i5++] = c3 & this.DM, c3 >>= this.DB;
    if (a2.t < this.t) {
      c3 -= a2.s;
      while (i5 < this.t)
        c3 += this.data[i5], r4.data[i5++] = c3 & this.DM, c3 >>= this.DB;
      c3 += this.s;
    } else {
      c3 += this.s;
      while (i5 < a2.t)
        c3 -= a2.data[i5], r4.data[i5++] = c3 & this.DM, c3 >>= this.DB;
      c3 -= a2.s;
    }
    if (r4.s = c3 < 0 ? -1 : 0, c3 < -1)
      r4.data[i5++] = this.DV + c3;
    else if (c3 > 0)
      r4.data[i5++] = c3;
    r4.t = i5, r4.clamp();
  }
  function bnpMultiplyTo(a2, r4) {
    var x4 = this.abs(), y2 = a2.abs(), i5 = x4.t;
    r4.t = i5 + y2.t;
    while (--i5 >= 0)
      r4.data[i5] = 0;
    for (i5 = 0;i5 < y2.t; ++i5)
      r4.data[i5 + x4.t] = x4.am(0, y2.data[i5], r4, i5, 0, x4.t);
    if (r4.s = 0, r4.clamp(), this.s != a2.s)
      BigInteger.ZERO.subTo(r4, r4);
  }
  function bnpSquareTo(r4) {
    var x4 = this.abs(), i5 = r4.t = 2 * x4.t;
    while (--i5 >= 0)
      r4.data[i5] = 0;
    for (i5 = 0;i5 < x4.t - 1; ++i5) {
      var c3 = x4.am(i5, x4.data[i5], r4, 2 * i5, 0, 1);
      if ((r4.data[i5 + x4.t] += x4.am(i5 + 1, 2 * x4.data[i5], r4, 2 * i5 + 1, c3, x4.t - i5 - 1)) >= x4.DV)
        r4.data[i5 + x4.t] -= x4.DV, r4.data[i5 + x4.t + 1] = 1;
    }
    if (r4.t > 0)
      r4.data[r4.t - 1] += x4.am(i5, x4.data[i5], r4, 2 * i5, 0, 1);
    r4.s = 0, r4.clamp();
  }
  function bnpDivRemTo(m4, q4, r4) {
    var pm = m4.abs();
    if (pm.t <= 0)
      return;
    var pt = this.abs();
    if (pt.t < pm.t) {
      if (q4 != null)
        q4.fromInt(0);
      if (r4 != null)
        this.copyTo(r4);
      return;
    }
    if (r4 == null)
      r4 = nbi();
    var y2 = nbi(), ts = this.s, ms = m4.s, nsh = this.DB - nbits(pm.data[pm.t - 1]);
    if (nsh > 0)
      pm.lShiftTo(nsh, y2), pt.lShiftTo(nsh, r4);
    else
      pm.copyTo(y2), pt.copyTo(r4);
    var ys = y2.t, y0 = y2.data[ys - 1];
    if (y0 == 0)
      return;
    var yt = y0 * (1 << this.F1) + (ys > 1 ? y2.data[ys - 2] >> this.F2 : 0), d1 = this.FV / yt, d2 = (1 << this.F1) / yt, e = 1 << this.F2, i5 = r4.t, j4 = i5 - ys, t2 = q4 == null ? nbi() : q4;
    if (y2.dlShiftTo(j4, t2), r4.compareTo(t2) >= 0)
      r4.data[r4.t++] = 1, r4.subTo(t2, r4);
    BigInteger.ONE.dlShiftTo(ys, t2), t2.subTo(y2, y2);
    while (y2.t < ys)
      y2.data[y2.t++] = 0;
    while (--j4 >= 0) {
      var qd = r4.data[--i5] == y0 ? this.DM : Math.floor(r4.data[i5] * d1 + (r4.data[i5 - 1] + e) * d2);
      if ((r4.data[i5] += y2.am(0, qd, r4, j4, 0, ys)) < qd) {
        y2.dlShiftTo(j4, t2), r4.subTo(t2, r4);
        while (r4.data[i5] < --qd)
          r4.subTo(t2, r4);
      }
    }
    if (q4 != null) {
      if (r4.drShiftTo(ys, q4), ts != ms)
        BigInteger.ZERO.subTo(q4, q4);
    }
    if (r4.t = ys, r4.clamp(), nsh > 0)
      r4.rShiftTo(nsh, r4);
    if (ts < 0)
      BigInteger.ZERO.subTo(r4, r4);
  }
  function bnMod(a2) {
    var r4 = nbi();
    if (this.abs().divRemTo(a2, null, r4), this.s < 0 && r4.compareTo(BigInteger.ZERO) > 0)
      a2.subTo(r4, r4);
    return r4;
  }
  function Classic(m4) {
    this.m = m4;
  }
  function cConvert(x4) {
    if (x4.s < 0 || x4.compareTo(this.m) >= 0)
      return x4.mod(this.m);
    else
      return x4;
  }
  function cRevert(x4) {
    return x4;
  }
  function cReduce(x4) {
    x4.divRemTo(this.m, null, x4);
  }
  function cMulTo(x4, y2, r4) {
    x4.multiplyTo(y2, r4), this.reduce(r4);
  }
  function cSqrTo(x4, r4) {
    x4.squareTo(r4), this.reduce(r4);
  }
  Classic.prototype.convert = cConvert;
  Classic.prototype.revert = cRevert;
  Classic.prototype.reduce = cReduce;
  Classic.prototype.mulTo = cMulTo;
  Classic.prototype.sqrTo = cSqrTo;
  function bnpInvDigit() {
    if (this.t < 1)
      return 0;
    var x4 = this.data[0];
    if ((x4 & 1) == 0)
      return 0;
    var y2 = x4 & 3;
    return y2 = y2 * (2 - (x4 & 15) * y2) & 15, y2 = y2 * (2 - (x4 & 255) * y2) & 255, y2 = y2 * (2 - ((x4 & 65535) * y2 & 65535)) & 65535, y2 = y2 * (2 - x4 * y2 % this.DV) % this.DV, y2 > 0 ? this.DV - y2 : -y2;
  }
  function Montgomery(m4) {
    this.m = m4, this.mp = m4.invDigit(), this.mpl = this.mp & 32767, this.mph = this.mp >> 15, this.um = (1 << m4.DB - 15) - 1, this.mt2 = 2 * m4.t;
  }
  function montConvert(x4) {
    var r4 = nbi();
    if (x4.abs().dlShiftTo(this.m.t, r4), r4.divRemTo(this.m, null, r4), x4.s < 0 && r4.compareTo(BigInteger.ZERO) > 0)
      this.m.subTo(r4, r4);
    return r4;
  }
  function montRevert(x4) {
    var r4 = nbi();
    return x4.copyTo(r4), this.reduce(r4), r4;
  }
  function montReduce(x4) {
    while (x4.t <= this.mt2)
      x4.data[x4.t++] = 0;
    for (var i5 = 0;i5 < this.m.t; ++i5) {
      var j4 = x4.data[i5] & 32767, u0 = j4 * this.mpl + ((j4 * this.mph + (x4.data[i5] >> 15) * this.mpl & this.um) << 15) & x4.DM;
      j4 = i5 + this.m.t, x4.data[j4] += this.m.am(0, u0, x4, i5, 0, this.m.t);
      while (x4.data[j4] >= x4.DV)
        x4.data[j4] -= x4.DV, x4.data[++j4]++;
    }
    if (x4.clamp(), x4.drShiftTo(this.m.t, x4), x4.compareTo(this.m) >= 0)
      x4.subTo(this.m, x4);
  }
  function montSqrTo(x4, r4) {
    x4.squareTo(r4), this.reduce(r4);
  }
  function montMulTo(x4, y2, r4) {
    x4.multiplyTo(y2, r4), this.reduce(r4);
  }
  Montgomery.prototype.convert = montConvert;
  Montgomery.prototype.revert = montRevert;
  Montgomery.prototype.reduce = montReduce;
  Montgomery.prototype.mulTo = montMulTo;
  Montgomery.prototype.sqrTo = montSqrTo;
  function bnpIsEven() {
    return (this.t > 0 ? this.data[0] & 1 : this.s) == 0;
  }
  function bnpExp(e, z2) {
    if (e > 4294967295 || e < 1)
      return BigInteger.ONE;
    var r4 = nbi(), r22 = nbi(), g = z2.convert(this), i5 = nbits(e) - 1;
    g.copyTo(r4);
    while (--i5 >= 0)
      if (z2.sqrTo(r4, r22), (e & 1 << i5) > 0)
        z2.mulTo(r22, g, r4);
      else {
        var t2 = r4;
        r4 = r22, r22 = t2;
      }
    return z2.revert(r4);
  }
  function bnModPowInt(e, m4) {
    var z2;
    if (e < 256 || m4.isEven())
      z2 = new Classic(m4);
    else
      z2 = new Montgomery(m4);
    return this.exp(e, z2);
  }
  BigInteger.prototype.copyTo = bnpCopyTo;
  BigInteger.prototype.fromInt = bnpFromInt;
  BigInteger.prototype.fromString = bnpFromString;
  BigInteger.prototype.clamp = bnpClamp;
  BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
  BigInteger.prototype.drShiftTo = bnpDRShiftTo;
  BigInteger.prototype.lShiftTo = bnpLShiftTo;
  BigInteger.prototype.rShiftTo = bnpRShiftTo;
  BigInteger.prototype.subTo = bnpSubTo;
  BigInteger.prototype.multiplyTo = bnpMultiplyTo;
  BigInteger.prototype.squareTo = bnpSquareTo;
  BigInteger.prototype.divRemTo = bnpDivRemTo;
  BigInteger.prototype.invDigit = bnpInvDigit;
  BigInteger.prototype.isEven = bnpIsEven;
  BigInteger.prototype.exp = bnpExp;
  BigInteger.prototype.toString = bnToString;
  BigInteger.prototype.negate = bnNegate;
  BigInteger.prototype.abs = bnAbs;
  BigInteger.prototype.compareTo = bnCompareTo;
  BigInteger.prototype.bitLength = bnBitLength;
  BigInteger.prototype.mod = bnMod;
  BigInteger.prototype.modPowInt = bnModPowInt;
  BigInteger.ZERO = nbv(0);
  BigInteger.ONE = nbv(1);
  function bnClone() {
    var r4 = nbi();
    return this.copyTo(r4), r4;
  }
  function bnIntValue() {
    if (this.s < 0) {
      if (this.t == 1)
        return this.data[0] - this.DV;
      else if (this.t == 0)
        return -1;
    } else if (this.t == 1)
      return this.data[0];
    else if (this.t == 0)
      return 0;
    return (this.data[1] & (1 << 32 - this.DB) - 1) << this.DB | this.data[0];
  }
  function bnByteValue() {
    return this.t == 0 ? this.s : this.data[0] << 24 >> 24;
  }
  function bnShortValue() {
    return this.t == 0 ? this.s : this.data[0] << 16 >> 16;
  }
  function bnpChunkSize(r4) {
    return Math.floor(Math.LN2 * this.DB / Math.log(r4));
  }
  function bnSigNum() {
    if (this.s < 0)
      return -1;
    else if (this.t <= 0 || this.t == 1 && this.data[0] <= 0)
      return 0;
    else
      return 1;
  }
  function bnpToRadix(b) {
    if (b == null)
      b = 10;
    if (this.signum() == 0 || b < 2 || b > 36)
      return "0";
    var cs = this.chunkSize(b), a2 = Math.pow(b, cs), d = nbv(a2), y2 = nbi(), z2 = nbi(), r4 = "";
    this.divRemTo(d, y2, z2);
    while (y2.signum() > 0)
      r4 = (a2 + z2.intValue()).toString(b).substr(1) + r4, y2.divRemTo(d, y2, z2);
    return z2.intValue().toString(b) + r4;
  }
  function bnpFromRadix(s2, b) {
    if (this.fromInt(0), b == null)
      b = 10;
    var cs = this.chunkSize(b), d = Math.pow(b, cs), mi = !1, j4 = 0, w2 = 0;
    for (var i5 = 0;i5 < s2.length; ++i5) {
      var x4 = intAt(s2, i5);
      if (x4 < 0) {
        if (s2.charAt(i5) == "-" && this.signum() == 0)
          mi = !0;
        continue;
      }
      if (w2 = b * w2 + x4, ++j4 >= cs)
        this.dMultiply(d), this.dAddOffset(w2, 0), j4 = 0, w2 = 0;
    }
    if (j4 > 0)
      this.dMultiply(Math.pow(b, j4)), this.dAddOffset(w2, 0);
    if (mi)
      BigInteger.ZERO.subTo(this, this);
  }
  function bnpFromNumber(a2, b, c3) {
    if (typeof b == "number")
      if (a2 < 2)
        this.fromInt(1);
      else {
        if (this.fromNumber(a2, c3), !this.testBit(a2 - 1))
          this.bitwiseTo(BigInteger.ONE.shiftLeft(a2 - 1), op_or, this);
        if (this.isEven())
          this.dAddOffset(1, 0);
        while (!this.isProbablePrime(b))
          if (this.dAddOffset(2, 0), this.bitLength() > a2)
            this.subTo(BigInteger.ONE.shiftLeft(a2 - 1), this);
      }
    else {
      var x4 = [], t2 = a2 & 7;
      if (x4.length = (a2 >> 3) + 1, b.nextBytes(x4), t2 > 0)
        x4[0] &= (1 << t2) - 1;
      else
        x4[0] = 0;
      this.fromString(x4, 256);
    }
  }
  function bnToByteArray() {
    var i5 = this.t, r4 = [];
    r4[0] = this.s;
    var p4 = this.DB - i5 * this.DB % 8, d, k3 = 0;
    if (i5-- > 0) {
      if (p4 < this.DB && (d = this.data[i5] >> p4) != (this.s & this.DM) >> p4)
        r4[k3++] = d | this.s << this.DB - p4;
      while (i5 >= 0) {
        if (p4 < 8)
          d = (this.data[i5] & (1 << p4) - 1) << 8 - p4, d |= this.data[--i5] >> (p4 += this.DB - 8);
        else if (d = this.data[i5] >> (p4 -= 8) & 255, p4 <= 0)
          p4 += this.DB, --i5;
        if ((d & 128) != 0)
          d |= -256;
        if (k3 == 0 && (this.s & 128) != (d & 128))
          ++k3;
        if (k3 > 0 || d != this.s)
          r4[k3++] = d;
      }
    }
    return r4;
  }
  function bnEquals(a2) {
    return this.compareTo(a2) == 0;
  }
  function bnMin(a2) {
    return this.compareTo(a2) < 0 ? this : a2;
  }
  function bnMax(a2) {
    return this.compareTo(a2) > 0 ? this : a2;
  }
  function bnpBitwiseTo(a2, op, r4) {
    var i5, f, m4 = Math.min(a2.t, this.t);
    for (i5 = 0;i5 < m4; ++i5)
      r4.data[i5] = op(this.data[i5], a2.data[i5]);
    if (a2.t < this.t) {
      f = a2.s & this.DM;
      for (i5 = m4;i5 < this.t; ++i5)
        r4.data[i5] = op(this.data[i5], f);
      r4.t = this.t;
    } else {
      f = this.s & this.DM;
      for (i5 = m4;i5 < a2.t; ++i5)
        r4.data[i5] = op(f, a2.data[i5]);
      r4.t = a2.t;
    }
    r4.s = op(this.s, a2.s), r4.clamp();
  }
  function op_and(x4, y2) {
    return x4 & y2;
  }
  function bnAnd(a2) {
    var r4 = nbi();
    return this.bitwiseTo(a2, op_and, r4), r4;
  }
  function op_or(x4, y2) {
    return x4 | y2;
  }
  function bnOr(a2) {
    var r4 = nbi();
    return this.bitwiseTo(a2, op_or, r4), r4;
  }
  function op_xor(x4, y2) {
    return x4 ^ y2;
  }
  function bnXor(a2) {
    var r4 = nbi();
    return this.bitwiseTo(a2, op_xor, r4), r4;
  }
  function op_andnot(x4, y2) {
    return x4 & ~y2;
  }
  function bnAndNot(a2) {
    var r4 = nbi();
    return this.bitwiseTo(a2, op_andnot, r4), r4;
  }
  function bnNot() {
    var r4 = nbi();
    for (var i5 = 0;i5 < this.t; ++i5)
      r4.data[i5] = this.DM & ~this.data[i5];
    return r4.t = this.t, r4.s = ~this.s, r4;
  }
  function bnShiftLeft(n5) {
    var r4 = nbi();
    if (n5 < 0)
      this.rShiftTo(-n5, r4);
    else
      this.lShiftTo(n5, r4);
    return r4;
  }
  function bnShiftRight(n5) {
    var r4 = nbi();
    if (n5 < 0)
      this.lShiftTo(-n5, r4);
    else
      this.rShiftTo(n5, r4);
    return r4;
  }
  function lbit(x4) {
    if (x4 == 0)
      return -1;
    var r4 = 0;
    if ((x4 & 65535) == 0)
      x4 >>= 16, r4 += 16;
    if ((x4 & 255) == 0)
      x4 >>= 8, r4 += 8;
    if ((x4 & 15) == 0)
      x4 >>= 4, r4 += 4;
    if ((x4 & 3) == 0)
      x4 >>= 2, r4 += 2;
    if ((x4 & 1) == 0)
      ++r4;
    return r4;
  }
  function bnGetLowestSetBit() {
    for (var i5 = 0;i5 < this.t; ++i5)
      if (this.data[i5] != 0)
        return i5 * this.DB + lbit(this.data[i5]);
    if (this.s < 0)
      return this.t * this.DB;
    return -1;
  }
  function cbit(x4) {
    var r4 = 0;
    while (x4 != 0)
      x4 &= x4 - 1, ++r4;
    return r4;
  }
  function bnBitCount() {
    var r4 = 0, x4 = this.s & this.DM;
    for (var i5 = 0;i5 < this.t; ++i5)
      r4 += cbit(this.data[i5] ^ x4);
    return r4;
  }
  function bnTestBit(n5) {
    var j4 = Math.floor(n5 / this.DB);
    if (j4 >= this.t)
      return this.s != 0;
    return (this.data[j4] & 1 << n5 % this.DB) != 0;
  }
  function bnpChangeBit(n5, op) {
    var r4 = BigInteger.ONE.shiftLeft(n5);
    return this.bitwiseTo(r4, op, r4), r4;
  }
  function bnSetBit(n5) {
    return this.changeBit(n5, op_or);
  }
  function bnClearBit(n5) {
    return this.changeBit(n5, op_andnot);
  }
  function bnFlipBit(n5) {
    return this.changeBit(n5, op_xor);
  }
  function bnpAddTo(a2, r4) {
    var i5 = 0, c3 = 0, m4 = Math.min(a2.t, this.t);
    while (i5 < m4)
      c3 += this.data[i5] + a2.data[i5], r4.data[i5++] = c3 & this.DM, c3 >>= this.DB;
    if (a2.t < this.t) {
      c3 += a2.s;
      while (i5 < this.t)
        c3 += this.data[i5], r4.data[i5++] = c3 & this.DM, c3 >>= this.DB;
      c3 += this.s;
    } else {
      c3 += this.s;
      while (i5 < a2.t)
        c3 += a2.data[i5], r4.data[i5++] = c3 & this.DM, c3 >>= this.DB;
      c3 += a2.s;
    }
    if (r4.s = c3 < 0 ? -1 : 0, c3 > 0)
      r4.data[i5++] = c3;
    else if (c3 < -1)
      r4.data[i5++] = this.DV + c3;
    r4.t = i5, r4.clamp();
  }
  function bnAdd(a2) {
    var r4 = nbi();
    return this.addTo(a2, r4), r4;
  }
  function bnSubtract(a2) {
    var r4 = nbi();
    return this.subTo(a2, r4), r4;
  }
  function bnMultiply(a2) {
    var r4 = nbi();
    return this.multiplyTo(a2, r4), r4;
  }
  function bnSquare() {
    var r4 = nbi();
    return this.squareTo(r4), r4;
  }
  function bnDivide(a2) {
    var r4 = nbi();
    return this.divRemTo(a2, r4, null), r4;
  }
  function bnRemainder(a2) {
    var r4 = nbi();
    return this.divRemTo(a2, null, r4), r4;
  }
  function bnDivideAndRemainder(a2) {
    var q4 = nbi(), r4 = nbi();
    return this.divRemTo(a2, q4, r4), [
      q4,
      r4
    ];
  }
  function bnpDMultiply(n5) {
    this.data[this.t] = this.am(0, n5 - 1, this, 0, 0, this.t), ++this.t, this.clamp();
  }
  function bnpDAddOffset(n5, w2) {
    if (n5 == 0)
      return;
    while (this.t <= w2)
      this.data[this.t++] = 0;
    this.data[w2] += n5;
    while (this.data[w2] >= this.DV) {
      if (this.data[w2] -= this.DV, ++w2 >= this.t)
        this.data[this.t++] = 0;
      ++this.data[w2];
    }
  }
  function NullExp() {}
  function nNop(x4) {
    return x4;
  }
  function nMulTo(x4, y2, r4) {
    x4.multiplyTo(y2, r4);
  }
  function nSqrTo(x4, r4) {
    x4.squareTo(r4);
  }
  NullExp.prototype.convert = nNop;
  NullExp.prototype.revert = nNop;
  NullExp.prototype.mulTo = nMulTo;
  NullExp.prototype.sqrTo = nSqrTo;
  function bnPow(e) {
    return this.exp(e, new NullExp);
  }
  function bnpMultiplyLowerTo(a2, n5, r4) {
    var i5 = Math.min(this.t + a2.t, n5);
    r4.s = 0, r4.t = i5;
    while (i5 > 0)
      r4.data[--i5] = 0;
    var j4;
    for (j4 = r4.t - this.t;i5 < j4; ++i5)
      r4.data[i5 + this.t] = this.am(0, a2.data[i5], r4, i5, 0, this.t);
    for (j4 = Math.min(a2.t, n5);i5 < j4; ++i5)
      this.am(0, a2.data[i5], r4, i5, 0, n5 - i5);
    r4.clamp();
  }
  function bnpMultiplyUpperTo(a2, n5, r4) {
    --n5;
    var i5 = r4.t = this.t + a2.t - n5;
    r4.s = 0;
    while (--i5 >= 0)
      r4.data[i5] = 0;
    for (i5 = Math.max(n5 - this.t, 0);i5 < a2.t; ++i5)
      r4.data[this.t + i5 - n5] = this.am(n5 - i5, a2.data[i5], r4, 0, 0, this.t + i5 - n5);
    r4.clamp(), r4.drShiftTo(1, r4);
  }
  function Barrett(m4) {
    this.r2 = nbi(), this.q3 = nbi(), BigInteger.ONE.dlShiftTo(2 * m4.t, this.r2), this.mu = this.r2.divide(m4), this.m = m4;
  }
  function barrettConvert(x4) {
    if (x4.s < 0 || x4.t > 2 * this.m.t)
      return x4.mod(this.m);
    else if (x4.compareTo(this.m) < 0)
      return x4;
    else {
      var r4 = nbi();
      return x4.copyTo(r4), this.reduce(r4), r4;
    }
  }
  function barrettRevert(x4) {
    return x4;
  }
  function barrettReduce(x4) {
    if (x4.drShiftTo(this.m.t - 1, this.r2), x4.t > this.m.t + 1)
      x4.t = this.m.t + 1, x4.clamp();
    this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3), this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
    while (x4.compareTo(this.r2) < 0)
      x4.dAddOffset(1, this.m.t + 1);
    x4.subTo(this.r2, x4);
    while (x4.compareTo(this.m) >= 0)
      x4.subTo(this.m, x4);
  }
  function barrettSqrTo(x4, r4) {
    x4.squareTo(r4), this.reduce(r4);
  }
  function barrettMulTo(x4, y2, r4) {
    x4.multiplyTo(y2, r4), this.reduce(r4);
  }
  Barrett.prototype.convert = barrettConvert;
  Barrett.prototype.revert = barrettRevert;
  Barrett.prototype.reduce = barrettReduce;
  Barrett.prototype.mulTo = barrettMulTo;
  Barrett.prototype.sqrTo = barrettSqrTo;
  function bnModPow(e, m4) {
    var i5 = e.bitLength(), k3, r4 = nbv(1), z2;
    if (i5 <= 0)
      return r4;
    else if (i5 < 18)
      k3 = 1;
    else if (i5 < 48)
      k3 = 3;
    else if (i5 < 144)
      k3 = 4;
    else if (i5 < 768)
      k3 = 5;
    else
      k3 = 6;
    if (i5 < 8)
      z2 = new Classic(m4);
    else if (m4.isEven())
      z2 = new Barrett(m4);
    else
      z2 = new Montgomery(m4);
    var g = [], n5 = 3, k1 = k3 - 1, km = (1 << k3) - 1;
    if (g[1] = z2.convert(this), k3 > 1) {
      var g2 = nbi();
      z2.sqrTo(g[1], g2);
      while (n5 <= km)
        g[n5] = nbi(), z2.mulTo(g2, g[n5 - 2], g[n5]), n5 += 2;
    }
    var j4 = e.t - 1, w2, is1 = !0, r22 = nbi(), t2;
    i5 = nbits(e.data[j4]) - 1;
    while (j4 >= 0) {
      if (i5 >= k1)
        w2 = e.data[j4] >> i5 - k1 & km;
      else if (w2 = (e.data[j4] & (1 << i5 + 1) - 1) << k1 - i5, j4 > 0)
        w2 |= e.data[j4 - 1] >> this.DB + i5 - k1;
      n5 = k3;
      while ((w2 & 1) == 0)
        w2 >>= 1, --n5;
      if ((i5 -= n5) < 0)
        i5 += this.DB, --j4;
      if (is1)
        g[w2].copyTo(r4), is1 = !1;
      else {
        while (n5 > 1)
          z2.sqrTo(r4, r22), z2.sqrTo(r22, r4), n5 -= 2;
        if (n5 > 0)
          z2.sqrTo(r4, r22);
        else
          t2 = r4, r4 = r22, r22 = t2;
        z2.mulTo(r22, g[w2], r4);
      }
      while (j4 >= 0 && (e.data[j4] & 1 << i5) == 0)
        if (z2.sqrTo(r4, r22), t2 = r4, r4 = r22, r22 = t2, --i5 < 0)
          i5 = this.DB - 1, --j4;
    }
    return z2.revert(r4);
  }
  function bnGCD(a2) {
    var x4 = this.s < 0 ? this.negate() : this.clone(), y2 = a2.s < 0 ? a2.negate() : a2.clone();
    if (x4.compareTo(y2) < 0) {
      var t2 = x4;
      x4 = y2, y2 = t2;
    }
    var i5 = x4.getLowestSetBit(), g = y2.getLowestSetBit();
    if (g < 0)
      return x4;
    if (i5 < g)
      g = i5;
    if (g > 0)
      x4.rShiftTo(g, x4), y2.rShiftTo(g, y2);
    while (x4.signum() > 0) {
      if ((i5 = x4.getLowestSetBit()) > 0)
        x4.rShiftTo(i5, x4);
      if ((i5 = y2.getLowestSetBit()) > 0)
        y2.rShiftTo(i5, y2);
      if (x4.compareTo(y2) >= 0)
        x4.subTo(y2, x4), x4.rShiftTo(1, x4);
      else
        y2.subTo(x4, y2), y2.rShiftTo(1, y2);
    }
    if (g > 0)
      y2.lShiftTo(g, y2);
    return y2;
  }
  function bnpModInt(n5) {
    if (n5 <= 0)
      return 0;
    var d = this.DV % n5, r4 = this.s < 0 ? n5 - 1 : 0;
    if (this.t > 0)
      if (d == 0)
        r4 = this.data[0] % n5;
      else
        for (var i5 = this.t - 1;i5 >= 0; --i5)
          r4 = (d * r4 + this.data[i5]) % n5;
    return r4;
  }
  function bnModInverse(m4) {
    if (this.signum() == 0)
      return BigInteger.ZERO;
    var ac = m4.isEven();
    if (this.isEven() && ac || m4.signum() == 0)
      return BigInteger.ZERO;
    var u5 = m4.clone(), v2 = this.clone(), a2 = nbv(1), b = nbv(0), c3 = nbv(0), d = nbv(1);
    while (u5.signum() != 0) {
      while (u5.isEven()) {
        if (u5.rShiftTo(1, u5), ac) {
          if (!a2.isEven() || !b.isEven())
            a2.addTo(this, a2), b.subTo(m4, b);
          a2.rShiftTo(1, a2);
        } else if (!b.isEven())
          b.subTo(m4, b);
        b.rShiftTo(1, b);
      }
      while (v2.isEven()) {
        if (v2.rShiftTo(1, v2), ac) {
          if (!c3.isEven() || !d.isEven())
            c3.addTo(this, c3), d.subTo(m4, d);
          c3.rShiftTo(1, c3);
        } else if (!d.isEven())
          d.subTo(m4, d);
        d.rShiftTo(1, d);
      }
      if (u5.compareTo(v2) >= 0) {
        if (u5.subTo(v2, u5), ac)
          a2.subTo(c3, a2);
        b.subTo(d, b);
      } else {
        if (v2.subTo(u5, v2), ac)
          c3.subTo(a2, c3);
        d.subTo(b, d);
      }
    }
    if (v2.compareTo(BigInteger.ONE) != 0)
      return BigInteger.ZERO;
    if (d.compareTo(m4) >= 0)
      return d.subtract(m4);
    if (d.signum() < 0)
      d.addTo(m4, d);
    else
      return d;
    if (d.signum() < 0)
      return d.add(m4);
    else
      return d;
  }
  var lowprimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997], lplim = 67108864 / lowprimes[lowprimes.length - 1];
  function bnIsProbablePrime(t2) {
    var i5, x4 = this.abs();
    if (x4.t == 1 && x4.data[0] <= lowprimes[lowprimes.length - 1]) {
      for (i5 = 0;i5 < lowprimes.length; ++i5)
        if (x4.data[0] == lowprimes[i5])
          return !0;
      return !1;
    }
    if (x4.isEven())
      return !1;
    i5 = 1;
    while (i5 < lowprimes.length) {
      var m4 = lowprimes[i5], j4 = i5 + 1;
      while (j4 < lowprimes.length && m4 < lplim)
        m4 *= lowprimes[j4++];
      m4 = x4.modInt(m4);
      while (i5 < j4)
        if (m4 % lowprimes[i5++] == 0)
          return !1;
    }
    return x4.millerRabin(t2);
  }
  function bnpMillerRabin(t2) {
    var n1 = this.subtract(BigInteger.ONE), k3 = n1.getLowestSetBit();
    if (k3 <= 0)
      return !1;
    var r4 = n1.shiftRight(k3), prng = bnGetPrng(), a2;
    for (var i5 = 0;i5 < t2; ++i5) {
      do
        a2 = new BigInteger(this.bitLength(), prng);
      while (a2.compareTo(BigInteger.ONE) <= 0 || a2.compareTo(n1) >= 0);
      var y2 = a2.modPow(r4, this);
      if (y2.compareTo(BigInteger.ONE) != 0 && y2.compareTo(n1) != 0) {
        var j4 = 1;
        while (j4++ < k3 && y2.compareTo(n1) != 0)
          if (y2 = y2.modPowInt(2, this), y2.compareTo(BigInteger.ONE) == 0)
            return !1;
        if (y2.compareTo(n1) != 0)
          return !1;
      }
    }
    return !0;
  }
  function bnGetPrng() {
    return {
      nextBytes: function(x4) {
        for (var i5 = 0;i5 < x4.length; ++i5)
          x4[i5] = Math.floor(Math.random() * 256);
      }
    };
  }
  BigInteger.prototype.chunkSize = bnpChunkSize;
  BigInteger.prototype.toRadix = bnpToRadix;
  BigInteger.prototype.fromRadix = bnpFromRadix;
  BigInteger.prototype.fromNumber = bnpFromNumber;
  BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
  BigInteger.prototype.changeBit = bnpChangeBit;
  BigInteger.prototype.addTo = bnpAddTo;
  BigInteger.prototype.dMultiply = bnpDMultiply;
  BigInteger.prototype.dAddOffset = bnpDAddOffset;
  BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
  BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
  BigInteger.prototype.modInt = bnpModInt;
  BigInteger.prototype.millerRabin = bnpMillerRabin;
  BigInteger.prototype.clone = bnClone;
  BigInteger.prototype.intValue = bnIntValue;
  BigInteger.prototype.byteValue = bnByteValue;
  BigInteger.prototype.shortValue = bnShortValue;
  BigInteger.prototype.signum = bnSigNum;
  BigInteger.prototype.toByteArray = bnToByteArray;
  BigInteger.prototype.equals = bnEquals;
  BigInteger.prototype.min = bnMin;
  BigInteger.prototype.max = bnMax;
  BigInteger.prototype.and = bnAnd;
  BigInteger.prototype.or = bnOr;
  BigInteger.prototype.xor = bnXor;
  BigInteger.prototype.andNot = bnAndNot;
  BigInteger.prototype.not = bnNot;
  BigInteger.prototype.shiftLeft = bnShiftLeft;
  BigInteger.prototype.shiftRight = bnShiftRight;
  BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
  BigInteger.prototype.bitCount = bnBitCount;
  BigInteger.prototype.testBit = bnTestBit;
  BigInteger.prototype.setBit = bnSetBit;
  BigInteger.prototype.clearBit = bnClearBit;
  BigInteger.prototype.flipBit = bnFlipBit;
  BigInteger.prototype.add = bnAdd;
  BigInteger.prototype.subtract = bnSubtract;
  BigInteger.prototype.multiply = bnMultiply;
  BigInteger.prototype.divide = bnDivide;
  BigInteger.prototype.remainder = bnRemainder;
  BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
  BigInteger.prototype.modPow = bnModPow;
  BigInteger.prototype.modInverse = bnModInverse;
  BigInteger.prototype.pow = bnPow;
  BigInteger.prototype.gcd = bnGCD;
  BigInteger.prototype.isProbablePrime = bnIsProbablePrime;
  BigInteger.prototype.square = bnSquare;
});
