// Shared module state and imports
// Original: src/tools/FileWriteTool/prompt.ts

// node_modules/@inquirer/core/dist/esm/lib/key.mjs

// node_modules/@inquirer/core/dist/esm/lib/hook-engine.mjs
import { AsyncLocalStorage as AsyncLocalStorage3, AsyncResource } from "async_hooks";
var hookStorage, effectScheduler;

// node_modules/@inquirer/core/dist/esm/lib/use-state.mjs

// node_modules/@inquirer/core/dist/esm/lib/use-effect.mjs

// node_modules/yoctocolors-cjs/index.js

// node_modules/@inquirer/figures/dist/esm/index.js
import process21 from "process";
var common2, specialMainSymbols2, specialFallbackSymbols2, mainSymbols2, fallbackSymbols2, shouldUseMain2, figures2, esm_default2, replacements2;

// node_modules/@inquirer/core/dist/esm/lib/theme.mjs
var import_yoctocolors_cjs, defaultTheme;

// node_modules/@inquirer/core/dist/esm/lib/make-theme.mjs

// node_modules/@inquirer/core/dist/esm/lib/use-prefix.mjs
import { AsyncResource as AsyncResource2 } from "async_hooks";

// node_modules/@inquirer/core/dist/esm/lib/use-memo.mjs

// node_modules/@inquirer/core/dist/esm/lib/use-ref.mjs

// node_modules/@inquirer/core/dist/esm/lib/use-keypress.mjs

// node_modules/cli-width/index.js

// node_modules/@inquirer/core/node_modules/strip-ansi/node_modules/ansi-regex/index.js

// node_modules/@inquirer/core/node_modules/strip-ansi/index.js

// node_modules/@inquirer/core/node_modules/wrap-ansi/node_modules/string-width/node_modules/is-fullwidth-code-point/index.js

// node_modules/@inquirer/core/node_modules/wrap-ansi/node_modules/string-width/node_modules/emoji-regex/index.js

// node_modules/@inquirer/core/node_modules/wrap-ansi/node_modules/string-width/index.js

// node_modules/color-name/index.js

// node_modules/color-convert/conversions.js

// node_modules/color-convert/route.js

// node_modules/color-convert/index.js

// node_modules/@inquirer/core/node_modules/wrap-ansi/node_modules/ansi-styles/index.js

// node_modules/@inquirer/core/node_modules/wrap-ansi/index.js

// node_modules/@inquirer/core/dist/esm/lib/utils.mjs
var import_cli_width, import_wrap_ansi2;

// node_modules/@inquirer/core/dist/esm/lib/pagination/lines.mjs

// node_modules/@inquirer/core/dist/esm/lib/pagination/position.mjs

// node_modules/@inquirer/core/dist/esm/lib/pagination/use-pagination.mjs

// node_modules/mute-stream/lib/index.js

// node_modules/@inquirer/core/node_modules/ansi-escapes/index.js

// node_modules/@inquirer/core/dist/esm/lib/screen-manager.mjs

var import_strip_ansi5, import_ansi_escapes, height = (content) => content.split(`
`).length, lastLine = (content) => content.split(`
`).pop() ?? "";

// node_modules/@inquirer/core/dist/esm/lib/promise-polyfill.mjs
var PromisePolyfill;

// node_modules/@inquirer/core/dist/esm/lib/create-prompt.mjs
import * as readline2 from "readline";
import { AsyncResource as AsyncResource3 } from "async_hooks";
var import_mute_stream;

// node_modules/@inquirer/core/dist/esm/lib/Separator.mjs
var import_yoctocolors_cjs2;

// node_modules/@inquirer/core/dist/esm/index.mjs

// node_modules/@inquirer/confirm/dist/esm/index.mjs
var esm_default3;

// node_modules/@inquirer/input/dist/esm/index.mjs
var esm_default4;

// node_modules/@inquirer/select/node_modules/ansi-escapes/index.js

// node_modules/@inquirer/select/dist/esm/index.mjs
var import_yoctocolors_cjs3, import_ansi_escapes2, selectTheme, esm_default5;

// node_modules/@inquirer/prompts/dist/esm/index.mjs

// node_modules/@anthropic-ai/mcpb/dist/schemas/0.1.js
__export(exports_0_1, {
  McpbUserConfigurationOptionSchema: () => McpbUserConfigurationOptionSchema,
  McpbManifestToolSchema: () => McpbManifestToolSchema,
  McpbManifestServerSchema: () => McpbManifestServerSchema,
  McpbManifestSchema: () => McpbManifestSchema,
  McpbManifestRepositorySchema: () => McpbManifestRepositorySchema,
  McpbManifestPromptSchema: () => McpbManifestPromptSchema,
  McpbManifestPlatformOverrideSchema: () => McpbManifestPlatformOverrideSchema,
  McpbManifestMcpConfigSchema: () => McpbManifestMcpConfigSchema,
  McpbManifestCompatibilitySchema: () => McpbManifestCompatibilitySchema,
  McpbManifestAuthorSchema: () => McpbManifestAuthorSchema,
  McpServerConfigSchema: () => McpServerConfigSchema2,
  MANIFEST_VERSION: () => MANIFEST_VERSION
});

// node_modules/@anthropic-ai/mcpb/dist/schemas/0.2.js
__export(exports_0_2, {
  McpbUserConfigurationOptionSchema: () => McpbUserConfigurationOptionSchema2,
  McpbManifestToolSchema: () => McpbManifestToolSchema2,
  McpbManifestServerSchema: () => McpbManifestServerSchema2,
  McpbManifestSchema: () => McpbManifestSchema2,
  McpbManifestRepositorySchema: () => McpbManifestRepositorySchema2,
  McpbManifestPromptSchema: () => McpbManifestPromptSchema2,
  McpbManifestPlatformOverrideSchema: () => McpbManifestPlatformOverrideSchema2,
  McpbManifestMcpConfigSchema: () => McpbManifestMcpConfigSchema2,
  McpbManifestCompatibilitySchema: () => McpbManifestCompatibilitySchema2,
  McpbManifestAuthorSchema: () => McpbManifestAuthorSchema2,
  McpServerConfigSchema: () => McpServerConfigSchema3,
  MANIFEST_VERSION: () => MANIFEST_VERSION2
});

// node_modules/@anthropic-ai/mcpb/dist/schemas/0.3.js
__export(exports_0_3, {
  McpbUserConfigurationOptionSchema: () => McpbUserConfigurationOptionSchema3,
  McpbManifestToolSchema: () => McpbManifestToolSchema3,
  McpbManifestServerSchema: () => McpbManifestServerSchema3,
  McpbManifestSchema: () => McpbManifestSchema3,
  McpbManifestRepositorySchema: () => McpbManifestRepositorySchema3,
  McpbManifestPromptSchema: () => McpbManifestPromptSchema3,
  McpbManifestPlatformOverrideSchema: () => McpbManifestPlatformOverrideSchema3,
  McpbManifestMcpConfigSchema: () => McpbManifestMcpConfigSchema3,
  McpbManifestLocalizationSchema: () => McpbManifestLocalizationSchema,
  McpbManifestIconSchema: () => McpbManifestIconSchema,
  McpbManifestCompatibilitySchema: () => McpbManifestCompatibilitySchema3,
  McpbManifestAuthorSchema: () => McpbManifestAuthorSchema3,
  McpServerConfigSchema: () => McpServerConfigSchema4,
  MANIFEST_VERSION: () => MANIFEST_VERSION3
});

