// function: resolveFlexibleLengths
function resolveFlexibleLengths(children, availableInnerMain, totalFlexBasis, isMainRow, ownerW, ownerH) {
  let n5 = children.length, frozen = Array(n5).fill(!1), initialFree = isDefined(availableInnerMain) ? availableInnerMain - totalFlexBasis : 0;
  for (let i4 = 0;i4 < n5; i4++) {
    let c3 = children[i4], clamped = boundAxis(c3.style, isMainRow, c3._flexBasis, ownerW, ownerH);
    if (!isDefined(availableInnerMain) || (initialFree >= 0 ? c3.style.flexGrow === 0 : c3.style.flexShrink === 0))
      c3._mainSize = Math.max(0, clamped), frozen[i4] = !0;
    else
      c3._mainSize = c3._flexBasis;
  }
  let unclamped = Array(n5);
  for (let iter = 0;iter <= n5; iter++) {
    let frozenDelta = 0, totalGrow = 0, totalShrinkScaled = 0, unfrozenCount = 0;
    for (let i4 = 0;i4 < n5; i4++) {
      let c3 = children[i4];
      if (frozen[i4])
        frozenDelta += c3._mainSize - c3._flexBasis;
      else
        totalGrow += c3.style.flexGrow, totalShrinkScaled += c3.style.flexShrink * c3._flexBasis, unfrozenCount++;
    }
    if (unfrozenCount === 0)
      break;
    let remaining = initialFree - frozenDelta;
    if (remaining > 0 && totalGrow > 0 && totalGrow < 1) {
      let scaled = initialFree * totalGrow;
      if (scaled < remaining)
        remaining = scaled;
    } else if (remaining < 0 && totalShrinkScaled > 0) {
      let totalShrink = 0;
      for (let i4 = 0;i4 < n5; i4++)
        if (!frozen[i4])
          totalShrink += children[i4].style.flexShrink;
      if (totalShrink < 1) {
        let scaled = initialFree * totalShrink;
        if (scaled > remaining)
          remaining = scaled;
      }
    }
    let totalViolation = 0;
    for (let i4 = 0;i4 < n5; i4++) {
      if (frozen[i4])
        continue;
      let c3 = children[i4], t2 = c3._flexBasis;
      if (remaining > 0 && totalGrow > 0)
        t2 += remaining * c3.style.flexGrow / totalGrow;
      else if (remaining < 0 && totalShrinkScaled > 0)
        t2 += remaining * (c3.style.flexShrink * c3._flexBasis) / totalShrinkScaled;
      unclamped[i4] = t2;
      let clamped = Math.max(0, boundAxis(c3.style, isMainRow, t2, ownerW, ownerH));
      c3._mainSize = clamped, totalViolation += clamped - t2;
    }
    if (totalViolation === 0)
      break;
    let anyFrozen = !1;
    for (let i4 = 0;i4 < n5; i4++) {
      if (frozen[i4])
        continue;
      let v2 = children[i4]._mainSize - unclamped[i4];
      if (totalViolation > 0 && v2 > 0 || totalViolation < 0 && v2 < 0)
        frozen[i4] = !0, anyFrozen = !0;
    }
    if (!anyFrozen)
      break;
  }
}
