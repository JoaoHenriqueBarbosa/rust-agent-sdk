// function: _temp77
function _temp77(cat) {
  return cat.tokens > 0 && cat.name !== "Free space" && cat.name !== RESERVED_CATEGORY_NAME2 && !cat.isDeferred;
}
