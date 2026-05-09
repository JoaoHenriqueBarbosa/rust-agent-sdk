// function: _nullable
function _nullable(Class2, innerType) {
  return new Class2({
    type: "nullable",
    innerType
  });
}
