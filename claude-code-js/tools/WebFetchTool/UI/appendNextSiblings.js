// function: appendNextSiblings
function appendNextSiblings(elem, adapter2) {
  let elems = Array.isArray(elem) ? elem.slice(0) : [elem], elemsLength = elems.length;
  for (let i5 = 0;i5 < elemsLength; i5++) {
    let nextSiblings = getNextSiblings(elems[i5], adapter2);
    elems.push(...nextSiblings);
  }
  return elems;
}
