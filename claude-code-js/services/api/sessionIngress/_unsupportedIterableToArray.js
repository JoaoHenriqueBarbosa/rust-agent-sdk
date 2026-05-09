// function: _unsupportedIterableToArray
function _unsupportedIterableToArray(o5, minLen) {
  if (!o5)
    return;
  if (typeof o5 === "string")
    return _arrayLikeToArray(o5, minLen);
  var n5 = Object.prototype.toString.call(o5).slice(8, -1);
  if (n5 === "Object" && o5.constructor)
    n5 = o5.constructor.name;
  if (n5 === "Map" || n5 === "Set")
    return Array.from(o5);
  if (n5 === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n5))
    return _arrayLikeToArray(o5, minLen);
}
