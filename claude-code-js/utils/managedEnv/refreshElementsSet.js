// function: refreshElementsSet
function refreshElementsSet(mutation) {
  if (mutation.kind === "position" && mutation.elements.size === 1)
    return;
  var existingElements = new Set(mutation.elements), matchingElements = document.querySelectorAll(mutation.selector);
  matchingElements.forEach(function(el) {
    if (!existingElements.has(el))
      mutation.elements.add(el), startMutating(mutation, el);
  });
}
