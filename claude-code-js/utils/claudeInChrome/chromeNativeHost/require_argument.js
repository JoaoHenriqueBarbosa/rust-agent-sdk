// var: require_argument
var require_argument = __commonJS((exports) => {
  var { InvalidArgumentError } = require_error();

  class Argument {
    constructor(name3, description) {
      switch (this.description = description || "", this.variadic = !1, this.parseArg = void 0, this.defaultValue = void 0, this.defaultValueDescription = void 0, this.argChoices = void 0, name3[0]) {
        case "<":
          this.required = !0, this._name = name3.slice(1, -1);
          break;
        case "[":
          this.required = !1, this._name = name3.slice(1, -1);
          break;
        default:
          this.required = !0, this._name = name3;
          break;
      }
      if (this._name.length > 3 && this._name.slice(-3) === "...")
        this.variadic = !0, this._name = this._name.slice(0, -3);
    }
    name() {
      return this._name;
    }
    _concatValue(value, previous) {
      if (previous === this.defaultValue || !Array.isArray(previous))
        return [value];
      return previous.concat(value);
    }
    default(value, description) {
      return this.defaultValue = value, this.defaultValueDescription = description, this;
    }
    argParser(fn) {
      return this.parseArg = fn, this;
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
    argRequired() {
      return this.required = !0, this;
    }
    argOptional() {
      return this.required = !1, this;
    }
  }
  function humanReadableArgName(arg) {
    let nameOutput = arg.name() + (arg.variadic === !0 ? "..." : "");
    return arg.required ? "<" + nameOutput + ">" : "[" + nameOutput + "]";
  }
  exports.Argument = Argument;
  exports.humanReadableArgName = humanReadableArgName;
});
