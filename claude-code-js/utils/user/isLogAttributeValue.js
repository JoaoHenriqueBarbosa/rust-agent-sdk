// function: isLogAttributeValue
function isLogAttributeValue(val) {
  return isLogAttributeValueInternal(val, /* @__PURE__ */ new WeakSet);
}
