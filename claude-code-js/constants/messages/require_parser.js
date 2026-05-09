// var: require_parser
var require_parser = __commonJS((exports) => {
  var node_process = __require("process"), cst = require_cst(), lexer = require_lexer();
  function includesToken(list, type) {
    for (let i4 = 0;i4 < list.length; ++i4)
      if (list[i4].type === type)
        return !0;
    return !1;
  }
  function findNonEmptyIndex(list) {
    for (let i4 = 0;i4 < list.length; ++i4)
      switch (list[i4].type) {
        case "space":
        case "comment":
        case "newline":
          break;
        default:
          return i4;
      }
    return -1;
  }
  function isFlowToken(token) {
    switch (token?.type) {
      case "alias":
      case "scalar":
      case "single-quoted-scalar":
      case "double-quoted-scalar":
      case "flow-collection":
        return !0;
      default:
        return !1;
    }
  }
  function getPrevProps(parent) {
    switch (parent.type) {
      case "document":
        return parent.start;
      case "block-map": {
        let it = parent.items[parent.items.length - 1];
        return it.sep ?? it.start;
      }
      case "block-seq":
        return parent.items[parent.items.length - 1].start;
      default:
        return [];
    }
  }
  function getFirstKeyStartProps(prev) {
    if (prev.length === 0)
      return [];
    let i4 = prev.length;
    loop:
      while (--i4 >= 0)
        switch (prev[i4].type) {
          case "doc-start":
          case "explicit-key-ind":
          case "map-value-ind":
          case "seq-item-ind":
          case "newline":
            break loop;
        }
    while (prev[++i4]?.type === "space")
      ;
    return prev.splice(i4, prev.length);
  }
  function fixFlowSeqItems(fc) {
    if (fc.start.type === "flow-seq-start") {
      for (let it of fc.items)
        if (it.sep && !it.value && !includesToken(it.start, "explicit-key-ind") && !includesToken(it.sep, "map-value-ind")) {
          if (it.key)
            it.value = it.key;
          if (delete it.key, isFlowToken(it.value))
            if (it.value.end)
              Array.prototype.push.apply(it.value.end, it.sep);
            else
              it.value.end = it.sep;
          else
            Array.prototype.push.apply(it.start, it.sep);
          delete it.sep;
        }
    }
  }

  class Parser2 {
    constructor(onNewLine) {
      this.atNewLine = !0, this.atScalar = !1, this.indent = 0, this.offset = 0, this.onKeyLine = !1, this.stack = [], this.source = "", this.type = "", this.lexer = new lexer.Lexer, this.onNewLine = onNewLine;
    }
    *parse(source, incomplete = !1) {
      if (this.onNewLine && this.offset === 0)
        this.onNewLine(0);
      for (let lexeme of this.lexer.lex(source, incomplete))
        yield* this.next(lexeme);
      if (!incomplete)
        yield* this.end();
    }
    *next(source) {
      if (this.source = source, node_process.env.LOG_TOKENS)
        console.log("|", cst.prettyToken(source));
      if (this.atScalar) {
        this.atScalar = !1, yield* this.step(), this.offset += source.length;
        return;
      }
      let type = cst.tokenType(source);
      if (!type) {
        let message = `Not a YAML token: ${source}`;
        yield* this.pop({ type: "error", offset: this.offset, message, source }), this.offset += source.length;
      } else if (type === "scalar")
        this.atNewLine = !1, this.atScalar = !0, this.type = "scalar";
      else {
        switch (this.type = type, yield* this.step(), type) {
          case "newline":
            if (this.atNewLine = !0, this.indent = 0, this.onNewLine)
              this.onNewLine(this.offset + source.length);
            break;
          case "space":
            if (this.atNewLine && source[0] === " ")
              this.indent += source.length;
            break;
          case "explicit-key-ind":
          case "map-value-ind":
          case "seq-item-ind":
            if (this.atNewLine)
              this.indent += source.length;
            break;
          case "doc-mode":
          case "flow-error-end":
            return;
          default:
            this.atNewLine = !1;
        }
        this.offset += source.length;
      }
    }
    *end() {
      while (this.stack.length > 0)
        yield* this.pop();
    }
    get sourceToken() {
      return {
        type: this.type,
        offset: this.offset,
        indent: this.indent,
        source: this.source
      };
    }
    *step() {
      let top = this.peek(1);
      if (this.type === "doc-end" && top?.type !== "doc-end") {
        while (this.stack.length > 0)
          yield* this.pop();
        this.stack.push({
          type: "doc-end",
          offset: this.offset,
          source: this.source
        });
        return;
      }
      if (!top)
        return yield* this.stream();
      switch (top.type) {
        case "document":
          return yield* this.document(top);
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
          return yield* this.scalar(top);
        case "block-scalar":
          return yield* this.blockScalar(top);
        case "block-map":
          return yield* this.blockMap(top);
        case "block-seq":
          return yield* this.blockSequence(top);
        case "flow-collection":
          return yield* this.flowCollection(top);
        case "doc-end":
          return yield* this.documentEnd(top);
      }
      yield* this.pop();
    }
    peek(n5) {
      return this.stack[this.stack.length - n5];
    }
    *pop(error44) {
      let token = error44 ?? this.stack.pop();
      if (!token)
        yield { type: "error", offset: this.offset, source: "", message: "Tried to pop an empty stack" };
      else if (this.stack.length === 0)
        yield token;
      else {
        let top = this.peek(1);
        if (token.type === "block-scalar")
          token.indent = "indent" in top ? top.indent : 0;
        else if (token.type === "flow-collection" && top.type === "document")
          token.indent = 0;
        if (token.type === "flow-collection")
          fixFlowSeqItems(token);
        switch (top.type) {
          case "document":
            top.value = token;
            break;
          case "block-scalar":
            top.props.push(token);
            break;
          case "block-map": {
            let it = top.items[top.items.length - 1];
            if (it.value) {
              top.items.push({ start: [], key: token, sep: [] }), this.onKeyLine = !0;
              return;
            } else if (it.sep)
              it.value = token;
            else {
              Object.assign(it, { key: token, sep: [] }), this.onKeyLine = !it.explicitKey;
              return;
            }
            break;
          }
          case "block-seq": {
            let it = top.items[top.items.length - 1];
            if (it.value)
              top.items.push({ start: [], value: token });
            else
              it.value = token;
            break;
          }
          case "flow-collection": {
            let it = top.items[top.items.length - 1];
            if (!it || it.value)
              top.items.push({ start: [], key: token, sep: [] });
            else if (it.sep)
              it.value = token;
            else
              Object.assign(it, { key: token, sep: [] });
            return;
          }
          default:
            yield* this.pop(), yield* this.pop(token);
        }
        if ((top.type === "document" || top.type === "block-map" || top.type === "block-seq") && (token.type === "block-map" || token.type === "block-seq")) {
          let last2 = token.items[token.items.length - 1];
          if (last2 && !last2.sep && !last2.value && last2.start.length > 0 && findNonEmptyIndex(last2.start) === -1 && (token.indent === 0 || last2.start.every((st) => st.type !== "comment" || st.indent < token.indent))) {
            if (top.type === "document")
              top.end = last2.start;
            else
              top.items.push({ start: last2.start });
            token.items.splice(-1, 1);
          }
        }
      }
    }
    *stream() {
      switch (this.type) {
        case "directive-line":
          yield { type: "directive", offset: this.offset, source: this.source };
          return;
        case "byte-order-mark":
        case "space":
        case "comment":
        case "newline":
          yield this.sourceToken;
          return;
        case "doc-mode":
        case "doc-start": {
          let doc2 = {
            type: "document",
            offset: this.offset,
            start: []
          };
          if (this.type === "doc-start")
            doc2.start.push(this.sourceToken);
          this.stack.push(doc2);
          return;
        }
      }
      yield {
        type: "error",
        offset: this.offset,
        message: `Unexpected ${this.type} token in YAML stream`,
        source: this.source
      };
    }
    *document(doc2) {
      if (doc2.value)
        return yield* this.lineEnd(doc2);
      switch (this.type) {
        case "doc-start": {
          if (findNonEmptyIndex(doc2.start) !== -1)
            yield* this.pop(), yield* this.step();
          else
            doc2.start.push(this.sourceToken);
          return;
        }
        case "anchor":
        case "tag":
        case "space":
        case "comment":
        case "newline":
          doc2.start.push(this.sourceToken);
          return;
      }
      let bv = this.startBlockValue(doc2);
      if (bv)
        this.stack.push(bv);
      else
        yield {
          type: "error",
          offset: this.offset,
          message: `Unexpected ${this.type} token in YAML document`,
          source: this.source
        };
    }
    *scalar(scalar) {
      if (this.type === "map-value-ind") {
        let prev = getPrevProps(this.peek(2)), start = getFirstKeyStartProps(prev), sep7;
        if (scalar.end)
          sep7 = scalar.end, sep7.push(this.sourceToken), delete scalar.end;
        else
          sep7 = [this.sourceToken];
        let map7 = {
          type: "block-map",
          offset: scalar.offset,
          indent: scalar.indent,
          items: [{ start, key: scalar, sep: sep7 }]
        };
        this.onKeyLine = !0, this.stack[this.stack.length - 1] = map7;
      } else
        yield* this.lineEnd(scalar);
    }
    *blockScalar(scalar) {
      switch (this.type) {
        case "space":
        case "comment":
        case "newline":
          scalar.props.push(this.sourceToken);
          return;
        case "scalar":
          if (scalar.source = this.source, this.atNewLine = !0, this.indent = 0, this.onNewLine) {
            let nl = this.source.indexOf(`
`) + 1;
            while (nl !== 0)
              this.onNewLine(this.offset + nl), nl = this.source.indexOf(`
`, nl) + 1;
          }
          yield* this.pop();
          break;
        default:
          yield* this.pop(), yield* this.step();
      }
    }
    *blockMap(map7) {
      let it = map7.items[map7.items.length - 1];
      switch (this.type) {
        case "newline":
          if (this.onKeyLine = !1, it.value) {
            let end = "end" in it.value ? it.value.end : void 0;
            if ((Array.isArray(end) ? end[end.length - 1] : void 0)?.type === "comment")
              end?.push(this.sourceToken);
            else
              map7.items.push({ start: [this.sourceToken] });
          } else if (it.sep)
            it.sep.push(this.sourceToken);
          else
            it.start.push(this.sourceToken);
          return;
        case "space":
        case "comment":
          if (it.value)
            map7.items.push({ start: [this.sourceToken] });
          else if (it.sep)
            it.sep.push(this.sourceToken);
          else {
            if (this.atIndentedComment(it.start, map7.indent)) {
              let end = map7.items[map7.items.length - 2]?.value?.end;
              if (Array.isArray(end)) {
                Array.prototype.push.apply(end, it.start), end.push(this.sourceToken), map7.items.pop();
                return;
              }
            }
            it.start.push(this.sourceToken);
          }
          return;
      }
      if (this.indent >= map7.indent) {
        let atMapIndent = !this.onKeyLine && this.indent === map7.indent, atNextItem = atMapIndent && (it.sep || it.explicitKey) && this.type !== "seq-item-ind", start = [];
        if (atNextItem && it.sep && !it.value) {
          let nl = [];
          for (let i4 = 0;i4 < it.sep.length; ++i4) {
            let st = it.sep[i4];
            switch (st.type) {
              case "newline":
                nl.push(i4);
                break;
              case "space":
                break;
              case "comment":
                if (st.indent > map7.indent)
                  nl.length = 0;
                break;
              default:
                nl.length = 0;
            }
          }
          if (nl.length >= 2)
            start = it.sep.splice(nl[1]);
        }
        switch (this.type) {
          case "anchor":
          case "tag":
            if (atNextItem || it.value)
              start.push(this.sourceToken), map7.items.push({ start }), this.onKeyLine = !0;
            else if (it.sep)
              it.sep.push(this.sourceToken);
            else
              it.start.push(this.sourceToken);
            return;
          case "explicit-key-ind":
            if (!it.sep && !it.explicitKey)
              it.start.push(this.sourceToken), it.explicitKey = !0;
            else if (atNextItem || it.value)
              start.push(this.sourceToken), map7.items.push({ start, explicitKey: !0 });
            else
              this.stack.push({
                type: "block-map",
                offset: this.offset,
                indent: this.indent,
                items: [{ start: [this.sourceToken], explicitKey: !0 }]
              });
            this.onKeyLine = !0;
            return;
          case "map-value-ind":
            if (it.explicitKey)
              if (!it.sep)
                if (includesToken(it.start, "newline"))
                  Object.assign(it, { key: null, sep: [this.sourceToken] });
                else {
                  let start2 = getFirstKeyStartProps(it.start);
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: start2, key: null, sep: [this.sourceToken] }]
                  });
                }
              else if (it.value)
                map7.items.push({ start: [], key: null, sep: [this.sourceToken] });
              else if (includesToken(it.sep, "map-value-ind"))
                this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{ start, key: null, sep: [this.sourceToken] }]
                });
              else if (isFlowToken(it.key) && !includesToken(it.sep, "newline")) {
                let start2 = getFirstKeyStartProps(it.start), key = it.key, sep7 = it.sep;
                sep7.push(this.sourceToken), delete it.key, delete it.sep, this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{ start: start2, key, sep: sep7 }]
                });
              } else if (start.length > 0)
                it.sep = it.sep.concat(start, this.sourceToken);
              else
                it.sep.push(this.sourceToken);
            else if (!it.sep)
              Object.assign(it, { key: null, sep: [this.sourceToken] });
            else if (it.value || atNextItem)
              map7.items.push({ start, key: null, sep: [this.sourceToken] });
            else if (includesToken(it.sep, "map-value-ind"))
              this.stack.push({
                type: "block-map",
                offset: this.offset,
                indent: this.indent,
                items: [{ start: [], key: null, sep: [this.sourceToken] }]
              });
            else
              it.sep.push(this.sourceToken);
            this.onKeyLine = !0;
            return;
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar": {
            let fs9 = this.flowScalar(this.type);
            if (atNextItem || it.value)
              map7.items.push({ start, key: fs9, sep: [] }), this.onKeyLine = !0;
            else if (it.sep)
              this.stack.push(fs9);
            else
              Object.assign(it, { key: fs9, sep: [] }), this.onKeyLine = !0;
            return;
          }
          default: {
            let bv = this.startBlockValue(map7);
            if (bv) {
              if (bv.type === "block-seq") {
                if (!it.explicitKey && it.sep && !includesToken(it.sep, "newline")) {
                  yield* this.pop({
                    type: "error",
                    offset: this.offset,
                    message: "Unexpected block-seq-ind on same line with key",
                    source: this.source
                  });
                  return;
                }
              } else if (atMapIndent)
                map7.items.push({ start });
              this.stack.push(bv);
              return;
            }
          }
        }
      }
      yield* this.pop(), yield* this.step();
    }
    *blockSequence(seq) {
      let it = seq.items[seq.items.length - 1];
      switch (this.type) {
        case "newline":
          if (it.value) {
            let end = "end" in it.value ? it.value.end : void 0;
            if ((Array.isArray(end) ? end[end.length - 1] : void 0)?.type === "comment")
              end?.push(this.sourceToken);
            else
              seq.items.push({ start: [this.sourceToken] });
          } else
            it.start.push(this.sourceToken);
          return;
        case "space":
        case "comment":
          if (it.value)
            seq.items.push({ start: [this.sourceToken] });
          else {
            if (this.atIndentedComment(it.start, seq.indent)) {
              let end = seq.items[seq.items.length - 2]?.value?.end;
              if (Array.isArray(end)) {
                Array.prototype.push.apply(end, it.start), end.push(this.sourceToken), seq.items.pop();
                return;
              }
            }
            it.start.push(this.sourceToken);
          }
          return;
        case "anchor":
        case "tag":
          if (it.value || this.indent <= seq.indent)
            break;
          it.start.push(this.sourceToken);
          return;
        case "seq-item-ind":
          if (this.indent !== seq.indent)
            break;
          if (it.value || includesToken(it.start, "seq-item-ind"))
            seq.items.push({ start: [this.sourceToken] });
          else
            it.start.push(this.sourceToken);
          return;
      }
      if (this.indent > seq.indent) {
        let bv = this.startBlockValue(seq);
        if (bv) {
          this.stack.push(bv);
          return;
        }
      }
      yield* this.pop(), yield* this.step();
    }
    *flowCollection(fc) {
      let it = fc.items[fc.items.length - 1];
      if (this.type === "flow-error-end") {
        let top;
        do
          yield* this.pop(), top = this.peek(1);
        while (top?.type === "flow-collection");
      } else if (fc.end.length === 0) {
        switch (this.type) {
          case "comma":
          case "explicit-key-ind":
            if (!it || it.sep)
              fc.items.push({ start: [this.sourceToken] });
            else
              it.start.push(this.sourceToken);
            return;
          case "map-value-ind":
            if (!it || it.value)
              fc.items.push({ start: [], key: null, sep: [this.sourceToken] });
            else if (it.sep)
              it.sep.push(this.sourceToken);
            else
              Object.assign(it, { key: null, sep: [this.sourceToken] });
            return;
          case "space":
          case "comment":
          case "newline":
          case "anchor":
          case "tag":
            if (!it || it.value)
              fc.items.push({ start: [this.sourceToken] });
            else if (it.sep)
              it.sep.push(this.sourceToken);
            else
              it.start.push(this.sourceToken);
            return;
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar": {
            let fs9 = this.flowScalar(this.type);
            if (!it || it.value)
              fc.items.push({ start: [], key: fs9, sep: [] });
            else if (it.sep)
              this.stack.push(fs9);
            else
              Object.assign(it, { key: fs9, sep: [] });
            return;
          }
          case "flow-map-end":
          case "flow-seq-end":
            fc.end.push(this.sourceToken);
            return;
        }
        let bv = this.startBlockValue(fc);
        if (bv)
          this.stack.push(bv);
        else
          yield* this.pop(), yield* this.step();
      } else {
        let parent = this.peek(2);
        if (parent.type === "block-map" && (this.type === "map-value-ind" && parent.indent === fc.indent || this.type === "newline" && !parent.items[parent.items.length - 1].sep))
          yield* this.pop(), yield* this.step();
        else if (this.type === "map-value-ind" && parent.type !== "flow-collection") {
          let prev = getPrevProps(parent), start = getFirstKeyStartProps(prev);
          fixFlowSeqItems(fc);
          let sep7 = fc.end.splice(1, fc.end.length);
          sep7.push(this.sourceToken);
          let map7 = {
            type: "block-map",
            offset: fc.offset,
            indent: fc.indent,
            items: [{ start, key: fc, sep: sep7 }]
          };
          this.onKeyLine = !0, this.stack[this.stack.length - 1] = map7;
        } else
          yield* this.lineEnd(fc);
      }
    }
    flowScalar(type) {
      if (this.onNewLine) {
        let nl = this.source.indexOf(`
`) + 1;
        while (nl !== 0)
          this.onNewLine(this.offset + nl), nl = this.source.indexOf(`
`, nl) + 1;
      }
      return {
        type,
        offset: this.offset,
        indent: this.indent,
        source: this.source
      };
    }
    startBlockValue(parent) {
      switch (this.type) {
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
          return this.flowScalar(this.type);
        case "block-scalar-header":
          return {
            type: "block-scalar",
            offset: this.offset,
            indent: this.indent,
            props: [this.sourceToken],
            source: ""
          };
        case "flow-map-start":
        case "flow-seq-start":
          return {
            type: "flow-collection",
            offset: this.offset,
            indent: this.indent,
            start: this.sourceToken,
            items: [],
            end: []
          };
        case "seq-item-ind":
          return {
            type: "block-seq",
            offset: this.offset,
            indent: this.indent,
            items: [{ start: [this.sourceToken] }]
          };
        case "explicit-key-ind": {
          this.onKeyLine = !0;
          let prev = getPrevProps(parent), start = getFirstKeyStartProps(prev);
          return start.push(this.sourceToken), {
            type: "block-map",
            offset: this.offset,
            indent: this.indent,
            items: [{ start, explicitKey: !0 }]
          };
        }
        case "map-value-ind": {
          this.onKeyLine = !0;
          let prev = getPrevProps(parent), start = getFirstKeyStartProps(prev);
          return {
            type: "block-map",
            offset: this.offset,
            indent: this.indent,
            items: [{ start, key: null, sep: [this.sourceToken] }]
          };
        }
      }
      return null;
    }
    atIndentedComment(start, indent) {
      if (this.type !== "comment")
        return !1;
      if (this.indent <= indent)
        return !1;
      return start.every((st) => st.type === "newline" || st.type === "space");
    }
    *documentEnd(docEnd) {
      if (this.type !== "doc-mode") {
        if (docEnd.end)
          docEnd.end.push(this.sourceToken);
        else
          docEnd.end = [this.sourceToken];
        if (this.type === "newline")
          yield* this.pop();
      }
    }
    *lineEnd(token) {
      switch (this.type) {
        case "comma":
        case "doc-start":
        case "doc-end":
        case "flow-seq-end":
        case "flow-map-end":
        case "map-value-ind":
          yield* this.pop(), yield* this.step();
          break;
        case "newline":
          this.onKeyLine = !1;
        case "space":
        case "comment":
        default:
          if (token.end)
            token.end.push(this.sourceToken);
          else
            token.end = [this.sourceToken];
          if (this.type === "newline")
            yield* this.pop();
      }
    }
  }
  exports.Parser = Parser2;
});
