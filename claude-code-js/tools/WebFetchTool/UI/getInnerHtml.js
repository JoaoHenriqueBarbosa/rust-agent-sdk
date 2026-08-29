// var: getInnerHtml
var getInnerHtml = (node2) => node2.childNodes.join(""), setInnerHtml = (node2, html2) => {
  let { ownerDocument } = node2, { constructor } = ownerDocument, document2 = new constructor;
  document2[CUSTOM_ELEMENTS] = ownerDocument[CUSTOM_ELEMENTS];
  let { childNodes } = parseFromString(document2, ignoreCase(node2), html2);
  node2.replaceChildren(...childNodes.map(setOwnerDocument, ownerDocument));
};
