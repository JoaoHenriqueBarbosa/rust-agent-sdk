// function: getObserverInit
function getObserverInit(attr) {
  return attr === "html" ? {
    childList: !0,
    subtree: !0,
    attributes: !0,
    characterData: !0
  } : {
    childList: !1,
    subtree: !1,
    attributes: !0,
    attributeFilter: [attr]
  };
}
