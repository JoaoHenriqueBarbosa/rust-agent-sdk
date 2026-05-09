// function: allWorkingDirectories
function allWorkingDirectories(context7) {
  return /* @__PURE__ */ new Set([
    getOriginalCwd(),
    ...context7.additionalWorkingDirectories.keys()
  ]);
}
