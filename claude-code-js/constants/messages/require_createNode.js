// var: require_createNode
var require_createNode = __commonJS((exports) => {
  var Alias = require_Alias(), identity16 = require_identity(), Scalar = require_Scalar(), defaultTagPrefix = "tag:yaml.org,2002:";
  function findTagObject(value, tagName, tags) {
    if (tagName) {
      let match = tags.filter((t2) => t2.tag === tagName), tagObj = match.find((t2) => !t2.format) ?? match[0];
      if (!tagObj)
        throw Error(`Tag ${tagName} not found`);
      return tagObj;
    }
    return tags.find((t2) => t2.identify?.(value) && !t2.format);
  }
  function createNode2(value, tagName, ctx) {
    if (identity16.isDocument(value))
      value = value.contents;
    if (identity16.isNode(value))
      return value;
    if (identity16.isPair(value)) {
      let map7 = ctx.schema[identity16.MAP].createNode?.(ctx.schema, null, ctx);
      return map7.items.push(value), map7;
    }
    if (value instanceof String || value instanceof Number || value instanceof Boolean || typeof BigInt < "u" && value instanceof BigInt)
      value = value.valueOf();
    let { aliasDuplicateObjects, onAnchor, onTagObj, schema: schema5, sourceObjects } = ctx, ref = void 0;
    if (aliasDuplicateObjects && value && typeof value === "object")
      if (ref = sourceObjects.get(value), ref)
        return ref.anchor ?? (ref.anchor = onAnchor(value)), new Alias.Alias(ref.anchor);
      else
        ref = { anchor: null, node: null }, sourceObjects.set(value, ref);
    if (tagName?.startsWith("!!"))
      tagName = defaultTagPrefix + tagName.slice(2);
    let tagObj = findTagObject(value, tagName, schema5.tags);
    if (!tagObj) {
      if (value && typeof value.toJSON === "function")
        value = value.toJSON();
      if (!value || typeof value !== "object") {
        let node2 = new Scalar.Scalar(value);
        if (ref)
          ref.node = node2;
        return node2;
      }
      tagObj = value instanceof Map ? schema5[identity16.MAP] : (Symbol.iterator in Object(value)) ? schema5[identity16.SEQ] : schema5[identity16.MAP];
    }
    if (onTagObj)
      onTagObj(tagObj), delete ctx.onTagObj;
    let node = tagObj?.createNode ? tagObj.createNode(ctx.schema, value, ctx) : typeof tagObj?.nodeClass?.from === "function" ? tagObj.nodeClass.from(ctx.schema, value, ctx) : new Scalar.Scalar(value);
    if (tagName)
      node.tag = tagName;
    else if (!tagObj.default)
      node.tag = tagObj.tag;
    if (ref)
      ref.node = node;
    return node;
  }
  exports.createNode = createNode2;
});
