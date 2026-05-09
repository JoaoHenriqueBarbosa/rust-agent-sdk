// var: require_stringify4
var require_stringify4 = __commonJS((exports) => {
  var anchors = require_anchors(), identity16 = require_identity(), stringifyComment = require_stringifyComment(), stringifyString = require_stringifyString();
  function createStringifyContext(doc2, options) {
    let opt = Object.assign({
      blockQuote: !0,
      commentString: stringifyComment.stringifyComment,
      defaultKeyType: null,
      defaultStringType: "PLAIN",
      directives: null,
      doubleQuotedAsJSON: !1,
      doubleQuotedMinMultiLineLength: 40,
      falseStr: "false",
      flowCollectionPadding: !0,
      indentSeq: !0,
      lineWidth: 80,
      minContentWidth: 20,
      nullStr: "null",
      simpleKeys: !1,
      singleQuote: null,
      trailingComma: !1,
      trueStr: "true",
      verifyAliasOrder: !0
    }, doc2.schema.toStringOptions, options), inFlow;
    switch (opt.collectionStyle) {
      case "block":
        inFlow = !1;
        break;
      case "flow":
        inFlow = !0;
        break;
      default:
        inFlow = null;
    }
    return {
      anchors: /* @__PURE__ */ new Set,
      doc: doc2,
      flowCollectionPadding: opt.flowCollectionPadding ? " " : "",
      indent: "",
      indentStep: typeof opt.indent === "number" ? " ".repeat(opt.indent) : "  ",
      inFlow,
      options: opt
    };
  }
  function getTagObject(tags, item) {
    if (item.tag) {
      let match = tags.filter((t2) => t2.tag === item.tag);
      if (match.length > 0)
        return match.find((t2) => t2.format === item.format) ?? match[0];
    }
    let tagObj = void 0, obj;
    if (identity16.isScalar(item)) {
      obj = item.value;
      let match = tags.filter((t2) => t2.identify?.(obj));
      if (match.length > 1) {
        let testMatch = match.filter((t2) => t2.test);
        if (testMatch.length > 0)
          match = testMatch;
      }
      tagObj = match.find((t2) => t2.format === item.format) ?? match.find((t2) => !t2.format);
    } else
      obj = item, tagObj = tags.find((t2) => t2.nodeClass && obj instanceof t2.nodeClass);
    if (!tagObj) {
      let name3 = obj?.constructor?.name ?? (obj === null ? "null" : typeof obj);
      throw Error(`Tag not resolved for ${name3} value`);
    }
    return tagObj;
  }
  function stringifyProps(node, tagObj, { anchors: anchors$1, doc: doc2 }) {
    if (!doc2.directives)
      return "";
    let props = [], anchor = (identity16.isScalar(node) || identity16.isCollection(node)) && node.anchor;
    if (anchor && anchors.anchorIsValid(anchor))
      anchors$1.add(anchor), props.push(`&${anchor}`);
    let tag = node.tag ?? (tagObj.default ? null : tagObj.tag);
    if (tag)
      props.push(doc2.directives.tagString(tag));
    return props.join(" ");
  }
  function stringify2(item, ctx, onComment, onChompKeep) {
    if (identity16.isPair(item))
      return item.toString(ctx, onComment, onChompKeep);
    if (identity16.isAlias(item)) {
      if (ctx.doc.directives)
        return item.toString(ctx);
      if (ctx.resolvedAliases?.has(item))
        throw TypeError("Cannot stringify circular structure without alias nodes");
      else {
        if (ctx.resolvedAliases)
          ctx.resolvedAliases.add(item);
        else
          ctx.resolvedAliases = /* @__PURE__ */ new Set([item]);
        item = item.resolve(ctx.doc);
      }
    }
    let tagObj = void 0, node = identity16.isNode(item) ? item : ctx.doc.createNode(item, { onTagObj: (o5) => tagObj = o5 });
    tagObj ?? (tagObj = getTagObject(ctx.doc.schema.tags, node));
    let props = stringifyProps(node, tagObj, ctx);
    if (props.length > 0)
      ctx.indentAtStart = (ctx.indentAtStart ?? 0) + props.length + 1;
    let str = typeof tagObj.stringify === "function" ? tagObj.stringify(node, ctx, onComment, onChompKeep) : identity16.isScalar(node) ? stringifyString.stringifyString(node, ctx, onComment, onChompKeep) : node.toString(ctx, onComment, onChompKeep);
    if (!props)
      return str;
    return identity16.isScalar(node) || str[0] === "{" || str[0] === "[" ? `${props} ${str}` : `${props}
${ctx.indent}${str}`;
  }
  exports.createStringifyContext = createStringifyContext;
  exports.stringify = stringify2;
});

// node_modules/yaml/dist/stringify/stringifyPair.js
var require_stringifyPair = __commonJS((exports) => {
  var identity16 = require_identity(), Scalar = require_Scalar(), stringify2 = require_stringify4(), stringifyComment = require_stringifyComment();
  function stringifyPair({ key, value }, ctx, onComment, onChompKeep) {
    let { allNullValues, doc: doc2, indent, indentStep, options: { commentString, indentSeq, simpleKeys } } = ctx, keyComment = identity16.isNode(key) && key.comment || null;
    if (simpleKeys) {
      if (keyComment)
        throw Error("With simple keys, key nodes cannot have comments");
      if (identity16.isCollection(key) || !identity16.isNode(key) && typeof key === "object")
        throw Error("With simple keys, collection cannot be used as a key value");
    }
    let explicitKey = !simpleKeys && (!key || keyComment && value == null && !ctx.inFlow || identity16.isCollection(key) || (identity16.isScalar(key) ? key.type === Scalar.Scalar.BLOCK_FOLDED || key.type === Scalar.Scalar.BLOCK_LITERAL : typeof key === "object"));
    ctx = Object.assign({}, ctx, {
      allNullValues: !1,
      implicitKey: !explicitKey && (simpleKeys || !allNullValues),
      indent: indent + indentStep
    });
    let keyCommentDone = !1, chompKeep = !1, str = stringify2.stringify(key, ctx, () => keyCommentDone = !0, () => chompKeep = !0);
    if (!explicitKey && !ctx.inFlow && str.length > 1024) {
      if (simpleKeys)
        throw Error("With simple keys, single line scalar must not span more than 1024 characters");
      explicitKey = !0;
    }
    if (ctx.inFlow) {
      if (allNullValues || value == null) {
        if (keyCommentDone && onComment)
          onComment();
        return str === "" ? "?" : explicitKey ? `? ${str}` : str;
      }
    } else if (allNullValues && !simpleKeys || value == null && explicitKey) {
      if (str = `? ${str}`, keyComment && !keyCommentDone)
        str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
      else if (chompKeep && onChompKeep)
        onChompKeep();
      return str;
    }
    if (keyCommentDone)
      keyComment = null;
    if (explicitKey) {
      if (keyComment)
        str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
      str = `? ${str}
${indent}:`;
    } else if (str = `${str}:`, keyComment)
      str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
    let vsb, vcb, valueComment;
    if (identity16.isNode(value))
      vsb = !!value.spaceBefore, vcb = value.commentBefore, valueComment = value.comment;
    else if (vsb = !1, vcb = null, valueComment = null, value && typeof value === "object")
      value = doc2.createNode(value);
    if (ctx.implicitKey = !1, !explicitKey && !keyComment && identity16.isScalar(value))
      ctx.indentAtStart = str.length + 1;
    if (chompKeep = !1, !indentSeq && indentStep.length >= 2 && !ctx.inFlow && !explicitKey && identity16.isSeq(value) && !value.flow && !value.tag && !value.anchor)
      ctx.indent = ctx.indent.substring(2);
    let valueCommentDone = !1, valueStr = stringify2.stringify(value, ctx, () => valueCommentDone = !0, () => chompKeep = !0), ws = " ";
    if (keyComment || vsb || vcb) {
      if (ws = vsb ? `
` : "", vcb) {
        let cs = commentString(vcb);
        ws += `
${stringifyComment.indentComment(cs, ctx.indent)}`;
      }
      if (valueStr === "" && !ctx.inFlow) {
        if (ws === `
` && valueComment)
          ws = `

`;
      } else
        ws += `
${ctx.indent}`;
    } else if (!explicitKey && identity16.isCollection(value)) {
      let vs0 = valueStr[0], nl0 = valueStr.indexOf(`
`), hasNewline = nl0 !== -1, flow = ctx.inFlow ?? value.flow ?? value.items.length === 0;
      if (hasNewline || !flow) {
        let hasPropsLine = !1;
        if (hasNewline && (vs0 === "&" || vs0 === "!")) {
          let sp0 = valueStr.indexOf(" ");
          if (vs0 === "&" && sp0 !== -1 && sp0 < nl0 && valueStr[sp0 + 1] === "!")
            sp0 = valueStr.indexOf(" ", sp0 + 1);
          if (sp0 === -1 || nl0 < sp0)
            hasPropsLine = !0;
        }
        if (!hasPropsLine)
          ws = `
${ctx.indent}`;
      }
    } else if (valueStr === "" || valueStr[0] === `
`)
      ws = "";
    if (str += ws + valueStr, ctx.inFlow) {
      if (valueCommentDone && onComment)
        onComment();
    } else if (valueComment && !valueCommentDone)
      str += stringifyComment.lineComment(str, ctx.indent, commentString(valueComment));
    else if (chompKeep && onChompKeep)
      onChompKeep();
    return str;
  }
  exports.stringifyPair = stringifyPair;
});

// node_modules/yaml/dist/log.js
var require_log = __commonJS((exports) => {
  var node_process = __require("process");
  function debug(logLevel, ...messages) {
    if (logLevel === "debug")
      console.log(...messages);
  }
  function warn(logLevel, warning) {
    if (logLevel === "debug" || logLevel === "warn")
      if (typeof node_process.emitWarning === "function")
        node_process.emitWarning(warning);
      else
        console.warn(warning);
  }
  exports.debug = debug;
  exports.warn = warn;
});

