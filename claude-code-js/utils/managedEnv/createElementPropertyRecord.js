// function: createElementPropertyRecord
function createElementPropertyRecord(el, attr, getCurrentValue, setValue, mutationRunner) {
  var currentValue = getCurrentValue(el), record3 = {
    isDirty: !1,
    originalValue: currentValue,
    virtualValue: currentValue,
    mutations: [],
    el,
    _positionTimeout: null,
    observer: new MutationObserver(function() {
      if (attr === "position" && record3._positionTimeout)
        return;
      else if (attr === "position")
        record3._positionTimeout = setTimeout(function() {
          record3._positionTimeout = null;
        }, 1000);
      var currentValue2 = getCurrentValue(el);
      if (attr === "position" && currentValue2.parentNode === record3.virtualValue.parentNode && currentValue2.insertBeforeNode === record3.virtualValue.insertBeforeNode)
        return;
      if (currentValue2 === record3.virtualValue)
        return;
      record3.originalValue = currentValue2, mutationRunner(record3);
    }),
    mutationRunner,
    setValue,
    getCurrentValue
  };
  if (attr === "position" && el.parentNode)
    record3.observer.observe(el.parentNode, {
      childList: !0,
      subtree: !0,
      attributes: !1,
      characterData: !1
    });
  else
    record3.observer.observe(el, getObserverInit(attr));
  return record3;
}
