// Original: src/ink/layout/yoga.ts
class YogaLayoutNode {
  yoga;
  constructor(yoga) {
    this.yoga = yoga;
  }
  insertChild(child, index) {
    this.yoga.insertChild(child.yoga, index);
  }
  removeChild(child) {
    this.yoga.removeChild(child.yoga);
  }
  getChildCount() {
    return this.yoga.getChildCount();
  }
  getParent() {
    let p4 = this.yoga.getParent();
    return p4 ? new YogaLayoutNode(p4) : null;
  }
  calculateLayout(width, _height) {
    this.yoga.calculateLayout(width, void 0, Direction.LTR);
  }
  setMeasureFunc(fn) {
    this.yoga.setMeasureFunc((w2, wMode) => {
      let mode = wMode === MeasureMode.Exactly ? LayoutMeasureMode.Exactly : wMode === MeasureMode.AtMost ? LayoutMeasureMode.AtMost : LayoutMeasureMode.Undefined;
      return fn(w2, mode);
    });
  }
  unsetMeasureFunc() {
    this.yoga.unsetMeasureFunc();
  }
  markDirty() {
    this.yoga.markDirty();
  }
  getComputedLeft() {
    return this.yoga.getComputedLeft();
  }
  getComputedTop() {
    return this.yoga.getComputedTop();
  }
  getComputedWidth() {
    return this.yoga.getComputedWidth();
  }
  getComputedHeight() {
    return this.yoga.getComputedHeight();
  }
  getComputedBorder(edge) {
    return this.yoga.getComputedBorder(EDGE_MAP[edge]);
  }
  getComputedPadding(edge) {
    return this.yoga.getComputedPadding(EDGE_MAP[edge]);
  }
  setWidth(value) {
    this.yoga.setWidth(value);
  }
  setWidthPercent(value) {
    this.yoga.setWidthPercent(value);
  }
  setWidthAuto() {
    this.yoga.setWidthAuto();
  }
  setHeight(value) {
    this.yoga.setHeight(value);
  }
  setHeightPercent(value) {
    this.yoga.setHeightPercent(value);
  }
  setHeightAuto() {
    this.yoga.setHeightAuto();
  }
  setMinWidth(value) {
    this.yoga.setMinWidth(value);
  }
  setMinWidthPercent(value) {
    this.yoga.setMinWidthPercent(value);
  }
  setMinHeight(value) {
    this.yoga.setMinHeight(value);
  }
  setMinHeightPercent(value) {
    this.yoga.setMinHeightPercent(value);
  }
  setMaxWidth(value) {
    this.yoga.setMaxWidth(value);
  }
  setMaxWidthPercent(value) {
    this.yoga.setMaxWidthPercent(value);
  }
  setMaxHeight(value) {
    this.yoga.setMaxHeight(value);
  }
  setMaxHeightPercent(value) {
    this.yoga.setMaxHeightPercent(value);
  }
  setFlexDirection(dir) {
    let map7 = {
      row: FlexDirection.Row,
      "row-reverse": FlexDirection.RowReverse,
      column: FlexDirection.Column,
      "column-reverse": FlexDirection.ColumnReverse
    };
    this.yoga.setFlexDirection(map7[dir]);
  }
  setFlexGrow(value) {
    this.yoga.setFlexGrow(value);
  }
  setFlexShrink(value) {
    this.yoga.setFlexShrink(value);
  }
  setFlexBasis(value) {
    this.yoga.setFlexBasis(value);
  }
  setFlexBasisPercent(value) {
    this.yoga.setFlexBasisPercent(value);
  }
  setFlexWrap(wrap) {
    let map7 = {
      nowrap: Wrap.NoWrap,
      wrap: Wrap.Wrap,
      "wrap-reverse": Wrap.WrapReverse
    };
    this.yoga.setFlexWrap(map7[wrap]);
  }
  setAlignItems(align) {
    let map7 = {
      auto: Align.Auto,
      stretch: Align.Stretch,
      "flex-start": Align.FlexStart,
      center: Align.Center,
      "flex-end": Align.FlexEnd
    };
    this.yoga.setAlignItems(map7[align]);
  }
  setAlignSelf(align) {
    let map7 = {
      auto: Align.Auto,
      stretch: Align.Stretch,
      "flex-start": Align.FlexStart,
      center: Align.Center,
      "flex-end": Align.FlexEnd
    };
    this.yoga.setAlignSelf(map7[align]);
  }
  setJustifyContent(justify) {
    let map7 = {
      "flex-start": Justify.FlexStart,
      center: Justify.Center,
      "flex-end": Justify.FlexEnd,
      "space-between": Justify.SpaceBetween,
      "space-around": Justify.SpaceAround,
      "space-evenly": Justify.SpaceEvenly
    };
    this.yoga.setJustifyContent(map7[justify]);
  }
  setDisplay(display) {
    this.yoga.setDisplay(display === "flex" ? Display.Flex : Display.None);
  }
  getDisplay() {
    return this.yoga.getDisplay() === Display.None ? LayoutDisplay.None : LayoutDisplay.Flex;
  }
  setPositionType(type) {
    this.yoga.setPositionType(type === "absolute" ? PositionType.Absolute : PositionType.Relative);
  }
  setPosition(edge, value) {
    this.yoga.setPosition(EDGE_MAP[edge], value);
  }
  setPositionPercent(edge, value) {
    this.yoga.setPositionPercent(EDGE_MAP[edge], value);
  }
  setOverflow(overflow) {
    let map7 = {
      visible: Overflow.Visible,
      hidden: Overflow.Hidden,
      scroll: Overflow.Scroll
    };
    this.yoga.setOverflow(map7[overflow]);
  }
  setMargin(edge, value) {
    this.yoga.setMargin(EDGE_MAP[edge], value);
  }
  setPadding(edge, value) {
    this.yoga.setPadding(EDGE_MAP[edge], value);
  }
  setBorder(edge, value) {
    this.yoga.setBorder(EDGE_MAP[edge], value);
  }
  setGap(gutter, value) {
    this.yoga.setGap(GUTTER_MAP[gutter], value);
  }
  free() {
    this.yoga.free();
  }
  freeRecursive() {
    this.yoga.freeRecursive();
  }
}
function createYogaLayoutNode() {
  return new YogaLayoutNode(yoga_layout_default.Node.create());
}
var EDGE_MAP, GUTTER_MAP;
var init_yoga = __esm(() => {
  init_yoga_layout();
  init_node4();
  EDGE_MAP = {
    all: Edge.All,
    horizontal: Edge.Horizontal,
    vertical: Edge.Vertical,
    left: Edge.Left,
    right: Edge.Right,
    top: Edge.Top,
    bottom: Edge.Bottom,
    start: Edge.Start,
    end: Edge.End
  }, GUTTER_MAP = {
    all: Gutter.All,
    column: Gutter.Column,
    row: Gutter.Row
  };
});