// node_modules/yaml/dist/schema/yaml-1.1/merge.js
var require_merge = __commonJS((exports) => {
  var identity16 = require_identity(), Scalar = require_Scalar(), MERGE_KEY = "<<", merge3 = {
    identify: (value) => value === MERGE_KEY || typeof value === "symbol" && value.description === MERGE_KEY,
    default: "key",
    tag: "tag:yaml.org,2002:merge",
    test: /^<<$/,
    resolve: () => Object.assign(new Scalar.Scalar(Symbol(MERGE_KEY)), {
      addToJSMap: addMergeToJSMap
    }),
    stringify: () => MERGE_KEY
  }, isMergeKey = (ctx, key) => (merge3.identify(key) || identity16.isScalar(key) && (!key.type || key.type === Scalar.Scalar.PLAIN) && merge3.identify(key.value)) && ctx?.doc.schema.tags.some((tag) => tag.tag === merge3.tag && tag.default);
  function addMergeToJSMap(ctx, map7, value) {
    if (value = ctx && identity16.isAlias(value) ? value.resolve(ctx.doc) : value, identity16.isSeq(value))
      for (let it of value.items)
        mergeValue(ctx, map7, it);
    else if (Array.isArray(value))
      for (let it of value)
        mergeValue(ctx, map7, it);
    else
      mergeValue(ctx, map7, value);
  }
  function mergeValue(ctx, map7, value) {
    let source = ctx && identity16.isAlias(value) ? value.resolve(ctx.doc) : value;
    if (!identity16.isMap(source))
      throw Error("Merge sources must be maps or map aliases");
    let srcMap = source.toJSON(null, ctx, Map);
    for (let [key, value2] of srcMap)
      if (map7 instanceof Map) {
        if (!map7.has(key))
          map7.set(key, value2);
      } else if (map7 instanceof Set)
        map7.add(key);
      else if (!Object.prototype.hasOwnProperty.call(map7, key))
        Object.defineProperty(map7, key, {
          value: value2,
          writable: !0,
          enumerable: !0,
          configurable: !0
        });
    return map7;
  }
  exports.addMergeToJSMap = addMergeToJSMap;
  exports.isMergeKey = isMergeKey;
  exports.merge = merge3;
});

// node_modules/yaml/dist/nodes/addPairToJSMap.js
var require_addPairToJSMap = __commonJS((exports) => {
  var log3 = require_log(), merge3 = require_merge(), stringify2 = require_stringify4(), identity16 = require_identity(), toJS = require_toJS();
  function addPairToJSMap(ctx, map7, { key, value }) {
    if (identity16.isNode(key) && key.addToJSMap)
      key.addToJSMap(ctx, map7, value);
    else if (merge3.isMergeKey(ctx, key))
      merge3.addMergeToJSMap(ctx, map7, value);
    else {
      let jsKey = toJS.toJS(key, "", ctx);
      if (map7 instanceof Map)
        map7.set(jsKey, toJS.toJS(value, jsKey, ctx));
      else if (map7 instanceof Set)
        map7.add(jsKey);
      else {
        let stringKey = stringifyKey(key, jsKey, ctx), jsValue = toJS.toJS(value, stringKey, ctx);
        if (stringKey in map7)
          Object.defineProperty(map7, stringKey, {
            value: jsValue,
            writable: !0,
            enumerable: !0,
            configurable: !0
          });
        else
          map7[stringKey] = jsValue;
      }
    }
    return map7;
  }
  function stringifyKey(key, jsKey, ctx) {
    if (jsKey === null)
      return "";
    if (typeof jsKey !== "object")
      return String(jsKey);
    if (identity16.isNode(key) && ctx?.doc) {
      let strCtx = stringify2.createStringifyContext(ctx.doc, {});
      strCtx.anchors = /* @__PURE__ */ new Set;
      for (let node of ctx.anchors.keys())
        strCtx.anchors.add(node.anchor);
      strCtx.inFlow = !0, strCtx.inStringifyKey = !0;
      let strKey = key.toString(strCtx);
      if (!ctx.mapKeyWarned) {
        let jsonStr = JSON.stringify(strKey);
        if (jsonStr.length > 40)
          jsonStr = jsonStr.substring(0, 36) + '..."';
        log3.warn(ctx.doc.options.logLevel, `Keys with collection values will be stringified due to JS Object restrictions: ${jsonStr}. Set mapAsMap: true to use object keys.`), ctx.mapKeyWarned = !0;
      }
      return strKey;
    }
    return JSON.stringify(jsKey);
  }
  exports.addPairToJSMap = addPairToJSMap;
});

// node_modules/yaml/dist/nodes/Pair.js
var require_Pair = __commonJS((exports) => {
  var createNode2 = require_createNode(), stringifyPair = require_stringifyPair(), addPairToJSMap = require_addPairToJSMap(), identity16 = require_identity();
  function createPair(key, value, ctx) {
    let k3 = createNode2.createNode(key, void 0, ctx), v2 = createNode2.createNode(value, void 0, ctx);
    return new Pair(k3, v2);
  }

  class Pair {
    constructor(key, value = null) {
      Object.defineProperty(this, identity16.NODE_TYPE, { value: identity16.PAIR }), this.key = key, this.value = value;
    }
    clone(schema5) {
      let { key, value } = this;
      if (identity16.isNode(key))
        key = key.clone(schema5);
      if (identity16.isNode(value))
        value = value.clone(schema5);
      return new Pair(key, value);
    }
    toJSON(_, ctx) {
      let pair = ctx?.mapAsMap ? /* @__PURE__ */ new Map : {};
      return addPairToJSMap.addPairToJSMap(ctx, pair, this);
    }
    toString(ctx, onComment, onChompKeep) {
      return ctx?.doc ? stringifyPair.stringifyPair(this, ctx, onComment, onChompKeep) : JSON.stringify(this);
    }
  }
  exports.Pair = Pair;
  exports.createPair = createPair;
});

// node_modules/yaml/dist/stringify/stringifyCollection.js
var require_stringifyCollection = __commonJS((exports) => {
  var identity16 = require_identity(), stringify2 = require_stringify4(), stringifyComment = require_stringifyComment();
  function stringifyCollection(collection, ctx, options) {
    return (ctx.inFlow ?? collection.flow ? stringifyFlowCollection : stringifyBlockCollection)(collection, ctx, options);
  }
  function stringifyBlockCollection({ comment, items }, ctx, { blockItemPrefix, flowChars, itemIndent, onChompKeep, onComment }) {
    let { indent, options: { commentString } } = ctx, itemCtx = Object.assign({}, ctx, { indent: itemIndent, type: null }), chompKeep = !1, lines = [];
    for (let i4 = 0;i4 < items.length; ++i4) {
      let item = items[i4], comment2 = null;
      if (identity16.isNode(item)) {
        if (!chompKeep && item.spaceBefore)
          lines.push("");
        if (addCommentBefore(ctx, lines, item.commentBefore, chompKeep), item.comment)
          comment2 = item.comment;
      } else if (identity16.isPair(item)) {
        let ik = identity16.isNode(item.key) ? item.key : null;
        if (ik) {
          if (!chompKeep && ik.spaceBefore)
            lines.push("");
          addCommentBefore(ctx, lines, ik.commentBefore, chompKeep);
        }
      }
      chompKeep = !1;
      let str2 = stringify2.stringify(item, itemCtx, () => comment2 = null, () => chompKeep = !0);
      if (comment2)
        str2 += stringifyComment.lineComment(str2, itemIndent, commentString(comment2));
      if (chompKeep && comment2)
        chompKeep = !1;
      lines.push(blockItemPrefix + str2);
    }
    let str;
    if (lines.length === 0)
      str = flowChars.start + flowChars.end;
    else {
      str = lines[0];
      for (let i4 = 1;i4 < lines.length; ++i4) {
        let line = lines[i4];
        str += line ? `
${indent}${line}` : `
`;
      }
    }
    if (comment) {
      if (str += `
` + stringifyComment.indentComment(commentString(comment), indent), onComment)
        onComment();
    } else if (chompKeep && onChompKeep)
      onChompKeep();
    return str;
  }
  function stringifyFlowCollection({ items }, ctx, { flowChars, itemIndent }) {
    let { indent, indentStep, flowCollectionPadding: fcPadding, options: { commentString } } = ctx;
    itemIndent += indentStep;
    let itemCtx = Object.assign({}, ctx, {
      indent: itemIndent,
      inFlow: !0,
      type: null
    }), reqNewline = !1, linesAtValue = 0, lines = [];
    for (let i4 = 0;i4 < items.length; ++i4) {
      let item = items[i4], comment = null;
      if (identity16.isNode(item)) {
        if (item.spaceBefore)
          lines.push("");
        if (addCommentBefore(ctx, lines, item.commentBefore, !1), item.comment)
          comment = item.comment;
      } else if (identity16.isPair(item)) {
        let ik = identity16.isNode(item.key) ? item.key : null;
        if (ik) {
          if (ik.spaceBefore)
            lines.push("");
          if (addCommentBefore(ctx, lines, ik.commentBefore, !1), ik.comment)
            reqNewline = !0;
        }
        let iv = identity16.isNode(item.value) ? item.value : null;
        if (iv) {
          if (iv.comment)
            comment = iv.comment;
          if (iv.commentBefore)
            reqNewline = !0;
        } else if (item.value == null && ik?.comment)
          comment = ik.comment;
      }
      if (comment)
        reqNewline = !0;
      let str = stringify2.stringify(item, itemCtx, () => comment = null);
      if (reqNewline || (reqNewline = lines.length > linesAtValue || str.includes(`
`)), i4 < items.length - 1)
        str += ",";
      else if (ctx.options.trailingComma) {
        if (ctx.options.lineWidth > 0)
          reqNewline || (reqNewline = lines.reduce((sum, line) => sum + line.length + 2, 2) + (str.length + 2) > ctx.options.lineWidth);
        if (reqNewline)
          str += ",";
      }
      if (comment)
        str += stringifyComment.lineComment(str, itemIndent, commentString(comment));
      lines.push(str), linesAtValue = lines.length;
    }
    let { start, end } = flowChars;
    if (lines.length === 0)
      return start + end;
    else {
      if (!reqNewline) {
        let len = lines.reduce((sum, line) => sum + line.length + 2, 2);
        reqNewline = ctx.options.lineWidth > 0 && len > ctx.options.lineWidth;
      }
      if (reqNewline) {
        let str = start;
        for (let line of lines)
          str += line ? `
${indentStep}${indent}${line}` : `
`;
        return `${str}
${indent}${end}`;
      } else
        return `${start}${fcPadding}${lines.join(" ")}${fcPadding}${end}`;
    }
  }
  function addCommentBefore({ indent, options: { commentString } }, lines, comment, chompKeep) {
    if (comment && chompKeep)
      comment = comment.replace(/^\n+/, "");
    if (comment) {
      let ic = stringifyComment.indentComment(commentString(comment), indent);
      lines.push(ic.trimStart());
    }
  }
  exports.stringifyCollection = stringifyCollection;
});