// node_modules/@anthropic-ai/mcpb/dist/schemas/0.4.js
__export(exports_0_4, {
  McpbUserConfigurationOptionSchema: () => McpbUserConfigurationOptionSchema4,
  McpbManifestToolSchema: () => McpbManifestToolSchema4,
  McpbManifestServerSchema: () => McpbManifestServerSchema4,
  McpbManifestSchema: () => McpbManifestSchema4,
  McpbManifestRepositorySchema: () => McpbManifestRepositorySchema4,
  McpbManifestPromptSchema: () => McpbManifestPromptSchema4,
  McpbManifestPlatformOverrideSchema: () => McpbManifestPlatformOverrideSchema4,
  McpbManifestMcpConfigSchema: () => McpbManifestMcpConfigSchema4,
  McpbManifestLocalizationSchema: () => McpbManifestLocalizationSchema2,
  McpbManifestIconSchema: () => McpbManifestIconSchema2,
  McpbManifestCompatibilitySchema: () => McpbManifestCompatibilitySchema4,
  McpbManifestAuthorSchema: () => McpbManifestAuthorSchema4,
  McpServerConfigSchema: () => McpServerConfigSchema5,
  MANIFEST_VERSION: () => MANIFEST_VERSION4
});

// node_modules/@anthropic-ai/mcpb/dist/schemas_loose/0.1.js

// node_modules/@anthropic-ai/mcpb/dist/schemas_loose/0.2.js

// node_modules/@anthropic-ai/mcpb/dist/schemas_loose/0.3.js

// node_modules/@anthropic-ai/mcpb/dist/schemas_loose/0.4.js

// node_modules/@anthropic-ai/mcpb/dist/shared/constants.js

// node_modules/@anthropic-ai/mcpb/dist/cli/init.js
import { existsSync as existsSync7, readFileSync as readFileSync12, writeFileSync as writeFileSync3 } from "fs";
import { basename as basename7, join as join35, resolve as resolve19 } from "path";

