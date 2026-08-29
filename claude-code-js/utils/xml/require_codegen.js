// var: require_codegen
var require_codegen = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.or = exports.and = exports.not = exports.CodeGen = exports.operators = exports.varKinds = exports.ValueScopeName = exports.ValueScope = exports.Scope = exports.Name = exports.regexpCode = exports.stringify = exports.getProperty = exports.nil = exports.strConcat = exports.str = exports._ = void 0;
  var code_1 = require_code(), scope_1 = require_scope(), code_2 = require_code();
  Object.defineProperty(exports, "_", { enumerable: !0, get: function() {
    return code_2._;
  } });
  Object.defineProperty(exports, "str", { enumerable: !0, get: function() {
    return code_2.str;
  } });
  Object.defineProperty(exports, "strConcat", { enumerable: !0, get: function() {
    return code_2.strConcat;
  } });
  Object.defineProperty(exports, "nil", { enumerable: !0, get: function() {
    return code_2.nil;
  } });
  Object.defineProperty(exports, "getProperty", { enumerable: !0, get: function() {
    return code_2.getProperty;
  } });
  Object.defineProperty(exports, "stringify", { enumerable: !0, get: function() {
    return code_2.stringify;
  } });
  Object.defineProperty(exports, "regexpCode", { enumerable: !0, get: function() {
    return code_2.regexpCode;
  } });
  Object.defineProperty(exports, "Name", { enumerable: !0, get: function() {
    return code_2.Name;
  } });
  var scope_2 = require_scope();
  Object.defineProperty(exports, "Scope", { enumerable: !0, get: function() {
    return scope_2.Scope;
  } });
  Object.defineProperty(exports, "ValueScope", { enumerable: !0, get: function() {
    return scope_2.ValueScope;
  } });
  Object.defineProperty(exports, "ValueScopeName", { enumerable: !0, get: function() {
    return scope_2.ValueScopeName;
  } });
  Object.defineProperty(exports, "varKinds", { enumerable: !0, get: function() {
    return scope_2.varKinds;
  } });
  exports.operators = {
    GT: new code_1._Code(">"),
    GTE: new code_1._Code(">="),
    LT: new code_1._Code("<"),
    LTE: new code_1._Code("<="),
    EQ: new code_1._Code("==="),
    NEQ: new code_1._Code("!=="),
    NOT: new code_1._Code("!"),
    OR: new code_1._Code("||"),
    AND: new code_1._Code("&&"),
    ADD: new code_1._Code("+")
  };

  class Node2 {
    optimizeNodes() {
      return this;
    }
    optimizeNames(_names, _constants) {
      return this;
    }
  }

  class Def extends Node2 {
    constructor(varKind, name3, rhs) {
      super();
      this.varKind = varKind, this.name = name3, this.rhs = rhs;
    }
    render({ es5, _n }) {
      let varKind = es5 ? scope_1.varKinds.var : this.varKind, rhs = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${varKind} ${this.name}${rhs};` + _n;
    }
    optimizeNames(names, constants11) {
      if (!names[this.name.str])
        return;
      if (this.rhs)
        this.rhs = optimizeExpr(this.rhs, names, constants11);
      return this;
    }
    get names() {
      return this.rhs instanceof code_1._CodeOrName ? this.rhs.names : {};
    }
  }

  class Assign extends Node2 {
    constructor(lhs, rhs, sideEffects) {
      super();
      this.lhs = lhs, this.rhs = rhs, this.sideEffects = sideEffects;
    }
    render({ _n }) {
      return `${this.lhs} = ${this.rhs};` + _n;
    }
    optimizeNames(names, constants11) {
      if (this.lhs instanceof code_1.Name && !names[this.lhs.str] && !this.sideEffects)
        return;
      return this.rhs = optimizeExpr(this.rhs, names, constants11), this;
    }
    get names() {
      let names = this.lhs instanceof code_1.Name ? {} : { ...this.lhs.names };
      return addExprNames(names, this.rhs);
    }
  }

  class AssignOp extends Assign {
    constructor(lhs, op, rhs, sideEffects) {
      super(lhs, rhs, sideEffects);
      this.op = op;
    }
    render({ _n }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + _n;
    }
  }

  class Label extends Node2 {
    constructor(label) {
      super();
      this.label = label, this.names = {};
    }
    render({ _n }) {
      return `${this.label}:` + _n;
    }
  }

  class Break extends Node2 {
    constructor(label) {
      super();
      this.label = label, this.names = {};
    }
    render({ _n }) {
      return `break${this.label ? ` ${this.label}` : ""};` + _n;
    }
  }

  class Throw extends Node2 {
    constructor(error44) {
      super();
      this.error = error44;
    }
    render({ _n }) {
      return `throw ${this.error};` + _n;
    }
    get names() {
      return this.error.names;
    }
  }

  class AnyCode extends Node2 {
    constructor(code) {
      super();
      this.code = code;
    }
    render({ _n }) {
      return `${this.code};` + _n;
    }
    optimizeNodes() {
      return `${this.code}` ? this : void 0;
    }
    optimizeNames(names, constants11) {
      return this.code = optimizeExpr(this.code, names, constants11), this;
    }
    get names() {
      return this.code instanceof code_1._CodeOrName ? this.code.names : {};
    }
  }

  class ParentNode extends Node2 {
    constructor(nodes = []) {
      super();
      this.nodes = nodes;
    }
    render(opts) {
      return this.nodes.reduce((code, n5) => code + n5.render(opts), "");
    }
    optimizeNodes() {
      let { nodes } = this, i5 = nodes.length;
      while (i5--) {
        let n5 = nodes[i5].optimizeNodes();
        if (Array.isArray(n5))
          nodes.splice(i5, 1, ...n5);
        else if (n5)
          nodes[i5] = n5;
        else
          nodes.splice(i5, 1);
      }
      return nodes.length > 0 ? this : void 0;
    }
    optimizeNames(names, constants11) {
      let { nodes } = this, i5 = nodes.length;
      while (i5--) {
        let n5 = nodes[i5];
        if (n5.optimizeNames(names, constants11))
          continue;
        subtractNames(names, n5.names), nodes.splice(i5, 1);
      }
      return nodes.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((names, n5) => addNames(names, n5.names), {});
    }
  }

  class BlockNode extends ParentNode {
    render(opts) {
      return "{" + opts._n + super.render(opts) + "}" + opts._n;
    }
  }

  class Root extends ParentNode {
  }

  class Else extends BlockNode {
  }
  Else.kind = "else";

  class If extends BlockNode {
    constructor(condition, nodes) {
      super(nodes);
      this.condition = condition;
    }
    render(opts) {
      let code = `if(${this.condition})` + super.render(opts);
      if (this.else)
        code += "else " + this.else.render(opts);
      return code;
    }
    optimizeNodes() {
      super.optimizeNodes();
      let cond = this.condition;
      if (cond === !0)
        return this.nodes;
      let e = this.else;
      if (e) {
        let ns = e.optimizeNodes();
        e = this.else = Array.isArray(ns) ? new Else(ns) : ns;
      }
      if (e) {
        if (cond === !1)
          return e instanceof If ? e : e.nodes;
        if (this.nodes.length)
          return this;
        return new If(not(cond), e instanceof If ? [e] : e.nodes);
      }
      if (cond === !1 || !this.nodes.length)
        return;
      return this;
    }
    optimizeNames(names, constants11) {
      var _a3;
      if (this.else = (_a3 = this.else) === null || _a3 === void 0 ? void 0 : _a3.optimizeNames(names, constants11), !(super.optimizeNames(names, constants11) || this.else))
        return;
      return this.condition = optimizeExpr(this.condition, names, constants11), this;
    }
    get names() {
      let names = super.names;
      if (addExprNames(names, this.condition), this.else)
        addNames(names, this.else.names);
      return names;
    }
  }
  If.kind = "if";

  class For extends BlockNode {
  }
  For.kind = "for";

  class ForLoop extends For {
    constructor(iteration) {
      super();
      this.iteration = iteration;
    }
    render(opts) {
      return `for(${this.iteration})` + super.render(opts);
    }
    optimizeNames(names, constants11) {
      if (!super.optimizeNames(names, constants11))
        return;
      return this.iteration = optimizeExpr(this.iteration, names, constants11), this;
    }
    get names() {
      return addNames(super.names, this.iteration.names);
    }
  }

  class ForRange extends For {
    constructor(varKind, name3, from, to) {
      super();
      this.varKind = varKind, this.name = name3, this.from = from, this.to = to;
    }
    render(opts) {
      let varKind = opts.es5 ? scope_1.varKinds.var : this.varKind, { name: name3, from, to } = this;
      return `for(${varKind} ${name3}=${from}; ${name3}<${to}; ${name3}++)` + super.render(opts);
    }
    get names() {
      let names = addExprNames(super.names, this.from);
      return addExprNames(names, this.to);
    }
  }

  class ForIter extends For {
    constructor(loop, varKind, name3, iterable) {
      super();
      this.loop = loop, this.varKind = varKind, this.name = name3, this.iterable = iterable;
    }
    render(opts) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(opts);
    }
    optimizeNames(names, constants11) {
      if (!super.optimizeNames(names, constants11))
        return;
      return this.iterable = optimizeExpr(this.iterable, names, constants11), this;
    }
    get names() {
      return addNames(super.names, this.iterable.names);
    }
  }

  class Func extends BlockNode {
    constructor(name3, args, async) {
      super();
      this.name = name3, this.args = args, this.async = async;
    }
    render(opts) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(opts);
    }
  }
  Func.kind = "func";

  class Return extends ParentNode {
    render(opts) {
      return "return " + super.render(opts);
    }
  }
  Return.kind = "return";

  class Try extends BlockNode {
    render(opts) {
      let code = "try" + super.render(opts);
      if (this.catch)
        code += this.catch.render(opts);
      if (this.finally)
        code += this.finally.render(opts);
      return code;
    }
    optimizeNodes() {
      var _a3, _b2;
      return super.optimizeNodes(), (_a3 = this.catch) === null || _a3 === void 0 || _a3.optimizeNodes(), (_b2 = this.finally) === null || _b2 === void 0 || _b2.optimizeNodes(), this;
    }
    optimizeNames(names, constants11) {
      var _a3, _b2;
      return super.optimizeNames(names, constants11), (_a3 = this.catch) === null || _a3 === void 0 || _a3.optimizeNames(names, constants11), (_b2 = this.finally) === null || _b2 === void 0 || _b2.optimizeNames(names, constants11), this;
    }
    get names() {
      let names = super.names;
      if (this.catch)
        addNames(names, this.catch.names);
      if (this.finally)
        addNames(names, this.finally.names);
      return names;
    }
  }

  class Catch extends BlockNode {
    constructor(error44) {
      super();
      this.error = error44;
    }
    render(opts) {
      return `catch(${this.error})` + super.render(opts);
    }
  }
  Catch.kind = "catch";

  class Finally extends BlockNode {
    render(opts) {
      return "finally" + super.render(opts);
    }
  }
  Finally.kind = "finally";

  class CodeGen {
    constructor(extScope, opts = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...opts, _n: opts.lines ? `
` : "" }, this._extScope = extScope, this._scope = new scope_1.Scope({ parent: extScope }), this._nodes = [new Root];
    }
    toString() {
      return this._root.render(this.opts);
    }
    name(prefix) {
      return this._scope.name(prefix);
    }
    scopeName(prefix) {
      return this._extScope.name(prefix);
    }
    scopeValue(prefixOrName, value) {
      let name3 = this._extScope.value(prefixOrName, value);
      return (this._values[name3.prefix] || (this._values[name3.prefix] = /* @__PURE__ */ new Set)).add(name3), name3;
    }
    getScopeValue(prefix, keyOrRef) {
      return this._extScope.getValue(prefix, keyOrRef);
    }
    scopeRefs(scopeName) {
      return this._extScope.scopeRefs(scopeName, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def(varKind, nameOrPrefix, rhs, constant2) {
      let name3 = this._scope.toName(nameOrPrefix);
      if (rhs !== void 0 && constant2)
        this._constants[name3.str] = rhs;
      return this._leafNode(new Def(varKind, name3, rhs)), name3;
    }
    const(nameOrPrefix, rhs, _constant) {
      return this._def(scope_1.varKinds.const, nameOrPrefix, rhs, _constant);
    }
    let(nameOrPrefix, rhs, _constant) {
      return this._def(scope_1.varKinds.let, nameOrPrefix, rhs, _constant);
    }
    var(nameOrPrefix, rhs, _constant) {
      return this._def(scope_1.varKinds.var, nameOrPrefix, rhs, _constant);
    }
    assign(lhs, rhs, sideEffects) {
      return this._leafNode(new Assign(lhs, rhs, sideEffects));
    }
    add(lhs, rhs) {
      return this._leafNode(new AssignOp(lhs, exports.operators.ADD, rhs));
    }
    code(c3) {
      if (typeof c3 == "function")
        c3();
      else if (c3 !== code_1.nil)
        this._leafNode(new AnyCode(c3));
      return this;
    }
    object(...keyValues) {
      let code = ["{"];
      for (let [key2, value] of keyValues) {
        if (code.length > 1)
          code.push(",");
        if (code.push(key2), key2 !== value || this.opts.es5)
          code.push(":"), (0, code_1.addCodeArg)(code, value);
      }
      return code.push("}"), new code_1._Code(code);
    }
    if(condition, thenBody, elseBody) {
      if (this._blockNode(new If(condition)), thenBody && elseBody)
        this.code(thenBody).else().code(elseBody).endIf();
      else if (thenBody)
        this.code(thenBody).endIf();
      else if (elseBody)
        throw Error('CodeGen: "else" body without "then" body');
      return this;
    }
    elseIf(condition) {
      return this._elseNode(new If(condition));
    }
    else() {
      return this._elseNode(new Else);
    }
    endIf() {
      return this._endBlockNode(If, Else);
    }
    _for(node, forBody) {
      if (this._blockNode(node), forBody)
        this.code(forBody).endFor();
      return this;
    }
    for(iteration, forBody) {
      return this._for(new ForLoop(iteration), forBody);
    }
    forRange(nameOrPrefix, from, to, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.let) {
      let name3 = this._scope.toName(nameOrPrefix);
      return this._for(new ForRange(varKind, name3, from, to), () => forBody(name3));
    }
    forOf(nameOrPrefix, iterable, forBody, varKind = scope_1.varKinds.const) {
      let name3 = this._scope.toName(nameOrPrefix);
      if (this.opts.es5) {
        let arr = iterable instanceof code_1.Name ? iterable : this.var("_arr", iterable);
        return this.forRange("_i", 0, code_1._`${arr}.length`, (i5) => {
          this.var(name3, code_1._`${arr}[${i5}]`), forBody(name3);
        });
      }
      return this._for(new ForIter("of", varKind, name3, iterable), () => forBody(name3));
    }
    forIn(nameOrPrefix, obj, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(nameOrPrefix, code_1._`Object.keys(${obj})`, forBody);
      let name3 = this._scope.toName(nameOrPrefix);
      return this._for(new ForIter("in", varKind, name3, obj), () => forBody(name3));
    }
    endFor() {
      return this._endBlockNode(For);
    }
    label(label) {
      return this._leafNode(new Label(label));
    }
    break(label) {
      return this._leafNode(new Break(label));
    }
    return(value) {
      let node = new Return;
      if (this._blockNode(node), this.code(value), node.nodes.length !== 1)
        throw Error('CodeGen: "return" should have one node');
      return this._endBlockNode(Return);
    }
    try(tryBody, catchCode, finallyCode) {
      if (!catchCode && !finallyCode)
        throw Error('CodeGen: "try" without "catch" and "finally"');
      let node = new Try;
      if (this._blockNode(node), this.code(tryBody), catchCode) {
        let error44 = this.name("e");
        this._currNode = node.catch = new Catch(error44), catchCode(error44);
      }
      if (finallyCode)
        this._currNode = node.finally = new Finally, this.code(finallyCode);
      return this._endBlockNode(Catch, Finally);
    }
    throw(error44) {
      return this._leafNode(new Throw(error44));
    }
    block(body, nodeCount) {
      if (this._blockStarts.push(this._nodes.length), body)
        this.code(body).endBlock(nodeCount);
      return this;
    }
    endBlock(nodeCount) {
      let len = this._blockStarts.pop();
      if (len === void 0)
        throw Error("CodeGen: not in self-balancing block");
      let toClose = this._nodes.length - len;
      if (toClose < 0 || nodeCount !== void 0 && toClose !== nodeCount)
        throw Error(`CodeGen: wrong number of nodes: ${toClose} vs ${nodeCount} expected`);
      return this._nodes.length = len, this;
    }
    func(name3, args = code_1.nil, async, funcBody) {
      if (this._blockNode(new Func(name3, args, async)), funcBody)
        this.code(funcBody).endFunc();
      return this;
    }
    endFunc() {
      return this._endBlockNode(Func);
    }
    optimize(n5 = 1) {
      while (n5-- > 0)
        this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
    }
    _leafNode(node) {
      return this._currNode.nodes.push(node), this;
    }
    _blockNode(node) {
      this._currNode.nodes.push(node), this._nodes.push(node);
    }
    _endBlockNode(N1, N2) {
      let n5 = this._currNode;
      if (n5 instanceof N1 || N2 && n5 instanceof N2)
        return this._nodes.pop(), this;
      throw Error(`CodeGen: not in block "${N2 ? `${N1.kind}/${N2.kind}` : N1.kind}"`);
    }
    _elseNode(node) {
      let n5 = this._currNode;
      if (!(n5 instanceof If))
        throw Error('CodeGen: "else" without "if"');
      return this._currNode = n5.else = node, this;
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      let ns = this._nodes;
      return ns[ns.length - 1];
    }
    set _currNode(node) {
      let ns = this._nodes;
      ns[ns.length - 1] = node;
    }
  }
  exports.CodeGen = CodeGen;
  function addNames(names, from) {
    for (let n5 in from)
      names[n5] = (names[n5] || 0) + (from[n5] || 0);
    return names;
  }
  function addExprNames(names, from) {
    return from instanceof code_1._CodeOrName ? addNames(names, from.names) : names;
  }
  function optimizeExpr(expr, names, constants11) {
    if (expr instanceof code_1.Name)
      return replaceName(expr);
    if (!canOptimize(expr))
      return expr;
    return new code_1._Code(expr._items.reduce((items, c3) => {
      if (c3 instanceof code_1.Name)
        c3 = replaceName(c3);
      if (c3 instanceof code_1._Code)
        items.push(...c3._items);
      else
        items.push(c3);
      return items;
    }, []));
    function replaceName(n5) {
      let c3 = constants11[n5.str];
      if (c3 === void 0 || names[n5.str] !== 1)
        return n5;
      return delete names[n5.str], c3;
    }
    function canOptimize(e) {
      return e instanceof code_1._Code && e._items.some((c3) => c3 instanceof code_1.Name && names[c3.str] === 1 && constants11[c3.str] !== void 0);
    }
  }
  function subtractNames(names, from) {
    for (let n5 in from)
      names[n5] = (names[n5] || 0) - (from[n5] || 0);
  }
  function not(x4) {
    return typeof x4 == "boolean" || typeof x4 == "number" || x4 === null ? !x4 : code_1._`!${par(x4)}`;
  }
  exports.not = not;
  var andCode = mappend(exports.operators.AND);
  function and(...args) {
    return args.reduce(andCode);
  }
  exports.and = and;
  var orCode = mappend(exports.operators.OR);
  function or(...args) {
    return args.reduce(orCode);
  }
  exports.or = or;
  function mappend(op) {
    return (x4, y2) => x4 === code_1.nil ? y2 : y2 === code_1.nil ? x4 : code_1._`${par(x4)} ${op} ${par(y2)}`;
  }
  function par(x4) {
    return x4 instanceof code_1.Name ? x4 : code_1._`(${x4})`;
  }
});
