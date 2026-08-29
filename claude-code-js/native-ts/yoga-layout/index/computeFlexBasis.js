// function: computeFlexBasis
function computeFlexBasis(child, mainAxis, availableMain, availableCross, crossMode, ownerWidth, ownerHeight) {
  if ((child._fbGen === _generation || !child.isDirty_) && child._fbCrossMode === crossMode && sameFloat(child._fbOwnerW, ownerWidth) && sameFloat(child._fbOwnerH, ownerHeight) && sameFloat(child._fbAvailMain, availableMain) && sameFloat(child._fbAvailCross, availableCross))
    return child._fbBasis;
  let cs = child.style, isMainRow = isRow(mainAxis), basis = resolveValue(cs.flexBasis, availableMain);
  if (isDefined(basis)) {
    let b2 = Math.max(0, basis);
    return child._fbBasis = b2, child._fbOwnerW = ownerWidth, child._fbOwnerH = ownerHeight, child._fbAvailMain = availableMain, child._fbAvailCross = availableCross, child._fbCrossMode = crossMode, child._fbGen = _generation, b2;
  }
  let mainStyleDim = isMainRow ? cs.width : cs.height, resolved = resolveValue(mainStyleDim, isMainRow ? ownerWidth : ownerHeight);
  if (isDefined(resolved)) {
    let b2 = Math.max(0, resolved);
    return child._fbBasis = b2, child._fbOwnerW = ownerWidth, child._fbOwnerH = ownerHeight, child._fbAvailMain = availableMain, child._fbAvailCross = availableCross, child._fbCrossMode = crossMode, child._fbGen = _generation, b2;
  }
  let crossStyleDim = isMainRow ? cs.height : cs.width, crossConstraint = resolveValue(crossStyleDim, isMainRow ? ownerHeight : ownerWidth), crossConstraintMode = isDefined(crossConstraint) ? MeasureMode.Exactly : MeasureMode.Undefined;
  if (!isDefined(crossConstraint) && isDefined(availableCross))
    crossConstraint = availableCross, crossConstraintMode = crossMode === MeasureMode.Exactly && isStretchAlign(child) ? MeasureMode.Exactly : MeasureMode.AtMost;
  let mainConstraint = NaN, mainConstraintMode = MeasureMode.Undefined;
  if (isMainRow && isDefined(availableMain) && hasMeasureFuncInSubtree(child))
    mainConstraint = availableMain, mainConstraintMode = MeasureMode.AtMost;
  layoutNode(child, isMainRow ? mainConstraint : crossConstraint, isMainRow ? crossConstraint : mainConstraint, isMainRow ? mainConstraintMode : crossConstraintMode, isMainRow ? crossConstraintMode : mainConstraintMode, ownerWidth, ownerHeight, !1);
  let b = isMainRow ? child.layout.width : child.layout.height;
  return child._fbBasis = b, child._fbOwnerW = ownerWidth, child._fbOwnerH = ownerHeight, child._fbAvailMain = availableMain, child._fbAvailCross = availableCross, child._fbCrossMode = crossMode, child._fbGen = _generation, b;
}
