// var: require_visit
var require_visit = __commonJS((exports) => {
  var identity16 = require_identity(), BREAK = Symbol("break visit"), SKIP = Symbol("skip children"), REMOVE = Symbol("remove node");
  function visit2(node, visitor) {
    let visitor_ = initVisitor(visitor);
    if (identity16.isDocument(node)) {
      if (visit_(null, node.contents, visitor_, Object.freeze([node])) === REMOVE)
        node.contents = null;
    } else
      visit_(null, node, visitor_, Object.freeze([]));
  }
  visit2.BREAK = BREAK;
  visit2.SKIP = SKIP;
  visit2.REMOVE = REMOVE;
  function visit_(key, node, visitor, path12) {
    let ctrl = callVisitor(key, node, visitor, path12);
    if (identity16.isNode(ctrl) || identity16.isPair(ctrl))
      return replaceNode(key, path12, ctrl), visit_(key, ctrl, visitor, path12);
    if (typeof ctrl !== "symbol") {
      if (identity16.isCollection(node)) {
        path12 = Object.freeze(path12.concat(node));
        for (let i4 = 0;i4 < node.items.length; ++i4) {
          let ci = visit_(i4, node.items[i4], visitor, path12);
          if (typeof ci === "number")
            i4 = ci - 1;
          else if (ci === BREAK)
            return BREAK;
          else if (ci === REMOVE)
            node.items.splice(i4, 1), i4 -= 1;
        }
      } else if (identity16.isPair(node)) {
        path12 = Object.freeze(path12.concat(node));
        let ck = visit_("key", node.key, visitor, path12);
        if (ck === BREAK)
          return BREAK;
        else if (ck === REMOVE)
          node.key = null;
        let cv = visit_("value", node.value, visitor, path12);
        if (cv === BREAK)
          return BREAK;
        else if (cv === REMOVE)
          node.value = null;
      }
    }
    return ctrl;
  }
  async function visitAsync(node, visitor) {
    let visitor_ = initVisitor(visitor);
    if (identity16.isDocument(node)) {
      if (await visitAsync_(null, node.contents, visitor_, Object.freeze([node])) === REMOVE)
        node.contents = null;
    } else
      await visitAsync_(null, node, visitor_, Object.freeze([]));
  }
  visitAsync.BREAK = BREAK;
  visitAsync.SKIP = SKIP;
  visitAsync.REMOVE = REMOVE;
  async function visitAsync_(key, node, visitor, path12) {
    let ctrl = await callVisitor(key, node, visitor, path12);
    if (identity16.isNode(ctrl) || identity16.isPair(ctrl))
      return replaceNode(key, path12, ctrl), visitAsync_(key, ctrl, visitor, path12);
    if (typeof ctrl !== "symbol") {
      if (identity16.isCollection(node)) {
        path12 = Object.freeze(path12.concat(node));
        for (let i4 = 0;i4 < node.items.length; ++i4) {
          let ci = await visitAsync_(i4, node.items[i4], visitor, path12);
          if (typeof ci === "number")
            i4 = ci - 1;
          else if (ci === BREAK)
            return BREAK;
          else if (ci === REMOVE)
            node.items.splice(i4, 1), i4 -= 1;
        }
      } else if (identity16.isPair(node)) {
        path12 = Object.freeze(path12.concat(node));
        let ck = await visitAsync_("key", node.key, visitor, path12);
        if (ck === BREAK)
          return BREAK;
        else if (ck === REMOVE)
          node.key = null;
        let cv = await visitAsync_("value", node.value, visitor, path12);
        if (cv === BREAK)
          return BREAK;
        else if (cv === REMOVE)
          node.value = null;
      }
    }
    return ctrl;
  }
  function initVisitor(visitor) {
    if (typeof visitor === "object" && (visitor.Collection || visitor.Node || visitor.Value))
      return Object.assign({
        Alias: visitor.Node,
        Map: visitor.Node,
        Scalar: visitor.Node,
        Seq: visitor.Node
      }, visitor.Value && {
        Map: visitor.Value,
        Scalar: visitor.Value,
        Seq: visitor.Value
      }, visitor.Collection && {
        Map: visitor.Collection,
        Seq: visitor.Collection
      }, visitor);
    return visitor;
  }
  function callVisitor(key, node, visitor, path12) {
    if (typeof visitor === "function")
      return visitor(key, node, path12);
    if (identity16.isMap(node))
      return visitor.Map?.(key, node, path12);
    if (identity16.isSeq(node))
      return visitor.Seq?.(key, node, path12);
    if (identity16.isPair(node))
      return visitor.Pair?.(key, node, path12);
    if (identity16.isScalar(node))
      return visitor.Scalar?.(key, node, path12);
    if (identity16.isAlias(node))
      return visitor.Alias?.(key, node, path12);
    return;
  }
  function replaceNode(key, path12, node) {
    let parent = path12[path12.length - 1];
    if (identity16.isCollection(parent))
      parent.items[key] = node;
    else if (identity16.isPair(parent))
      if (key === "key")
        parent.key = node;
      else
        parent.value = node;
    else if (identity16.isDocument(parent))
      parent.contents = node;
    else {
      let pt = identity16.isAlias(parent) ? "alias" : "scalar";
      throw Error(`Cannot replace node with ${pt} parent`);
    }
  }
  exports.visit = visit2;
  exports.visitAsync = visitAsync;
});
