// var: require_compose_collection
var require_compose_collection = __commonJS((exports) => {
  var identity16 = require_identity(), Scalar = require_Scalar(), YAMLMap = require_YAMLMap(), YAMLSeq = require_YAMLSeq(), resolveBlockMap = require_resolve_block_map(), resolveBlockSeq = require_resolve_block_seq(), resolveFlowCollection = require_resolve_flow_collection();
  function resolveCollection(CN, ctx, token, onError, tagName, tag) {
    let coll = token.type === "block-map" ? resolveBlockMap.resolveBlockMap(CN, ctx, token, onError, tag) : token.type === "block-seq" ? resolveBlockSeq.resolveBlockSeq(CN, ctx, token, onError, tag) : resolveFlowCollection.resolveFlowCollection(CN, ctx, token, onError, tag), Coll = coll.constructor;
    if (tagName === "!" || tagName === Coll.tagName)
      return coll.tag = Coll.tagName, coll;
    if (tagName)
      coll.tag = tagName;
    return coll;
  }
  function composeCollection(CN, ctx, token, props, onError) {
    let tagToken = props.tag, tagName = !tagToken ? null : ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg));
    if (token.type === "block-seq") {
      let { anchor, newlineAfterProp: nl } = props, lastProp = anchor && tagToken ? anchor.offset > tagToken.offset ? anchor : tagToken : anchor ?? tagToken;
      if (lastProp && (!nl || nl.offset < lastProp.offset))
        onError(lastProp, "MISSING_CHAR", "Missing newline after block sequence props");
    }
    let expType = token.type === "block-map" ? "map" : token.type === "block-seq" ? "seq" : token.start.source === "{" ? "map" : "seq";
    if (!tagToken || !tagName || tagName === "!" || tagName === YAMLMap.YAMLMap.tagName && expType === "map" || tagName === YAMLSeq.YAMLSeq.tagName && expType === "seq")
      return resolveCollection(CN, ctx, token, onError, tagName);
    let tag = ctx.schema.tags.find((t2) => t2.tag === tagName && t2.collection === expType);
    if (!tag) {
      let kt = ctx.schema.knownTags[tagName];
      if (kt?.collection === expType)
        ctx.schema.tags.push(Object.assign({}, kt, { default: !1 })), tag = kt;
      else {
        if (kt)
          onError(tagToken, "BAD_COLLECTION_TYPE", `${kt.tag} used for ${expType} collection, but expects ${kt.collection ?? "scalar"}`, !0);
        else
          onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, !0);
        return resolveCollection(CN, ctx, token, onError, tagName);
      }
    }
    let coll = resolveCollection(CN, ctx, token, onError, tagName, tag), res = tag.resolve?.(coll, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg), ctx.options) ?? coll, node = identity16.isNode(res) ? res : new Scalar.Scalar(res);
    if (node.range = coll.range, node.tag = tagName, tag?.format)
      node.format = tag.format;
    return node;
  }
  exports.composeCollection = composeCollection;
});

// node_modules/yaml/dist/compose/resolve-block-scalar.js
var require_resolve_block_scalar = __commonJS((exports) => {
  var Scalar = require_Scalar();
  function resolveBlockScalar(ctx, scalar, onError) {
    let start = scalar.offset, header = parseBlockScalarHeader(scalar, ctx.options.strict, onError);
    if (!header)
      return { value: "", type: null, comment: "", range: [start, start, start] };
    let type = header.mode === ">" ? Scalar.Scalar.BLOCK_FOLDED : Scalar.Scalar.BLOCK_LITERAL, lines = scalar.source ? splitLines(scalar.source) : [], chompStart = lines.length;
    for (let i4 = lines.length - 1;i4 >= 0; --i4) {
      let content = lines[i4][1];
      if (content === "" || content === "\r")
        chompStart = i4;
      else
        break;
    }
    if (chompStart === 0) {
      let value2 = header.chomp === "+" && lines.length > 0 ? `
`.repeat(Math.max(1, lines.length - 1)) : "", end2 = start + header.length;
      if (scalar.source)
        end2 += scalar.source.length;
      return { value: value2, type, comment: header.comment, range: [start, end2, end2] };
    }
    let trimIndent = scalar.indent + header.indent, offset = scalar.offset + header.length, contentStart = 0;
    for (let i4 = 0;i4 < chompStart; ++i4) {
      let [indent, content] = lines[i4];
      if (content === "" || content === "\r") {
        if (header.indent === 0 && indent.length > trimIndent)
          trimIndent = indent.length;
      } else {
        if (indent.length < trimIndent)
          onError(offset + indent.length, "MISSING_CHAR", "Block scalars with more-indented leading empty lines must use an explicit indentation indicator");
        if (header.indent === 0)
          trimIndent = indent.length;
        if (contentStart = i4, trimIndent === 0 && !ctx.atRoot)
          onError(offset, "BAD_INDENT", "Block scalar values in collections must be indented");
        break;
      }
      offset += indent.length + content.length + 1;
    }
    for (let i4 = lines.length - 1;i4 >= chompStart; --i4)
      if (lines[i4][0].length > trimIndent)
        chompStart = i4 + 1;
    let value = "", sep7 = "", prevMoreIndented = !1;
    for (let i4 = 0;i4 < contentStart; ++i4)
      value += lines[i4][0].slice(trimIndent) + `
`;
    for (let i4 = contentStart;i4 < chompStart; ++i4) {
      let [indent, content] = lines[i4];
      offset += indent.length + content.length + 1;
      let crlf = content[content.length - 1] === "\r";
      if (crlf)
        content = content.slice(0, -1);
      if (content && indent.length < trimIndent) {
        let message = `Block scalar lines must not be less indented than their ${header.indent ? "explicit indentation indicator" : "first line"}`;
        onError(offset - content.length - (crlf ? 2 : 1), "BAD_INDENT", message), indent = "";
      }
      if (type === Scalar.Scalar.BLOCK_LITERAL)
        value += sep7 + indent.slice(trimIndent) + content, sep7 = `
`;
      else if (indent.length > trimIndent || content[0] === "\t") {
        if (sep7 === " ")
          sep7 = `
`;
        else if (!prevMoreIndented && sep7 === `
`)
          sep7 = `

`;
        value += sep7 + indent.slice(trimIndent) + content, sep7 = `
`, prevMoreIndented = !0;
      } else if (content === "")
        if (sep7 === `
`)
          value += `
`;
        else
          sep7 = `
`;
      else
        value += sep7 + content, sep7 = " ", prevMoreIndented = !1;
    }
    switch (header.chomp) {
      case "-":
        break;
      case "+":
        for (let i4 = chompStart;i4 < lines.length; ++i4)
          value += `
` + lines[i4][0].slice(trimIndent);
        if (value[value.length - 1] !== `
`)
          value += `
`;
        break;
      default:
        value += `
`;
    }
    let end = start + header.length + scalar.source.length;
    return { value, type, comment: header.comment, range: [start, end, end] };
  }
  function parseBlockScalarHeader({ offset, props }, strict, onError) {
    if (props[0].type !== "block-scalar-header")
      return onError(props[0], "IMPOSSIBLE", "Block scalar header not found"), null;
    let { source } = props[0], mode = source[0], indent = 0, chomp = "", error44 = -1;
    for (let i4 = 1;i4 < source.length; ++i4) {
      let ch = source[i4];
      if (!chomp && (ch === "-" || ch === "+"))
        chomp = ch;
      else {
        let n5 = Number(ch);
        if (!indent && n5)
          indent = n5;
        else if (error44 === -1)
          error44 = offset + i4;
      }
    }
    if (error44 !== -1)
      onError(error44, "UNEXPECTED_TOKEN", `Block scalar header includes extra characters: ${source}`);
    let hasSpace = !1, comment = "", length = source.length;
    for (let i4 = 1;i4 < props.length; ++i4) {
      let token = props[i4];
      switch (token.type) {
        case "space":
          hasSpace = !0;
        case "newline":
          length += token.source.length;
          break;
        case "comment":
          if (strict && !hasSpace)
            onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
          length += token.source.length, comment = token.source.substring(1);
          break;
        case "error":
          onError(token, "UNEXPECTED_TOKEN", token.message), length += token.source.length;
          break;
        default: {
          let message = `Unexpected token in block scalar header: ${token.type}`;
          onError(token, "UNEXPECTED_TOKEN", message);
          let ts = token.source;
          if (ts && typeof ts === "string")
            length += ts.length;
        }
      }
    }
    return { mode, indent, chomp, comment, length };
  }
  function splitLines(source) {
    let split = source.split(/\n( *)/), first = split[0], m4 = first.match(/^( *)/), lines = [m4?.[1] ? [m4[1], first.slice(m4[1].length)] : ["", first]];
    for (let i4 = 1;i4 < split.length; i4 += 2)
      lines.push([split[i4], split[i4 + 1]]);
    return lines;
  }
  exports.resolveBlockScalar = resolveBlockScalar;
});

