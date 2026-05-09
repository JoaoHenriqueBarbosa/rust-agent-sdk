// function: getTotalLength
function getTotalLength(sources) {
  let total = 0;
  for (let source of sources) {
    let partLength = getLength(source);
    if (partLength === void 0)
      return;
    else
      total += partLength;
  }
  return total;
}