// node_modules/fflate/esm/index.mjs
__export(exports_esm2, {
  zlibSync: () => zlibSync,
  zlib: () => zlib3,
  zipSync: () => zipSync,
  zip: () => zip,
  unzlibSync: () => unzlibSync,
  unzlib: () => unzlib,
  unzipSync: () => unzipSync,
  unzip: () => unzip,
  strToU8: () => strToU8,
  strFromU8: () => strFromU8,
  inflateSync: () => inflateSync,
  inflate: () => inflate,
  gzipSync: () => gzipSync,
  gzip: () => gzip,
  gunzipSync: () => gunzipSync,
  gunzip: () => gunzip,
  deflateSync: () => deflateSync,
  deflate: () => deflate,
  decompressSync: () => decompressSync,
  decompress: () => decompress,
  compressSync: () => gzipSync,
  compress: () => gzip,
  Zlib: () => Zlib,
  ZipPassThrough: () => ZipPassThrough,
  ZipDeflate: () => ZipDeflate,
  Zip: () => Zip,
  Unzlib: () => Unzlib,
  UnzipPassThrough: () => UnzipPassThrough,
  UnzipInflate: () => UnzipInflate,
  Unzip: () => Unzip,
  Inflate: () => Inflate,
  Gzip: () => Gzip,
  Gunzip: () => Gunzip,
  FlateErrorCode: () => FlateErrorCode,
  EncodeUTF8: () => EncodeUTF8,
  Deflate: () => Deflate,
  Decompress: () => Decompress,
  DecodeUTF8: () => DecodeUTF8,
  Compress: () => Gzip,
  AsyncZlib: () => AsyncZlib,
  AsyncZipDeflate: () => AsyncZipDeflate,
  AsyncUnzlib: () => AsyncUnzlib,
  AsyncUnzipInflate: () => AsyncUnzipInflate,
  AsyncInflate: () => AsyncInflate,
  AsyncGzip: () => AsyncGzip,
  AsyncGunzip: () => AsyncGunzip,
  AsyncDeflate: () => AsyncDeflate,
  AsyncDecompress: () => AsyncDecompress,
  AsyncCompress: () => AsyncGzip
});
import { createRequire } from "module";
var require2, Worker2, workerAdd = ";var __w=require('worker_threads');__w.parentPort.on('message',function(m){onmessage({data:m})}),postMessage=function(m,t){__w.parentPort.postMessage(m,t)},close=process.exit;self=global", wk, u8, u16, i32, fleb, fdeb, clim, freb = function(eb, start) {
  var b = new u16(31);
  for (var i4 = 0;i4 < 31; ++i4)
    b[i4] = start += 1 << eb[i4 - 1];
  var r4 = new i32(b[30]);
  for (var i4 = 1;i4 < 30; ++i4)
    for (var j4 = b[i4];j4 < b[i4 + 1]; ++j4)
      r4[j4] = j4 - b[i4] << 5 | i4;
  return { b, r: r4 };
}, _a2, fl, revfl, _b, fd, revfd, rev, x3, i4, hMap = function(cd, mb, r4) {
  var s2 = cd.length, i5 = 0, l3 = new u16(mb);
  for (;i5 < s2; ++i5)
    if (cd[i5])
      ++l3[cd[i5] - 1];
  var le = new u16(mb);
  for (i5 = 1;i5 < mb; ++i5)
    le[i5] = le[i5 - 1] + l3[i5 - 1] << 1;
  var co;
  if (r4) {
    co = new u16(1 << mb);
    var rvb = 15 - mb;
    for (i5 = 0;i5 < s2; ++i5)
      if (cd[i5]) {
        var sv = i5 << 4 | cd[i5], r_1 = mb - cd[i5], v2 = le[cd[i5] - 1]++ << r_1;
        for (var m4 = v2 | (1 << r_1) - 1;v2 <= m4; ++v2)
          co[rev[v2] >> rvb] = sv;
      }
  } else {
    co = new u16(s2);
    for (i5 = 0;i5 < s2; ++i5)
      if (cd[i5])
        co[i5] = rev[le[cd[i5] - 1]++] >> 15 - cd[i5];
  }
  return co;
}, flt, i4, i4, i4, i4, fdt, i4, flm, flrm, fdm, fdrm, max = function(a2) {
  var m4 = a2[0];
  for (var i5 = 1;i5 < a2.length; ++i5)
    if (a2[i5] > m4)
      m4 = a2[i5];
  return m4;
}, bits = function(d, p4, m4) {
  var o5 = p4 / 8 | 0;
  return (d[o5] | d[o5 + 1] << 8) >> (p4 & 7) & m4;
}, bits16 = function(d, p4) {
  var o5 = p4 / 8 | 0;
  return (d[o5] | d[o5 + 1] << 8 | d[o5 + 2] << 16) >> (p4 & 7);
}, shft = function(p4) {
  return (p4 + 7) / 8 | 0;
}, slc = function(v2, s2, e) {
  if (s2 == null || s2 < 0)
    s2 = 0;
  if (e == null || e > v2.length)
    e = v2.length;
  return new u8(v2.subarray(s2, e));
}, FlateErrorCode, ec, err = function(ind, msg, nt) {
  var e = Error(msg || ec[ind]);
  if (e.code = ind, Error.captureStackTrace)
    Error.captureStackTrace(e, err);
  if (!nt)
    throw e;
  return e;
}, inflt = function(dat, st, buf, dict) {
  var sl = dat.length, dl = dict ? dict.length : 0;
  if (!sl || st.f && !st.l)
    return buf || new u8(0);
  var noBuf = !buf, resize = noBuf || st.i != 2, noSt = st.i;
  if (noBuf)
    buf = new u8(sl * 3);
  var cbuf = function(l4) {
    var bl = buf.length;
    if (l4 > bl) {
      var nbuf = new u8(Math.max(bl * 2, l4));
      nbuf.set(buf), buf = nbuf;
    }
  }, final = st.f || 0, pos = st.p || 0, bt = st.b || 0, lm = st.l, dm = st.d, lbt = st.m, dbt = st.n, tbts = sl * 8;
  do {
    if (!lm) {
      final = bits(dat, pos, 1);
      var type = bits(dat, pos + 1, 3);
      if (pos += 3, !type) {
        var s2 = shft(pos) + 4, l3 = dat[s2 - 4] | dat[s2 - 3] << 8, t2 = s2 + l3;
        if (t2 > sl) {
          if (noSt)
            err(0);
          break;
        }
        if (resize)
          cbuf(bt + l3);
        buf.set(dat.subarray(s2, t2), bt), st.b = bt += l3, st.p = pos = t2 * 8, st.f = final;
        continue;
      } else if (type == 1)
        lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
      else if (type == 2) {
        var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4, tl = hLit + bits(dat, pos + 5, 31) + 1;
        pos += 14;
        var ldt = new u8(tl), clt = new u8(19);
        for (var i5 = 0;i5 < hcLen; ++i5)
          clt[clim[i5]] = bits(dat, pos + i5 * 3, 7);
        pos += hcLen * 3;
        var clb = max(clt), clbmsk = (1 << clb) - 1, clm = hMap(clt, clb, 1);
        for (var i5 = 0;i5 < tl; ) {
          var r4 = clm[bits(dat, pos, clbmsk)];
          pos += r4 & 15;
          var s2 = r4 >> 4;
          if (s2 < 16)
            ldt[i5++] = s2;
          else {
            var c3 = 0, n5 = 0;
            if (s2 == 16)
              n5 = 3 + bits(dat, pos, 3), pos += 2, c3 = ldt[i5 - 1];
            else if (s2 == 17)
              n5 = 3 + bits(dat, pos, 7), pos += 3;
            else if (s2 == 18)
              n5 = 11 + bits(dat, pos, 127), pos += 7;
            while (n5--)
              ldt[i5++] = c3;
          }
        }
        var lt2 = ldt.subarray(0, hLit), dt = ldt.subarray(hLit);
        lbt = max(lt2), dbt = max(dt), lm = hMap(lt2, lbt, 1), dm = hMap(dt, dbt, 1);
      } else
        err(1);
      if (pos > tbts) {
        if (noSt)
          err(0);
        break;
      }
    }
    if (resize)
      cbuf(bt + 131072);
    var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1, lpos = pos;
    for (;; lpos = pos) {
      var c3 = lm[bits16(dat, pos) & lms], sym = c3 >> 4;
      if (pos += c3 & 15, pos > tbts) {
        if (noSt)
          err(0);
        break;
      }
      if (!c3)
        err(2);
      if (sym < 256)
        buf[bt++] = sym;
      else if (sym == 256) {
        lpos = pos, lm = null;
        break;
      } else {
        var add = sym - 254;
        if (sym > 264) {
          var i5 = sym - 257, b = fleb[i5];
          add = bits(dat, pos, (1 << b) - 1) + fl[i5], pos += b;
        }
        var d = dm[bits16(dat, pos) & dms], dsym = d >> 4;
        if (!d)
          err(3);
        pos += d & 15;
        var dt = fd[dsym];
        if (dsym > 3) {
          var b = fdeb[dsym];
          dt += bits16(dat, pos) & (1 << b) - 1, pos += b;
        }
        if (pos > tbts) {
          if (noSt)
            err(0);
          break;
        }
        if (resize)
          cbuf(bt + 131072);
        var end = bt + add;
        if (bt < dt) {
          var shift = dl - dt, dend = Math.min(dt, end);
          if (shift + bt < 0)
            err(3);
          for (;bt < dend; ++bt)
            buf[bt] = dict[shift + bt];
        }
        for (;bt < end; ++bt)
          buf[bt] = buf[bt - dt];
      }
    }
    if (st.l = lm, st.p = lpos, st.b = bt, st.f = final, lm)
      final = 1, st.m = lbt, st.d = dm, st.n = dbt;
  } while (!final);
  return bt != buf.length && noBuf ? slc(buf, 0, bt) : buf.subarray(0, bt);
}, wbits = function(d, p4, v2) {
  v2 <<= p4 & 7;
  var o5 = p4 / 8 | 0;
  d[o5] |= v2, d[o5 + 1] |= v2 >> 8;
}, wbits16 = function(d, p4, v2) {
  v2 <<= p4 & 7;
  var o5 = p4 / 8 | 0;
  d[o5] |= v2, d[o5 + 1] |= v2 >> 8, d[o5 + 2] |= v2 >> 16;
}, hTree = function(d, mb) {
  var t2 = [];
  for (var i5 = 0;i5 < d.length; ++i5)
    if (d[i5])
      t2.push({ s: i5, f: d[i5] });
  var s2 = t2.length, t22 = t2.slice();
  if (!s2)
    return { t: et, l: 0 };
  if (s2 == 1) {
    var v2 = new u8(t2[0].s + 1);
    return v2[t2[0].s] = 1, { t: v2, l: 1 };
  }
  t2.sort(function(a2, b) {
    return a2.f - b.f;
  }), t2.push({ s: -1, f: 25001 });
  var l3 = t2[0], r4 = t2[1], i0 = 0, i1 = 1, i22 = 2;
  t2[0] = { s: -1, f: l3.f + r4.f, l: l3, r: r4 };
  while (i1 != s2 - 1)
    l3 = t2[t2[i0].f < t2[i22].f ? i0++ : i22++], r4 = t2[i0 != i1 && t2[i0].f < t2[i22].f ? i0++ : i22++], t2[i1++] = { s: -1, f: l3.f + r4.f, l: l3, r: r4 };
  var maxSym = t22[0].s;
  for (var i5 = 1;i5 < s2; ++i5)
    if (t22[i5].s > maxSym)
      maxSym = t22[i5].s;
  var tr = new u16(maxSym + 1), mbt = ln(t2[i1 - 1], tr, 0);
  if (mbt > mb) {
    var i5 = 0, dt = 0, lft = mbt - mb, cst = 1 << lft;
    t22.sort(function(a2, b) {
      return tr[b.s] - tr[a2.s] || a2.f - b.f;
    });
    for (;i5 < s2; ++i5) {
      var i2_1 = t22[i5].s;
      if (tr[i2_1] > mb)
        dt += cst - (1 << mbt - tr[i2_1]), tr[i2_1] = mb;
      else
        break;
    }
    dt >>= lft;
    while (dt > 0) {
      var i2_2 = t22[i5].s;
      if (tr[i2_2] < mb)
        dt -= 1 << mb - tr[i2_2]++ - 1;
      else
        ++i5;
    }
    for (;i5 >= 0 && dt; --i5) {
      var i2_3 = t22[i5].s;
      if (tr[i2_3] == mb)
        --tr[i2_3], ++dt;
    }
    mbt = mb;
  }
  return { t: new u8(tr), l: mbt };
}, ln = function(n5, l3, d) {
  return n5.s == -1 ? Math.max(ln(n5.l, l3, d + 1), ln(n5.r, l3, d + 1)) : l3[n5.s] = d;
}, lc = function(c3) {
  var s2 = c3.length;
  while (s2 && !c3[--s2])
    ;
  var cl = new u16(++s2), cli = 0, cln = c3[0], cls = 1, w2 = function(v2) {
    cl[cli++] = v2;
  };
  for (var i5 = 1;i5 <= s2; ++i5)
    if (c3[i5] == cln && i5 != s2)
      ++cls;
    else {
      if (!cln && cls > 2) {
        for (;cls > 138; cls -= 138)
          w2(32754);
        if (cls > 2)
          w2(cls > 10 ? cls - 11 << 5 | 28690 : cls - 3 << 5 | 12305), cls = 0;
      } else if (cls > 3) {
        w2(cln), --cls;
        for (;cls > 6; cls -= 6)
          w2(8304);
        if (cls > 2)
          w2(cls - 3 << 5 | 8208), cls = 0;
      }
      while (cls--)
        w2(cln);
      cls = 1, cln = c3[i5];
    }
  return { c: cl.subarray(0, cli), n: s2 };
}, clen = function(cf, cl) {
  var l3 = 0;
  for (var i5 = 0;i5 < cl.length; ++i5)
    l3 += cf[i5] * cl[i5];
  return l3;
}, wfblk = function(out, pos, dat) {
  var s2 = dat.length, o5 = shft(pos + 2);
  out[o5] = s2 & 255, out[o5 + 1] = s2 >> 8, out[o5 + 2] = out[o5] ^ 255, out[o5 + 3] = out[o5 + 1] ^ 255;
  for (var i5 = 0;i5 < s2; ++i5)
    out[o5 + i5 + 4] = dat[i5];
  return (o5 + 4 + s2) * 8;
}, wblk = function(dat, out, final, syms, lf, df, eb, li, bs, bl, p4) {
  wbits(out, p4++, final), ++lf[256];
  var _a3 = hTree(lf, 15), dlt = _a3.t, mlb = _a3.l, _b2 = hTree(df, 15), ddt = _b2.t, mdb = _b2.l, _c19 = lc(dlt), lclt = _c19.c, nlc = _c19.n, _d = lc(ddt), lcdt = _d.c, ndc = _d.n, lcfreq = new u16(19);
  for (var i5 = 0;i5 < lclt.length; ++i5)
    ++lcfreq[lclt[i5] & 31];
  for (var i5 = 0;i5 < lcdt.length; ++i5)
    ++lcfreq[lcdt[i5] & 31];
  var _e = hTree(lcfreq, 7), lct = _e.t, mlcb = _e.l, nlcc = 19;
  for (;nlcc > 4 && !lct[clim[nlcc - 1]]; --nlcc)
    ;
  var flen = bl + 5 << 3, ftlen = clen(lf, flt) + clen(df, fdt) + eb, dtlen = clen(lf, dlt) + clen(df, ddt) + eb + 14 + 3 * nlcc + clen(lcfreq, lct) + 2 * lcfreq[16] + 3 * lcfreq[17] + 7 * lcfreq[18];
  if (bs >= 0 && flen <= ftlen && flen <= dtlen)
    return wfblk(out, p4, dat.subarray(bs, bs + bl));
  var lm, ll, dm, dl;
  if (wbits(out, p4, 1 + (dtlen < ftlen)), p4 += 2, dtlen < ftlen) {
    lm = hMap(dlt, mlb, 0), ll = dlt, dm = hMap(ddt, mdb, 0), dl = ddt;
    var llm = hMap(lct, mlcb, 0);
    wbits(out, p4, nlc - 257), wbits(out, p4 + 5, ndc - 1), wbits(out, p4 + 10, nlcc - 4), p4 += 14;
    for (var i5 = 0;i5 < nlcc; ++i5)
      wbits(out, p4 + 3 * i5, lct[clim[i5]]);
    p4 += 3 * nlcc;
    var lcts = [lclt, lcdt];
    for (var it = 0;it < 2; ++it) {
      var clct = lcts[it];
      for (var i5 = 0;i5 < clct.length; ++i5) {
        var len = clct[i5] & 31;
        if (wbits(out, p4, llm[len]), p4 += lct[len], len > 15)
          wbits(out, p4, clct[i5] >> 5 & 127), p4 += clct[i5] >> 12;
      }
    }
  } else
    lm = flm, ll = flt, dm = fdm, dl = fdt;
  for (var i5 = 0;i5 < li; ++i5) {
    var sym = syms[i5];
    if (sym > 255) {
      var len = sym >> 18 & 31;
      if (wbits16(out, p4, lm[len + 257]), p4 += ll[len + 257], len > 7)
        wbits(out, p4, sym >> 23 & 31), p4 += fleb[len];
      var dst = sym & 31;
      if (wbits16(out, p4, dm[dst]), p4 += dl[dst], dst > 3)
        wbits16(out, p4, sym >> 5 & 8191), p4 += fdeb[dst];
    } else
      wbits16(out, p4, lm[sym]), p4 += ll[sym];
  }
  return wbits16(out, p4, lm[256]), p4 + ll[256];
}, deo, et, dflt = function(dat, lvl, plvl, pre, post, st) {
  var s2 = st.z || dat.length, o5 = new u8(pre + s2 + 5 * (1 + Math.ceil(s2 / 7000)) + post), w2 = o5.subarray(pre, o5.length - post), lst = st.l, pos = (st.r || 0) & 7;
  if (lvl) {
    if (pos)
      w2[0] = st.r >> 3;
    var opt = deo[lvl - 1], n5 = opt >> 13, c3 = opt & 8191, msk_1 = (1 << plvl) - 1, prev = st.p || new u16(32768), head = st.h || new u16(msk_1 + 1), bs1_1 = Math.ceil(plvl / 3), bs2_1 = 2 * bs1_1, hsh = function(i6) {
      return (dat[i6] ^ dat[i6 + 1] << bs1_1 ^ dat[i6 + 2] << bs2_1) & msk_1;
    }, syms = new i32(25000), lf = new u16(288), df = new u16(32), lc_1 = 0, eb = 0, i5 = st.i || 0, li = 0, wi = st.w || 0, bs = 0;
    for (;i5 + 2 < s2; ++i5) {
      var hv = hsh(i5), imod = i5 & 32767, pimod = head[hv];
      if (prev[imod] = pimod, head[hv] = imod, wi <= i5) {
        var rem = s2 - i5;
        if ((lc_1 > 7000 || li > 24576) && (rem > 423 || !lst)) {
          pos = wblk(dat, w2, 0, syms, lf, df, eb, li, bs, i5 - bs, pos), li = lc_1 = eb = 0, bs = i5;
          for (var j4 = 0;j4 < 286; ++j4)
            lf[j4] = 0;
          for (var j4 = 0;j4 < 30; ++j4)
            df[j4] = 0;
        }
        var l3 = 2, d = 0, ch_1 = c3, dif = imod - pimod & 32767;
        if (rem > 2 && hv == hsh(i5 - dif)) {
          var maxn = Math.min(n5, rem) - 1, maxd = Math.min(32767, i5), ml = Math.min(258, rem);
          while (dif <= maxd && --ch_1 && imod != pimod) {
            if (dat[i5 + l3] == dat[i5 + l3 - dif]) {
              var nl = 0;
              for (;nl < ml && dat[i5 + nl] == dat[i5 + nl - dif]; ++nl)
                ;
              if (nl > l3) {
                if (l3 = nl, d = dif, nl > maxn)
                  break;
                var mmd = Math.min(dif, nl - 2), md = 0;
                for (var j4 = 0;j4 < mmd; ++j4) {
                  var ti = i5 - dif + j4 & 32767, pti = prev[ti], cd = ti - pti & 32767;
                  if (cd > md)
                    md = cd, pimod = ti;
                }
              }
            }
            imod = pimod, pimod = prev[imod], dif += imod - pimod & 32767;
          }
        }
        if (d) {
          syms[li++] = 268435456 | revfl[l3] << 18 | revfd[d];
          var lin = revfl[l3] & 31, din = revfd[d] & 31;
          eb += fleb[lin] + fdeb[din], ++lf[257 + lin], ++df[din], wi = i5 + l3, ++lc_1;
        } else
          syms[li++] = dat[i5], ++lf[dat[i5]];
      }
    }
    for (i5 = Math.max(i5, wi);i5 < s2; ++i5)
      syms[li++] = dat[i5], ++lf[dat[i5]];
    if (pos = wblk(dat, w2, lst, syms, lf, df, eb, li, bs, i5 - bs, pos), !lst)
      st.r = pos & 7 | w2[pos / 8 | 0] << 3, pos -= 7, st.h = head, st.p = prev, st.i = i5, st.w = wi;
  } else {
    for (var i5 = st.w || 0;i5 < s2 + lst; i5 += 65535) {
      var e = i5 + 65535;
      if (e >= s2)
        w2[pos / 8 | 0] = lst, e = s2;
      pos = wfblk(w2, pos + 1, dat.subarray(i5, e));
    }
    st.i = s2;
  }
  return slc(o5, 0, pre + shft(pos) + post);
}, crct, crc = function() {
  var c3 = -1;
  return {
    p: function(d) {
      var cr = c3;
      for (var i5 = 0;i5 < d.length; ++i5)
        cr = crct[cr & 255 ^ d[i5]] ^ cr >>> 8;
      c3 = cr;
    },
    d: function() {
      return ~c3;
    }
  };
}, adler = function() {
  var a2 = 1, b = 0;
  return {
    p: function(d) {
      var n5 = a2, m4 = b, l3 = d.length | 0;
      for (var i5 = 0;i5 != l3; ) {
        var e = Math.min(i5 + 2655, l3);
        for (;i5 < e; ++i5)
          m4 += n5 += d[i5];
        n5 = (n5 & 65535) + 15 * (n5 >> 16), m4 = (m4 & 65535) + 15 * (m4 >> 16);
      }
      a2 = n5, b = m4;
    },
    d: function() {
      return a2 %= 65521, b %= 65521, (a2 & 255) << 24 | (a2 & 65280) << 8 | (b & 255) << 8 | b >> 8;
    }
  };
}, dopt = function(dat, opt, pre, post, st) {
  if (!st) {
    if (st = { l: 1 }, opt.dictionary) {
      var dict = opt.dictionary.subarray(-32768), newDat = new u8(dict.length + dat.length);
      newDat.set(dict), newDat.set(dat, dict.length), dat = newDat, st.w = dict.length;
    }
  }
  return dflt(dat, opt.level == null ? 6 : opt.level, opt.mem == null ? st.l ? Math.ceil(Math.max(8, Math.min(13, Math.log(dat.length))) * 1.5) : 20 : 12 + opt.mem, pre, post, st);
}, mrg = function(a2, b) {
  var o5 = {};
  for (var k3 in a2)
    o5[k3] = a2[k3];
  for (var k3 in b)
    o5[k3] = b[k3];
  return o5;
}, wcln = function(fn, fnStr, td) {
  var dt = fn(), st = fn.toString(), ks = st.slice(st.indexOf("[") + 1, st.lastIndexOf("]")).replace(/\s+/g, "").split(",");
  for (var i5 = 0;i5 < dt.length; ++i5) {
    var v2 = dt[i5], k3 = ks[i5];
    if (typeof v2 == "function") {
      fnStr += ";" + k3 + "=";
      var st_1 = v2.toString();
      if (v2.prototype)
        if (st_1.indexOf("[native code]") != -1) {
          var spInd = st_1.indexOf(" ", 8) + 1;
          fnStr += st_1.slice(spInd, st_1.indexOf("(", spInd));
        } else {
          fnStr += st_1;
          for (var t2 in v2.prototype)
            fnStr += ";" + k3 + ".prototype." + t2 + "=" + v2.prototype[t2].toString();
        }
      else
        fnStr += st_1;
    } else
      td[k3] = v2;
  }
  return fnStr;
}, ch, cbfs = function(v2) {
  var tl = [];
  for (var k3 in v2)
    if (v2[k3].buffer)
      tl.push((v2[k3] = new v2[k3].constructor(v2[k3])).buffer);
  return tl;
}, wrkr = function(fns, init, id, cb) {
  if (!ch[id]) {
    var fnStr = "", td_1 = {}, m4 = fns.length - 1;
    for (var i5 = 0;i5 < m4; ++i5)
      fnStr = wcln(fns[i5], fnStr, td_1);
    ch[id] = { c: wcln(fns[m4], fnStr, td_1), e: td_1 };
  }
  var td = mrg({}, ch[id].e);
  return wk(ch[id].c + ";onmessage=function(e){for(var k in e.data)self[k]=e.data[k];onmessage=" + init.toString() + "}", id, td, cbfs(td), cb);
}, bInflt = function() {
  return [u8, u16, i32, fleb, fdeb, clim, fl, fd, flrm, fdrm, rev, ec, hMap, max, bits, bits16, shft, slc, err, inflt, inflateSync, pbf, gopt];
}, bDflt = function() {
  return [u8, u16, i32, fleb, fdeb, clim, revfl, revfd, flm, flt, fdm, fdt, rev, deo, et, hMap, wbits, wbits16, hTree, ln, lc, clen, wfblk, wblk, shft, slc, dflt, dopt, deflateSync, pbf];
}, gze = function() {
  return [gzh, gzhl, wbytes, crc, crct];
}, guze = function() {
  return [gzs, gzl];
}, zle = function() {
  return [zlh, wbytes, adler];
}, zule = function() {
  return [zls];
}, pbf = function(msg) {
  return postMessage(msg, [msg.buffer]);
}, gopt = function(o5) {
  return o5 && {
    out: o5.size && new u8(o5.size),
    dictionary: o5.dictionary
  };
}, cbify = function(dat, opts, fns, init, id, cb) {
  var w2 = wrkr(fns, init, id, function(err2, dat2) {
    w2.terminate(), cb(err2, dat2);
  });
  return w2.postMessage([dat, opts], opts.consume ? [dat.buffer] : []), function() {
    w2.terminate();
  };
}, astrm = function(strm) {
  return strm.ondata = function(dat, final) {
    return postMessage([dat, final], [dat.buffer]);
  }, function(ev) {
    if (ev.data.length)
      strm.push(ev.data[0], ev.data[1]), postMessage([ev.data[0].length]);
    else
      strm.flush();
  };
}, astrmify = function(fns, strm, opts, init, id, flush, ext) {
  var t2, w2 = wrkr(fns, init, id, function(err2, dat) {
    if (err2)
      w2.terminate(), strm.ondata.call(strm, err2);
    else if (!Array.isArray(dat))
      ext(dat);
    else if (dat.length == 1) {
      if (strm.queuedSize -= dat[0], strm.ondrain)
        strm.ondrain(dat[0]);
    } else {
      if (dat[1])
        w2.terminate();
      strm.ondata.call(strm, err2, dat[0], dat[1]);
    }
  });
  if (w2.postMessage(opts), strm.queuedSize = 0, strm.push = function(d, f) {
    if (!strm.ondata)
      err(5);
    if (t2)
      strm.ondata(err(4, 0, 1), null, !!f);
    strm.queuedSize += d.length, w2.postMessage([d, t2 = f], [d.buffer]);
  }, strm.terminate = function() {
    w2.terminate();
  }, flush)
    strm.flush = function() {
      w2.postMessage([]);
    };
}, b2 = function(d, b) {
  return d[b] | d[b + 1] << 8;
}, b4 = function(d, b) {
  return (d[b] | d[b + 1] << 8 | d[b + 2] << 16 | d[b + 3] << 24) >>> 0;
}, b8 = function(d, b) {
  return b4(d, b) + b4(d, b + 4) * 4294967296;
}, wbytes = function(d, b, v2) {
  for (;v2; ++b)
    d[b] = v2, v2 >>>= 8;
}, gzh = function(c3, o5) {
  var fn = o5.filename;
  if (c3[0] = 31, c3[1] = 139, c3[2] = 8, c3[8] = o5.level < 2 ? 4 : o5.level == 9 ? 2 : 0, c3[9] = 3, o5.mtime != 0)
    wbytes(c3, 4, Math.floor(new Date(o5.mtime || Date.now()) / 1000));
  if (fn) {
    c3[3] = 8;
    for (var i5 = 0;i5 <= fn.length; ++i5)
      c3[i5 + 10] = fn.charCodeAt(i5);
  }
}, gzs = function(d) {
  if (d[0] != 31 || d[1] != 139 || d[2] != 8)
    err(6, "invalid gzip data");
  var flg = d[3], st = 10;
  if (flg & 4)
    st += (d[10] | d[11] << 8) + 2;
  for (var zs = (flg >> 3 & 1) + (flg >> 4 & 1);zs > 0; zs -= !d[st++])
    ;
  return st + (flg & 2);
}, gzl = function(d) {
  var l3 = d.length;
  return (d[l3 - 4] | d[l3 - 3] << 8 | d[l3 - 2] << 16 | d[l3 - 1] << 24) >>> 0;
}, gzhl = function(o5) {
  return 10 + (o5.filename ? o5.filename.length + 1 : 0);
}, zlh = function(c3, o5) {
  var lv = o5.level, fl2 = lv == 0 ? 0 : lv < 6 ? 1 : lv == 9 ? 3 : 2;
  if (c3[0] = 120, c3[1] = fl2 << 6 | (o5.dictionary && 32), c3[1] |= 31 - (c3[0] << 8 | c3[1]) % 31, o5.dictionary) {
    var h4 = adler();
    h4.p(o5.dictionary), wbytes(c3, 2, h4.d());
  }
}, zls = function(d, dict) {
  if ((d[0] & 15) != 8 || d[0] >> 4 > 7 || (d[0] << 8 | d[1]) % 31)
    err(6, "invalid zlib data");
  if ((d[1] >> 5 & 1) == +!dict)
    err(6, "invalid zlib data: " + (d[1] & 32 ? "need" : "unexpected") + " dictionary");
  return (d[1] >> 3 & 4) + 2;
}, Deflate, AsyncDeflate, Inflate, AsyncInflate, Gzip, AsyncGzip, Gunzip, AsyncGunzip, Zlib, AsyncZlib, Unzlib, AsyncUnzlib, Decompress, AsyncDecompress, fltn = function(d, p4, t2, o5) {
  for (var k3 in d) {
    var val = d[k3], n5 = p4 + k3, op = o5;
    if (Array.isArray(val))
      op = mrg(o5, val[1]), val = val[0];
    if (val instanceof u8)
      t2[n5] = [val, op];
    else
      t2[n5 += "/"] = [new u8(0), op], fltn(val, n5, t2, o5);
  }
}, te, td, tds = 0, dutf8 = function(d) {
  for (var r4 = "", i5 = 0;; ) {
    var c3 = d[i5++], eb = (c3 > 127) + (c3 > 223) + (c3 > 239);
    if (i5 + eb > d.length)
      return { s: r4, r: slc(d, i5 - 1) };
    if (!eb)
      r4 += String.fromCharCode(c3);
    else if (eb == 3)
      c3 = ((c3 & 15) << 18 | (d[i5++] & 63) << 12 | (d[i5++] & 63) << 6 | d[i5++] & 63) - 65536, r4 += String.fromCharCode(55296 | c3 >> 10, 56320 | c3 & 1023);
    else if (eb & 1)
      r4 += String.fromCharCode((c3 & 31) << 6 | d[i5++] & 63);
    else
      r4 += String.fromCharCode((c3 & 15) << 12 | (d[i5++] & 63) << 6 | d[i5++] & 63);
  }
}, DecodeUTF8, EncodeUTF8, dbf = function(l3) {
  return l3 == 1 ? 3 : l3 < 6 ? 2 : l3 == 9 ? 1 : 0;
}, slzh = function(d, b) {
  return b + 30 + b2(d, b + 26) + b2(d, b + 28);
}, zh = function(d, b, z2) {
  var fnl = b2(d, b + 28), fn = strFromU8(d.subarray(b + 46, b + 46 + fnl), !(b2(d, b + 8) & 2048)), es = b + 46 + fnl, bs = b4(d, b + 20), _a3 = z2 && bs == 4294967295 ? z64e(d, es) : [bs, b4(d, b + 24), b4(d, b + 42)], sc = _a3[0], su = _a3[1], off = _a3[2];
  return [b2(d, b + 10), sc, su, fn, es + b2(d, b + 30) + b2(d, b + 32), off];
}, z64e = function(d, b) {
  for (;b2(d, b) != 1; b += 4 + b2(d, b + 2))
    ;
  return [b8(d, b + 12), b8(d, b + 4), b8(d, b + 20)];
}, exfl = function(ex) {
  var le = 0;
  if (ex)
    for (var k3 in ex) {
      var l3 = ex[k3].length;
      if (l3 > 65535)
        err(9);
      le += l3 + 4;
    }
  return le;
}, wzh = function(d, b, f, fn, u5, c3, ce, co) {
  var fl2 = fn.length, ex = f.extra, col = co && co.length, exl = exfl(ex);
  if (wbytes(d, b, ce != null ? 33639248 : 67324752), b += 4, ce != null)
    d[b++] = 20, d[b++] = f.os;
  d[b] = 20, b += 2, d[b++] = f.flag << 1 | (c3 < 0 && 8), d[b++] = u5 && 8, d[b++] = f.compression & 255, d[b++] = f.compression >> 8;
  var dt = new Date(f.mtime == null ? Date.now() : f.mtime), y2 = dt.getFullYear() - 1980;
  if (y2 < 0 || y2 > 119)
    err(10);
  if (wbytes(d, b, y2 << 25 | dt.getMonth() + 1 << 21 | dt.getDate() << 16 | dt.getHours() << 11 | dt.getMinutes() << 5 | dt.getSeconds() >> 1), b += 4, c3 != -1)
    wbytes(d, b, f.crc), wbytes(d, b + 4, c3 < 0 ? -c3 - 2 : c3), wbytes(d, b + 8, f.size);
  if (wbytes(d, b + 12, fl2), wbytes(d, b + 14, exl), b += 16, ce != null)
    wbytes(d, b, col), wbytes(d, b + 6, f.attrs), wbytes(d, b + 10, ce), b += 14;
  if (d.set(fn, b), b += fl2, exl)
    for (var k3 in ex) {
      var exf = ex[k3], l3 = exf.length;
      wbytes(d, b, +k3), wbytes(d, b + 2, l3), d.set(exf, b + 4), b += 4 + l3;
    }
  if (col)
    d.set(co, b), b += col;
  return b;
}, wzf = function(o5, b, c3, d, e) {
  wbytes(o5, b, 101010256), wbytes(o5, b + 8, c3), wbytes(o5, b + 10, c3), wbytes(o5, b + 12, d), wbytes(o5, b + 16, e);
}, ZipPassThrough, ZipDeflate, AsyncZipDeflate, Zip, UnzipPassThrough, UnzipInflate, AsyncUnzipInflate, Unzip, mt;