// node_modules/yaml/dist/compose/resolve-flow-scalar.js
var require_resolve_flow_scalar = __commonJS((exports) => {
  var Scalar = require_Scalar(), resolveEnd = require_resolve_end();
  function resolveFlowScalar(scalar, strict, onError) {
    let { offset, type, source, end } = scalar, _type, value, _onError = (rel, code, msg) => onError(offset + rel, code, msg);
    switch (type) {
      case "scalar":
        _type = Scalar.Scalar.PLAIN, value = plainValue(source, _onError);
        break;
      case "single-quoted-scalar":
        _type = Scalar.Scalar.QUOTE_SINGLE, value = singleQuotedValue(source, _onError);
        break;
      case "double-quoted-scalar":
        _type = Scalar.Scalar.QUOTE_DOUBLE, value = doubleQuotedValue(source, _onError);
        break;
      default:
        return onError(scalar, "UNEXPECTED_TOKEN", `Expected a flow scalar value, but found: ${type}`), {
          value: "",
          type: null,
          comment: "",
          range: [offset, offset + source.length, offset + source.length]
        };
    }
    let valueEnd = offset + source.length, re = resolveEnd.resolveEnd(end, valueEnd, strict, onError);
    return {
      value,
      type: _type,
      comment: re.comment,
      range: [offset, valueEnd, re.offset]
    };
  }
  function plainValue(source, onError) {
    let badChar = "";
    switch (source[0]) {
      case "\t":
        badChar = "a tab character";
        break;
      case ",":
        badChar = "flow indicator character ,";
        break;
      case "%":
        badChar = "directive indicator character %";
        break;
      case "|":
      case ">": {
        badChar = `block scalar indicator ${source[0]}`;
        break;
      }
      case "@":
      case "`": {
        badChar = `reserved character ${source[0]}`;
        break;
      }
    }
    if (badChar)
      onError(0, "BAD_SCALAR_START", `Plain value cannot start with ${badChar}`);
    return foldLines(source);
  }
  function singleQuotedValue(source, onError) {
    if (source[source.length - 1] !== "'" || source.length === 1)
      onError(source.length, "MISSING_CHAR", "Missing closing 'quote");
    return foldLines(source.slice(1, -1)).replace(/''/g, "'");
  }
  function foldLines(source) {
    let first, line;
    try {
      first = new RegExp(`(.*?)(?<![ 	])[ 	]*\r?
`, "sy"), line = new RegExp(`[ 	]*(.*?)(?:(?<![ 	])[ 	]*)?\r?
`, "sy");
    } catch {
      first = /(.*?)[ \t]*\r?\n/sy, line = /[ \t]*(.*?)[ \t]*\r?\n/sy;
    }
    let match = first.exec(source);
    if (!match)
      return source;
    let res = match[1], sep7 = " ", pos = first.lastIndex;
    line.lastIndex = pos;
    while (match = line.exec(source)) {
      if (match[1] === "")
        if (sep7 === `
`)
          res += sep7;
        else
          sep7 = `
`;
      else
        res += sep7 + match[1], sep7 = " ";
      pos = line.lastIndex;
    }
    let last2 = /[ \t]*(.*)/sy;
    return last2.lastIndex = pos, match = last2.exec(source), res + sep7 + (match?.[1] ?? "");
  }
  function doubleQuotedValue(source, onError) {
    let res = "";
    for (let i4 = 1;i4 < source.length - 1; ++i4) {
      let ch = source[i4];
      if (ch === "\r" && source[i4 + 1] === `
`)
        continue;
      if (ch === `
`) {
        let { fold, offset } = foldNewline(source, i4);
        res += fold, i4 = offset;
      } else if (ch === "\\") {
        let next = source[++i4], cc = escapeCodes[next];
        if (cc)
          res += cc;
        else if (next === `
`) {
          next = source[i4 + 1];
          while (next === " " || next === "\t")
            next = source[++i4 + 1];
        } else if (next === "\r" && source[i4 + 1] === `
`) {
          next = source[++i4 + 1];
          while (next === " " || next === "\t")
            next = source[++i4 + 1];
        } else if (next === "x" || next === "u" || next === "U") {
          let length = { x: 2, u: 4, U: 8 }[next];
          res += parseCharCode(source, i4 + 1, length, onError), i4 += length;
        } else {
          let raw = source.substr(i4 - 1, 2);
          onError(i4 - 1, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`), res += raw;
        }
      } else if (ch === " " || ch === "\t") {
        let wsStart = i4, next = source[i4 + 1];
        while (next === " " || next === "\t")
          next = source[++i4 + 1];
        if (next !== `
` && !(next === "\r" && source[i4 + 2] === `
`))
          res += i4 > wsStart ? source.slice(wsStart, i4 + 1) : ch;
      } else
        res += ch;
    }
    if (source[source.length - 1] !== '"' || source.length === 1)
      onError(source.length, "MISSING_CHAR", 'Missing closing "quote');
    return res;
  }
  function foldNewline(source, offset) {
    let fold = "", ch = source[offset + 1];
    while (ch === " " || ch === "\t" || ch === `
` || ch === "\r") {
      if (ch === "\r" && source[offset + 2] !== `
`)
        break;
      if (ch === `
`)
        fold += `
`;
      offset += 1, ch = source[offset + 1];
    }
    if (!fold)
      fold = " ";
    return { fold, offset };
  }
  var escapeCodes = {
    "0": "\x00",
    a: "\x07",
    b: "\b",
    e: "\x1B",
    f: "\f",
    n: `
`,
    r: "\r",
    t: "\t",
    v: "\v",
    N: "\x85",
    _: "\xA0",
    L: "\u2028",
    P: "\u2029",
    " ": " ",
    '"': '"',
    "/": "/",
    "\\": "\\",
    "\t": "\t"
  };
  function parseCharCode(source, offset, length, onError) {
    let cc = source.substr(offset, length), code = cc.length === length && /^[0-9a-fA-F]+$/.test(cc) ? parseInt(cc, 16) : NaN;
    if (isNaN(code)) {
      let raw = source.substr(offset - 2, length + 2);
      return onError(offset - 2, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`), raw;
    }
    return String.fromCodePoint(code);
  }
  exports.resolveFlowScalar = resolveFlowScalar;
});

// node_modules/yaml/dist/compose/compose-scalar.js
var require_compose_scalar = __commonJS((exports) => {
  var identity16 = require_identity(), Scalar = require_Scalar(), resolveBlockScalar = require_resolve_block_scalar(), resolveFlowScalar = require_resolve_flow_scalar();
  function composeScalar(ctx, token, tagToken, onError) {
    let { value, type, comment, range } = token.type === "block-scalar" ? resolveBlockScalar.resolveBlockScalar(ctx, token, onError) : resolveFlowScalar.resolveFlowScalar(token, ctx.options.strict, onError), tagName = tagToken ? ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg)) : null, tag;
    if (ctx.options.stringKeys && ctx.atKey)
      tag = ctx.schema[identity16.SCALAR];
    else if (tagName)
      tag = findScalarTagByName(ctx.schema, value, tagName, tagToken, onError);
    else if (token.type === "scalar")
      tag = findScalarTagByTest(ctx, value, token, onError);
    else
      tag = ctx.schema[identity16.SCALAR];
    let scalar;
    try {
      let res = tag.resolve(value, (msg) => onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg), ctx.options);
      scalar = identity16.isScalar(res) ? res : new Scalar.Scalar(res);
    } catch (error44) {
      let msg = error44 instanceof Error ? error44.message : String(error44);
      onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg), scalar = new Scalar.Scalar(value);
    }
    if (scalar.range = range, scalar.source = value, type)
      scalar.type = type;
    if (tagName)
      scalar.tag = tagName;
    if (tag.format)
      scalar.format = tag.format;
    if (comment)
      scalar.comment = comment;
    return scalar;
  }
  function findScalarTagByName(schema5, value, tagName, tagToken, onError) {
    if (tagName === "!")
      return schema5[identity16.SCALAR];
    let matchWithTest = [];
    for (let tag of schema5.tags)
      if (!tag.collection && tag.tag === tagName)
        if (tag.default && tag.test)
          matchWithTest.push(tag);
        else
          return tag;
    for (let tag of matchWithTest)
      if (tag.test?.test(value))
        return tag;
    let kt = schema5.knownTags[tagName];
    if (kt && !kt.collection)
      return schema5.tags.push(Object.assign({}, kt, { default: !1, test: void 0 })), kt;
    return onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, tagName !== "tag:yaml.org,2002:str"), schema5[identity16.SCALAR];
  }
  function findScalarTagByTest({ atKey, directives, schema: schema5 }, value, token, onError) {
    let tag = schema5.tags.find((tag2) => (tag2.default === !0 || atKey && tag2.default === "key") && tag2.test?.test(value)) || schema5[identity16.SCALAR];
    if (schema5.compat) {
      let compat2 = schema5.compat.find((tag2) => tag2.default && tag2.test?.test(value)) ?? schema5[identity16.SCALAR];
      if (tag.tag !== compat2.tag) {
        let ts = directives.tagString(tag.tag), cs = directives.tagString(compat2.tag), msg = `Value may be parsed as either ${ts} or ${cs}`;
        onError(token, "TAG_RESOLVE_FAILED", msg, !0);
      }
    }
    return tag;
  }
  exports.composeScalar = composeScalar;
});

