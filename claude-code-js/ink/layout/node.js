// Original: src/ink/layout/node.ts
var LayoutEdge, LayoutGutter, LayoutDisplay, LayoutFlexDirection, LayoutAlign, LayoutJustify, LayoutWrap, LayoutPositionType, LayoutOverflow, LayoutMeasureMode;
var init_node4 = __esm(() => {
  LayoutEdge = {
    All: "all",
    Horizontal: "horizontal",
    Vertical: "vertical",
    Left: "left",
    Right: "right",
    Top: "top",
    Bottom: "bottom",
    Start: "start",
    End: "end"
  }, LayoutGutter = {
    All: "all",
    Column: "column",
    Row: "row"
  }, LayoutDisplay = {
    Flex: "flex",
    None: "none"
  }, LayoutFlexDirection = {
    Row: "row",
    RowReverse: "row-reverse",
    Column: "column",
    ColumnReverse: "column-reverse"
  }, LayoutAlign = {
    Auto: "auto",
    Stretch: "stretch",
    FlexStart: "flex-start",
    Center: "center",
    FlexEnd: "flex-end"
  }, LayoutJustify = {
    FlexStart: "flex-start",
    Center: "center",
    FlexEnd: "flex-end",
    SpaceBetween: "space-between",
    SpaceAround: "space-around",
    SpaceEvenly: "space-evenly"
  }, LayoutWrap = {
    NoWrap: "nowrap",
    Wrap: "wrap",
    WrapReverse: "wrap-reverse"
  }, LayoutPositionType = {
    Relative: "relative",
    Absolute: "absolute"
  }, LayoutOverflow = {
    Visible: "visible",
    Hidden: "hidden",
    Scroll: "scroll"
  }, LayoutMeasureMode = {
    Undefined: "undefined",
    Exactly: "exactly",
    AtMost: "at-most"
  };
});
