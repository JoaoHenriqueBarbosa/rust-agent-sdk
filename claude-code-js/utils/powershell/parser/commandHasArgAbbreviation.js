// function: commandHasArgAbbreviation
function commandHasArgAbbreviation(command12, fullParam, minPrefix) {
  let lowerFull = fullParam.toLowerCase(), lowerMin = minPrefix.toLowerCase();
  return command12.args.some((a2) => {
    let colonIndex = a2.indexOf(":", 1), lower = (colonIndex > 0 ? a2.slice(0, colonIndex) : a2).replace(/`/g, "").toLowerCase();
    return lower.startsWith(lowerMin) && lowerFull.startsWith(lower) && lower.length <= lowerFull.length;
  });
}