// node_modules/@anthropic-ai/mcpb/dist/node/files.js
import { existsSync as existsSync8, readdirSync as readdirSync4, readFileSync as readFileSync13, statSync as statSync8 } from "fs";
import { join as join36, relative as relative5, sep as sep9 } from "path";
var import_ignore, EXCLUDE_PATTERNS;

// node_modules/universalify/index.js

// node_modules/fs-extra/lib/fs/index.js

// node_modules/fs-extra/lib/mkdirs/utils.js

// node_modules/fs-extra/lib/mkdirs/make-dir.js

// node_modules/fs-extra/lib/mkdirs/index.js

// node_modules/fs-extra/lib/path-exists/index.js

// node_modules/fs-extra/lib/util/utimes.js

// node_modules/fs-extra/lib/util/stat.js

// node_modules/fs-extra/lib/copy/copy.js

// node_modules/fs-extra/lib/copy/copy-sync.js

// node_modules/fs-extra/lib/copy/index.js

// node_modules/fs-extra/lib/remove/rimraf.js

// node_modules/fs-extra/lib/remove/index.js

// node_modules/fs-extra/lib/empty/index.js

// node_modules/fs-extra/lib/ensure/file.js

// node_modules/fs-extra/lib/ensure/link.js

// node_modules/fs-extra/lib/ensure/symlink-paths.js

