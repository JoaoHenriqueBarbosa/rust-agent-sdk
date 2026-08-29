// var: require_resolve_block_seq
var require_resolve_block_seq = __commonJS((exports) => {
  var YAMLSeq = require_YAMLSeq(), resolveProps = require_resolve_props(), utilFlowIndentCheck = require_util_flow_indent_check();
  function resolveBlockSeq({ composeNode, composeEmptyNode }, ctx, bs, onError, tag) {
    let seq = new (tag?.nodeClass ?? YAMLSeq.YAMLSeq)(ctx.schema);
    if (ctx.atRoot)
      ctx.atRoot = !1;
    if (ctx.atKey)
      ctx.atKey = !1;
    let offset = bs.offset, commentEnd = null;
    for (let { start, value } of bs.items) {
      let props = resolveProps.resolveProps(start, {
        indicator: "seq-item-ind",
        next: value,
        offset,
        onError,
        parentIndent: bs.indent,
        startOnNewline: !0
      });
      if (!props.found)
        if (props.anchor || props.tag || value)
          if (value?.type === "block-seq")
            onError(props.end, "BAD_INDENT", "All sequence items must start at the same column");
          else
            onError(offset, "MISSING_CHAR", "Sequence item without - indicator");
        else {
          if (commentEnd = props.end, props.comment)
            seq.comment = props.comment;
          continue;
        }
      let node = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, start, null, props, onError);
      if (ctx.schema.compat)
        utilFlowIndentCheck.flowIndentCheck(bs.indent, value, onError);
      offset = node.range[2], seq.items.push(node);
    }
    return seq.range = [bs.offset, offset, commentEnd ?? offset], seq;
  }
  exports.resolveBlockSeq = resolveBlockSeq;
});
