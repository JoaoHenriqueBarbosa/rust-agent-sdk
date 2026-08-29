// function: setWith
function setWith(object2, path16, value, customizer) {
  return customizer = typeof customizer == "function" ? customizer : void 0, object2 == null ? object2 : _baseSet_default(object2, path16, value, customizer);
}
