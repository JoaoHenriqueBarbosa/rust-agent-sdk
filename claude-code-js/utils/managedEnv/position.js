// function: position
function position(selector, mutate) {
  return newMutation({
    kind: "position",
    elements: /* @__PURE__ */ new Set,
    mutate,
    selector
  });
}
