// Original: src/ink/render-border.ts
function embedTextInBorder(borderLine, text, align, offset = 0, borderChar) {
  let textLength = stringWidth(text), borderLength = borderLine.length;
  if (textLength >= borderLength - 2)
    return ["", text.substring(0, borderLength), ""];
  let position;
  if (align === "center")
    position = Math.floor((borderLength - textLength) / 2);
  else if (align === "start")
    position = offset + 1;
  else
    position = borderLength - textLength - offset - 1;
  position = Math.max(1, Math.min(position, borderLength - textLength - 1));
  let before = borderLine.substring(0, 1) + borderChar.repeat(position - 1), after = borderChar.repeat(borderLength - position - textLength - 1) + borderLine.substring(borderLength - 1);
  return [before, text, after];
}
function styleBorderLine(line, color, dim2) {
  let styled = applyColor(line, color);
  if (dim2)
    styled = source_default.dim(styled);
  return styled;
}
var CUSTOM_BORDER_STYLES, renderBorder = (x3, y2, node, output) => {
  if (node.style.borderStyle) {
    let width = Math.floor(node.yogaNode.getComputedWidth()), height = Math.floor(node.yogaNode.getComputedHeight()), box = typeof node.style.borderStyle === "string" ? CUSTOM_BORDER_STYLES[node.style.borderStyle] ?? cli_boxes_default[node.style.borderStyle] : node.style.borderStyle, topBorderColor = node.style.borderTopColor ?? node.style.borderColor, bottomBorderColor = node.style.borderBottomColor ?? node.style.borderColor, leftBorderColor = node.style.borderLeftColor ?? node.style.borderColor, rightBorderColor = node.style.borderRightColor ?? node.style.borderColor, dimTopBorderColor = node.style.borderTopDimColor ?? node.style.borderDimColor, dimBottomBorderColor = node.style.borderBottomDimColor ?? node.style.borderDimColor, dimLeftBorderColor = node.style.borderLeftDimColor ?? node.style.borderDimColor, dimRightBorderColor = node.style.borderRightDimColor ?? node.style.borderDimColor, showTopBorder = node.style.borderTop !== !1, showBottomBorder = node.style.borderBottom !== !1, showLeftBorder = node.style.borderLeft !== !1, showRightBorder = node.style.borderRight !== !1, contentWidth = Math.max(0, width - (showLeftBorder ? 1 : 0) - (showRightBorder ? 1 : 0)), topBorderLine = showTopBorder ? (showLeftBorder ? box.topLeft : "") + box.top.repeat(contentWidth) + (showRightBorder ? box.topRight : "") : "", topBorder;
    if (showTopBorder && node.style.borderText?.position === "top") {
      let [before, text, after] = embedTextInBorder(topBorderLine, node.style.borderText.content, node.style.borderText.align, node.style.borderText.offset, box.top);
      topBorder = styleBorderLine(before, topBorderColor, dimTopBorderColor) + text + styleBorderLine(after, topBorderColor, dimTopBorderColor);
    } else if (showTopBorder)
      topBorder = styleBorderLine(topBorderLine, topBorderColor, dimTopBorderColor);
    let verticalBorderHeight = height;
    if (showTopBorder)
      verticalBorderHeight -= 1;
    if (showBottomBorder)
      verticalBorderHeight -= 1;
    verticalBorderHeight = Math.max(0, verticalBorderHeight);
    let leftBorder = (applyColor(box.left, leftBorderColor) + `
`).repeat(verticalBorderHeight);
    if (dimLeftBorderColor)
      leftBorder = source_default.dim(leftBorder);
    let rightBorder = (applyColor(box.right, rightBorderColor) + `
`).repeat(verticalBorderHeight);
    if (dimRightBorderColor)
      rightBorder = source_default.dim(rightBorder);
    let bottomBorderLine = showBottomBorder ? (showLeftBorder ? box.bottomLeft : "") + box.bottom.repeat(contentWidth) + (showRightBorder ? box.bottomRight : "") : "", bottomBorder;
    if (showBottomBorder && node.style.borderText?.position === "bottom") {
      let [before, text, after] = embedTextInBorder(bottomBorderLine, node.style.borderText.content, node.style.borderText.align, node.style.borderText.offset, box.bottom);
      bottomBorder = styleBorderLine(before, bottomBorderColor, dimBottomBorderColor) + text + styleBorderLine(after, bottomBorderColor, dimBottomBorderColor);
    } else if (showBottomBorder)
      bottomBorder = styleBorderLine(bottomBorderLine, bottomBorderColor, dimBottomBorderColor);
    let offsetY = showTopBorder ? 1 : 0;
    if (topBorder)
      output.write(x3, y2, topBorder);
    if (showLeftBorder)
      output.write(x3, y2 + offsetY, leftBorder);
    if (showRightBorder)
      output.write(x3 + width - 1, y2 + offsetY, rightBorder);
    if (bottomBorder)
      output.write(x3, y2 + height - 1, bottomBorder);
  }
}, render_border_default;
var init_render_border = __esm(() => {
  init_source();
  init_cli_boxes();
  init_colorize();
  init_stringWidth();
  CUSTOM_BORDER_STYLES = {
    dashed: {
      top: "\u254C",
      left: "\u254E",
      right: "\u254E",
      bottom: "\u254C",
      topLeft: " ",
      topRight: " ",
      bottomLeft: " ",
      bottomRight: " "
    }
  };
  render_border_default = renderBorder;
});
