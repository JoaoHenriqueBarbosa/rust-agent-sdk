// var: init_types15
var init_types15 = __esm(() => {
  init_ZodError();
  init_errors8();
  init_errorUtil();
  init_parseUtil();
  init_util8();
  cuidRegex = /^c[^\s-]{8,}$/i, cuid2Regex = /^[0-9a-z]+$/, ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i, uuidRegex2 = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, nanoidRegex = /^[a-z0-9_-]{21}$/i, jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/, durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/, ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/, ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/, dateRegex = new RegExp(`^${dateRegexSource}$`);
  ZodString2 = class ZodString2 extends ZodType2 {
    _parse(input) {
      if (this._def.coerce)
        input.data = String(input.data);
      if (this._getType(input) !== ZodParsedType.string) {
        let ctx2 = this._getOrReturnCtx(input);
        return addIssueToContext(ctx2, {
          code: ZodIssueCode2.invalid_type,
          expected: ZodParsedType.string,
          received: ctx2.parsedType
        }), INVALID;
      }
      let status = new ParseStatus, ctx = void 0;
      for (let check3 of this._def.checks)
        if (check3.kind === "min") {
          if (input.data.length < check3.value)
            ctx = this._getOrReturnCtx(input, ctx), addIssueToContext(ctx, {
              code: ZodIssueCode2.too_small,
              minimum: check3.value,
              type: "string",
              inclusive: !0,
              exact: !1,
              message: check3.message
            }), status.dirty();
        } else if (check3.kind === "max") {
          if (input.data.length > check3.value)
            ctx = this._getOrReturnCtx(input, ctx), addIssueToContext(ctx, {
              code: ZodIssueCode2.too_big,
              maximum: check3.value,
              type: "string",
              inclusive: !0,
              exact: !1,
              message: check3.message
            }), status.dirty();
        } else if (check3.kind === "length") {
          let tooBig = input.data.length > check3.value, tooSmall = input.data.length < check3.value;
          if (tooBig || tooSmall) {
            if (ctx = this._getOrReturnCtx(input, ctx), tooBig)
              addIssueToContext(ctx, {
                code: ZodIssueCode2.too_big,
                maximum: check3.value,
                type: "string",
                inclusive: !0,
                exact: !0,
                message: check3.message
              });
            else if (tooSmall)
              addIssueToContext(ctx, {
                code: ZodIssueCode2.too_small,
                minimum: check3.value,
                type: "string",
                inclusive: !0,
                exact: !0,
                message: check3.message
              });
            status.dirty();
          }
        } else if (check3.kind === "email") {
          if (!emailRegex.test(input.data))
            ctx = this._getOrReturnCtx(input, ctx), addIssueToContext(ctx, {
              validation: "email",
              code: ZodIssueCode2.invalid_string,
              message: check3.message
            }), status.dirty();
        } else if (check3.kind === "emoji") {
          if (!emojiRegex)
            emojiRegex = new RegExp(_emojiRegex, "u");
          if (!emojiRegex.test(input.data))
            ctx = this._getOrReturnCtx(input, ctx), addIssueToContext(ctx, {
              validation: "emoji",
              code: ZodIssueCode2.invalid_string,
              message: check3.message
            }), status.dirty();
        } else if (check3.kind === "uuid") {
          if (!uuidRegex2.test(input.data))
            ctx = this._getOrReturnCtx(input, ctx), addIssueToContext(ctx, {
              validation: "uuid",
              code: ZodIssueCode2.invalid_string,
              message: check3.message
            }), status.dirty();
        } else if (check3.kind === "nanoid") {
          if (!nanoidRegex.test(input.data))
            ctx = this._getOrReturnCtx(input, ctx), addIssueToContext(ctx, {
              validation: "nanoid",
              code: ZodIssueCode2.invalid_string,
              message: check3.message
            }), status.dirty();
        } else if (check3.kind === "cuid") {
          if (!cuidRegex.test(input.data))
            ctx = this._getOrReturnCtx(input, ctx), addIssueToContext(ctx, {
              validation: "cuid",
              code: ZodIssueCode2.invalid_string,
              message: check3.message
            }), status.dirty();
        } else if (check3.kind === "cuid2") {
          if (!cuid2Regex.test(input.data))
            ctx = this._getOrReturnCtx(input, ctx), addIssueToContext(ctx, {
              validation: "cuid2",
              code: ZodIssueCode2.invalid_string,
              message: check3.message
            }), status.dirty();
        } else if (check3.kind === "ulid") {
          if (!ulidRegex.test(input.data))
            ctx = this._getOrReturnCtx(input, ctx), addIssueToContext(ctx, {
              validation: "ulid",
              code: ZodIssueCode2.invalid_string,
              message: check3.message
            }), status.dirty();
        } else if (check3.kind === "url")
          try {
            new URL(input.data);
          } catch {
            ctx = this._getOrReturnCtx(input, ctx), addIssueToContext(ctx, {
              validation: "url",
              code: ZodIssueCode2.invalid_string,
              message: check3.message
            }), status.dirty();
          }
        else if (check3.kind === "regex") {
          if (check3.regex.lastIndex = 0, !check3.regex.test(input.data))
            ctx = this._getOrReturnCtx(input, ctx), addIssueToContext(ctx, {
              validation: "regex",
              code: ZodIssueCode2.invalid_string,
              message: check3.message
            }), status.dirty();
        } else if (check3.kind === "trim")
          input.data = input.data.trim();
        else if (check3.kind === "includes") {
          if (!input.data.includes(check3.value, check3.position))
            ctx = this._getOrReturnCtx(input, ctx), addIssueToContext(ctx, {
              code: ZodIssueCode2.invalid_string,
              validation: { includes: check3.value, position: check3.position },
              message: check3.message
            }), status.dirty();
        } else if (check3.kind === "toLowerCase")
          input.data = input.data.toLowerCase();
        else if (check3.kind === "toUpperCase")
          input.data = input.data.toUpperCase();
        else if (check3.kind === "startsWith") {
          if (!input.data.startsWith(check3.value))
            ctx = this._getOrReturnCtx(input, ctx), addIssueToContext(ctx, {
              code: ZodIssueCode2.invalid_string,
              validation: { startsWith: check3.value },
              message: check3.message
            }), status.dirty();
        } else if (check3.kind === "endsWith") {
          if (!input.data.endsWith(check3.value))
            ctx = this._getOrReturnCtx(input, ctx), addIssueToContext(ctx, {
              code: ZodIssueCode2.invalid_string,
              validation: { endsWith: check3.value },
              message: check3.message
            }), status.dirty();
        } else if (check3.kind === "datetime") {
          if (!datetimeRegex(check3).test(input.data))
            ctx = this._getOrReturnCtx(input, ctx), addIssueToContext(ctx, {
              code: ZodIssueCode2.invalid_string,
              validation: "datetime",
              message: check3.message
            }), status.dirty();
        } else if (check3.kind === "date") {
          if (!dateRegex.test(input.data))
            ctx = this._getOrReturnCtx(input, ctx), addIssueToContext(ctx, {
              code: ZodIssueCode2.invalid_string,
              validation: "date",
              message: check3.message
            }), status.dirty();
        } else if (check3.kind === "time") {
          if (!timeRegex(check3).test(input.data))
            ctx = this._getOrReturnCtx(input, ctx), addIssueToContext(ctx, {
              code: ZodIssueCode2.invalid_string,
              validation: "time",
              message: check3.message
            }), status.dirty();
        } else if (check3.kind === "duration") {
          if (!durationRegex.test(input.data))
            ctx = this._getOrReturnCtx(input, ctx), addIssueToContext(ctx, {
              validation: "duration",
              code: ZodIssueCode2.invalid_string,
              message: check3.message
            }), status.dirty();
        } else if (check3.kind === "ip") {
          if (!isValidIP(input.data, check3.version))
            ctx = this._getOrReturnCtx(input, ctx), addIssueToContext(ctx, {
              validation: "ip",
              code: ZodIssueCode2.invalid_string,
              message: check3.message
            }), status.dirty();
        } else if (check3.kind === "jwt") {
          if (!isValidJWT2(input.data, check3.alg))
            ctx = this._getOrReturnCtx(input, ctx), addIssueToContext(ctx, {
              validation: "jwt",
              code: ZodIssueCode2.invalid_string,
              message: check3.message
            }), status.dirty();
        } else if (check3.kind === "cidr") {
          if (!isValidCidr(input.data, check3.version))
            ctx = this._getOrReturnCtx(input, ctx), addIssueToContext(ctx, {
              validation: "cidr",
              code: ZodIssueCode2.invalid_string,
              message: check3.message
            }), status.dirty();
        } else if (check3.kind === "base64") {
          if (!base64Regex.test(input.data))
            ctx = this._getOrReturnCtx(input, ctx), addIssueToContext(ctx, {
              validation: "base64",
              code: ZodIssueCode2.invalid_string,
              message: check3.message
            }), status.dirty();
        } else if (check3.kind === "base64url") {
          if (!base64urlRegex.test(input.data))
            ctx = this._getOrReturnCtx(input, ctx), addIssueToContext(ctx, {
              validation: "base64url",
              code: ZodIssueCode2.invalid_string,
              message: check3.message
            }), status.dirty();
        } else
          util10.assertNever(check3);
      return { status: status.value, value: input.data };
    }
    _regex(regex2, validation, message) {
      return this.refinement((data) => regex2.test(data), {
        validation,
        code: ZodIssueCode2.invalid_string,
        ...errorUtil.errToObj(message)
      });
    }
    _addCheck(check3) {
      return new ZodString2({
        ...this._def,
        checks: [...this._def.checks, check3]
      });
    }
    email(message) {
      return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
    }
    url(message) {
      return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
    }
    emoji(message) {
      return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
    }
    uuid(message) {
      return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
    }
    nanoid(message) {
      return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
    }
    cuid(message) {
      return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
    }
    cuid2(message) {
      return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
    }
    ulid(message) {
      return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
    }
    base64(message) {
      return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
    }
    base64url(message) {
      return this._addCheck({
        kind: "base64url",
        ...errorUtil.errToObj(message)
      });
    }
    jwt(options) {
      return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
    }
    ip(options) {
      return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
    }
    cidr(options) {
      return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
    }
    datetime(options) {
      if (typeof options === "string")
        return this._addCheck({
          kind: "datetime",
          precision: null,
          offset: !1,
          local: !1,
          message: options
        });
      return this._addCheck({
        kind: "datetime",
        precision: typeof options?.precision > "u" ? null : options?.precision,
        offset: options?.offset ?? !1,
        local: options?.local ?? !1,
        ...errorUtil.errToObj(options?.message)
      });
    }
    date(message) {
      return this._addCheck({ kind: "date", message });
    }
    time(options) {
      if (typeof options === "string")
        return this._addCheck({
          kind: "time",
          precision: null,
          message: options
        });
      return this._addCheck({
        kind: "time",
        precision: typeof options?.precision > "u" ? null : options?.precision,
        ...errorUtil.errToObj(options?.message)
      });
    }
    duration(message) {
      return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
    }
    regex(regex2, message) {
      return this._addCheck({
        kind: "regex",
        regex: regex2,
        ...errorUtil.errToObj(message)
      });
    }
    includes(value, options) {
      return this._addCheck({
        kind: "includes",
        value,
        position: options?.position,
        ...errorUtil.errToObj(options?.message)
      });
    }
    startsWith(value, message) {
      return this._addCheck({
        kind: "startsWith",
        value,
        ...errorUtil.errToObj(message)
      });
    }
    endsWith(value, message) {
      return this._addCheck({
        kind: "endsWith",
        value,
        ...errorUtil.errToObj(message)
      });
    }
    min(minLength, message) {
      return this._addCheck({
        kind: "min",
        value: minLength,
        ...errorUtil.errToObj(message)
      });
    }
    max(maxLength, message) {
      return this._addCheck({
        kind: "max",
        value: maxLength,
        ...errorUtil.errToObj(message)
      });
    }
    length(len, message) {
      return this._addCheck({
        kind: "length",
        value: len,
        ...errorUtil.errToObj(message)
      });
    }
    nonempty(message) {
      return this.min(1, errorUtil.errToObj(message));
    }
    trim() {
      return new ZodString2({
        ...this._def,
        checks: [...this._def.checks, { kind: "trim" }]
      });
    }
    toLowerCase() {
      return new ZodString2({
        ...this._def,
        checks: [...this._def.checks, { kind: "toLowerCase" }]
      });
    }
    toUpperCase() {
      return new ZodString2({
        ...this._def,
        checks: [...this._def.checks, { kind: "toUpperCase" }]
      });
    }
    get isDatetime() {
      return !!this._def.checks.find((ch) => ch.kind === "datetime");
    }
    get isDate() {
      return !!this._def.checks.find((ch) => ch.kind === "date");
    }
    get isTime() {
      return !!this._def.checks.find((ch) => ch.kind === "time");
    }
    get isDuration() {
      return !!this._def.checks.find((ch) => ch.kind === "duration");
    }
    get isEmail() {
      return !!this._def.checks.find((ch) => ch.kind === "email");
    }
    get isURL() {
      return !!this._def.checks.find((ch) => ch.kind === "url");
    }
    get isEmoji() {
      return !!this._def.checks.find((ch) => ch.kind === "emoji");
    }
    get isUUID() {
      return !!this._def.checks.find((ch) => ch.kind === "uuid");
    }
    get isNANOID() {
      return !!this._def.checks.find((ch) => ch.kind === "nanoid");
    }
    get isCUID() {
      return !!this._def.checks.find((ch) => ch.kind === "cuid");
    }
    get isCUID2() {
      return !!this._def.checks.find((ch) => ch.kind === "cuid2");
    }
    get isULID() {
      return !!this._def.checks.find((ch) => ch.kind === "ulid");
    }
    get isIP() {
      return !!this._def.checks.find((ch) => ch.kind === "ip");
    }
    get isCIDR() {
      return !!this._def.checks.find((ch) => ch.kind === "cidr");
    }
    get isBase64() {
      return !!this._def.checks.find((ch) => ch.kind === "base64");
    }
    get isBase64url() {
      return !!this._def.checks.find((ch) => ch.kind === "base64url");
    }
    get minLength() {
      let min = null;
      for (let ch of this._def.checks)
        if (ch.kind === "min") {
          if (min === null || ch.value > min)
            min = ch.value;
        }
      return min;
    }
    get maxLength() {
      let max = null;
      for (let ch of this._def.checks)
        if (ch.kind === "max") {
          if (max === null || ch.value < max)
            max = ch.value;
        }
      return max;
    }
  };
  ZodString2.create = (params) => {
    return new ZodString2({
      checks: [],
      typeName: ZodFirstPartyTypeKind.ZodString,
      coerce: params?.coerce ?? !1,
      ...processCreateParams(params)
    });
  };
  ZodNumber2 = class ZodNumber2 extends ZodType2 {
    constructor() {
      super(...arguments);
      this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
    }
    _parse(input) {
      if (this._def.coerce)
        input.data = Number(input.data);
      if (this._getType(input) !== ZodParsedType.number) {
        let ctx2 = this._getOrReturnCtx(input);
        return addIssueToContext(ctx2, {
          code: ZodIssueCode2.invalid_type,
          expected: ZodParsedType.number,
          received: ctx2.parsedType
        }), INVALID;
      }
      let ctx = void 0, status = new ParseStatus;
      for (let check3 of this._def.checks)
        if (check3.kind === "int") {
          if (!util10.isInteger(input.data))
            ctx = this._getOrReturnCtx(input, ctx), addIssueToContext(ctx, {
              code: ZodIssueCode2.invalid_type,
              expected: "integer",
              received: "float",
              message: check3.message
            }), status.dirty();
        } else if (check3.kind === "min") {
          if (check3.inclusive ? input.data < check3.value : input.data <= check3.value)
            ctx = this._getOrReturnCtx(input, ctx), addIssueToContext(ctx, {
              code: ZodIssueCode2.too_small,
              minimum: check3.value,
              type: "number",
              inclusive: check3.inclusive,
              exact: !1,
              message: check3.message
            }), status.dirty();
        } else if (check3.kind === "max") {
          if (check3.inclusive ? input.data > check3.value : input.data >= check3.value)
            ctx = this._getOrReturnCtx(input, ctx), addIssueToContext(ctx, {
              code: ZodIssueCode2.too_big,
              maximum: check3.value,
              type: "number",
              inclusive: check3.inclusive,
              exact: !1,
              message: check3.message
            }), status.dirty();
        } else if (check3.kind === "multipleOf") {
          if (floatSafeRemainder2(input.data, check3.value) !== 0)
            ctx = this._getOrReturnCtx(input, ctx), addIssueToContext(ctx, {
              code: ZodIssueCode2.not_multiple_of,
              multipleOf: check3.value,
              message: check3.message
            }), status.dirty();
        } else if (check3.kind === "finite") {
          if (!Number.isFinite(input.data))
            ctx = this._getOrReturnCtx(input, ctx), addIssueToContext(ctx, {
              code: ZodIssueCode2.not_finite,
              message: check3.message
            }), status.dirty();
        } else
          util10.assertNever(check3);
      return { status: status.value, value: input.data };
    }
    gte(value, message) {
      return this.setLimit("min", value, !0, errorUtil.toString(message));
    }
    gt(value, message) {
      return this.setLimit("min", value, !1, errorUtil.toString(message));
    }
    lte(value, message) {
      return this.setLimit("max", value, !0, errorUtil.toString(message));
    }
    lt(value, message) {
      return this.setLimit("max", value, !1, errorUtil.toString(message));
    }
    setLimit(kind, value, inclusive, message) {
      return new ZodNumber2({
        ...this._def,
        checks: [
          ...this._def.checks,
          {
            kind,
            value,
            inclusive,
            message: errorUtil.toString(message)
          }
        ]
      });
    }
    _addCheck(check3) {
      return new ZodNumber2({
        ...this._def,
        checks: [...this._def.checks, check3]
      });
    }
    int(message) {
      return this._addCheck({
        kind: "int",
        message: errorUtil.toString(message)
      });
    }
    positive(message) {
      return this._addCheck({
        kind: "min",
        value: 0,
        inclusive: !1,
        message: errorUtil.toString(message)
      });
    }
    negative(message) {
      return this._addCheck({
        kind: "max",
        value: 0,
        inclusive: !1,
        message: errorUtil.toString(message)
      });
    }
    nonpositive(message) {
      return this._addCheck({
        kind: "max",
        value: 0,
        inclusive: !0,
        message: errorUtil.toString(message)
      });
    }
    nonnegative(message) {
      return this._addCheck({
        kind: "min",
        value: 0,
        inclusive: !0,
        message: errorUtil.toString(message)
      });
    }
    multipleOf(value, message) {
      return this._addCheck({
        kind: "multipleOf",
        value,
        message: errorUtil.toString(message)
      });
    }
    finite(message) {
      return this._addCheck({
        kind: "finite",
        message: errorUtil.toString(message)
      });
    }
    safe(message) {
      return this._addCheck({
        kind: "min",
        inclusive: !0,
        value: Number.MIN_SAFE_INTEGER,
        message: errorUtil.toString(message)
      })._addCheck({
        kind: "max",
        inclusive: !0,
        value: Number.MAX_SAFE_INTEGER,
        message: errorUtil.toString(message)
      });
    }
    get minValue() {
      let min = null;
      for (let ch of this._def.checks)
        if (ch.kind === "min") {
          if (min === null || ch.value > min)
            min = ch.value;
        }
      return min;
    }
    get maxValue() {
      let max = null;
      for (let ch of this._def.checks)
        if (ch.kind === "max") {
          if (max === null || ch.value < max)
            max = ch.value;
        }
      return max;
    }
    get isInt() {
      return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util10.isInteger(ch.value));
    }
    get isFinite() {
      let max = null, min = null;
      for (let ch of this._def.checks)
        if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf")
          return !0;
        else if (ch.kind === "min") {
          if (min === null || ch.value > min)
            min = ch.value;
        } else if (ch.kind === "max") {
          if (max === null || ch.value < max)
            max = ch.value;
        }
      return Number.isFinite(min) && Number.isFinite(max);
    }
  };
  ZodNumber2.create = (params) => {
    return new ZodNumber2({
      checks: [],
      typeName: ZodFirstPartyTypeKind.ZodNumber,
      coerce: params?.coerce || !1,
      ...processCreateParams(params)
    });
  };
  ZodBigInt2 = class ZodBigInt2 extends ZodType2 {
    constructor() {
      super(...arguments);
      this.min = this.gte, this.max = this.lte;
    }
    _parse(input) {
      if (this._def.coerce)
        try {
          input.data = BigInt(input.data);
        } catch {
          return this._getInvalidInput(input);
        }
      if (this._getType(input) !== ZodParsedType.bigint)
        return this._getInvalidInput(input);
      let ctx = void 0, status = new ParseStatus;
      for (let check3 of this._def.checks)
        if (check3.kind === "min") {
          if (check3.inclusive ? input.data < check3.value : input.data <= check3.value)
            ctx = this._getOrReturnCtx(input, ctx), addIssueToContext(ctx, {
              code: ZodIssueCode2.too_small,
              type: "bigint",
              minimum: check3.value,
              inclusive: check3.inclusive,
              message: check3.message
            }), status.dirty();
        } else if (check3.kind === "max") {
          if (check3.inclusive ? input.data > check3.value : input.data >= check3.value)
            ctx = this._getOrReturnCtx(input, ctx), addIssueToContext(ctx, {
              code: ZodIssueCode2.too_big,
              type: "bigint",
              maximum: check3.value,
              inclusive: check3.inclusive,
              message: check3.message
            }), status.dirty();
        } else if (check3.kind === "multipleOf") {
          if (input.data % check3.value !== BigInt(0))
            ctx = this._getOrReturnCtx(input, ctx), addIssueToContext(ctx, {
              code: ZodIssueCode2.not_multiple_of,
              multipleOf: check3.value,
              message: check3.message
            }), status.dirty();
        } else
          util10.assertNever(check3);
      return { status: status.value, value: input.data };
    }
    _getInvalidInput(input) {
      let ctx = this._getOrReturnCtx(input);
      return addIssueToContext(ctx, {
        code: ZodIssueCode2.invalid_type,
        expected: ZodParsedType.bigint,
        received: ctx.parsedType
      }), INVALID;
    }
    gte(value, message) {
      return this.setLimit("min", value, !0, errorUtil.toString(message));
    }
    gt(value, message) {
      return this.setLimit("min", value, !1, errorUtil.toString(message));
    }
    lte(value, message) {
      return this.setLimit("max", value, !0, errorUtil.toString(message));
    }
    lt(value, message) {
      return this.setLimit("max", value, !1, errorUtil.toString(message));
    }
    setLimit(kind, value, inclusive, message) {
      return new ZodBigInt2({
        ...this._def,
        checks: [
          ...this._def.checks,
          {
            kind,
            value,
            inclusive,
            message: errorUtil.toString(message)
          }
        ]
      });
    }
    _addCheck(check3) {
      return new ZodBigInt2({
        ...this._def,
        checks: [...this._def.checks, check3]
      });
    }
    positive(message) {
      return this._addCheck({
        kind: "min",
        value: BigInt(0),
        inclusive: !1,
        message: errorUtil.toString(message)
      });
    }
    negative(message) {
      return this._addCheck({
        kind: "max",
        value: BigInt(0),
        inclusive: !1,
        message: errorUtil.toString(message)
      });
    }
    nonpositive(message) {
      return this._addCheck({
        kind: "max",
        value: BigInt(0),
        inclusive: !0,
        message: errorUtil.toString(message)
      });
    }
    nonnegative(message) {
      return this._addCheck({
        kind: "min",
        value: BigInt(0),
        inclusive: !0,
        message: errorUtil.toString(message)
      });
    }
    multipleOf(value, message) {
      return this._addCheck({
        kind: "multipleOf",
        value,
        message: errorUtil.toString(message)
      });
    }
    get minValue() {
      let min = null;
      for (let ch of this._def.checks)
        if (ch.kind === "min") {
          if (min === null || ch.value > min)
            min = ch.value;
        }
      return min;
    }
    get maxValue() {
      let max = null;
      for (let ch of this._def.checks)
        if (ch.kind === "max") {
          if (max === null || ch.value < max)
            max = ch.value;
        }
      return max;
    }
  };
  ZodBigInt2.create = (params) => {
    return new ZodBigInt2({
      checks: [],
      typeName: ZodFirstPartyTypeKind.ZodBigInt,
      coerce: params?.coerce ?? !1,
      ...processCreateParams(params)
    });
  };
  ZodBoolean2 = class ZodBoolean2 extends ZodType2 {
    _parse(input) {
      if (this._def.coerce)
        input.data = Boolean(input.data);
      if (this._getType(input) !== ZodParsedType.boolean) {
        let ctx = this._getOrReturnCtx(input);
        return addIssueToContext(ctx, {
          code: ZodIssueCode2.invalid_type,
          expected: ZodParsedType.boolean,
          received: ctx.parsedType
        }), INVALID;
      }
      return OK(input.data);
    }
  };
  ZodBoolean2.create = (params) => {
    return new ZodBoolean2({
      typeName: ZodFirstPartyTypeKind.ZodBoolean,
      coerce: params?.coerce || !1,
      ...processCreateParams(params)
    });
  };
  ZodDate2 = class ZodDate2 extends ZodType2 {
    _parse(input) {
      if (this._def.coerce)
        input.data = new Date(input.data);
      if (this._getType(input) !== ZodParsedType.date) {
        let ctx2 = this._getOrReturnCtx(input);
        return addIssueToContext(ctx2, {
          code: ZodIssueCode2.invalid_type,
          expected: ZodParsedType.date,
          received: ctx2.parsedType
        }), INVALID;
      }
      if (Number.isNaN(input.data.getTime())) {
        let ctx2 = this._getOrReturnCtx(input);
        return addIssueToContext(ctx2, {
          code: ZodIssueCode2.invalid_date
        }), INVALID;
      }
      let status = new ParseStatus, ctx = void 0;
      for (let check3 of this._def.checks)
        if (check3.kind === "min") {
          if (input.data.getTime() < check3.value)
            ctx = this._getOrReturnCtx(input, ctx), addIssueToContext(ctx, {
              code: ZodIssueCode2.too_small,
              message: check3.message,
              inclusive: !0,
              exact: !1,
              minimum: check3.value,
              type: "date"
            }), status.dirty();
        } else if (check3.kind === "max") {
          if (input.data.getTime() > check3.value)
            ctx = this._getOrReturnCtx(input, ctx), addIssueToContext(ctx, {
              code: ZodIssueCode2.too_big,
              message: check3.message,
              inclusive: !0,
              exact: !1,
              maximum: check3.value,
              type: "date"
            }), status.dirty();
        } else
          util10.assertNever(check3);
      return {
        status: status.value,
        value: new Date(input.data.getTime())
      };
    }
    _addCheck(check3) {
      return new ZodDate2({
        ...this._def,
        checks: [...this._def.checks, check3]
      });
    }
    min(minDate, message) {
      return this._addCheck({
        kind: "min",
        value: minDate.getTime(),
        message: errorUtil.toString(message)
      });
    }
    max(maxDate, message) {
      return this._addCheck({
        kind: "max",
        value: maxDate.getTime(),
        message: errorUtil.toString(message)
      });
    }
    get minDate() {
      let min = null;
      for (let ch of this._def.checks)
        if (ch.kind === "min") {
          if (min === null || ch.value > min)
            min = ch.value;
        }
      return min != null ? new Date(min) : null;
    }
    get maxDate() {
      let max = null;
      for (let ch of this._def.checks)
        if (ch.kind === "max") {
          if (max === null || ch.value < max)
            max = ch.value;
        }
      return max != null ? new Date(max) : null;
    }
  };
  ZodDate2.create = (params) => {
    return new ZodDate2({
      checks: [],
      coerce: params?.coerce || !1,
      typeName: ZodFirstPartyTypeKind.ZodDate,
      ...processCreateParams(params)
    });
  };
  ZodSymbol2 = class ZodSymbol2 extends ZodType2 {
    _parse(input) {
      if (this._getType(input) !== ZodParsedType.symbol) {
        let ctx = this._getOrReturnCtx(input);
        return addIssueToContext(ctx, {
          code: ZodIssueCode2.invalid_type,
          expected: ZodParsedType.symbol,
          received: ctx.parsedType
        }), INVALID;
      }
      return OK(input.data);
    }
  };
  ZodSymbol2.create = (params) => {
    return new ZodSymbol2({
      typeName: ZodFirstPartyTypeKind.ZodSymbol,
      ...processCreateParams(params)
    });
  };
  ZodUndefined2 = class ZodUndefined2 extends ZodType2 {
    _parse(input) {
      if (this._getType(input) !== ZodParsedType.undefined) {
        let ctx = this._getOrReturnCtx(input);
        return addIssueToContext(ctx, {
          code: ZodIssueCode2.invalid_type,
          expected: ZodParsedType.undefined,
          received: ctx.parsedType
        }), INVALID;
      }
      return OK(input.data);
    }
  };
  ZodUndefined2.create = (params) => {
    return new ZodUndefined2({
      typeName: ZodFirstPartyTypeKind.ZodUndefined,
      ...processCreateParams(params)
    });
  };
  ZodNull2 = class ZodNull2 extends ZodType2 {
    _parse(input) {
      if (this._getType(input) !== ZodParsedType.null) {
        let ctx = this._getOrReturnCtx(input);
        return addIssueToContext(ctx, {
          code: ZodIssueCode2.invalid_type,
          expected: ZodParsedType.null,
          received: ctx.parsedType
        }), INVALID;
      }
      return OK(input.data);
    }
  };
  ZodNull2.create = (params) => {
    return new ZodNull2({
      typeName: ZodFirstPartyTypeKind.ZodNull,
      ...processCreateParams(params)
    });
  };
  ZodAny2 = class ZodAny2 extends ZodType2 {
    constructor() {
      super(...arguments);
      this._any = !0;
    }
    _parse(input) {
      return OK(input.data);
    }
  };
  ZodAny2.create = (params) => {
    return new ZodAny2({
      typeName: ZodFirstPartyTypeKind.ZodAny,
      ...processCreateParams(params)
    });
  };
  ZodUnknown2 = class ZodUnknown2 extends ZodType2 {
    constructor() {
      super(...arguments);
      this._unknown = !0;
    }
    _parse(input) {
      return OK(input.data);
    }
  };
  ZodUnknown2.create = (params) => {
    return new ZodUnknown2({
      typeName: ZodFirstPartyTypeKind.ZodUnknown,
      ...processCreateParams(params)
    });
  };
  ZodNever2 = class ZodNever2 extends ZodType2 {
    _parse(input) {
      let ctx = this._getOrReturnCtx(input);
      return addIssueToContext(ctx, {
        code: ZodIssueCode2.invalid_type,
        expected: ZodParsedType.never,
        received: ctx.parsedType
      }), INVALID;
    }
  };
  ZodNever2.create = (params) => {
    return new ZodNever2({
      typeName: ZodFirstPartyTypeKind.ZodNever,
      ...processCreateParams(params)
    });
  };
  ZodVoid2 = class ZodVoid2 extends ZodType2 {
    _parse(input) {
      if (this._getType(input) !== ZodParsedType.undefined) {
        let ctx = this._getOrReturnCtx(input);
        return addIssueToContext(ctx, {
          code: ZodIssueCode2.invalid_type,
          expected: ZodParsedType.void,
          received: ctx.parsedType
        }), INVALID;
      }
      return OK(input.data);
    }
  };
  ZodVoid2.create = (params) => {
    return new ZodVoid2({
      typeName: ZodFirstPartyTypeKind.ZodVoid,
      ...processCreateParams(params)
    });
  };
  ZodArray2 = class ZodArray2 extends ZodType2 {
    _parse(input) {
      let { ctx, status } = this._processInputParams(input), def = this._def;
      if (ctx.parsedType !== ZodParsedType.array)
        return addIssueToContext(ctx, {
          code: ZodIssueCode2.invalid_type,
          expected: ZodParsedType.array,
          received: ctx.parsedType
        }), INVALID;
      if (def.exactLength !== null) {
        let tooBig = ctx.data.length > def.exactLength.value, tooSmall = ctx.data.length < def.exactLength.value;
        if (tooBig || tooSmall)
          addIssueToContext(ctx, {
            code: tooBig ? ZodIssueCode2.too_big : ZodIssueCode2.too_small,
            minimum: tooSmall ? def.exactLength.value : void 0,
            maximum: tooBig ? def.exactLength.value : void 0,
            type: "array",
            inclusive: !0,
            exact: !0,
            message: def.exactLength.message
          }), status.dirty();
      }
      if (def.minLength !== null) {
        if (ctx.data.length < def.minLength.value)
          addIssueToContext(ctx, {
            code: ZodIssueCode2.too_small,
            minimum: def.minLength.value,
            type: "array",
            inclusive: !0,
            exact: !1,
            message: def.minLength.message
          }), status.dirty();
      }
      if (def.maxLength !== null) {
        if (ctx.data.length > def.maxLength.value)
          addIssueToContext(ctx, {
            code: ZodIssueCode2.too_big,
            maximum: def.maxLength.value,
            type: "array",
            inclusive: !0,
            exact: !1,
            message: def.maxLength.message
          }), status.dirty();
      }
      if (ctx.common.async)
        return Promise.all([...ctx.data].map((item, i4) => {
          return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i4));
        })).then((result2) => {
          return ParseStatus.mergeArray(status, result2);
        });
      let result = [...ctx.data].map((item, i4) => {
        return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i4));
      });
      return ParseStatus.mergeArray(status, result);
    }
    get element() {
      return this._def.type;
    }
    min(minLength, message) {
      return new ZodArray2({
        ...this._def,
        minLength: { value: minLength, message: errorUtil.toString(message) }
      });
    }
    max(maxLength, message) {
      return new ZodArray2({
        ...this._def,
        maxLength: { value: maxLength, message: errorUtil.toString(message) }
      });
    }
    length(len, message) {
      return new ZodArray2({
        ...this._def,
        exactLength: { value: len, message: errorUtil.toString(message) }
      });
    }
    nonempty(message) {
      return this.min(1, message);
    }
  };
  ZodArray2.create = (schema5, params) => {
    return new ZodArray2({
      type: schema5,
      minLength: null,
      maxLength: null,
      exactLength: null,
      typeName: ZodFirstPartyTypeKind.ZodArray,
      ...processCreateParams(params)
    });
  };
  ZodObject2 = class ZodObject2 extends ZodType2 {
    constructor() {
      super(...arguments);
      this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
    }
    _getCached() {
      if (this._cached !== null)
        return this._cached;
      let shape = this._def.shape(), keys2 = util10.objectKeys(shape);
      return this._cached = { shape, keys: keys2 }, this._cached;
    }
    _parse(input) {
      if (this._getType(input) !== ZodParsedType.object) {
        let ctx2 = this._getOrReturnCtx(input);
        return addIssueToContext(ctx2, {
          code: ZodIssueCode2.invalid_type,
          expected: ZodParsedType.object,
          received: ctx2.parsedType
        }), INVALID;
      }
      let { status, ctx } = this._processInputParams(input), { shape, keys: shapeKeys } = this._getCached(), extraKeys = [];
      if (!(this._def.catchall instanceof ZodNever2 && this._def.unknownKeys === "strip")) {
        for (let key in ctx.data)
          if (!shapeKeys.includes(key))
            extraKeys.push(key);
      }
      let pairs = [];
      for (let key of shapeKeys) {
        let keyValidator = shape[key], value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
          alwaysSet: key in ctx.data
        });
      }
      if (this._def.catchall instanceof ZodNever2) {
        let unknownKeys = this._def.unknownKeys;
        if (unknownKeys === "passthrough")
          for (let key of extraKeys)
            pairs.push({
              key: { status: "valid", value: key },
              value: { status: "valid", value: ctx.data[key] }
            });
        else if (unknownKeys === "strict") {
          if (extraKeys.length > 0)
            addIssueToContext(ctx, {
              code: ZodIssueCode2.unrecognized_keys,
              keys: extraKeys
            }), status.dirty();
        } else if (unknownKeys === "strip")
          ;
        else
          throw Error("Internal ZodObject error: invalid unknownKeys value.");
      } else {
        let catchall = this._def.catchall;
        for (let key of extraKeys) {
          let value = ctx.data[key];
          pairs.push({
            key: { status: "valid", value: key },
            value: catchall._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
            alwaysSet: key in ctx.data
          });
        }
      }
      if (ctx.common.async)
        return Promise.resolve().then(async () => {
          let syncPairs = [];
          for (let pair of pairs) {
            let key = await pair.key, value = await pair.value;
            syncPairs.push({
              key,
              value,
              alwaysSet: pair.alwaysSet
            });
          }
          return syncPairs;
        }).then((syncPairs) => {
          return ParseStatus.mergeObjectSync(status, syncPairs);
        });
      else
        return ParseStatus.mergeObjectSync(status, pairs);
    }
    get shape() {
      return this._def.shape();
    }
    strict(message) {
      return errorUtil.errToObj, new ZodObject2({
        ...this._def,
        unknownKeys: "strict",
        ...message !== void 0 ? {
          errorMap: (issue2, ctx) => {
            let defaultError = this._def.errorMap?.(issue2, ctx).message ?? ctx.defaultError;
            if (issue2.code === "unrecognized_keys")
              return {
                message: errorUtil.errToObj(message).message ?? defaultError
              };
            return {
              message: defaultError
            };
          }
        } : {}
      });
    }
    strip() {
      return new ZodObject2({
        ...this._def,
        unknownKeys: "strip"
      });
    }
    passthrough() {
      return new ZodObject2({
        ...this._def,
        unknownKeys: "passthrough"
      });
    }
    extend(augmentation) {
      return new ZodObject2({
        ...this._def,
        shape: () => ({
          ...this._def.shape(),
          ...augmentation
        })
      });
    }
    merge(merging) {
      return new ZodObject2({
        unknownKeys: merging._def.unknownKeys,
        catchall: merging._def.catchall,
        shape: () => ({
          ...this._def.shape(),
          ...merging._def.shape()
        }),
        typeName: ZodFirstPartyTypeKind.ZodObject
      });
    }
    setKey(key, schema5) {
      return this.augment({ [key]: schema5 });
    }
    catchall(index) {
      return new ZodObject2({
        ...this._def,
        catchall: index
      });
    }
    pick(mask) {
      let shape = {};
      for (let key of util10.objectKeys(mask))
        if (mask[key] && this.shape[key])
          shape[key] = this.shape[key];
      return new ZodObject2({
        ...this._def,
        shape: () => shape
      });
    }
    omit(mask) {
      let shape = {};
      for (let key of util10.objectKeys(this.shape))
        if (!mask[key])
          shape[key] = this.shape[key];
      return new ZodObject2({
        ...this._def,
        shape: () => shape
      });
    }
    deepPartial() {
      return deepPartialify(this);
    }
    partial(mask) {
      let newShape = {};
      for (let key of util10.objectKeys(this.shape)) {
        let fieldSchema = this.shape[key];
        if (mask && !mask[key])
          newShape[key] = fieldSchema;
        else
          newShape[key] = fieldSchema.optional();
      }
      return new ZodObject2({
        ...this._def,
        shape: () => newShape
      });
    }
    required(mask) {
      let newShape = {};
      for (let key of util10.objectKeys(this.shape))
        if (mask && !mask[key])
          newShape[key] = this.shape[key];
        else {
          let newField = this.shape[key];
          while (newField instanceof ZodOptional2)
            newField = newField._def.innerType;
          newShape[key] = newField;
        }
      return new ZodObject2({
        ...this._def,
        shape: () => newShape
      });
    }
    keyof() {
      return createZodEnum(util10.objectKeys(this.shape));
    }
  };
  ZodObject2.create = (shape, params) => {
    return new ZodObject2({
      shape: () => shape,
      unknownKeys: "strip",
      catchall: ZodNever2.create(),
      typeName: ZodFirstPartyTypeKind.ZodObject,
      ...processCreateParams(params)
    });
  };
  ZodObject2.strictCreate = (shape, params) => {
    return new ZodObject2({
      shape: () => shape,
      unknownKeys: "strict",
      catchall: ZodNever2.create(),
      typeName: ZodFirstPartyTypeKind.ZodObject,
      ...processCreateParams(params)
    });
  };
  ZodObject2.lazycreate = (shape, params) => {
    return new ZodObject2({
      shape,
      unknownKeys: "strip",
      catchall: ZodNever2.create(),
      typeName: ZodFirstPartyTypeKind.ZodObject,
      ...processCreateParams(params)
    });
  };
  ZodUnion2 = class ZodUnion2 extends ZodType2 {
    _parse(input) {
      let { ctx } = this._processInputParams(input), options = this._def.options;
      function handleResults(results) {
        for (let result of results)
          if (result.result.status === "valid")
            return result.result;
        for (let result of results)
          if (result.result.status === "dirty")
            return ctx.common.issues.push(...result.ctx.common.issues), result.result;
        let unionErrors = results.map((result) => new ZodError2(result.ctx.common.issues));
        return addIssueToContext(ctx, {
          code: ZodIssueCode2.invalid_union,
          unionErrors
        }), INVALID;
      }
      if (ctx.common.async)
        return Promise.all(options.map(async (option) => {
          let childCtx = {
            ...ctx,
            common: {
              ...ctx.common,
              issues: []
            },
            parent: null
          };
          return {
            result: await option._parseAsync({
              data: ctx.data,
              path: ctx.path,
              parent: childCtx
            }),
            ctx: childCtx
          };
        })).then(handleResults);
      else {
        let dirty = void 0, issues = [];
        for (let option of options) {
          let childCtx = {
            ...ctx,
            common: {
              ...ctx.common,
              issues: []
            },
            parent: null
          }, result = option._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          });
          if (result.status === "valid")
            return result;
          else if (result.status === "dirty" && !dirty)
            dirty = { result, ctx: childCtx };
          if (childCtx.common.issues.length)
            issues.push(childCtx.common.issues);
        }
        if (dirty)
          return ctx.common.issues.push(...dirty.ctx.common.issues), dirty.result;
        let unionErrors = issues.map((issues2) => new ZodError2(issues2));
        return addIssueToContext(ctx, {
          code: ZodIssueCode2.invalid_union,
          unionErrors
        }), INVALID;
      }
    }
    get options() {
      return this._def.options;
    }
  };
  ZodUnion2.create = (types12, params) => {
    return new ZodUnion2({
      options: types12,
      typeName: ZodFirstPartyTypeKind.ZodUnion,
      ...processCreateParams(params)
    });
  };
  ZodDiscriminatedUnion2 = class ZodDiscriminatedUnion2 extends ZodType2 {
    _parse(input) {
      let { ctx } = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.object)
        return addIssueToContext(ctx, {
          code: ZodIssueCode2.invalid_type,
          expected: ZodParsedType.object,
          received: ctx.parsedType
        }), INVALID;
      let discriminator = this.discriminator, discriminatorValue = ctx.data[discriminator], option = this.optionsMap.get(discriminatorValue);
      if (!option)
        return addIssueToContext(ctx, {
          code: ZodIssueCode2.invalid_union_discriminator,
          options: Array.from(this.optionsMap.keys()),
          path: [discriminator]
        }), INVALID;
      if (ctx.common.async)
        return option._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
      else
        return option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
    }
    get discriminator() {
      return this._def.discriminator;
    }
    get options() {
      return this._def.options;
    }
    get optionsMap() {
      return this._def.optionsMap;
    }
    static create(discriminator, options, params) {
      let optionsMap = /* @__PURE__ */ new Map;
      for (let type of options) {
        let discriminatorValues = getDiscriminator(type.shape[discriminator]);
        if (!discriminatorValues.length)
          throw Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
        for (let value of discriminatorValues) {
          if (optionsMap.has(value))
            throw Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
          optionsMap.set(value, type);
        }
      }
      return new ZodDiscriminatedUnion2({
        typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
        discriminator,
        options,
        optionsMap,
        ...processCreateParams(params)
      });
    }
  };
  ZodIntersection2 = class ZodIntersection2 extends ZodType2 {
    _parse(input) {
      let { status, ctx } = this._processInputParams(input), handleParsed = (parsedLeft, parsedRight) => {
        if (isAborted(parsedLeft) || isAborted(parsedRight))
          return INVALID;
        let merged = mergeValues2(parsedLeft.value, parsedRight.value);
        if (!merged.valid)
          return addIssueToContext(ctx, {
            code: ZodIssueCode2.invalid_intersection_types
          }), INVALID;
        if (isDirty(parsedLeft) || isDirty(parsedRight))
          status.dirty();
        return { status: status.value, value: merged.data };
      };
      if (ctx.common.async)
        return Promise.all([
          this._def.left._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          }),
          this._def.right._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          })
        ]).then(([left, right]) => handleParsed(left, right));
      else
        return handleParsed(this._def.left._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }), this._def.right._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }));
    }
  };
  ZodIntersection2.create = (left, right, params) => {
    return new ZodIntersection2({
      left,
      right,
      typeName: ZodFirstPartyTypeKind.ZodIntersection,
      ...processCreateParams(params)
    });
  };
  ZodTuple2 = class ZodTuple2 extends ZodType2 {
    _parse(input) {
      let { status, ctx } = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.array)
        return addIssueToContext(ctx, {
          code: ZodIssueCode2.invalid_type,
          expected: ZodParsedType.array,
          received: ctx.parsedType
        }), INVALID;
      if (ctx.data.length < this._def.items.length)
        return addIssueToContext(ctx, {
          code: ZodIssueCode2.too_small,
          minimum: this._def.items.length,
          inclusive: !0,
          exact: !1,
          type: "array"
        }), INVALID;
      if (!this._def.rest && ctx.data.length > this._def.items.length)
        addIssueToContext(ctx, {
          code: ZodIssueCode2.too_big,
          maximum: this._def.items.length,
          inclusive: !0,
          exact: !1,
          type: "array"
        }), status.dirty();
      let items = [...ctx.data].map((item, itemIndex) => {
        let schema5 = this._def.items[itemIndex] || this._def.rest;
        if (!schema5)
          return null;
        return schema5._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
      }).filter((x3) => !!x3);
      if (ctx.common.async)
        return Promise.all(items).then((results) => {
          return ParseStatus.mergeArray(status, results);
        });
      else
        return ParseStatus.mergeArray(status, items);
    }
    get items() {
      return this._def.items;
    }
    rest(rest) {
      return new ZodTuple2({
        ...this._def,
        rest
      });
    }
  };
  ZodTuple2.create = (schemas3, params) => {
    if (!Array.isArray(schemas3))
      throw Error("You must pass an array of schemas to z.tuple([ ... ])");
    return new ZodTuple2({
      items: schemas3,
      typeName: ZodFirstPartyTypeKind.ZodTuple,
      rest: null,
      ...processCreateParams(params)
    });
  };
  ZodRecord2 = class ZodRecord2 extends ZodType2 {
    get keySchema() {
      return this._def.keyType;
    }
    get valueSchema() {
      return this._def.valueType;
    }
    _parse(input) {
      let { status, ctx } = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.object)
        return addIssueToContext(ctx, {
          code: ZodIssueCode2.invalid_type,
          expected: ZodParsedType.object,
          received: ctx.parsedType
        }), INVALID;
      let pairs = [], keyType = this._def.keyType, valueType = this._def.valueType;
      for (let key in ctx.data)
        pairs.push({
          key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
          value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
          alwaysSet: key in ctx.data
        });
      if (ctx.common.async)
        return ParseStatus.mergeObjectAsync(status, pairs);
      else
        return ParseStatus.mergeObjectSync(status, pairs);
    }
    get element() {
      return this._def.valueType;
    }
    static create(first, second, third) {
      if (second instanceof ZodType2)
        return new ZodRecord2({
          keyType: first,
          valueType: second,
          typeName: ZodFirstPartyTypeKind.ZodRecord,
          ...processCreateParams(third)
        });
      return new ZodRecord2({
        keyType: ZodString2.create(),
        valueType: first,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(second)
      });
    }
  };
  ZodMap2 = class ZodMap2 extends ZodType2 {
    get keySchema() {
      return this._def.keyType;
    }
    get valueSchema() {
      return this._def.valueType;
    }
    _parse(input) {
      let { status, ctx } = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.map)
        return addIssueToContext(ctx, {
          code: ZodIssueCode2.invalid_type,
          expected: ZodParsedType.map,
          received: ctx.parsedType
        }), INVALID;
      let keyType = this._def.keyType, valueType = this._def.valueType, pairs = [...ctx.data.entries()].map(([key, value], index) => {
        return {
          key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
          value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
        };
      });
      if (ctx.common.async) {
        let finalMap = /* @__PURE__ */ new Map;
        return Promise.resolve().then(async () => {
          for (let pair of pairs) {
            let key = await pair.key, value = await pair.value;
            if (key.status === "aborted" || value.status === "aborted")
              return INVALID;
            if (key.status === "dirty" || value.status === "dirty")
              status.dirty();
            finalMap.set(key.value, value.value);
          }
          return { status: status.value, value: finalMap };
        });
      } else {
        let finalMap = /* @__PURE__ */ new Map;
        for (let pair of pairs) {
          let { key, value } = pair;
          if (key.status === "aborted" || value.status === "aborted")
            return INVALID;
          if (key.status === "dirty" || value.status === "dirty")
            status.dirty();
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      }
    }
  };
  ZodMap2.create = (keyType, valueType, params) => {
    return new ZodMap2({
      valueType,
      keyType,
      typeName: ZodFirstPartyTypeKind.ZodMap,
      ...processCreateParams(params)
    });
  };
  ZodSet2 = class ZodSet2 extends ZodType2 {
    _parse(input) {
      let { status, ctx } = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.set)
        return addIssueToContext(ctx, {
          code: ZodIssueCode2.invalid_type,
          expected: ZodParsedType.set,
          received: ctx.parsedType
        }), INVALID;
      let def = this._def;
      if (def.minSize !== null) {
        if (ctx.data.size < def.minSize.value)
          addIssueToContext(ctx, {
            code: ZodIssueCode2.too_small,
            minimum: def.minSize.value,
            type: "set",
            inclusive: !0,
            exact: !1,
            message: def.minSize.message
          }), status.dirty();
      }
      if (def.maxSize !== null) {
        if (ctx.data.size > def.maxSize.value)
          addIssueToContext(ctx, {
            code: ZodIssueCode2.too_big,
            maximum: def.maxSize.value,
            type: "set",
            inclusive: !0,
            exact: !1,
            message: def.maxSize.message
          }), status.dirty();
      }
      let valueType = this._def.valueType;
      function finalizeSet(elements2) {
        let parsedSet = /* @__PURE__ */ new Set;
        for (let element of elements2) {
          if (element.status === "aborted")
            return INVALID;
          if (element.status === "dirty")
            status.dirty();
          parsedSet.add(element.value);
        }
        return { status: status.value, value: parsedSet };
      }
      let elements = [...ctx.data.values()].map((item, i4) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i4)));
      if (ctx.common.async)
        return Promise.all(elements).then((elements2) => finalizeSet(elements2));
      else
        return finalizeSet(elements);
    }
    min(minSize, message) {
      return new ZodSet2({
        ...this._def,
        minSize: { value: minSize, message: errorUtil.toString(message) }
      });
    }
    max(maxSize, message) {
      return new ZodSet2({
        ...this._def,
        maxSize: { value: maxSize, message: errorUtil.toString(message) }
      });
    }
    size(size, message) {
      return this.min(size, message).max(size, message);
    }
    nonempty(message) {
      return this.min(1, message);
    }
  };
  ZodSet2.create = (valueType, params) => {
    return new ZodSet2({
      valueType,
      minSize: null,
      maxSize: null,
      typeName: ZodFirstPartyTypeKind.ZodSet,
      ...processCreateParams(params)
    });
  };
  ZodFunction = class ZodFunction extends ZodType2 {
    constructor() {
      super(...arguments);
      this.validate = this.implement;
    }
    _parse(input) {
      let { ctx } = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.function)
        return addIssueToContext(ctx, {
          code: ZodIssueCode2.invalid_type,
          expected: ZodParsedType.function,
          received: ctx.parsedType
        }), INVALID;
      function makeArgsIssue(args, error44) {
        return makeIssue({
          data: args,
          path: ctx.path,
          errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap2(), en_default2].filter((x3) => !!x3),
          issueData: {
            code: ZodIssueCode2.invalid_arguments,
            argumentsError: error44
          }
        });
      }
      function makeReturnsIssue(returns, error44) {
        return makeIssue({
          data: returns,
          path: ctx.path,
          errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap2(), en_default2].filter((x3) => !!x3),
          issueData: {
            code: ZodIssueCode2.invalid_return_type,
            returnTypeError: error44
          }
        });
      }
      let params = { errorMap: ctx.common.contextualErrorMap }, fn = ctx.data;
      if (this._def.returns instanceof ZodPromise2) {
        let me = this;
        return OK(async function(...args) {
          let error44 = new ZodError2([]), parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
            throw error44.addIssue(makeArgsIssue(args, e)), error44;
          }), result = await Reflect.apply(fn, this, parsedArgs);
          return await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
            throw error44.addIssue(makeReturnsIssue(result, e)), error44;
          });
        });
      } else {
        let me = this;
        return OK(function(...args) {
          let parsedArgs = me._def.args.safeParse(args, params);
          if (!parsedArgs.success)
            throw new ZodError2([makeArgsIssue(args, parsedArgs.error)]);
          let result = Reflect.apply(fn, this, parsedArgs.data), parsedReturns = me._def.returns.safeParse(result, params);
          if (!parsedReturns.success)
            throw new ZodError2([makeReturnsIssue(result, parsedReturns.error)]);
          return parsedReturns.data;
        });
      }
    }
    parameters() {
      return this._def.args;
    }
    returnType() {
      return this._def.returns;
    }
    args(...items) {
      return new ZodFunction({
        ...this._def,
        args: ZodTuple2.create(items).rest(ZodUnknown2.create())
      });
    }
    returns(returnType) {
      return new ZodFunction({
        ...this._def,
        returns: returnType
      });
    }
    implement(func) {
      return this.parse(func);
    }
    strictImplement(func) {
      return this.parse(func);
    }
    static create(args, returns, params) {
      return new ZodFunction({
        args: args ? args : ZodTuple2.create([]).rest(ZodUnknown2.create()),
        returns: returns || ZodUnknown2.create(),
        typeName: ZodFirstPartyTypeKind.ZodFunction,
        ...processCreateParams(params)
      });
    }
  };
  ZodLazy2 = class ZodLazy2 extends ZodType2 {
    get schema() {
      return this._def.getter();
    }
    _parse(input) {
      let { ctx } = this._processInputParams(input);
      return this._def.getter()._parse({ data: ctx.data, path: ctx.path, parent: ctx });
    }
  };
  ZodLazy2.create = (getter, params) => {
    return new ZodLazy2({
      getter,
      typeName: ZodFirstPartyTypeKind.ZodLazy,
      ...processCreateParams(params)
    });
  };
  ZodLiteral2 = class ZodLiteral2 extends ZodType2 {
    _parse(input) {
      if (input.data !== this._def.value) {
        let ctx = this._getOrReturnCtx(input);
        return addIssueToContext(ctx, {
          received: ctx.data,
          code: ZodIssueCode2.invalid_literal,
          expected: this._def.value
        }), INVALID;
      }
      return { status: "valid", value: input.data };
    }
    get value() {
      return this._def.value;
    }
  };
  ZodLiteral2.create = (value, params) => {
    return new ZodLiteral2({
      value,
      typeName: ZodFirstPartyTypeKind.ZodLiteral,
      ...processCreateParams(params)
    });
  };
  ZodEnum2 = class ZodEnum2 extends ZodType2 {
    _parse(input) {
      if (typeof input.data !== "string") {
        let ctx = this._getOrReturnCtx(input), expectedValues = this._def.values;
        return addIssueToContext(ctx, {
          expected: util10.joinValues(expectedValues),
          received: ctx.parsedType,
          code: ZodIssueCode2.invalid_type
        }), INVALID;
      }
      if (!this._cache)
        this._cache = new Set(this._def.values);
      if (!this._cache.has(input.data)) {
        let ctx = this._getOrReturnCtx(input), expectedValues = this._def.values;
        return addIssueToContext(ctx, {
          received: ctx.data,
          code: ZodIssueCode2.invalid_enum_value,
          options: expectedValues
        }), INVALID;
      }
      return OK(input.data);
    }
    get options() {
      return this._def.values;
    }
    get enum() {
      let enumValues = {};
      for (let val of this._def.values)
        enumValues[val] = val;
      return enumValues;
    }
    get Values() {
      let enumValues = {};
      for (let val of this._def.values)
        enumValues[val] = val;
      return enumValues;
    }
    get Enum() {
      let enumValues = {};
      for (let val of this._def.values)
        enumValues[val] = val;
      return enumValues;
    }
    extract(values2, newDef = this._def) {
      return ZodEnum2.create(values2, {
        ...this._def,
        ...newDef
      });
    }
    exclude(values2, newDef = this._def) {
      return ZodEnum2.create(this.options.filter((opt) => !values2.includes(opt)), {
        ...this._def,
        ...newDef
      });
    }
  };
  ZodEnum2.create = createZodEnum;
  ZodNativeEnum = class ZodNativeEnum extends ZodType2 {
    _parse(input) {
      let nativeEnumValues = util10.getValidEnumValues(this._def.values), ctx = this._getOrReturnCtx(input);
      if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
        let expectedValues = util10.objectValues(nativeEnumValues);
        return addIssueToContext(ctx, {
          expected: util10.joinValues(expectedValues),
          received: ctx.parsedType,
          code: ZodIssueCode2.invalid_type
        }), INVALID;
      }
      if (!this._cache)
        this._cache = new Set(util10.getValidEnumValues(this._def.values));
      if (!this._cache.has(input.data)) {
        let expectedValues = util10.objectValues(nativeEnumValues);
        return addIssueToContext(ctx, {
          received: ctx.data,
          code: ZodIssueCode2.invalid_enum_value,
          options: expectedValues
        }), INVALID;
      }
      return OK(input.data);
    }
    get enum() {
      return this._def.values;
    }
  };
  ZodNativeEnum.create = (values2, params) => {
    return new ZodNativeEnum({
      values: values2,
      typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
      ...processCreateParams(params)
    });
  };
  ZodPromise2 = class ZodPromise2 extends ZodType2 {
    unwrap() {
      return this._def.type;
    }
    _parse(input) {
      let { ctx } = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === !1)
        return addIssueToContext(ctx, {
          code: ZodIssueCode2.invalid_type,
          expected: ZodParsedType.promise,
          received: ctx.parsedType
        }), INVALID;
      let promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
      return OK(promisified.then((data) => {
        return this._def.type.parseAsync(data, {
          path: ctx.path,
          errorMap: ctx.common.contextualErrorMap
        });
      }));
    }
  };
  ZodPromise2.create = (schema5, params) => {
    return new ZodPromise2({
      type: schema5,
      typeName: ZodFirstPartyTypeKind.ZodPromise,
      ...processCreateParams(params)
    });
  };
  ZodEffects = class ZodEffects extends ZodType2 {
    innerType() {
      return this._def.schema;
    }
    sourceType() {
      return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
    }
    _parse(input) {
      let { status, ctx } = this._processInputParams(input), effect = this._def.effect || null, checkCtx = {
        addIssue: (arg) => {
          if (addIssueToContext(ctx, arg), arg.fatal)
            status.abort();
          else
            status.dirty();
        },
        get path() {
          return ctx.path;
        }
      };
      if (checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx), effect.type === "preprocess") {
        let processed = effect.transform(ctx.data, checkCtx);
        if (ctx.common.async)
          return Promise.resolve(processed).then(async (processed2) => {
            if (status.value === "aborted")
              return INVALID;
            let result = await this._def.schema._parseAsync({
              data: processed2,
              path: ctx.path,
              parent: ctx
            });
            if (result.status === "aborted")
              return INVALID;
            if (result.status === "dirty")
              return DIRTY(result.value);
            if (status.value === "dirty")
              return DIRTY(result.value);
            return result;
          });
        else {
          if (status.value === "aborted")
            return INVALID;
          let result = this._def.schema._parseSync({
            data: processed,
            path: ctx.path,
            parent: ctx
          });
          if (result.status === "aborted")
            return INVALID;
          if (result.status === "dirty")
            return DIRTY(result.value);
          if (status.value === "dirty")
            return DIRTY(result.value);
          return result;
        }
      }
      if (effect.type === "refinement") {
        let executeRefinement = (acc) => {
          let result = effect.refinement(acc, checkCtx);
          if (ctx.common.async)
            return Promise.resolve(result);
          if (result instanceof Promise)
            throw Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
          return acc;
        };
        if (ctx.common.async === !1) {
          let inner = this._def.schema._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          });
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          return executeRefinement(inner.value), { status: status.value, value: inner.value };
        } else
          return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
            if (inner.status === "aborted")
              return INVALID;
            if (inner.status === "dirty")
              status.dirty();
            return executeRefinement(inner.value).then(() => {
              return { status: status.value, value: inner.value };
            });
          });
      }
      if (effect.type === "transform")
        if (ctx.common.async === !1) {
          let base2 = this._def.schema._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          });
          if (!isValid(base2))
            return INVALID;
          let result = effect.transform(base2.value, checkCtx);
          if (result instanceof Promise)
            throw Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
          return { status: status.value, value: result };
        } else
          return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base2) => {
            if (!isValid(base2))
              return INVALID;
            return Promise.resolve(effect.transform(base2.value, checkCtx)).then((result) => ({
              status: status.value,
              value: result
            }));
          });
      util10.assertNever(effect);
    }
  };
  ZodEffects.create = (schema5, effect, params) => {
    return new ZodEffects({
      schema: schema5,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect,
      ...processCreateParams(params)
    });
  };
  ZodEffects.createWithPreprocess = (preprocess2, schema5, params) => {
    return new ZodEffects({
      schema: schema5,
      effect: { type: "preprocess", transform: preprocess2 },
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      ...processCreateParams(params)
    });
  };
  ZodOptional2 = class ZodOptional2 extends ZodType2 {
    _parse(input) {
      if (this._getType(input) === ZodParsedType.undefined)
        return OK(void 0);
      return this._def.innerType._parse(input);
    }
    unwrap() {
      return this._def.innerType;
    }
  };
  ZodOptional2.create = (type, params) => {
    return new ZodOptional2({
      innerType: type,
      typeName: ZodFirstPartyTypeKind.ZodOptional,
      ...processCreateParams(params)
    });
  };
  ZodNullable2 = class ZodNullable2 extends ZodType2 {
    _parse(input) {
      if (this._getType(input) === ZodParsedType.null)
        return OK(null);
      return this._def.innerType._parse(input);
    }
    unwrap() {
      return this._def.innerType;
    }
  };
  ZodNullable2.create = (type, params) => {
    return new ZodNullable2({
      innerType: type,
      typeName: ZodFirstPartyTypeKind.ZodNullable,
      ...processCreateParams(params)
    });
  };
  ZodDefault2 = class ZodDefault2 extends ZodType2 {
    _parse(input) {
      let { ctx } = this._processInputParams(input), data = ctx.data;
      if (ctx.parsedType === ZodParsedType.undefined)
        data = this._def.defaultValue();
      return this._def.innerType._parse({
        data,
        path: ctx.path,
        parent: ctx
      });
    }
    removeDefault() {
      return this._def.innerType;
    }
  };
  ZodDefault2.create = (type, params) => {
    return new ZodDefault2({
      innerType: type,
      typeName: ZodFirstPartyTypeKind.ZodDefault,
      defaultValue: typeof params.default === "function" ? params.default : () => params.default,
      ...processCreateParams(params)
    });
  };
  ZodCatch2 = class ZodCatch2 extends ZodType2 {
    _parse(input) {
      let { ctx } = this._processInputParams(input), newCtx = {
        ...ctx,
        common: {
          ...ctx.common,
          issues: []
        }
      }, result = this._def.innerType._parse({
        data: newCtx.data,
        path: newCtx.path,
        parent: {
          ...newCtx
        }
      });
      if (isAsync(result))
        return result.then((result2) => {
          return {
            status: "valid",
            value: result2.status === "valid" ? result2.value : this._def.catchValue({
              get error() {
                return new ZodError2(newCtx.common.issues);
              },
              input: newCtx.data
            })
          };
        });
      else
        return {
          status: "valid",
          value: result.status === "valid" ? result.value : this._def.catchValue({
            get error() {
              return new ZodError2(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
    }
    removeCatch() {
      return this._def.innerType;
    }
  };
  ZodCatch2.create = (type, params) => {
    return new ZodCatch2({
      innerType: type,
      typeName: ZodFirstPartyTypeKind.ZodCatch,
      catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
      ...processCreateParams(params)
    });
  };
  ZodNaN2 = class ZodNaN2 extends ZodType2 {
    _parse(input) {
      if (this._getType(input) !== ZodParsedType.nan) {
        let ctx = this._getOrReturnCtx(input);
        return addIssueToContext(ctx, {
          code: ZodIssueCode2.invalid_type,
          expected: ZodParsedType.nan,
          received: ctx.parsedType
        }), INVALID;
      }
      return { status: "valid", value: input.data };
    }
  };
  ZodNaN2.create = (params) => {
    return new ZodNaN2({
      typeName: ZodFirstPartyTypeKind.ZodNaN,
      ...processCreateParams(params)
    });
  };
  BRAND = Symbol("zod_brand");
  ZodBranded = class ZodBranded extends ZodType2 {
    _parse(input) {
      let { ctx } = this._processInputParams(input), data = ctx.data;
      return this._def.type._parse({
        data,
        path: ctx.path,
        parent: ctx
      });
    }
    unwrap() {
      return this._def.type;
    }
  };
  ZodPipeline = class ZodPipeline extends ZodType2 {
    _parse(input) {
      let { status, ctx } = this._processInputParams(input);
      if (ctx.common.async)
        return (async () => {
          let inResult = await this._def.in._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          });
          if (inResult.status === "aborted")
            return INVALID;
          if (inResult.status === "dirty")
            return status.dirty(), DIRTY(inResult.value);
          else
            return this._def.out._parseAsync({
              data: inResult.value,
              path: ctx.path,
              parent: ctx
            });
        })();
      else {
        let inResult = this._def.in._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty")
          return status.dirty(), {
            status: "dirty",
            value: inResult.value
          };
        else
          return this._def.out._parseSync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
      }
    }
    static create(a2, b) {
      return new ZodPipeline({
        in: a2,
        out: b,
        typeName: ZodFirstPartyTypeKind.ZodPipeline
      });
    }
  };
  ZodReadonly2 = class ZodReadonly2 extends ZodType2 {
    _parse(input) {
      let result = this._def.innerType._parse(input), freeze = (data) => {
        if (isValid(data))
          data.value = Object.freeze(data.value);
        return data;
      };
      return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
    }
    unwrap() {
      return this._def.innerType;
    }
  };
  ZodReadonly2.create = (type, params) => {
    return new ZodReadonly2({
      innerType: type,
      typeName: ZodFirstPartyTypeKind.ZodReadonly,
      ...processCreateParams(params)
    });
  };
  late = {
    object: ZodObject2.lazycreate
  };
  (function(ZodFirstPartyTypeKind2) {
    ZodFirstPartyTypeKind2.ZodString = "ZodString", ZodFirstPartyTypeKind2.ZodNumber = "ZodNumber", ZodFirstPartyTypeKind2.ZodNaN = "ZodNaN", ZodFirstPartyTypeKind2.ZodBigInt = "ZodBigInt", ZodFirstPartyTypeKind2.ZodBoolean = "ZodBoolean", ZodFirstPartyTypeKind2.ZodDate = "ZodDate", ZodFirstPartyTypeKind2.ZodSymbol = "ZodSymbol", ZodFirstPartyTypeKind2.ZodUndefined = "ZodUndefined", ZodFirstPartyTypeKind2.ZodNull = "ZodNull", ZodFirstPartyTypeKind2.ZodAny = "ZodAny", ZodFirstPartyTypeKind2.ZodUnknown = "ZodUnknown", ZodFirstPartyTypeKind2.ZodNever = "ZodNever", ZodFirstPartyTypeKind2.ZodVoid = "ZodVoid", ZodFirstPartyTypeKind2.ZodArray = "ZodArray", ZodFirstPartyTypeKind2.ZodObject = "ZodObject", ZodFirstPartyTypeKind2.ZodUnion = "ZodUnion", ZodFirstPartyTypeKind2.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", ZodFirstPartyTypeKind2.ZodIntersection = "ZodIntersection", ZodFirstPartyTypeKind2.ZodTuple = "ZodTuple", ZodFirstPartyTypeKind2.ZodRecord = "ZodRecord", ZodFirstPartyTypeKind2.ZodMap = "ZodMap", ZodFirstPartyTypeKind2.ZodSet = "ZodSet", ZodFirstPartyTypeKind2.ZodFunction = "ZodFunction", ZodFirstPartyTypeKind2.ZodLazy = "ZodLazy", ZodFirstPartyTypeKind2.ZodLiteral = "ZodLiteral", ZodFirstPartyTypeKind2.ZodEnum = "ZodEnum", ZodFirstPartyTypeKind2.ZodEffects = "ZodEffects", ZodFirstPartyTypeKind2.ZodNativeEnum = "ZodNativeEnum", ZodFirstPartyTypeKind2.ZodOptional = "ZodOptional", ZodFirstPartyTypeKind2.ZodNullable = "ZodNullable", ZodFirstPartyTypeKind2.ZodDefault = "ZodDefault", ZodFirstPartyTypeKind2.ZodCatch = "ZodCatch", ZodFirstPartyTypeKind2.ZodPromise = "ZodPromise", ZodFirstPartyTypeKind2.ZodBranded = "ZodBranded", ZodFirstPartyTypeKind2.ZodPipeline = "ZodPipeline", ZodFirstPartyTypeKind2.ZodReadonly = "ZodReadonly";
  })(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
  stringType = ZodString2.create, numberType = ZodNumber2.create, nanType = ZodNaN2.create, bigIntType = ZodBigInt2.create, booleanType = ZodBoolean2.create, dateType = ZodDate2.create, symbolType = ZodSymbol2.create, undefinedType = ZodUndefined2.create, nullType = ZodNull2.create, anyType = ZodAny2.create, unknownType = ZodUnknown2.create, neverType = ZodNever2.create, voidType = ZodVoid2.create, arrayType = ZodArray2.create, objectType = ZodObject2.create, strictObjectType = ZodObject2.strictCreate, unionType = ZodUnion2.create, discriminatedUnionType = ZodDiscriminatedUnion2.create, intersectionType = ZodIntersection2.create, tupleType = ZodTuple2.create, recordType = ZodRecord2.create, mapType = ZodMap2.create, setType = ZodSet2.create, functionType = ZodFunction.create, lazyType = ZodLazy2.create, literalType = ZodLiteral2.create, enumType = ZodEnum2.create, nativeEnumType = ZodNativeEnum.create, promiseType = ZodPromise2.create, effectsType = ZodEffects.create, optionalType = ZodOptional2.create, nullableType = ZodNullable2.create, preprocessType = ZodEffects.createWithPreprocess, pipelineType = ZodPipeline.create, coerce2 = {
    string: (arg) => ZodString2.create({ ...arg, coerce: !0 }),
    number: (arg) => ZodNumber2.create({ ...arg, coerce: !0 }),
    boolean: (arg) => ZodBoolean2.create({
      ...arg,
      coerce: !0
    }),
    bigint: (arg) => ZodBigInt2.create({ ...arg, coerce: !0 }),
    date: (arg) => ZodDate2.create({ ...arg, coerce: !0 })
  }, NEVER2 = INVALID;
});
