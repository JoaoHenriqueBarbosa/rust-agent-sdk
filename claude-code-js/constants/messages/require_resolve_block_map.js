// var: require_resolve_block_map
var require_resolve_block_map = __commonJS((exports) => {
  var Pair = require_Pair(), YAMLMap = require_YAMLMap(), resolveProps = require_resolve_props(), utilContainsNewline = require_util_contains_newline(), utilFlowIndentCheck = require_util_flow_indent_check(), utilMapIncludes = require_util_map_includes(), startColMsg = "All mapping items must start at the same column";
  function resolveBlockMap({ composeNode, composeEmptyNode }, ctx, bm, onError, tag) {
    let map7 = new (tag?.nodeClass ?? YAMLMap.YAMLMap)(ctx.schema);
    if (ctx.atRoot)
      ctx.atRoot = !1;
    let offset = bm.offset, commentEnd = null;
    for (let collItem of bm.items) {
      let { start, key, sep: sep7, value } = collItem, keyProps = resolveProps.resolveProps(start, {
        indicator: "explicit-key-ind",
        next: key ?? sep7?.[0],
        offset,
        onError,
        parentIndent: bm.indent,
        startOnNewline: !0
      }), implicitKey = !keyProps.found;
      if (implicitKey) {
        if (key) {
          if (key.type === "block-seq")
            onError(offset, "BLOCK_AS_IMPLICIT_KEY", "A block sequence may not be used as an implicit map key");
          else if ("indent" in key && key.indent !== bm.indent)
            onError(offset, "BAD_INDENT", startColMsg);
        }
        if (!keyProps.anchor && !keyProps.tag && !sep7) {
          if (commentEnd = keyProps.end, keyProps.comment)
            if (map7.comment)
              map7.comment += `
` + keyProps.comment;
            else
              map7.comment = keyProps.comment;
          continue;
        }
        if (keyProps.newlineAfterProp || utilContainsNewline.containsNewline(key))
          onError(key ?? start[start.length - 1], "MULTILINE_IMPLICIT_KEY", "Implicit keys need to be on a single line");
      } else if (keyProps.found?.indent !== bm.indent)
        onError(offset, "BAD_INDENT", startColMsg);
      ctx.atKey = !0;
      let keyStart = keyProps.end, keyNode = key ? composeNode(ctx, key, keyProps, onError) : composeEmptyNode(ctx, keyStart, start, null, keyProps, onError);
      if (ctx.schema.compat)
        utilFlowIndentCheck.flowIndentCheck(bm.indent, key, onError);
      if (ctx.atKey = !1, utilMapIncludes.mapIncludes(ctx, map7.items, keyNode))
        onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
      let valueProps = resolveProps.resolveProps(sep7 ?? [], {
        indicator: "map-value-ind",
        next: value,
        offset: keyNode.range[2],
        onError,
        parentIndent: bm.indent,
        startOnNewline: !key || key.type === "block-scalar"
      });
      if (offset = valueProps.end, valueProps.found) {
        if (implicitKey) {
          if (value?.type === "block-map" && !valueProps.hasNewline)
            onError(offset, "BLOCK_AS_IMPLICIT_KEY", "Nested mappings are not allowed in compact mappings");
          if (ctx.options.strict && keyProps.start < valueProps.found.offset - 1024)
            onError(keyNode.range, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit block mapping key");
        }
        let valueNode = value ? composeNode(ctx, value, valueProps, onError) : composeEmptyNode(ctx, offset, sep7, null, valueProps, onError);
        if (ctx.schema.compat)
          utilFlowIndentCheck.flowIndentCheck(bm.indent, value, onError);
        offset = valueNode.range[2];
        let pair = new Pair.Pair(keyNode, valueNode);
        if (ctx.options.keepSourceTokens)
          pair.srcToken = collItem;
        map7.items.push(pair);
      } else {
        if (implicitKey)
          onError(keyNode.range, "MISSING_CHAR", "Implicit map keys need to be followed by map values");
        if (valueProps.comment)
          if (keyNode.comment)
            keyNode.comment += `
` + valueProps.comment;
          else
            keyNode.comment = valueProps.comment;
        let pair = new Pair.Pair(keyNode);
        if (ctx.options.keepSourceTokens)
          pair.srcToken = collItem;
        map7.items.push(pair);
      }
    }
    if (commentEnd && commentEnd < offset)
      onError(commentEnd, "IMPOSSIBLE", "Map comment with trailing content");
    return map7.range = [bm.offset, offset, commentEnd ?? offset], map7;
  }
  exports.resolveBlockMap = resolveBlockMap;
});
