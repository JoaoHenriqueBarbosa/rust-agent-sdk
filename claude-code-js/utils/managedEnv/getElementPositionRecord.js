// function: getElementPositionRecord
function getElementPositionRecord(element) {
  var elementRecord = getElementRecord(element);
  if (!elementRecord.position)
    elementRecord.position = createElementPropertyRecord(element, "position", getElementPosition, setElementPosition, positionMutationRunner);
  return elementRecord.position;
}
