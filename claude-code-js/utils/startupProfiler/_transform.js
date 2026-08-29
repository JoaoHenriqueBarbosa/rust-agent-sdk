// function: _transform
function _transform(Class2, fn) {
  return new Class2({
    type: "transform",
    transform: fn
  });
}
