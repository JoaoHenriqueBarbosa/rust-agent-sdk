// function: queueIfNeeded
function queueIfNeeded(val, record3) {
  var currentVal = record3.getCurrentValue(record3.el);
  if (record3.virtualValue = val, val && typeof val !== "string") {
    if (!currentVal || val.parentNode !== currentVal.parentNode || val.insertBeforeNode !== currentVal.insertBeforeNode)
      record3.isDirty = !0, runDOMUpdates();
  } else if (val !== currentVal)
    record3.isDirty = !0, runDOMUpdates();
}
