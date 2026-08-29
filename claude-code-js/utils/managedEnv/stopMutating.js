// function: stopMutating
function stopMutating(mutation, el) {
  var record3 = null;
  if (mutation.kind === "html")
    record3 = getElementHTMLRecord(el);
  else if (mutation.kind === "class")
    record3 = getElementClassRecord(el);
  else if (mutation.kind === "attribute")
    record3 = getElementAttributeRecord(el, mutation.attribute);
  else if (mutation.kind === "position")
    record3 = getElementPositionRecord(el);
  if (!record3)
    return;
  var index = record3.mutations.indexOf(mutation);
  if (index !== -1)
    record3.mutations.splice(index, 1);
  record3.mutationRunner(record3);
}
