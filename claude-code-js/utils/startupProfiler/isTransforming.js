// function: isTransforming
function isTransforming(_schema, _ctx) {
  let ctx = _ctx ?? { seen: /* @__PURE__ */ new Set };
  if (ctx.seen.has(_schema))
    return !1;
  ctx.seen.add(_schema);
  let def = _schema._zod.def;
  switch (def.type) {
    case "string":
    case "number":
    case "bigint":
    case "boolean":
    case "date":
    case "symbol":
    case "undefined":
    case "null":
    case "any":
    case "unknown":
    case "never":
    case "void":
    case "literal":
    case "enum":
    case "nan":
    case "file":
    case "template_literal":
      return !1;
    case "array":
      return isTransforming(def.element, ctx);
    case "object": {
      for (let key in def.shape)
        if (isTransforming(def.shape[key], ctx))
          return !0;
      return !1;
    }
    case "union": {
      for (let option of def.options)
        if (isTransforming(option, ctx))
          return !0;
      return !1;
    }
    case "intersection":
      return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
    case "tuple": {
      for (let item of def.items)
        if (isTransforming(item, ctx))
          return !0;
      if (def.rest && isTransforming(def.rest, ctx))
        return !0;
      return !1;
    }
    case "record":
      return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
    case "map":
      return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
    case "set":
      return isTransforming(def.valueType, ctx);
    case "promise":
    case "optional":
    case "nonoptional":
    case "nullable":
    case "readonly":
      return isTransforming(def.innerType, ctx);
    case "lazy":
      return isTransforming(def.getter(), ctx);
    case "default":
      return isTransforming(def.innerType, ctx);
    case "prefault":
      return isTransforming(def.innerType, ctx);
    case "custom":
      return !1;
    case "transform":
      return !0;
    case "pipe":
      return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
    case "success":
      return !1;
    case "catch":
      return !1;
    default:
  }
  throw Error(`Unknown schema type: ${def.type}`);
}
