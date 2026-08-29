// function: getElementRecord
function getElementRecord(element) {
  var record3 = elements.get(element);
  if (!record3)
    record3 = {
      element,
      attributes: {}
    }, elements.set(element, record3);
  return record3;
}
