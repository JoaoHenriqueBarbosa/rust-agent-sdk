// function: connectGlobalObserver
function connectGlobalObserver() {
  if (typeof document > "u")
    return;
  if (!observer)
    observer = new MutationObserver(function() {
      refreshAllElementSets();
    });
  refreshAllElementSets(), observer.observe(document.documentElement, {
    childList: !0,
    subtree: !0,
    attributes: !1,
    characterData: !1
  });
}
