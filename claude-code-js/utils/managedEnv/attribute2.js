// function: attribute2
function attribute2(selector, attribute3, mutate) {
  if (!validAttributeName.test(attribute3))
    return nullController;
  if (attribute3 === "class" || attribute3 === "className")
    return classes(selector, function(classnames) {
      var mutatedClassnames = mutate(Array.from(classnames).join(" "));
      if (classnames.clear(), !mutatedClassnames)
        return;
      mutatedClassnames.split(/\s+/g).filter(Boolean).forEach(function(c3) {
        return classnames.add(c3);
      });
    });
  return newMutation({
    kind: "attribute",
    attribute: attribute3,
    elements: /* @__PURE__ */ new Set,
    mutate,
    selector
  });
}
