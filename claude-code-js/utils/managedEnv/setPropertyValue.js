// function: setPropertyValue
function setPropertyValue(el, attr, m4) {
  if (!m4.isDirty)
    return;
  m4.isDirty = !1;
  var val = m4.virtualValue;
  if (!m4.mutations.length)
    deleteElementPropertyRecord(el, attr);
  m4.setValue(el, val);
}
