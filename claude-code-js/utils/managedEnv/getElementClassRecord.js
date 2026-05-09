// function: getElementClassRecord
function getElementClassRecord(el) {
  var elementRecord = getElementRecord(el);
  if (!elementRecord.classes)
    elementRecord.classes = createElementPropertyRecord(el, "class", getClassValue, setClassValue, classMutationRunner);
  return elementRecord.classes;
}
