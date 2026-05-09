// var: require_resolve_end
var require_resolve_end = __commonJS((exports) => {
  function resolveEnd(end, offset, reqSpace, onError) {
    let comment = "";
    if (end) {
      let hasSpace = !1, sep7 = "";
      for (let token of end) {
        let { source, type } = token;
        switch (type) {
          case "space":
            hasSpace = !0;
            break;
          case "comment": {
            if (reqSpace && !hasSpace)
              onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
            let cb = source.substring(1) || " ";
            if (!comment)
              comment = cb;
            else
              comment += sep7 + cb;
            sep7 = "";
            break;
          }
          case "newline":
            if (comment)
              sep7 += source;
            hasSpace = !0;
            break;
          default:
            onError(token, "UNEXPECTED_TOKEN", `Unexpected ${type} at node end`);
        }
        offset += source.length;
      }
    }
    return { comment, offset };
  }
  exports.resolveEnd = resolveEnd;
});
