// var: init_schemas
var init_schemas = __esm(() => {
  init_checks();
  init_core();
  init_parse2();
  init_regexes();
  init_util();
  init_versions();
  init_util();
  $ZodType = /* @__PURE__ */ $constructor("$ZodType", (inst, def) => {
    var _a2;
    inst ?? (inst = {}), inst._zod.def = def, inst._zod.bag = inst._zod.bag || {}, inst._zod.version = version;
    let checks = [...inst._zod.def.checks ?? []];
    if (inst._zod.traits.has("$ZodCheck"))
      checks.unshift(inst);
    for (let ch of checks)
      for (let fn of ch._zod.onattach)
        fn(inst);
    if (checks.length === 0)
      (_a2 = inst._zod).deferred ?? (_a2.deferred = []), inst._zod.deferred?.push(() => {
        inst._zod.run = inst._zod.parse;
      });
    else {
      let runChecks = (payload, checks2, ctx) => {
        let isAborted = aborted(payload), asyncResult;
        for (let ch of checks2) {
          if (ch._zod.def.when) {
            if (!ch._zod.def.when(payload))
              continue;
          } else if (isAborted)
            continue;
          let currLen = payload.issues.length, _ = ch._zod.check(payload);
          if (_ instanceof Promise && ctx?.async === !1)
            throw new $ZodAsyncError;
          if (asyncResult || _ instanceof Promise)
            asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
              if (await _, payload.issues.length === currLen)
                return;
              if (!isAborted)
                isAborted = aborted(payload, currLen);
            });
          else {
            if (payload.issues.length === currLen)
              continue;
            if (!isAborted)
              isAborted = aborted(payload, currLen);
          }
        }
        if (asyncResult)
          return asyncResult.then(() => {
            return payload;
          });
        return payload;
      };
      inst._zod.run = (payload, ctx) => {
        let result = inst._zod.parse(payload, ctx);
        if (result instanceof Promise) {
          if (ctx.async === !1)
            throw new $ZodAsyncError;
          return result.then((result2) => runChecks(result2, checks, ctx));
        }
        return runChecks(result, checks, ctx);
      };
    }
    inst["~standard"] = {
      validate: (value) => {
        try {
          let r = safeParse(inst, value);
          return r.success ? { value: r.data } : { issues: r.error?.issues };
        } catch (_) {
          return safeParseAsync(inst, value).then((r) => r.success ? { value: r.data } : { issues: r.error?.issues });
        }
      },
      vendor: "zod",
      version: 1
    };
  }), $ZodString = /* @__PURE__ */ $constructor("$ZodString", (inst, def) => {
    $ZodType.init(inst, def), inst._zod.pattern = [...inst?._zod.bag?.patterns ?? []].pop() ?? string(inst._zod.bag), inst._zod.parse = (payload, _) => {
      if (def.coerce)
        try {
          payload.value = String(payload.value);
        } catch (_2) {}
      if (typeof payload.value === "string")
        return payload;
      return payload.issues.push({
        expected: "string",
        code: "invalid_type",
        input: payload.value,
        inst
      }), payload;
    };
  }), $ZodStringFormat = /* @__PURE__ */ $constructor("$ZodStringFormat", (inst, def) => {
    $ZodCheckStringFormat.init(inst, def), $ZodString.init(inst, def);
  }), $ZodGUID = /* @__PURE__ */ $constructor("$ZodGUID", (inst, def) => {
    def.pattern ?? (def.pattern = guid), $ZodStringFormat.init(inst, def);
  }), $ZodUUID = /* @__PURE__ */ $constructor("$ZodUUID", (inst, def) => {
    if (def.version) {
      let v = {
        v1: 1,
        v2: 2,
        v3: 3,
        v4: 4,
        v5: 5,
        v6: 6,
        v7: 7,
        v8: 8
      }[def.version];
      if (v === void 0)
        throw Error(`Invalid UUID version: "${def.version}"`);
      def.pattern ?? (def.pattern = uuid(v));
    } else
      def.pattern ?? (def.pattern = uuid());
    $ZodStringFormat.init(inst, def);
  }), $ZodEmail = /* @__PURE__ */ $constructor("$ZodEmail", (inst, def) => {
    def.pattern ?? (def.pattern = email), $ZodStringFormat.init(inst, def);
  }), $ZodURL = /* @__PURE__ */ $constructor("$ZodURL", (inst, def) => {
    $ZodStringFormat.init(inst, def), inst._zod.check = (payload) => {
      try {
        let orig = payload.value, url = new URL(orig), href = url.href;
        if (def.hostname) {
          if (def.hostname.lastIndex = 0, !def.hostname.test(url.hostname))
            payload.issues.push({
              code: "invalid_format",
              format: "url",
              note: "Invalid hostname",
              pattern: hostname.source,
              input: payload.value,
              inst,
              continue: !def.abort
            });
        }
        if (def.protocol) {
          if (def.protocol.lastIndex = 0, !def.protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol))
            payload.issues.push({
              code: "invalid_format",
              format: "url",
              note: "Invalid protocol",
              pattern: def.protocol.source,
              input: payload.value,
              inst,
              continue: !def.abort
            });
        }
        if (!orig.endsWith("/") && href.endsWith("/"))
          payload.value = href.slice(0, -1);
        else
          payload.value = href;
        return;
      } catch (_) {
        payload.issues.push({
          code: "invalid_format",
          format: "url",
          input: payload.value,
          inst,
          continue: !def.abort
        });
      }
    };
  }), $ZodEmoji = /* @__PURE__ */ $constructor("$ZodEmoji", (inst, def) => {
    def.pattern ?? (def.pattern = emoji()), $ZodStringFormat.init(inst, def);
  }), $ZodNanoID = /* @__PURE__ */ $constructor("$ZodNanoID", (inst, def) => {
    def.pattern ?? (def.pattern = nanoid), $ZodStringFormat.init(inst, def);
  }), $ZodCUID = /* @__PURE__ */ $constructor("$ZodCUID", (inst, def) => {
    def.pattern ?? (def.pattern = cuid), $ZodStringFormat.init(inst, def);
  }), $ZodCUID2 = /* @__PURE__ */ $constructor("$ZodCUID2", (inst, def) => {
    def.pattern ?? (def.pattern = cuid2), $ZodStringFormat.init(inst, def);
  }), $ZodULID = /* @__PURE__ */ $constructor("$ZodULID", (inst, def) => {
    def.pattern ?? (def.pattern = ulid), $ZodStringFormat.init(inst, def);
  }), $ZodXID = /* @__PURE__ */ $constructor("$ZodXID", (inst, def) => {
    def.pattern ?? (def.pattern = xid), $ZodStringFormat.init(inst, def);
  }), $ZodKSUID = /* @__PURE__ */ $constructor("$ZodKSUID", (inst, def) => {
    def.pattern ?? (def.pattern = ksuid), $ZodStringFormat.init(inst, def);
  }), $ZodISODateTime = /* @__PURE__ */ $constructor("$ZodISODateTime", (inst, def) => {
    def.pattern ?? (def.pattern = datetime(def)), $ZodStringFormat.init(inst, def);
  }), $ZodISODate = /* @__PURE__ */ $constructor("$ZodISODate", (inst, def) => {
    def.pattern ?? (def.pattern = date), $ZodStringFormat.init(inst, def);
  }), $ZodISOTime = /* @__PURE__ */ $constructor("$ZodISOTime", (inst, def) => {
    def.pattern ?? (def.pattern = time(def)), $ZodStringFormat.init(inst, def);
  }), $ZodISODuration = /* @__PURE__ */ $constructor("$ZodISODuration", (inst, def) => {
    def.pattern ?? (def.pattern = duration), $ZodStringFormat.init(inst, def);
  }), $ZodIPv4 = /* @__PURE__ */ $constructor("$ZodIPv4", (inst, def) => {
    def.pattern ?? (def.pattern = ipv4), $ZodStringFormat.init(inst, def), inst._zod.onattach.push((inst2) => {
      let bag = inst2._zod.bag;
      bag.format = "ipv4";
    });
  }), $ZodIPv6 = /* @__PURE__ */ $constructor("$ZodIPv6", (inst, def) => {
    def.pattern ?? (def.pattern = ipv6), $ZodStringFormat.init(inst, def), inst._zod.onattach.push((inst2) => {
      let bag = inst2._zod.bag;
      bag.format = "ipv6";
    }), inst._zod.check = (payload) => {
      try {
        new URL(`http://[${payload.value}]`);
      } catch {
        payload.issues.push({
          code: "invalid_format",
          format: "ipv6",
          input: payload.value,
          inst,
          continue: !def.abort
        });
      }
    };
  }), $ZodCIDRv4 = /* @__PURE__ */ $constructor("$ZodCIDRv4", (inst, def) => {
    def.pattern ?? (def.pattern = cidrv4), $ZodStringFormat.init(inst, def);
  }), $ZodCIDRv6 = /* @__PURE__ */ $constructor("$ZodCIDRv6", (inst, def) => {
    def.pattern ?? (def.pattern = cidrv6), $ZodStringFormat.init(inst, def), inst._zod.check = (payload) => {
      let [address, prefix] = payload.value.split("/");
      try {
        if (!prefix)
          throw Error();
        let prefixNum = Number(prefix);
        if (`${prefixNum}` !== prefix)
          throw Error();
        if (prefixNum < 0 || prefixNum > 128)
          throw Error();
        new URL(`http://[${address}]`);
      } catch {
        payload.issues.push({
          code: "invalid_format",
          format: "cidrv6",
          input: payload.value,
          inst,
          continue: !def.abort
        });
      }
    };
  });
  $ZodBase64 = /* @__PURE__ */ $constructor("$ZodBase64", (inst, def) => {
    def.pattern ?? (def.pattern = base64), $ZodStringFormat.init(inst, def), inst._zod.onattach.push((inst2) => {
      inst2._zod.bag.contentEncoding = "base64";
    }), inst._zod.check = (payload) => {
      if (isValidBase64(payload.value))
        return;
      payload.issues.push({
        code: "invalid_format",
        format: "base64",
        input: payload.value,
        inst,
        continue: !def.abort
      });
    };
  });
  $ZodBase64URL = /* @__PURE__ */ $constructor("$ZodBase64URL", (inst, def) => {
    def.pattern ?? (def.pattern = base64url), $ZodStringFormat.init(inst, def), inst._zod.onattach.push((inst2) => {
      inst2._zod.bag.contentEncoding = "base64url";
    }), inst._zod.check = (payload) => {
      if (isValidBase64URL(payload.value))
        return;
      payload.issues.push({
        code: "invalid_format",
        format: "base64url",
        input: payload.value,
        inst,
        continue: !def.abort
      });
    };
  }), $ZodE164 = /* @__PURE__ */ $constructor("$ZodE164", (inst, def) => {
    def.pattern ?? (def.pattern = e164), $ZodStringFormat.init(inst, def);
  });
  $ZodJWT = /* @__PURE__ */ $constructor("$ZodJWT", (inst, def) => {
    $ZodStringFormat.init(inst, def), inst._zod.check = (payload) => {
      if (isValidJWT(payload.value, def.alg))
        return;
      payload.issues.push({
        code: "invalid_format",
        format: "jwt",
        input: payload.value,
        inst,
        continue: !def.abort
      });
    };
  }), $ZodCustomStringFormat = /* @__PURE__ */ $constructor("$ZodCustomStringFormat", (inst, def) => {
    $ZodStringFormat.init(inst, def), inst._zod.check = (payload) => {
      if (def.fn(payload.value))
        return;
      payload.issues.push({
        code: "invalid_format",
        format: def.format,
        input: payload.value,
        inst,
        continue: !def.abort
      });
    };
  }), $ZodNumber = /* @__PURE__ */ $constructor("$ZodNumber", (inst, def) => {
    $ZodType.init(inst, def), inst._zod.pattern = inst._zod.bag.pattern ?? number, inst._zod.parse = (payload, _ctx) => {
      if (def.coerce)
        try {
          payload.value = Number(payload.value);
        } catch (_) {}
      let input = payload.value;
      if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input))
        return payload;
      let received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? "Infinity" : void 0 : void 0;
      return payload.issues.push({
        expected: "number",
        code: "invalid_type",
        input,
        inst,
        ...received ? { received } : {}
      }), payload;
    };
  }), $ZodNumberFormat = /* @__PURE__ */ $constructor("$ZodNumber", (inst, def) => {
    $ZodCheckNumberFormat.init(inst, def), $ZodNumber.init(inst, def);
  }), $ZodBoolean = /* @__PURE__ */ $constructor("$ZodBoolean", (inst, def) => {
    $ZodType.init(inst, def), inst._zod.pattern = boolean, inst._zod.parse = (payload, _ctx) => {
      if (def.coerce)
        try {
          payload.value = Boolean(payload.value);
        } catch (_) {}
      let input = payload.value;
      if (typeof input === "boolean")
        return payload;
      return payload.issues.push({
        expected: "boolean",
        code: "invalid_type",
        input,
        inst
      }), payload;
    };
  }), $ZodBigInt = /* @__PURE__ */ $constructor("$ZodBigInt", (inst, def) => {
    $ZodType.init(inst, def), inst._zod.pattern = bigint, inst._zod.parse = (payload, _ctx) => {
      if (def.coerce)
        try {
          payload.value = BigInt(payload.value);
        } catch (_) {}
      if (typeof payload.value === "bigint")
        return payload;
      return payload.issues.push({
        expected: "bigint",
        code: "invalid_type",
        input: payload.value,
        inst
      }), payload;
    };
  }), $ZodBigIntFormat = /* @__PURE__ */ $constructor("$ZodBigInt", (inst, def) => {
    $ZodCheckBigIntFormat.init(inst, def), $ZodBigInt.init(inst, def);
  }), $ZodSymbol = /* @__PURE__ */ $constructor("$ZodSymbol", (inst, def) => {
    $ZodType.init(inst, def), inst._zod.parse = (payload, _ctx) => {
      let input = payload.value;
      if (typeof input === "symbol")
        return payload;
      return payload.issues.push({
        expected: "symbol",
        code: "invalid_type",
        input,
        inst
      }), payload;
    };
  }), $ZodUndefined = /* @__PURE__ */ $constructor("$ZodUndefined", (inst, def) => {
    $ZodType.init(inst, def), inst._zod.pattern = _undefined, inst._zod.values = /* @__PURE__ */ new Set([void 0]), inst._zod.optin = "optional", inst._zod.optout = "optional", inst._zod.parse = (payload, _ctx) => {
      let input = payload.value;
      if (typeof input > "u")
        return payload;
      return payload.issues.push({
        expected: "undefined",
        code: "invalid_type",
        input,
        inst
      }), payload;
    };
  }), $ZodNull = /* @__PURE__ */ $constructor("$ZodNull", (inst, def) => {
    $ZodType.init(inst, def), inst._zod.pattern = _null, inst._zod.values = /* @__PURE__ */ new Set([null]), inst._zod.parse = (payload, _ctx) => {
      let input = payload.value;
      if (input === null)
        return payload;
      return payload.issues.push({
        expected: "null",
        code: "invalid_type",
        input,
        inst
      }), payload;
    };
  }), $ZodAny = /* @__PURE__ */ $constructor("$ZodAny", (inst, def) => {
    $ZodType.init(inst, def), inst._zod.parse = (payload) => payload;
  }), $ZodUnknown = /* @__PURE__ */ $constructor("$ZodUnknown", (inst, def) => {
    $ZodType.init(inst, def), inst._zod.parse = (payload) => payload;
  }), $ZodNever = /* @__PURE__ */ $constructor("$ZodNever", (inst, def) => {
    $ZodType.init(inst, def), inst._zod.parse = (payload, _ctx) => {
      return payload.issues.push({
        expected: "never",
        code: "invalid_type",
        input: payload.value,
        inst
      }), payload;
    };
  }), $ZodVoid = /* @__PURE__ */ $constructor("$ZodVoid", (inst, def) => {
    $ZodType.init(inst, def), inst._zod.parse = (payload, _ctx) => {
      let input = payload.value;
      if (typeof input > "u")
        return payload;
      return payload.issues.push({
        expected: "void",
        code: "invalid_type",
        input,
        inst
      }), payload;
    };
  }), $ZodDate = /* @__PURE__ */ $constructor("$ZodDate", (inst, def) => {
    $ZodType.init(inst, def), inst._zod.parse = (payload, _ctx) => {
      if (def.coerce)
        try {
          payload.value = new Date(payload.value);
        } catch (_err) {}
      let input = payload.value, isDate = input instanceof Date;
      if (isDate && !Number.isNaN(input.getTime()))
        return payload;
      return payload.issues.push({
        expected: "date",
        code: "invalid_type",
        input,
        ...isDate ? { received: "Invalid Date" } : {},
        inst
      }), payload;
    };
  });
  $ZodArray = /* @__PURE__ */ $constructor("$ZodArray", (inst, def) => {
    $ZodType.init(inst, def), inst._zod.parse = (payload, ctx) => {
      let input = payload.value;
      if (!Array.isArray(input))
        return payload.issues.push({
          expected: "array",
          code: "invalid_type",
          input,
          inst
        }), payload;
      payload.value = Array(input.length);
      let proms = [];
      for (let i = 0;i < input.length; i++) {
        let item = input[i], result = def.element._zod.run({
          value: item,
          issues: []
        }, ctx);
        if (result instanceof Promise)
          proms.push(result.then((result2) => handleArrayResult(result2, payload, i)));
        else
          handleArrayResult(result, payload, i);
      }
      if (proms.length)
        return Promise.all(proms).then(() => payload);
      return payload;
    };
  });
  $ZodObject = /* @__PURE__ */ $constructor("$ZodObject", (inst, def) => {
    $ZodType.init(inst, def);
    let _normalized = cached(() => {
      let keys2 = Object.keys(def.shape);
      for (let k of keys2)
        if (!(def.shape[k] instanceof $ZodType))
          throw Error(`Invalid element at key "${k}": expected a Zod schema`);
      let okeys = optionalKeys(def.shape);
      return {
        shape: def.shape,
        keys: keys2,
        keySet: new Set(keys2),
        numKeys: keys2.length,
        optionalKeys: new Set(okeys)
      };
    });
    defineLazy(inst._zod, "propValues", () => {
      let shape = def.shape, propValues = {};
      for (let key in shape) {
        let field = shape[key]._zod;
        if (field.values) {
          propValues[key] ?? (propValues[key] = /* @__PURE__ */ new Set);
          for (let v of field.values)
            propValues[key].add(v);
        }
      }
      return propValues;
    });
    let generateFastpass = (shape) => {
      let doc = new Doc(["shape", "payload", "ctx"]), normalized = _normalized.value, parseStr = (key) => {
        let k = esc(key);
        return `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
      };
      doc.write("const input = payload.value;");
      let ids = Object.create(null), counter = 0;
      for (let key of normalized.keys)
        ids[key] = `key_${counter++}`;
      doc.write("const newResult = {}");
      for (let key of normalized.keys)
        if (normalized.optionalKeys.has(key)) {
          let id = ids[key];
          doc.write(`const ${id} = ${parseStr(key)};`);
          let k = esc(key);
          doc.write(`
        if (${id}.issues.length) {
          if (input[${k}] === undefined) {
            if (${k} in input) {
              newResult[${k}] = undefined;
            }
          } else {
            payload.issues = payload.issues.concat(
              ${id}.issues.map((iss) => ({
                ...iss,
                path: iss.path ? [${k}, ...iss.path] : [${k}],
              }))
            );
          }
        } else if (${id}.value === undefined) {
          if (${k} in input) newResult[${k}] = undefined;
        } else {
          newResult[${k}] = ${id}.value;
        }
        `);
        } else {
          let id = ids[key];
          doc.write(`const ${id} = ${parseStr(key)};`), doc.write(`
          if (${id}.issues.length) payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${esc(key)}, ...iss.path] : [${esc(key)}]
          })));`), doc.write(`newResult[${esc(key)}] = ${id}.value`);
        }
      doc.write("payload.value = newResult;"), doc.write("return payload;");
      let fn = doc.compile();
      return (payload, ctx) => fn(shape, payload, ctx);
    }, fastpass, isObject3 = isObject2, jit = !globalConfig.jitless, fastEnabled = jit && allowsEval.value, catchall = def.catchall, value;
    inst._zod.parse = (payload, ctx) => {
      value ?? (value = _normalized.value);
      let input = payload.value;
      if (!isObject3(input))
        return payload.issues.push({
          expected: "object",
          code: "invalid_type",
          input,
          inst
        }), payload;
      let proms = [];
      if (jit && fastEnabled && ctx?.async === !1 && ctx.jitless !== !0) {
        if (!fastpass)
          fastpass = generateFastpass(def.shape);
        payload = fastpass(payload, ctx);
      } else {
        payload.value = {};
        let shape = value.shape;
        for (let key of value.keys) {
          let el = shape[key], r = el._zod.run({ value: input[key], issues: [] }, ctx), isOptional = el._zod.optin === "optional" && el._zod.optout === "optional";
          if (r instanceof Promise)
            proms.push(r.then((r2) => isOptional ? handleOptionalObjectResult(r2, payload, key, input) : handleObjectResult(r2, payload, key)));
          else if (isOptional)
            handleOptionalObjectResult(r, payload, key, input);
          else
            handleObjectResult(r, payload, key);
        }
      }
      if (!catchall)
        return proms.length ? Promise.all(proms).then(() => payload) : payload;
      let unrecognized = [], keySet = value.keySet, _catchall = catchall._zod, t = _catchall.def.type;
      for (let key of Object.keys(input)) {
        if (keySet.has(key))
          continue;
        if (t === "never") {
          unrecognized.push(key);
          continue;
        }
        let r = _catchall.run({ value: input[key], issues: [] }, ctx);
        if (r instanceof Promise)
          proms.push(r.then((r2) => handleObjectResult(r2, payload, key)));
        else
          handleObjectResult(r, payload, key);
      }
      if (unrecognized.length)
        payload.issues.push({
          code: "unrecognized_keys",
          keys: unrecognized,
          input,
          inst
        });
      if (!proms.length)
        return payload;
      return Promise.all(proms).then(() => {
        return payload;
      });
    };
  });
  $ZodUnion = /* @__PURE__ */ $constructor("$ZodUnion", (inst, def) => {
    $ZodType.init(inst, def), defineLazy(inst._zod, "optin", () => def.options.some((o) => o._zod.optin === "optional") ? "optional" : void 0), defineLazy(inst._zod, "optout", () => def.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0), defineLazy(inst._zod, "values", () => {
      if (def.options.every((o) => o._zod.values))
        return new Set(def.options.flatMap((option) => Array.from(option._zod.values)));
      return;
    }), defineLazy(inst._zod, "pattern", () => {
      if (def.options.every((o) => o._zod.pattern)) {
        let patterns = def.options.map((o) => o._zod.pattern);
        return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
      }
      return;
    }), inst._zod.parse = (payload, ctx) => {
      let async = !1, results = [];
      for (let option of def.options) {
        let result = option._zod.run({
          value: payload.value,
          issues: []
        }, ctx);
        if (result instanceof Promise)
          results.push(result), async = !0;
        else {
          if (result.issues.length === 0)
            return result;
          results.push(result);
        }
      }
      if (!async)
        return handleUnionResults(results, payload, inst, ctx);
      return Promise.all(results).then((results2) => {
        return handleUnionResults(results2, payload, inst, ctx);
      });
    };
  }), $ZodDiscriminatedUnion = /* @__PURE__ */ $constructor("$ZodDiscriminatedUnion", (inst, def) => {
    $ZodUnion.init(inst, def);
    let _super = inst._zod.parse;
    defineLazy(inst._zod, "propValues", () => {
      let propValues = {};
      for (let option of def.options) {
        let pv = option._zod.propValues;
        if (!pv || Object.keys(pv).length === 0)
          throw Error(`Invalid discriminated union option at index "${def.options.indexOf(option)}"`);
        for (let [k, v] of Object.entries(pv)) {
          if (!propValues[k])
            propValues[k] = /* @__PURE__ */ new Set;
          for (let val of v)
            propValues[k].add(val);
        }
      }
      return propValues;
    });
    let disc = cached(() => {
      let opts = def.options, map = /* @__PURE__ */ new Map;
      for (let o of opts) {
        let values = o._zod.propValues[def.discriminator];
        if (!values || values.size === 0)
          throw Error(`Invalid discriminated union option at index "${def.options.indexOf(o)}"`);
        for (let v of values) {
          if (map.has(v))
            throw Error(`Duplicate discriminator value "${String(v)}"`);
          map.set(v, o);
        }
      }
      return map;
    });
    inst._zod.parse = (payload, ctx) => {
      let input = payload.value;
      if (!isObject2(input))
        return payload.issues.push({
          code: "invalid_type",
          expected: "object",
          input,
          inst
        }), payload;
      let opt = disc.value.get(input?.[def.discriminator]);
      if (opt)
        return opt._zod.run(payload, ctx);
      if (def.unionFallback)
        return _super(payload, ctx);
      return payload.issues.push({
        code: "invalid_union",
        errors: [],
        note: "No matching discriminator",
        input,
        path: [def.discriminator],
        inst
      }), payload;
    };
  }), $ZodIntersection = /* @__PURE__ */ $constructor("$ZodIntersection", (inst, def) => {
    $ZodType.init(inst, def), inst._zod.parse = (payload, ctx) => {
      let input = payload.value, left = def.left._zod.run({ value: input, issues: [] }, ctx), right = def.right._zod.run({ value: input, issues: [] }, ctx);
      if (left instanceof Promise || right instanceof Promise)
        return Promise.all([left, right]).then(([left2, right2]) => {
          return handleIntersectionResults(payload, left2, right2);
        });
      return handleIntersectionResults(payload, left, right);
    };
  });
  $ZodTuple = /* @__PURE__ */ $constructor("$ZodTuple", (inst, def) => {
    $ZodType.init(inst, def);
    let items = def.items, optStart = items.length - [...items].reverse().findIndex((item) => item._zod.optin !== "optional");
    inst._zod.parse = (payload, ctx) => {
      let input = payload.value;
      if (!Array.isArray(input))
        return payload.issues.push({
          input,
          inst,
          expected: "tuple",
          code: "invalid_type"
        }), payload;
      payload.value = [];
      let proms = [];
      if (!def.rest) {
        let tooBig = input.length > items.length, tooSmall = input.length < optStart - 1;
        if (tooBig || tooSmall)
          return payload.issues.push({
            input,
            inst,
            origin: "array",
            ...tooBig ? { code: "too_big", maximum: items.length } : { code: "too_small", minimum: items.length }
          }), payload;
      }
      let i = -1;
      for (let item of items) {
        if (i++, i >= input.length) {
          if (i >= optStart)
            continue;
        }
        let result = item._zod.run({
          value: input[i],
          issues: []
        }, ctx);
        if (result instanceof Promise)
          proms.push(result.then((result2) => handleTupleResult(result2, payload, i)));
        else
          handleTupleResult(result, payload, i);
      }
      if (def.rest) {
        let rest = input.slice(items.length);
        for (let el of rest) {
          i++;
          let result = def.rest._zod.run({
            value: el,
            issues: []
          }, ctx);
          if (result instanceof Promise)
            proms.push(result.then((result2) => handleTupleResult(result2, payload, i)));
          else
            handleTupleResult(result, payload, i);
        }
      }
      if (proms.length)
        return Promise.all(proms).then(() => payload);
      return payload;
    };
  });
  $ZodRecord = /* @__PURE__ */ $constructor("$ZodRecord", (inst, def) => {
    $ZodType.init(inst, def), inst._zod.parse = (payload, ctx) => {
      let input = payload.value;
      if (!isPlainObject(input))
        return payload.issues.push({
          expected: "record",
          code: "invalid_type",
          input,
          inst
        }), payload;
      let proms = [];
      if (def.keyType._zod.values) {
        let values = def.keyType._zod.values;
        payload.value = {};
        for (let key of values)
          if (typeof key === "string" || typeof key === "number" || typeof key === "symbol") {
            let result = def.valueType._zod.run({ value: input[key], issues: [] }, ctx);
            if (result instanceof Promise)
              proms.push(result.then((result2) => {
                if (result2.issues.length)
                  payload.issues.push(...prefixIssues(key, result2.issues));
                payload.value[key] = result2.value;
              }));
            else {
              if (result.issues.length)
                payload.issues.push(...prefixIssues(key, result.issues));
              payload.value[key] = result.value;
            }
          }
        let unrecognized;
        for (let key in input)
          if (!values.has(key))
            unrecognized = unrecognized ?? [], unrecognized.push(key);
        if (unrecognized && unrecognized.length > 0)
          payload.issues.push({
            code: "unrecognized_keys",
            input,
            inst,
            keys: unrecognized
          });
      } else {
        payload.value = {};
        for (let key of Reflect.ownKeys(input)) {
          if (key === "__proto__")
            continue;
          let keyResult = def.keyType._zod.run({ value: key, issues: [] }, ctx);
          if (keyResult instanceof Promise)
            throw Error("Async schemas not supported in object keys currently");
          if (keyResult.issues.length) {
            payload.issues.push({
              origin: "record",
              code: "invalid_key",
              issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
              input: key,
              path: [key],
              inst
            }), payload.value[keyResult.value] = keyResult.value;
            continue;
          }
          let result = def.valueType._zod.run({ value: input[key], issues: [] }, ctx);
          if (result instanceof Promise)
            proms.push(result.then((result2) => {
              if (result2.issues.length)
                payload.issues.push(...prefixIssues(key, result2.issues));
              payload.value[keyResult.value] = result2.value;
            }));
          else {
            if (result.issues.length)
              payload.issues.push(...prefixIssues(key, result.issues));
            payload.value[keyResult.value] = result.value;
          }
        }
      }
      if (proms.length)
        return Promise.all(proms).then(() => payload);
      return payload;
    };
  }), $ZodMap = /* @__PURE__ */ $constructor("$ZodMap", (inst, def) => {
    $ZodType.init(inst, def), inst._zod.parse = (payload, ctx) => {
      let input = payload.value;
      if (!(input instanceof Map))
        return payload.issues.push({
          expected: "map",
          code: "invalid_type",
          input,
          inst
        }), payload;
      let proms = [];
      payload.value = /* @__PURE__ */ new Map;
      for (let [key, value] of input) {
        let keyResult = def.keyType._zod.run({ value: key, issues: [] }, ctx), valueResult = def.valueType._zod.run({ value, issues: [] }, ctx);
        if (keyResult instanceof Promise || valueResult instanceof Promise)
          proms.push(Promise.all([keyResult, valueResult]).then(([keyResult2, valueResult2]) => {
            handleMapResult(keyResult2, valueResult2, payload, key, input, inst, ctx);
          }));
        else
          handleMapResult(keyResult, valueResult, payload, key, input, inst, ctx);
      }
      if (proms.length)
        return Promise.all(proms).then(() => payload);
      return payload;
    };
  });
  $ZodSet = /* @__PURE__ */ $constructor("$ZodSet", (inst, def) => {
    $ZodType.init(inst, def), inst._zod.parse = (payload, ctx) => {
      let input = payload.value;
      if (!(input instanceof Set))
        return payload.issues.push({
          input,
          inst,
          expected: "set",
          code: "invalid_type"
        }), payload;
      let proms = [];
      payload.value = /* @__PURE__ */ new Set;
      for (let item of input) {
        let result = def.valueType._zod.run({ value: item, issues: [] }, ctx);
        if (result instanceof Promise)
          proms.push(result.then((result2) => handleSetResult(result2, payload)));
        else
          handleSetResult(result, payload);
      }
      if (proms.length)
        return Promise.all(proms).then(() => payload);
      return payload;
    };
  });
  $ZodEnum = /* @__PURE__ */ $constructor("$ZodEnum", (inst, def) => {
    $ZodType.init(inst, def);
    let values = getEnumValues(def.entries);
    inst._zod.values = new Set(values), inst._zod.pattern = new RegExp(`^(${values.filter((k) => propertyKeyTypes.has(typeof k)).map((o) => typeof o === "string" ? escapeRegex(o) : o.toString()).join("|")})$`), inst._zod.parse = (payload, _ctx) => {
      let input = payload.value;
      if (inst._zod.values.has(input))
        return payload;
      return payload.issues.push({
        code: "invalid_value",
        values,
        input,
        inst
      }), payload;
    };
  }), $ZodLiteral = /* @__PURE__ */ $constructor("$ZodLiteral", (inst, def) => {
    $ZodType.init(inst, def), inst._zod.values = new Set(def.values), inst._zod.pattern = new RegExp(`^(${def.values.map((o) => typeof o === "string" ? escapeRegex(o) : o ? o.toString() : String(o)).join("|")})$`), inst._zod.parse = (payload, _ctx) => {
      let input = payload.value;
      if (inst._zod.values.has(input))
        return payload;
      return payload.issues.push({
        code: "invalid_value",
        values: def.values,
        input,
        inst
      }), payload;
    };
  }), $ZodFile = /* @__PURE__ */ $constructor("$ZodFile", (inst, def) => {
    $ZodType.init(inst, def), inst._zod.parse = (payload, _ctx) => {
      let input = payload.value;
      if (input instanceof File)
        return payload;
      return payload.issues.push({
        expected: "file",
        code: "invalid_type",
        input,
        inst
      }), payload;
    };
  }), $ZodTransform = /* @__PURE__ */ $constructor("$ZodTransform", (inst, def) => {
    $ZodType.init(inst, def), inst._zod.parse = (payload, _ctx) => {
      let _out = def.transform(payload.value, payload);
      if (_ctx.async)
        return (_out instanceof Promise ? _out : Promise.resolve(_out)).then((output2) => {
          return payload.value = output2, payload;
        });
      if (_out instanceof Promise)
        throw new $ZodAsyncError;
      return payload.value = _out, payload;
    };
  }), $ZodOptional = /* @__PURE__ */ $constructor("$ZodOptional", (inst, def) => {
    $ZodType.init(inst, def), inst._zod.optin = "optional", inst._zod.optout = "optional", defineLazy(inst._zod, "values", () => {
      return def.innerType._zod.values ? /* @__PURE__ */ new Set([...def.innerType._zod.values, void 0]) : void 0;
    }), defineLazy(inst._zod, "pattern", () => {
      let pattern = def.innerType._zod.pattern;
      return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : void 0;
    }), inst._zod.parse = (payload, ctx) => {
      if (def.innerType._zod.optin === "optional")
        return def.innerType._zod.run(payload, ctx);
      if (payload.value === void 0)
        return payload;
      return def.innerType._zod.run(payload, ctx);
    };
  }), $ZodNullable = /* @__PURE__ */ $constructor("$ZodNullable", (inst, def) => {
    $ZodType.init(inst, def), defineLazy(inst._zod, "optin", () => def.innerType._zod.optin), defineLazy(inst._zod, "optout", () => def.innerType._zod.optout), defineLazy(inst._zod, "pattern", () => {
      let pattern = def.innerType._zod.pattern;
      return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : void 0;
    }), defineLazy(inst._zod, "values", () => {
      return def.innerType._zod.values ? /* @__PURE__ */ new Set([...def.innerType._zod.values, null]) : void 0;
    }), inst._zod.parse = (payload, ctx) => {
      if (payload.value === null)
        return payload;
      return def.innerType._zod.run(payload, ctx);
    };
  }), $ZodDefault = /* @__PURE__ */ $constructor("$ZodDefault", (inst, def) => {
    $ZodType.init(inst, def), inst._zod.optin = "optional", defineLazy(inst._zod, "values", () => def.innerType._zod.values), inst._zod.parse = (payload, ctx) => {
      if (payload.value === void 0)
        return payload.value = def.defaultValue, payload;
      let result = def.innerType._zod.run(payload, ctx);
      if (result instanceof Promise)
        return result.then((result2) => handleDefaultResult(result2, def));
      return handleDefaultResult(result, def);
    };
  });
  $ZodPrefault = /* @__PURE__ */ $constructor("$ZodPrefault", (inst, def) => {
    $ZodType.init(inst, def), inst._zod.optin = "optional", defineLazy(inst._zod, "values", () => def.innerType._zod.values), inst._zod.parse = (payload, ctx) => {
      if (payload.value === void 0)
        payload.value = def.defaultValue;
      return def.innerType._zod.run(payload, ctx);
    };
  }), $ZodNonOptional = /* @__PURE__ */ $constructor("$ZodNonOptional", (inst, def) => {
    $ZodType.init(inst, def), defineLazy(inst._zod, "values", () => {
      let v = def.innerType._zod.values;
      return v ? new Set([...v].filter((x) => x !== void 0)) : void 0;
    }), inst._zod.parse = (payload, ctx) => {
      let result = def.innerType._zod.run(payload, ctx);
      if (result instanceof Promise)
        return result.then((result2) => handleNonOptionalResult(result2, inst));
      return handleNonOptionalResult(result, inst);
    };
  });
  $ZodSuccess = /* @__PURE__ */ $constructor("$ZodSuccess", (inst, def) => {
    $ZodType.init(inst, def), inst._zod.parse = (payload, ctx) => {
      let result = def.innerType._zod.run(payload, ctx);
      if (result instanceof Promise)
        return result.then((result2) => {
          return payload.value = result2.issues.length === 0, payload;
        });
      return payload.value = result.issues.length === 0, payload;
    };
  }), $ZodCatch = /* @__PURE__ */ $constructor("$ZodCatch", (inst, def) => {
    $ZodType.init(inst, def), inst._zod.optin = "optional", defineLazy(inst._zod, "optout", () => def.innerType._zod.optout), defineLazy(inst._zod, "values", () => def.innerType._zod.values), inst._zod.parse = (payload, ctx) => {
      let result = def.innerType._zod.run(payload, ctx);
      if (result instanceof Promise)
        return result.then((result2) => {
          if (payload.value = result2.value, result2.issues.length)
            payload.value = def.catchValue({
              ...payload,
              error: {
                issues: result2.issues.map((iss) => finalizeIssue(iss, ctx, config()))
              },
              input: payload.value
            }), payload.issues = [];
          return payload;
        });
      if (payload.value = result.value, result.issues.length)
        payload.value = def.catchValue({
          ...payload,
          error: {
            issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config()))
          },
          input: payload.value
        }), payload.issues = [];
      return payload;
    };
  }), $ZodNaN = /* @__PURE__ */ $constructor("$ZodNaN", (inst, def) => {
    $ZodType.init(inst, def), inst._zod.parse = (payload, _ctx) => {
      if (typeof payload.value !== "number" || !Number.isNaN(payload.value))
        return payload.issues.push({
          input: payload.value,
          inst,
          expected: "nan",
          code: "invalid_type"
        }), payload;
      return payload;
    };
  }), $ZodPipe = /* @__PURE__ */ $constructor("$ZodPipe", (inst, def) => {
    $ZodType.init(inst, def), defineLazy(inst._zod, "values", () => def.in._zod.values), defineLazy(inst._zod, "optin", () => def.in._zod.optin), defineLazy(inst._zod, "optout", () => def.out._zod.optout), inst._zod.parse = (payload, ctx) => {
      let left = def.in._zod.run(payload, ctx);
      if (left instanceof Promise)
        return left.then((left2) => handlePipeResult(left2, def, ctx));
      return handlePipeResult(left, def, ctx);
    };
  });
  $ZodReadonly = /* @__PURE__ */ $constructor("$ZodReadonly", (inst, def) => {
    $ZodType.init(inst, def), defineLazy(inst._zod, "propValues", () => def.innerType._zod.propValues), defineLazy(inst._zod, "values", () => def.innerType._zod.values), defineLazy(inst._zod, "optin", () => def.innerType._zod.optin), defineLazy(inst._zod, "optout", () => def.innerType._zod.optout), inst._zod.parse = (payload, ctx) => {
      let result = def.innerType._zod.run(payload, ctx);
      if (result instanceof Promise)
        return result.then(handleReadonlyResult);
      return handleReadonlyResult(result);
    };
  });
  $ZodTemplateLiteral = /* @__PURE__ */ $constructor("$ZodTemplateLiteral", (inst, def) => {
    $ZodType.init(inst, def);
    let regexParts = [];
    for (let part of def.parts)
      if (part instanceof $ZodType) {
        if (!part._zod.pattern)
          throw Error(`Invalid template literal part, no pattern found: ${[...part._zod.traits].shift()}`);
        let source = part._zod.pattern instanceof RegExp ? part._zod.pattern.source : part._zod.pattern;
        if (!source)
          throw Error(`Invalid template literal part: ${part._zod.traits}`);
        let start = source.startsWith("^") ? 1 : 0, end = source.endsWith("$") ? source.length - 1 : source.length;
        regexParts.push(source.slice(start, end));
      } else if (part === null || primitiveTypes.has(typeof part))
        regexParts.push(escapeRegex(`${part}`));
      else
        throw Error(`Invalid template literal part: ${part}`);
    inst._zod.pattern = new RegExp(`^${regexParts.join("")}$`), inst._zod.parse = (payload, _ctx) => {
      if (typeof payload.value !== "string")
        return payload.issues.push({
          input: payload.value,
          inst,
          expected: "template_literal",
          code: "invalid_type"
        }), payload;
      if (inst._zod.pattern.lastIndex = 0, !inst._zod.pattern.test(payload.value))
        return payload.issues.push({
          input: payload.value,
          inst,
          code: "invalid_format",
          format: "template_literal",
          pattern: inst._zod.pattern.source
        }), payload;
      return payload;
    };
  }), $ZodPromise = /* @__PURE__ */ $constructor("$ZodPromise", (inst, def) => {
    $ZodType.init(inst, def), inst._zod.parse = (payload, ctx) => {
      return Promise.resolve(payload.value).then((inner) => def.innerType._zod.run({ value: inner, issues: [] }, ctx));
    };
  }), $ZodLazy = /* @__PURE__ */ $constructor("$ZodLazy", (inst, def) => {
    $ZodType.init(inst, def), defineLazy(inst._zod, "innerType", () => def.getter()), defineLazy(inst._zod, "pattern", () => inst._zod.innerType._zod.pattern), defineLazy(inst._zod, "propValues", () => inst._zod.innerType._zod.propValues), defineLazy(inst._zod, "optin", () => inst._zod.innerType._zod.optin), defineLazy(inst._zod, "optout", () => inst._zod.innerType._zod.optout), inst._zod.parse = (payload, ctx) => {
      return inst._zod.innerType._zod.run(payload, ctx);
    };
  }), $ZodCustom = /* @__PURE__ */ $constructor("$ZodCustom", (inst, def) => {
    $ZodCheck.init(inst, def), $ZodType.init(inst, def), inst._zod.parse = (payload, _) => {
      return payload;
    }, inst._zod.check = (payload) => {
      let input = payload.value, r = def.fn(input);
      if (r instanceof Promise)
        return r.then((r2) => handleRefineResult(r2, payload, input, inst));
      handleRefineResult(r, payload, input, inst);
      return;
    };
  });
});
