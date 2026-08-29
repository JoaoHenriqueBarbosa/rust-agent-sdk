// function: hasVisibleSpaceEffect
function hasVisibleSpaceEffect(styles5) {
  for (let style of styles5)
    if (VISIBLE_ON_SPACE.has(style.endCode))
      return !0;
  return !1;
}
