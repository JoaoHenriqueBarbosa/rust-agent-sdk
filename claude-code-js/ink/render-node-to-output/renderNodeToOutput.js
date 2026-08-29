// function: renderNodeToOutput
function renderNodeToOutput(node, output, {
  offsetX = 0,
  offsetY = 0,
  prevScreen,
  skipSelfBlit = !1,
  inheritedBackgroundColor
}) {
  let { yogaNode } = node;
  if (yogaNode) {
    if (yogaNode.getDisplay() === LayoutDisplay.None) {
      if (node.dirty) {
        let cached3 = nodeCache.get(node);
        if (cached3)
          output.clear({
            x: Math.floor(cached3.x),
            y: Math.floor(cached3.y),
            width: Math.floor(cached3.width),
            height: Math.floor(cached3.height)
          }), dropSubtreeCache(node), layoutShifted = !0;
      }
      return;
    }
    let x3 = offsetX + yogaNode.getComputedLeft(), yogaTop = yogaNode.getComputedTop(), y2 = offsetY + yogaTop, width = yogaNode.getComputedWidth(), height = yogaNode.getComputedHeight();
    if (y2 < 0 && node.style.position === "absolute")
      y2 = 0;
    let cached2 = nodeCache.get(node);
    if (!node.dirty && !skipSelfBlit && node.pendingScrollDelta === void 0 && cached2 && cached2.x === x3 && cached2.y === y2 && cached2.width === width && cached2.height === height && prevScreen) {
      let fx = Math.floor(x3), fy = Math.floor(y2), fw = Math.floor(width), fh = Math.floor(height);
      if (output.blit(prevScreen, fx, fy, fw, fh), node.style.position === "absolute")
        absoluteRectsCur.push(cached2);
      blitEscapingAbsoluteDescendants(node, output, prevScreen, fx, fy, fw, fh);
      return;
    }
    let positionChanged = cached2 !== void 0 && (cached2.x !== x3 || cached2.y !== y2 || cached2.width !== width || cached2.height !== height);
    if (positionChanged)
      layoutShifted = !0;
    if (cached2 && (node.dirty || positionChanged))
      output.clear({
        x: Math.floor(cached2.x),
        y: Math.floor(cached2.y),
        width: Math.floor(cached2.width),
        height: Math.floor(cached2.height)
      }, node.style.position === "absolute");
    let clears = pendingClears.get(node), hasRemovedChild = clears !== void 0;
    if (hasRemovedChild) {
      layoutShifted = !0;
      for (let rect2 of clears)
        output.clear({
          x: Math.floor(rect2.x),
          y: Math.floor(rect2.y),
          width: Math.floor(rect2.width),
          height: Math.floor(rect2.height)
        });
      pendingClears.delete(node);
    }
    if (height === 0 && siblingSharesY(node, yogaNode)) {
      nodeCache.set(node, { x: x3, y: y2, width, height, top: yogaTop }), node.dirty = !1;
      return;
    }
    if (node.nodeName === "ink-raw-ansi") {
      let text = node.attributes.rawText;
      if (text)
        output.write(x3, y2, text);
    } else if (node.nodeName === "ink-text") {
      let segments = squashTextNodesToSegments(node, inheritedBackgroundColor ? { backgroundColor: inheritedBackgroundColor } : void 0), plainText = segments.map((s2) => s2.text).join("");
      if (plainText.length > 0) {
        let maxWidth = Math.min(get_max_width_default(yogaNode), output.width - x3), textWrap = node.style.textWrap ?? "wrap", needsWrapping = widestLine(plainText) > maxWidth, text, softWrap;
        if (needsWrapping && segments.length === 1) {
          let segment = segments[0], w2 = wrapWithSoftWrap(plainText, maxWidth, textWrap);
          softWrap = w2.softWrap, text = w2.wrapped.split(`
`).map((line) => {
            let styled = applyTextStyles(line, segment.styles);
            if (segment.hyperlink)
              styled = wrapWithOsc8Link(styled, segment.hyperlink);
            return styled;
          }).join(`
`);
        } else if (needsWrapping) {
          let w2 = wrapWithSoftWrap(plainText, maxWidth, textWrap);
          softWrap = w2.softWrap;
          let charToSegment = buildCharToSegmentMap(segments);
          text = applyStylesToWrappedText(w2.wrapped, segments, charToSegment, plainText, textWrap === "wrap-trim");
        } else
          text = segments.map((segment) => {
            let styledText = applyTextStyles(segment.text, segment.styles);
            if (segment.hyperlink)
              styledText = wrapWithOsc8Link(styledText, segment.hyperlink);
            return styledText;
          }).join("");
        text = applyPaddingToText(node, text, softWrap), output.write(x3, y2, text, softWrap);
      }
    } else if (node.nodeName === "ink-box") {
      let boxBackgroundColor = node.style.backgroundColor ?? inheritedBackgroundColor;
      if (node.style.noSelect) {
        let boxX = Math.floor(x3), fromEdge = node.style.noSelect === "from-left-edge";
        output.noSelect({
          x: fromEdge ? 0 : boxX,
          y: Math.floor(y2),
          width: fromEdge ? boxX + Math.floor(width) : Math.floor(width),
          height: Math.floor(height)
        });
      }
      let overflowX = node.style.overflowX ?? node.style.overflow, overflowY = node.style.overflowY ?? node.style.overflow, clipHorizontally = overflowX === "hidden" || overflowX === "scroll", clipVertically = overflowY === "hidden" || overflowY === "scroll", isScrollY = overflowY === "scroll", needsClip = clipHorizontally || clipVertically, y1, y22;
      if (needsClip) {
        let x1 = clipHorizontally ? x3 + yogaNode.getComputedBorder(LayoutEdge.Left) : void 0, x22 = clipHorizontally ? x3 + yogaNode.getComputedWidth() - yogaNode.getComputedBorder(LayoutEdge.Right) : void 0;
        y1 = clipVertically ? y2 + yogaNode.getComputedBorder(LayoutEdge.Top) : void 0, y22 = clipVertically ? y2 + yogaNode.getComputedHeight() - yogaNode.getComputedBorder(LayoutEdge.Bottom) : void 0, output.clip({ x1, x2: x22, y1, y2: y22 });
      }
      if (isScrollY) {
        let padTop = yogaNode.getComputedPadding(LayoutEdge.Top), innerHeight = Math.max(0, (y22 ?? y2 + height) - (y1 ?? y2) - padTop - yogaNode.getComputedPadding(LayoutEdge.Bottom)), content = node.childNodes.find((c3) => c3.yogaNode), contentYoga = content?.yogaNode, scrollHeight = contentYoga?.getComputedHeight() ?? 0, prevScrollHeight = node.scrollHeight ?? scrollHeight, prevInnerHeight = node.scrollViewportHeight ?? innerHeight;
        node.scrollHeight = scrollHeight, node.scrollViewportHeight = innerHeight, node.scrollViewportTop = (y1 ?? y2) + padTop;
        let maxScroll = Math.max(0, scrollHeight - innerHeight);
        if (node.scrollAnchor) {
          let anchorTop = node.scrollAnchor.el.yogaNode?.getComputedTop();
          if (anchorTop != null)
            node.scrollTop = anchorTop + node.scrollAnchor.offset, node.pendingScrollDelta = void 0;
          node.scrollAnchor = void 0;
        }
        let scrollTopBeforeFollow = node.scrollTop ?? 0, sticky = node.stickyScroll ?? Boolean(node.attributes.stickyScroll), prevMaxScroll = Math.max(0, prevScrollHeight - prevInnerHeight), grew = scrollHeight >= prevScrollHeight;
        if ((sticky || grew && scrollTopBeforeFollow >= prevMaxScroll) && (node.pendingScrollDelta ?? 0) >= 0) {
          if (node.scrollTop = maxScroll, node.pendingScrollDelta = void 0, node.stickyScroll === !1 && scrollTopBeforeFollow >= prevMaxScroll)
            node.stickyScroll = !0;
        }
        let followDelta = (node.scrollTop ?? 0) - scrollTopBeforeFollow;
        if (followDelta > 0) {
          let vpTop = node.scrollViewportTop ?? 0;
          followScroll = {
            delta: followDelta,
            viewportTop: vpTop,
            viewportBottom: vpTop + innerHeight - 1
          };
        }
        let cur = node.scrollTop ?? 0, pending = node.pendingScrollDelta, cMin = node.scrollClampMin, cMax = node.scrollClampMax, haveClamp = cMin !== void 0 && cMax !== void 0;
        if (pending !== void 0 && pending !== 0) {
          let eff = haveClamp && (pending < 0 && cur < cMin || pending > 0 && cur > cMax) ? Math.min(4, innerHeight >> 3) : innerHeight;
          cur += isXtermJsHost() ? drainAdaptive(node, pending, eff) : drainProportional(node, pending, eff);
        } else if (pending === 0)
          node.pendingScrollDelta = void 0;
        let scrollTop = Math.max(0, Math.min(cur, maxScroll)), clamped = haveClamp ? Math.max(cMin, Math.min(scrollTop, cMax)) : scrollTop;
        if (node.scrollTop = scrollTop, scrollTop !== cur)
          node.pendingScrollDelta = void 0;
        if (node.pendingScrollDelta !== void 0)
          scrollDrainNode = node;
        if (scrollTop = clamped, content && contentYoga) {
          let contentX = x3 + contentYoga.getComputedLeft(), contentY = y2 + contentYoga.getComputedTop() - scrollTop, contentCached = nodeCache.get(content), hint = null;
          if (contentCached && contentCached.y !== contentY) {
            let delta = contentCached.y - contentY, regionTop = Math.floor(y2 + contentYoga.getComputedTop()), regionBottom = regionTop + innerHeight - 1;
            if (cached2?.y === y2 && cached2.height === height && innerHeight > 0 && Math.abs(delta) < innerHeight)
              hint = { top: regionTop, bottom: regionBottom, delta }, scrollHint = hint;
            else
              layoutShifted = !0;
          }
          let scrollHeight2 = contentYoga.getComputedHeight(), prevHeight = contentCached?.height ?? scrollHeight2, heightDelta = scrollHeight2 - prevHeight, safeForFastPath = !hint || heightDelta === 0 || hint.delta > 0 && heightDelta === hint.delta;
          if (!safeForFastPath)
            scrollHint = null;
          if (hint && prevScreen && safeForFastPath) {
            let { top, bottom, delta } = hint, w2 = Math.floor(width);
            output.blit(prevScreen, Math.floor(x3), top, w2, bottom - top + 1), output.shift(top, bottom, delta);
            let edgeTop = delta > 0 ? bottom - delta + 1 : top, edgeBottom = delta > 0 ? bottom : top - delta - 1;
            output.clear({
              x: Math.floor(x3),
              y: edgeTop,
              width: w2,
              height: edgeBottom - edgeTop + 1
            }), output.clip({
              x1: void 0,
              x2: void 0,
              y1: edgeTop,
              y2: edgeBottom + 1
            });
            let dirtyChildren = content.dirty ? new Set(content.childNodes.filter((c3) => c3.dirty)) : null;
            if (renderScrolledChildren(content, output, contentX, contentY, hasRemovedChild, void 0, edgeTop - contentY, edgeBottom + 1 - contentY, boxBackgroundColor, !0), output.unclip(), dirtyChildren) {
              let edgeTopLocal = edgeTop - contentY, edgeBottomLocal = edgeBottom + 1 - contentY, spaces2 = " ".repeat(w2), cumHeightShift = 0;
              for (let childNode of content.childNodes) {
                let childElem = childNode, isDirty = dirtyChildren.has(childNode);
                if (!isDirty && cumHeightShift === 0) {
                  if (nodeCache.has(childElem))
                    continue;
                }
                let cy = childElem.yogaNode;
                if (!cy)
                  continue;
                let childTop = cy.getComputedTop(), childH = cy.getComputedHeight(), childBottom = childTop + childH;
                if (isDirty) {
                  let prev = nodeCache.get(childElem);
                  cumHeightShift += childH - (prev ? prev.height : 0);
                }
                if (childBottom <= scrollTop || childTop >= scrollTop + innerHeight)
                  continue;
                if (childTop >= edgeTopLocal && childBottom <= edgeBottomLocal)
                  continue;
                let screenY = Math.floor(contentY + childTop);
                if (!isDirty) {
                  let childCached = nodeCache.get(childElem);
                  if (childCached && Math.floor(childCached.y) - delta === screenY)
                    continue;
                }
                let screenBottom = Math.min(Math.floor(contentY + childBottom), Math.floor((y1 ?? y2) + padTop + innerHeight));
                if (screenY < screenBottom) {
                  let fill = Array(screenBottom - screenY).fill(spaces2).join(`
`);
                  output.write(Math.floor(x3), screenY, fill), output.clip({
                    x1: void 0,
                    x2: void 0,
                    y1: screenY,
                    y2: screenBottom
                  }), renderNodeToOutput(childElem, output, {
                    offsetX: contentX,
                    offsetY: contentY,
                    prevScreen: void 0,
                    inheritedBackgroundColor: boxBackgroundColor
                  }), output.unclip();
                }
              }
            }
            let spaces = absoluteRectsPrev.length ? " ".repeat(w2) : "";
            for (let r4 of absoluteRectsPrev) {
              if (r4.y >= bottom + 1 || r4.y + r4.height <= top)
                continue;
              let shiftedTop = Math.max(top, Math.floor(r4.y) - delta), shiftedBottom = Math.min(bottom + 1, Math.floor(r4.y + r4.height) - delta);
              if (shiftedTop >= edgeTop && shiftedBottom <= edgeBottom + 1)
                continue;
              if (shiftedTop >= shiftedBottom)
                continue;
              let fill = Array(shiftedBottom - shiftedTop).fill(spaces).join(`
`);
              output.write(Math.floor(x3), shiftedTop, fill), output.clip({
                x1: void 0,
                x2: void 0,
                y1: shiftedTop,
                y2: shiftedBottom
              }), renderScrolledChildren(content, output, contentX, contentY, hasRemovedChild, void 0, shiftedTop - contentY, shiftedBottom - contentY, boxBackgroundColor, !0), output.unclip();
            }
          } else {
            let scrolled = contentCached && contentCached.y !== contentY;
            if (scrolled && y1 !== void 0 && y22 !== void 0)
              output.clear({
                x: Math.floor(x3),
                y: Math.floor(y1),
                width: Math.floor(width),
                height: Math.floor(y22 - y1)
              });
            renderScrolledChildren(content, output, contentX, contentY, hasRemovedChild, scrolled || positionChanged ? void 0 : prevScreen, scrollTop, scrollTop + innerHeight, boxBackgroundColor);
          }
          nodeCache.set(content, {
            x: contentX,
            y: contentY,
            width: contentYoga.getComputedWidth(),
            height: contentYoga.getComputedHeight()
          }), content.dirty = !1;
        }
      } else {
        let ownBackgroundColor = node.style.backgroundColor;
        if (ownBackgroundColor || node.style.opaque) {
          let borderLeft = yogaNode.getComputedBorder(LayoutEdge.Left), borderRight = yogaNode.getComputedBorder(LayoutEdge.Right), borderTop = yogaNode.getComputedBorder(LayoutEdge.Top), borderBottom = yogaNode.getComputedBorder(LayoutEdge.Bottom), innerWidth = Math.floor(width) - borderLeft - borderRight, innerHeight = Math.floor(height) - borderTop - borderBottom;
          if (innerWidth > 0 && innerHeight > 0) {
            let spaces = " ".repeat(innerWidth), fillLine = ownBackgroundColor ? applyTextStyles(spaces, { backgroundColor: ownBackgroundColor }) : spaces, fill = Array(innerHeight).fill(fillLine).join(`
`);
            output.write(x3 + borderLeft, y2 + borderTop, fill);
          }
        }
        renderChildren(node, output, x3, y2, hasRemovedChild, ownBackgroundColor || node.style.opaque ? void 0 : prevScreen, boxBackgroundColor);
      }
      if (needsClip)
        output.unclip();
      render_border_default(x3, y2, node, output);
    } else if (node.nodeName === "ink-root")
      renderChildren(node, output, x3, y2, hasRemovedChild, prevScreen, inheritedBackgroundColor);
    let rect = { x: x3, y: y2, width, height, top: yogaTop };
    if (nodeCache.set(node, rect), node.style.position === "absolute")
      absoluteRectsCur.push(rect);
    node.dirty = !1;
  }
}
