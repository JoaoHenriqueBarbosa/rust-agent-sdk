// class: Node
class Node {
  style;
  layout;
  parent;
  children;
  measureFunc;
  config;
  isDirty_;
  isReferenceBaseline_;
  _flexBasis = 0;
  _mainSize = 0;
  _crossSize = 0;
  _lineIndex = 0;
  _hasAutoMargin = !1;
  _hasPosition = !1;
  _hasPadding = !1;
  _hasBorder = !1;
  _hasMargin = !1;
  _lW = NaN;
  _lH = NaN;
  _lWM = 0;
  _lHM = 0;
  _lOW = NaN;
  _lOH = NaN;
  _lFW = !1;
  _lFH = !1;
  _lOutW = NaN;
  _lOutH = NaN;
  _hasL = !1;
  _mW = NaN;
  _mH = NaN;
  _mWM = 0;
  _mHM = 0;
  _mOW = NaN;
  _mOH = NaN;
  _mOutW = NaN;
  _mOutH = NaN;
  _hasM = !1;
  _fbBasis = NaN;
  _fbOwnerW = NaN;
  _fbOwnerH = NaN;
  _fbAvailMain = NaN;
  _fbAvailCross = NaN;
  _fbCrossMode = 0;
  _fbGen = -1;
  _cIn = null;
  _cOut = null;
  _cGen = -1;
  _cN = 0;
  _cWr = 0;
  constructor(config8) {
    this.style = defaultStyle(), this.layout = {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      border: [0, 0, 0, 0],
      padding: [0, 0, 0, 0],
      margin: [0, 0, 0, 0]
    }, this.parent = null, this.children = [], this.measureFunc = null, this.config = config8 ?? DEFAULT_CONFIG, this.isDirty_ = !0, this.isReferenceBaseline_ = !1, _yogaLiveNodes++;
  }
  insertChild(child, index) {
    child.parent = this, this.children.splice(index, 0, child), this.markDirty();
  }
  removeChild(child) {
    let idx = this.children.indexOf(child);
    if (idx >= 0)
      this.children.splice(idx, 1), child.parent = null, this.markDirty();
  }
  getChild(index) {
    return this.children[index];
  }
  getChildCount() {
    return this.children.length;
  }
  getParent() {
    return this.parent;
  }
  free() {
    this.parent = null, this.children = [], this.measureFunc = null, this._cIn = null, this._cOut = null, _yogaLiveNodes--;
  }
  freeRecursive() {
    for (let c3 of this.children)
      c3.freeRecursive();
    this.free();
  }
  reset() {
    this.style = defaultStyle(), this.children = [], this.parent = null, this.measureFunc = null, this.isDirty_ = !0, this._hasAutoMargin = !1, this._hasPosition = !1, this._hasPadding = !1, this._hasBorder = !1, this._hasMargin = !1, this._hasL = !1, this._hasM = !1, this._cN = 0, this._cWr = 0, this._fbBasis = NaN;
  }
  markDirty() {
    if (this.isDirty_ = !0, this.parent && !this.parent.isDirty_)
      this.parent.markDirty();
  }
  isDirty() {
    return this.isDirty_;
  }
  hasNewLayout() {
    return !0;
  }
  markLayoutSeen() {}
  setMeasureFunc(fn) {
    this.measureFunc = fn, this.markDirty();
  }
  unsetMeasureFunc() {
    this.measureFunc = null, this.markDirty();
  }
  getComputedLeft() {
    return this.layout.left;
  }
  getComputedTop() {
    return this.layout.top;
  }
  getComputedWidth() {
    return this.layout.width;
  }
  getComputedHeight() {
    return this.layout.height;
  }
  getComputedRight() {
    let p4 = this.parent;
    return p4 ? p4.layout.width - this.layout.left - this.layout.width : 0;
  }
  getComputedBottom() {
    let p4 = this.parent;
    return p4 ? p4.layout.height - this.layout.top - this.layout.height : 0;
  }
  getComputedLayout() {
    return {
      left: this.layout.left,
      top: this.layout.top,
      right: this.getComputedRight(),
      bottom: this.getComputedBottom(),
      width: this.layout.width,
      height: this.layout.height
    };
  }
  getComputedBorder(edge) {
    return this.layout.border[physicalEdge(edge)];
  }
  getComputedPadding(edge) {
    return this.layout.padding[physicalEdge(edge)];
  }
  getComputedMargin(edge) {
    return this.layout.margin[physicalEdge(edge)];
  }
  setWidth(v2) {
    this.style.width = parseDimension(v2), this.markDirty();
  }
  setWidthPercent(v2) {
    this.style.width = percentValue(v2), this.markDirty();
  }
  setWidthAuto() {
    this.style.width = AUTO_VALUE, this.markDirty();
  }
  setHeight(v2) {
    this.style.height = parseDimension(v2), this.markDirty();
  }
  setHeightPercent(v2) {
    this.style.height = percentValue(v2), this.markDirty();
  }
  setHeightAuto() {
    this.style.height = AUTO_VALUE, this.markDirty();
  }
  setMinWidth(v2) {
    this.style.minWidth = parseDimension(v2), this.markDirty();
  }
  setMinWidthPercent(v2) {
    this.style.minWidth = percentValue(v2), this.markDirty();
  }
  setMinHeight(v2) {
    this.style.minHeight = parseDimension(v2), this.markDirty();
  }
  setMinHeightPercent(v2) {
    this.style.minHeight = percentValue(v2), this.markDirty();
  }
  setMaxWidth(v2) {
    this.style.maxWidth = parseDimension(v2), this.markDirty();
  }
  setMaxWidthPercent(v2) {
    this.style.maxWidth = percentValue(v2), this.markDirty();
  }
  setMaxHeight(v2) {
    this.style.maxHeight = parseDimension(v2), this.markDirty();
  }
  setMaxHeightPercent(v2) {
    this.style.maxHeight = percentValue(v2), this.markDirty();
  }
  setFlexDirection(dir) {
    this.style.flexDirection = dir, this.markDirty();
  }
  setFlexGrow(v2) {
    this.style.flexGrow = v2 ?? 0, this.markDirty();
  }
  setFlexShrink(v2) {
    this.style.flexShrink = v2 ?? 0, this.markDirty();
  }
  setFlex(v2) {
    if (v2 === void 0 || isNaN(v2))
      this.style.flexGrow = 0, this.style.flexShrink = 0;
    else if (v2 > 0)
      this.style.flexGrow = v2, this.style.flexShrink = 1, this.style.flexBasis = pointValue(0);
    else if (v2 < 0)
      this.style.flexGrow = 0, this.style.flexShrink = -v2;
    else
      this.style.flexGrow = 0, this.style.flexShrink = 0;
    this.markDirty();
  }
  setFlexBasis(v2) {
    this.style.flexBasis = parseDimension(v2), this.markDirty();
  }
  setFlexBasisPercent(v2) {
    this.style.flexBasis = percentValue(v2), this.markDirty();
  }
  setFlexBasisAuto() {
    this.style.flexBasis = AUTO_VALUE, this.markDirty();
  }
  setFlexWrap(wrap) {
    this.style.flexWrap = wrap, this.markDirty();
  }
  setAlignItems(a2) {
    this.style.alignItems = a2, this.markDirty();
  }
  setAlignSelf(a2) {
    this.style.alignSelf = a2, this.markDirty();
  }
  setAlignContent(a2) {
    this.style.alignContent = a2, this.markDirty();
  }
  setJustifyContent(j4) {
    this.style.justifyContent = j4, this.markDirty();
  }
  setDisplay(d) {
    this.style.display = d, this.markDirty();
  }
  getDisplay() {
    return this.style.display;
  }
  setPositionType(t2) {
    this.style.positionType = t2, this.markDirty();
  }
  setPosition(edge, v2) {
    this.style.position[edge] = parseDimension(v2), this._hasPosition = hasAnyDefinedEdge(this.style.position), this.markDirty();
  }
  setPositionPercent(edge, v2) {
    this.style.position[edge] = percentValue(v2), this._hasPosition = !0, this.markDirty();
  }
  setPositionAuto(edge) {
    this.style.position[edge] = AUTO_VALUE, this._hasPosition = !0, this.markDirty();
  }
  setOverflow(o5) {
    this.style.overflow = o5, this.markDirty();
  }
  setDirection(d) {
    this.style.direction = d, this.markDirty();
  }
  setBoxSizing(_) {}
  setMargin(edge, v2) {
    let val = parseDimension(v2);
    if (this.style.margin[edge] = val, val.unit === Unit.Auto)
      this._hasAutoMargin = !0;
    else
      this._hasAutoMargin = hasAnyAutoEdge(this.style.margin);
    this._hasMargin = this._hasAutoMargin || hasAnyDefinedEdge(this.style.margin), this.markDirty();
  }
  setMarginPercent(edge, v2) {
    this.style.margin[edge] = percentValue(v2), this._hasAutoMargin = hasAnyAutoEdge(this.style.margin), this._hasMargin = !0, this.markDirty();
  }
  setMarginAuto(edge) {
    this.style.margin[edge] = AUTO_VALUE, this._hasAutoMargin = !0, this._hasMargin = !0, this.markDirty();
  }
  setPadding(edge, v2) {
    this.style.padding[edge] = parseDimension(v2), this._hasPadding = hasAnyDefinedEdge(this.style.padding), this.markDirty();
  }
  setPaddingPercent(edge, v2) {
    this.style.padding[edge] = percentValue(v2), this._hasPadding = !0, this.markDirty();
  }
  setBorder(edge, v2) {
    this.style.border[edge] = v2 === void 0 ? UNDEFINED_VALUE : pointValue(v2), this._hasBorder = hasAnyDefinedEdge(this.style.border), this.markDirty();
  }
  setGap(gutter, v2) {
    this.style.gap[gutter] = parseDimension(v2), this.markDirty();
  }
  setGapPercent(gutter, v2) {
    this.style.gap[gutter] = percentValue(v2), this.markDirty();
  }
  getFlexDirection() {
    return this.style.flexDirection;
  }
  getJustifyContent() {
    return this.style.justifyContent;
  }
  getAlignItems() {
    return this.style.alignItems;
  }
  getAlignSelf() {
    return this.style.alignSelf;
  }
  getAlignContent() {
    return this.style.alignContent;
  }
  getFlexGrow() {
    return this.style.flexGrow;
  }
  getFlexShrink() {
    return this.style.flexShrink;
  }
  getFlexBasis() {
    return this.style.flexBasis;
  }
  getFlexWrap() {
    return this.style.flexWrap;
  }
  getWidth() {
    return this.style.width;
  }
  getHeight() {
    return this.style.height;
  }
  getOverflow() {
    return this.style.overflow;
  }
  getPositionType() {
    return this.style.positionType;
  }
  getDirection() {
    return this.style.direction;
  }
  copyStyle(_) {}
  setDirtiedFunc(_) {}
  unsetDirtiedFunc() {}
  setIsReferenceBaseline(v2) {
    this.isReferenceBaseline_ = v2, this.markDirty();
  }
  isReferenceBaseline() {
    return this.isReferenceBaseline_;
  }
  setAspectRatio(_) {}
  getAspectRatio() {
    return NaN;
  }
  setAlwaysFormsContainingBlock(_) {}
  calculateLayout(ownerWidth, ownerHeight, _direction) {
    _yogaNodesVisited = 0, _yogaMeasureCalls = 0, _yogaCacheHits = 0, _generation++;
    let w2 = ownerWidth === void 0 ? NaN : ownerWidth, h4 = ownerHeight === void 0 ? NaN : ownerHeight;
    layoutNode(this, w2, h4, isDefined(w2) ? MeasureMode.Exactly : MeasureMode.Undefined, isDefined(h4) ? MeasureMode.Exactly : MeasureMode.Undefined, w2, h4, !0);
    let mar = this.layout.margin, posL = resolveValue(resolveEdgeRaw(this.style.position, EDGE_LEFT), isDefined(w2) ? w2 : 0), posT = resolveValue(resolveEdgeRaw(this.style.position, EDGE_TOP), isDefined(w2) ? w2 : 0);
    this.layout.left = mar[EDGE_LEFT] + (isDefined(posL) ? posL : 0), this.layout.top = mar[EDGE_TOP] + (isDefined(posT) ? posT : 0), roundLayout(this, this.config.pointScaleFactor, 0, 0);
  }
}
