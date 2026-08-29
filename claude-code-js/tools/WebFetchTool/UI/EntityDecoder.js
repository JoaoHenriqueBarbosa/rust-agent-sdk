// class: EntityDecoder
class EntityDecoder {
  constructor(decodeTree, emitCodePoint, errors8) {
    this.decodeTree = decodeTree, this.emitCodePoint = emitCodePoint, this.errors = errors8, this.state = EntityDecoderState.EntityStart, this.consumed = 1, this.result = 0, this.treeIndex = 0, this.excess = 1, this.decodeMode = DecodingMode.Strict, this.runConsumed = 0;
  }
  startEntity(decodeMode) {
    this.decodeMode = decodeMode, this.state = EntityDecoderState.EntityStart, this.result = 0, this.treeIndex = 0, this.excess = 1, this.consumed = 1, this.runConsumed = 0;
  }
  write(input, offset) {
    switch (this.state) {
      case EntityDecoderState.EntityStart: {
        if (input.charCodeAt(offset) === CharCodes.NUM)
          return this.state = EntityDecoderState.NumericStart, this.consumed += 1, this.stateNumericStart(input, offset + 1);
        return this.state = EntityDecoderState.NamedEntity, this.stateNamedEntity(input, offset);
      }
      case EntityDecoderState.NumericStart:
        return this.stateNumericStart(input, offset);
      case EntityDecoderState.NumericDecimal:
        return this.stateNumericDecimal(input, offset);
      case EntityDecoderState.NumericHex:
        return this.stateNumericHex(input, offset);
      case EntityDecoderState.NamedEntity:
        return this.stateNamedEntity(input, offset);
    }
  }
  stateNumericStart(input, offset) {
    if (offset >= input.length)
      return -1;
    if ((input.charCodeAt(offset) | TO_LOWER_BIT) === CharCodes.LOWER_X)
      return this.state = EntityDecoderState.NumericHex, this.consumed += 1, this.stateNumericHex(input, offset + 1);
    return this.state = EntityDecoderState.NumericDecimal, this.stateNumericDecimal(input, offset);
  }
  stateNumericHex(input, offset) {
    while (offset < input.length) {
      let char = input.charCodeAt(offset);
      if (isNumber2(char) || isHexadecimalCharacter(char)) {
        let digit = char <= CharCodes.NINE ? char - CharCodes.ZERO : (char | TO_LOWER_BIT) - CharCodes.LOWER_A + 10;
        this.result = this.result * 16 + digit, this.consumed++, offset++;
      } else
        return this.emitNumericEntity(char, 3);
    }
    return -1;
  }
  stateNumericDecimal(input, offset) {
    while (offset < input.length) {
      let char = input.charCodeAt(offset);
      if (isNumber2(char))
        this.result = this.result * 10 + (char - CharCodes.ZERO), this.consumed++, offset++;
      else
        return this.emitNumericEntity(char, 2);
    }
    return -1;
  }
  emitNumericEntity(lastCp, expectedLength) {
    var _a4;
    if (this.consumed <= expectedLength)
      return (_a4 = this.errors) === null || _a4 === void 0 || _a4.absenceOfDigitsInNumericCharacterReference(this.consumed), 0;
    if (lastCp === CharCodes.SEMI)
      this.consumed += 1;
    else if (this.decodeMode === DecodingMode.Strict)
      return 0;
    if (this.emitCodePoint(replaceCodePoint(this.result), this.consumed), this.errors) {
      if (lastCp !== CharCodes.SEMI)
        this.errors.missingSemicolonAfterCharacterReference();
      this.errors.validateNumericCharacterReference(this.result);
    }
    return this.consumed;
  }
  stateNamedEntity(input, offset) {
    let { decodeTree } = this, current = decodeTree[this.treeIndex], valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
    while (offset < input.length) {
      if (valueLength === 0 && (current & BinTrieFlags.FLAG13) !== 0) {
        let runLength = (current & BinTrieFlags.BRANCH_LENGTH) >> 7;
        if (this.runConsumed === 0) {
          let firstChar = current & BinTrieFlags.JUMP_TABLE;
          if (input.charCodeAt(offset) !== firstChar)
            return this.result === 0 ? 0 : this.emitNotTerminatedNamedEntity();
          offset++, this.excess++, this.runConsumed++;
        }
        while (this.runConsumed < runLength) {
          if (offset >= input.length)
            return -1;
          let charIndexInPacked = this.runConsumed - 1, packedWord = decodeTree[this.treeIndex + 1 + (charIndexInPacked >> 1)], expectedChar = charIndexInPacked % 2 === 0 ? packedWord & 255 : packedWord >> 8 & 255;
          if (input.charCodeAt(offset) !== expectedChar)
            return this.runConsumed = 0, this.result === 0 ? 0 : this.emitNotTerminatedNamedEntity();
          offset++, this.excess++, this.runConsumed++;
        }
        this.runConsumed = 0, this.treeIndex += 1 + (runLength >> 1), current = decodeTree[this.treeIndex], valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
      }
      if (offset >= input.length)
        break;
      let char = input.charCodeAt(offset);
      if (char === CharCodes.SEMI && valueLength !== 0 && (current & BinTrieFlags.FLAG13) !== 0)
        return this.emitNamedEntityData(this.treeIndex, valueLength, this.consumed + this.excess);
      if (this.treeIndex = determineBranch(decodeTree, current, this.treeIndex + Math.max(1, valueLength), char), this.treeIndex < 0)
        return this.result === 0 || this.decodeMode === DecodingMode.Attribute && (valueLength === 0 || isEntityInAttributeInvalidEnd(char)) ? 0 : this.emitNotTerminatedNamedEntity();
      if (current = decodeTree[this.treeIndex], valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14, valueLength !== 0) {
        if (char === CharCodes.SEMI)
          return this.emitNamedEntityData(this.treeIndex, valueLength, this.consumed + this.excess);
        if (this.decodeMode !== DecodingMode.Strict && (current & BinTrieFlags.FLAG13) === 0)
          this.result = this.treeIndex, this.consumed += this.excess, this.excess = 0;
      }
      offset++, this.excess++;
    }
    return -1;
  }
  emitNotTerminatedNamedEntity() {
    var _a4;
    let { result, decodeTree } = this, valueLength = (decodeTree[result] & BinTrieFlags.VALUE_LENGTH) >> 14;
    return this.emitNamedEntityData(result, valueLength, this.consumed), (_a4 = this.errors) === null || _a4 === void 0 || _a4.missingSemicolonAfterCharacterReference(), this.consumed;
  }
  emitNamedEntityData(result, valueLength, consumed) {
    let { decodeTree } = this;
    if (this.emitCodePoint(valueLength === 1 ? decodeTree[result] & ~(BinTrieFlags.VALUE_LENGTH | BinTrieFlags.FLAG13) : decodeTree[result + 1], consumed), valueLength === 3)
      this.emitCodePoint(decodeTree[result + 2], consumed);
    return consumed;
  }
  end() {
    var _a4;
    switch (this.state) {
      case EntityDecoderState.NamedEntity:
        return this.result !== 0 && (this.decodeMode !== DecodingMode.Attribute || this.result === this.treeIndex) ? this.emitNotTerminatedNamedEntity() : 0;
      case EntityDecoderState.NumericDecimal:
        return this.emitNumericEntity(0, 2);
      case EntityDecoderState.NumericHex:
        return this.emitNumericEntity(0, 3);
      case EntityDecoderState.NumericStart:
        return (_a4 = this.errors) === null || _a4 === void 0 || _a4.absenceOfDigitsInNumericCharacterReference(this.consumed), 0;
      case EntityDecoderState.EntityStart:
        return 0;
    }
  }
}
