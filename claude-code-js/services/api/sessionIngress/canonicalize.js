// function: canonicalize
function canonicalize(obj, stack, replacementStack, replacer, key2) {
  if (stack = stack || [], replacementStack = replacementStack || [], replacer)
    obj = replacer(key2, obj);
  var i5;
  for (i5 = 0;i5 < stack.length; i5 += 1)
    if (stack[i5] === obj)
      return replacementStack[i5];
  var canonicalizedObj;
  if (Object.prototype.toString.call(obj) === "[object Array]") {
    stack.push(obj), canonicalizedObj = Array(obj.length), replacementStack.push(canonicalizedObj);
    for (i5 = 0;i5 < obj.length; i5 += 1)
      canonicalizedObj[i5] = canonicalize(obj[i5], stack, replacementStack, replacer, key2);
    return stack.pop(), replacementStack.pop(), canonicalizedObj;
  }
  if (obj && obj.toJSON)
    obj = obj.toJSON();
  if (_typeof(obj) === "object" && obj !== null) {
    stack.push(obj), canonicalizedObj = {}, replacementStack.push(canonicalizedObj);
    var sortedKeys = [], _key;
    for (_key in obj)
      if (Object.prototype.hasOwnProperty.call(obj, _key))
        sortedKeys.push(_key);
    sortedKeys.sort();
    for (i5 = 0;i5 < sortedKeys.length; i5 += 1)
      _key = sortedKeys[i5], canonicalizedObj[_key] = canonicalize(obj[_key], stack, replacementStack, replacer, _key);
    stack.pop(), replacementStack.pop();
  } else
    canonicalizedObj = obj;
  return canonicalizedObj;
}
