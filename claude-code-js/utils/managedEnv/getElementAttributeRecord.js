// function: getElementAttributeRecord
function getElementAttributeRecord(el, attr) {
  var elementRecord = getElementRecord(el);
  if (!elementRecord.attributes[attr])
    elementRecord.attributes[attr] = createElementPropertyRecord(el, attr, getAttrValue(attr), setAttrValue(attr), attrMutationRunner);
  return elementRecord.attributes[attr];
}
