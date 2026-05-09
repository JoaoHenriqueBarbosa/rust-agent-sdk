// var: require_applicability
var require_applicability = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.shouldUseRule = exports.shouldUseGroup = exports.schemaHasRulesForType = void 0;
  function schemaHasRulesForType({ schema: schema5, self: self2 }, type) {
    let group = self2.RULES.types[type];
    return group && group !== !0 && shouldUseGroup(schema5, group);
  }
  exports.schemaHasRulesForType = schemaHasRulesForType;
  function shouldUseGroup(schema5, group) {
    return group.rules.some((rule) => shouldUseRule(schema5, rule));
  }
  exports.shouldUseGroup = shouldUseGroup;
  function shouldUseRule(schema5, rule) {
    var _a3;
    return schema5[rule.keyword] !== void 0 || ((_a3 = rule.definition.implements) === null || _a3 === void 0 ? void 0 : _a3.some((kwd) => schema5[kwd] !== void 0));
  }
  exports.shouldUseRule = shouldUseRule;
});
