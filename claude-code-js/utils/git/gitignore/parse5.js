// function: parse5
function parse5(text, errors3 = [], options = ParseOptions.DEFAULT) {
  let currentProperty = null, currentParent = [], previousParents = [];
  function onValue(value) {
    if (Array.isArray(currentParent))
      currentParent.push(value);
    else if (currentProperty !== null)
      currentParent[currentProperty] = value;
  }
  return visit(text, {
    onObjectBegin: () => {
      let object2 = {};
      onValue(object2), previousParents.push(currentParent), currentParent = object2, currentProperty = null;
    },
    onObjectProperty: (name) => {
      currentProperty = name;
    },
    onObjectEnd: () => {
      currentParent = previousParents.pop();
    },
    onArrayBegin: () => {
      let array2 = [];
      onValue(array2), previousParents.push(currentParent), currentParent = array2, currentProperty = null;
    },
    onArrayEnd: () => {
      currentParent = previousParents.pop();
    },
    onLiteralValue: onValue,
    onError: (error41, offset, length) => {
      errors3.push({ error: error41, offset, length });
    }
  }, options), currentParent[0];
}
