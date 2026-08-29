// var: init_checks
var init_checks = __esm(() => {
  init_core();
  init_regexes();
  init_util();
  $ZodCheck = /* @__PURE__ */ $constructor("$ZodCheck", (inst, def) => {
    var _a2;
    inst._zod ?? (inst._zod = {}), inst._zod.def = def, (_a2 = inst._zod).onattach ?? (_a2.onattach = []);
  }), numericOriginMap = {
    number: "number",
    bigint: "bigint",
    object: "date"
  }, $ZodCheckLessThan = /* @__PURE__ */ $constructor("$ZodCheckLessThan", (inst, def) => {
    $ZodCheck.init(inst, def);
    let origin = numericOriginMap[typeof def.value];
    inst._zod.onattach.push((inst2) => {
      let bag = inst2._zod.bag, curr = (def.inclusive ? bag.maximum : bag.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
      if (def.value < curr)
        if (def.inclusive)
          bag.maximum = def.value;
        else
          bag.exclusiveMaximum = def.value;
    }), inst._zod.check = (payload) => {
      if (def.inclusive ? payload.value <= def.value : payload.value < def.value)
        return;
      payload.issues.push({
        origin,
        code: "too_big",
        maximum: def.value,
        input: payload.value,
        inclusive: def.inclusive,
        inst,
        continue: !def.abort
      });
    };
  }), $ZodCheckGreaterThan = /* @__PURE__ */ $constructor("$ZodCheckGreaterThan", (inst, def) => {
    $ZodCheck.init(inst, def);
    let origin = numericOriginMap[typeof def.value];
    inst._zod.onattach.push((inst2) => {
      let bag = inst2._zod.bag, curr = (def.inclusive ? bag.minimum : bag.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
      if (def.value > curr)
        if (def.inclusive)
          bag.minimum = def.value;
        else
          bag.exclusiveMinimum = def.value;
    }), inst._zod.check = (payload) => {
      if (def.inclusive ? payload.value >= def.value : payload.value > def.value)
        return;
      payload.issues.push({
        origin,
        code: "too_small",
        minimum: def.value,
        input: payload.value,
        inclusive: def.inclusive,
        inst,
        continue: !def.abort
      });
    };
  }), $ZodCheckMultipleOf = /* @__PURE__ */ $constructor("$ZodCheckMultipleOf", (inst, def) => {
    $ZodCheck.init(inst, def), inst._zod.onattach.push((inst2) => {
      var _a2;
      (_a2 = inst2._zod.bag).multipleOf ?? (_a2.multipleOf = def.value);
    }), inst._zod.check = (payload) => {
      if (typeof payload.value !== typeof def.value)
        throw Error("Cannot mix number and bigint in multiple_of check.");
      if (typeof payload.value === "bigint" ? payload.value % def.value === BigInt(0) : floatSafeRemainder(payload.value, def.value) === 0)
        return;
      payload.issues.push({
        origin: typeof payload.value,
        code: "not_multiple_of",
        divisor: def.value,
        input: payload.value,
        inst,
        continue: !def.abort
      });
    };
  }), $ZodCheckNumberFormat = /* @__PURE__ */ $constructor("$ZodCheckNumberFormat", (inst, def) => {
    $ZodCheck.init(inst, def), def.format = def.format || "float64";
    let isInt = def.format?.includes("int"), origin = isInt ? "int" : "number", [minimum, maximum] = NUMBER_FORMAT_RANGES[def.format];
    inst._zod.onattach.push((inst2) => {
      let bag = inst2._zod.bag;
      if (bag.format = def.format, bag.minimum = minimum, bag.maximum = maximum, isInt)
        bag.pattern = integer;
    }), inst._zod.check = (payload) => {
      let input = payload.value;
      if (isInt) {
        if (!Number.isInteger(input)) {
          payload.issues.push({
            expected: origin,
            format: def.format,
            code: "invalid_type",
            input,
            inst
          });
          return;
        }
        if (!Number.isSafeInteger(input)) {
          if (input > 0)
            payload.issues.push({
              input,
              code: "too_big",
              maximum: Number.MAX_SAFE_INTEGER,
              note: "Integers must be within the safe integer range.",
              inst,
              origin,
              continue: !def.abort
            });
          else
            payload.issues.push({
              input,
              code: "too_small",
              minimum: Number.MIN_SAFE_INTEGER,
              note: "Integers must be within the safe integer range.",
              inst,
              origin,
              continue: !def.abort
            });
          return;
        }
      }
      if (input < minimum)
        payload.issues.push({
          origin: "number",
          input,
          code: "too_small",
          minimum,
          inclusive: !0,
          inst,
          continue: !def.abort
        });
      if (input > maximum)
        payload.issues.push({
          origin: "number",
          input,
          code: "too_big",
          maximum,
          inst
        });
    };
  }), $ZodCheckBigIntFormat = /* @__PURE__ */ $constructor("$ZodCheckBigIntFormat", (inst, def) => {
    $ZodCheck.init(inst, def);
    let [minimum, maximum] = BIGINT_FORMAT_RANGES[def.format];
    inst._zod.onattach.push((inst2) => {
      let bag = inst2._zod.bag;
      bag.format = def.format, bag.minimum = minimum, bag.maximum = maximum;
    }), inst._zod.check = (payload) => {
      let input = payload.value;
      if (input < minimum)
        payload.issues.push({
          origin: "bigint",
          input,
          code: "too_small",
          minimum,
          inclusive: !0,
          inst,
          continue: !def.abort
        });
      if (input > maximum)
        payload.issues.push({
          origin: "bigint",
          input,
          code: "too_big",
          maximum,
          inst
        });
    };
  }), $ZodCheckMaxSize = /* @__PURE__ */ $constructor("$ZodCheckMaxSize", (inst, def) => {
    var _a2;
    $ZodCheck.init(inst, def), (_a2 = inst._zod.def).when ?? (_a2.when = (payload) => {
      let val = payload.value;
      return !nullish(val) && val.size !== void 0;
    }), inst._zod.onattach.push((inst2) => {
      let curr = inst2._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
      if (def.maximum < curr)
        inst2._zod.bag.maximum = def.maximum;
    }), inst._zod.check = (payload) => {
      let input = payload.value;
      if (input.size <= def.maximum)
        return;
      payload.issues.push({
        origin: getSizableOrigin(input),
        code: "too_big",
        maximum: def.maximum,
        input,
        inst,
        continue: !def.abort
      });
    };
  }), $ZodCheckMinSize = /* @__PURE__ */ $constructor("$ZodCheckMinSize", (inst, def) => {
    var _a2;
    $ZodCheck.init(inst, def), (_a2 = inst._zod.def).when ?? (_a2.when = (payload) => {
      let val = payload.value;
      return !nullish(val) && val.size !== void 0;
    }), inst._zod.onattach.push((inst2) => {
      let curr = inst2._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
      if (def.minimum > curr)
        inst2._zod.bag.minimum = def.minimum;
    }), inst._zod.check = (payload) => {
      let input = payload.value;
      if (input.size >= def.minimum)
        return;
      payload.issues.push({
        origin: getSizableOrigin(input),
        code: "too_small",
        minimum: def.minimum,
        input,
        inst,
        continue: !def.abort
      });
    };
  }), $ZodCheckSizeEquals = /* @__PURE__ */ $constructor("$ZodCheckSizeEquals", (inst, def) => {
    var _a2;
    $ZodCheck.init(inst, def), (_a2 = inst._zod.def).when ?? (_a2.when = (payload) => {
      let val = payload.value;
      return !nullish(val) && val.size !== void 0;
    }), inst._zod.onattach.push((inst2) => {
      let bag = inst2._zod.bag;
      bag.minimum = def.size, bag.maximum = def.size, bag.size = def.size;
    }), inst._zod.check = (payload) => {
      let input = payload.value, size = input.size;
      if (size === def.size)
        return;
      let tooBig = size > def.size;
      payload.issues.push({
        origin: getSizableOrigin(input),
        ...tooBig ? { code: "too_big", maximum: def.size } : { code: "too_small", minimum: def.size },
        inclusive: !0,
        exact: !0,
        input: payload.value,
        inst,
        continue: !def.abort
      });
    };
  }), $ZodCheckMaxLength = /* @__PURE__ */ $constructor("$ZodCheckMaxLength", (inst, def) => {
    var _a2;
    $ZodCheck.init(inst, def), (_a2 = inst._zod.def).when ?? (_a2.when = (payload) => {
      let val = payload.value;
      return !nullish(val) && val.length !== void 0;
    }), inst._zod.onattach.push((inst2) => {
      let curr = inst2._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
      if (def.maximum < curr)
        inst2._zod.bag.maximum = def.maximum;
    }), inst._zod.check = (payload) => {
      let input = payload.value;
      if (input.length <= def.maximum)
        return;
      let origin = getLengthableOrigin(input);
      payload.issues.push({
        origin,
        code: "too_big",
        maximum: def.maximum,
        inclusive: !0,
        input,
        inst,
        continue: !def.abort
      });
    };
  }), $ZodCheckMinLength = /* @__PURE__ */ $constructor("$ZodCheckMinLength", (inst, def) => {
    var _a2;
    $ZodCheck.init(inst, def), (_a2 = inst._zod.def).when ?? (_a2.when = (payload) => {
      let val = payload.value;
      return !nullish(val) && val.length !== void 0;
    }), inst._zod.onattach.push((inst2) => {
      let curr = inst2._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
      if (def.minimum > curr)
        inst2._zod.bag.minimum = def.minimum;
    }), inst._zod.check = (payload) => {
      let input = payload.value;
      if (input.length >= def.minimum)
        return;
      let origin = getLengthableOrigin(input);
      payload.issues.push({
        origin,
        code: "too_small",
        minimum: def.minimum,
        inclusive: !0,
        input,
        inst,
        continue: !def.abort
      });
    };
  }), $ZodCheckLengthEquals = /* @__PURE__ */ $constructor("$ZodCheckLengthEquals", (inst, def) => {
    var _a2;
    $ZodCheck.init(inst, def), (_a2 = inst._zod.def).when ?? (_a2.when = (payload) => {
      let val = payload.value;
      return !nullish(val) && val.length !== void 0;
    }), inst._zod.onattach.push((inst2) => {
      let bag = inst2._zod.bag;
      bag.minimum = def.length, bag.maximum = def.length, bag.length = def.length;
    }), inst._zod.check = (payload) => {
      let input = payload.value, length = input.length;
      if (length === def.length)
        return;
      let origin = getLengthableOrigin(input), tooBig = length > def.length;
      payload.issues.push({
        origin,
        ...tooBig ? { code: "too_big", maximum: def.length } : { code: "too_small", minimum: def.length },
        inclusive: !0,
        exact: !0,
        input: payload.value,
        inst,
        continue: !def.abort
      });
    };
  }), $ZodCheckStringFormat = /* @__PURE__ */ $constructor("$ZodCheckStringFormat", (inst, def) => {
    var _a2, _b;
    if ($ZodCheck.init(inst, def), inst._zod.onattach.push((inst2) => {
      let bag = inst2._zod.bag;
      if (bag.format = def.format, def.pattern)
        bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set), bag.patterns.add(def.pattern);
    }), def.pattern)
      (_a2 = inst._zod).check ?? (_a2.check = (payload) => {
        if (def.pattern.lastIndex = 0, def.pattern.test(payload.value))
          return;
        payload.issues.push({
          origin: "string",
          code: "invalid_format",
          format: def.format,
          input: payload.value,
          ...def.pattern ? { pattern: def.pattern.toString() } : {},
          inst,
          continue: !def.abort
        });
      });
    else
      (_b = inst._zod).check ?? (_b.check = () => {});
  }), $ZodCheckRegex = /* @__PURE__ */ $constructor("$ZodCheckRegex", (inst, def) => {
    $ZodCheckStringFormat.init(inst, def), inst._zod.check = (payload) => {
      if (def.pattern.lastIndex = 0, def.pattern.test(payload.value))
        return;
      payload.issues.push({
        origin: "string",
        code: "invalid_format",
        format: "regex",
        input: payload.value,
        pattern: def.pattern.toString(),
        inst,
        continue: !def.abort
      });
    };
  }), $ZodCheckLowerCase = /* @__PURE__ */ $constructor("$ZodCheckLowerCase", (inst, def) => {
    def.pattern ?? (def.pattern = lowercase), $ZodCheckStringFormat.init(inst, def);
  }), $ZodCheckUpperCase = /* @__PURE__ */ $constructor("$ZodCheckUpperCase", (inst, def) => {
    def.pattern ?? (def.pattern = uppercase), $ZodCheckStringFormat.init(inst, def);
  }), $ZodCheckIncludes = /* @__PURE__ */ $constructor("$ZodCheckIncludes", (inst, def) => {
    $ZodCheck.init(inst, def);
    let escapedRegex = escapeRegex(def.includes), pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position}}${escapedRegex}` : escapedRegex);
    def.pattern = pattern, inst._zod.onattach.push((inst2) => {
      let bag = inst2._zod.bag;
      bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set), bag.patterns.add(pattern);
    }), inst._zod.check = (payload) => {
      if (payload.value.includes(def.includes, def.position))
        return;
      payload.issues.push({
        origin: "string",
        code: "invalid_format",
        format: "includes",
        includes: def.includes,
        input: payload.value,
        inst,
        continue: !def.abort
      });
    };
  }), $ZodCheckStartsWith = /* @__PURE__ */ $constructor("$ZodCheckStartsWith", (inst, def) => {
    $ZodCheck.init(inst, def);
    let pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
    def.pattern ?? (def.pattern = pattern), inst._zod.onattach.push((inst2) => {
      let bag = inst2._zod.bag;
      bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set), bag.patterns.add(pattern);
    }), inst._zod.check = (payload) => {
      if (payload.value.startsWith(def.prefix))
        return;
      payload.issues.push({
        origin: "string",
        code: "invalid_format",
        format: "starts_with",
        prefix: def.prefix,
        input: payload.value,
        inst,
        continue: !def.abort
      });
    };
  }), $ZodCheckEndsWith = /* @__PURE__ */ $constructor("$ZodCheckEndsWith", (inst, def) => {
    $ZodCheck.init(inst, def);
    let pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
    def.pattern ?? (def.pattern = pattern), inst._zod.onattach.push((inst2) => {
      let bag = inst2._zod.bag;
      bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set), bag.patterns.add(pattern);
    }), inst._zod.check = (payload) => {
      if (payload.value.endsWith(def.suffix))
        return;
      payload.issues.push({
        origin: "string",
        code: "invalid_format",
        format: "ends_with",
        suffix: def.suffix,
        input: payload.value,
        inst,
        continue: !def.abort
      });
    };
  });
  $ZodCheckProperty = /* @__PURE__ */ $constructor("$ZodCheckProperty", (inst, def) => {
    $ZodCheck.init(inst, def), inst._zod.check = (payload) => {
      let result = def.schema._zod.run({
        value: payload.value[def.property],
        issues: []
      }, {});
      if (result instanceof Promise)
        return result.then((result2) => handleCheckPropertyResult(result2, payload, def.property));
      handleCheckPropertyResult(result, payload, def.property);
      return;
    };
  }), $ZodCheckMimeType = /* @__PURE__ */ $constructor("$ZodCheckMimeType", (inst, def) => {
    $ZodCheck.init(inst, def);
    let mimeSet = new Set(def.mime);
    inst._zod.onattach.push((inst2) => {
      inst2._zod.bag.mime = def.mime;
    }), inst._zod.check = (payload) => {
      if (mimeSet.has(payload.value.type))
        return;
      payload.issues.push({
        code: "invalid_value",
        values: def.mime,
        input: payload.value.type,
        inst
      });
    };
  }), $ZodCheckOverwrite = /* @__PURE__ */ $constructor("$ZodCheckOverwrite", (inst, def) => {
    $ZodCheck.init(inst, def), inst._zod.check = (payload) => {
      payload.value = def.tx(payload.value);
    };
  });
});
