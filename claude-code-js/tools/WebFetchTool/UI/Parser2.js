// class: Parser2
class Parser2 {
  constructor(cbs, options2 = {}) {
    var _a4, _b2, _c118, _d, _e, _f;
    this.options = options2, this.startIndex = 0, this.endIndex = 0, this.openTagStart = 0, this.tagname = "", this.attribname = "", this.attribvalue = "", this.attribs = null, this.stack = [], this.buffers = [], this.bufferOffset = 0, this.writeIndex = 0, this.ended = !1, this.cbs = cbs !== null && cbs !== void 0 ? cbs : {}, this.htmlMode = !this.options.xmlMode, this.lowerCaseTagNames = (_a4 = options2.lowerCaseTags) !== null && _a4 !== void 0 ? _a4 : this.htmlMode, this.lowerCaseAttributeNames = (_b2 = options2.lowerCaseAttributeNames) !== null && _b2 !== void 0 ? _b2 : this.htmlMode, this.recognizeSelfClosing = (_c118 = options2.recognizeSelfClosing) !== null && _c118 !== void 0 ? _c118 : !this.htmlMode, this.tokenizer = new ((_d = options2.Tokenizer) !== null && _d !== void 0 ? _d : Tokenizer)(this.options, this), this.foreignContext = [!this.htmlMode], (_f = (_e = this.cbs).onparserinit) === null || _f === void 0 || _f.call(_e, this);
  }
  ontext(start, endIndex) {
    var _a4, _b2;
    let data = this.getSlice(start, endIndex);
    this.endIndex = endIndex - 1, (_b2 = (_a4 = this.cbs).ontext) === null || _b2 === void 0 || _b2.call(_a4, data), this.startIndex = endIndex;
  }
  ontextentity(cp, endIndex) {
    var _a4, _b2;
    this.endIndex = endIndex - 1, (_b2 = (_a4 = this.cbs).ontext) === null || _b2 === void 0 || _b2.call(_a4, fromCodePoint(cp)), this.startIndex = endIndex;
  }
  isVoidElement(name3) {
    return this.htmlMode && voidElements.has(name3);
  }
  onopentagname(start, endIndex) {
    this.endIndex = endIndex;
    let name3 = this.getSlice(start, endIndex);
    if (this.lowerCaseTagNames)
      name3 = name3.toLowerCase();
    this.emitOpenTag(name3);
  }
  emitOpenTag(name3) {
    var _a4, _b2, _c118, _d;
    this.openTagStart = this.startIndex, this.tagname = name3;
    let impliesClose = this.htmlMode && openImpliesClose.get(name3);
    if (impliesClose)
      while (this.stack.length > 0 && impliesClose.has(this.stack[0])) {
        let element = this.stack.shift();
        (_b2 = (_a4 = this.cbs).onclosetag) === null || _b2 === void 0 || _b2.call(_a4, element, !0);
      }
    if (!this.isVoidElement(name3)) {
      if (this.stack.unshift(name3), this.htmlMode) {
        if (foreignContextElements.has(name3))
          this.foreignContext.unshift(!0);
        else if (htmlIntegrationElements.has(name3))
          this.foreignContext.unshift(!1);
      }
    }
    if ((_d = (_c118 = this.cbs).onopentagname) === null || _d === void 0 || _d.call(_c118, name3), this.cbs.onopentag)
      this.attribs = {};
  }
  endOpenTag(isImplied) {
    var _a4, _b2;
    if (this.startIndex = this.openTagStart, this.attribs)
      (_b2 = (_a4 = this.cbs).onopentag) === null || _b2 === void 0 || _b2.call(_a4, this.tagname, this.attribs, isImplied), this.attribs = null;
    if (this.cbs.onclosetag && this.isVoidElement(this.tagname))
      this.cbs.onclosetag(this.tagname, !0);
    this.tagname = "";
  }
  onopentagend(endIndex) {
    this.endIndex = endIndex, this.endOpenTag(!1), this.startIndex = endIndex + 1;
  }
  onclosetag(start, endIndex) {
    var _a4, _b2, _c118, _d, _e, _f, _g, _h;
    this.endIndex = endIndex;
    let name3 = this.getSlice(start, endIndex);
    if (this.lowerCaseTagNames)
      name3 = name3.toLowerCase();
    if (this.htmlMode && (foreignContextElements.has(name3) || htmlIntegrationElements.has(name3)))
      this.foreignContext.shift();
    if (!this.isVoidElement(name3)) {
      let pos = this.stack.indexOf(name3);
      if (pos !== -1)
        for (let index = 0;index <= pos; index++) {
          let element = this.stack.shift();
          (_b2 = (_a4 = this.cbs).onclosetag) === null || _b2 === void 0 || _b2.call(_a4, element, index !== pos);
        }
      else if (this.htmlMode && name3 === "p")
        this.emitOpenTag("p"), this.closeCurrentTag(!0);
    } else if (this.htmlMode && name3 === "br")
      (_d = (_c118 = this.cbs).onopentagname) === null || _d === void 0 || _d.call(_c118, "br"), (_f = (_e = this.cbs).onopentag) === null || _f === void 0 || _f.call(_e, "br", {}, !0), (_h = (_g = this.cbs).onclosetag) === null || _h === void 0 || _h.call(_g, "br", !1);
    this.startIndex = endIndex + 1;
  }
  onselfclosingtag(endIndex) {
    if (this.endIndex = endIndex, this.recognizeSelfClosing || this.foreignContext[0])
      this.closeCurrentTag(!1), this.startIndex = endIndex + 1;
    else
      this.onopentagend(endIndex);
  }
  closeCurrentTag(isOpenImplied) {
    var _a4, _b2;
    let name3 = this.tagname;
    if (this.endOpenTag(isOpenImplied), this.stack[0] === name3)
      (_b2 = (_a4 = this.cbs).onclosetag) === null || _b2 === void 0 || _b2.call(_a4, name3, !isOpenImplied), this.stack.shift();
  }
  onattribname(start, endIndex) {
    this.startIndex = start;
    let name3 = this.getSlice(start, endIndex);
    this.attribname = this.lowerCaseAttributeNames ? name3.toLowerCase() : name3;
  }
  onattribdata(start, endIndex) {
    this.attribvalue += this.getSlice(start, endIndex);
  }
  onattribentity(cp) {
    this.attribvalue += fromCodePoint(cp);
  }
  onattribend(quote2, endIndex) {
    var _a4, _b2;
    if (this.endIndex = endIndex, (_b2 = (_a4 = this.cbs).onattribute) === null || _b2 === void 0 || _b2.call(_a4, this.attribname, this.attribvalue, quote2 === QuoteType.Double ? '"' : quote2 === QuoteType.Single ? "'" : quote2 === QuoteType.NoValue ? void 0 : null), this.attribs && !Object.prototype.hasOwnProperty.call(this.attribs, this.attribname))
      this.attribs[this.attribname] = this.attribvalue;
    this.attribvalue = "";
  }
  getInstructionName(value) {
    let index = value.search(reNameEnd), name3 = index < 0 ? value : value.substr(0, index);
    if (this.lowerCaseTagNames)
      name3 = name3.toLowerCase();
    return name3;
  }
  ondeclaration(start, endIndex) {
    this.endIndex = endIndex;
    let value = this.getSlice(start, endIndex);
    if (this.cbs.onprocessinginstruction) {
      let name3 = this.getInstructionName(value);
      this.cbs.onprocessinginstruction(`!${name3}`, `!${value}`);
    }
    this.startIndex = endIndex + 1;
  }
  onprocessinginstruction(start, endIndex) {
    this.endIndex = endIndex;
    let value = this.getSlice(start, endIndex);
    if (this.cbs.onprocessinginstruction) {
      let name3 = this.getInstructionName(value);
      this.cbs.onprocessinginstruction(`?${name3}`, `?${value}`);
    }
    this.startIndex = endIndex + 1;
  }
  oncomment(start, endIndex, offset) {
    var _a4, _b2, _c118, _d;
    this.endIndex = endIndex, (_b2 = (_a4 = this.cbs).oncomment) === null || _b2 === void 0 || _b2.call(_a4, this.getSlice(start, endIndex - offset)), (_d = (_c118 = this.cbs).oncommentend) === null || _d === void 0 || _d.call(_c118), this.startIndex = endIndex + 1;
  }
  oncdata(start, endIndex, offset) {
    var _a4, _b2, _c118, _d, _e, _f, _g, _h, _j, _k;
    this.endIndex = endIndex;
    let value = this.getSlice(start, endIndex - offset);
    if (!this.htmlMode || this.options.recognizeCDATA)
      (_b2 = (_a4 = this.cbs).oncdatastart) === null || _b2 === void 0 || _b2.call(_a4), (_d = (_c118 = this.cbs).ontext) === null || _d === void 0 || _d.call(_c118, value), (_f = (_e = this.cbs).oncdataend) === null || _f === void 0 || _f.call(_e);
    else
      (_h = (_g = this.cbs).oncomment) === null || _h === void 0 || _h.call(_g, `[CDATA[${value}]]`), (_k = (_j = this.cbs).oncommentend) === null || _k === void 0 || _k.call(_j);
    this.startIndex = endIndex + 1;
  }
  onend() {
    var _a4, _b2;
    if (this.cbs.onclosetag) {
      this.endIndex = this.startIndex;
      for (let index = 0;index < this.stack.length; index++)
        this.cbs.onclosetag(this.stack[index], !0);
    }
    (_b2 = (_a4 = this.cbs).onend) === null || _b2 === void 0 || _b2.call(_a4);
  }
  reset() {
    var _a4, _b2, _c118, _d;
    (_b2 = (_a4 = this.cbs).onreset) === null || _b2 === void 0 || _b2.call(_a4), this.tokenizer.reset(), this.tagname = "", this.attribname = "", this.attribs = null, this.stack.length = 0, this.startIndex = 0, this.endIndex = 0, (_d = (_c118 = this.cbs).onparserinit) === null || _d === void 0 || _d.call(_c118, this), this.buffers.length = 0, this.foreignContext.length = 0, this.foreignContext.unshift(!this.htmlMode), this.bufferOffset = 0, this.writeIndex = 0, this.ended = !1;
  }
  parseComplete(data) {
    this.reset(), this.end(data);
  }
  getSlice(start, end) {
    while (start - this.bufferOffset >= this.buffers[0].length)
      this.shiftBuffer();
    let slice = this.buffers[0].slice(start - this.bufferOffset, end - this.bufferOffset);
    while (end - this.bufferOffset > this.buffers[0].length)
      this.shiftBuffer(), slice += this.buffers[0].slice(0, end - this.bufferOffset);
    return slice;
  }
  shiftBuffer() {
    this.bufferOffset += this.buffers[0].length, this.writeIndex--, this.buffers.shift();
  }
  write(chunk) {
    var _a4, _b2;
    if (this.ended) {
      (_b2 = (_a4 = this.cbs).onerror) === null || _b2 === void 0 || _b2.call(_a4, Error(".write() after done!"));
      return;
    }
    if (this.buffers.push(chunk), this.tokenizer.running)
      this.tokenizer.write(chunk), this.writeIndex++;
  }
  end(chunk) {
    var _a4, _b2;
    if (this.ended) {
      (_b2 = (_a4 = this.cbs).onerror) === null || _b2 === void 0 || _b2.call(_a4, Error(".end() after done!"));
      return;
    }
    if (chunk)
      this.write(chunk);
    this.ended = !0, this.tokenizer.end();
  }
  pause() {
    this.tokenizer.pause();
  }
  resume() {
    this.tokenizer.resume();
    while (this.tokenizer.running && this.writeIndex < this.buffers.length)
      this.tokenizer.write(this.buffers[this.writeIndex++]);
    if (this.ended)
      this.tokenizer.end();
  }
  parseChunk(chunk) {
    this.write(chunk);
  }
  done(chunk) {
    this.end(chunk);
  }
}
