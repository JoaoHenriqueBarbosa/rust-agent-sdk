// var: loopSegment
var loopSegment = ({ [NEXT]: next, [END]: end }, json2) => {
  while (next !== end) {
    switch (next.nodeType) {
      case ATTRIBUTE_NODE:
        attrAsJSON(next, json2);
        break;
      case TEXT_NODE:
      case COMMENT_NODE:
      case CDATA_SECTION_NODE:
        characterDataAsJSON(next, json2);
        break;
      case ELEMENT_NODE:
        elementAsJSON(next, json2), next = getEnd(next);
        break;
      case DOCUMENT_TYPE_NODE:
        documentTypeAsJSON(next, json2);
        break;
    }
    next = next[NEXT];
  }
  let last2 = json2.length - 1, value = json2[last2];
  if (typeof value === "number" && value < 0)
    json2[last2] += NODE_END;
  else
    json2.push(NODE_END);
}, attrAsJSON = (attr, json2) => {
  json2.push(ATTRIBUTE_NODE, attr.name);
  let value = attr[VALUE].trim();
  if (value)
    json2.push(value);
}, characterDataAsJSON = (node2, json2) => {
  let value = node2[VALUE];
  if (value.trim())
    json2.push(node2.nodeType, value);
}, nonElementAsJSON = (node2, json2) => {
  json2.push(node2.nodeType), loopSegment(node2, json2);
}, documentTypeAsJSON = ({ name: name3, publicId, systemId }, json2) => {
  if (json2.push(DOCUMENT_TYPE_NODE, name3), publicId)
    json2.push(publicId);
  if (systemId)
    json2.push(systemId);
}, elementAsJSON = (element, json2) => {
  json2.push(ELEMENT_NODE, element.localName), loopSegment(element, json2);
};
