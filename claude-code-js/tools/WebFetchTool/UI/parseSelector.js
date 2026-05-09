// function: parseSelector
function parseSelector(subselects, selector, selectorIndex) {
  let tokens = [];
  function getName3(offset) {
    let match = selector.slice(selectorIndex + offset).match(reName);
    if (!match)
      throw Error(`Expected name, found ${selector.slice(selectorIndex)}`);
    let [name3] = match;
    return selectorIndex += offset + name3.length, unescapeCSS(name3);
  }
  function stripWhitespace(offset) {
    selectorIndex += offset;
    while (selectorIndex < selector.length && isWhitespace2(selector.charCodeAt(selectorIndex)))
      selectorIndex++;
  }
  function readValueWithParenthesis() {
    selectorIndex += 1;
    let start = selectorIndex, counter = 1;
    for (;counter > 0 && selectorIndex < selector.length; selectorIndex++)
      if (selector.charCodeAt(selectorIndex) === 40 && !isEscaped2(selectorIndex))
        counter++;
      else if (selector.charCodeAt(selectorIndex) === 41 && !isEscaped2(selectorIndex))
        counter--;
    if (counter)
      throw Error("Parenthesis not matched");
    return unescapeCSS(selector.slice(start, selectorIndex - 1));
  }
  function isEscaped2(pos) {
    let slashCount = 0;
    while (selector.charCodeAt(--pos) === 92)
      slashCount++;
    return (slashCount & 1) === 1;
  }
  function ensureNotTraversal() {
    if (tokens.length > 0 && isTraversal(tokens[tokens.length - 1]))
      throw Error("Did not expect successive traversals.");
  }
  function addTraversal(type) {
    if (tokens.length > 0 && tokens[tokens.length - 1].type === SelectorType.Descendant) {
      tokens[tokens.length - 1].type = type;
      return;
    }
    ensureNotTraversal(), tokens.push({ type });
  }
  function addSpecialAttribute(name3, action2) {
    tokens.push({
      type: SelectorType.Attribute,
      name: name3,
      action: action2,
      value: getName3(1),
      namespace: null,
      ignoreCase: "quirks"
    });
  }
  function finalizeSubselector() {
    if (tokens.length && tokens[tokens.length - 1].type === SelectorType.Descendant)
      tokens.pop();
    if (tokens.length === 0)
      throw Error("Empty sub-selector");
    subselects.push(tokens);
  }
  if (stripWhitespace(0), selector.length === selectorIndex)
    return selectorIndex;
  loop:
    while (selectorIndex < selector.length) {
      let firstChar = selector.charCodeAt(selectorIndex);
      switch (firstChar) {
        case 32:
        case 9:
        case 10:
        case 12:
        case 13: {
          if (tokens.length === 0 || tokens[0].type !== SelectorType.Descendant)
            ensureNotTraversal(), tokens.push({ type: SelectorType.Descendant });
          stripWhitespace(1);
          break;
        }
        case 62: {
          addTraversal(SelectorType.Child), stripWhitespace(1);
          break;
        }
        case 60: {
          addTraversal(SelectorType.Parent), stripWhitespace(1);
          break;
        }
        case 126: {
          addTraversal(SelectorType.Sibling), stripWhitespace(1);
          break;
        }
        case 43: {
          addTraversal(SelectorType.Adjacent), stripWhitespace(1);
          break;
        }
        case 46: {
          addSpecialAttribute("class", AttributeAction.Element);
          break;
        }
        case 35: {
          addSpecialAttribute("id", AttributeAction.Equals);
          break;
        }
        case 91: {
          stripWhitespace(1);
          let name3, namespace = null;
          if (selector.charCodeAt(selectorIndex) === 124)
            name3 = getName3(1);
          else if (selector.startsWith("*|", selectorIndex))
            namespace = "*", name3 = getName3(2);
          else if (name3 = getName3(0), selector.charCodeAt(selectorIndex) === 124 && selector.charCodeAt(selectorIndex + 1) !== 61)
            namespace = name3, name3 = getName3(1);
          stripWhitespace(0);
          let action2 = AttributeAction.Exists, possibleAction = actionTypes.get(selector.charCodeAt(selectorIndex));
          if (possibleAction) {
            if (action2 = possibleAction, selector.charCodeAt(selectorIndex + 1) !== 61)
              throw Error("Expected `=`");
            stripWhitespace(2);
          } else if (selector.charCodeAt(selectorIndex) === 61)
            action2 = AttributeAction.Equals, stripWhitespace(1);
          let value = "", ignoreCase2 = null;
          if (action2 !== "exists") {
            if (isQuote(selector.charCodeAt(selectorIndex))) {
              let quote2 = selector.charCodeAt(selectorIndex), sectionEnd = selectorIndex + 1;
              while (sectionEnd < selector.length && (selector.charCodeAt(sectionEnd) !== quote2 || isEscaped2(sectionEnd)))
                sectionEnd += 1;
              if (selector.charCodeAt(sectionEnd) !== quote2)
                throw Error("Attribute value didn't end");
              value = unescapeCSS(selector.slice(selectorIndex + 1, sectionEnd)), selectorIndex = sectionEnd + 1;
            } else {
              let valueStart = selectorIndex;
              while (selectorIndex < selector.length && (!isWhitespace2(selector.charCodeAt(selectorIndex)) && selector.charCodeAt(selectorIndex) !== 93 || isEscaped2(selectorIndex)))
                selectorIndex += 1;
              value = unescapeCSS(selector.slice(valueStart, selectorIndex));
            }
            stripWhitespace(0);
            let forceIgnore = selector.charCodeAt(selectorIndex) | 32;
            if (forceIgnore === 115)
              ignoreCase2 = !1, stripWhitespace(1);
            else if (forceIgnore === 105)
              ignoreCase2 = !0, stripWhitespace(1);
          }
          if (selector.charCodeAt(selectorIndex) !== 93)
            throw Error("Attribute selector didn't terminate");
          selectorIndex += 1;
          let attributeSelector = {
            type: SelectorType.Attribute,
            name: name3,
            action: action2,
            value,
            namespace,
            ignoreCase: ignoreCase2
          };
          tokens.push(attributeSelector);
          break;
        }
        case 58: {
          if (selector.charCodeAt(selectorIndex + 1) === 58) {
            tokens.push({
              type: SelectorType.PseudoElement,
              name: getName3(2).toLowerCase(),
              data: selector.charCodeAt(selectorIndex) === 40 ? readValueWithParenthesis() : null
            });
            continue;
          }
          let name3 = getName3(1).toLowerCase(), data = null;
          if (selector.charCodeAt(selectorIndex) === 40)
            if (unpackPseudos.has(name3)) {
              if (isQuote(selector.charCodeAt(selectorIndex + 1)))
                throw Error(`Pseudo-selector ${name3} cannot be quoted`);
              if (data = [], selectorIndex = parseSelector(data, selector, selectorIndex + 1), selector.charCodeAt(selectorIndex) !== 41)
                throw Error(`Missing closing parenthesis in :${name3} (${selector})`);
              selectorIndex += 1;
            } else {
              if (data = readValueWithParenthesis(), stripQuotesFromPseudos.has(name3)) {
                let quot = data.charCodeAt(0);
                if (quot === data.charCodeAt(data.length - 1) && isQuote(quot))
                  data = data.slice(1, -1);
              }
              data = unescapeCSS(data);
            }
          tokens.push({ type: SelectorType.Pseudo, name: name3, data });
          break;
        }
        case 44: {
          finalizeSubselector(), tokens = [], stripWhitespace(1);
          break;
        }
        default: {
          if (selector.startsWith("/*", selectorIndex)) {
            let endIndex = selector.indexOf("*/", selectorIndex + 2);
            if (endIndex < 0)
              throw Error("Comment was not terminated");
            if (selectorIndex = endIndex + 2, tokens.length === 0)
              stripWhitespace(0);
            break;
          }
          let namespace = null, name3;
          if (firstChar === 42)
            selectorIndex += 1, name3 = "*";
          else if (firstChar === 124) {
            if (name3 = "", selector.charCodeAt(selectorIndex + 1) === 124) {
              addTraversal(SelectorType.ColumnCombinator), stripWhitespace(2);
              break;
            }
          } else if (reName.test(selector.slice(selectorIndex)))
            name3 = getName3(0);
          else
            break loop;
          if (selector.charCodeAt(selectorIndex) === 124 && selector.charCodeAt(selectorIndex + 1) !== 124)
            if (namespace = name3, selector.charCodeAt(selectorIndex + 1) === 42)
              name3 = "*", selectorIndex += 2;
            else
              name3 = getName3(1);
          tokens.push(name3 === "*" ? { type: SelectorType.Universal, namespace } : { type: SelectorType.Tag, name: name3, namespace });
        }
      }
    }
  return finalizeSubselector(), selectorIndex;
}
