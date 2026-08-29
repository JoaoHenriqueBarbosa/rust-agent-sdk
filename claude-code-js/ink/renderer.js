// Original: src/ink/renderer.ts
function createRenderer(node, stylePool) {
  let output;
  return (options) => {
    let { frontFrame, backFrame, isTTY, terminalWidth, terminalRows } = options, prevScreen = frontFrame.screen, backScreen = backFrame.screen, charPool = backScreen.charPool, hyperlinkPool = backScreen.hyperlinkPool, computedHeight = node.yogaNode?.getComputedHeight(), computedWidth = node.yogaNode?.getComputedWidth(), hasInvalidHeight = computedHeight === void 0 || !Number.isFinite(computedHeight) || computedHeight < 0, hasInvalidWidth = computedWidth === void 0 || !Number.isFinite(computedWidth) || computedWidth < 0;
    if (!node.yogaNode || hasInvalidHeight || hasInvalidWidth) {
      if (node.yogaNode && (hasInvalidHeight || hasInvalidWidth))
        logForDebugging(`Invalid yoga dimensions: width=${computedWidth}, height=${computedHeight}, childNodes=${node.childNodes.length}, terminalWidth=${terminalWidth}, terminalRows=${terminalRows}`);
      return {
        screen: createScreen(terminalWidth, 0, stylePool, charPool, hyperlinkPool),
        viewport: { width: terminalWidth, height: terminalRows },
        cursor: { x: 0, y: 0, visible: !0 }
      };
    }
    let width = Math.floor(node.yogaNode.getComputedWidth()), yogaHeight = Math.floor(node.yogaNode.getComputedHeight()), height = options.altScreen ? terminalRows : yogaHeight;
    if (options.altScreen && yogaHeight > terminalRows)
      logForDebugging(`alt-screen: yoga height ${yogaHeight} > terminalRows ${terminalRows} \u2014 ` + "something is rendering outside <AlternateScreen>. Overflow clipped.", { level: "warn" });
    let screen = backScreen ?? createScreen(width, height, stylePool, charPool, hyperlinkPool);
    if (output)
      output.reset(width, height, screen);
    else
      output = new Output({ width, height, stylePool, screen });
    resetLayoutShifted(), resetScrollHint(), resetScrollDrainNode();
    let absoluteRemoved = consumeAbsoluteRemovedFlag();
    render_node_to_output_default(node, output, {
      prevScreen: absoluteRemoved || options.prevFrameContaminated ? void 0 : prevScreen
    });
    let renderedScreen = output.get(), drainNode = getScrollDrainNode();
    if (drainNode)
      markDirty(drainNode);
    return {
      scrollHint: options.altScreen ? getScrollHint() : null,
      scrollDrainPending: drainNode !== null,
      screen: renderedScreen,
      viewport: {
        width: terminalWidth,
        height: options.altScreen ? terminalRows + 1 : terminalRows
      },
      cursor: {
        x: 0,
        y: options.altScreen ? Math.max(0, Math.min(screen.height, terminalRows) - 1) : screen.height,
        visible: !isTTY || screen.height === 0
      }
    };
  };
}
var init_renderer = __esm(() => {
  init_debug();
  init_dom();
  init_node_cache();
  init_output2();
  init_render_node_to_output();
  init_screen();
});
