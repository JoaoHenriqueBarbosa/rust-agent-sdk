// function: _readonly
function _readonly(Class2, innerType) {
  return new Class2({
    type: "readonly",
    innerType
  });
}