// node_modules/yaml/dist/nodes/YAMLMap.js
var require_YAMLMap = __commonJS((exports) => {
  var stringifyCollection = require_stringifyCollection(), addPairToJSMap = require_addPairToJSMap(), Collection = require_Collection(), identity16 = require_identity(), Pair = require_Pair(), Scalar = require_Scalar();
  function findPair(items, key) {
    let k3 = identity16.isScalar(key) ? key.value : key;
    for (let it of items)
      if (identity16.isPair(it)) {
        if (it.key === key || it.key === k3)
          return it;
        if (identity16.isScalar(it.key) && it.key.value === k3)
          return it;
      }
    return;
  }

  class YAMLMap extends Collection.Collection {
    static get tagName() {
      return "tag:yaml.org,2002:map";
    }
    constructor(schema5) {
      super(identity16.MAP, schema5);
      this.items = [];
    }
    static from(schema5, obj, ctx) {
      let { keepUndefined, replacer } = ctx, map7 = new this(schema5), add = (key, value) => {
        if (typeof replacer === "function")
          value = replacer.call(obj, key, value);
        else if (Array.isArray(replacer) && !replacer.includes(key))
          return;
        if (value !== void 0 || keepUndefined)
          map7.items.push(Pair.createPair(key, value, ctx));
      };
      if (obj instanceof Map)
        for (let [key, value] of obj)
          add(key, value);
      else if (obj && typeof obj === "object")
        for (let key of Object.keys(obj))
          add(key, obj[key]);
      if (typeof schema5.sortMapEntries === "function")
        map7.items.sort(schema5.sortMapEntries);
      return map7;
    }
    add(pair, overwrite) {
      let _pair;
      if (identity16.isPair(pair))
        _pair = pair;
      else if (!pair || typeof pair !== "object" || !("key" in pair))
        _pair = new Pair.Pair(pair, pair?.value);
      else
        _pair = new Pair.Pair(pair.key, pair.value);
      let prev = findPair(this.items, _pair.key), sortEntries = this.schema?.sortMapEntries;
      if (prev) {
        if (!overwrite)
          throw Error(`Key ${_pair.key} already set`);
        if (identity16.isScalar(prev.value) && Scalar.isScalarValue(_pair.value))
          prev.value.value = _pair.value;
        else
          prev.value = _pair.value;
      } else if (sortEntries) {
        let i4 = this.items.findIndex((item) => sortEntries(_pair, item) < 0);
        if (i4 === -1)
          this.items.push(_pair);
        else
          this.items.splice(i4, 0, _pair);
      } else
        this.items.push(_pair);
    }
    delete(key) {
      let it = findPair(this.items, key);
      if (!it)
        return !1;
      return this.items.splice(this.items.indexOf(it), 1).length > 0;
    }
    get(key, keepScalar) {
      let node = findPair(this.items, key)?.value;
      return (!keepScalar && identity16.isScalar(node) ? node.value : node) ?? void 0;
    }
    has(key) {
      return !!findPair(this.items, key);
    }
    set(key, value) {
      this.add(new Pair.Pair(key, value), !0);
    }
    toJSON(_, ctx, Type) {
      let map7 = Type ? new Type : ctx?.mapAsMap ? /* @__PURE__ */ new Map : {};
      if (ctx?.onCreate)
        ctx.onCreate(map7);
      for (let item of this.items)
        addPairToJSMap.addPairToJSMap(ctx, map7, item);
      return map7;
    }
    toString(ctx, onComment, onChompKeep) {
      if (!ctx)
        return JSON.stringify(this);
      for (let item of this.items)
        if (!identity16.isPair(item))
          throw Error(`Map items must all be pairs; found ${JSON.stringify(item)} instead`);
      if (!ctx.allNullValues && this.hasAllNullValues(!1))
        ctx = Object.assign({}, ctx, { allNullValues: !0 });
      return stringifyCollection.stringifyCollection(this, ctx, {
        blockItemPrefix: "",
        flowChars: { start: "{", end: "}" },
        itemIndent: ctx.indent || "",
        onChompKeep,
        onComment
      });
    }
  }
  exports.YAMLMap = YAMLMap;
  exports.findPair = findPair;
});

// node_modules/yaml/dist/schema/common/map.js
var require_map = __commonJS((exports) => {
  var identity16 = require_identity(), YAMLMap = require_YAMLMap(), map7 = {
    collection: "map",
    default: !0,
    nodeClass: YAMLMap.YAMLMap,
    tag: "tag:yaml.org,2002:map",
    resolve(map8, onError) {
      if (!identity16.isMap(map8))
        onError("Expected a mapping for this tag");
      return map8;
    },
    createNode: (schema5, obj, ctx) => YAMLMap.YAMLMap.from(schema5, obj, ctx)
  };
  exports.map = map7;
});

// node_modules/yaml/dist/nodes/YAMLSeq.js
var require_YAMLSeq = __commonJS((exports) => {
  var createNode2 = require_createNode(), stringifyCollection = require_stringifyCollection(), Collection = require_Collection(), identity16 = require_identity(), Scalar = require_Scalar(), toJS = require_toJS();

  class YAMLSeq extends Collection.Collection {
    static get tagName() {
      return "tag:yaml.org,2002:seq";
    }
    constructor(schema5) {
      super(identity16.SEQ, schema5);
      this.items = [];
    }
    add(value) {
      this.items.push(value);
    }
    delete(key) {
      let idx = asItemIndex(key);
      if (typeof idx !== "number")
        return !1;
      return this.items.splice(idx, 1).length > 0;
    }
    get(key, keepScalar) {
      let idx = asItemIndex(key);
      if (typeof idx !== "number")
        return;
      let it = this.items[idx];
      return !keepScalar && identity16.isScalar(it) ? it.value : it;
    }
    has(key) {
      let idx = asItemIndex(key);
      return typeof idx === "number" && idx < this.items.length;
    }
    set(key, value) {
      let idx = asItemIndex(key);
      if (typeof idx !== "number")
        throw Error(`Expected a valid index, not ${key}.`);
      let prev = this.items[idx];
      if (identity16.isScalar(prev) && Scalar.isScalarValue(value))
        prev.value = value;
      else
        this.items[idx] = value;
    }
    toJSON(_, ctx) {
      let seq = [];
      if (ctx?.onCreate)
        ctx.onCreate(seq);
      let i4 = 0;
      for (let item of this.items)
        seq.push(toJS.toJS(item, String(i4++), ctx));
      return seq;
    }
    toString(ctx, onComment, onChompKeep) {
      if (!ctx)
        return JSON.stringify(this);
      return stringifyCollection.stringifyCollection(this, ctx, {
        blockItemPrefix: "- ",
        flowChars: { start: "[", end: "]" },
        itemIndent: (ctx.indent || "") + "  ",
        onChompKeep,
        onComment
      });
    }
    static from(schema5, obj, ctx) {
      let { replacer } = ctx, seq = new this(schema5);
      if (obj && Symbol.iterator in Object(obj)) {
        let i4 = 0;
        for (let it of obj) {
          if (typeof replacer === "function") {
            let key = obj instanceof Set ? it : String(i4++);
            it = replacer.call(obj, key, it);
          }
          seq.items.push(createNode2.createNode(it, void 0, ctx));
        }
      }
      return seq;
    }
  }
  function asItemIndex(key) {
    let idx = identity16.isScalar(key) ? key.value : key;
    if (idx && typeof idx === "string")
      idx = Number(idx);
    return typeof idx === "number" && Number.isInteger(idx) && idx >= 0 ? idx : null;
  }
  exports.YAMLSeq = YAMLSeq;
});

// node_modules/yaml/dist/schema/common/seq.js
var require_seq = __commonJS((exports) => {
  var identity16 = require_identity(), YAMLSeq = require_YAMLSeq(), seq = {
    collection: "seq",
    default: !0,
    nodeClass: YAMLSeq.YAMLSeq,
    tag: "tag:yaml.org,2002:seq",
    resolve(seq2, onError) {
      if (!identity16.isSeq(seq2))
        onError("Expected a sequence for this tag");
      return seq2;
    },
    createNode: (schema5, obj, ctx) => YAMLSeq.YAMLSeq.from(schema5, obj, ctx)
  };
  exports.seq = seq;
});

