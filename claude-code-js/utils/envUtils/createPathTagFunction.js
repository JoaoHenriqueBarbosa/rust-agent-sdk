// var: createPathTagFunction
var createPathTagFunction = (pathEncoder = encodeURIPath) => function(statics, ...params) {
  if (statics.length === 1)
    return statics[0];
  let postPath = !1, path = statics.reduce((previousValue, currentValue, index) => {
    if (/[?#]/.test(currentValue))
      postPath = !0;
    return previousValue + currentValue + (index === params.length ? "" : (postPath ? encodeURIComponent : pathEncoder)(String(params[index])));
  }, ""), pathOnly = path.split(/[?#]/, 1)[0], invalidSegments = [], invalidSegmentPattern = /(?<=^|\/)(?:\.|%2e){1,2}(?=\/|$)/gi, match;
  while ((match = invalidSegmentPattern.exec(pathOnly)) !== null)
    invalidSegments.push({
      start: match.index,
      length: match[0].length
    });
  if (invalidSegments.length > 0) {
    let lastEnd = 0, underline = invalidSegments.reduce((acc, segment) => {
      let spaces = " ".repeat(segment.start - lastEnd), arrows = "^".repeat(segment.length);
      return lastEnd = segment.start + segment.length, acc + spaces + arrows;
    }, "");
    throw new AnthropicError(`Path parameters result in path with invalid segments:
${path}
${underline}`);
  }
  return path;
}, path;
