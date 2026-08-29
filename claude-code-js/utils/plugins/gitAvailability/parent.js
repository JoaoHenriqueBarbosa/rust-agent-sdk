// function: parent
function parent(object2, path16) {
  return path16.length < 2 ? object2 : _baseGet_default(object2, _baseSlice_default(path16, 0, -1));
}
