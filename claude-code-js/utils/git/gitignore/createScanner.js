// function: createScanner
function createScanner(text, ignoreTrivia = !1) {
  let len = text.length, pos = 0, value = "", tokenOffset = 0, token = 16, lineNumber = 0, lineStartOffset = 0, tokenLineStartOffset = 0, prevTokenLineStartOffset = 0, scanError = 0;
  function scanHexDigits(count3, exact) {
    let digits = 0, value2 = 0;
    while (digits < count3 || !exact) {
      let ch = text.charCodeAt(pos);
      if (ch >= 48 && ch <= 57)
        value2 = value2 * 16 + ch - 48;
      else if (ch >= 65 && ch <= 70)
        value2 = value2 * 16 + ch - 65 + 10;
      else if (ch >= 97 && ch <= 102)
        value2 = value2 * 16 + ch - 97 + 10;
      else
        break;
      pos++, digits++;
    }
    if (digits < count3)
      value2 = -1;
    return value2;
  }
  function setPosition(newPosition) {
    pos = newPosition, value = "", tokenOffset = 0, token = 16, scanError = 0;
  }
  function scanNumber() {
    let start = pos;
    if (text.charCodeAt(pos) === 48)
      pos++;
    else {
      pos++;
      while (pos < text.length && isDigit(text.charCodeAt(pos)))
        pos++;
    }
    if (pos < text.length && text.charCodeAt(pos) === 46)
      if (pos++, pos < text.length && isDigit(text.charCodeAt(pos))) {
        pos++;
        while (pos < text.length && isDigit(text.charCodeAt(pos)))
          pos++;
      } else
        return scanError = 3, text.substring(start, pos);
    let end = pos;
    if (pos < text.length && (text.charCodeAt(pos) === 69 || text.charCodeAt(pos) === 101)) {
      if (pos++, pos < text.length && text.charCodeAt(pos) === 43 || text.charCodeAt(pos) === 45)
        pos++;
      if (pos < text.length && isDigit(text.charCodeAt(pos))) {
        pos++;
        while (pos < text.length && isDigit(text.charCodeAt(pos)))
          pos++;
        end = pos;
      } else
        scanError = 3;
    }
    return text.substring(start, end);
  }
  function scanString() {
    let result = "", start = pos;
    while (!0) {
      if (pos >= len) {
        result += text.substring(start, pos), scanError = 2;
        break;
      }
      let ch = text.charCodeAt(pos);
      if (ch === 34) {
        result += text.substring(start, pos), pos++;
        break;
      }
      if (ch === 92) {
        if (result += text.substring(start, pos), pos++, pos >= len) {
          scanError = 2;
          break;
        }
        switch (text.charCodeAt(pos++)) {
          case 34:
            result += '"';
            break;
          case 92:
            result += "\\";
            break;
          case 47:
            result += "/";
            break;
          case 98:
            result += "\b";
            break;
          case 102:
            result += "\f";
            break;
          case 110:
            result += `
`;
            break;
          case 114:
            result += "\r";
            break;
          case 116:
            result += "\t";
            break;
          case 117:
            let ch3 = scanHexDigits(4, !0);
            if (ch3 >= 0)
              result += String.fromCharCode(ch3);
            else
              scanError = 4;
            break;
          default:
            scanError = 5;
        }
        start = pos;
        continue;
      }
      if (ch >= 0 && ch <= 31)
        if (isLineBreak(ch)) {
          result += text.substring(start, pos), scanError = 2;
          break;
        } else
          scanError = 6;
      pos++;
    }
    return result;
  }
  function scanNext() {
    if (value = "", scanError = 0, tokenOffset = pos, lineStartOffset = lineNumber, prevTokenLineStartOffset = tokenLineStartOffset, pos >= len)
      return tokenOffset = len, token = 17;
    let code = text.charCodeAt(pos);
    if (isWhiteSpace(code)) {
      do
        pos++, value += String.fromCharCode(code), code = text.charCodeAt(pos);
      while (isWhiteSpace(code));
      return token = 15;
    }
    if (isLineBreak(code)) {
      if (pos++, value += String.fromCharCode(code), code === 13 && text.charCodeAt(pos) === 10)
        pos++, value += `
`;
      return lineNumber++, tokenLineStartOffset = pos, token = 14;
    }
    switch (code) {
      case 123:
        return pos++, token = 1;
      case 125:
        return pos++, token = 2;
      case 91:
        return pos++, token = 3;
      case 93:
        return pos++, token = 4;
      case 58:
        return pos++, token = 6;
      case 44:
        return pos++, token = 5;
      case 34:
        return pos++, value = scanString(), token = 10;
      case 47:
        let start = pos - 1;
        if (text.charCodeAt(pos + 1) === 47) {
          pos += 2;
          while (pos < len) {
            if (isLineBreak(text.charCodeAt(pos)))
              break;
            pos++;
          }
          return value = text.substring(start, pos), token = 12;
        }
        if (text.charCodeAt(pos + 1) === 42) {
          pos += 2;
          let safeLength = len - 1, commentClosed = !1;
          while (pos < safeLength) {
            let ch = text.charCodeAt(pos);
            if (ch === 42 && text.charCodeAt(pos + 1) === 47) {
              pos += 2, commentClosed = !0;
              break;
            }
            if (pos++, isLineBreak(ch)) {
              if (ch === 13 && text.charCodeAt(pos) === 10)
                pos++;
              lineNumber++, tokenLineStartOffset = pos;
            }
          }
          if (!commentClosed)
            pos++, scanError = 1;
          return value = text.substring(start, pos), token = 13;
        }
        return value += String.fromCharCode(code), pos++, token = 16;
      case 45:
        if (value += String.fromCharCode(code), pos++, pos === len || !isDigit(text.charCodeAt(pos)))
          return token = 16;
      case 48:
      case 49:
      case 50:
      case 51:
      case 52:
      case 53:
      case 54:
      case 55:
      case 56:
      case 57:
        return value += scanNumber(), token = 11;
      default:
        while (pos < len && isUnknownContentCharacter(code))
          pos++, code = text.charCodeAt(pos);
        if (tokenOffset !== pos) {
          switch (value = text.substring(tokenOffset, pos), value) {
            case "true":
              return token = 8;
            case "false":
              return token = 9;
            case "null":
              return token = 7;
          }
          return token = 16;
        }
        return value += String.fromCharCode(code), pos++, token = 16;
    }
  }
  function isUnknownContentCharacter(code) {
    if (isWhiteSpace(code) || isLineBreak(code))
      return !1;
    switch (code) {
      case 125:
      case 93:
      case 123:
      case 91:
      case 34:
      case 58:
      case 44:
      case 47:
        return !1;
    }
    return !0;
  }
  function scanNextNonTrivia() {
    let result;
    do
      result = scanNext();
    while (result >= 12 && result <= 15);
    return result;
  }
  return {
    setPosition,
    getPosition: () => pos,
    scan: ignoreTrivia ? scanNextNonTrivia : scanNext,
    getToken: () => token,
    getTokenValue: () => value,
    getTokenOffset: () => tokenOffset,
    getTokenLength: () => pos - tokenOffset,
    getTokenStartLine: () => lineStartOffset,
    getTokenStartCharacter: () => tokenOffset - prevTokenLineStartOffset,
    getTokenError: () => scanError
  };
}
