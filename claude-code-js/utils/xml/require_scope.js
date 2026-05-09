// var: require_scope
var require_scope = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.ValueScope = exports.ValueScopeName = exports.Scope = exports.varKinds = exports.UsedValueState = void 0;
  var code_1 = require_code();

  class ValueError extends Error {
    constructor(name3) {
      super(`CodeGen: "code" for ${name3} not defined`);
      this.value = name3.value;
    }
  }
  var UsedValueState;
  (function(UsedValueState2) {
    UsedValueState2[UsedValueState2.Started = 0] = "Started", UsedValueState2[UsedValueState2.Completed = 1] = "Completed";
  })(UsedValueState || (exports.UsedValueState = UsedValueState = {}));
  exports.varKinds = {
    const: new code_1.Name("const"),
    let: new code_1.Name("let"),
    var: new code_1.Name("var")
  };

  class Scope {
    constructor({ prefixes, parent: parent2 } = {}) {
      this._names = {}, this._prefixes = prefixes, this._parent = parent2;
    }
    toName(nameOrPrefix) {
      return nameOrPrefix instanceof code_1.Name ? nameOrPrefix : this.name(nameOrPrefix);
    }
    name(prefix) {
      return new code_1.Name(this._newName(prefix));
    }
    _newName(prefix) {
      let ng = this._names[prefix] || this._nameGroup(prefix);
      return `${prefix}${ng.index++}`;
    }
    _nameGroup(prefix) {
      var _a3, _b2;
      if (((_b2 = (_a3 = this._parent) === null || _a3 === void 0 ? void 0 : _a3._prefixes) === null || _b2 === void 0 ? void 0 : _b2.has(prefix)) || this._prefixes && !this._prefixes.has(prefix))
        throw Error(`CodeGen: prefix "${prefix}" is not allowed in this scope`);
      return this._names[prefix] = { prefix, index: 0 };
    }
  }
  exports.Scope = Scope;

  class ValueScopeName extends code_1.Name {
    constructor(prefix, nameStr) {
      super(nameStr);
      this.prefix = prefix;
    }
    setValue(value, { property: property2, itemIndex }) {
      this.value = value, this.scopePath = code_1._`.${new code_1.Name(property2)}[${itemIndex}]`;
    }
  }
  exports.ValueScopeName = ValueScopeName;
  var line = code_1._`\n`;

  class ValueScope extends Scope {
    constructor(opts) {
      super(opts);
      this._values = {}, this._scope = opts.scope, this.opts = { ...opts, _n: opts.lines ? line : code_1.nil };
    }
    get() {
      return this._scope;
    }
    name(prefix) {
      return new ValueScopeName(prefix, this._newName(prefix));
    }
    value(nameOrPrefix, value) {
      var _a3;
      if (value.ref === void 0)
        throw Error("CodeGen: ref must be passed in value");
      let name3 = this.toName(nameOrPrefix), { prefix } = name3, valueKey = (_a3 = value.key) !== null && _a3 !== void 0 ? _a3 : value.ref, vs = this._values[prefix];
      if (vs) {
        let _name = vs.get(valueKey);
        if (_name)
          return _name;
      } else
        vs = this._values[prefix] = /* @__PURE__ */ new Map;
      vs.set(valueKey, name3);
      let s2 = this._scope[prefix] || (this._scope[prefix] = []), itemIndex = s2.length;
      return s2[itemIndex] = value.ref, name3.setValue(value, { property: prefix, itemIndex }), name3;
    }
    getValue(prefix, keyOrRef) {
      let vs = this._values[prefix];
      if (!vs)
        return;
      return vs.get(keyOrRef);
    }
    scopeRefs(scopeName, values3 = this._values) {
      return this._reduceValues(values3, (name3) => {
        if (name3.scopePath === void 0)
          throw Error(`CodeGen: name "${name3}" has no value`);
        return code_1._`${scopeName}${name3.scopePath}`;
      });
    }
    scopeCode(values3 = this._values, usedValues, getCode) {
      return this._reduceValues(values3, (name3) => {
        if (name3.value === void 0)
          throw Error(`CodeGen: name "${name3}" has no value`);
        return name3.value.code;
      }, usedValues, getCode);
    }
    _reduceValues(values3, valueCode, usedValues = {}, getCode) {
      let code = code_1.nil;
      for (let prefix in values3) {
        let vs = values3[prefix];
        if (!vs)
          continue;
        let nameSet = usedValues[prefix] = usedValues[prefix] || /* @__PURE__ */ new Map;
        vs.forEach((name3) => {
          if (nameSet.has(name3))
            return;
          nameSet.set(name3, UsedValueState.Started);
          let c3 = valueCode(name3);
          if (c3) {
            let def2 = this.opts.es5 ? exports.varKinds.var : exports.varKinds.const;
            code = code_1._`${code}${def2} ${name3} = ${c3};${this.opts._n}`;
          } else if (c3 = getCode === null || getCode === void 0 ? void 0 : getCode(name3))
            code = code_1._`${code}${c3}${this.opts._n}`;
          else
            throw new ValueError(name3);
          nameSet.set(name3, UsedValueState.Completed);
        });
      }
      return code;
    }
  }
  exports.ValueScope = ValueScope;
});
