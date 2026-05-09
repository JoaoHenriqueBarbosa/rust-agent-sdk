// function: transformMatches
function transformMatches(result, data) {
  let matches2 = result.matches;
  if (data.matches = [], !isDefined2(matches2))
    return;
  matches2.forEach((match) => {
    if (!isDefined2(match.indices) || !match.indices.length)
      return;
    let {
      indices,
      value
    } = match, obj = {
      indices,
      value
    };
    if (match.key)
      obj.key = match.key.src;
    if (match.idx > -1)
      obj.refIndex = match.idx;
    data.matches.push(obj);
  });
}
