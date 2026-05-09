// function: blitEscapingAbsoluteDescendants
function blitEscapingAbsoluteDescendants(node, output, prevScreen, px, py, pw, ph) {
  let pr = px + pw, pb = py + ph;
  for (let child of node.childNodes) {
    if (child.nodeName === "#text")
      continue;
    let elem = child;
    if (elem.style.position === "absolute") {
      let cached2 = nodeCache.get(elem);
      if (cached2) {
        absoluteRectsCur.push(cached2);
        let cx = Math.floor(cached2.x), cy = Math.floor(cached2.y), cw = Math.floor(cached2.width), ch = Math.floor(cached2.height);
        if (cx < px || cy < py || cx + cw > pr || cy + ch > pb)
          output.blit(prevScreen, cx, cy, cw, ch);
      }
    }
    blitEscapingAbsoluteDescendants(elem, output, prevScreen, px, py, pw, ph);
  }
}