// node_modules/fs-extra/lib/ensure/symlink-type.js

// node_modules/fs-extra/lib/ensure/symlink.js

// node_modules/fs-extra/lib/ensure/index.js

// node_modules/jsonfile/utils.js

// node_modules/jsonfile/index.js

// node_modules/fs-extra/lib/json/jsonfile.js

// node_modules/fs-extra/lib/output-file/index.js

// node_modules/fs-extra/lib/json/output-json.js

// node_modules/fs-extra/lib/json/output-json-sync.js

// node_modules/fs-extra/lib/json/index.js

// node_modules/fs-extra/lib/move/move.js

// node_modules/fs-extra/lib/move/move-sync.js

// node_modules/fs-extra/lib/move/index.js

// node_modules/fs-extra/lib/index.js

// node_modules/flora-colossus/lib/depTypes.js

// node_modules/flora-colossus/lib/nativeModuleTypes.js

// node_modules/flora-colossus/lib/Walker.js

// node_modules/flora-colossus/lib/index.js

// node_modules/galactus/lib/DestroyerOfModules.js

// node_modules/galactus/lib/index.js

// node_modules/pretty-bytes/index.js

// node_modules/node-forge/lib/forge.js

// node_modules/node-forge/lib/baseN.js

// node_modules/node-forge/lib/util.js

