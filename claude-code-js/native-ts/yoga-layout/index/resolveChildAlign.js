// function: resolveChildAlign
function resolveChildAlign(parent, child) {
  return child.style.alignSelf === Align.Auto ? parent.style.alignItems : child.style.alignSelf;
}