// node_modules/yaml/dist/schema/common/string.js
var require_string = __commonJS((exports) => {
  var stringifyString = require_stringifyString(), string4 = {
    identify: (value) => typeof value === "string",
    default: !0,
    tag: "tag:yaml.org,2002:str",
    resolve: (str) => str,
    stringify(item, ctx, onComment, onChompKeep) {
      return ctx = Object.assign({ actualString: !0 }, ctx), stringifyString.stringifyString(item, ctx, onComment, onChompKeep);
    }
  };
  exports.string = string4;
});

// node_modules/yaml/dist/schema/common/null.js
var require_null = __commonJS((exports) => {
  var Scalar = require_Scalar(), nullTag2 = {
    identify: (value) => value == null,
    createNode: () => new Scalar.Scalar(null),
    default: !0,
    tag: "tag:yaml.org,2002:null",
    test: /^(?:~|[Nn]ull|NULL)?$/,
    resolve: () => new Scalar.Scalar(null),
    stringify: ({ source }, ctx) => typeof source === "string" && nullTag2.test.test(source) ? source : ctx.options.nullStr
  };
  exports.nullTag = nullTag2;
});

// node_modules/yaml/dist/schema/core/bool.js
var require_bool = __commonJS((exports) => {
  var Scalar = require_Scalar(), boolTag5 = {
    identify: (value) => typeof value === "boolean",
    default: !0,
    tag: "tag:yaml.org,2002:bool",
    test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
    resolve: (str) => new Scalar.Scalar(str[0] === "t" || str[0] === "T"),
    stringify({ source, value }, ctx) {
      if (source && boolTag5.test.test(source)) {
        let sv = source[0] === "t" || source[0] === "T";
        if (value === sv)
          return source;
      }
      return value ? ctx.options.trueStr : ctx.options.falseStr;
    }
  };
  exports.boolTag = boolTag5;
});

// node_modules/yaml/dist/stringify/stringifyNumber.js
var require_stringifyNumber = __commonJS((exports) => {
  function stringifyNumber({ format: format4, minFractionDigits, tag, value }) {
    if (typeof value === "bigint")
      return String(value);
    let num = typeof value === "number" ? value : Number(value);
    if (!isFinite(num))
      return isNaN(num) ? ".nan" : num < 0 ? "-.inf" : ".inf";
    let n5 = Object.is(value, -0) ? "-0" : JSON.stringify(value);
    if (!format4 && minFractionDigits && (!tag || tag === "tag:yaml.org,2002:float") && /^\d/.test(n5)) {
      let i4 = n5.indexOf(".");
      if (i4 < 0)
        i4 = n5.length, n5 += ".";
      let d = minFractionDigits - (n5.length - i4 - 1);
      while (d-- > 0)
        n5 += "0";
    }
    return n5;
  }
  exports.stringifyNumber = stringifyNumber;
});

// node_modules/yaml/dist/schema/core/float.js
var require_float = __commonJS((exports) => {
  var Scalar = require_Scalar(), stringifyNumber = require_stringifyNumber(), floatNaN = {
    identify: (value) => typeof value === "number",
    default: !0,
    tag: "tag:yaml.org,2002:float",
    test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
    resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
    stringify: stringifyNumber.stringifyNumber
  }, floatExp = {
    identify: (value) => typeof value === "number",
    default: !0,
    tag: "tag:yaml.org,2002:float",
    format: "EXP",
    test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
    resolve: (str) => parseFloat(str),
    stringify(node) {
      let num = Number(node.value);
      return isFinite(num) ? num.toExponential() : stringifyNumber.stringifyNumber(node);
    }
  }, float = {
    identify: (value) => typeof value === "number",
    default: !0,
    tag: "tag:yaml.org,2002:float",
    test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
    resolve(str) {
      let node = new Scalar.Scalar(parseFloat(str)), dot = str.indexOf(".");
      if (dot !== -1 && str[str.length - 1] === "0")
        node.minFractionDigits = str.length - dot - 1;
      return node;
    },
    stringify: stringifyNumber.stringifyNumber
  };
  exports.float = float;
  exports.floatExp = floatExp;
  exports.floatNaN = floatNaN;
});

// node_modules/yaml/dist/schema/core/int.js
var require_int = __commonJS((exports) => {
  var stringifyNumber = require_stringifyNumber(), intIdentify = (value) => typeof value === "bigint" || Number.isInteger(value), intResolve = (str, offset, radix, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str.substring(offset), radix);
  function intStringify(node, radix, prefix) {
    let { value } = node;
    if (intIdentify(value) && value >= 0)
      return prefix + value.toString(radix);
    return stringifyNumber.stringifyNumber(node);
  }
  var intOct = {
    identify: (value) => intIdentify(value) && value >= 0,
    default: !0,
    tag: "tag:yaml.org,2002:int",
    format: "OCT",
    test: /^0o[0-7]+$/,
    resolve: (str, _onError, opt) => intResolve(str, 2, 8, opt),
    stringify: (node) => intStringify(node, 8, "0o")
  }, int2 = {
    identify: intIdentify,
    default: !0,
    tag: "tag:yaml.org,2002:int",
    test: /^[-+]?[0-9]+$/,
    resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
    stringify: stringifyNumber.stringifyNumber
  }, intHex = {
    identify: (value) => intIdentify(value) && value >= 0,
    default: !0,
    tag: "tag:yaml.org,2002:int",
    format: "HEX",
    test: /^0x[0-9a-fA-F]+$/,
    resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
    stringify: (node) => intStringify(node, 16, "0x")
  };
  exports.int = int2;
  exports.intHex = intHex;
  exports.intOct = intOct;
});

// node_modules/yaml/dist/schema/core/schema.js
var require_schema2 = __commonJS((exports) => {
  var map7 = require_map(), _null4 = require_null(), seq = require_seq(), string4 = require_string(), bool = require_bool(), float = require_float(), int2 = require_int(), schema5 = [
    map7.map,
    seq.seq,
    string4.string,
    _null4.nullTag,
    bool.boolTag,
    int2.intOct,
    int2.int,
    int2.intHex,
    float.floatNaN,
    float.floatExp,
    float.float
  ];
  exports.schema = schema5;
});

// node_modules/yaml/dist/schema/json/schema.js
var require_schema3 = __commonJS((exports) => {
  var Scalar = require_Scalar(), map7 = require_map(), seq = require_seq();
  function intIdentify(value) {
    return typeof value === "bigint" || Number.isInteger(value);
  }
  var stringifyJSON = ({ value }) => JSON.stringify(value), jsonScalars = [
    {
      identify: (value) => typeof value === "string",
      default: !0,
      tag: "tag:yaml.org,2002:str",
      resolve: (str) => str,
      stringify: stringifyJSON
    },
    {
      identify: (value) => value == null,
      createNode: () => new Scalar.Scalar(null),
      default: !0,
      tag: "tag:yaml.org,2002:null",
      test: /^null$/,
      resolve: () => null,
      stringify: stringifyJSON
    },
    {
      identify: (value) => typeof value === "boolean",
      default: !0,
      tag: "tag:yaml.org,2002:bool",
      test: /^true$|^false$/,
      resolve: (str) => str === "true",
      stringify: stringifyJSON
    },
    {
      identify: intIdentify,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      test: /^-?(?:0|[1-9][0-9]*)$/,
      resolve: (str, _onError, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str, 10),
      stringify: ({ value }) => intIdentify(value) ? value.toString() : JSON.stringify(value)
    },
    {
      identify: (value) => typeof value === "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
      resolve: (str) => parseFloat(str),
      stringify: stringifyJSON
    }
  ], jsonError = {
    default: !0,
    tag: "",
    test: /^/,
    resolve(str, onError) {
      return onError(`Unresolved plain scalar ${JSON.stringify(str)}`), str;
    }
  }, schema5 = [map7.map, seq.seq].concat(jsonScalars, jsonError);
  exports.schema = schema5;
});

// node_modules/yaml/dist/schema/yaml-1.1/binary.js
var require_binary = __commonJS((exports) => {
  var node_buffer = __require("buffer"), Scalar = require_Scalar(), stringifyString = require_stringifyString(), binary = {
    identify: (value) => value instanceof Uint8Array,
    default: !1,
    tag: "tag:yaml.org,2002:binary",
    resolve(src, onError) {
      if (typeof node_buffer.Buffer === "function")
        return node_buffer.Buffer.from(src, "base64");
      else if (typeof atob === "function") {
        let str = atob(src.replace(/[\n\r]/g, "")), buffer = new Uint8Array(str.length);
        for (let i4 = 0;i4 < str.length; ++i4)
          buffer[i4] = str.charCodeAt(i4);
        return buffer;
      } else
        return onError("This environment does not support reading binary tags; either Buffer or atob is required"), src;
    },
    stringify({ comment, type, value }, ctx, onComment, onChompKeep) {
      if (!value)
        return "";
      let buf = value, str;
      if (typeof node_buffer.Buffer === "function")
        str = buf instanceof node_buffer.Buffer ? buf.toString("base64") : node_buffer.Buffer.from(buf.buffer).toString("base64");
      else if (typeof btoa === "function") {
        let s2 = "";
        for (let i4 = 0;i4 < buf.length; ++i4)
          s2 += String.fromCharCode(buf[i4]);
        str = btoa(s2);
      } else
        throw Error("This environment does not support writing binary tags; either Buffer or btoa is required");
      if (type ?? (type = Scalar.Scalar.BLOCK_LITERAL), type !== Scalar.Scalar.QUOTE_DOUBLE) {
        let lineWidth2 = Math.max(ctx.options.lineWidth - ctx.indent.length, ctx.options.minContentWidth), n5 = Math.ceil(str.length / lineWidth2), lines = Array(n5);
        for (let i4 = 0, o5 = 0;i4 < n5; ++i4, o5 += lineWidth2)
          lines[i4] = str.substr(o5, lineWidth2);
        str = lines.join(type === Scalar.Scalar.BLOCK_LITERAL ? `
` : " ");
      }
      return stringifyString.stringifyString({ comment, type, value: str }, ctx, onComment, onChompKeep);
    }
  };
  exports.binary = binary;
});