// node_modules/node-forge/lib/cipher.js

// node_modules/node-forge/lib/cipherModes.js

// node_modules/node-forge/lib/aes.js

// node_modules/node-forge/lib/oids.js

// node_modules/node-forge/lib/asn1.js

// node_modules/node-forge/lib/md.js

// node_modules/node-forge/lib/hmac.js

// node_modules/node-forge/lib/md5.js

// node_modules/node-forge/lib/pem.js

// node_modules/node-forge/lib/des.js

// node_modules/node-forge/lib/pbkdf2.js

// node_modules/node-forge/lib/sha256.js

// node_modules/node-forge/lib/prng.js

// node_modules/node-forge/lib/random.js

// node_modules/node-forge/lib/rc2.js

// node_modules/node-forge/lib/jsbn.js

// node_modules/node-forge/lib/sha1.js

// node_modules/node-forge/lib/pkcs1.js

// node_modules/node-forge/lib/prime.js

// node_modules/node-forge/lib/rsa.js

// node_modules/node-forge/lib/pbe.js

// node_modules/node-forge/lib/pkcs7asn1.js

// node_modules/node-forge/lib/mgf1.js

// node_modules/node-forge/lib/mgf.js

// node_modules/node-forge/lib/pss.js

// node_modules/node-forge/lib/x509.js

