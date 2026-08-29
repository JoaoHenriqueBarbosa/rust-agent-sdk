// function: namespaceMatches
function namespaceMatches(namespace, patternToMatch) {
  if (patternToMatch.indexOf("*") === -1)
    return namespace === patternToMatch;
  let pattern = patternToMatch;
  if (patternToMatch.indexOf("**") !== -1) {
    let patternParts = [], lastCharacter = "";
    for (let character of patternToMatch)
      if (character === "*" && lastCharacter === "*")
        continue;
      else
        lastCharacter = character, patternParts.push(character);
    pattern = patternParts.join("");
  }
  let namespaceIndex = 0, patternIndex = 0, patternLength = pattern.length, namespaceLength = namespace.length, lastWildcard = -1, lastWildcardNamespace = -1;
  while (namespaceIndex < namespaceLength && patternIndex < patternLength)
    if (pattern[patternIndex] === "*") {
      if (lastWildcard = patternIndex, patternIndex++, patternIndex === patternLength)
        return !0;
      while (namespace[namespaceIndex] !== pattern[patternIndex])
        if (namespaceIndex++, namespaceIndex === namespaceLength)
          return !1;
      lastWildcardNamespace = namespaceIndex, namespaceIndex++, patternIndex++;
      continue;
    } else if (pattern[patternIndex] === namespace[namespaceIndex])
      patternIndex++, namespaceIndex++;
    else if (lastWildcard >= 0) {
      if (patternIndex = lastWildcard + 1, namespaceIndex = lastWildcardNamespace + 1, namespaceIndex === namespaceLength)
        return !1;
      while (namespace[namespaceIndex] !== pattern[patternIndex])
        if (namespaceIndex++, namespaceIndex === namespaceLength)
          return !1;
      lastWildcardNamespace = namespaceIndex, namespaceIndex++, patternIndex++;
      continue;
    } else
      return !1;
  let namespaceDone = namespaceIndex === namespace.length, patternDone = patternIndex === pattern.length, trailingWildCard = patternIndex === pattern.length - 1 && pattern[patternIndex] === "*";
  return namespaceDone && (patternDone || trailingWildCard);
}
