// function: startMutating
function startMutating(mutation, element) {
  var record3 = null;
  if (mutation.kind === "html")
    record3 = getElementHTMLRecord(element);
  else if (mutation.kind === "class")
    record3 = getElementClassRecord(element);
  else if (mutation.kind === "attribute")
    record3 = getElementAttributeRecord(element, mutation.attribute);
  else if (mutation.kind === "position")
    record3 = getElementPositionRecord(element);
  if (!record3)
    return;
  record3.mutations.push(mutation), record3.mutationRunner(record3);
}