// node_modules/yaml/dist/compose/util-empty-scalar-position.js
var require_util_empty_scalar_position = __commonJS((exports) => {
  function emptyScalarPosition(offset, before, pos) {
    if (before) {
      pos ?? (pos = before.length);
      for (let i4 = pos - 1;i4 >= 0; --i4) {
        let st = before[i4];
        switch (st.type) {
          case "space":
          case "comment":
          case "newline":
            offset -= st.source.length;
            continue;
        }
        st = before[++i4];
        while (st?.type === "space")
          offset += st.source.length, st = before[++i4];
        break;
      }
    }
    return offset;
  }
  exports.emptyScalarPosition = emptyScalarPosition;
});

// node_modules/yaml/dist/compose/compose-node.js
var require_compose_node = __commonJS((exports) => {
  var Alias = require_Alias(), identity16 = require_identity(), composeCollection = require_compose_collection(), composeScalar = require_compose_scalar(), resolveEnd = require_resolve_end(), utilEmptyScalarPosition = require_util_empty_scalar_position(), CN = { composeNode, composeEmptyNode };
  function composeNode(ctx, token, props, onError) {
    let atKey = ctx.atKey, { spaceBefore, comment, anchor, tag } = props, node, isSrcToken = !0;
    switch (token.type) {
      case "alias":
        if (node = composeAlias(ctx, token, onError), anchor || tag)
          onError(token, "ALIAS_PROPS", "An alias node must not specify any properties");
        break;
      case "scalar":
      case "single-quoted-scalar":
      case "double-quoted-scalar":
      case "block-scalar":
        if (node = composeScalar.composeScalar(ctx, token, tag, onError), anchor)
          node.anchor = anchor.source.substring(1);
        break;
      case "block-map":
      case "block-seq":
      case "flow-collection":
        try {
          if (node = composeCollection.composeCollection(CN, ctx, token, props, onError), anchor)
            node.anchor = anchor.source.substring(1);
        } catch (error44) {
          let message = error44 instanceof Error ? error44.message : String(error44);
          onError(token, "RESOURCE_EXHAUSTION", message);
        }
        break;
      default: {
        let message = token.type === "error" ? token.message : `Unsupported token (type: ${token.type})`;
        onError(token, "UNEXPECTED_TOKEN", message), isSrcToken = !1;
      }
    }
    if (node ?? (node = composeEmptyNode(ctx, token.offset, void 0, null, props, onError)), anchor && node.anchor === "")
      onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
    if (atKey && ctx.options.stringKeys && (!identity16.isScalar(node) || typeof node.value !== "string" || node.tag && node.tag !== "tag:yaml.org,2002:str"))
      onError(tag ?? token, "NON_STRING_KEY", "With stringKeys, all keys must be strings");
    if (spaceBefore)
      node.spaceBefore = !0;
    if (comment)
      if (token.type === "scalar" && token.source === "")
        node.comment = comment;
      else
        node.commentBefore = comment;
    if (ctx.options.keepSourceTokens && isSrcToken)
      node.srcToken = token;
    return node;
  }
  function composeEmptyNode(ctx, offset, before, pos, { spaceBefore, comment, anchor, tag, end }, onError) {
    let token = {
      type: "scalar",
      offset: utilEmptyScalarPosition.emptyScalarPosition(offset, before, pos),
      indent: -1,
      source: ""
    }, node = composeScalar.composeScalar(ctx, token, tag, onError);
    if (anchor) {
      if (node.anchor = anchor.source.substring(1), node.anchor === "")
        onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
    }
    if (spaceBefore)
      node.spaceBefore = !0;
    if (comment)
      node.comment = comment, node.range[2] = end;
    return node;
  }
  function composeAlias({ options }, { offset, source, end }, onError) {
    let alias = new Alias.Alias(source.substring(1));
    if (alias.source === "")
      onError(offset, "BAD_ALIAS", "Alias cannot be an empty string");
    if (alias.source.endsWith(":"))
      onError(offset + source.length - 1, "BAD_ALIAS", "Alias ending in : is ambiguous", !0);
    let valueEnd = offset + source.length, re = resolveEnd.resolveEnd(end, valueEnd, options.strict, onError);
    if (alias.range = [offset, valueEnd, re.offset], re.comment)
      alias.comment = re.comment;
    return alias;
  }
  exports.composeEmptyNode = composeEmptyNode;
  exports.composeNode = composeNode;
});

