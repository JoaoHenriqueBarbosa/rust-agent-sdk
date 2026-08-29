// var: require_bignumber
var require_bignumber = __commonJS((exports, module) => {
  (function(globalObject) {
    var BigNumber, isNumeric = /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i, mathceil = Math.ceil, mathfloor = Math.floor, bignumberError = "[BigNumber Error] ", tooManyDigits = bignumberError + "Number primitive has more than 15 significant digits: ", BASE = 100000000000000, LOG_BASE = 14, MAX_SAFE_INTEGER3 = 9007199254740991, POWS_TEN = [1, 10, 100, 1000, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 10000000000, 100000000000, 1000000000000, 10000000000000], SQRT_BASE = 1e7, MAX = 1e9;
    function clone3(configObject) {
      var div, convertBase, parseNumeric, P2 = BigNumber2.prototype = { constructor: BigNumber2, toString: null, valueOf: null }, ONE = new BigNumber2(1), DECIMAL_PLACES = 20, ROUNDING_MODE = 4, TO_EXP_NEG = -7, TO_EXP_POS = 21, MIN_EXP = -1e7, MAX_EXP = 1e7, CRYPTO = !1, MODULO_MODE = 1, POW_PRECISION = 0, FORMAT = {
        prefix: "",
        groupSize: 3,
        secondaryGroupSize: 0,
        groupSeparator: ",",
        decimalSeparator: ".",
        fractionGroupSize: 0,
        fractionGroupSeparator: "\xA0",
        suffix: ""
      }, ALPHABET2 = "0123456789abcdefghijklmnopqrstuvwxyz", alphabetHasNormalDecimalDigits = !0;
      function BigNumber2(v2, b) {
        var alphabet, c3, caseChanged, e, i4, isNum, len, str, x3 = this;
        if (!(x3 instanceof BigNumber2))
          return new BigNumber2(v2, b);
        if (b == null) {
          if (v2 && v2._isBigNumber === !0) {
            if (x3.s = v2.s, !v2.c || v2.e > MAX_EXP)
              x3.c = x3.e = null;
            else if (v2.e < MIN_EXP)
              x3.c = [x3.e = 0];
            else
              x3.e = v2.e, x3.c = v2.c.slice();
            return;
          }
          if ((isNum = typeof v2 == "number") && v2 * 0 == 0) {
            if (x3.s = 1 / v2 < 0 ? (v2 = -v2, -1) : 1, v2 === ~~v2) {
              for (e = 0, i4 = v2;i4 >= 10; i4 /= 10, e++)
                ;
              if (e > MAX_EXP)
                x3.c = x3.e = null;
              else
                x3.e = e, x3.c = [v2];
              return;
            }
            str = String(v2);
          } else {
            if (!isNumeric.test(str = String(v2)))
              return parseNumeric(x3, str, isNum);
            x3.s = str.charCodeAt(0) == 45 ? (str = str.slice(1), -1) : 1;
          }
          if ((e = str.indexOf(".")) > -1)
            str = str.replace(".", "");
          if ((i4 = str.search(/e/i)) > 0) {
            if (e < 0)
              e = i4;
            e += +str.slice(i4 + 1), str = str.substring(0, i4);
          } else if (e < 0)
            e = str.length;
        } else {
          if (intCheck(b, 2, ALPHABET2.length, "Base"), b == 10 && alphabetHasNormalDecimalDigits)
            return x3 = new BigNumber2(v2), round(x3, DECIMAL_PLACES + x3.e + 1, ROUNDING_MODE);
          if (str = String(v2), isNum = typeof v2 == "number") {
            if (v2 * 0 != 0)
              return parseNumeric(x3, str, isNum, b);
            if (x3.s = 1 / v2 < 0 ? (str = str.slice(1), -1) : 1, BigNumber2.DEBUG && str.replace(/^0\.0*|\./, "").length > 15)
              throw Error(tooManyDigits + v2);
          } else
            x3.s = str.charCodeAt(0) === 45 ? (str = str.slice(1), -1) : 1;
          alphabet = ALPHABET2.slice(0, b), e = i4 = 0;
          for (len = str.length;i4 < len; i4++)
            if (alphabet.indexOf(c3 = str.charAt(i4)) < 0) {
              if (c3 == ".") {
                if (i4 > e) {
                  e = len;
                  continue;
                }
              } else if (!caseChanged) {
                if (str == str.toUpperCase() && (str = str.toLowerCase()) || str == str.toLowerCase() && (str = str.toUpperCase())) {
                  caseChanged = !0, i4 = -1, e = 0;
                  continue;
                }
              }
              return parseNumeric(x3, String(v2), isNum, b);
            }
          if (isNum = !1, str = convertBase(str, b, 10, x3.s), (e = str.indexOf(".")) > -1)
            str = str.replace(".", "");
          else
            e = str.length;
        }
        for (i4 = 0;str.charCodeAt(i4) === 48; i4++)
          ;
        for (len = str.length;str.charCodeAt(--len) === 48; )
          ;
        if (str = str.slice(i4, ++len)) {
          if (len -= i4, isNum && BigNumber2.DEBUG && len > 15 && (v2 > MAX_SAFE_INTEGER3 || v2 !== mathfloor(v2)))
            throw Error(tooManyDigits + x3.s * v2);
          if ((e = e - i4 - 1) > MAX_EXP)
            x3.c = x3.e = null;
          else if (e < MIN_EXP)
            x3.c = [x3.e = 0];
          else {
            if (x3.e = e, x3.c = [], i4 = (e + 1) % LOG_BASE, e < 0)
              i4 += LOG_BASE;
            if (i4 < len) {
              if (i4)
                x3.c.push(+str.slice(0, i4));
              for (len -= LOG_BASE;i4 < len; )
                x3.c.push(+str.slice(i4, i4 += LOG_BASE));
              i4 = LOG_BASE - (str = str.slice(i4)).length;
            } else
              i4 -= len;
            for (;i4--; str += "0")
              ;
            x3.c.push(+str);
          }
        } else
          x3.c = [x3.e = 0];
      }
      BigNumber2.clone = clone3, BigNumber2.ROUND_UP = 0, BigNumber2.ROUND_DOWN = 1, BigNumber2.ROUND_CEIL = 2, BigNumber2.ROUND_FLOOR = 3, BigNumber2.ROUND_HALF_UP = 4, BigNumber2.ROUND_HALF_DOWN = 5, BigNumber2.ROUND_HALF_EVEN = 6, BigNumber2.ROUND_HALF_CEIL = 7, BigNumber2.ROUND_HALF_FLOOR = 8, BigNumber2.EUCLID = 9, BigNumber2.config = BigNumber2.set = function(obj) {
        var p4, v2;
        if (obj != null)
          if (typeof obj == "object") {
            if (obj.hasOwnProperty(p4 = "DECIMAL_PLACES"))
              v2 = obj[p4], intCheck(v2, 0, MAX, p4), DECIMAL_PLACES = v2;
            if (obj.hasOwnProperty(p4 = "ROUNDING_MODE"))
              v2 = obj[p4], intCheck(v2, 0, 8, p4), ROUNDING_MODE = v2;
            if (obj.hasOwnProperty(p4 = "EXPONENTIAL_AT"))
              if (v2 = obj[p4], v2 && v2.pop)
                intCheck(v2[0], -MAX, 0, p4), intCheck(v2[1], 0, MAX, p4), TO_EXP_NEG = v2[0], TO_EXP_POS = v2[1];
              else
                intCheck(v2, -MAX, MAX, p4), TO_EXP_NEG = -(TO_EXP_POS = v2 < 0 ? -v2 : v2);
            if (obj.hasOwnProperty(p4 = "RANGE"))
              if (v2 = obj[p4], v2 && v2.pop)
                intCheck(v2[0], -MAX, -1, p4), intCheck(v2[1], 1, MAX, p4), MIN_EXP = v2[0], MAX_EXP = v2[1];
              else if (intCheck(v2, -MAX, MAX, p4), v2)
                MIN_EXP = -(MAX_EXP = v2 < 0 ? -v2 : v2);
              else
                throw Error(bignumberError + p4 + " cannot be zero: " + v2);
            if (obj.hasOwnProperty(p4 = "CRYPTO"))
              if (v2 = obj[p4], v2 === !!v2)
                if (v2)
                  if (typeof crypto < "u" && crypto && (crypto.getRandomValues || crypto.randomBytes))
                    CRYPTO = v2;
                  else
                    throw CRYPTO = !v2, Error(bignumberError + "crypto unavailable");
                else
                  CRYPTO = v2;
              else
                throw Error(bignumberError + p4 + " not true or false: " + v2);
            if (obj.hasOwnProperty(p4 = "MODULO_MODE"))
              v2 = obj[p4], intCheck(v2, 0, 9, p4), MODULO_MODE = v2;
            if (obj.hasOwnProperty(p4 = "POW_PRECISION"))
              v2 = obj[p4], intCheck(v2, 0, MAX, p4), POW_PRECISION = v2;
            if (obj.hasOwnProperty(p4 = "FORMAT"))
              if (v2 = obj[p4], typeof v2 == "object")
                FORMAT = v2;
              else
                throw Error(bignumberError + p4 + " not an object: " + v2);
            if (obj.hasOwnProperty(p4 = "ALPHABET"))
              if (v2 = obj[p4], typeof v2 == "string" && !/^.?$|[+\-.\s]|(.).*\1/.test(v2))
                alphabetHasNormalDecimalDigits = v2.slice(0, 10) == "0123456789", ALPHABET2 = v2;
              else
                throw Error(bignumberError + p4 + " invalid: " + v2);
          } else
            throw Error(bignumberError + "Object expected: " + obj);
        return {
          DECIMAL_PLACES,
          ROUNDING_MODE,
          EXPONENTIAL_AT: [TO_EXP_NEG, TO_EXP_POS],
          RANGE: [MIN_EXP, MAX_EXP],
          CRYPTO,
          MODULO_MODE,
          POW_PRECISION,
          FORMAT,
          ALPHABET: ALPHABET2
        };
      }, BigNumber2.isBigNumber = function(v2) {
        if (!v2 || v2._isBigNumber !== !0)
          return !1;
        if (!BigNumber2.DEBUG)
          return !0;
        var i4, n5, c3 = v2.c, e = v2.e, s2 = v2.s;
        out:
          if ({}.toString.call(c3) == "[object Array]") {
            if ((s2 === 1 || s2 === -1) && e >= -MAX && e <= MAX && e === mathfloor(e)) {
              if (c3[0] === 0) {
                if (e === 0 && c3.length === 1)
                  return !0;
                break out;
              }
              if (i4 = (e + 1) % LOG_BASE, i4 < 1)
                i4 += LOG_BASE;
              if (String(c3[0]).length == i4) {
                for (i4 = 0;i4 < c3.length; i4++)
                  if (n5 = c3[i4], n5 < 0 || n5 >= BASE || n5 !== mathfloor(n5))
                    break out;
                if (n5 !== 0)
                  return !0;
              }
            }
          } else if (c3 === null && e === null && (s2 === null || s2 === 1 || s2 === -1))
            return !0;
        throw Error(bignumberError + "Invalid BigNumber: " + v2);
      }, BigNumber2.maximum = BigNumber2.max = function() {
        return maxOrMin(arguments, -1);
      }, BigNumber2.minimum = BigNumber2.min = function() {
        return maxOrMin(arguments, 1);
      }, BigNumber2.random = function() {
        var pow2_53 = 9007199254740992, random53bitInt = Math.random() * pow2_53 & 2097151 ? function() {
          return mathfloor(Math.random() * pow2_53);
        } : function() {
          return (Math.random() * 1073741824 | 0) * 8388608 + (Math.random() * 8388608 | 0);
        };
        return function(dp) {
          var a2, b, e, k3, v2, i4 = 0, c3 = [], rand = new BigNumber2(ONE);
          if (dp == null)
            dp = DECIMAL_PLACES;
          else
            intCheck(dp, 0, MAX);
          if (k3 = mathceil(dp / LOG_BASE), CRYPTO)
            if (crypto.getRandomValues) {
              a2 = crypto.getRandomValues(new Uint32Array(k3 *= 2));
              for (;i4 < k3; )
                if (v2 = a2[i4] * 131072 + (a2[i4 + 1] >>> 11), v2 >= 9000000000000000)
                  b = crypto.getRandomValues(new Uint32Array(2)), a2[i4] = b[0], a2[i4 + 1] = b[1];
                else
                  c3.push(v2 % 100000000000000), i4 += 2;
              i4 = k3 / 2;
            } else if (crypto.randomBytes) {
              a2 = crypto.randomBytes(k3 *= 7);
              for (;i4 < k3; )
                if (v2 = (a2[i4] & 31) * 281474976710656 + a2[i4 + 1] * 1099511627776 + a2[i4 + 2] * 4294967296 + a2[i4 + 3] * 16777216 + (a2[i4 + 4] << 16) + (a2[i4 + 5] << 8) + a2[i4 + 6], v2 >= 9000000000000000)
                  crypto.randomBytes(7).copy(a2, i4);
                else
                  c3.push(v2 % 100000000000000), i4 += 7;
              i4 = k3 / 7;
            } else
              throw CRYPTO = !1, Error(bignumberError + "crypto unavailable");
          if (!CRYPTO) {
            for (;i4 < k3; )
              if (v2 = random53bitInt(), v2 < 9000000000000000)
                c3[i4++] = v2 % 100000000000000;
          }
          if (k3 = c3[--i4], dp %= LOG_BASE, k3 && dp)
            v2 = POWS_TEN[LOG_BASE - dp], c3[i4] = mathfloor(k3 / v2) * v2;
          for (;c3[i4] === 0; c3.pop(), i4--)
            ;
          if (i4 < 0)
            c3 = [e = 0];
          else {
            for (e = -1;c3[0] === 0; c3.splice(0, 1), e -= LOG_BASE)
              ;
            for (i4 = 1, v2 = c3[0];v2 >= 10; v2 /= 10, i4++)
              ;
            if (i4 < LOG_BASE)
              e -= LOG_BASE - i4;
          }
          return rand.e = e, rand.c = c3, rand;
        };
      }(), BigNumber2.sum = function() {
        var i4 = 1, args = arguments, sum = new BigNumber2(args[0]);
        for (;i4 < args.length; )
          sum = sum.plus(args[i4++]);
        return sum;
      }, convertBase = function() {
        var decimal = "0123456789";
        function toBaseOut(str, baseIn, baseOut, alphabet) {
          var j4, arr = [0], arrL, i4 = 0, len = str.length;
          for (;i4 < len; ) {
            for (arrL = arr.length;arrL--; arr[arrL] *= baseIn)
              ;
            arr[0] += alphabet.indexOf(str.charAt(i4++));
            for (j4 = 0;j4 < arr.length; j4++)
              if (arr[j4] > baseOut - 1) {
                if (arr[j4 + 1] == null)
                  arr[j4 + 1] = 0;
                arr[j4 + 1] += arr[j4] / baseOut | 0, arr[j4] %= baseOut;
              }
          }
          return arr.reverse();
        }
        return function(str, baseIn, baseOut, sign2, callerIsToString) {
          var alphabet, d, e, k3, r4, x3, xc, y2, i4 = str.indexOf("."), dp = DECIMAL_PLACES, rm = ROUNDING_MODE;
          if (i4 >= 0)
            k3 = POW_PRECISION, POW_PRECISION = 0, str = str.replace(".", ""), y2 = new BigNumber2(baseIn), x3 = y2.pow(str.length - i4), POW_PRECISION = k3, y2.c = toBaseOut(toFixedPoint(coeffToString(x3.c), x3.e, "0"), 10, baseOut, decimal), y2.e = y2.c.length;
          xc = toBaseOut(str, baseIn, baseOut, callerIsToString ? (alphabet = ALPHABET2, decimal) : (alphabet = decimal, ALPHABET2)), e = k3 = xc.length;
          for (;xc[--k3] == 0; xc.pop())
            ;
          if (!xc[0])
            return alphabet.charAt(0);
          if (i4 < 0)
            --e;
          else
            x3.c = xc, x3.e = e, x3.s = sign2, x3 = div(x3, y2, dp, rm, baseOut), xc = x3.c, r4 = x3.r, e = x3.e;
          if (d = e + dp + 1, i4 = xc[d], k3 = baseOut / 2, r4 = r4 || d < 0 || xc[d + 1] != null, r4 = rm < 4 ? (i4 != null || r4) && (rm == 0 || rm == (x3.s < 0 ? 3 : 2)) : i4 > k3 || i4 == k3 && (rm == 4 || r4 || rm == 6 && xc[d - 1] & 1 || rm == (x3.s < 0 ? 8 : 7)), d < 1 || !xc[0])
            str = r4 ? toFixedPoint(alphabet.charAt(1), -dp, alphabet.charAt(0)) : alphabet.charAt(0);
          else {
            if (xc.length = d, r4) {
              for (--baseOut;++xc[--d] > baseOut; )
                if (xc[d] = 0, !d)
                  ++e, xc = [1].concat(xc);
            }
            for (k3 = xc.length;!xc[--k3]; )
              ;
            for (i4 = 0, str = "";i4 <= k3; str += alphabet.charAt(xc[i4++]))
              ;
            str = toFixedPoint(str, e, alphabet.charAt(0));
          }
          return str;
        };
      }(), div = function() {
        function multiply(x3, k3, base2) {
          var m4, temp, xlo, xhi, carry = 0, i4 = x3.length, klo = k3 % SQRT_BASE, khi = k3 / SQRT_BASE | 0;
          for (x3 = x3.slice();i4--; )
            xlo = x3[i4] % SQRT_BASE, xhi = x3[i4] / SQRT_BASE | 0, m4 = khi * xlo + xhi * klo, temp = klo * xlo + m4 % SQRT_BASE * SQRT_BASE + carry, carry = (temp / base2 | 0) + (m4 / SQRT_BASE | 0) + khi * xhi, x3[i4] = temp % base2;
          if (carry)
            x3 = [carry].concat(x3);
          return x3;
        }
        function compare2(a2, b, aL, bL) {
          var i4, cmp;
          if (aL != bL)
            cmp = aL > bL ? 1 : -1;
          else
            for (i4 = cmp = 0;i4 < aL; i4++)
              if (a2[i4] != b[i4]) {
                cmp = a2[i4] > b[i4] ? 1 : -1;
                break;
              }
          return cmp;
        }
        function subtract(a2, b, aL, base2) {
          var i4 = 0;
          for (;aL--; )
            a2[aL] -= i4, i4 = a2[aL] < b[aL] ? 1 : 0, a2[aL] = i4 * base2 + a2[aL] - b[aL];
          for (;!a2[0] && a2.length > 1; a2.splice(0, 1))
            ;
        }
        return function(x3, y2, dp, rm, base2) {
          var cmp, e, i4, more, n5, prod, prodL, q4, qc, rem, remL, rem0, xi, xL, yc0, yL, yz, s2 = x3.s == y2.s ? 1 : -1, xc = x3.c, yc = y2.c;
          if (!xc || !xc[0] || !yc || !yc[0])
            return new BigNumber2(!x3.s || !y2.s || (xc ? yc && xc[0] == yc[0] : !yc) ? NaN : xc && xc[0] == 0 || !yc ? s2 * 0 : s2 / 0);
          if (q4 = new BigNumber2(s2), qc = q4.c = [], e = x3.e - y2.e, s2 = dp + e + 1, !base2)
            base2 = BASE, e = bitFloor(x3.e / LOG_BASE) - bitFloor(y2.e / LOG_BASE), s2 = s2 / LOG_BASE | 0;
          for (i4 = 0;yc[i4] == (xc[i4] || 0); i4++)
            ;
          if (yc[i4] > (xc[i4] || 0))
            e--;
          if (s2 < 0)
            qc.push(1), more = !0;
          else {
            if (xL = xc.length, yL = yc.length, i4 = 0, s2 += 2, n5 = mathfloor(base2 / (yc[0] + 1)), n5 > 1)
              yc = multiply(yc, n5, base2), xc = multiply(xc, n5, base2), yL = yc.length, xL = xc.length;
            xi = yL, rem = xc.slice(0, yL), remL = rem.length;
            for (;remL < yL; rem[remL++] = 0)
              ;
            if (yz = yc.slice(), yz = [0].concat(yz), yc0 = yc[0], yc[1] >= base2 / 2)
              yc0++;
            do {
              if (n5 = 0, cmp = compare2(yc, rem, yL, remL), cmp < 0) {
                if (rem0 = rem[0], yL != remL)
                  rem0 = rem0 * base2 + (rem[1] || 0);
                if (n5 = mathfloor(rem0 / yc0), n5 > 1) {
                  if (n5 >= base2)
                    n5 = base2 - 1;
                  prod = multiply(yc, n5, base2), prodL = prod.length, remL = rem.length;
                  while (compare2(prod, rem, prodL, remL) == 1)
                    n5--, subtract(prod, yL < prodL ? yz : yc, prodL, base2), prodL = prod.length, cmp = 1;
                } else {
                  if (n5 == 0)
                    cmp = n5 = 1;
                  prod = yc.slice(), prodL = prod.length;
                }
                if (prodL < remL)
                  prod = [0].concat(prod);
                if (subtract(rem, prod, remL, base2), remL = rem.length, cmp == -1)
                  while (compare2(yc, rem, yL, remL) < 1)
                    n5++, subtract(rem, yL < remL ? yz : yc, remL, base2), remL = rem.length;
              } else if (cmp === 0)
                n5++, rem = [0];
              if (qc[i4++] = n5, rem[0])
                rem[remL++] = xc[xi] || 0;
              else
                rem = [xc[xi]], remL = 1;
            } while ((xi++ < xL || rem[0] != null) && s2--);
            if (more = rem[0] != null, !qc[0])
              qc.splice(0, 1);
          }
          if (base2 == BASE) {
            for (i4 = 1, s2 = qc[0];s2 >= 10; s2 /= 10, i4++)
              ;
            round(q4, dp + (q4.e = i4 + e * LOG_BASE - 1) + 1, rm, more);
          } else
            q4.e = e, q4.r = +more;
          return q4;
        };
      }();
      function format3(n5, i4, rm, id) {
        var c0, e, ne, len, str;
        if (rm == null)
          rm = ROUNDING_MODE;
        else
          intCheck(rm, 0, 8);
        if (!n5.c)
          return n5.toString();
        if (c0 = n5.c[0], ne = n5.e, i4 == null)
          str = coeffToString(n5.c), str = id == 1 || id == 2 && (ne <= TO_EXP_NEG || ne >= TO_EXP_POS) ? toExponential(str, ne) : toFixedPoint(str, ne, "0");
        else if (n5 = round(new BigNumber2(n5), i4, rm), e = n5.e, str = coeffToString(n5.c), len = str.length, id == 1 || id == 2 && (i4 <= e || e <= TO_EXP_NEG)) {
          for (;len < i4; str += "0", len++)
            ;
          str = toExponential(str, e);
        } else if (i4 -= ne + (id === 2 && e > ne), str = toFixedPoint(str, e, "0"), e + 1 > len) {
          if (--i4 > 0)
            for (str += ".";i4--; str += "0")
              ;
        } else if (i4 += e - len, i4 > 0) {
          if (e + 1 == len)
            str += ".";
          for (;i4--; str += "0")
            ;
        }
        return n5.s < 0 && c0 ? "-" + str : str;
      }
      function maxOrMin(args, n5) {
        var k3, y2, i4 = 1, x3 = new BigNumber2(args[0]);
        for (;i4 < args.length; i4++)
          if (y2 = new BigNumber2(args[i4]), !y2.s || (k3 = compare(x3, y2)) === n5 || k3 === 0 && x3.s === n5)
            x3 = y2;
        return x3;
      }
      function normalise(n5, c3, e) {
        var i4 = 1, j4 = c3.length;
        for (;!c3[--j4]; c3.pop())
          ;
        for (j4 = c3[0];j4 >= 10; j4 /= 10, i4++)
          ;
        if ((e = i4 + e * LOG_BASE - 1) > MAX_EXP)
          n5.c = n5.e = null;
        else if (e < MIN_EXP)
          n5.c = [n5.e = 0];
        else
          n5.e = e, n5.c = c3;
        return n5;
      }
      parseNumeric = function() {
        var basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i, dotAfter = /^([^.]+)\.$/, dotBefore = /^\.([^.]+)$/, isInfinityOrNaN = /^-?(Infinity|NaN)$/, whitespaceOrPlus = /^\s*\+(?=[\w.])|^\s+|\s+$/g;
        return function(x3, str, isNum, b) {
          var base2, s2 = isNum ? str : str.replace(whitespaceOrPlus, "");
          if (isInfinityOrNaN.test(s2))
            x3.s = isNaN(s2) ? null : s2 < 0 ? -1 : 1;
          else {
            if (!isNum) {
              if (s2 = s2.replace(basePrefix, function(m4, p1, p22) {
                return base2 = (p22 = p22.toLowerCase()) == "x" ? 16 : p22 == "b" ? 2 : 8, !b || b == base2 ? p1 : m4;
              }), b)
                base2 = b, s2 = s2.replace(dotAfter, "$1").replace(dotBefore, "0.$1");
              if (str != s2)
                return new BigNumber2(s2, base2);
            }
            if (BigNumber2.DEBUG)
              throw Error(bignumberError + "Not a" + (b ? " base " + b : "") + " number: " + str);
            x3.s = null;
          }
          x3.c = x3.e = null;
        };
      }();
      function round(x3, sd, rm, r4) {
        var d, i4, j4, k3, n5, ni, rd, xc = x3.c, pows10 = POWS_TEN;
        if (xc) {
          out: {
            for (d = 1, k3 = xc[0];k3 >= 10; k3 /= 10, d++)
              ;
            if (i4 = sd - d, i4 < 0)
              i4 += LOG_BASE, j4 = sd, n5 = xc[ni = 0], rd = mathfloor(n5 / pows10[d - j4 - 1] % 10);
            else if (ni = mathceil((i4 + 1) / LOG_BASE), ni >= xc.length)
              if (r4) {
                for (;xc.length <= ni; xc.push(0))
                  ;
                n5 = rd = 0, d = 1, i4 %= LOG_BASE, j4 = i4 - LOG_BASE + 1;
              } else
                break out;
            else {
              n5 = k3 = xc[ni];
              for (d = 1;k3 >= 10; k3 /= 10, d++)
                ;
              i4 %= LOG_BASE, j4 = i4 - LOG_BASE + d, rd = j4 < 0 ? 0 : mathfloor(n5 / pows10[d - j4 - 1] % 10);
            }
            if (r4 = r4 || sd < 0 || xc[ni + 1] != null || (j4 < 0 ? n5 : n5 % pows10[d - j4 - 1]), r4 = rm < 4 ? (rd || r4) && (rm == 0 || rm == (x3.s < 0 ? 3 : 2)) : rd > 5 || rd == 5 && (rm == 4 || r4 || rm == 6 && (i4 > 0 ? j4 > 0 ? n5 / pows10[d - j4] : 0 : xc[ni - 1]) % 10 & 1 || rm == (x3.s < 0 ? 8 : 7)), sd < 1 || !xc[0]) {
              if (xc.length = 0, r4)
                sd -= x3.e + 1, xc[0] = pows10[(LOG_BASE - sd % LOG_BASE) % LOG_BASE], x3.e = -sd || 0;
              else
                xc[0] = x3.e = 0;
              return x3;
            }
            if (i4 == 0)
              xc.length = ni, k3 = 1, ni--;
            else
              xc.length = ni + 1, k3 = pows10[LOG_BASE - i4], xc[ni] = j4 > 0 ? mathfloor(n5 / pows10[d - j4] % pows10[j4]) * k3 : 0;
            if (r4)
              for (;; )
                if (ni == 0) {
                  for (i4 = 1, j4 = xc[0];j4 >= 10; j4 /= 10, i4++)
                    ;
                  j4 = xc[0] += k3;
                  for (k3 = 1;j4 >= 10; j4 /= 10, k3++)
                    ;
                  if (i4 != k3) {
                    if (x3.e++, xc[0] == BASE)
                      xc[0] = 1;
                  }
                  break;
                } else {
                  if (xc[ni] += k3, xc[ni] != BASE)
                    break;
                  xc[ni--] = 0, k3 = 1;
                }
            for (i4 = xc.length;xc[--i4] === 0; xc.pop())
              ;
          }
          if (x3.e > MAX_EXP)
            x3.c = x3.e = null;
          else if (x3.e < MIN_EXP)
            x3.c = [x3.e = 0];
        }
        return x3;
      }
      function valueOf(n5) {
        var str, e = n5.e;
        if (e === null)
          return n5.toString();
        return str = coeffToString(n5.c), str = e <= TO_EXP_NEG || e >= TO_EXP_POS ? toExponential(str, e) : toFixedPoint(str, e, "0"), n5.s < 0 ? "-" + str : str;
      }
      if (P2.absoluteValue = P2.abs = function() {
        var x3 = new BigNumber2(this);
        if (x3.s < 0)
          x3.s = 1;
        return x3;
      }, P2.comparedTo = function(y2, b) {
        return compare(this, new BigNumber2(y2, b));
      }, P2.decimalPlaces = P2.dp = function(dp, rm) {
        var c3, n5, v2, x3 = this;
        if (dp != null) {
          if (intCheck(dp, 0, MAX), rm == null)
            rm = ROUNDING_MODE;
          else
            intCheck(rm, 0, 8);
          return round(new BigNumber2(x3), dp + x3.e + 1, rm);
        }
        if (!(c3 = x3.c))
          return null;
        if (n5 = ((v2 = c3.length - 1) - bitFloor(this.e / LOG_BASE)) * LOG_BASE, v2 = c3[v2])
          for (;v2 % 10 == 0; v2 /= 10, n5--)
            ;
        if (n5 < 0)
          n5 = 0;
        return n5;
      }, P2.dividedBy = P2.div = function(y2, b) {
        return div(this, new BigNumber2(y2, b), DECIMAL_PLACES, ROUNDING_MODE);
      }, P2.dividedToIntegerBy = P2.idiv = function(y2, b) {
        return div(this, new BigNumber2(y2, b), 0, 1);
      }, P2.exponentiatedBy = P2.pow = function(n5, m4) {
        var half, isModExp, i4, k3, more, nIsBig, nIsNeg, nIsOdd, y2, x3 = this;
        if (n5 = new BigNumber2(n5), n5.c && !n5.isInteger())
          throw Error(bignumberError + "Exponent not an integer: " + valueOf(n5));
        if (m4 != null)
          m4 = new BigNumber2(m4);
        if (nIsBig = n5.e > 14, !x3.c || !x3.c[0] || x3.c[0] == 1 && !x3.e && x3.c.length == 1 || !n5.c || !n5.c[0])
          return y2 = new BigNumber2(Math.pow(+valueOf(x3), nIsBig ? n5.s * (2 - isOdd(n5)) : +valueOf(n5))), m4 ? y2.mod(m4) : y2;
        if (nIsNeg = n5.s < 0, m4) {
          if (m4.c ? !m4.c[0] : !m4.s)
            return new BigNumber2(NaN);
          if (isModExp = !nIsNeg && x3.isInteger() && m4.isInteger(), isModExp)
            x3 = x3.mod(m4);
        } else if (n5.e > 9 && (x3.e > 0 || x3.e < -1 || (x3.e == 0 ? x3.c[0] > 1 || nIsBig && x3.c[1] >= 240000000 : x3.c[0] < 80000000000000 || nIsBig && x3.c[0] <= 99999750000000))) {
          if (k3 = x3.s < 0 && isOdd(n5) ? -0 : 0, x3.e > -1)
            k3 = 1 / k3;
          return new BigNumber2(nIsNeg ? 1 / k3 : k3);
        } else if (POW_PRECISION)
          k3 = mathceil(POW_PRECISION / LOG_BASE + 2);
        if (nIsBig) {
          if (half = new BigNumber2(0.5), nIsNeg)
            n5.s = 1;
          nIsOdd = isOdd(n5);
        } else
          i4 = Math.abs(+valueOf(n5)), nIsOdd = i4 % 2;
        y2 = new BigNumber2(ONE);
        for (;; ) {
          if (nIsOdd) {
            if (y2 = y2.times(x3), !y2.c)
              break;
            if (k3) {
              if (y2.c.length > k3)
                y2.c.length = k3;
            } else if (isModExp)
              y2 = y2.mod(m4);
          }
          if (i4) {
            if (i4 = mathfloor(i4 / 2), i4 === 0)
              break;
            nIsOdd = i4 % 2;
          } else if (n5 = n5.times(half), round(n5, n5.e + 1, 1), n5.e > 14)
            nIsOdd = isOdd(n5);
          else {
            if (i4 = +valueOf(n5), i4 === 0)
              break;
            nIsOdd = i4 % 2;
          }
          if (x3 = x3.times(x3), k3) {
            if (x3.c && x3.c.length > k3)
              x3.c.length = k3;
          } else if (isModExp)
            x3 = x3.mod(m4);
        }
        if (isModExp)
          return y2;
        if (nIsNeg)
          y2 = ONE.div(y2);
        return m4 ? y2.mod(m4) : k3 ? round(y2, POW_PRECISION, ROUNDING_MODE, more) : y2;
      }, P2.integerValue = function(rm) {
        var n5 = new BigNumber2(this);
        if (rm == null)
          rm = ROUNDING_MODE;
        else
          intCheck(rm, 0, 8);
        return round(n5, n5.e + 1, rm);
      }, P2.isEqualTo = P2.eq = function(y2, b) {
        return compare(this, new BigNumber2(y2, b)) === 0;
      }, P2.isFinite = function() {
        return !!this.c;
      }, P2.isGreaterThan = P2.gt = function(y2, b) {
        return compare(this, new BigNumber2(y2, b)) > 0;
      }, P2.isGreaterThanOrEqualTo = P2.gte = function(y2, b) {
        return (b = compare(this, new BigNumber2(y2, b))) === 1 || b === 0;
      }, P2.isInteger = function() {
        return !!this.c && bitFloor(this.e / LOG_BASE) > this.c.length - 2;
      }, P2.isLessThan = P2.lt = function(y2, b) {
        return compare(this, new BigNumber2(y2, b)) < 0;
      }, P2.isLessThanOrEqualTo = P2.lte = function(y2, b) {
        return (b = compare(this, new BigNumber2(y2, b))) === -1 || b === 0;
      }, P2.isNaN = function() {
        return !this.s;
      }, P2.isNegative = function() {
        return this.s < 0;
      }, P2.isPositive = function() {
        return this.s > 0;
      }, P2.isZero = function() {
        return !!this.c && this.c[0] == 0;
      }, P2.minus = function(y2, b) {
        var i4, j4, t2, xLTy, x3 = this, a2 = x3.s;
        if (y2 = new BigNumber2(y2, b), b = y2.s, !a2 || !b)
          return new BigNumber2(NaN);
        if (a2 != b)
          return y2.s = -b, x3.plus(y2);
        var xe = x3.e / LOG_BASE, ye = y2.e / LOG_BASE, xc = x3.c, yc = y2.c;
        if (!xe || !ye) {
          if (!xc || !yc)
            return xc ? (y2.s = -b, y2) : new BigNumber2(yc ? x3 : NaN);
          if (!xc[0] || !yc[0])
            return yc[0] ? (y2.s = -b, y2) : new BigNumber2(xc[0] ? x3 : ROUNDING_MODE == 3 ? -0 : 0);
        }
        if (xe = bitFloor(xe), ye = bitFloor(ye), xc = xc.slice(), a2 = xe - ye) {
          if (xLTy = a2 < 0)
            a2 = -a2, t2 = xc;
          else
            ye = xe, t2 = yc;
          t2.reverse();
          for (b = a2;b--; t2.push(0))
            ;
          t2.reverse();
        } else {
          j4 = (xLTy = (a2 = xc.length) < (b = yc.length)) ? a2 : b;
          for (a2 = b = 0;b < j4; b++)
            if (xc[b] != yc[b]) {
              xLTy = xc[b] < yc[b];
              break;
            }
        }
        if (xLTy)
          t2 = xc, xc = yc, yc = t2, y2.s = -y2.s;
        if (b = (j4 = yc.length) - (i4 = xc.length), b > 0)
          for (;b--; xc[i4++] = 0)
            ;
        b = BASE - 1;
        for (;j4 > a2; ) {
          if (xc[--j4] < yc[j4]) {
            for (i4 = j4;i4 && !xc[--i4]; xc[i4] = b)
              ;
            --xc[i4], xc[j4] += BASE;
          }
          xc[j4] -= yc[j4];
        }
        for (;xc[0] == 0; xc.splice(0, 1), --ye)
          ;
        if (!xc[0])
          return y2.s = ROUNDING_MODE == 3 ? -1 : 1, y2.c = [y2.e = 0], y2;
        return normalise(y2, xc, ye);
      }, P2.modulo = P2.mod = function(y2, b) {
        var q4, s2, x3 = this;
        if (y2 = new BigNumber2(y2, b), !x3.c || !y2.s || y2.c && !y2.c[0])
          return new BigNumber2(NaN);
        else if (!y2.c || x3.c && !x3.c[0])
          return new BigNumber2(x3);
        if (MODULO_MODE == 9)
          s2 = y2.s, y2.s = 1, q4 = div(x3, y2, 0, 3), y2.s = s2, q4.s *= s2;
        else
          q4 = div(x3, y2, 0, MODULO_MODE);
        if (y2 = x3.minus(q4.times(y2)), !y2.c[0] && MODULO_MODE == 1)
          y2.s = x3.s;
        return y2;
      }, P2.multipliedBy = P2.times = function(y2, b) {
        var c3, e, i4, j4, k3, m4, xcL, xlo, xhi, ycL, ylo, yhi, zc, base2, sqrtBase, x3 = this, xc = x3.c, yc = (y2 = new BigNumber2(y2, b)).c;
        if (!xc || !yc || !xc[0] || !yc[0]) {
          if (!x3.s || !y2.s || xc && !xc[0] && !yc || yc && !yc[0] && !xc)
            y2.c = y2.e = y2.s = null;
          else if (y2.s *= x3.s, !xc || !yc)
            y2.c = y2.e = null;
          else
            y2.c = [0], y2.e = 0;
          return y2;
        }
        if (e = bitFloor(x3.e / LOG_BASE) + bitFloor(y2.e / LOG_BASE), y2.s *= x3.s, xcL = xc.length, ycL = yc.length, xcL < ycL)
          zc = xc, xc = yc, yc = zc, i4 = xcL, xcL = ycL, ycL = i4;
        for (i4 = xcL + ycL, zc = [];i4--; zc.push(0))
          ;
        base2 = BASE, sqrtBase = SQRT_BASE;
        for (i4 = ycL;--i4 >= 0; ) {
          c3 = 0, ylo = yc[i4] % sqrtBase, yhi = yc[i4] / sqrtBase | 0;
          for (k3 = xcL, j4 = i4 + k3;j4 > i4; )
            xlo = xc[--k3] % sqrtBase, xhi = xc[k3] / sqrtBase | 0, m4 = yhi * xlo + xhi * ylo, xlo = ylo * xlo + m4 % sqrtBase * sqrtBase + zc[j4] + c3, c3 = (xlo / base2 | 0) + (m4 / sqrtBase | 0) + yhi * xhi, zc[j4--] = xlo % base2;
          zc[j4] = c3;
        }
        if (c3)
          ++e;
        else
          zc.splice(0, 1);
        return normalise(y2, zc, e);
      }, P2.negated = function() {
        var x3 = new BigNumber2(this);
        return x3.s = -x3.s || null, x3;
      }, P2.plus = function(y2, b) {
        var t2, x3 = this, a2 = x3.s;
        if (y2 = new BigNumber2(y2, b), b = y2.s, !a2 || !b)
          return new BigNumber2(NaN);
        if (a2 != b)
          return y2.s = -b, x3.minus(y2);
        var xe = x3.e / LOG_BASE, ye = y2.e / LOG_BASE, xc = x3.c, yc = y2.c;
        if (!xe || !ye) {
          if (!xc || !yc)
            return new BigNumber2(a2 / 0);
          if (!xc[0] || !yc[0])
            return yc[0] ? y2 : new BigNumber2(xc[0] ? x3 : a2 * 0);
        }
        if (xe = bitFloor(xe), ye = bitFloor(ye), xc = xc.slice(), a2 = xe - ye) {
          if (a2 > 0)
            ye = xe, t2 = yc;
          else
            a2 = -a2, t2 = xc;
          t2.reverse();
          for (;a2--; t2.push(0))
            ;
          t2.reverse();
        }
        if (a2 = xc.length, b = yc.length, a2 - b < 0)
          t2 = yc, yc = xc, xc = t2, b = a2;
        for (a2 = 0;b; )
          a2 = (xc[--b] = xc[b] + yc[b] + a2) / BASE | 0, xc[b] = BASE === xc[b] ? 0 : xc[b] % BASE;
        if (a2)
          xc = [a2].concat(xc), ++ye;
        return normalise(y2, xc, ye);
      }, P2.precision = P2.sd = function(sd, rm) {
        var c3, n5, v2, x3 = this;
        if (sd != null && sd !== !!sd) {
          if (intCheck(sd, 1, MAX), rm == null)
            rm = ROUNDING_MODE;
          else
            intCheck(rm, 0, 8);
          return round(new BigNumber2(x3), sd, rm);
        }
        if (!(c3 = x3.c))
          return null;
        if (v2 = c3.length - 1, n5 = v2 * LOG_BASE + 1, v2 = c3[v2]) {
          for (;v2 % 10 == 0; v2 /= 10, n5--)
            ;
          for (v2 = c3[0];v2 >= 10; v2 /= 10, n5++)
            ;
        }
        if (sd && x3.e + 1 > n5)
          n5 = x3.e + 1;
        return n5;
      }, P2.shiftedBy = function(k3) {
        return intCheck(k3, -MAX_SAFE_INTEGER3, MAX_SAFE_INTEGER3), this.times("1e" + k3);
      }, P2.squareRoot = P2.sqrt = function() {
        var m4, n5, r4, rep, t2, x3 = this, c3 = x3.c, s2 = x3.s, e = x3.e, dp = DECIMAL_PLACES + 4, half = new BigNumber2("0.5");
        if (s2 !== 1 || !c3 || !c3[0])
          return new BigNumber2(!s2 || s2 < 0 && (!c3 || c3[0]) ? NaN : c3 ? x3 : 1 / 0);
        if (s2 = Math.sqrt(+valueOf(x3)), s2 == 0 || s2 == 1 / 0) {
          if (n5 = coeffToString(c3), (n5.length + e) % 2 == 0)
            n5 += "0";
          if (s2 = Math.sqrt(+n5), e = bitFloor((e + 1) / 2) - (e < 0 || e % 2), s2 == 1 / 0)
            n5 = "5e" + e;
          else
            n5 = s2.toExponential(), n5 = n5.slice(0, n5.indexOf("e") + 1) + e;
          r4 = new BigNumber2(n5);
        } else
          r4 = new BigNumber2(s2 + "");
        if (r4.c[0]) {
          if (e = r4.e, s2 = e + dp, s2 < 3)
            s2 = 0;
          for (;; )
            if (t2 = r4, r4 = half.times(t2.plus(div(x3, t2, dp, 1))), coeffToString(t2.c).slice(0, s2) === (n5 = coeffToString(r4.c)).slice(0, s2)) {
              if (r4.e < e)
                --s2;
              if (n5 = n5.slice(s2 - 3, s2 + 1), n5 == "9999" || !rep && n5 == "4999") {
                if (!rep) {
                  if (round(t2, t2.e + DECIMAL_PLACES + 2, 0), t2.times(t2).eq(x3)) {
                    r4 = t2;
                    break;
                  }
                }
                dp += 4, s2 += 4, rep = 1;
              } else {
                if (!+n5 || !+n5.slice(1) && n5.charAt(0) == "5")
                  round(r4, r4.e + DECIMAL_PLACES + 2, 1), m4 = !r4.times(r4).eq(x3);
                break;
              }
            }
        }
        return round(r4, r4.e + DECIMAL_PLACES + 1, ROUNDING_MODE, m4);
      }, P2.toExponential = function(dp, rm) {
        if (dp != null)
          intCheck(dp, 0, MAX), dp++;
        return format3(this, dp, rm, 1);
      }, P2.toFixed = function(dp, rm) {
        if (dp != null)
          intCheck(dp, 0, MAX), dp = dp + this.e + 1;
        return format3(this, dp, rm);
      }, P2.toFormat = function(dp, rm, format4) {
        var str, x3 = this;
        if (format4 == null)
          if (dp != null && rm && typeof rm == "object")
            format4 = rm, rm = null;
          else if (dp && typeof dp == "object")
            format4 = dp, dp = rm = null;
          else
            format4 = FORMAT;
        else if (typeof format4 != "object")
          throw Error(bignumberError + "Argument not an object: " + format4);
        if (str = x3.toFixed(dp, rm), x3.c) {
          var i4, arr = str.split("."), g1 = +format4.groupSize, g2 = +format4.secondaryGroupSize, groupSeparator = format4.groupSeparator || "", intPart = arr[0], fractionPart = arr[1], isNeg = x3.s < 0, intDigits = isNeg ? intPart.slice(1) : intPart, len = intDigits.length;
          if (g2)
            i4 = g1, g1 = g2, g2 = i4, len -= i4;
          if (g1 > 0 && len > 0) {
            i4 = len % g1 || g1, intPart = intDigits.substr(0, i4);
            for (;i4 < len; i4 += g1)
              intPart += groupSeparator + intDigits.substr(i4, g1);
            if (g2 > 0)
              intPart += groupSeparator + intDigits.slice(i4);
            if (isNeg)
              intPart = "-" + intPart;
          }
          str = fractionPart ? intPart + (format4.decimalSeparator || "") + ((g2 = +format4.fractionGroupSize) ? fractionPart.replace(new RegExp("\\d{" + g2 + "}\\B", "g"), "$&" + (format4.fractionGroupSeparator || "")) : fractionPart) : intPart;
        }
        return (format4.prefix || "") + str + (format4.suffix || "");
      }, P2.toFraction = function(md) {
        var d, d0, d1, d2, e, exp, n5, n0, n1, q4, r4, s2, x3 = this, xc = x3.c;
        if (md != null) {
          if (n5 = new BigNumber2(md), !n5.isInteger() && (n5.c || n5.s !== 1) || n5.lt(ONE))
            throw Error(bignumberError + "Argument " + (n5.isInteger() ? "out of range: " : "not an integer: ") + valueOf(n5));
        }
        if (!xc)
          return new BigNumber2(x3);
        d = new BigNumber2(ONE), n1 = d0 = new BigNumber2(ONE), d1 = n0 = new BigNumber2(ONE), s2 = coeffToString(xc), e = d.e = s2.length - x3.e - 1, d.c[0] = POWS_TEN[(exp = e % LOG_BASE) < 0 ? LOG_BASE + exp : exp], md = !md || n5.comparedTo(d) > 0 ? e > 0 ? d : n1 : n5, exp = MAX_EXP, MAX_EXP = 1 / 0, n5 = new BigNumber2(s2), n0.c[0] = 0;
        for (;; ) {
          if (q4 = div(n5, d, 0, 1), d2 = d0.plus(q4.times(d1)), d2.comparedTo(md) == 1)
            break;
          d0 = d1, d1 = d2, n1 = n0.plus(q4.times(d2 = n1)), n0 = d2, d = n5.minus(q4.times(d2 = d)), n5 = d2;
        }
        return d2 = div(md.minus(d0), d1, 0, 1), n0 = n0.plus(d2.times(n1)), d0 = d0.plus(d2.times(d1)), n0.s = n1.s = x3.s, e = e * 2, r4 = div(n1, d1, e, ROUNDING_MODE).minus(x3).abs().comparedTo(div(n0, d0, e, ROUNDING_MODE).minus(x3).abs()) < 1 ? [n1, d1] : [n0, d0], MAX_EXP = exp, r4;
      }, P2.toNumber = function() {
        return +valueOf(this);
      }, P2.toPrecision = function(sd, rm) {
        if (sd != null)
          intCheck(sd, 1, MAX);
        return format3(this, sd, rm, 2);
      }, P2.toString = function(b) {
        var str, n5 = this, s2 = n5.s, e = n5.e;
        if (e === null)
          if (s2) {
            if (str = "Infinity", s2 < 0)
              str = "-" + str;
          } else
            str = "NaN";
        else {
          if (b == null)
            str = e <= TO_EXP_NEG || e >= TO_EXP_POS ? toExponential(coeffToString(n5.c), e) : toFixedPoint(coeffToString(n5.c), e, "0");
          else if (b === 10 && alphabetHasNormalDecimalDigits)
            n5 = round(new BigNumber2(n5), DECIMAL_PLACES + e + 1, ROUNDING_MODE), str = toFixedPoint(coeffToString(n5.c), n5.e, "0");
          else
            intCheck(b, 2, ALPHABET2.length, "Base"), str = convertBase(toFixedPoint(coeffToString(n5.c), e, "0"), 10, b, s2, !0);
          if (s2 < 0 && n5.c[0])
            str = "-" + str;
        }
        return str;
      }, P2.valueOf = P2.toJSON = function() {
        return valueOf(this);
      }, P2._isBigNumber = !0, configObject != null)
        BigNumber2.set(configObject);
      return BigNumber2;
    }
    function bitFloor(n5) {
      var i4 = n5 | 0;
      return n5 > 0 || n5 === i4 ? i4 : i4 - 1;
    }
    function coeffToString(a2) {
      var s2, z2, i4 = 1, j4 = a2.length, r4 = a2[0] + "";
      for (;i4 < j4; ) {
        s2 = a2[i4++] + "", z2 = LOG_BASE - s2.length;
        for (;z2--; s2 = "0" + s2)
          ;
        r4 += s2;
      }
      for (j4 = r4.length;r4.charCodeAt(--j4) === 48; )
        ;
      return r4.slice(0, j4 + 1 || 1);
    }
    function compare(x3, y2) {
      var a2, b, xc = x3.c, yc = y2.c, i4 = x3.s, j4 = y2.s, k3 = x3.e, l3 = y2.e;
      if (!i4 || !j4)
        return null;
      if (a2 = xc && !xc[0], b = yc && !yc[0], a2 || b)
        return a2 ? b ? 0 : -j4 : i4;
      if (i4 != j4)
        return i4;
      if (a2 = i4 < 0, b = k3 == l3, !xc || !yc)
        return b ? 0 : !xc ^ a2 ? 1 : -1;
      if (!b)
        return k3 > l3 ^ a2 ? 1 : -1;
      j4 = (k3 = xc.length) < (l3 = yc.length) ? k3 : l3;
      for (i4 = 0;i4 < j4; i4++)
        if (xc[i4] != yc[i4])
          return xc[i4] > yc[i4] ^ a2 ? 1 : -1;
      return k3 == l3 ? 0 : k3 > l3 ^ a2 ? 1 : -1;
    }
    function intCheck(n5, min, max, name3) {
      if (n5 < min || n5 > max || n5 !== mathfloor(n5))
        throw Error(bignumberError + (name3 || "Argument") + (typeof n5 == "number" ? n5 < min || n5 > max ? " out of range: " : " not an integer: " : " not a primitive number: ") + String(n5));
    }
    function isOdd(n5) {
      var k3 = n5.c.length - 1;
      return bitFloor(n5.e / LOG_BASE) == k3 && n5.c[k3] % 2 != 0;
    }
    function toExponential(str, e) {
      return (str.length > 1 ? str.charAt(0) + "." + str.slice(1) : str) + (e < 0 ? "e" : "e+") + e;
    }
    function toFixedPoint(str, e, z2) {
      var len, zs;
      if (e < 0) {
        for (zs = z2 + ".";++e; zs += z2)
          ;
        str = zs + str;
      } else if (len = str.length, ++e > len) {
        for (zs = z2, e -= len;--e; zs += z2)
          ;
        str += zs;
      } else if (e < len)
        str = str.slice(0, e) + "." + str.slice(e);
      return str;
    }
    if (BigNumber = clone3(), BigNumber.default = BigNumber.BigNumber = BigNumber, typeof define == "function" && define.amd)
      define(function() {
        return BigNumber;
      });
    else if (typeof module < "u" && module.exports)
      module.exports = BigNumber;
    else {
      if (!globalObject)
        globalObject = typeof self < "u" && self ? self : window;
      globalObject.BigNumber = BigNumber;
    }
  })(exports);
});