// node_modules/yaml/dist/schema/yaml-1.1/pairs.js
var require_pairs = __commonJS((exports) => {
  var identity16 = require_identity(), Pair = require_Pair(), Scalar = require_Scalar(), YAMLSeq = require_YAMLSeq();
  function resolvePairs(seq, onError) {
    if (identity16.isSeq(seq))
      for (let i4 = 0;i4 < seq.items.length; ++i4) {
        let item = seq.items[i4];
        if (identity16.isPair(item))
          continue;
        else if (identity16.isMap(item)) {
          if (item.items.length > 1)
            onError("Each pair must have its own sequence indicator");
          let pair = item.items[0] || new Pair.Pair(new Scalar.Scalar(null));
          if (item.commentBefore)
            pair.key.commentBefore = pair.key.commentBefore ? `${item.commentBefore}
${pair.key.commentBefore}` : item.commentBefore;
          if (item.comment) {
            let cn = pair.value ?? pair.key;
            cn.comment = cn.comment ? `${item.comment}
${cn.comment}` : item.comment;
          }
          item = pair;
        }
        seq.items[i4] = identity16.isPair(item) ? item : new Pair.Pair(item);
      }
    else
      onError("Expected a sequence for this tag");
    return seq;
  }
  function createPairs(schema5, iterable, ctx) {
    let { replacer } = ctx, pairs2 = new YAMLSeq.YAMLSeq(schema5);
    pairs2.tag = "tag:yaml.org,2002:pairs";
    let i4 = 0;
    if (iterable && Symbol.iterator in Object(iterable))
      for (let it of iterable) {
        if (typeof replacer === "function")
          it = replacer.call(iterable, String(i4++), it);
        let key, value;
        if (Array.isArray(it))
          if (it.length === 2)
            key = it[0], value = it[1];
          else
            throw TypeError(`Expected [key, value] tuple: ${it}`);
        else if (it && it instanceof Object) {
          let keys2 = Object.keys(it);
          if (keys2.length === 1)
            key = keys2[0], value = it[key];
          else
            throw TypeError(`Expected tuple with one key, not ${keys2.length} keys`);
        } else
          key = it;
        pairs2.items.push(Pair.createPair(key, value, ctx));
      }
    return pairs2;
  }
  var pairs = {
    collection: "seq",
    default: !1,
    tag: "tag:yaml.org,2002:pairs",
    resolve: resolvePairs,
    createNode: createPairs
  };
  exports.createPairs = createPairs;
  exports.pairs = pairs;
  exports.resolvePairs = resolvePairs;
});

// node_modules/yaml/dist/schema/yaml-1.1/omap.js
var require_omap = __commonJS((exports) => {
  var identity16 = require_identity(), toJS = require_toJS(), YAMLMap = require_YAMLMap(), YAMLSeq = require_YAMLSeq(), pairs = require_pairs();

  class YAMLOMap extends YAMLSeq.YAMLSeq {
    constructor() {
      super();
      this.add = YAMLMap.YAMLMap.prototype.add.bind(this), this.delete = YAMLMap.YAMLMap.prototype.delete.bind(this), this.get = YAMLMap.YAMLMap.prototype.get.bind(this), this.has = YAMLMap.YAMLMap.prototype.has.bind(this), this.set = YAMLMap.YAMLMap.prototype.set.bind(this), this.tag = YAMLOMap.tag;
    }
    toJSON(_, ctx) {
      if (!ctx)
        return super.toJSON(_);
      let map7 = /* @__PURE__ */ new Map;
      if (ctx?.onCreate)
        ctx.onCreate(map7);
      for (let pair of this.items) {
        let key, value;
        if (identity16.isPair(pair))
          key = toJS.toJS(pair.key, "", ctx), value = toJS.toJS(pair.value, key, ctx);
        else
          key = toJS.toJS(pair, "", ctx);
        if (map7.has(key))
          throw Error("Ordered maps must not include duplicate keys");
        map7.set(key, value);
      }
      return map7;
    }
    static from(schema5, iterable, ctx) {
      let pairs$1 = pairs.createPairs(schema5, iterable, ctx), omap2 = new this;
      return omap2.items = pairs$1.items, omap2;
    }
  }
  YAMLOMap.tag = "tag:yaml.org,2002:omap";
  var omap = {
    collection: "seq",
    identify: (value) => value instanceof Map,
    nodeClass: YAMLOMap,
    default: !1,
    tag: "tag:yaml.org,2002:omap",
    resolve(seq, onError) {
      let pairs$1 = pairs.resolvePairs(seq, onError), seenKeys = [];
      for (let { key } of pairs$1.items)
        if (identity16.isScalar(key))
          if (seenKeys.includes(key.value))
            onError(`Ordered maps must not include duplicate keys: ${key.value}`);
          else
            seenKeys.push(key.value);
      return Object.assign(new YAMLOMap, pairs$1);
    },
    createNode: (schema5, iterable, ctx) => YAMLOMap.from(schema5, iterable, ctx)
  };
  exports.YAMLOMap = YAMLOMap;
  exports.omap = omap;
});

// node_modules/yaml/dist/schema/yaml-1.1/bool.js
var require_bool2 = __commonJS((exports) => {
  var Scalar = require_Scalar();
  function boolStringify({ value, source }, ctx) {
    if (source && (value ? trueTag : falseTag).test.test(source))
      return source;
    return value ? ctx.options.trueStr : ctx.options.falseStr;
  }
  var trueTag = {
    identify: (value) => value === !0,
    default: !0,
    tag: "tag:yaml.org,2002:bool",
    test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
    resolve: () => new Scalar.Scalar(!0),
    stringify: boolStringify
  }, falseTag = {
    identify: (value) => value === !1,
    default: !0,
    tag: "tag:yaml.org,2002:bool",
    test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,
    resolve: () => new Scalar.Scalar(!1),
    stringify: boolStringify
  };
  exports.falseTag = falseTag;
  exports.trueTag = trueTag;
});

// node_modules/yaml/dist/schema/yaml-1.1/float.js
var require_float2 = __commonJS((exports) => {
  var Scalar = require_Scalar(), stringifyNumber = require_stringifyNumber(), floatNaN = {
    identify: (value) => typeof value === "number",
    default: !0,
    tag: "tag:yaml.org,2002:float",
    test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
    resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
    stringify: stringifyNumber.stringifyNumber
  }, floatExp = {
    identify: (value) => typeof value === "number",
    default: !0,
    tag: "tag:yaml.org,2002:float",
    format: "EXP",
    test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
    resolve: (str) => parseFloat(str.replace(/_/g, "")),
    stringify(node) {
      let num = Number(node.value);
      return isFinite(num) ? num.toExponential() : stringifyNumber.stringifyNumber(node);
    }
  }, float = {
    identify: (value) => typeof value === "number",
    default: !0,
    tag: "tag:yaml.org,2002:float",
    test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
    resolve(str) {
      let node = new Scalar.Scalar(parseFloat(str.replace(/_/g, ""))), dot = str.indexOf(".");
      if (dot !== -1) {
        let f = str.substring(dot + 1).replace(/_/g, "");
        if (f[f.length - 1] === "0")
          node.minFractionDigits = f.length;
      }
      return node;
    },
    stringify: stringifyNumber.stringifyNumber
  };
  exports.float = float;
  exports.floatExp = floatExp;
  exports.floatNaN = floatNaN;
});

// node_modules/yaml/dist/schema/yaml-1.1/int.js
var require_int2 = __commonJS((exports) => {
  var stringifyNumber = require_stringifyNumber(), intIdentify = (value) => typeof value === "bigint" || Number.isInteger(value);
  function intResolve(str, offset, radix, { intAsBigInt }) {
    let sign2 = str[0];
    if (sign2 === "-" || sign2 === "+")
      offset += 1;
    if (str = str.substring(offset).replace(/_/g, ""), intAsBigInt) {
      switch (radix) {
        case 2:
          str = `0b${str}`;
          break;
        case 8:
          str = `0o${str}`;
          break;
        case 16:
          str = `0x${str}`;
          break;
      }
      let n6 = BigInt(str);
      return sign2 === "-" ? BigInt(-1) * n6 : n6;
    }
    let n5 = parseInt(str, radix);
    return sign2 === "-" ? -1 * n5 : n5;
  }
  function intStringify(node, radix, prefix) {
    let { value } = node;
    if (intIdentify(value)) {
      let str = value.toString(radix);
      return value < 0 ? "-" + prefix + str.substr(1) : prefix + str;
    }
    return stringifyNumber.stringifyNumber(node);
  }
  var intBin = {
    identify: intIdentify,
    default: !0,
    tag: "tag:yaml.org,2002:int",
    format: "BIN",
    test: /^[-+]?0b[0-1_]+$/,
    resolve: (str, _onError, opt) => intResolve(str, 2, 2, opt),
    stringify: (node) => intStringify(node, 2, "0b")
  }, intOct = {
    identify: intIdentify,
    default: !0,
    tag: "tag:yaml.org,2002:int",
    format: "OCT",
    test: /^[-+]?0[0-7_]+$/,
    resolve: (str, _onError, opt) => intResolve(str, 1, 8, opt),
    stringify: (node) => intStringify(node, 8, "0")
  }, int2 = {
    identify: intIdentify,
    default: !0,
    tag: "tag:yaml.org,2002:int",
    test: /^[-+]?[0-9][0-9_]*$/,
    resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
    stringify: stringifyNumber.stringifyNumber
  }, intHex = {
    identify: intIdentify,
    default: !0,
    tag: "tag:yaml.org,2002:int",
    format: "HEX",
    test: /^[-+]?0x[0-9a-fA-F_]+$/,
    resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
    stringify: (node) => intStringify(node, 16, "0x")
  };
  exports.int = int2;
  exports.intBin = intBin;
  exports.intHex = intHex;
  exports.intOct = intOct;
});