// node_modules/yaml/dist/compose/compose-doc.js
var require_compose_doc = __commonJS((exports) => {
  var Document = require_Document(), composeNode = require_compose_node(), resolveEnd = require_resolve_end(), resolveProps = require_resolve_props();
  function composeDoc(options, directives, { offset, start, value, end }, onError) {
    let opts = Object.assign({ _directives: directives }, options), doc2 = new Document.Document(void 0, opts), ctx = {
      atKey: !1,
      atRoot: !0,
      directives: doc2.directives,
      options: doc2.options,
      schema: doc2.schema
    }, props = resolveProps.resolveProps(start, {
      indicator: "doc-start",
      next: value ?? end?.[0],
      offset,
      onError,
      parentIndent: 0,
      startOnNewline: !0
    });
    if (props.found) {
      if (doc2.directives.docStart = !0, value && (value.type === "block-map" || value.type === "block-seq") && !props.hasNewline)
        onError(props.end, "MISSING_CHAR", "Block collection cannot start on same line with directives-end marker");
    }
    doc2.contents = value ? composeNode.composeNode(ctx, value, props, onError) : composeNode.composeEmptyNode(ctx, props.end, start, null, props, onError);
    let contentEnd = doc2.contents.range[2], re = resolveEnd.resolveEnd(end, contentEnd, !1, onError);
    if (re.comment)
      doc2.comment = re.comment;
    return doc2.range = [offset, contentEnd, re.offset], doc2;
  }
  exports.composeDoc = composeDoc;
});

