// function: classes
function classes(selector, mutate) {
  return newMutation({
    kind: "class",
    elements: /* @__PURE__ */ new Set,
    mutate,
    selector
  });
}
