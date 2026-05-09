// var: require_Alias
var require_Alias = __commonJS((exports) => {
  var anchors = require_anchors(), visit2 = require_visit(), identity16 = require_identity(), Node2 = require_Node(), toJS = require_toJS();

  class Alias extends Node2.NodeBase {
    constructor(source) {
      super(identity16.ALIAS);
      this.source = source, Object.defineProperty(this, "tag", {
        set() {
          throw Error("Alias nodes cannot have tags");
        }
      });
    }
    resolve(doc2, ctx) {
      let nodes;
      if (ctx?.aliasResolveCache)
        nodes = ctx.aliasResolveCache;
      else if (nodes = [], visit2.visit(doc2, {
        Node: (_key, node) => {
          if (identity16.isAlias(node) || identity16.hasAnchor(node))
            nodes.push(node);
        }
      }), ctx)
        ctx.aliasResolveCache = nodes;
      let found = void 0;
      for (let node of nodes) {
        if (node === this)
          break;
        if (node.anchor === this.source)
          found = node;
      }
      return found;
    }
    toJSON(_arg, ctx) {
      if (!ctx)
        return { source: this.source };
      let { anchors: anchors2, doc: doc2, maxAliasCount } = ctx, source = this.resolve(doc2, ctx);
      if (!source) {
        let msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
        throw ReferenceError(msg);
      }
      let data = anchors2.get(source);
      if (!data)
        toJS.toJS(source, null, ctx), data = anchors2.get(source);
      if (data?.res === void 0)
        throw ReferenceError("This should not happen: Alias anchor was not resolved?");
      if (maxAliasCount >= 0) {
        if (data.count += 1, data.aliasCount === 0)
          data.aliasCount = getAliasCount(doc2, source, anchors2);
        if (data.count * data.aliasCount > maxAliasCount)
          throw ReferenceError("Excessive alias count indicates a resource exhaustion attack");
      }
      return data.res;
    }
    toString(ctx, _onComment, _onChompKeep) {
      let src = `*${this.source}`;
      if (ctx) {
        if (anchors.anchorIsValid(this.source), ctx.options.verifyAliasOrder && !ctx.anchors.has(this.source)) {
          let msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
          throw Error(msg);
        }
        if (ctx.implicitKey)
          return `${src} `;
      }
      return src;
    }
  }
  function getAliasCount(doc2, node, anchors2) {
    if (identity16.isAlias(node)) {
      let source = node.resolve(doc2), anchor = anchors2 && source && anchors2.get(source);
      return anchor ? anchor.count * anchor.aliasCount : 0;
    } else if (identity16.isCollection(node)) {
      let count3 = 0;
      for (let item of node.items) {
        let c3 = getAliasCount(doc2, item, anchors2);
        if (c3 > count3)
          count3 = c3;
      }
      return count3;
    } else if (identity16.isPair(node)) {
      let kc = getAliasCount(doc2, node.key, anchors2), vc = getAliasCount(doc2, node.value, anchors2);
      return Math.max(kc, vc);
    }
    return 1;
  }
  exports.Alias = Alias;
});
