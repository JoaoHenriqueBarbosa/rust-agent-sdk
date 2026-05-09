// var: layoutShifted
var layoutShifted = !1, scrollHint = null, absoluteRectsPrev, absoluteRectsCur, scrollDrainNode = null, followScroll = null, SCROLL_MIN_PER_FRAME = 4, SCROLL_INSTANT_THRESHOLD = 5, SCROLL_HIGH_PENDING = 12, SCROLL_STEP_MED = 2, SCROLL_STEP_HIGH = 3, SCROLL_MAX_PENDING = 30, OSC2 = "\x1B]", BEL2 = "\x07", render_node_to_output_default;
var init_render_node_to_output = __esm(() => {
  init_colorize();
  init_get_max_width();
  init_node4();
  init_node_cache();
  init_render_border();
  init_squash_text_nodes();
  init_terminal();
  init_widest_line();
  init_wrap_text();
  absoluteRectsPrev = [], absoluteRectsCur = [];
  render_node_to_output_default = renderNodeToOutput;
});
