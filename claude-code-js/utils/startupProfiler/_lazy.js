// function: _lazy
function _lazy(Class2, getter) {
  return new Class2({
    type: "lazy",
    getter
  });
}
