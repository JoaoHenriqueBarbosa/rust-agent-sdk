// function: getEscaper
function getEscaper(regex2, map8) {
  return function(data) {
    let match, lastIdx = 0, result = "";
    while (match = regex2.exec(data)) {
      if (lastIdx !== match.index)
        result += data.substring(lastIdx, match.index);
      result += map8.get(match[0].charCodeAt(0)), lastIdx = match.index + 1;
    }
    return result + data.substring(lastIdx);
  };
}
