// var: require_stringifyString
var require_stringifyString = __commonJS((exports) => {
  var Scalar = require_Scalar(), foldFlowLines = require_foldFlowLines(), getFoldOptions = (ctx, isBlock) => ({
    indentAtStart: isBlock ? ctx.indent.length : ctx.indentAtStart,
    lineWidth: ctx.options.lineWidth,
    minContentWidth: ctx.options.minContentWidth
  }), containsDocumentMarker = (str) => /^(%|---|\.\.\.)/m.test(str);
  function lineLengthOverLimit(str, lineWidth2, indentLength) {
    if (!lineWidth2 || lineWidth2 < 0)
      return !1;
    let limit = lineWidth2 - indentLength, strLen = str.length;
    if (strLen <= limit)
      return !1;
    for (let i4 = 0, start = 0;i4 < strLen; ++i4)
      if (str[i4] === `
`) {
        if (i4 - start > limit)
          return !0;
        if (start = i4 + 1, strLen - start <= limit)
          return !1;
      }
    return !0;
  }
  function doubleQuotedString(value, ctx) {
    let json2 = JSON.stringify(value);
    if (ctx.options.doubleQuotedAsJSON)
      return json2;
    let { implicitKey } = ctx, minMultiLineLength = ctx.options.doubleQuotedMinMultiLineLength, indent = ctx.indent || (containsDocumentMarker(value) ? "  " : ""), str = "", start = 0;
    for (let i4 = 0, ch = json2[i4];ch; ch = json2[++i4]) {
      if (ch === " " && json2[i4 + 1] === "\\" && json2[i4 + 2] === "n")
        str += json2.slice(start, i4) + "\\ ", i4 += 1, start = i4, ch = "\\";
      if (ch === "\\")
        switch (json2[i4 + 1]) {
          case "u":
            {
              str += json2.slice(start, i4);
              let code = json2.substr(i4 + 2, 4);
              switch (code) {
                case "0000":
                  str += "\\0";
                  break;
                case "0007":
                  str += "\\a";
                  break;
                case "000b":
                  str += "\\v";
                  break;
                case "001b":
                  str += "\\e";
                  break;
                case "0085":
                  str += "\\N";
                  break;
                case "00a0":
                  str += "\\_";
                  break;
                case "2028":
                  str += "\\L";
                  break;
                case "2029":
                  str += "\\P";
                  break;
                default:
                  if (code.substr(0, 2) === "00")
                    str += "\\x" + code.substr(2);
                  else
                    str += json2.substr(i4, 6);
              }
              i4 += 5, start = i4 + 1;
            }
            break;
          case "n":
            if (implicitKey || json2[i4 + 2] === '"' || json2.length < minMultiLineLength)
              i4 += 1;
            else {
              str += json2.slice(start, i4) + `

`;
              while (json2[i4 + 2] === "\\" && json2[i4 + 3] === "n" && json2[i4 + 4] !== '"')
                str += `
`, i4 += 2;
              if (str += indent, json2[i4 + 2] === " ")
                str += "\\";
              i4 += 1, start = i4 + 1;
            }
            break;
          default:
            i4 += 1;
        }
    }
    return str = start ? str + json2.slice(start) : json2, implicitKey ? str : foldFlowLines.foldFlowLines(str, indent, foldFlowLines.FOLD_QUOTED, getFoldOptions(ctx, !1));
  }
  function singleQuotedString(value, ctx) {
    if (ctx.options.singleQuote === !1 || ctx.implicitKey && value.includes(`
`) || /[ \t]\n|\n[ \t]/.test(value))
      return doubleQuotedString(value, ctx);
    let indent = ctx.indent || (containsDocumentMarker(value) ? "  " : ""), res = "'" + value.replace(/'/g, "''").replace(/\n+/g, `$&
${indent}`) + "'";
    return ctx.implicitKey ? res : foldFlowLines.foldFlowLines(res, indent, foldFlowLines.FOLD_FLOW, getFoldOptions(ctx, !1));
  }
  function quotedString(value, ctx) {
    let { singleQuote } = ctx.options, qs;
    if (singleQuote === !1)
      qs = doubleQuotedString;
    else {
      let hasDouble = value.includes('"'), hasSingle = value.includes("'");
      if (hasDouble && !hasSingle)
        qs = singleQuotedString;
      else if (hasSingle && !hasDouble)
        qs = doubleQuotedString;
      else
        qs = singleQuote ? singleQuotedString : doubleQuotedString;
    }
    return qs(value, ctx);
  }
  var blockEndNewlines;
  try {
    blockEndNewlines = new RegExp(`(^|(?<!
))
+(?!
|$)`, "g");
  } catch {
    blockEndNewlines = /\n+(?!\n|$)/g;
  }
  function blockString({ comment, type, value }, ctx, onComment, onChompKeep) {
    let { blockQuote, commentString, lineWidth: lineWidth2 } = ctx.options;
    if (!blockQuote || /\n[\t ]+$/.test(value))
      return quotedString(value, ctx);
    let indent = ctx.indent || (ctx.forceBlockIndent || containsDocumentMarker(value) ? "  " : ""), literal2 = blockQuote === "literal" ? !0 : blockQuote === "folded" || type === Scalar.Scalar.BLOCK_FOLDED ? !1 : type === Scalar.Scalar.BLOCK_LITERAL ? !0 : !lineLengthOverLimit(value, lineWidth2, indent.length);
    if (!value)
      return literal2 ? `|
` : `>
`;
    let chomp, endStart;
    for (endStart = value.length;endStart > 0; --endStart) {
      let ch = value[endStart - 1];
      if (ch !== `
` && ch !== "\t" && ch !== " ")
        break;
    }
    let end = value.substring(endStart), endNlPos = end.indexOf(`
`);
    if (endNlPos === -1)
      chomp = "-";
    else if (value === end || endNlPos !== end.length - 1) {
      if (chomp = "+", onChompKeep)
        onChompKeep();
    } else
      chomp = "";
    if (end) {
      if (value = value.slice(0, -end.length), end[end.length - 1] === `
`)
        end = end.slice(0, -1);
      end = end.replace(blockEndNewlines, `$&${indent}`);
    }
    let startWithSpace = !1, startEnd, startNlPos = -1;
    for (startEnd = 0;startEnd < value.length; ++startEnd) {
      let ch = value[startEnd];
      if (ch === " ")
        startWithSpace = !0;
      else if (ch === `
`)
        startNlPos = startEnd;
      else
        break;
    }
    let start = value.substring(0, startNlPos < startEnd ? startNlPos + 1 : startEnd);
    if (start)
      value = value.substring(start.length), start = start.replace(/\n+/g, `$&${indent}`);
    let header = (startWithSpace ? indent ? "2" : "1" : "") + chomp;
    if (comment) {
      if (header += " " + commentString(comment.replace(/ ?[\r\n]+/g, " ")), onComment)
        onComment();
    }
    if (!literal2) {
      let foldedValue = value.replace(/\n+/g, `
$&`).replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2").replace(/\n+/g, `$&${indent}`), literalFallback = !1, foldOptions = getFoldOptions(ctx, !0);
      if (blockQuote !== "folded" && type !== Scalar.Scalar.BLOCK_FOLDED)
        foldOptions.onOverflow = () => {
          literalFallback = !0;
        };
      let body = foldFlowLines.foldFlowLines(`${start}${foldedValue}${end}`, indent, foldFlowLines.FOLD_BLOCK, foldOptions);
      if (!literalFallback)
        return `>${header}
${indent}${body}`;
    }
    return value = value.replace(/\n+/g, `$&${indent}`), `|${header}
${indent}${start}${value}${end}`;
  }
  function plainString(item, ctx, onComment, onChompKeep) {
    let { type, value } = item, { actualString, implicitKey, indent, indentStep, inFlow } = ctx;
    if (implicitKey && value.includes(`
`) || inFlow && /[[\]{},]/.test(value))
      return quotedString(value, ctx);
    if (/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(value))
      return implicitKey || inFlow || !value.includes(`
`) ? quotedString(value, ctx) : blockString(item, ctx, onComment, onChompKeep);
    if (!implicitKey && !inFlow && type !== Scalar.Scalar.PLAIN && value.includes(`
`))
      return blockString(item, ctx, onComment, onChompKeep);
    if (containsDocumentMarker(value)) {
      if (indent === "")
        return ctx.forceBlockIndent = !0, blockString(item, ctx, onComment, onChompKeep);
      else if (implicitKey && indent === indentStep)
        return quotedString(value, ctx);
    }
    let str = value.replace(/\n+/g, `$&
${indent}`);
    if (actualString) {
      let test2 = (tag) => tag.default && tag.tag !== "tag:yaml.org,2002:str" && tag.test?.test(str), { compat: compat2, tags } = ctx.doc.schema;
      if (tags.some(test2) || compat2?.some(test2))
        return quotedString(value, ctx);
    }
    return implicitKey ? str : foldFlowLines.foldFlowLines(str, indent, foldFlowLines.FOLD_FLOW, getFoldOptions(ctx, !1));
  }
  function stringifyString(item, ctx, onComment, onChompKeep) {
    let { implicitKey, inFlow } = ctx, ss = typeof item.value === "string" ? item : Object.assign({}, item, { value: String(item.value) }), { type } = item;
    if (type !== Scalar.Scalar.QUOTE_DOUBLE) {
      if (/[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(ss.value))
        type = Scalar.Scalar.QUOTE_DOUBLE;
    }
    let _stringify = (_type) => {
      switch (_type) {
        case Scalar.Scalar.BLOCK_FOLDED:
        case Scalar.Scalar.BLOCK_LITERAL:
          return implicitKey || inFlow ? quotedString(ss.value, ctx) : blockString(ss, ctx, onComment, onChompKeep);
        case Scalar.Scalar.QUOTE_DOUBLE:
          return doubleQuotedString(ss.value, ctx);
        case Scalar.Scalar.QUOTE_SINGLE:
          return singleQuotedString(ss.value, ctx);
        case Scalar.Scalar.PLAIN:
          return plainString(ss, ctx, onComment, onChompKeep);
        default:
          return null;
      }
    }, res = _stringify(type);
    if (res === null) {
      let { defaultKeyType, defaultStringType } = ctx.options, t2 = implicitKey && defaultKeyType || defaultStringType;
      if (res = _stringify(t2), res === null)
        throw Error(`Unsupported default string type ${t2}`);
    }
    return res;
  }
  exports.stringifyString = stringifyString;
});
