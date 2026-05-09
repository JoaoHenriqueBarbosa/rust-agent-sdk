// class: Tokenizer
class Tokenizer {
  constructor({ xmlMode = !1, decodeEntities = !0 }, cbs) {
    this.cbs = cbs, this.state = State.Text, this.buffer = "", this.sectionStart = 0, this.index = 0, this.entityStart = 0, this.baseState = State.Text, this.isSpecial = !1, this.running = !0, this.offset = 0, this.currentSequence = void 0, this.sequenceIndex = 0, this.xmlMode = xmlMode, this.decodeEntities = decodeEntities, this.entityDecoder = new EntityDecoder(xmlMode ? xmlDecodeTree : htmlDecodeTree, (cp, consumed) => this.emitCodePoint(cp, consumed));
  }
  reset() {
    this.state = State.Text, this.buffer = "", this.sectionStart = 0, this.index = 0, this.baseState = State.Text, this.currentSequence = void 0, this.running = !0, this.offset = 0;
  }
  write(chunk) {
    this.offset += this.buffer.length, this.buffer = chunk, this.parse();
  }
  end() {
    if (this.running)
      this.finish();
  }
  pause() {
    this.running = !1;
  }
  resume() {
    if (this.running = !0, this.index < this.buffer.length + this.offset)
      this.parse();
  }
  stateText(c3) {
    if (c3 === CharCodes2.Lt || !this.decodeEntities && this.fastForwardTo(CharCodes2.Lt)) {
      if (this.index > this.sectionStart)
        this.cbs.ontext(this.sectionStart, this.index);
      this.state = State.BeforeTagName, this.sectionStart = this.index;
    } else if (this.decodeEntities && c3 === CharCodes2.Amp)
      this.startEntity();
  }
  stateSpecialStartSequence(c3) {
    let isEnd = this.sequenceIndex === this.currentSequence.length;
    if (!(isEnd ? isEndOfTagSection(c3) : (c3 | 32) === this.currentSequence[this.sequenceIndex]))
      this.isSpecial = !1;
    else if (!isEnd) {
      this.sequenceIndex++;
      return;
    }
    this.sequenceIndex = 0, this.state = State.InTagName, this.stateInTagName(c3);
  }
  stateInSpecialTag(c3) {
    if (this.sequenceIndex === this.currentSequence.length) {
      if (c3 === CharCodes2.Gt || isWhitespace(c3)) {
        let endOfText = this.index - this.currentSequence.length;
        if (this.sectionStart < endOfText) {
          let actualIndex = this.index;
          this.index = endOfText, this.cbs.ontext(this.sectionStart, endOfText), this.index = actualIndex;
        }
        this.isSpecial = !1, this.sectionStart = endOfText + 2, this.stateInClosingTagName(c3);
        return;
      }
      this.sequenceIndex = 0;
    }
    if ((c3 | 32) === this.currentSequence[this.sequenceIndex])
      this.sequenceIndex += 1;
    else if (this.sequenceIndex === 0) {
      if (this.currentSequence === Sequences.TitleEnd) {
        if (this.decodeEntities && c3 === CharCodes2.Amp)
          this.startEntity();
      } else if (this.fastForwardTo(CharCodes2.Lt))
        this.sequenceIndex = 1;
    } else
      this.sequenceIndex = Number(c3 === CharCodes2.Lt);
  }
  stateCDATASequence(c3) {
    if (c3 === Sequences.Cdata[this.sequenceIndex]) {
      if (++this.sequenceIndex === Sequences.Cdata.length)
        this.state = State.InCommentLike, this.currentSequence = Sequences.CdataEnd, this.sequenceIndex = 0, this.sectionStart = this.index + 1;
    } else
      this.sequenceIndex = 0, this.state = State.InDeclaration, this.stateInDeclaration(c3);
  }
  fastForwardTo(c3) {
    while (++this.index < this.buffer.length + this.offset)
      if (this.buffer.charCodeAt(this.index - this.offset) === c3)
        return !0;
    return this.index = this.buffer.length + this.offset - 1, !1;
  }
  stateInCommentLike(c3) {
    if (c3 === this.currentSequence[this.sequenceIndex]) {
      if (++this.sequenceIndex === this.currentSequence.length) {
        if (this.currentSequence === Sequences.CdataEnd)
          this.cbs.oncdata(this.sectionStart, this.index, 2);
        else
          this.cbs.oncomment(this.sectionStart, this.index, 2);
        this.sequenceIndex = 0, this.sectionStart = this.index + 1, this.state = State.Text;
      }
    } else if (this.sequenceIndex === 0) {
      if (this.fastForwardTo(this.currentSequence[0]))
        this.sequenceIndex = 1;
    } else if (c3 !== this.currentSequence[this.sequenceIndex - 1])
      this.sequenceIndex = 0;
  }
  isTagStartChar(c3) {
    return this.xmlMode ? !isEndOfTagSection(c3) : isASCIIAlpha(c3);
  }
  startSpecial(sequence, offset) {
    this.isSpecial = !0, this.currentSequence = sequence, this.sequenceIndex = offset, this.state = State.SpecialStartSequence;
  }
  stateBeforeTagName(c3) {
    if (c3 === CharCodes2.ExclamationMark)
      this.state = State.BeforeDeclaration, this.sectionStart = this.index + 1;
    else if (c3 === CharCodes2.Questionmark)
      this.state = State.InProcessingInstruction, this.sectionStart = this.index + 1;
    else if (this.isTagStartChar(c3)) {
      let lower = c3 | 32;
      if (this.sectionStart = this.index, this.xmlMode)
        this.state = State.InTagName;
      else if (lower === Sequences.ScriptEnd[2])
        this.state = State.BeforeSpecialS;
      else if (lower === Sequences.TitleEnd[2] || lower === Sequences.XmpEnd[2])
        this.state = State.BeforeSpecialT;
      else
        this.state = State.InTagName;
    } else if (c3 === CharCodes2.Slash)
      this.state = State.BeforeClosingTagName;
    else
      this.state = State.Text, this.stateText(c3);
  }
  stateInTagName(c3) {
    if (isEndOfTagSection(c3))
      this.cbs.onopentagname(this.sectionStart, this.index), this.sectionStart = -1, this.state = State.BeforeAttributeName, this.stateBeforeAttributeName(c3);
  }
  stateBeforeClosingTagName(c3) {
    if (isWhitespace(c3))
      ;
    else if (c3 === CharCodes2.Gt)
      this.state = State.Text;
    else
      this.state = this.isTagStartChar(c3) ? State.InClosingTagName : State.InSpecialComment, this.sectionStart = this.index;
  }
  stateInClosingTagName(c3) {
    if (c3 === CharCodes2.Gt || isWhitespace(c3))
      this.cbs.onclosetag(this.sectionStart, this.index), this.sectionStart = -1, this.state = State.AfterClosingTagName, this.stateAfterClosingTagName(c3);
  }
  stateAfterClosingTagName(c3) {
    if (c3 === CharCodes2.Gt || this.fastForwardTo(CharCodes2.Gt))
      this.state = State.Text, this.sectionStart = this.index + 1;
  }
  stateBeforeAttributeName(c3) {
    if (c3 === CharCodes2.Gt) {
      if (this.cbs.onopentagend(this.index), this.isSpecial)
        this.state = State.InSpecialTag, this.sequenceIndex = 0;
      else
        this.state = State.Text;
      this.sectionStart = this.index + 1;
    } else if (c3 === CharCodes2.Slash)
      this.state = State.InSelfClosingTag;
    else if (!isWhitespace(c3))
      this.state = State.InAttributeName, this.sectionStart = this.index;
  }
  stateInSelfClosingTag(c3) {
    if (c3 === CharCodes2.Gt)
      this.cbs.onselfclosingtag(this.index), this.state = State.Text, this.sectionStart = this.index + 1, this.isSpecial = !1;
    else if (!isWhitespace(c3))
      this.state = State.BeforeAttributeName, this.stateBeforeAttributeName(c3);
  }
  stateInAttributeName(c3) {
    if (c3 === CharCodes2.Eq || isEndOfTagSection(c3))
      this.cbs.onattribname(this.sectionStart, this.index), this.sectionStart = this.index, this.state = State.AfterAttributeName, this.stateAfterAttributeName(c3);
  }
  stateAfterAttributeName(c3) {
    if (c3 === CharCodes2.Eq)
      this.state = State.BeforeAttributeValue;
    else if (c3 === CharCodes2.Slash || c3 === CharCodes2.Gt)
      this.cbs.onattribend(QuoteType.NoValue, this.sectionStart), this.sectionStart = -1, this.state = State.BeforeAttributeName, this.stateBeforeAttributeName(c3);
    else if (!isWhitespace(c3))
      this.cbs.onattribend(QuoteType.NoValue, this.sectionStart), this.state = State.InAttributeName, this.sectionStart = this.index;
  }
  stateBeforeAttributeValue(c3) {
    if (c3 === CharCodes2.DoubleQuote)
      this.state = State.InAttributeValueDq, this.sectionStart = this.index + 1;
    else if (c3 === CharCodes2.SingleQuote)
      this.state = State.InAttributeValueSq, this.sectionStart = this.index + 1;
    else if (!isWhitespace(c3))
      this.sectionStart = this.index, this.state = State.InAttributeValueNq, this.stateInAttributeValueNoQuotes(c3);
  }
  handleInAttributeValue(c3, quote2) {
    if (c3 === quote2 || !this.decodeEntities && this.fastForwardTo(quote2))
      this.cbs.onattribdata(this.sectionStart, this.index), this.sectionStart = -1, this.cbs.onattribend(quote2 === CharCodes2.DoubleQuote ? QuoteType.Double : QuoteType.Single, this.index + 1), this.state = State.BeforeAttributeName;
    else if (this.decodeEntities && c3 === CharCodes2.Amp)
      this.startEntity();
  }
  stateInAttributeValueDoubleQuotes(c3) {
    this.handleInAttributeValue(c3, CharCodes2.DoubleQuote);
  }
  stateInAttributeValueSingleQuotes(c3) {
    this.handleInAttributeValue(c3, CharCodes2.SingleQuote);
  }
  stateInAttributeValueNoQuotes(c3) {
    if (isWhitespace(c3) || c3 === CharCodes2.Gt)
      this.cbs.onattribdata(this.sectionStart, this.index), this.sectionStart = -1, this.cbs.onattribend(QuoteType.Unquoted, this.index), this.state = State.BeforeAttributeName, this.stateBeforeAttributeName(c3);
    else if (this.decodeEntities && c3 === CharCodes2.Amp)
      this.startEntity();
  }
  stateBeforeDeclaration(c3) {
    if (c3 === CharCodes2.OpeningSquareBracket)
      this.state = State.CDATASequence, this.sequenceIndex = 0;
    else
      this.state = c3 === CharCodes2.Dash ? State.BeforeComment : State.InDeclaration;
  }
  stateInDeclaration(c3) {
    if (c3 === CharCodes2.Gt || this.fastForwardTo(CharCodes2.Gt))
      this.cbs.ondeclaration(this.sectionStart, this.index), this.state = State.Text, this.sectionStart = this.index + 1;
  }
  stateInProcessingInstruction(c3) {
    if (c3 === CharCodes2.Gt || this.fastForwardTo(CharCodes2.Gt))
      this.cbs.onprocessinginstruction(this.sectionStart, this.index), this.state = State.Text, this.sectionStart = this.index + 1;
  }
  stateBeforeComment(c3) {
    if (c3 === CharCodes2.Dash)
      this.state = State.InCommentLike, this.currentSequence = Sequences.CommentEnd, this.sequenceIndex = 2, this.sectionStart = this.index + 1;
    else
      this.state = State.InDeclaration;
  }
  stateInSpecialComment(c3) {
    if (c3 === CharCodes2.Gt || this.fastForwardTo(CharCodes2.Gt))
      this.cbs.oncomment(this.sectionStart, this.index, 0), this.state = State.Text, this.sectionStart = this.index + 1;
  }
  stateBeforeSpecialS(c3) {
    let lower = c3 | 32;
    if (lower === Sequences.ScriptEnd[3])
      this.startSpecial(Sequences.ScriptEnd, 4);
    else if (lower === Sequences.StyleEnd[3])
      this.startSpecial(Sequences.StyleEnd, 4);
    else
      this.state = State.InTagName, this.stateInTagName(c3);
  }
  stateBeforeSpecialT(c3) {
    switch (c3 | 32) {
      case Sequences.TitleEnd[3]: {
        this.startSpecial(Sequences.TitleEnd, 4);
        break;
      }
      case Sequences.TextareaEnd[3]: {
        this.startSpecial(Sequences.TextareaEnd, 4);
        break;
      }
      case Sequences.XmpEnd[3]: {
        this.startSpecial(Sequences.XmpEnd, 4);
        break;
      }
      default:
        this.state = State.InTagName, this.stateInTagName(c3);
    }
  }
  startEntity() {
    this.baseState = this.state, this.state = State.InEntity, this.entityStart = this.index, this.entityDecoder.startEntity(this.xmlMode ? DecodingMode.Strict : this.baseState === State.Text || this.baseState === State.InSpecialTag ? DecodingMode.Legacy : DecodingMode.Attribute);
  }
  stateInEntity() {
    let indexInBuffer = this.index - this.offset, length = this.entityDecoder.write(this.buffer, indexInBuffer);
    if (length >= 0) {
      if (this.state = this.baseState, length === 0)
        this.index -= 1;
    } else {
      if (indexInBuffer < this.buffer.length && this.buffer.charCodeAt(indexInBuffer) === CharCodes2.Amp) {
        this.state = this.baseState, this.index -= 1;
        return;
      }
      this.index = this.offset + this.buffer.length - 1;
    }
  }
  cleanup() {
    if (this.running && this.sectionStart !== this.index) {
      if (this.state === State.Text || this.state === State.InSpecialTag && this.sequenceIndex === 0)
        this.cbs.ontext(this.sectionStart, this.index), this.sectionStart = this.index;
      else if (this.state === State.InAttributeValueDq || this.state === State.InAttributeValueSq || this.state === State.InAttributeValueNq)
        this.cbs.onattribdata(this.sectionStart, this.index), this.sectionStart = this.index;
    }
  }
  shouldContinue() {
    return this.index < this.buffer.length + this.offset && this.running;
  }
  parse() {
    while (this.shouldContinue()) {
      let c3 = this.buffer.charCodeAt(this.index - this.offset);
      switch (this.state) {
        case State.Text: {
          this.stateText(c3);
          break;
        }
        case State.SpecialStartSequence: {
          this.stateSpecialStartSequence(c3);
          break;
        }
        case State.InSpecialTag: {
          this.stateInSpecialTag(c3);
          break;
        }
        case State.CDATASequence: {
          this.stateCDATASequence(c3);
          break;
        }
        case State.InAttributeValueDq: {
          this.stateInAttributeValueDoubleQuotes(c3);
          break;
        }
        case State.InAttributeName: {
          this.stateInAttributeName(c3);
          break;
        }
        case State.InCommentLike: {
          this.stateInCommentLike(c3);
          break;
        }
        case State.InSpecialComment: {
          this.stateInSpecialComment(c3);
          break;
        }
        case State.BeforeAttributeName: {
          this.stateBeforeAttributeName(c3);
          break;
        }
        case State.InTagName: {
          this.stateInTagName(c3);
          break;
        }
        case State.InClosingTagName: {
          this.stateInClosingTagName(c3);
          break;
        }
        case State.BeforeTagName: {
          this.stateBeforeTagName(c3);
          break;
        }
        case State.AfterAttributeName: {
          this.stateAfterAttributeName(c3);
          break;
        }
        case State.InAttributeValueSq: {
          this.stateInAttributeValueSingleQuotes(c3);
          break;
        }
        case State.BeforeAttributeValue: {
          this.stateBeforeAttributeValue(c3);
          break;
        }
        case State.BeforeClosingTagName: {
          this.stateBeforeClosingTagName(c3);
          break;
        }
        case State.AfterClosingTagName: {
          this.stateAfterClosingTagName(c3);
          break;
        }
        case State.BeforeSpecialS: {
          this.stateBeforeSpecialS(c3);
          break;
        }
        case State.BeforeSpecialT: {
          this.stateBeforeSpecialT(c3);
          break;
        }
        case State.InAttributeValueNq: {
          this.stateInAttributeValueNoQuotes(c3);
          break;
        }
        case State.InSelfClosingTag: {
          this.stateInSelfClosingTag(c3);
          break;
        }
        case State.InDeclaration: {
          this.stateInDeclaration(c3);
          break;
        }
        case State.BeforeDeclaration: {
          this.stateBeforeDeclaration(c3);
          break;
        }
        case State.BeforeComment: {
          this.stateBeforeComment(c3);
          break;
        }
        case State.InProcessingInstruction: {
          this.stateInProcessingInstruction(c3);
          break;
        }
        case State.InEntity: {
          this.stateInEntity();
          break;
        }
      }
      this.index++;
    }
    this.cleanup();
  }
  finish() {
    if (this.state === State.InEntity)
      this.entityDecoder.end(), this.state = this.baseState;
    this.handleTrailingData(), this.cbs.onend();
  }
  handleTrailingData() {
    let endIndex = this.buffer.length + this.offset;
    if (this.sectionStart >= endIndex)
      return;
    if (this.state === State.InCommentLike)
      if (this.currentSequence === Sequences.CdataEnd)
        this.cbs.oncdata(this.sectionStart, endIndex, 0);
      else
        this.cbs.oncomment(this.sectionStart, endIndex, 0);
    else if (this.state === State.InTagName || this.state === State.BeforeAttributeName || this.state === State.BeforeAttributeValue || this.state === State.AfterAttributeName || this.state === State.InAttributeName || this.state === State.InAttributeValueSq || this.state === State.InAttributeValueDq || this.state === State.InAttributeValueNq || this.state === State.InClosingTagName)
      ;
    else
      this.cbs.ontext(this.sectionStart, endIndex);
  }
  emitCodePoint(cp, consumed) {
    if (this.baseState !== State.Text && this.baseState !== State.InSpecialTag) {
      if (this.sectionStart < this.entityStart)
        this.cbs.onattribdata(this.sectionStart, this.entityStart);
      this.sectionStart = this.entityStart + consumed, this.index = this.sectionStart - 1, this.cbs.onattribentity(cp);
    } else {
      if (this.sectionStart < this.entityStart)
        this.cbs.ontext(this.sectionStart, this.entityStart);
      this.sectionStart = this.entityStart + consumed, this.index = this.sectionStart - 1, this.cbs.ontextentity(cp, this.sectionStart);
    }
  }
}
