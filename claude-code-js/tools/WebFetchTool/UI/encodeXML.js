// function: encodeXML
function encodeXML(str2) {
  let ret = "", lastIdx = 0, match;
  while ((match = xmlReplacer.exec(str2)) !== null) {
    let i5 = match.index, char = str2.charCodeAt(i5), next = xmlCodeMap.get(char);
    if (next !== void 0)
      ret += str2.substring(lastIdx, i5) + next, lastIdx = i5 + 1;
    else
      ret += `${str2.substring(lastIdx, i5)}&#x${getCodePoint(str2, i5).toString(16)};`, lastIdx = xmlReplacer.lastIndex += Number((char & 64512) === 55296);
  }
  return ret + str2.substr(lastIdx);
}
