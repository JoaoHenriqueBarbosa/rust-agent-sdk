// function: zeroLayoutRecursive
function zeroLayoutRecursive(node) {
  for (let c3 of node.children)
    c3.layout.left = 0, c3.layout.top = 0, c3.layout.width = 0, c3.layout.height = 0, c3.isDirty_ = !0, c3._hasL = !1, c3._hasM = !1, zeroLayoutRecursive(c3);
}