// node_modules/yaml/dist/schema/yaml-1.1/set.js
var require_set = __commonJS((exports) => {
  var identity16 = require_identity(), Pair = require_Pair(), YAMLMap = require_YAMLMap();

  class YAMLSet extends YAMLMap.YAMLMap {
    constructor(schema5) {
      super(schema5);
      this.tag = YAMLSet.tag;
    }
    add(key) {
      let pair;
      if (identity16.isPair(key))
        pair = key;
      else if (key && typeof key === "object" && "key" in key && "value" in key && key.value === null)
        pair = new Pair.Pair(key.key, null);
      else
        pair = new Pair.Pair(key, null);
      if (!YAMLMap.findPair(this.items, pair.key))
        this.items.push(pair);
    }
    get(key, keepPair) {
      let pair = YAMLMap.findPair(this.items, key);
      return !keepPair && identity16.isPair(pair) ? identity16.isScalar(pair.key) ? pair.key.value : pair.key : pair;
    }
    set(key, value) {
      if (typeof value !== "boolean")
        throw Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof value}`);
      let prev = YAMLMap.findPair(this.items, key);
      if (prev && !value)
        this.items.splice(this.items.indexOf(prev), 1);
      else if (!prev && value)
        this.items.push(new Pair.Pair(key));
    }
    toJSON(_, ctx) {
      return super.toJSON(_, ctx, Set);
    }
    toString(ctx, onComment, onChompKeep) {
      if (!ctx)
        return JSON.stringify(this);
      if (this.hasAllNullValues(!0))
        return super.toString(Object.assign({}, ctx, { allNullValues: !0 }), onComment, onChompKeep);
      else
        throw Error("Set items must all have null values");
    }
    static from(schema5, iterable, ctx) {
      let { replacer } = ctx, set3 = new this(schema5);
      if (iterable && Symbol.iterator in Object(iterable))
        for (let value of iterable) {
          if (typeof replacer === "function")
            value = replacer.call(iterable, value, value);
          set3.items.push(Pair.createPair(value, null, ctx));
        }
      return set3;
    }
  }
  YAMLSet.tag = "tag:yaml.org,2002:set";
  var set2 = {
    collection: "map",
    identify: (value) => value instanceof Set,
    nodeClass: YAMLSet,
    default: !1,
    tag: "tag:yaml.org,2002:set",
    createNode: (schema5, iterable, ctx) => YAMLSet.from(schema5, iterable, ctx),
    resolve(map7, onError) {
      if (identity16.isMap(map7))
        if (map7.hasAllNullValues(!0))
          return Object.assign(new YAMLSet, map7);
        else
          onError("Set items must all have null values");
      else
        onError("Expected a mapping for this tag");
      return map7;
    }
  };
  exports.YAMLSet = YAMLSet;
  exports.set = set2;
});

// node_modules/yaml/dist/schema/yaml-1.1/timestamp.js
var require_timestamp = __commonJS((exports) => {
  var stringifyNumber = require_stringifyNumber();
  function parseSexagesimal(str, asBigInt) {
    let sign2 = str[0], parts = sign2 === "-" || sign2 === "+" ? str.substring(1) : str, num = (n5) => asBigInt ? BigInt(n5) : Number(n5), res = parts.replace(/_/g, "").split(":").reduce((res2, p4) => res2 * num(60) + num(p4), num(0));
    return sign2 === "-" ? num(-1) * res : res;
  }
  function stringifySexagesimal(node) {
    let { value } = node, num = (n5) => n5;
    if (typeof value === "bigint")
      num = (n5) => BigInt(n5);
    else if (isNaN(value) || !isFinite(value))
      return stringifyNumber.stringifyNumber(node);
    let sign2 = "";
    if (value < 0)
      sign2 = "-", value *= num(-1);
    let _60 = num(60), parts = [value % _60];
    if (value < 60)
      parts.unshift(0);
    else if (value = (value - parts[0]) / _60, parts.unshift(value % _60), value >= 60)
      value = (value - parts[0]) / _60, parts.unshift(value);
    return sign2 + parts.map((n5) => String(n5).padStart(2, "0")).join(":").replace(/000000\d*$/, "");
  }
  var intTime = {
    identify: (value) => typeof value === "bigint" || Number.isInteger(value),
    default: !0,
    tag: "tag:yaml.org,2002:int",
    format: "TIME",
    test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
    resolve: (str, _onError, { intAsBigInt }) => parseSexagesimal(str, intAsBigInt),
    stringify: stringifySexagesimal
  }, floatTime = {
    identify: (value) => typeof value === "number",
    default: !0,
    tag: "tag:yaml.org,2002:float",
    format: "TIME",
    test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
    resolve: (str) => parseSexagesimal(str, !1),
    stringify: stringifySexagesimal
  }, timestamp = {
    identify: (value) => value instanceof Date,
    default: !0,
    tag: "tag:yaml.org,2002:timestamp",
    test: RegExp("^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$"),
    resolve(str) {
      let match = str.match(timestamp.test);
      if (!match)
        throw Error("!!timestamp expects a date, starting with yyyy-mm-dd");
      let [, year, month, day, hour, minute, second] = match.map(Number), millisec = match[7] ? Number((match[7] + "00").substr(1, 3)) : 0, date5 = Date.UTC(year, month - 1, day, hour || 0, minute || 0, second || 0, millisec), tz = match[8];
      if (tz && tz !== "Z") {
        let d = parseSexagesimal(tz, !1);
        if (Math.abs(d) < 30)
          d *= 60;
        date5 -= 60000 * d;
      }
      return new Date(date5);
    },
    stringify: ({ value }) => value?.toISOString().replace(/(T00:00:00)?\.000Z$/, "") ?? ""
  };
  exports.floatTime = floatTime;
  exports.intTime = intTime;
  exports.timestamp = timestamp;
});

// node_modules/yaml/dist/schema/yaml-1.1/schema.js
var require_schema4 = __commonJS((exports) => {
  var map7 = require_map(), _null4 = require_null(), seq = require_seq(), string4 = require_string(), binary = require_binary(), bool = require_bool2(), float = require_float2(), int2 = require_int2(), merge3 = require_merge(), omap = require_omap(), pairs = require_pairs(), set2 = require_set(), timestamp = require_timestamp(), schema5 = [
    map7.map,
    seq.seq,
    string4.string,
    _null4.nullTag,
    bool.trueTag,
    bool.falseTag,
    int2.intBin,
    int2.intOct,
    int2.int,
    int2.intHex,
    float.floatNaN,
    float.floatExp,
    float.float,
    binary.binary,
    merge3.merge,
    omap.omap,
    pairs.pairs,
    set2.set,
    timestamp.intTime,
    timestamp.floatTime,
    timestamp.timestamp
  ];
  exports.schema = schema5;
});

// node_modules/yaml/dist/schema/tags.js
var require_tags = __commonJS((exports) => {
  var map7 = require_map(), _null4 = require_null(), seq = require_seq(), string4 = require_string(), bool = require_bool(), float = require_float(), int2 = require_int(), schema5 = require_schema2(), schema$1 = require_schema3(), binary = require_binary(), merge3 = require_merge(), omap = require_omap(), pairs = require_pairs(), schema$2 = require_schema4(), set2 = require_set(), timestamp = require_timestamp(), schemas3 = /* @__PURE__ */ new Map([
    ["core", schema5.schema],
    ["failsafe", [map7.map, seq.seq, string4.string]],
    ["json", schema$1.schema],
    ["yaml11", schema$2.schema],
    ["yaml-1.1", schema$2.schema]
  ]), tagsByName = {
    binary: binary.binary,
    bool: bool.boolTag,
    float: float.float,
    floatExp: float.floatExp,
    floatNaN: float.floatNaN,
    floatTime: timestamp.floatTime,
    int: int2.int,
    intHex: int2.intHex,
    intOct: int2.intOct,
    intTime: timestamp.intTime,
    map: map7.map,
    merge: merge3.merge,
    null: _null4.nullTag,
    omap: omap.omap,
    pairs: pairs.pairs,
    seq: seq.seq,
    set: set2.set,
    timestamp: timestamp.timestamp
  }, coreKnownTags = {
    "tag:yaml.org,2002:binary": binary.binary,
    "tag:yaml.org,2002:merge": merge3.merge,
    "tag:yaml.org,2002:omap": omap.omap,
    "tag:yaml.org,2002:pairs": pairs.pairs,
    "tag:yaml.org,2002:set": set2.set,
    "tag:yaml.org,2002:timestamp": timestamp.timestamp
  };
  function getTags(customTags, schemaName, addMergeTag) {
    let schemaTags = schemas3.get(schemaName);
    if (schemaTags && !customTags)
      return addMergeTag && !schemaTags.includes(merge3.merge) ? schemaTags.concat(merge3.merge) : schemaTags.slice();
    let tags = schemaTags;
    if (!tags)
      if (Array.isArray(customTags))
        tags = [];
      else {
        let keys2 = Array.from(schemas3.keys()).filter((key) => key !== "yaml11").map((key) => JSON.stringify(key)).join(", ");
        throw Error(`Unknown schema "${schemaName}"; use one of ${keys2} or define customTags array`);
      }
    if (Array.isArray(customTags))
      for (let tag of customTags)
        tags = tags.concat(tag);
    else if (typeof customTags === "function")
      tags = customTags(tags.slice());
    if (addMergeTag)
      tags = tags.concat(merge3.merge);
    return tags.reduce((tags2, tag) => {
      let tagObj = typeof tag === "string" ? tagsByName[tag] : tag;
      if (!tagObj) {
        let tagName = JSON.stringify(tag), keys2 = Object.keys(tagsByName).map((key) => JSON.stringify(key)).join(", ");
        throw Error(`Unknown custom tag ${tagName}; use one of ${keys2}`);
      }
      if (!tags2.includes(tagObj))
        tags2.push(tagObj);
      return tags2;
    }, []);
  }
  exports.coreKnownTags = coreKnownTags;
  exports.getTags = getTags;
});

// node_modules/yaml/dist/schema/Schema.js
var require_Schema = __commonJS((exports) => {
  var identity16 = require_identity(), map7 = require_map(), seq = require_seq(), string4 = require_string(), tags = require_tags(), sortMapEntriesByKey = (a2, b) => a2.key < b.key ? -1 : a2.key > b.key ? 1 : 0;

  class Schema {
    constructor({ compat: compat2, customTags, merge: merge3, resolveKnownTags, schema: schema5, sortMapEntries, toStringDefaults }) {
      this.compat = Array.isArray(compat2) ? tags.getTags(compat2, "compat") : compat2 ? tags.getTags(null, compat2) : null, this.name = typeof schema5 === "string" && schema5 || "core", this.knownTags = resolveKnownTags ? tags.coreKnownTags : {}, this.tags = tags.getTags(customTags, this.name, merge3), this.toStringOptions = toStringDefaults ?? null, Object.defineProperty(this, identity16.MAP, { value: map7.map }), Object.defineProperty(this, identity16.SCALAR, { value: string4.string }), Object.defineProperty(this, identity16.SEQ, { value: seq.seq }), this.sortMapEntries = typeof sortMapEntries === "function" ? sortMapEntries : sortMapEntries === !0 ? sortMapEntriesByKey : null;
    }
    clone() {
      let copy = Object.create(Schema.prototype, Object.getOwnPropertyDescriptors(this));
      return copy.tags = this.tags.slice(), copy;
    }
  }
  exports.Schema = Schema;
});

// node_modules/yaml/dist/stringify/stringifyDocument.js
var require_stringifyDocument = __commonJS((exports) => {
  var identity16 = require_identity(), stringify2 = require_stringify4(), stringifyComment = require_stringifyComment();
  function stringifyDocument(doc2, options) {
    let lines = [], hasDirectives = options.directives === !0;
    if (options.directives !== !1 && doc2.directives) {
      let dir = doc2.directives.toString(doc2);
      if (dir)
        lines.push(dir), hasDirectives = !0;
      else if (doc2.directives.docStart)
        hasDirectives = !0;
    }
    if (hasDirectives)
      lines.push("---");
    let ctx = stringify2.createStringifyContext(doc2, options), { commentString } = ctx.options;
    if (doc2.commentBefore) {
      if (lines.length !== 1)
        lines.unshift("");
      let cs = commentString(doc2.commentBefore);
      lines.unshift(stringifyComment.indentComment(cs, ""));
    }
    let chompKeep = !1, contentComment = null;
    if (doc2.contents) {
      if (identity16.isNode(doc2.contents)) {
        if (doc2.contents.spaceBefore && hasDirectives)
          lines.push("");
        if (doc2.contents.commentBefore) {
          let cs = commentString(doc2.contents.commentBefore);
          lines.push(stringifyComment.indentComment(cs, ""));
        }
        ctx.forceBlockIndent = !!doc2.comment, contentComment = doc2.contents.comment;
      }
      let onChompKeep = contentComment ? void 0 : () => chompKeep = !0, body = stringify2.stringify(doc2.contents, ctx, () => contentComment = null, onChompKeep);
      if (contentComment)
        body += stringifyComment.lineComment(body, "", commentString(contentComment));
      if ((body[0] === "|" || body[0] === ">") && lines[lines.length - 1] === "---")
        lines[lines.length - 1] = `--- ${body}`;
      else
        lines.push(body);
    } else
      lines.push(stringify2.stringify(doc2.contents, ctx));
    if (doc2.directives?.docEnd)
      if (doc2.comment) {
        let cs = commentString(doc2.comment);
        if (cs.includes(`
`))
          lines.push("..."), lines.push(stringifyComment.indentComment(cs, ""));
        else
          lines.push(`... ${cs}`);
      } else
        lines.push("...");
    else {
      let dc = doc2.comment;
      if (dc && chompKeep)
        dc = dc.replace(/^\n+/, "");
      if (dc) {
        if ((!chompKeep || contentComment) && lines[lines.length - 1] !== "")
          lines.push("");
        lines.push(stringifyComment.indentComment(commentString(dc), ""));
      }
    }
    return lines.join(`
`) + `
`;
  }
  exports.stringifyDocument = stringifyDocument;
});

// node_modules/yaml/dist/doc/Document.js
var require_Document = __commonJS((exports) => {
  var Alias = require_Alias(), Collection = require_Collection(), identity16 = require_identity(), Pair = require_Pair(), toJS = require_toJS(), Schema = require_Schema(), stringifyDocument = require_stringifyDocument(), anchors = require_anchors(), applyReviver = require_applyReviver(), createNode2 = require_createNode(), directives = require_directives();

  class Document {
    constructor(value, replacer, options) {
      this.commentBefore = null, this.comment = null, this.errors = [], this.warnings = [], Object.defineProperty(this, identity16.NODE_TYPE, { value: identity16.DOC });
      let _replacer = null;
      if (typeof replacer === "function" || Array.isArray(replacer))
        _replacer = replacer;
      else if (options === void 0 && replacer)
        options = replacer, replacer = void 0;
      let opt = Object.assign({
        intAsBigInt: !1,
        keepSourceTokens: !1,
        logLevel: "warn",
        prettyErrors: !0,
        strict: !0,
        stringKeys: !1,
        uniqueKeys: !0,
        version: "1.2"
      }, options);
      this.options = opt;
      let { version: version5 } = opt;
      if (options?._directives) {
        if (this.directives = options._directives.atDocument(), this.directives.yaml.explicit)
          version5 = this.directives.yaml.version;
      } else
        this.directives = new directives.Directives({ version: version5 });
      this.setSchema(version5, options), this.contents = value === void 0 ? null : this.createNode(value, _replacer, options);
    }
    clone() {
      let copy = Object.create(Document.prototype, {
        [identity16.NODE_TYPE]: { value: identity16.DOC }
      });
      if (copy.commentBefore = this.commentBefore, copy.comment = this.comment, copy.errors = this.errors.slice(), copy.warnings = this.warnings.slice(), copy.options = Object.assign({}, this.options), this.directives)
        copy.directives = this.directives.clone();
      if (copy.schema = this.schema.clone(), copy.contents = identity16.isNode(this.contents) ? this.contents.clone(copy.schema) : this.contents, this.range)
        copy.range = this.range.slice();
      return copy;
    }
    add(value) {
      if (assertCollection(this.contents))
        this.contents.add(value);
    }
    addIn(path12, value) {
      if (assertCollection(this.contents))
        this.contents.addIn(path12, value);
    }
    createAlias(node, name3) {
      if (!node.anchor) {
        let prev = anchors.anchorNames(this);
        node.anchor = !name3 || prev.has(name3) ? anchors.findNewAnchor(name3 || "a", prev) : name3;
      }
      return new Alias.Alias(node.anchor);
    }
    createNode(value, replacer, options) {
      let _replacer = void 0;
      if (typeof replacer === "function")
        value = replacer.call({ "": value }, "", value), _replacer = replacer;
      else if (Array.isArray(replacer)) {
        let keyToStr = (v2) => typeof v2 === "number" || v2 instanceof String || v2 instanceof Number, asStr = replacer.filter(keyToStr).map(String);
        if (asStr.length > 0)
          replacer = replacer.concat(asStr);
        _replacer = replacer;
      } else if (options === void 0 && replacer)
        options = replacer, replacer = void 0;
      let { aliasDuplicateObjects, anchorPrefix, flow, keepUndefined, onTagObj, tag } = options ?? {}, { onAnchor, setAnchors, sourceObjects } = anchors.createNodeAnchors(this, anchorPrefix || "a"), ctx = {
        aliasDuplicateObjects: aliasDuplicateObjects ?? !0,
        keepUndefined: keepUndefined ?? !1,
        onAnchor,
        onTagObj,
        replacer: _replacer,
        schema: this.schema,
        sourceObjects
      }, node = createNode2.createNode(value, tag, ctx);
      if (flow && identity16.isCollection(node))
        node.flow = !0;
      return setAnchors(), node;
    }
    createPair(key, value, options = {}) {
      let k3 = this.createNode(key, null, options), v2 = this.createNode(value, null, options);
      return new Pair.Pair(k3, v2);
    }
    delete(key) {
      return assertCollection(this.contents) ? this.contents.delete(key) : !1;
    }
    deleteIn(path12) {
      if (Collection.isEmptyPath(path12)) {
        if (this.contents == null)
          return !1;
        return this.contents = null, !0;
      }
      return assertCollection(this.contents) ? this.contents.deleteIn(path12) : !1;
    }
    get(key, keepScalar) {
      return identity16.isCollection(this.contents) ? this.contents.get(key, keepScalar) : void 0;
    }
    getIn(path12, keepScalar) {
      if (Collection.isEmptyPath(path12))
        return !keepScalar && identity16.isScalar(this.contents) ? this.contents.value : this.contents;
      return identity16.isCollection(this.contents) ? this.contents.getIn(path12, keepScalar) : void 0;
    }
    has(key) {
      return identity16.isCollection(this.contents) ? this.contents.has(key) : !1;
    }
    hasIn(path12) {
      if (Collection.isEmptyPath(path12))
        return this.contents !== void 0;
      return identity16.isCollection(this.contents) ? this.contents.hasIn(path12) : !1;
    }
    set(key, value) {
      if (this.contents == null)
        this.contents = Collection.collectionFromPath(this.schema, [key], value);
      else if (assertCollection(this.contents))
        this.contents.set(key, value);
    }
    setIn(path12, value) {
      if (Collection.isEmptyPath(path12))
        this.contents = value;
      else if (this.contents == null)
        this.contents = Collection.collectionFromPath(this.schema, Array.from(path12), value);
      else if (assertCollection(this.contents))
        this.contents.setIn(path12, value);
    }
    setSchema(version5, options = {}) {
      if (typeof version5 === "number")
        version5 = String(version5);
      let opt;
      switch (version5) {
        case "1.1":
          if (this.directives)
            this.directives.yaml.version = "1.1";
          else
            this.directives = new directives.Directives({ version: "1.1" });
          opt = { resolveKnownTags: !1, schema: "yaml-1.1" };
          break;
        case "1.2":
        case "next":
          if (this.directives)
            this.directives.yaml.version = version5;
          else
            this.directives = new directives.Directives({ version: version5 });
          opt = { resolveKnownTags: !0, schema: "core" };
          break;
        case null:
          if (this.directives)
            delete this.directives;
          opt = null;
          break;
        default: {
          let sv = JSON.stringify(version5);
          throw Error(`Expected '1.1', '1.2' or null as first argument, but found: ${sv}`);
        }
      }
      if (options.schema instanceof Object)
        this.schema = options.schema;
      else if (opt)
        this.schema = new Schema.Schema(Object.assign(opt, options));
      else
        throw Error("With a null YAML version, the { schema: Schema } option is required");
    }
    toJS({ json: json2, jsonArg, mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
      let ctx = {
        anchors: /* @__PURE__ */ new Map,
        doc: this,
        keep: !json2,
        mapAsMap: mapAsMap === !0,
        mapKeyWarned: !1,
        maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
      }, res = toJS.toJS(this.contents, jsonArg ?? "", ctx);
      if (typeof onAnchor === "function")
        for (let { count: count3, res: res2 } of ctx.anchors.values())
          onAnchor(res2, count3);
      return typeof reviver === "function" ? applyReviver.applyReviver(reviver, { "": res }, "", res) : res;
    }
    toJSON(jsonArg, onAnchor) {
      return this.toJS({ json: !0, jsonArg, mapAsMap: !1, onAnchor });
    }
    toString(options = {}) {
      if (this.errors.length > 0)
        throw Error("Document with errors cannot be stringified");
      if ("indent" in options && (!Number.isInteger(options.indent) || Number(options.indent) <= 0)) {
        let s2 = JSON.stringify(options.indent);
        throw Error(`"indent" option must be a positive integer, not ${s2}`);
      }
      return stringifyDocument.stringifyDocument(this, options);
    }
  }
  function assertCollection(contents) {
    if (identity16.isCollection(contents))
      return !0;
    throw Error("Expected a YAML collection as document contents");
  }
  exports.Document = Document;
});

// node_modules/yaml/dist/errors.js
var require_errors6 = __commonJS((exports) => {
  class YAMLError extends Error {
    constructor(name3, pos, code, message) {
      super();
      this.name = name3, this.code = code, this.message = message, this.pos = pos;
    }
  }

  class YAMLParseError extends YAMLError {
    constructor(pos, code, message) {
      super("YAMLParseError", pos, code, message);
    }
  }

  class YAMLWarning extends YAMLError {
    constructor(pos, code, message) {
      super("YAMLWarning", pos, code, message);
    }
  }
  var prettifyError2 = (src, lc) => (error44) => {
    if (error44.pos[0] === -1)
      return;
    error44.linePos = error44.pos.map((pos) => lc.linePos(pos));
    let { line, col } = error44.linePos[0];
    error44.message += ` at line ${line}, column ${col}`;
    let ci = col - 1, lineStr = src.substring(lc.lineStarts[line - 1], lc.lineStarts[line]).replace(/[\n\r]+$/, "");
    if (ci >= 60 && lineStr.length > 80) {
      let trimStart = Math.min(ci - 39, lineStr.length - 79);
      lineStr = "\u2026" + lineStr.substring(trimStart), ci -= trimStart - 1;
    }
    if (lineStr.length > 80)
      lineStr = lineStr.substring(0, 79) + "\u2026";
    if (line > 1 && /^ *$/.test(lineStr.substring(0, ci))) {
      let prev = src.substring(lc.lineStarts[line - 2], lc.lineStarts[line - 1]);
      if (prev.length > 80)
        prev = prev.substring(0, 79) + `\u2026
`;
      lineStr = prev + lineStr;
    }
    if (/[^ ]/.test(lineStr)) {
      let count3 = 1, end = error44.linePos[1];
      if (end?.line === line && end.col > col)
        count3 = Math.max(1, Math.min(end.col - col, 80 - ci));
      let pointer = " ".repeat(ci) + "^".repeat(count3);
      error44.message += `:

${lineStr}
${pointer}
`;
    }
  };
  exports.YAMLError = YAMLError;
  exports.YAMLParseError = YAMLParseError;
  exports.YAMLWarning = YAMLWarning;
  exports.prettifyError = prettifyError2;
});

// node_modules/yaml/dist/compose/resolve-props.js
var require_resolve_props = __commonJS((exports) => {
  function resolveProps(tokens, { flow, indicator, next, offset, onError, parentIndent, startOnNewline }) {
    let spaceBefore = !1, atNewline = startOnNewline, hasSpace = startOnNewline, comment = "", commentSep = "", hasNewline = !1, reqSpace = !1, tab = null, anchor = null, tag = null, newlineAfterProp = null, comma = null, found = null, start = null;
    for (let token of tokens) {
      if (reqSpace) {
        if (token.type !== "space" && token.type !== "newline" && token.type !== "comma")
          onError(token.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
        reqSpace = !1;
      }
      if (tab) {
        if (atNewline && token.type !== "comment" && token.type !== "newline")
          onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
        tab = null;
      }
      switch (token.type) {
        case "space":
          if (!flow && (indicator !== "doc-start" || next?.type !== "flow-collection") && token.source.includes("\t"))
            tab = token;
          hasSpace = !0;
          break;
        case "comment": {
          if (!hasSpace)
            onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
          let cb = token.source.substring(1) || " ";
          if (!comment)
            comment = cb;
          else
            comment += commentSep + cb;
          commentSep = "", atNewline = !1;
          break;
        }
        case "newline":
          if (atNewline) {
            if (comment)
              comment += token.source;
            else if (!found || indicator !== "seq-item-ind")
              spaceBefore = !0;
          } else
            commentSep += token.source;
          if (atNewline = !0, hasNewline = !0, anchor || tag)
            newlineAfterProp = token;
          hasSpace = !0;
          break;
        case "anchor":
          if (anchor)
            onError(token, "MULTIPLE_ANCHORS", "A node can have at most one anchor");
          if (token.source.endsWith(":"))
            onError(token.offset + token.source.length - 1, "BAD_ALIAS", "Anchor ending in : is ambiguous", !0);
          anchor = token, start ?? (start = token.offset), atNewline = !1, hasSpace = !1, reqSpace = !0;
          break;
        case "tag": {
          if (tag)
            onError(token, "MULTIPLE_TAGS", "A node can have at most one tag");
          tag = token, start ?? (start = token.offset), atNewline = !1, hasSpace = !1, reqSpace = !0;
          break;
        }
        case indicator:
          if (anchor || tag)
            onError(token, "BAD_PROP_ORDER", `Anchors and tags must be after the ${token.source} indicator`);
          if (found)
            onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.source} in ${flow ?? "collection"}`);
          found = token, atNewline = indicator === "seq-item-ind" || indicator === "explicit-key-ind", hasSpace = !1;
          break;
        case "comma":
          if (flow) {
            if (comma)
              onError(token, "UNEXPECTED_TOKEN", `Unexpected , in ${flow}`);
            comma = token, atNewline = !1, hasSpace = !1;
            break;
          }
        default:
          onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.type} token`), atNewline = !1, hasSpace = !1;
      }
    }
    let last2 = tokens[tokens.length - 1], end = last2 ? last2.offset + last2.source.length : offset;
    if (reqSpace && next && next.type !== "space" && next.type !== "newline" && next.type !== "comma" && (next.type !== "scalar" || next.source !== ""))
      onError(next.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
    if (tab && (atNewline && tab.indent <= parentIndent || next?.type === "block-map" || next?.type === "block-seq"))
      onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
    return {
      comma,
      found,
      spaceBefore,
      comment,
      hasNewline,
      anchor,
      tag,
      newlineAfterProp,
      end,
      start: start ?? end
    };
  }
  exports.resolveProps = resolveProps;
});

// node_modules/yaml/dist/compose/util-contains-newline.js
var require_util_contains_newline = __commonJS((exports) => {
  function containsNewline(key) {
    if (!key)
      return null;
    switch (key.type) {
      case "alias":
      case "scalar":
      case "double-quoted-scalar":
      case "single-quoted-scalar":
        if (key.source.includes(`
`))
          return !0;
        if (key.end) {
          for (let st of key.end)
            if (st.type === "newline")
              return !0;
        }
        return !1;
      case "flow-collection":
        for (let it of key.items) {
          for (let st of it.start)
            if (st.type === "newline")
              return !0;
          if (it.sep) {
            for (let st of it.sep)
              if (st.type === "newline")
                return !0;
          }
          if (containsNewline(it.key) || containsNewline(it.value))
            return !0;
        }
        return !1;
      default:
        return !0;
    }
  }
  exports.containsNewline = containsNewline;
});

// node_modules/yaml/dist/compose/util-flow-indent-check.js
var require_util_flow_indent_check = __commonJS((exports) => {
  var utilContainsNewline = require_util_contains_newline();
  function flowIndentCheck(indent, fc, onError) {
    if (fc?.type === "flow-collection") {
      let end = fc.end[0];
      if (end.indent === indent && (end.source === "]" || end.source === "}") && utilContainsNewline.containsNewline(fc))
        onError(end, "BAD_INDENT", "Flow end indicator should be more indented than parent", !0);
    }
  }
  exports.flowIndentCheck = flowIndentCheck;
});
