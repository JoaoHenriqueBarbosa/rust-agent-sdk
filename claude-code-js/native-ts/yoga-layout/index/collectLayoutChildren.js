// function: collectLayoutChildren
function collectLayoutChildren(node, flow, abs) {
  for (let c3 of node.children) {
    let disp = c3.style.display;
    if (disp === Display.None)
      c3.layout.left = 0, c3.layout.top = 0, c3.layout.width = 0, c3.layout.height = 0, zeroLayoutRecursive(c3);
    else if (disp === Display.Contents)
      c3.layout.left = 0, c3.layout.top = 0, c3.layout.width = 0, c3.layout.height = 0, collectLayoutChildren(c3, flow, abs);
    else if (c3.style.positionType === PositionType.Absolute)
      abs.push(c3);
    else
      flow.push(c3);
  }
}
