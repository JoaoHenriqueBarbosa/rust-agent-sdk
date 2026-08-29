// function: buildValues
function buildValues(diff3, lastComponent, newString, oldString, useLongestToken) {
  var components = [], nextComponent;
  while (lastComponent)
    components.push(lastComponent), nextComponent = lastComponent.previousComponent, delete lastComponent.previousComponent, lastComponent = nextComponent;
  components.reverse();
  var componentPos = 0, componentLen = components.length, newPos = 0, oldPos = 0;
  for (;componentPos < componentLen; componentPos++) {
    var component = components[componentPos];
    if (!component.removed) {
      if (!component.added && useLongestToken) {
        var value = newString.slice(newPos, newPos + component.count);
        value = value.map(function(value2, i5) {
          var oldValue = oldString[oldPos + i5];
          return oldValue.length > value2.length ? oldValue : value2;
        }), component.value = diff3.join(value);
      } else
        component.value = diff3.join(newString.slice(newPos, newPos + component.count));
      if (newPos += component.count, !component.added)
        oldPos += component.count;
    } else
      component.value = diff3.join(oldString.slice(oldPos, oldPos + component.count)), oldPos += component.count;
  }
  return components;
}
