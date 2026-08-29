// Original: src/ink/reconciler.ts
import { appendFileSync as appendFileSync3 } from "fs";
function setEventHandler(node, key, value) {
  if (!node._eventHandlers)
    node._eventHandlers = {};
  node._eventHandlers[key] = value;
}
function applyProp(node, key, value) {
  if (key === "children")
    return;
  if (key === "style") {
    if (setStyle(node, value), node.yogaNode)
      styles_default(node.yogaNode, value);
    return;
  }
  if (key === "textStyles") {
    node.textStyles = value;
    return;
  }
  if (EVENT_HANDLER_PROPS.has(key)) {
    setEventHandler(node, key, value);
    return;
  }
  setAttribute(node, key, value);
}
function getOwnerChain(fiber) {
  let chain4 = [], seen = /* @__PURE__ */ new Set, cur = fiber;
  for (let i4 = 0;cur && i4 < 50; i4++) {
    if (seen.has(cur))
      break;
    seen.add(cur);
    let t2 = cur.elementType, name3 = typeof t2 === "function" ? t2.displayName || t2.name : typeof t2 === "string" ? void 0 : t2?.displayName || t2?.name;
    if (name3 && name3 !== chain4[chain4.length - 1])
      chain4.push(name3);
    cur = cur._debugOwner ?? cur.return;
  }
  return chain4;
}
function isDebugRepaintsEnabled() {
  if (debugRepaints === void 0)
    debugRepaints = isEnvTruthy(process.env.CLAUDE_CODE_DEBUG_REPAINTS);
  return debugRepaints;
}
function recordYogaMs(ms) {
  _lastYogaMs = ms;
}
function getLastYogaMs() {
  return _lastYogaMs;
}
function markCommitStart() {
  _commitStart = performance.now();
}
function getLastCommitMs() {
  return _lastCommitMs;
}
function resetProfileCounters() {
  _lastYogaMs = 0, _lastCommitMs = 0, _commitStart = 0;
}
var import_react_reconciler, diff = (before, after) => {
  if (before === after)
    return;
  if (!before)
    return after;
  let changed = {}, isChanged = !1;
  for (let key of Object.keys(before))
    if (after ? !Object.hasOwn(after, key) : !0)
      changed[key] = void 0, isChanged = !0;
  if (after) {
    for (let key of Object.keys(after))
      if (after[key] !== before[key])
        changed[key] = after[key], isChanged = !0;
  }
  return isChanged ? changed : void 0;
}, cleanupYogaNode = (node) => {
  let yogaNode = node.yogaNode;
  if (yogaNode)
    yogaNode.unsetMeasureFunc(), clearYogaNodeReferences(node), yogaNode.freeRecursive();
}, debugRepaints, dispatcher, COMMIT_LOG, _commits = 0, _lastLog = 0, _lastCommitAt = 0, _maxGapMs = 0, _createCount = 0, _prepareAt = 0, _lastYogaMs = 0, _lastCommitMs = 0, _commitStart = 0, reconciler, reconciler_default;
var init_reconciler = __esm(() => {
  init_yoga_layout();
  init_envUtils();
  init_dom();
  init_dispatcher();
  init_event_handlers();
  init_focus();
  init_node4();
  init_styles();
  import_react_reconciler = __toESM(require_react_reconciler_development(), 1);
  try {
    Promise.resolve().then(() => init_devtools());
  } catch (error44) {
    if (error44.code === "ERR_MODULE_NOT_FOUND")
      console.warn(`
The environment variable DEV is set to true, so Ink tried to import \`react-devtools-core\`,
but this failed as it was not installed. Debugging with React Devtools requires it.

To install use this command:

$ npm install --save-dev react-devtools-core
				`.trim() + `
`);
    else
      throw error44;
  }
  dispatcher = new Dispatcher, COMMIT_LOG = process.env.CLAUDE_CODE_COMMIT_LOG;
  reconciler = import_react_reconciler.default({
    getRootHostContext: () => ({ isInsideText: !1 }),
    prepareForCommit: () => {
      if (COMMIT_LOG)
        _prepareAt = performance.now();
      return null;
    },
    preparePortalMount: () => null,
    clearContainer: () => !1,
    resetAfterCommit(rootNode) {
      if (_lastCommitMs = _commitStart > 0 ? performance.now() - _commitStart : 0, _commitStart = 0, COMMIT_LOG) {
        let now2 = performance.now();
        _commits++;
        let gap = _lastCommitAt > 0 ? now2 - _lastCommitAt : 0;
        if (gap > _maxGapMs)
          _maxGapMs = gap;
        _lastCommitAt = now2;
        let reconcileMs = _prepareAt > 0 ? now2 - _prepareAt : 0;
        if (gap > 30 || reconcileMs > 20 || _createCount > 50)
          appendFileSync3(COMMIT_LOG, `${now2.toFixed(1)} gap=${gap.toFixed(1)}ms reconcile=${reconcileMs.toFixed(1)}ms creates=${_createCount}
`);
        if (_createCount = 0, now2 - _lastLog > 1000)
          appendFileSync3(COMMIT_LOG, `${now2.toFixed(1)} commits=${_commits}/s maxGap=${_maxGapMs.toFixed(1)}ms
`), _commits = 0, _maxGapMs = 0, _lastLog = now2;
      }
      let _t0 = COMMIT_LOG ? performance.now() : 0;
      if (typeof rootNode.onComputeLayout === "function")
        rootNode.onComputeLayout();
      if (COMMIT_LOG) {
        let layoutMs = performance.now() - _t0;
        if (layoutMs > 20) {
          let c3 = getYogaCounters();
          appendFileSync3(COMMIT_LOG, `${_t0.toFixed(1)} SLOW_YOGA ${layoutMs.toFixed(1)}ms visited=${c3.visited} measured=${c3.measured} hits=${c3.cacheHits} live=${c3.live}
`);
        }
      }
      let _tr = COMMIT_LOG ? performance.now() : 0;
      if (rootNode.onRender?.(), COMMIT_LOG) {
        let renderMs = performance.now() - _tr;
        if (renderMs > 10)
          appendFileSync3(COMMIT_LOG, `${_tr.toFixed(1)} SLOW_PAINT ${renderMs.toFixed(1)}ms
`);
      }
    },
    getChildHostContext(parentHostContext, type) {
      let previousIsInsideText = parentHostContext.isInsideText, isInsideText = type === "ink-text" || type === "ink-virtual-text" || type === "ink-link";
      if (previousIsInsideText === isInsideText)
        return parentHostContext;
      return { isInsideText };
    },
    shouldSetTextContent: () => !1,
    createInstance(originalType, newProps, _root, hostContext, internalHandle) {
      if (hostContext.isInsideText && originalType === "ink-box")
        throw Error("<Box> can't be nested inside <Text> component");
      let type = originalType === "ink-text" && hostContext.isInsideText ? "ink-virtual-text" : originalType, node = createNode(type);
      if (COMMIT_LOG)
        _createCount++;
      for (let [key, value] of Object.entries(newProps))
        applyProp(node, key, value);
      if (isDebugRepaintsEnabled())
        node.debugOwnerChain = getOwnerChain(internalHandle);
      return node;
    },
    createTextInstance(text, _root, hostContext) {
      if (!hostContext.isInsideText)
        throw Error(`Text string "${text}" must be rendered inside <Text> component`);
      return createTextNode(text);
    },
    resetTextContent() {},
    hideTextInstance(node) {
      setTextNodeValue(node, "");
    },
    unhideTextInstance(node, text) {
      setTextNodeValue(node, text);
    },
    getPublicInstance: (instance) => instance,
    hideInstance(node) {
      node.isHidden = !0, node.yogaNode?.setDisplay(LayoutDisplay.None), markDirty(node);
    },
    unhideInstance(node) {
      node.isHidden = !1, node.yogaNode?.setDisplay(LayoutDisplay.Flex), markDirty(node);
    },
    appendInitialChild: appendChildNode,
    appendChild: appendChildNode,
    insertBefore: insertBeforeNode,
    finalizeInitialChildren(_node, _type, props) {
      return props.autoFocus === !0;
    },
    commitMount(node) {
      getFocusManager(node).handleAutoFocus(node);
    },
    isPrimaryRenderer: !0,
    supportsMutation: !0,
    supportsPersistence: !1,
    supportsHydration: !1,
    scheduleTimeout: setTimeout,
    cancelTimeout: clearTimeout,
    noTimeout: -1,
    getCurrentUpdatePriority: () => dispatcher.currentUpdatePriority,
    beforeActiveInstanceBlur() {},
    afterActiveInstanceBlur() {},
    detachDeletedInstance() {},
    getInstanceFromNode: () => null,
    prepareScopeUpdate() {},
    getInstanceFromScope: () => null,
    appendChildToContainer: appendChildNode,
    insertInContainerBefore: insertBeforeNode,
    removeChildFromContainer(node, removeNode) {
      removeChildNode(node, removeNode), cleanupYogaNode(removeNode), getFocusManager(node).handleNodeRemoved(removeNode, node);
    },
    commitUpdate(node, _type, oldProps, newProps) {
      let props = diff(oldProps, newProps), style = diff(oldProps.style, newProps.style);
      if (props)
        for (let [key, value] of Object.entries(props)) {
          if (key === "style") {
            setStyle(node, value);
            continue;
          }
          if (key === "textStyles") {
            setTextStyles(node, value);
            continue;
          }
          if (EVENT_HANDLER_PROPS.has(key)) {
            setEventHandler(node, key, value);
            continue;
          }
          setAttribute(node, key, value);
        }
      if (style && node.yogaNode)
        styles_default(node.yogaNode, style, newProps.style);
    },
    commitTextUpdate(node, _oldText, newText) {
      setTextNodeValue(node, newText);
    },
    removeChild(node, removeNode) {
      if (removeChildNode(node, removeNode), cleanupYogaNode(removeNode), removeNode.nodeName !== "#text") {
        let root2 = getRootNode(node);
        root2.focusManager.handleNodeRemoved(removeNode, root2);
      }
    },
    maySuspendCommit() {
      return !1;
    },
    preloadInstance() {
      return !0;
    },
    startSuspendingCommit() {},
    suspendInstance() {},
    waitForCommitToBeReady() {
      return null;
    },
    NotPendingTransition: null,
    HostTransitionContext: {
      $$typeof: Symbol.for("react.context"),
      _currentValue: null
    },
    setCurrentUpdatePriority(newPriority) {
      dispatcher.currentUpdatePriority = newPriority;
    },
    resolveUpdatePriority() {
      return dispatcher.resolveEventPriority();
    },
    resetFormInstance() {},
    requestPostPaintCallback() {},
    shouldAttemptEagerTransition() {
      return !1;
    },
    trackSchedulerEvent() {},
    resolveEventType() {
      return dispatcher.currentEvent?.type ?? null;
    },
    resolveEventTimeStamp() {
      return dispatcher.currentEvent?.timeStamp ?? -1.1;
    }
  });
  dispatcher.discreteUpdates = reconciler.discreteUpdates.bind(reconciler);
  reconciler_default = reconciler;
});
