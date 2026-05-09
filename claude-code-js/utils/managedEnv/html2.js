// function: html2
function html2(selector, mutate) {
  return newMutation({
    kind: "html",
    elements: /* @__PURE__ */ new Set,
    mutate,
    selector
  });
}