// node_modules/node-forge/lib/pkcs12.js

// node_modules/node-forge/lib/pki.js

// node_modules/node-forge/lib/tls.js

// node_modules/node-forge/lib/aesCipherSuites.js

// node_modules/node-forge/lib/sha512.js

// node_modules/node-forge/lib/asn1-validator.js

// node_modules/node-forge/lib/ed25519.js

// node_modules/node-forge/lib/kem.js

// node_modules/node-forge/lib/log.js

// node_modules/node-forge/lib/md.all.js

// node_modules/node-forge/lib/pkcs7.js

// node_modules/node-forge/lib/ssh.js

// node_modules/node-forge/lib/index.js

// node_modules/@anthropic-ai/mcpb/dist/node/sign.js
import { execFile as execFile9 } from "child_process";
import { readFileSync as readFileSync14, writeFileSync as writeFileSync4 } from "fs";
import { mkdtemp, rm as rm2, writeFile as writeFile5 } from "fs/promises";
import { tmpdir as tmpdir3 } from "os";
import { join as join37 } from "path";
import { promisify as promisify10 } from "util";
var import_node_forge, SIGNATURE_HEADER2 = "MCPB_SIG_V1", SIGNATURE_FOOTER = "MCPB_SIG_END", execFileAsync6;

// node_modules/@anthropic-ai/mcpb/dist/shared/log.js

