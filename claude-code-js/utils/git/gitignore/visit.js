// function: visit
function visit(text, visitor, options = ParseOptions.DEFAULT) {
  let _scanner = createScanner(text, !1), _jsonPath = [], suppressedCallbacks = 0;
  function toNoArgVisit(visitFunction) {
    return visitFunction ? () => suppressedCallbacks === 0 && visitFunction(_scanner.getTokenOffset(), _scanner.getTokenLength(), _scanner.getTokenStartLine(), _scanner.getTokenStartCharacter()) : () => !0;
  }
  function toOneArgVisit(visitFunction) {
    return visitFunction ? (arg) => suppressedCallbacks === 0 && visitFunction(arg, _scanner.getTokenOffset(), _scanner.getTokenLength(), _scanner.getTokenStartLine(), _scanner.getTokenStartCharacter()) : () => !0;
  }
  function toOneArgVisitWithPath(visitFunction) {
    return visitFunction ? (arg) => suppressedCallbacks === 0 && visitFunction(arg, _scanner.getTokenOffset(), _scanner.getTokenLength(), _scanner.getTokenStartLine(), _scanner.getTokenStartCharacter(), () => _jsonPath.slice()) : () => !0;
  }
  function toBeginVisit(visitFunction) {
    return visitFunction ? () => {
      if (suppressedCallbacks > 0)
        suppressedCallbacks++;
      else if (visitFunction(_scanner.getTokenOffset(), _scanner.getTokenLength(), _scanner.getTokenStartLine(), _scanner.getTokenStartCharacter(), () => _jsonPath.slice()) === !1)
        suppressedCallbacks = 1;
    } : () => !0;
  }
  function toEndVisit(visitFunction) {
    return visitFunction ? () => {
      if (suppressedCallbacks > 0)
        suppressedCallbacks--;
      if (suppressedCallbacks === 0)
        visitFunction(_scanner.getTokenOffset(), _scanner.getTokenLength(), _scanner.getTokenStartLine(), _scanner.getTokenStartCharacter());
    } : () => !0;
  }
  let onObjectBegin = toBeginVisit(visitor.onObjectBegin), onObjectProperty = toOneArgVisitWithPath(visitor.onObjectProperty), onObjectEnd = toEndVisit(visitor.onObjectEnd), onArrayBegin = toBeginVisit(visitor.onArrayBegin), onArrayEnd = toEndVisit(visitor.onArrayEnd), onLiteralValue = toOneArgVisitWithPath(visitor.onLiteralValue), onSeparator = toOneArgVisit(visitor.onSeparator), onComment = toNoArgVisit(visitor.onComment), onError = toOneArgVisit(visitor.onError), disallowComments = options && options.disallowComments, allowTrailingComma = options && options.allowTrailingComma;
  function scanNext() {
    while (!0) {
      let token = _scanner.scan();
      switch (_scanner.getTokenError()) {
        case 4:
          handleError(14);
          break;
        case 5:
          handleError(15);
          break;
        case 3:
          handleError(13);
          break;
        case 1:
          if (!disallowComments)
            handleError(11);
          break;
        case 2:
          handleError(12);
          break;
        case 6:
          handleError(16);
          break;
      }
      switch (token) {
        case 12:
        case 13:
          if (disallowComments)
            handleError(10);
          else
            onComment();
          break;
        case 16:
          handleError(1);
          break;
        case 15:
        case 14:
          break;
        default:
          return token;
      }
    }
  }
  function handleError(error41, skipUntilAfter = [], skipUntil = []) {
    if (onError(error41), skipUntilAfter.length + skipUntil.length > 0) {
      let token = _scanner.getToken();
      while (token !== 17) {
        if (skipUntilAfter.indexOf(token) !== -1) {
          scanNext();
          break;
        } else if (skipUntil.indexOf(token) !== -1)
          break;
        token = scanNext();
      }
    }
  }
  function parseString(isValue) {
    let value = _scanner.getTokenValue();
    if (isValue)
      onLiteralValue(value);
    else
      onObjectProperty(value), _jsonPath.push(value);
    return scanNext(), !0;
  }
  function parseLiteral() {
    switch (_scanner.getToken()) {
      case 11:
        let tokenValue = _scanner.getTokenValue(), value = Number(tokenValue);
        if (isNaN(value))
          handleError(2), value = 0;
        onLiteralValue(value);
        break;
      case 7:
        onLiteralValue(null);
        break;
      case 8:
        onLiteralValue(!0);
        break;
      case 9:
        onLiteralValue(!1);
        break;
      default:
        return !1;
    }
    return scanNext(), !0;
  }
  function parseProperty() {
    if (_scanner.getToken() !== 10)
      return handleError(3, [], [2, 5]), !1;
    if (parseString(!1), _scanner.getToken() === 6) {
      if (onSeparator(":"), scanNext(), !parseValue2())
        handleError(4, [], [2, 5]);
    } else
      handleError(5, [], [2, 5]);
    return _jsonPath.pop(), !0;
  }
  function parseObject() {
    onObjectBegin(), scanNext();
    let needsComma = !1;
    while (_scanner.getToken() !== 2 && _scanner.getToken() !== 17) {
      if (_scanner.getToken() === 5) {
        if (!needsComma)
          handleError(4, [], []);
        if (onSeparator(","), scanNext(), _scanner.getToken() === 2 && allowTrailingComma)
          break;
      } else if (needsComma)
        handleError(6, [], []);
      if (!parseProperty())
        handleError(4, [], [2, 5]);
      needsComma = !0;
    }
    if (onObjectEnd(), _scanner.getToken() !== 2)
      handleError(7, [2], []);
    else
      scanNext();
    return !0;
  }
  function parseArray() {
    onArrayBegin(), scanNext();
    let isFirstElement = !0, needsComma = !1;
    while (_scanner.getToken() !== 4 && _scanner.getToken() !== 17) {
      if (_scanner.getToken() === 5) {
        if (!needsComma)
          handleError(4, [], []);
        if (onSeparator(","), scanNext(), _scanner.getToken() === 4 && allowTrailingComma)
          break;
      } else if (needsComma)
        handleError(6, [], []);
      if (isFirstElement)
        _jsonPath.push(0), isFirstElement = !1;
      else
        _jsonPath[_jsonPath.length - 1]++;
      if (!parseValue2())
        handleError(4, [], [4, 5]);
      needsComma = !0;
    }
    if (onArrayEnd(), !isFirstElement)
      _jsonPath.pop();
    if (_scanner.getToken() !== 4)
      handleError(8, [4], []);
    else
      scanNext();
    return !0;
  }
  function parseValue2() {
    switch (_scanner.getToken()) {
      case 3:
        return parseArray();
      case 1:
        return parseObject();
      case 10:
        return parseString(!0);
      default:
        return parseLiteral();
    }
  }
  if (scanNext(), _scanner.getToken() === 17) {
    if (options.allowEmptyContent)
      return !0;
    return handleError(4, [], []), !1;
  }
  if (!parseValue2())
    return handleError(4, [], []), !1;
  if (_scanner.getToken() !== 17)
    handleError(9, [], []);
  return !0;
}
