// function: parse15
function parse15(selector) {
  let subselects = [], endIndex = parseSelector(subselects, `${selector}`, 0);
  if (endIndex < selector.length)
    throw Error(`Unmatched selector: ${selector.slice(endIndex)}`);
  return subselects;
}
