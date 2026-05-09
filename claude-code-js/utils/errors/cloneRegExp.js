// function: cloneRegExp
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  return result.lastIndex = regexp.lastIndex, result;
}
