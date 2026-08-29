// function: resolveGap
function resolveGap(style, gutter, ownerSize) {
  let v2 = style.gap[gutter];
  if (v2.unit === Unit.Undefined)
    v2 = style.gap[Gutter.All];
  let r4 = resolveValue(v2, ownerSize);
  return isDefined(r4) ? Math.max(0, r4) : 0;
}
