// function: clipsBothAxes
function clipsBothAxes(node) {
  let ox = node.style.overflowX ?? node.style.overflow, oy = node.style.overflowY ?? node.style.overflow;
  return (ox === "hidden" || ox === "scroll") && (oy === "hidden" || oy === "scroll");
}
