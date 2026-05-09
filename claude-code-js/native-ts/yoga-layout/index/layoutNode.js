// function: layoutNode
function layoutNode(node, availableWidth, availableHeight, widthMode, heightMode, ownerWidth, ownerHeight, performLayout, forceWidth = !1, forceHeight = !1) {
  _yogaNodesVisited++;
  let { style, layout } = node, sameGen = node._cGen === _generation && !performLayout;
  if (!node.isDirty_ || sameGen) {
    if (!node.isDirty_ && node._hasL && node._lWM === widthMode && node._lHM === heightMode && node._lFW === forceWidth && node._lFH === forceHeight && sameFloat(node._lW, availableWidth) && sameFloat(node._lH, availableHeight) && sameFloat(node._lOW, ownerWidth) && sameFloat(node._lOH, ownerHeight)) {
      _yogaCacheHits++, layout.width = node._lOutW, layout.height = node._lOutH;
      return;
    }
    if (node._cN > 0 && (sameGen || !node.isDirty_)) {
      let cIn = node._cIn;
      for (let i4 = 0;i4 < node._cN; i4++) {
        let o5 = i4 * 8;
        if (cIn[o5 + 2] === widthMode && cIn[o5 + 3] === heightMode && cIn[o5 + 6] === (forceWidth ? 1 : 0) && cIn[o5 + 7] === (forceHeight ? 1 : 0) && sameFloat(cIn[o5], availableWidth) && sameFloat(cIn[o5 + 1], availableHeight) && sameFloat(cIn[o5 + 4], ownerWidth) && sameFloat(cIn[o5 + 5], ownerHeight)) {
          layout.width = node._cOut[i4 * 2], layout.height = node._cOut[i4 * 2 + 1], _yogaCacheHits++;
          return;
        }
      }
    }
    if (!node.isDirty_ && !performLayout && node._hasM && node._mWM === widthMode && node._mHM === heightMode && sameFloat(node._mW, availableWidth) && sameFloat(node._mH, availableHeight) && sameFloat(node._mOW, ownerWidth) && sameFloat(node._mOH, ownerHeight)) {
      layout.width = node._mOutW, layout.height = node._mOutH, _yogaCacheHits++;
      return;
    }
  }
  let wasDirty = node.isDirty_;
  if (performLayout) {
    if (node._lW = availableWidth, node._lH = availableHeight, node._lWM = widthMode, node._lHM = heightMode, node._lOW = ownerWidth, node._lOH = ownerHeight, node._lFW = forceWidth, node._lFH = forceHeight, node._hasL = !0, node.isDirty_ = !1, wasDirty)
      node._hasM = !1;
  } else if (node._mW = availableWidth, node._mH = availableHeight, node._mWM = widthMode, node._mHM = heightMode, node._mOW = ownerWidth, node._mOH = ownerHeight, node._hasM = !0, wasDirty)
    node._hasL = !1;
  let { padding: pad, border: bor, margin: mar } = layout;
  if (node._hasPadding)
    resolveEdges4Into(style.padding, ownerWidth, pad);
  else
    pad[0] = pad[1] = pad[2] = pad[3] = 0;
  if (node._hasBorder)
    resolveEdges4Into(style.border, ownerWidth, bor);
  else
    bor[0] = bor[1] = bor[2] = bor[3] = 0;
  if (node._hasMargin)
    resolveEdges4Into(style.margin, ownerWidth, mar);
  else
    mar[0] = mar[1] = mar[2] = mar[3] = 0;
  let paddingBorderWidth = pad[0] + pad[2] + bor[0] + bor[2], paddingBorderHeight = pad[1] + pad[3] + bor[1] + bor[3], styleWidth = forceWidth ? NaN : resolveValue(style.width, ownerWidth), styleHeight = forceHeight ? NaN : resolveValue(style.height, ownerHeight), width = availableWidth, height = availableHeight, wMode = widthMode, hMode = heightMode;
  if (isDefined(styleWidth))
    width = styleWidth, wMode = MeasureMode.Exactly;
  if (isDefined(styleHeight))
    height = styleHeight, hMode = MeasureMode.Exactly;
  if (width = boundAxis(style, !0, width, ownerWidth, ownerHeight), height = boundAxis(style, !1, height, ownerWidth, ownerHeight), node.measureFunc && node.children.length === 0) {
    let innerW = wMode === MeasureMode.Undefined ? NaN : Math.max(0, width - paddingBorderWidth), innerH = hMode === MeasureMode.Undefined ? NaN : Math.max(0, height - paddingBorderHeight);
    _yogaMeasureCalls++;
    let measured = node.measureFunc(innerW, wMode, innerH, hMode);
    node.layout.width = wMode === MeasureMode.Exactly ? width : boundAxis(style, !0, (measured.width ?? 0) + paddingBorderWidth, ownerWidth, ownerHeight), node.layout.height = hMode === MeasureMode.Exactly ? height : boundAxis(style, !1, (measured.height ?? 0) + paddingBorderHeight, ownerWidth, ownerHeight), commitCacheOutputs(node, performLayout), cacheWrite(node, availableWidth, availableHeight, widthMode, heightMode, ownerWidth, ownerHeight, forceWidth, forceHeight, wasDirty);
    return;
  }
  if (node.children.length === 0) {
    node.layout.width = wMode === MeasureMode.Exactly ? width : boundAxis(style, !0, paddingBorderWidth, ownerWidth, ownerHeight), node.layout.height = hMode === MeasureMode.Exactly ? height : boundAxis(style, !1, paddingBorderHeight, ownerWidth, ownerHeight), commitCacheOutputs(node, performLayout), cacheWrite(node, availableWidth, availableHeight, widthMode, heightMode, ownerWidth, ownerHeight, forceWidth, forceHeight, wasDirty);
    return;
  }
  let mainAxis = style.flexDirection, crossAx = crossAxis(mainAxis), isMainRow = isRow(mainAxis), mainSize = isMainRow ? width : height, crossSize = isMainRow ? height : width, mainMode = isMainRow ? wMode : hMode, crossMode = isMainRow ? hMode : wMode, mainPadBorder = isMainRow ? paddingBorderWidth : paddingBorderHeight, crossPadBorder = isMainRow ? paddingBorderHeight : paddingBorderWidth, innerMainSize = isDefined(mainSize) ? Math.max(0, mainSize - mainPadBorder) : NaN, innerCrossSize = isDefined(crossSize) ? Math.max(0, crossSize - crossPadBorder) : NaN, gapMain = resolveGap(style, isMainRow ? Gutter.Column : Gutter.Row, innerMainSize), flowChildren = [], absChildren = [];
  collectLayoutChildren(node, flowChildren, absChildren);
  let ownerW = isDefined(width) ? width : NaN, ownerH = isDefined(height) ? height : NaN, isWrap = style.flexWrap !== Wrap.NoWrap, gapCross = resolveGap(style, isMainRow ? Gutter.Row : Gutter.Column, innerCrossSize);
  for (let c3 of flowChildren)
    c3._flexBasis = computeFlexBasis(c3, mainAxis, innerMainSize, innerCrossSize, crossMode, ownerW, ownerH);
  let lines = [];
  if (!isWrap || !isDefined(innerMainSize) || flowChildren.length === 0) {
    for (let c3 of flowChildren)
      c3._lineIndex = 0;
    lines.push(flowChildren);
  } else {
    let lineStart = 0, lineLen = 0;
    for (let i4 = 0;i4 < flowChildren.length; i4++) {
      let c3 = flowChildren[i4], hypo = boundAxis(c3.style, isMainRow, c3._flexBasis, ownerW, ownerH), outer = Math.max(0, hypo) + childMarginForAxis(c3, mainAxis, ownerW), withGap = i4 > lineStart ? gapMain : 0;
      if (i4 > lineStart && lineLen + withGap + outer > innerMainSize)
        lines.push(flowChildren.slice(lineStart, i4)), lineStart = i4, lineLen = outer;
      else
        lineLen += withGap + outer;
      c3._lineIndex = lines.length;
    }
    lines.push(flowChildren.slice(lineStart));
  }
  let lineCount = lines.length, isBaseline = isBaselineLayout(node, flowChildren), lineConsumedMain = Array(lineCount), lineCrossSizes = Array(lineCount), lineMaxAscent = isBaseline ? Array(lineCount).fill(0) : [], maxLineMain = 0, totalLinesCross = 0;
  for (let li = 0;li < lineCount; li++) {
    let line = lines[li], lineGap = line.length > 1 ? gapMain * (line.length - 1) : 0, lineBasis = lineGap;
    for (let c3 of line)
      lineBasis += c3._flexBasis + childMarginForAxis(c3, mainAxis, ownerW);
    let availMain = innerMainSize;
    if (!isDefined(availMain)) {
      let mainOwner = isMainRow ? ownerWidth : ownerHeight, minM = resolveValue(isMainRow ? style.minWidth : style.minHeight, mainOwner), maxM = resolveValue(isMainRow ? style.maxWidth : style.maxHeight, mainOwner);
      if (isDefined(maxM) && lineBasis > maxM - mainPadBorder)
        availMain = Math.max(0, maxM - mainPadBorder);
      else if (isDefined(minM) && lineBasis < minM - mainPadBorder)
        availMain = Math.max(0, minM - mainPadBorder);
    }
    resolveFlexibleLengths(line, availMain, lineBasis, isMainRow, ownerW, ownerH);
    let lineCross = 0;
    for (let c3 of line) {
      let cStyle = c3.style, childAlign = cStyle.alignSelf === Align.Auto ? style.alignItems : cStyle.alignSelf, cMarginCross = childMarginForAxis(c3, crossAx, ownerW), childCrossSize = NaN, childCrossMode = MeasureMode.Undefined, resolvedCrossStyle = resolveValue(isMainRow ? cStyle.height : cStyle.width, isMainRow ? ownerH : ownerW), crossLeadE = isMainRow ? EDGE_TOP : EDGE_LEFT, crossTrailE = isMainRow ? EDGE_BOTTOM : EDGE_RIGHT, hasCrossAutoMargin = c3._hasAutoMargin && (isMarginAuto(cStyle.margin, crossLeadE) || isMarginAuto(cStyle.margin, crossTrailE));
      if (isDefined(resolvedCrossStyle))
        childCrossSize = resolvedCrossStyle, childCrossMode = MeasureMode.Exactly;
      else if (childAlign === Align.Stretch && !hasCrossAutoMargin && !isWrap && isDefined(innerCrossSize) && crossMode === MeasureMode.Exactly)
        childCrossSize = Math.max(0, innerCrossSize - cMarginCross), childCrossMode = MeasureMode.Exactly;
      else if (!isWrap && isDefined(innerCrossSize))
        childCrossSize = Math.max(0, innerCrossSize - cMarginCross), childCrossMode = MeasureMode.AtMost;
      let cw = isMainRow ? c3._mainSize : childCrossSize, ch = isMainRow ? childCrossSize : c3._mainSize;
      layoutNode(c3, cw, ch, isMainRow ? MeasureMode.Exactly : childCrossMode, isMainRow ? childCrossMode : MeasureMode.Exactly, ownerW, ownerH, performLayout, isMainRow, !isMainRow), c3._crossSize = isMainRow ? c3.layout.height : c3.layout.width, lineCross = Math.max(lineCross, c3._crossSize + cMarginCross);
    }
    if (isBaseline) {
      let maxAscent = 0, maxDescent = 0;
      for (let c3 of line) {
        if (resolveChildAlign(node, c3) !== Align.Baseline)
          continue;
        let mTop = resolveEdge(c3.style.margin, EDGE_TOP, ownerW), mBot = resolveEdge(c3.style.margin, EDGE_BOTTOM, ownerW), ascent = calculateBaseline(c3) + mTop, descent = c3.layout.height + mTop + mBot - ascent;
        if (ascent > maxAscent)
          maxAscent = ascent;
        if (descent > maxDescent)
          maxDescent = descent;
      }
      if (lineMaxAscent[li] = maxAscent, maxAscent + maxDescent > lineCross)
        lineCross = maxAscent + maxDescent;
    }
    let mainLead = leadingEdge(mainAxis), mainTrail = trailingEdge(mainAxis), consumed = lineGap;
    for (let c3 of line) {
      let cm = c3.layout.margin;
      consumed += c3._mainSize + cm[mainLead] + cm[mainTrail];
    }
    lineConsumedMain[li] = consumed, lineCrossSizes[li] = lineCross, maxLineMain = Math.max(maxLineMain, consumed), totalLinesCross += lineCross;
  }
  let totalCrossGap = lineCount > 1 ? gapCross * (lineCount - 1) : 0;
  totalLinesCross += totalCrossGap;
  let isScroll = style.overflow === Overflow.Scroll, contentMain = maxLineMain + mainPadBorder, finalMainSize = mainMode === MeasureMode.Exactly ? mainSize : mainMode === MeasureMode.AtMost && isScroll ? Math.max(Math.min(mainSize, contentMain), mainPadBorder) : isWrap && lineCount > 1 && mainMode === MeasureMode.AtMost ? mainSize : contentMain, contentCross = totalLinesCross + crossPadBorder, finalCrossSize = crossMode === MeasureMode.Exactly ? crossSize : crossMode === MeasureMode.AtMost && isScroll ? Math.max(Math.min(crossSize, contentCross), crossPadBorder) : contentCross;
  if (node.layout.width = boundAxis(style, !0, isMainRow ? finalMainSize : finalCrossSize, ownerWidth, ownerHeight), node.layout.height = boundAxis(style, !1, isMainRow ? finalCrossSize : finalMainSize, ownerWidth, ownerHeight), commitCacheOutputs(node, performLayout), cacheWrite(node, availableWidth, availableHeight, widthMode, heightMode, ownerWidth, ownerHeight, forceWidth, forceHeight, wasDirty), !performLayout)
    return;
  let actualInnerMain = (isMainRow ? node.layout.width : node.layout.height) - mainPadBorder, actualInnerCross = (isMainRow ? node.layout.height : node.layout.width) - crossPadBorder, mainLeadEdgePhys = leadingEdge(mainAxis), mainTrailEdgePhys = trailingEdge(mainAxis), crossLeadEdgePhys = isMainRow ? EDGE_TOP : EDGE_LEFT, crossTrailEdgePhys = isMainRow ? EDGE_BOTTOM : EDGE_RIGHT, reversed = isReverse(mainAxis), mainContainerSize = isMainRow ? node.layout.width : node.layout.height, lineCrossOffset = pad[crossLeadEdgePhys] + bor[crossLeadEdgePhys], betweenLines = gapCross, freeCross = actualInnerCross - totalLinesCross;
  if (lineCount === 1 && !isWrap && !isBaseline)
    lineCrossSizes[0] = actualInnerCross;
  else {
    let remCross = Math.max(0, freeCross);
    switch (style.alignContent) {
      case Align.FlexStart:
        break;
      case Align.Center:
        lineCrossOffset += freeCross / 2;
        break;
      case Align.FlexEnd:
        lineCrossOffset += freeCross;
        break;
      case Align.Stretch:
        if (lineCount > 0 && remCross > 0) {
          let add = remCross / lineCount;
          for (let i4 = 0;i4 < lineCount; i4++)
            lineCrossSizes[i4] += add;
        }
        break;
      case Align.SpaceBetween:
        if (lineCount > 1)
          betweenLines += remCross / (lineCount - 1);
        break;
      case Align.SpaceAround:
        if (lineCount > 0)
          betweenLines += remCross / lineCount, lineCrossOffset += remCross / lineCount / 2;
        break;
      case Align.SpaceEvenly:
        if (lineCount > 0)
          betweenLines += remCross / (lineCount + 1), lineCrossOffset += remCross / (lineCount + 1);
        break;
      default:
        break;
    }
  }
  let wrapReverse = style.flexWrap === Wrap.WrapReverse, crossContainerSize = isMainRow ? node.layout.height : node.layout.width, lineCrossPos = lineCrossOffset;
  for (let li = 0;li < lineCount; li++) {
    let line = lines[li], lineCross = lineCrossSizes[li], consumedMain = lineConsumedMain[li], n5 = line.length;
    if (isWrap || crossMode !== MeasureMode.Exactly)
      for (let c3 of line) {
        let cStyle = c3.style, childAlign = cStyle.alignSelf === Align.Auto ? style.alignItems : cStyle.alignSelf, crossStyleDef = isDefined(resolveValue(isMainRow ? cStyle.height : cStyle.width, isMainRow ? ownerH : ownerW)), hasCrossAutoMargin = c3._hasAutoMargin && (isMarginAuto(cStyle.margin, crossLeadEdgePhys) || isMarginAuto(cStyle.margin, crossTrailEdgePhys));
        if (childAlign === Align.Stretch && !crossStyleDef && !hasCrossAutoMargin) {
          let cMarginCross = childMarginForAxis(c3, crossAx, ownerW), target = Math.max(0, lineCross - cMarginCross);
          if (c3._crossSize !== target) {
            let cw = isMainRow ? c3._mainSize : target, ch = isMainRow ? target : c3._mainSize;
            layoutNode(c3, cw, ch, MeasureMode.Exactly, MeasureMode.Exactly, ownerW, ownerH, performLayout, isMainRow, !isMainRow), c3._crossSize = target;
          }
        }
      }
    let mainOffset = pad[mainLeadEdgePhys] + bor[mainLeadEdgePhys], betweenMain = gapMain, numAutoMarginsMain = 0;
    for (let c3 of line) {
      if (!c3._hasAutoMargin)
        continue;
      if (isMarginAuto(c3.style.margin, mainLeadEdgePhys))
        numAutoMarginsMain++;
      if (isMarginAuto(c3.style.margin, mainTrailEdgePhys))
        numAutoMarginsMain++;
    }
    let freeMain = actualInnerMain - consumedMain, remainingMain = Math.max(0, freeMain), autoMarginMainSize = numAutoMarginsMain > 0 && remainingMain > 0 ? remainingMain / numAutoMarginsMain : 0;
    if (numAutoMarginsMain === 0)
      switch (style.justifyContent) {
        case Justify.FlexStart:
          break;
        case Justify.Center:
          mainOffset += freeMain / 2;
          break;
        case Justify.FlexEnd:
          mainOffset += freeMain;
          break;
        case Justify.SpaceBetween:
          if (n5 > 1)
            betweenMain += remainingMain / (n5 - 1);
          break;
        case Justify.SpaceAround:
          if (n5 > 0)
            betweenMain += remainingMain / n5, mainOffset += remainingMain / n5 / 2;
          break;
        case Justify.SpaceEvenly:
          if (n5 > 0)
            betweenMain += remainingMain / (n5 + 1), mainOffset += remainingMain / (n5 + 1);
          break;
      }
    let effectiveLineCrossPos = wrapReverse ? crossContainerSize - lineCrossPos - lineCross : lineCrossPos, pos = mainOffset;
    for (let c3 of line) {
      let cMargin = c3.style.margin, cLayoutMargin = c3.layout.margin, autoMainLead = !1, autoMainTrail = !1, autoCrossLead = !1, autoCrossTrail = !1, mMainLead, mMainTrail, mCrossLead, mCrossTrail;
      if (c3._hasAutoMargin)
        autoMainLead = isMarginAuto(cMargin, mainLeadEdgePhys), autoMainTrail = isMarginAuto(cMargin, mainTrailEdgePhys), autoCrossLead = isMarginAuto(cMargin, crossLeadEdgePhys), autoCrossTrail = isMarginAuto(cMargin, crossTrailEdgePhys), mMainLead = autoMainLead ? autoMarginMainSize : cLayoutMargin[mainLeadEdgePhys], mMainTrail = autoMainTrail ? autoMarginMainSize : cLayoutMargin[mainTrailEdgePhys], mCrossLead = autoCrossLead ? 0 : cLayoutMargin[crossLeadEdgePhys], mCrossTrail = autoCrossTrail ? 0 : cLayoutMargin[crossTrailEdgePhys];
      else
        mMainLead = cLayoutMargin[mainLeadEdgePhys], mMainTrail = cLayoutMargin[mainTrailEdgePhys], mCrossLead = cLayoutMargin[crossLeadEdgePhys], mCrossTrail = cLayoutMargin[crossTrailEdgePhys];
      let mainPos = reversed ? mainContainerSize - (pos + mMainLead) - c3._mainSize : pos + mMainLead, childAlign = c3.style.alignSelf === Align.Auto ? style.alignItems : c3.style.alignSelf, crossPos = effectiveLineCrossPos + mCrossLead, crossFree = lineCross - c3._crossSize - mCrossLead - mCrossTrail;
      if (autoCrossLead && autoCrossTrail)
        crossPos += Math.max(0, crossFree) / 2;
      else if (autoCrossLead)
        crossPos += Math.max(0, crossFree);
      else if (autoCrossTrail)
        ;
      else
        switch (childAlign) {
          case Align.FlexStart:
          case Align.Stretch:
            if (wrapReverse)
              crossPos += crossFree;
            break;
          case Align.Center:
            crossPos += crossFree / 2;
            break;
          case Align.FlexEnd:
            if (!wrapReverse)
              crossPos += crossFree;
            break;
          case Align.Baseline:
            if (isBaseline)
              crossPos = effectiveLineCrossPos + lineMaxAscent[li] - calculateBaseline(c3);
            break;
          default:
            break;
        }
      let relX = 0, relY = 0;
      if (c3._hasPosition) {
        let relLeft = resolveValue(resolveEdgeRaw(c3.style.position, EDGE_LEFT), ownerW), relRight = resolveValue(resolveEdgeRaw(c3.style.position, EDGE_RIGHT), ownerW), relTop = resolveValue(resolveEdgeRaw(c3.style.position, EDGE_TOP), ownerW), relBottom = resolveValue(resolveEdgeRaw(c3.style.position, EDGE_BOTTOM), ownerW);
        relX = isDefined(relLeft) ? relLeft : isDefined(relRight) ? -relRight : 0, relY = isDefined(relTop) ? relTop : isDefined(relBottom) ? -relBottom : 0;
      }
      if (isMainRow)
        c3.layout.left = mainPos + relX, c3.layout.top = crossPos + relY;
      else
        c3.layout.left = crossPos + relX, c3.layout.top = mainPos + relY;
      pos += c3._mainSize + mMainLead + mMainTrail + betweenMain;
    }
    lineCrossPos += lineCross + betweenLines;
  }
  for (let c3 of absChildren)
    layoutAbsoluteChild(node, c3, node.layout.width, node.layout.height, pad, bor);
}