// node_modules/yaml/dist/compose/composer.js
var require_composer = __commonJS((exports) => {
  var node_process = __require("process"), directives = require_directives(), Document = require_Document(), errors6 = require_errors6(), identity16 = require_identity(), composeDoc = require_compose_doc(), resolveEnd = require_resolve_end();
  function getErrorPos(src) {
    if (typeof src === "number")
      return [src, src + 1];
    if (Array.isArray(src))
      return src.length === 2 ? src : [src[0], src[1]];
    let { offset, source } = src;
    return [offset, offset + (typeof source === "string" ? source.length : 1)];
  }
  function parsePrelude(prelude) {
    let comment = "", atComment = !1, afterEmptyLine = !1;
    for (let i4 = 0;i4 < prelude.length; ++i4) {
      let source = prelude[i4];
      switch (source[0]) {
        case "#":
          comment += (comment === "" ? "" : afterEmptyLine ? `

` : `
`) + (source.substring(1) || " "), atComment = !0, afterEmptyLine = !1;
          break;
        case "%":
          if (prelude[i4 + 1]?.[0] !== "#")
            i4 += 1;
          atComment = !1;
          break;
        default:
          if (!atComment)
            afterEmptyLine = !0;
          atComment = !1;
      }
    }
    return { comment, afterEmptyLine };
  }

  class Composer {
    constructor(options = {}) {
      this.doc = null, this.atDirectives = !1, this.prelude = [], this.errors = [], this.warnings = [], this.onError = (source, code, message, warning) => {
        let pos = getErrorPos(source);
        if (warning)
          this.warnings.push(new errors6.YAMLWarning(pos, code, message));
        else
          this.errors.push(new errors6.YAMLParseError(pos, code, message));
      }, this.directives = new directives.Directives({ version: options.version || "1.2" }), this.options = options;
    }
    decorate(doc2, afterDoc) {
      let { comment, afterEmptyLine } = parsePrelude(this.prelude);
      if (comment) {
        let dc = doc2.contents;
        if (afterDoc)
          doc2.comment = doc2.comment ? `${doc2.comment}
${comment}` : comment;
        else if (afterEmptyLine || doc2.directives.docStart || !dc)
          doc2.commentBefore = comment;
        else if (identity16.isCollection(dc) && !dc.flow && dc.items.length > 0) {
          let it = dc.items[0];
          if (identity16.isPair(it))
            it = it.key;
          let cb = it.commentBefore;
          it.commentBefore = cb ? `${comment}
${cb}` : comment;
        } else {
          let cb = dc.commentBefore;
          dc.commentBefore = cb ? `${comment}
${cb}` : comment;
        }
      }
      if (afterDoc)
        Array.prototype.push.apply(doc2.errors, this.errors), Array.prototype.push.apply(doc2.warnings, this.warnings);
      else
        doc2.errors = this.errors, doc2.warnings = this.warnings;
      this.prelude = [], this.errors = [], this.warnings = [];
    }
    streamInfo() {
      return {
        comment: parsePrelude(this.prelude).comment,
        directives: this.directives,
        errors: this.errors,
        warnings: this.warnings
      };
    }
    *compose(tokens, forceDoc = !1, endOffset = -1) {
      for (let token of tokens)
        yield* this.next(token);
      yield* this.end(forceDoc, endOffset);
    }
    *next(token) {
      if (node_process.env.LOG_STREAM)
        console.dir(token, { depth: null });
      switch (token.type) {
        case "directive":
          this.directives.add(token.source, (offset, message, warning) => {
            let pos = getErrorPos(token);
            pos[0] += offset, this.onError(pos, "BAD_DIRECTIVE", message, warning);
          }), this.prelude.push(token.source), this.atDirectives = !0;
          break;
        case "document": {
          let doc2 = composeDoc.composeDoc(this.options, this.directives, token, this.onError);
          if (this.atDirectives && !doc2.directives.docStart)
            this.onError(token, "MISSING_CHAR", "Missing directives-end/doc-start indicator line");
          if (this.decorate(doc2, !1), this.doc)
            yield this.doc;
          this.doc = doc2, this.atDirectives = !1;
          break;
        }
        case "byte-order-mark":
        case "space":
          break;
        case "comment":
        case "newline":
          this.prelude.push(token.source);
          break;
        case "error": {
          let msg = token.source ? `${token.message}: ${JSON.stringify(token.source)}` : token.message, error44 = new errors6.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg);
          if (this.atDirectives || !this.doc)
            this.errors.push(error44);
          else
            this.doc.errors.push(error44);
          break;
        }
        case "doc-end": {
          if (!this.doc) {
            this.errors.push(new errors6.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", "Unexpected doc-end without preceding document"));
            break;
          }
          this.doc.directives.docEnd = !0;
          let end = resolveEnd.resolveEnd(token.end, token.offset + token.source.length, this.doc.options.strict, this.onError);
          if (this.decorate(this.doc, !0), end.comment) {
            let dc = this.doc.comment;
            this.doc.comment = dc ? `${dc}
${end.comment}` : end.comment;
          }
          this.doc.range[2] = end.offset;
          break;
        }
        default:
          this.errors.push(new errors6.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", `Unsupported token ${token.type}`));
      }
    }
    *end(forceDoc = !1, endOffset = -1) {
      if (this.doc)
        this.decorate(this.doc, !0), yield this.doc, this.doc = null;
      else if (forceDoc) {
        let opts = Object.assign({ _directives: this.directives }, this.options), doc2 = new Document.Document(void 0, opts);
        if (this.atDirectives)
          this.onError(endOffset, "MISSING_CHAR", "Missing directives-end indicator line");
        doc2.range = [0, endOffset, endOffset], this.decorate(doc2, !1), yield doc2;
      }
    }
  }
  exports.Composer = Composer;
});

// node_modules/yaml/dist/parse/cst-scalar.js
var require_cst_scalar = __commonJS((exports) => {
  var resolveBlockScalar = require_resolve_block_scalar(), resolveFlowScalar = require_resolve_flow_scalar(), errors6 = require_errors6(), stringifyString = require_stringifyString();
  function resolveAsScalar(token, strict = !0, onError) {
    if (token) {
      let _onError = (pos, code, message) => {
        let offset = typeof pos === "number" ? pos : Array.isArray(pos) ? pos[0] : pos.offset;
        if (onError)
          onError(offset, code, message);
        else
          throw new errors6.YAMLParseError([offset, offset + 1], code, message);
      };
      switch (token.type) {
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
          return resolveFlowScalar.resolveFlowScalar(token, strict, _onError);
        case "block-scalar":
          return resolveBlockScalar.resolveBlockScalar({ options: { strict } }, token, _onError);
      }
    }
    return null;
  }
  function createScalarToken(value, context3) {
    let { implicitKey = !1, indent, inFlow = !1, offset = -1, type = "PLAIN" } = context3, source = stringifyString.stringifyString({ type, value }, {
      implicitKey,
      indent: indent > 0 ? " ".repeat(indent) : "",
      inFlow,
      options: { blockQuote: !0, lineWidth: -1 }
    }), end = context3.end ?? [
      { type: "newline", offset: -1, indent, source: `
` }
    ];
    switch (source[0]) {
      case "|":
      case ">": {
        let he = source.indexOf(`
`), head = source.substring(0, he), body = source.substring(he + 1) + `
`, props = [
          { type: "block-scalar-header", offset, indent, source: head }
        ];
        if (!addEndtoBlockProps(props, end))
          props.push({ type: "newline", offset: -1, indent, source: `
` });
        return { type: "block-scalar", offset, indent, props, source: body };
      }
      case '"':
        return { type: "double-quoted-scalar", offset, indent, source, end };
      case "'":
        return { type: "single-quoted-scalar", offset, indent, source, end };
      default:
        return { type: "scalar", offset, indent, source, end };
    }
  }
  function setScalarValue(token, value, context3 = {}) {
    let { afterKey = !1, implicitKey = !1, inFlow = !1, type } = context3, indent = "indent" in token ? token.indent : null;
    if (afterKey && typeof indent === "number")
      indent += 2;
    if (!type)
      switch (token.type) {
        case "single-quoted-scalar":
          type = "QUOTE_SINGLE";
          break;
        case "double-quoted-scalar":
          type = "QUOTE_DOUBLE";
          break;
        case "block-scalar": {
          let header = token.props[0];
          if (header.type !== "block-scalar-header")
            throw Error("Invalid block scalar header");
          type = header.source[0] === ">" ? "BLOCK_FOLDED" : "BLOCK_LITERAL";
          break;
        }
        default:
          type = "PLAIN";
      }
    let source = stringifyString.stringifyString({ type, value }, {
      implicitKey: implicitKey || indent === null,
      indent: indent !== null && indent > 0 ? " ".repeat(indent) : "",
      inFlow,
      options: { blockQuote: !0, lineWidth: -1 }
    });
    switch (source[0]) {
      case "|":
      case ">":
        setBlockScalarValue(token, source);
        break;
      case '"':
        setFlowScalarValue(token, source, "double-quoted-scalar");
        break;
      case "'":
        setFlowScalarValue(token, source, "single-quoted-scalar");
        break;
      default:
        setFlowScalarValue(token, source, "scalar");
    }
  }
  function setBlockScalarValue(token, source) {
    let he = source.indexOf(`
`), head = source.substring(0, he), body = source.substring(he + 1) + `
`;
    if (token.type === "block-scalar") {
      let header = token.props[0];
      if (header.type !== "block-scalar-header")
        throw Error("Invalid block scalar header");
      header.source = head, token.source = body;
    } else {
      let { offset } = token, indent = "indent" in token ? token.indent : -1, props = [
        { type: "block-scalar-header", offset, indent, source: head }
      ];
      if (!addEndtoBlockProps(props, "end" in token ? token.end : void 0))
        props.push({ type: "newline", offset: -1, indent, source: `
` });
      for (let key of Object.keys(token))
        if (key !== "type" && key !== "offset")
          delete token[key];
      Object.assign(token, { type: "block-scalar", indent, props, source: body });
    }
  }
  function addEndtoBlockProps(props, end) {
    if (end)
      for (let st of end)
        switch (st.type) {
          case "space":
          case "comment":
            props.push(st);
            break;
          case "newline":
            return props.push(st), !0;
        }
    return !1;
  }
  function setFlowScalarValue(token, source, type) {
    switch (token.type) {
      case "scalar":
      case "double-quoted-scalar":
      case "single-quoted-scalar":
        token.type = type, token.source = source;
        break;
      case "block-scalar": {
        let end = token.props.slice(1), oa = source.length;
        if (token.props[0].type === "block-scalar-header")
          oa -= token.props[0].source.length;
        for (let tok of end)
          tok.offset += oa;
        delete token.props, Object.assign(token, { type, source, end });
        break;
      }
      case "block-map":
      case "block-seq": {
        let nl = { type: "newline", offset: token.offset + source.length, indent: token.indent, source: `
` };
        delete token.items, Object.assign(token, { type, source, end: [nl] });
        break;
      }
      default: {
        let indent = "indent" in token ? token.indent : -1, end = "end" in token && Array.isArray(token.end) ? token.end.filter((st) => st.type === "space" || st.type === "comment" || st.type === "newline") : [];
        for (let key of Object.keys(token))
          if (key !== "type" && key !== "offset")
            delete token[key];
        Object.assign(token, { type, indent, source, end });
      }
    }
  }
  exports.createScalarToken = createScalarToken;
  exports.resolveAsScalar = resolveAsScalar;
  exports.setScalarValue = setScalarValue;
});

// node_modules/yaml/dist/parse/cst-stringify.js
var require_cst_stringify = __commonJS((exports) => {
  var stringify2 = (cst) => ("type" in cst) ? stringifyToken(cst) : stringifyItem(cst);
  function stringifyToken(token) {
    switch (token.type) {
      case "block-scalar": {
        let res = "";
        for (let tok of token.props)
          res += stringifyToken(tok);
        return res + token.source;
      }
      case "block-map":
      case "block-seq": {
        let res = "";
        for (let item of token.items)
          res += stringifyItem(item);
        return res;
      }
      case "flow-collection": {
        let res = token.start.source;
        for (let item of token.items)
          res += stringifyItem(item);
        for (let st of token.end)
          res += st.source;
        return res;
      }
      case "document": {
        let res = stringifyItem(token);
        if (token.end)
          for (let st of token.end)
            res += st.source;
        return res;
      }
      default: {
        let res = token.source;
        if ("end" in token && token.end)
          for (let st of token.end)
            res += st.source;
        return res;
      }
    }
  }
  function stringifyItem({ start, key, sep: sep7, value }) {
    let res = "";
    for (let st of start)
      res += st.source;
    if (key)
      res += stringifyToken(key);
    if (sep7)
      for (let st of sep7)
        res += st.source;
    if (value)
      res += stringifyToken(value);
    return res;
  }
  exports.stringify = stringify2;
});

// node_modules/yaml/dist/parse/cst-visit.js
var require_cst_visit = __commonJS((exports) => {
  var BREAK = Symbol("break visit"), SKIP = Symbol("skip children"), REMOVE = Symbol("remove item");
  function visit2(cst, visitor) {
    if ("type" in cst && cst.type === "document")
      cst = { start: cst.start, value: cst.value };
    _visit(Object.freeze([]), cst, visitor);
  }
  visit2.BREAK = BREAK;
  visit2.SKIP = SKIP;
  visit2.REMOVE = REMOVE;
  visit2.itemAtPath = (cst, path12) => {
    let item = cst;
    for (let [field, index] of path12) {
      let tok = item?.[field];
      if (tok && "items" in tok)
        item = tok.items[index];
      else
        return;
    }
    return item;
  };
  visit2.parentCollection = (cst, path12) => {
    let parent = visit2.itemAtPath(cst, path12.slice(0, -1)), field = path12[path12.length - 1][0], coll = parent?.[field];
    if (coll && "items" in coll)
      return coll;
    throw Error("Parent collection not found");
  };
  function _visit(path12, item, visitor) {
    let ctrl = visitor(item, path12);
    if (typeof ctrl === "symbol")
      return ctrl;
    for (let field of ["key", "value"]) {
      let token = item[field];
      if (token && "items" in token) {
        for (let i4 = 0;i4 < token.items.length; ++i4) {
          let ci = _visit(Object.freeze(path12.concat([[field, i4]])), token.items[i4], visitor);
          if (typeof ci === "number")
            i4 = ci - 1;
          else if (ci === BREAK)
            return BREAK;
          else if (ci === REMOVE)
            token.items.splice(i4, 1), i4 -= 1;
        }
        if (typeof ctrl === "function" && field === "key")
          ctrl = ctrl(item, path12);
      }
    }
    return typeof ctrl === "function" ? ctrl(item, path12) : ctrl;
  }
  exports.visit = visit2;
});

// node_modules/yaml/dist/parse/cst.js
var require_cst = __commonJS((exports) => {
  var cstScalar = require_cst_scalar(), cstStringify = require_cst_stringify(), cstVisit = require_cst_visit(), BOM = "\uFEFF", DOCUMENT = "\x02", FLOW_END = "\x18", SCALAR = "\x1F", isCollection = (token) => !!token && ("items" in token), isScalar = (token) => !!token && (token.type === "scalar" || token.type === "single-quoted-scalar" || token.type === "double-quoted-scalar" || token.type === "block-scalar");
  function prettyToken(token) {
    switch (token) {
      case BOM:
        return "<BOM>";
      case DOCUMENT:
        return "<DOC>";
      case FLOW_END:
        return "<FLOW_END>";
      case SCALAR:
        return "<SCALAR>";
      default:
        return JSON.stringify(token);
    }
  }
  function tokenType(source) {
    switch (source) {
      case BOM:
        return "byte-order-mark";
      case DOCUMENT:
        return "doc-mode";
      case FLOW_END:
        return "flow-error-end";
      case SCALAR:
        return "scalar";
      case "---":
        return "doc-start";
      case "...":
        return "doc-end";
      case "":
      case `
`:
      case `\r
`:
        return "newline";
      case "-":
        return "seq-item-ind";
      case "?":
        return "explicit-key-ind";
      case ":":
        return "map-value-ind";
      case "{":
        return "flow-map-start";
      case "}":
        return "flow-map-end";
      case "[":
        return "flow-seq-start";
      case "]":
        return "flow-seq-end";
      case ",":
        return "comma";
    }
    switch (source[0]) {
      case " ":
      case "\t":
        return "space";
      case "#":
        return "comment";
      case "%":
        return "directive-line";
      case "*":
        return "alias";
      case "&":
        return "anchor";
      case "!":
        return "tag";
      case "'":
        return "single-quoted-scalar";
      case '"':
        return "double-quoted-scalar";
      case "|":
      case ">":
        return "block-scalar-header";
    }
    return null;
  }
  exports.createScalarToken = cstScalar.createScalarToken;
  exports.resolveAsScalar = cstScalar.resolveAsScalar;
  exports.setScalarValue = cstScalar.setScalarValue;
  exports.stringify = cstStringify.stringify;
  exports.visit = cstVisit.visit;
  exports.BOM = BOM;
  exports.DOCUMENT = DOCUMENT;
  exports.FLOW_END = FLOW_END;
  exports.SCALAR = SCALAR;
  exports.isCollection = isCollection;
  exports.isScalar = isScalar;
  exports.prettyToken = prettyToken;
  exports.tokenType = tokenType;
});

// node_modules/yaml/dist/parse/lexer.js
var require_lexer = __commonJS((exports) => {
  var cst = require_cst();
  function isEmpty(ch) {
    switch (ch) {
      case void 0:
      case " ":
      case `
`:
      case "\r":
      case "\t":
        return !0;
      default:
        return !1;
    }
  }
  var hexDigits = new Set("0123456789ABCDEFabcdef"), tagChars = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()"), flowIndicatorChars = new Set(",[]{}"), invalidAnchorChars = new Set(` ,[]{}
\r	`), isNotAnchorChar = (ch) => !ch || invalidAnchorChars.has(ch);

  class Lexer {
    constructor() {
      this.atEnd = !1, this.blockScalarIndent = -1, this.blockScalarKeep = !1, this.buffer = "", this.flowKey = !1, this.flowLevel = 0, this.indentNext = 0, this.indentValue = 0, this.lineEndPos = null, this.next = null, this.pos = 0;
    }
    *lex(source, incomplete = !1) {
      if (source) {
        if (typeof source !== "string")
          throw TypeError("source is not a string");
        this.buffer = this.buffer ? this.buffer + source : source, this.lineEndPos = null;
      }
      this.atEnd = !incomplete;
      let next = this.next ?? "stream";
      while (next && (incomplete || this.hasChars(1)))
        next = yield* this.parseNext(next);
    }
    atLineEnd() {
      let i4 = this.pos, ch = this.buffer[i4];
      while (ch === " " || ch === "\t")
        ch = this.buffer[++i4];
      if (!ch || ch === "#" || ch === `
`)
        return !0;
      if (ch === "\r")
        return this.buffer[i4 + 1] === `
`;
      return !1;
    }
    charAt(n5) {
      return this.buffer[this.pos + n5];
    }
    continueScalar(offset) {
      let ch = this.buffer[offset];
      if (this.indentNext > 0) {
        let indent = 0;
        while (ch === " ")
          ch = this.buffer[++indent + offset];
        if (ch === "\r") {
          let next = this.buffer[indent + offset + 1];
          if (next === `
` || !next && !this.atEnd)
            return offset + indent + 1;
        }
        return ch === `
` || indent >= this.indentNext || !ch && !this.atEnd ? offset + indent : -1;
      }
      if (ch === "-" || ch === ".") {
        let dt = this.buffer.substr(offset, 3);
        if ((dt === "---" || dt === "...") && isEmpty(this.buffer[offset + 3]))
          return -1;
      }
      return offset;
    }
    getLine() {
      let end = this.lineEndPos;
      if (typeof end !== "number" || end !== -1 && end < this.pos)
        end = this.buffer.indexOf(`
`, this.pos), this.lineEndPos = end;
      if (end === -1)
        return this.atEnd ? this.buffer.substring(this.pos) : null;
      if (this.buffer[end - 1] === "\r")
        end -= 1;
      return this.buffer.substring(this.pos, end);
    }
    hasChars(n5) {
      return this.pos + n5 <= this.buffer.length;
    }
    setNext(state3) {
      return this.buffer = this.buffer.substring(this.pos), this.pos = 0, this.lineEndPos = null, this.next = state3, null;
    }
    peek(n5) {
      return this.buffer.substr(this.pos, n5);
    }
    *parseNext(next) {
      switch (next) {
        case "stream":
          return yield* this.parseStream();
        case "line-start":
          return yield* this.parseLineStart();
        case "block-start":
          return yield* this.parseBlockStart();
        case "doc":
          return yield* this.parseDocument();
        case "flow":
          return yield* this.parseFlowCollection();
        case "quoted-scalar":
          return yield* this.parseQuotedScalar();
        case "block-scalar":
          return yield* this.parseBlockScalar();
        case "plain-scalar":
          return yield* this.parsePlainScalar();
      }
    }
    *parseStream() {
      let line = this.getLine();
      if (line === null)
        return this.setNext("stream");
      if (line[0] === cst.BOM)
        yield* this.pushCount(1), line = line.substring(1);
      if (line[0] === "%") {
        let dirEnd = line.length, cs = line.indexOf("#");
        while (cs !== -1) {
          let ch = line[cs - 1];
          if (ch === " " || ch === "\t") {
            dirEnd = cs - 1;
            break;
          } else
            cs = line.indexOf("#", cs + 1);
        }
        while (!0) {
          let ch = line[dirEnd - 1];
          if (ch === " " || ch === "\t")
            dirEnd -= 1;
          else
            break;
        }
        let n5 = (yield* this.pushCount(dirEnd)) + (yield* this.pushSpaces(!0));
        return yield* this.pushCount(line.length - n5), this.pushNewline(), "stream";
      }
      if (this.atLineEnd()) {
        let sp = yield* this.pushSpaces(!0);
        return yield* this.pushCount(line.length - sp), yield* this.pushNewline(), "stream";
      }
      return yield cst.DOCUMENT, yield* this.parseLineStart();
    }
    *parseLineStart() {
      let ch = this.charAt(0);
      if (!ch && !this.atEnd)
        return this.setNext("line-start");
      if (ch === "-" || ch === ".") {
        if (!this.atEnd && !this.hasChars(4))
          return this.setNext("line-start");
        let s2 = this.peek(3);
        if ((s2 === "---" || s2 === "...") && isEmpty(this.charAt(3)))
          return yield* this.pushCount(3), this.indentValue = 0, this.indentNext = 0, s2 === "---" ? "doc" : "stream";
      }
      if (this.indentValue = yield* this.pushSpaces(!1), this.indentNext > this.indentValue && !isEmpty(this.charAt(1)))
        this.indentNext = this.indentValue;
      return yield* this.parseBlockStart();
    }
    *parseBlockStart() {
      let [ch0, ch1] = this.peek(2);
      if (!ch1 && !this.atEnd)
        return this.setNext("block-start");
      if ((ch0 === "-" || ch0 === "?" || ch0 === ":") && isEmpty(ch1)) {
        let n5 = (yield* this.pushCount(1)) + (yield* this.pushSpaces(!0));
        return this.indentNext = this.indentValue + 1, this.indentValue += n5, yield* this.parseBlockStart();
      }
      return "doc";
    }
    *parseDocument() {
      yield* this.pushSpaces(!0);
      let line = this.getLine();
      if (line === null)
        return this.setNext("doc");
      let n5 = yield* this.pushIndicators();
      switch (line[n5]) {
        case "#":
          yield* this.pushCount(line.length - n5);
        case void 0:
          return yield* this.pushNewline(), yield* this.parseLineStart();
        case "{":
        case "[":
          return yield* this.pushCount(1), this.flowKey = !1, this.flowLevel = 1, "flow";
        case "}":
        case "]":
          return yield* this.pushCount(1), "doc";
        case "*":
          return yield* this.pushUntil(isNotAnchorChar), "doc";
        case '"':
        case "'":
          return yield* this.parseQuotedScalar();
        case "|":
        case ">":
          return n5 += yield* this.parseBlockScalarHeader(), n5 += yield* this.pushSpaces(!0), yield* this.pushCount(line.length - n5), yield* this.pushNewline(), yield* this.parseBlockScalar();
        default:
          return yield* this.parsePlainScalar();
      }
    }
    *parseFlowCollection() {
      let nl, sp, indent = -1;
      do {
        if (nl = yield* this.pushNewline(), nl > 0)
          sp = yield* this.pushSpaces(!1), this.indentValue = indent = sp;
        else
          sp = 0;
        sp += yield* this.pushSpaces(!0);
      } while (nl + sp > 0);
      let line = this.getLine();
      if (line === null)
        return this.setNext("flow");
      if (indent !== -1 && indent < this.indentNext && line[0] !== "#" || indent === 0 && (line.startsWith("---") || line.startsWith("...")) && isEmpty(line[3])) {
        if (!(indent === this.indentNext - 1 && this.flowLevel === 1 && (line[0] === "]" || line[0] === "}")))
          return this.flowLevel = 0, yield cst.FLOW_END, yield* this.parseLineStart();
      }
      let n5 = 0;
      while (line[n5] === ",")
        n5 += yield* this.pushCount(1), n5 += yield* this.pushSpaces(!0), this.flowKey = !1;
      switch (n5 += yield* this.pushIndicators(), line[n5]) {
        case void 0:
          return "flow";
        case "#":
          return yield* this.pushCount(line.length - n5), "flow";
        case "{":
        case "[":
          return yield* this.pushCount(1), this.flowKey = !1, this.flowLevel += 1, "flow";
        case "}":
        case "]":
          return yield* this.pushCount(1), this.flowKey = !0, this.flowLevel -= 1, this.flowLevel ? "flow" : "doc";
        case "*":
          return yield* this.pushUntil(isNotAnchorChar), "flow";
        case '"':
        case "'":
          return this.flowKey = !0, yield* this.parseQuotedScalar();
        case ":": {
          let next = this.charAt(1);
          if (this.flowKey || isEmpty(next) || next === ",")
            return this.flowKey = !1, yield* this.pushCount(1), yield* this.pushSpaces(!0), "flow";
        }
        default:
          return this.flowKey = !1, yield* this.parsePlainScalar();
      }
    }
    *parseQuotedScalar() {
      let quote = this.charAt(0), end = this.buffer.indexOf(quote, this.pos + 1);
      if (quote === "'")
        while (end !== -1 && this.buffer[end + 1] === "'")
          end = this.buffer.indexOf("'", end + 2);
      else
        while (end !== -1) {
          let n5 = 0;
          while (this.buffer[end - 1 - n5] === "\\")
            n5 += 1;
          if (n5 % 2 === 0)
            break;
          end = this.buffer.indexOf('"', end + 1);
        }
      let qb = this.buffer.substring(0, end), nl = qb.indexOf(`
`, this.pos);
      if (nl !== -1) {
        while (nl !== -1) {
          let cs = this.continueScalar(nl + 1);
          if (cs === -1)
            break;
          nl = qb.indexOf(`
`, cs);
        }
        if (nl !== -1)
          end = nl - (qb[nl - 1] === "\r" ? 2 : 1);
      }
      if (end === -1) {
        if (!this.atEnd)
          return this.setNext("quoted-scalar");
        end = this.buffer.length;
      }
      return yield* this.pushToIndex(end + 1, !1), this.flowLevel ? "flow" : "doc";
    }
    *parseBlockScalarHeader() {
      this.blockScalarIndent = -1, this.blockScalarKeep = !1;
      let i4 = this.pos;
      while (!0) {
        let ch = this.buffer[++i4];
        if (ch === "+")
          this.blockScalarKeep = !0;
        else if (ch > "0" && ch <= "9")
          this.blockScalarIndent = Number(ch) - 1;
        else if (ch !== "-")
          break;
      }
      return yield* this.pushUntil((ch) => isEmpty(ch) || ch === "#");
    }
    *parseBlockScalar() {
      let nl = this.pos - 1, indent = 0, ch;
      loop:
        for (let i5 = this.pos;ch = this.buffer[i5]; ++i5)
          switch (ch) {
            case " ":
              indent += 1;
              break;
            case `
`:
              nl = i5, indent = 0;
              break;
            case "\r": {
              let next = this.buffer[i5 + 1];
              if (!next && !this.atEnd)
                return this.setNext("block-scalar");
              if (next === `
`)
                break;
            }
            default:
              break loop;
          }
      if (!ch && !this.atEnd)
        return this.setNext("block-scalar");
      if (indent >= this.indentNext) {
        if (this.blockScalarIndent === -1)
          this.indentNext = indent;
        else
          this.indentNext = this.blockScalarIndent + (this.indentNext === 0 ? 1 : this.indentNext);
        do {
          let cs = this.continueScalar(nl + 1);
          if (cs === -1)
            break;
          nl = this.buffer.indexOf(`
`, cs);
        } while (nl !== -1);
        if (nl === -1) {
          if (!this.atEnd)
            return this.setNext("block-scalar");
          nl = this.buffer.length;
        }
      }
      let i4 = nl + 1;
      ch = this.buffer[i4];
      while (ch === " ")
        ch = this.buffer[++i4];
      if (ch === "\t") {
        while (ch === "\t" || ch === " " || ch === "\r" || ch === `
`)
          ch = this.buffer[++i4];
        nl = i4 - 1;
      } else if (!this.blockScalarKeep)
        do {
          let i5 = nl - 1, ch2 = this.buffer[i5];
          if (ch2 === "\r")
            ch2 = this.buffer[--i5];
          let lastChar = i5;
          while (ch2 === " ")
            ch2 = this.buffer[--i5];
          if (ch2 === `
` && i5 >= this.pos && i5 + 1 + indent > lastChar)
            nl = i5;
          else
            break;
        } while (!0);
      return yield cst.SCALAR, yield* this.pushToIndex(nl + 1, !0), yield* this.parseLineStart();
    }
    *parsePlainScalar() {
      let inFlow = this.flowLevel > 0, end = this.pos - 1, i4 = this.pos - 1, ch;
      while (ch = this.buffer[++i4])
        if (ch === ":") {
          let next = this.buffer[i4 + 1];
          if (isEmpty(next) || inFlow && flowIndicatorChars.has(next))
            break;
          end = i4;
        } else if (isEmpty(ch)) {
          let next = this.buffer[i4 + 1];
          if (ch === "\r")
            if (next === `
`)
              i4 += 1, ch = `
`, next = this.buffer[i4 + 1];
            else
              end = i4;
          if (next === "#" || inFlow && flowIndicatorChars.has(next))
            break;
          if (ch === `
`) {
            let cs = this.continueScalar(i4 + 1);
            if (cs === -1)
              break;
            i4 = Math.max(i4, cs - 2);
          }
        } else {
          if (inFlow && flowIndicatorChars.has(ch))
            break;
          end = i4;
        }
      if (!ch && !this.atEnd)
        return this.setNext("plain-scalar");
      return yield cst.SCALAR, yield* this.pushToIndex(end + 1, !0), inFlow ? "flow" : "doc";
    }
    *pushCount(n5) {
      if (n5 > 0)
        return yield this.buffer.substr(this.pos, n5), this.pos += n5, n5;
      return 0;
    }
    *pushToIndex(i4, allowEmpty) {
      let s2 = this.buffer.slice(this.pos, i4);
      if (s2)
        return yield s2, this.pos += s2.length, s2.length;
      else if (allowEmpty)
        yield "";
      return 0;
    }
    *pushIndicators() {
      switch (this.charAt(0)) {
        case "!":
          return (yield* this.pushTag()) + (yield* this.pushSpaces(!0)) + (yield* this.pushIndicators());
        case "&":
          return (yield* this.pushUntil(isNotAnchorChar)) + (yield* this.pushSpaces(!0)) + (yield* this.pushIndicators());
        case "-":
        case "?":
        case ":": {
          let inFlow = this.flowLevel > 0, ch1 = this.charAt(1);
          if (isEmpty(ch1) || inFlow && flowIndicatorChars.has(ch1)) {
            if (!inFlow)
              this.indentNext = this.indentValue + 1;
            else if (this.flowKey)
              this.flowKey = !1;
            return (yield* this.pushCount(1)) + (yield* this.pushSpaces(!0)) + (yield* this.pushIndicators());
          }
        }
      }
      return 0;
    }
    *pushTag() {
      if (this.charAt(1) === "<") {
        let i4 = this.pos + 2, ch = this.buffer[i4];
        while (!isEmpty(ch) && ch !== ">")
          ch = this.buffer[++i4];
        return yield* this.pushToIndex(ch === ">" ? i4 + 1 : i4, !1);
      } else {
        let i4 = this.pos + 1, ch = this.buffer[i4];
        while (ch)
          if (tagChars.has(ch))
            ch = this.buffer[++i4];
          else if (ch === "%" && hexDigits.has(this.buffer[i4 + 1]) && hexDigits.has(this.buffer[i4 + 2]))
            ch = this.buffer[i4 += 3];
          else
            break;
        return yield* this.pushToIndex(i4, !1);
      }
    }
    *pushNewline() {
      let ch = this.buffer[this.pos];
      if (ch === `
`)
        return yield* this.pushCount(1);
      else if (ch === "\r" && this.charAt(1) === `
`)
        return yield* this.pushCount(2);
      else
        return 0;
    }
    *pushSpaces(allowTabs) {
      let i4 = this.pos - 1, ch;
      do
        ch = this.buffer[++i4];
      while (ch === " " || allowTabs && ch === "\t");
      let n5 = i4 - this.pos;
      if (n5 > 0)
        yield this.buffer.substr(this.pos, n5), this.pos = i4;
      return n5;
    }
    *pushUntil(test2) {
      let i4 = this.pos, ch = this.buffer[i4];
      while (!test2(ch))
        ch = this.buffer[++i4];
      return yield* this.pushToIndex(i4, !1);
    }
  }
  exports.Lexer = Lexer;
});
