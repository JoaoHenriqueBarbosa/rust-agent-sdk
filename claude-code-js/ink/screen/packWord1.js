// function: packWord1
function packWord1(styleId, hyperlinkId, width) {
  return styleId << STYLE_SHIFT | hyperlinkId << HYPERLINK_SHIFT | width;
}
