// var: require_resolve_flow_collection
var require_resolve_flow_collection = __commonJS((exports) => {
  var identity16 = require_identity(), Pair = require_Pair(), YAMLMap = require_YAMLMap(), YAMLSeq = require_YAMLSeq(), resolveEnd = require_resolve_end(), resolveProps = require_resolve_props(), utilContainsNewline = require_util_contains_newline(), utilMapIncludes = require_util_map_includes(), blockMsg = "Block collections are not allowed within flow collections", isBlock = (token) => token && (token.type === "block-map" || token.type === "block-seq");
  function resolveFlowCollection({ composeNode, composeEmptyNode }, ctx, fc, onError, tag) {
    let isMap2 = fc.start.source === "{", fcName = isMap2 ? "flow map" : "flow sequence", coll = new (tag?.nodeClass ?? (isMap2 ? YAMLMap.YAMLMap : YAMLSeq.YAMLSeq))(ctx.schema);
    coll.flow = !0;
    let atRoot = ctx.atRoot;
    if (atRoot)
      ctx.atRoot = !1;
    if (ctx.atKey)
      ctx.atKey = !1;
    let offset = fc.offset + fc.start.source.length;
    for (let i4 = 0;i4 < fc.items.length; ++i4) {
      let collItem = fc.items[i4], { start, key, sep: sep7, value } = collItem, props = resolveProps.resolveProps(start, {
        flow: fcName,
        indicator: "explicit-key-ind",
        next: key ?? sep7?.[0],
        offset,
        onError,
        parentIndent: fc.indent,
        startOnNewline: !1
      });
      if (!props.found) {
        if (!props.anchor && !props.tag && !sep7 && !value) {
          if (i4 === 0 && props.comma)
            onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
          else if (i4 < fc.items.length - 1)
            onError(props.start, "UNEXPECTED_TOKEN", `Unexpected empty item in ${fcName}`);
          if (props.comment)
            if (coll.comment)
              coll.comment += `
` + props.comment;
            else
              coll.comment = props.comment;
          offset = props.end;
          continue;
        }
        if (!isMap2 && ctx.options.strict && utilContainsNewline.containsNewline(key))
          onError(key, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
      }
      if (i4 === 0) {
        if (props.comma)
          onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
      } else {
        if (!props.comma)
          onError(props.start, "MISSING_CHAR", `Missing , between ${fcName} items`);
        if (props.comment) {
          let prevItemComment = "";
          loop:
            for (let st of start)
              switch (st.type) {
                case "comma":
                case "space":
                  break;
                case "comment":
                  prevItemComment = st.source.substring(1);
                  break loop;
                default:
                  break loop;
              }
          if (prevItemComment) {
            let prev = coll.items[coll.items.length - 1];
            if (identity16.isPair(prev))
              prev = prev.value ?? prev.key;
            if (prev.comment)
              prev.comment += `
` + prevItemComment;
            else
              prev.comment = prevItemComment;
            props.comment = props.comment.substring(prevItemComment.length + 1);
          }
        }
      }
      if (!isMap2 && !sep7 && !props.found) {
        let valueNode = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, sep7, null, props, onError);
        if (coll.items.push(valueNode), offset = valueNode.range[2], isBlock(value))
          onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
      } else {
        ctx.atKey = !0;
        let keyStart = props.end, keyNode = key ? composeNode(ctx, key, props, onError) : composeEmptyNode(ctx, keyStart, start, null, props, onError);
        if (isBlock(key))
          onError(keyNode.range, "BLOCK_IN_FLOW", blockMsg);
        ctx.atKey = !1;
        let valueProps = resolveProps.resolveProps(sep7 ?? [], {
          flow: fcName,
          indicator: "map-value-ind",
          next: value,
          offset: keyNode.range[2],
          onError,
          parentIndent: fc.indent,
          startOnNewline: !1
        });
        if (valueProps.found) {
          if (!isMap2 && !props.found && ctx.options.strict) {
            if (sep7)
              for (let st of sep7) {
                if (st === valueProps.found)
                  break;
                if (st.type === "newline") {
                  onError(st, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
                  break;
                }
              }
            if (props.start < valueProps.found.offset - 1024)
              onError(valueProps.found, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit flow sequence key");
          }
        } else if (value)
          if ("source" in value && value.source?.[0] === ":")
            onError(value, "MISSING_CHAR", `Missing space after : in ${fcName}`);
          else
            onError(valueProps.start, "MISSING_CHAR", `Missing , or : between ${fcName} items`);
        let valueNode = value ? composeNode(ctx, value, valueProps, onError) : valueProps.found ? composeEmptyNode(ctx, valueProps.end, sep7, null, valueProps, onError) : null;
        if (valueNode) {
          if (isBlock(value))
            onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
        } else if (valueProps.comment)
          if (keyNode.comment)
            keyNode.comment += `
` + valueProps.comment;
          else
            keyNode.comment = valueProps.comment;
        let pair = new Pair.Pair(keyNode, valueNode);
        if (ctx.options.keepSourceTokens)
          pair.srcToken = collItem;
        if (isMap2) {
          let map7 = coll;
          if (utilMapIncludes.mapIncludes(ctx, map7.items, keyNode))
            onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
          map7.items.push(pair);
        } else {
          let map7 = new YAMLMap.YAMLMap(ctx.schema);
          map7.flow = !0, map7.items.push(pair);
          let endRange = (valueNode ?? keyNode).range;
          map7.range = [keyNode.range[0], endRange[1], endRange[2]], coll.items.push(map7);
        }
        offset = valueNode ? valueNode.range[2] : valueProps.end;
      }
    }
    let expectedEnd = isMap2 ? "}" : "]", [ce, ...ee] = fc.end, cePos = offset;
    if (ce?.source === expectedEnd)
      cePos = ce.offset + ce.source.length;
    else {
      let name3 = fcName[0].toUpperCase() + fcName.substring(1), msg = atRoot ? `${name3} must end with a ${expectedEnd}` : `${name3} in block collection must be sufficiently indented and end with a ${expectedEnd}`;
      if (onError(offset, atRoot ? "MISSING_CHAR" : "BAD_INDENT", msg), ce && ce.source.length !== 1)
        ee.unshift(ce);
    }
    if (ee.length > 0) {
      let end = resolveEnd.resolveEnd(ee, cePos, ctx.options.strict, onError);
      if (end.comment)
        if (coll.comment)
          coll.comment += `
` + end.comment;
        else
          coll.comment = end.comment;
      coll.range = [fc.offset, cePos, end.offset];
    } else
      coll.range = [fc.offset, cePos, cePos];
    return coll;
  }
  exports.resolveFlowCollection = resolveFlowCollection;
});