// node_modules/@anthropic-ai/mcpb/dist/cli/unpack.js
import { chmodSync as chmodSync3, existsSync as existsSync9, mkdirSync as mkdirSync4, readFileSync as readFileSync15, writeFileSync as writeFileSync5 } from "fs";
import { join as join38, resolve as resolve20, sep as sep10 } from "path";

// node_modules/@anthropic-ai/mcpb/dist/shared/manifestVersionResolve.js

// node_modules/@anthropic-ai/mcpb/dist/node/validate.js
import { existsSync as existsSync10, readFileSync as readFileSync16, statSync as statSync9 } from "fs";
import * as fs14 from "fs/promises";
import * as os5 from "os";
import { dirname as dirname22, isAbsolute as isAbsolute8, join as join39, resolve as resolve21 } from "path";
var import_galactus, import_pretty_bytes;

// node_modules/@anthropic-ai/mcpb/dist/cli/pack.js
__export(exports_pack, {
  packExtension: () => packExtension
});
import { createHash as createHash5 } from "crypto";
import { existsSync as existsSync11, mkdirSync as mkdirSync5, readFileSync as readFileSync17, statSync as statSync10, writeFileSync as writeFileSync6 } from "fs";
import { basename as basename8, join as join40, relative as relative6, resolve as resolve22, sep as sep11 } from "path";

// node_modules/@anthropic-ai/mcpb/dist/schemas/any.js
__export(exports_any, {
  McpbManifestSchema: () => McpbManifestSchema9
});
var McpbManifestSchema9;

// node_modules/@anthropic-ai/mcpb/dist/schemas/index.js
var VERSIONED_MANIFEST_SCHEMAS;

// node_modules/@anthropic-ai/mcpb/dist/shared/common.js
var McpbUserConfigValuesSchema, McpbSignatureInfoSchema;

// node_modules/@anthropic-ai/mcpb/dist/shared/config.js
        result.push(replaceVariables(item, variables));
    return result;
  } else if (value && typeof value === "object") {
    let result = {};
    for (let [key2, val] of Object.entries(value))
      result[key2] = replaceVariables(val, variables);
    return result;
  }
  return value;
}

// node_modules/@anthropic-ai/mcpb/dist/types.js

// node_modules/@anthropic-ai/mcpb/dist/index.js
__export(exports_dist2, {
  verifyMcpbFile: () => verifyMcpbFile,
  verifyCertificateChain: () => verifyCertificateChain,
  validateManifest: () => validateManifest,
  vAny: () => exports_any,
  v0_4: () => exports_0_4,
  v0_3: () => exports_0_3,
  v0_2: () => exports_0_2,
  v0_1: () => exports_0_1,
  unsignMcpbFile: () => unsignMcpbFile,
  unpackExtension: () => unpackExtension,
  signMcpbFile: () => signMcpbFile,
  shouldExclude: () => shouldExclude,
  replaceVariables: () => replaceVariables,
  readPackageJson: () => readPackageJson,
  readMcpbIgnorePatterns: () => readMcpbIgnorePatterns,
  promptVisualAssets: () => promptVisualAssets,
  promptUserConfig: () => promptUserConfig,
  promptUrls: () => promptUrls,
  promptTools: () => promptTools,
  promptServerConfig: () => promptServerConfig,
  promptPrompts: () => promptPrompts,
  promptOptionalFields: () => promptOptionalFields,
  promptLongDescription: () => promptLongDescription,
  promptLocalization: () => promptLocalization,
  promptCompatibility: () => promptCompatibility,
  promptBasicInfo: () => promptBasicInfo,
  promptAuthorInfo: () => promptAuthorInfo,
  printNextSteps: () => printNextSteps,
  packExtension: () => packExtension,
  initExtension: () => initExtension,
  hasRequiredConfigMissing: () => hasRequiredConfigMissing,
  getMcpConfigForManifest: () => getMcpConfigForManifest,
  getDefaultServerConfig: () => getDefaultServerConfig,
  getDefaultRepositoryUrl: () => getDefaultRepositoryUrl,
  getDefaultOptionalFields: () => getDefaultOptionalFields,
  getDefaultEntryPoint: () => getDefaultEntryPoint,
  getDefaultBasicInfo: () => getDefaultBasicInfo,
  getDefaultAuthorUrl: () => getDefaultAuthorUrl,
  getDefaultAuthorName: () => getDefaultAuthorName,
  getDefaultAuthorInfo: () => getDefaultAuthorInfo,
  getDefaultAuthorEmail: () => getDefaultAuthorEmail,
  getAllFilesWithCount: () => getAllFilesWithCount,
  getAllFiles: () => getAllFiles,
  extractSignatureBlock: () => extractSignatureBlock,
  createMcpConfig: () => createMcpConfig,
  cleanMcpb: () => cleanMcpb,
  buildManifest: () => buildManifest,
  VERSIONED_MANIFEST_SCHEMAS: () => VERSIONED_MANIFEST_SCHEMAS,
  McpbUserConfigValuesSchema: () => McpbUserConfigValuesSchema,
  McpbSignatureInfoSchema: () => McpbSignatureInfoSchema,
  MANIFEST_SCHEMAS_LOOSE: () => MANIFEST_SCHEMAS_LOOSE,
  MANIFEST_SCHEMAS: () => MANIFEST_SCHEMAS,
  LATEST_MANIFEST_VERSION: () => LATEST_MANIFEST_VERSION,
  EXCLUDE_PATTERNS: () => EXCLUDE_PATTERNS,
  DEFAULT_MANIFEST_VERSION: () => DEFAULT_MANIFEST_VERSION
});

