// function: getElementHTMLRecord
function getElementHTMLRecord(element) {
  var elementRecord = getElementRecord(element);
  if (!elementRecord.html)
    elementRecord.html = createElementPropertyRecord(element, "html", getHTMLValue, setHTMLValue, htmlMutationRunner);
  return elementRecord.html;
}
