// var: require_option
var require_option = __commonJS((exports) => {
  var { InvalidArgumentError } = require_error();

  class Option {
    constructor(flags, description) {
      this.flags = flags, this.description = description || "", this.required = flags.includes("<"), this.optional = flags.includes("["), this.variadic = /\w\.\.\.[>\]]$/.test(flags), this.mandatory = !1;
      let optionFlags = splitOptionFlags(flags);
      if (this.short = optionFlags.shortFlag, this.long = optionFlags.longFlag, this.negate = !1, this.long)
        this.negate = this.long.startsWith("--no-");
      this.defaultValue = void 0, this.defaultValueDescription = void 0, this.presetArg = void 0, this.envVar = void 0, this.parseArg = void 0, this.hidden = !1, this.argChoices = void 0, this.conflictsWith = [], this.implied = void 0;
    }
    default(value, description) {
      return this.defaultValue = value, this.defaultValueDescription = description, this;
    }
    preset(arg) {
      return this.presetArg = arg, this;
    }
    conflicts(names) {
      return this.conflictsWith = this.conflictsWith.concat(names), this;
    }
    implies(impliedOptionValues) {
      let newImplied = impliedOptionValues;
      if (typeof impliedOptionValues === "string")
        newImplied = { [impliedOptionValues]: !0 };
      return this.implied = Object.assign(this.implied || {}, newImplied), this;
    }
    env(name3) {
      return this.envVar = name3, this;
    }
    argParser(fn) {
      return this.parseArg = fn, this;
    }
    makeOptionMandatory(mandatory = !0) {
      return this.mandatory = !!mandatory, this;
    }
    hideHelp(hide = !0) {
      return this.hidden = !!hide, this;
    }
    _concatValue(value, previous) {
      if (previous === this.defaultValue || !Array.isArray(previous))
        return [value];
      return previous.concat(value);
    }
    choices(values3) {
      return this.argChoices = values3.slice(), this.parseArg = (arg, previous) => {
        if (!this.argChoices.includes(arg))
          throw new InvalidArgumentError(`Allowed choices are ${this.argChoices.join(", ")}.`);
        if (this.variadic)
          return this._concatValue(arg, previous);
        return arg;
      }, this;
    }
    name() {
      if (this.long)
        return this.long.replace(/^--/, "");
      return this.short.replace(/^-/, "");
    }
    attributeName() {
      if (this.negate)
        return camelcase(this.name().replace(/^no-/, ""));
      return camelcase(this.name());
    }
    is(arg) {
      return this.short === arg || this.long === arg;
    }
    isBoolean() {
      return !this.required && !this.optional && !this.negate;
    }
  }

  class DualOptions {
    constructor(options2) {
      this.positiveOptions = /* @__PURE__ */ new Map, this.negativeOptions = /* @__PURE__ */ new Map, this.dualOptions = /* @__PURE__ */ new Set, options2.forEach((option) => {
        if (option.negate)
          this.negativeOptions.set(option.attributeName(), option);
        else
          this.positiveOptions.set(option.attributeName(), option);
      }), this.negativeOptions.forEach((value, key3) => {
        if (this.positiveOptions.has(key3))
          this.dualOptions.add(key3);
      });
    }
    valueFromOption(value, option) {
      let optionKey = option.attributeName();
      if (!this.dualOptions.has(optionKey))
        return !0;
      let preset = this.negativeOptions.get(optionKey).presetArg, negativeValue = preset !== void 0 ? preset : !1;
      return option.negate === (negativeValue === value);
    }
  }
  function camelcase(str2) {
    return str2.split("-").reduce((str3, word) => {
      return str3 + word[0].toUpperCase() + word.slice(1);
    });
  }
  function splitOptionFlags(flags) {
    let shortFlag, longFlag, shortFlagExp = /^-[^-]$/, longFlagExp = /^--[^-]/, flagParts = flags.split(/[ |,]+/).concat("guard");
    if (shortFlagExp.test(flagParts[0]))
      shortFlag = flagParts.shift();
    if (longFlagExp.test(flagParts[0]))
      longFlag = flagParts.shift();
    if (!shortFlag && shortFlagExp.test(flagParts[0]))
      shortFlag = flagParts.shift();
    if (!shortFlag && longFlagExp.test(flagParts[0]))
      shortFlag = longFlag, longFlag = flagParts.shift();
    if (flagParts[0].startsWith("-")) {
      let unsupportedFlag = flagParts[0], baseError = `option creation failed due to '${unsupportedFlag}' in option flags '${flags}'`;
      if (/^-[^-][^-]/.test(unsupportedFlag))
        throw Error(`${baseError}
- a short flag is a single dash and a single character
  - either use a single dash and a single character (for a short flag)
  - or use a double dash for a long option (and can have two, like '--ws, --workspace')`);
      if (shortFlagExp.test(unsupportedFlag))
        throw Error(`${baseError}
- too many short flags`);
      if (longFlagExp.test(unsupportedFlag))
        throw Error(`${baseError}
- too many long flags`);
      throw Error(`${baseError}
- unrecognised flag format`);
    }
    if (shortFlag === void 0 && longFlag === void 0)
      throw Error(`option creation failed due to no flags found in '${flags}'.`);
    return { shortFlag, longFlag };
  }
  exports.Option = Option;
  exports.DualOptions = DualOptions;
});
