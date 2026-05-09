// var: require_react_reconciler_development
var require_react_reconciler_development = __commonJS((exports, module) => {
  var React2 = __toESM(require_react_development()), Scheduler = __toESM(require_scheduler_development());
  module.exports = function($$$config) {
    function findHook(fiber, id) {
      for (fiber = fiber.memoizedState;fiber !== null && 0 < id; )
        fiber = fiber.next, id--;
      return fiber;
    }
    function copyWithSetImpl(obj, path12, index, value) {
      if (index >= path12.length)
        return value;
      var key = path12[index], updated = isArrayImpl(obj) ? obj.slice() : assign({}, obj);
      return updated[key] = copyWithSetImpl(obj[key], path12, index + 1, value), updated;
    }
    function copyWithRename(obj, oldPath, newPath) {
      if (oldPath.length !== newPath.length)
        console.warn("copyWithRename() expects paths of the same length");
      else {
        for (var i4 = 0;i4 < newPath.length - 1; i4++)
          if (oldPath[i4] !== newPath[i4]) {
            console.warn("copyWithRename() expects paths to be the same except for the deepest key");
            return;
          }
        return copyWithRenameImpl(obj, oldPath, newPath, 0);
      }
    }
    function copyWithRenameImpl(obj, oldPath, newPath, index) {
      var oldKey = oldPath[index], updated = isArrayImpl(obj) ? obj.slice() : assign({}, obj);
      return index + 1 === oldPath.length ? (updated[newPath[index]] = updated[oldKey], isArrayImpl(updated) ? updated.splice(oldKey, 1) : delete updated[oldKey]) : updated[oldKey] = copyWithRenameImpl(obj[oldKey], oldPath, newPath, index + 1), updated;
    }
    function copyWithDeleteImpl(obj, path12, index) {
      var key = path12[index], updated = isArrayImpl(obj) ? obj.slice() : assign({}, obj);
      if (index + 1 === path12.length)
        return isArrayImpl(updated) ? updated.splice(key, 1) : delete updated[key], updated;
      return updated[key] = copyWithDeleteImpl(obj[key], path12, index + 1), updated;
    }
    function shouldSuspendImpl() {
      return !1;
    }
    function shouldErrorImpl() {
      return null;
    }
    function createFiber(tag, pendingProps, key, mode) {
      return new FiberNode(tag, pendingProps, key, mode);
    }
    function scheduleRoot(root2, element) {
      root2.context === emptyContextObject && (updateContainerSync(element, root2, null, null), flushSyncWork());
    }
    function scheduleRefresh(root2, update) {
      if (resolveFamily2 !== null) {
        var staleFamilies = update.staleFamilies;
        update = update.updatedFamilies, flushPendingEffects(), scheduleFibersWithFamiliesRecursively(root2.current, update, staleFamilies), flushSyncWork();
      }
    }
    function setRefreshHandler(handler) {
      resolveFamily2 = handler;
    }
    function warnInvalidHookAccess() {
      console.error("Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks. You can only call Hooks at the top level of your React function. For more information, see https://react.dev/link/rules-of-hooks");
    }
    function warnInvalidContextAccess() {
      console.error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
    }
    function noop8() {}
    function warnForMissingKey() {}
    function setToSortedString(set2) {
      var array2 = [];
      return set2.forEach(function(value) {
        array2.push(value);
      }), array2.sort().join(", ");
    }
    function getNearestMountedFiber(fiber) {
      var node = fiber, nearestMounted = fiber;
      if (fiber.alternate)
        for (;node.return; )
          node = node.return;
      else {
        fiber = node;
        do
          node = fiber, (node.flags & 4098) !== 0 && (nearestMounted = node.return), fiber = node.return;
        while (fiber);
      }
      return node.tag === 3 ? nearestMounted : null;
    }
    function assertIsMounted(fiber) {
      if (getNearestMountedFiber(fiber) !== fiber)
        throw Error("Unable to find node on an unmounted component.");
    }
    function findCurrentFiberUsingSlowPath(fiber) {
      var alternate = fiber.alternate;
      if (!alternate) {
        if (alternate = getNearestMountedFiber(fiber), alternate === null)
          throw Error("Unable to find node on an unmounted component.");
        return alternate !== fiber ? null : fiber;
      }
      for (var a2 = fiber, b = alternate;; ) {
        var parentA = a2.return;
        if (parentA === null)
          break;
        var parentB = parentA.alternate;
        if (parentB === null) {
          if (b = parentA.return, b !== null) {
            a2 = b;
            continue;
          }
          break;
        }
        if (parentA.child === parentB.child) {
          for (parentB = parentA.child;parentB; ) {
            if (parentB === a2)
              return assertIsMounted(parentA), fiber;
            if (parentB === b)
              return assertIsMounted(parentA), alternate;
            parentB = parentB.sibling;
          }
          throw Error("Unable to find node on an unmounted component.");
        }
        if (a2.return !== b.return)
          a2 = parentA, b = parentB;
        else {
          for (var didFindChild = !1, _child = parentA.child;_child; ) {
            if (_child === a2) {
              didFindChild = !0, a2 = parentA, b = parentB;
              break;
            }
            if (_child === b) {
              didFindChild = !0, b = parentA, a2 = parentB;
              break;
            }
            _child = _child.sibling;
          }
          if (!didFindChild) {
            for (_child = parentB.child;_child; ) {
              if (_child === a2) {
                didFindChild = !0, a2 = parentB, b = parentA;
                break;
              }
              if (_child === b) {
                didFindChild = !0, b = parentB, a2 = parentA;
                break;
              }
              _child = _child.sibling;
            }
            if (!didFindChild)
              throw Error("Child was not found in either parent set. This indicates a bug in React related to the return pointer. Please file an issue.");
          }
        }
        if (a2.alternate !== b)
          throw Error("Return fibers should always be each others' alternates. This error is likely caused by a bug in React. Please file an issue.");
      }
      if (a2.tag !== 3)
        throw Error("Unable to find node on an unmounted component.");
      return a2.stateNode.current === a2 ? fiber : alternate;
    }
    function findCurrentHostFiber(parent) {
      return parent = findCurrentFiberUsingSlowPath(parent), parent !== null ? findCurrentHostFiberImpl(parent) : null;
    }
    function findCurrentHostFiberImpl(node) {
      var tag = node.tag;
      if (tag === 5 || tag === 26 || tag === 27 || tag === 6)
        return node;
      for (node = node.child;node !== null; ) {
        if (tag = findCurrentHostFiberImpl(node), tag !== null)
          return tag;
        node = node.sibling;
      }
      return null;
    }
    function findCurrentHostFiberWithNoPortalsImpl(node) {
      var tag = node.tag;
      if (tag === 5 || tag === 26 || tag === 27 || tag === 6)
        return node;
      for (node = node.child;node !== null; ) {
        if (node.tag !== 4 && (tag = findCurrentHostFiberWithNoPortalsImpl(node), tag !== null))
          return tag;
        node = node.sibling;
      }
      return null;
    }
    function getIteratorFn(maybeIterable) {
      if (maybeIterable === null || typeof maybeIterable !== "object")
        return null;
      return maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"], typeof maybeIterable === "function" ? maybeIterable : null;
    }
    function getComponentNameFromType(type) {
      if (type == null)
        return null;
      if (typeof type === "function")
        return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
      if (typeof type === "string")
        return type;
      switch (type) {
        case REACT_FRAGMENT_TYPE:
          return "Fragment";
        case REACT_PROFILER_TYPE:
          return "Profiler";
        case REACT_STRICT_MODE_TYPE:
          return "StrictMode";
        case REACT_SUSPENSE_TYPE:
          return "Suspense";
        case REACT_SUSPENSE_LIST_TYPE:
          return "SuspenseList";
        case REACT_ACTIVITY_TYPE:
          return "Activity";
      }
      if (typeof type === "object")
        switch (typeof type.tag === "number" && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof) {
          case REACT_PORTAL_TYPE:
            return "Portal";
          case REACT_CONTEXT_TYPE:
            return type.displayName || "Context";
          case REACT_CONSUMER_TYPE:
            return (type._context.displayName || "Context") + ".Consumer";
          case REACT_FORWARD_REF_TYPE:
            var innerType = type.render;
            return type = type.displayName, type || (type = innerType.displayName || innerType.name || "", type = type !== "" ? "ForwardRef(" + type + ")" : "ForwardRef"), type;
          case REACT_MEMO_TYPE:
            return innerType = type.displayName || null, innerType !== null ? innerType : getComponentNameFromType(type.type) || "Memo";
          case REACT_LAZY_TYPE:
            innerType = type._payload, type = type._init;
            try {
              return getComponentNameFromType(type(innerType));
            } catch (x3) {}
        }
      return null;
    }
    function getComponentNameFromFiber(fiber) {
      var type = fiber.type;
      switch (fiber.tag) {
        case 31:
          return "Activity";
        case 24:
          return "Cache";
        case 9:
          return (type._context.displayName || "Context") + ".Consumer";
        case 10:
          return type.displayName || "Context";
        case 18:
          return "DehydratedFragment";
        case 11:
          return fiber = type.render, fiber = fiber.displayName || fiber.name || "", type.displayName || (fiber !== "" ? "ForwardRef(" + fiber + ")" : "ForwardRef");
        case 7:
          return "Fragment";
        case 26:
        case 27:
        case 5:
          return type;
        case 4:
          return "Portal";
        case 3:
          return "Root";
        case 6:
          return "Text";
        case 16:
          return getComponentNameFromType(type);
        case 8:
          return type === REACT_STRICT_MODE_TYPE ? "StrictMode" : "Mode";
        case 22:
          return "Offscreen";
        case 12:
          return "Profiler";
        case 21:
          return "Scope";
        case 13:
          return "Suspense";
        case 19:
          return "SuspenseList";
        case 25:
          return "TracingMarker";
        case 1:
        case 0:
        case 14:
        case 15:
          if (typeof type === "function")
            return type.displayName || type.name || null;
          if (typeof type === "string")
            return type;
          break;
        case 29:
          if (type = fiber._debugInfo, type != null) {
            for (var i4 = type.length - 1;0 <= i4; i4--)
              if (typeof type[i4].name === "string")
                return type[i4].name;
          }
          if (fiber.return !== null)
            return getComponentNameFromFiber(fiber.return);
      }
      return null;
    }
    function createCursor(defaultValue) {
      return { current: defaultValue };
    }
    function pop(cursor, fiber) {
      0 > index$jscomp$0 ? console.error("Unexpected pop.") : (fiber !== fiberStack[index$jscomp$0] && console.error("Unexpected Fiber popped."), cursor.current = valueStack[index$jscomp$0], valueStack[index$jscomp$0] = null, fiberStack[index$jscomp$0] = null, index$jscomp$0--);
    }
    function push(cursor, value, fiber) {
      index$jscomp$0++, valueStack[index$jscomp$0] = cursor.current, fiberStack[index$jscomp$0] = fiber, cursor.current = value;
    }
    function clz32Fallback(x3) {
      return x3 >>>= 0, x3 === 0 ? 32 : 31 - (log$1(x3) / LN2 | 0) | 0;
    }
    function getHighestPriorityLanes(lanes) {
      var pendingSyncLanes = lanes & 42;
      if (pendingSyncLanes !== 0)
        return pendingSyncLanes;
      switch (lanes & -lanes) {
        case 1:
          return 1;
        case 2:
          return 2;
        case 4:
          return 4;
        case 8:
          return 8;
        case 16:
          return 16;
        case 32:
          return 32;
        case 64:
          return 64;
        case 128:
          return 128;
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
          return lanes & 261888;
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
          return lanes & 3932160;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          return lanes & 62914560;
        case 67108864:
          return 67108864;
        case 134217728:
          return 134217728;
        case 268435456:
          return 268435456;
        case 536870912:
          return 536870912;
        case 1073741824:
          return 0;
        default:
          return console.error("Should have found matching lanes. This is a bug in React."), lanes;
      }
    }
    function getNextLanes(root2, wipLanes, rootHasPendingCommit) {
      var pendingLanes = root2.pendingLanes;
      if (pendingLanes === 0)
        return 0;
      var nextLanes = 0, suspendedLanes = root2.suspendedLanes, pingedLanes = root2.pingedLanes;
      root2 = root2.warmLanes;
      var nonIdlePendingLanes = pendingLanes & 134217727;
      return nonIdlePendingLanes !== 0 ? (pendingLanes = nonIdlePendingLanes & ~suspendedLanes, pendingLanes !== 0 ? nextLanes = getHighestPriorityLanes(pendingLanes) : (pingedLanes &= nonIdlePendingLanes, pingedLanes !== 0 ? nextLanes = getHighestPriorityLanes(pingedLanes) : rootHasPendingCommit || (rootHasPendingCommit = nonIdlePendingLanes & ~root2, rootHasPendingCommit !== 0 && (nextLanes = getHighestPriorityLanes(rootHasPendingCommit))))) : (nonIdlePendingLanes = pendingLanes & ~suspendedLanes, nonIdlePendingLanes !== 0 ? nextLanes = getHighestPriorityLanes(nonIdlePendingLanes) : pingedLanes !== 0 ? nextLanes = getHighestPriorityLanes(pingedLanes) : rootHasPendingCommit || (rootHasPendingCommit = pendingLanes & ~root2, rootHasPendingCommit !== 0 && (nextLanes = getHighestPriorityLanes(rootHasPendingCommit)))), nextLanes === 0 ? 0 : wipLanes !== 0 && wipLanes !== nextLanes && (wipLanes & suspendedLanes) === 0 && (suspendedLanes = nextLanes & -nextLanes, rootHasPendingCommit = wipLanes & -wipLanes, suspendedLanes >= rootHasPendingCommit || suspendedLanes === 32 && (rootHasPendingCommit & 4194048) !== 0) ? wipLanes : nextLanes;
    }
    function checkIfRootIsPrerendering(root2, renderLanes2) {
      return (root2.pendingLanes & ~(root2.suspendedLanes & ~root2.pingedLanes) & renderLanes2) === 0;
    }
    function computeExpirationTime(lane, currentTime) {
      switch (lane) {
        case 1:
        case 2:
        case 4:
        case 8:
        case 64:
          return currentTime + 250;
        case 16:
        case 32:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
          return currentTime + 5000;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          return -1;
        case 67108864:
        case 134217728:
        case 268435456:
        case 536870912:
        case 1073741824:
          return -1;
        default:
          return console.error("Should have found matching lanes. This is a bug in React."), -1;
      }
    }
    function claimNextRetryLane() {
      var lane = nextRetryLane;
      return nextRetryLane <<= 1, (nextRetryLane & 62914560) === 0 && (nextRetryLane = 4194304), lane;
    }
    function createLaneMap(initial) {
      for (var laneMap = [], i4 = 0;31 > i4; i4++)
        laneMap.push(initial);
      return laneMap;
    }
    function markRootUpdated$1(root2, updateLane) {
      root2.pendingLanes |= updateLane, updateLane !== 268435456 && (root2.suspendedLanes = 0, root2.pingedLanes = 0, root2.warmLanes = 0);
    }
    function markRootFinished(root2, finishedLanes, remainingLanes, spawnedLane, updatedLanes, suspendedRetryLanes) {
      var previouslyPendingLanes = root2.pendingLanes;
      root2.pendingLanes = remainingLanes, root2.suspendedLanes = 0, root2.pingedLanes = 0, root2.warmLanes = 0, root2.expiredLanes &= remainingLanes, root2.entangledLanes &= remainingLanes, root2.errorRecoveryDisabledLanes &= remainingLanes, root2.shellSuspendCounter = 0;
      var { entanglements, expirationTimes, hiddenUpdates } = root2;
      for (remainingLanes = previouslyPendingLanes & ~remainingLanes;0 < remainingLanes; ) {
        var index = 31 - clz32(remainingLanes), lane = 1 << index;
        entanglements[index] = 0, expirationTimes[index] = -1;
        var hiddenUpdatesForLane = hiddenUpdates[index];
        if (hiddenUpdatesForLane !== null)
          for (hiddenUpdates[index] = null, index = 0;index < hiddenUpdatesForLane.length; index++) {
            var update = hiddenUpdatesForLane[index];
            update !== null && (update.lane &= -536870913);
          }
        remainingLanes &= ~lane;
      }
      spawnedLane !== 0 && markSpawnedDeferredLane(root2, spawnedLane, 0), suspendedRetryLanes !== 0 && updatedLanes === 0 && root2.tag !== 0 && (root2.suspendedLanes |= suspendedRetryLanes & ~(previouslyPendingLanes & ~finishedLanes));
    }
    function markSpawnedDeferredLane(root2, spawnedLane, entangledLanes) {
      root2.pendingLanes |= spawnedLane, root2.suspendedLanes &= ~spawnedLane;
      var spawnedLaneIndex = 31 - clz32(spawnedLane);
      root2.entangledLanes |= spawnedLane, root2.entanglements[spawnedLaneIndex] = root2.entanglements[spawnedLaneIndex] | 1073741824 | entangledLanes & 261930;
    }
    function markRootEntangled(root2, entangledLanes) {
      var rootEntangledLanes = root2.entangledLanes |= entangledLanes;
      for (root2 = root2.entanglements;rootEntangledLanes; ) {
        var index = 31 - clz32(rootEntangledLanes), lane = 1 << index;
        lane & entangledLanes | root2[index] & entangledLanes && (root2[index] |= entangledLanes), rootEntangledLanes &= ~lane;
      }
    }
    function getBumpedLaneForHydration(root2, renderLanes2) {
      var renderLane = renderLanes2 & -renderLanes2;
      return renderLane = (renderLane & 42) !== 0 ? 1 : getBumpedLaneForHydrationByLane(renderLane), (renderLane & (root2.suspendedLanes | renderLanes2)) !== 0 ? 0 : renderLane;
    }
    function getBumpedLaneForHydrationByLane(lane) {
      switch (lane) {
        case 2:
          lane = 1;
          break;
        case 8:
          lane = 4;
          break;
        case 32:
          lane = 16;
          break;
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          lane = 128;
          break;
        case 268435456:
          lane = 134217728;
          break;
        default:
          lane = 0;
      }
      return lane;
    }
    function addFiberToLanesMap(root2, fiber, lanes) {
      if (isDevToolsPresent)
        for (root2 = root2.pendingUpdatersLaneMap;0 < lanes; ) {
          var index = 31 - clz32(lanes), lane = 1 << index;
          root2[index].add(fiber), lanes &= ~lane;
        }
    }
    function movePendingFibersToMemoized(root2, lanes) {
      if (isDevToolsPresent)
        for (var { pendingUpdatersLaneMap, memoizedUpdaters } = root2;0 < lanes; ) {
          var index = 31 - clz32(lanes);
          root2 = 1 << index, index = pendingUpdatersLaneMap[index], 0 < index.size && (index.forEach(function(fiber) {
            var alternate = fiber.alternate;
            alternate !== null && memoizedUpdaters.has(alternate) || memoizedUpdaters.add(fiber);
          }), index.clear()), lanes &= ~root2;
        }
    }
    function lanesToEventPriority(lanes) {
      return lanes &= -lanes, 2 < lanes ? 8 < lanes ? (lanes & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
    }
    function injectInternals(internals) {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u")
        return !1;
      var hook = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (hook.isDisabled)
        return !0;
      if (!hook.supportsFiber)
        return console.error("The installed version of React DevTools is too old and will not work with the current version of React. Please update React DevTools. https://react.dev/link/react-devtools"), !0;
      try {
        rendererID = hook.inject(internals), injectedHook = hook;
      } catch (err) {
        console.error("React instrumentation encountered an error: %o.", err);
      }
      return hook.checkDCE ? !0 : !1;
    }
    function setIsStrictModeForDevtools(newIsStrictMode) {
      if (typeof log4 === "function" && unstable_setDisableYieldValue2(newIsStrictMode), injectedHook && typeof injectedHook.setStrictMode === "function")
        try {
          injectedHook.setStrictMode(rendererID, newIsStrictMode);
        } catch (err) {
          hasLoggedError || (hasLoggedError = !0, console.error("React instrumentation encountered an error: %o", err));
        }
    }
    function is(x3, y2) {
      return x3 === y2 && (x3 !== 0 || 1 / x3 === 1 / y2) || x3 !== x3 && y2 !== y2;
    }
    function getArrayKind(array2) {
      for (var kind = 0, i4 = 0;i4 < array2.length; i4++) {
        var value = array2[i4];
        if (typeof value === "object" && value !== null)
          if (isArrayImpl(value) && value.length === 2 && typeof value[0] === "string") {
            if (kind !== 0 && kind !== 3)
              return 1;
            kind = 3;
          } else
            return 1;
        else {
          if (typeof value === "function" || typeof value === "string" && 50 < value.length || kind !== 0 && kind !== 2)
            return 1;
          kind = 2;
        }
      }
      return kind;
    }
    function addObjectToProperties(object2, properties, indent, prefix2) {
      for (var key in object2)
        hasOwnProperty15.call(object2, key) && key[0] !== "_" && addValueToProperties(key, object2[key], properties, indent, prefix2);
    }
    function addValueToProperties(propertyName, value, properties, indent, prefix2) {
      switch (typeof value) {
        case "object":
          if (value === null) {
            value = "null";
            break;
          } else {
            if (value.$$typeof === REACT_ELEMENT_TYPE) {
              var typeName = getComponentNameFromType(value.type) || "\u2026", key = value.key;
              value = value.props;
              var propsKeys = Object.keys(value), propsLength = propsKeys.length;
              if (key == null && propsLength === 0) {
                value = "<" + typeName + " />";
                break;
              }
              if (3 > indent || propsLength === 1 && propsKeys[0] === "children" && key == null) {
                value = "<" + typeName + " \u2026 />";
                break;
              }
              properties.push([
                prefix2 + "\xA0\xA0".repeat(indent) + propertyName,
                "<" + typeName
              ]), key !== null && addValueToProperties("key", key, properties, indent + 1, prefix2), propertyName = !1;
              for (var propKey in value)
                propKey === "children" ? value.children != null && (!isArrayImpl(value.children) || 0 < value.children.length) && (propertyName = !0) : hasOwnProperty15.call(value, propKey) && propKey[0] !== "_" && addValueToProperties(propKey, value[propKey], properties, indent + 1, prefix2);
              properties.push([
                "",
                propertyName ? ">\u2026</" + typeName + ">" : "/>"
              ]);
              return;
            }
            if (typeName = Object.prototype.toString.call(value), typeName = typeName.slice(8, typeName.length - 1), typeName === "Array") {
              if (propKey = getArrayKind(value), propKey === 2 || propKey === 0) {
                value = JSON.stringify(value);
                break;
              } else if (propKey === 3) {
                properties.push([
                  prefix2 + "\xA0\xA0".repeat(indent) + propertyName,
                  ""
                ]);
                for (propertyName = 0;propertyName < value.length; propertyName++)
                  typeName = value[propertyName], addValueToProperties(typeName[0], typeName[1], properties, indent + 1, prefix2);
                return;
              }
            }
            if (typeName === "Promise") {
              if (value.status === "fulfilled") {
                if (typeName = properties.length, addValueToProperties(propertyName, value.value, properties, indent, prefix2), properties.length > typeName) {
                  properties = properties[typeName], properties[1] = "Promise<" + (properties[1] || "Object") + ">";
                  return;
                }
              } else if (value.status === "rejected" && (typeName = properties.length, addValueToProperties(propertyName, value.reason, properties, indent, prefix2), properties.length > typeName)) {
                properties = properties[typeName], properties[1] = "Rejected Promise<" + properties[1] + ">";
                return;
              }
              properties.push([
                "\xA0\xA0".repeat(indent) + propertyName,
                "Promise"
              ]);
              return;
            }
            typeName === "Object" && (propKey = Object.getPrototypeOf(value)) && typeof propKey.constructor === "function" && (typeName = propKey.constructor.name), properties.push([
              prefix2 + "\xA0\xA0".repeat(indent) + propertyName,
              typeName === "Object" ? 3 > indent ? "" : "\u2026" : typeName
            ]), 3 > indent && addObjectToProperties(value, properties, indent + 1, prefix2);
            return;
          }
        case "function":
          value = value.name === "" ? "() => {}" : value.name + "() {}";
          break;
        case "string":
          value = value === "This object has been omitted by React in the console log to avoid sending too much data from the server. Try logging smaller or more specific objects." ? "\u2026" : JSON.stringify(value);
          break;
        case "undefined":
          value = "undefined";
          break;
        case "boolean":
          value = value ? "true" : "false";
          break;
        default:
          value = String(value);
      }
      properties.push([
        prefix2 + "\xA0\xA0".repeat(indent) + propertyName,
        value
      ]);
    }
    function addObjectDiffToProperties(prev, next, properties, indent) {
      var isDeeplyEqual = !0;
      for (key in prev)
        key in next || (properties.push([
          "\u2013\xA0" + "\xA0\xA0".repeat(indent) + key,
          "\u2026"
        ]), isDeeplyEqual = !1);
      for (var _key in next)
        if (_key in prev) {
          var key = prev[_key], nextValue = next[_key];
          if (key !== nextValue) {
            if (indent === 0 && _key === "children")
              isDeeplyEqual = "\xA0\xA0".repeat(indent) + _key, properties.push(["\u2013\xA0" + isDeeplyEqual, "\u2026"], ["+\xA0" + isDeeplyEqual, "\u2026"]);
            else {
              if (!(3 <= indent)) {
                if (typeof key === "object" && typeof nextValue === "object" && key !== null && nextValue !== null && key.$$typeof === nextValue.$$typeof)
                  if (nextValue.$$typeof === REACT_ELEMENT_TYPE) {
                    if (key.type === nextValue.type && key.key === nextValue.key) {
                      key = getComponentNameFromType(nextValue.type) || "\u2026", isDeeplyEqual = "\xA0\xA0".repeat(indent) + _key, key = "<" + key + " \u2026 />", properties.push(["\u2013\xA0" + isDeeplyEqual, key], ["+\xA0" + isDeeplyEqual, key]), isDeeplyEqual = !1;
                      continue;
                    }
                  } else {
                    var prevKind = Object.prototype.toString.call(key), nextKind = Object.prototype.toString.call(nextValue);
                    if (prevKind === nextKind && (nextKind === "[object Object]" || nextKind === "[object Array]")) {
                      prevKind = [
                        "\u2007\xA0" + "\xA0\xA0".repeat(indent) + _key,
                        nextKind === "[object Array]" ? "Array" : ""
                      ], properties.push(prevKind), nextKind = properties.length, addObjectDiffToProperties(key, nextValue, properties, indent + 1) ? nextKind === properties.length && (prevKind[1] = "Referentially unequal but deeply equal objects. Consider memoization.") : isDeeplyEqual = !1;
                      continue;
                    }
                  }
                else if (typeof key === "function" && typeof nextValue === "function" && key.name === nextValue.name && key.length === nextValue.length && (prevKind = Function.prototype.toString.call(key), nextKind = Function.prototype.toString.call(nextValue), prevKind === nextKind)) {
                  key = nextValue.name === "" ? "() => {}" : nextValue.name + "() {}", properties.push([
                    "\u2007\xA0" + "\xA0\xA0".repeat(indent) + _key,
                    key + " Referentially unequal function closure. Consider memoization."
                  ]);
                  continue;
                }
              }
              addValueToProperties(_key, key, properties, indent, "\u2013\xA0"), addValueToProperties(_key, nextValue, properties, indent, "+\xA0");
            }
            isDeeplyEqual = !1;
          }
        } else
          properties.push([
            "+\xA0" + "\xA0\xA0".repeat(indent) + _key,
            "\u2026"
          ]), isDeeplyEqual = !1;
      return isDeeplyEqual;
    }
    function setCurrentTrackFromLanes(lanes) {
      currentTrack = lanes & 63 ? "Blocking" : lanes & 64 ? "Gesture" : lanes & 4194176 ? "Transition" : lanes & 62914560 ? "Suspense" : lanes & 2080374784 ? "Idle" : "Other";
    }
    function logComponentTrigger(fiber, startTime, endTime, trigger) {
      supportsUserTiming && (reusableComponentOptions.start = startTime, reusableComponentOptions.end = endTime, reusableComponentDevToolDetails.color = "warning", reusableComponentDevToolDetails.tooltipText = trigger, reusableComponentDevToolDetails.properties = null, (fiber = fiber._debugTask) ? fiber.run(performance.measure.bind(performance, trigger, reusableComponentOptions)) : performance.measure(trigger, reusableComponentOptions));
    }
    function logComponentReappeared(fiber, startTime, endTime) {
      logComponentTrigger(fiber, startTime, endTime, "Reconnect");
    }
    function logComponentRender(fiber, startTime, endTime, wasHydrated, committedLanes) {
      var name3 = getComponentNameFromFiber(fiber);
      if (name3 !== null && supportsUserTiming) {
        var { alternate, actualDuration: selfTime } = fiber;
        if (alternate === null || alternate.child !== fiber.child)
          for (var child = fiber.child;child !== null; child = child.sibling)
            selfTime -= child.actualDuration;
        wasHydrated = 0.5 > selfTime ? wasHydrated ? "tertiary-light" : "primary-light" : 10 > selfTime ? wasHydrated ? "tertiary" : "primary" : 100 > selfTime ? wasHydrated ? "tertiary-dark" : "primary-dark" : "error";
        var props = fiber.memoizedProps;
        selfTime = fiber._debugTask, props !== null && alternate !== null && alternate.memoizedProps !== props ? (child = [resuableChangedPropsEntry], props = addObjectDiffToProperties(alternate.memoizedProps, props, child, 0), 1 < child.length && (props && !alreadyWarnedForDeepEquality && (alternate.lanes & committedLanes) === 0 && 100 < fiber.actualDuration ? (alreadyWarnedForDeepEquality = !0, child[0] = reusableDeeplyEqualPropsEntry, reusableComponentDevToolDetails.color = "warning", reusableComponentDevToolDetails.tooltipText = "This component received deeply equal props. It might benefit from useMemo or the React Compiler in its owner.") : (reusableComponentDevToolDetails.color = wasHydrated, reusableComponentDevToolDetails.tooltipText = name3), reusableComponentDevToolDetails.properties = child, reusableComponentOptions.start = startTime, reusableComponentOptions.end = endTime, selfTime != null ? selfTime.run(performance.measure.bind(performance, "\u200B" + name3, reusableComponentOptions)) : performance.measure("\u200B" + name3, reusableComponentOptions))) : selfTime != null ? selfTime.run(console.timeStamp.bind(console, name3, startTime, endTime, "Components \u269B", void 0, wasHydrated)) : console.timeStamp(name3, startTime, endTime, "Components \u269B", void 0, wasHydrated);
      }
    }
    function logComponentErrored(fiber, startTime, endTime, errors6) {
      if (supportsUserTiming) {
        var name3 = getComponentNameFromFiber(fiber);
        if (name3 !== null) {
          for (var debugTask = null, properties = [], i4 = 0;i4 < errors6.length; i4++) {
            var capturedValue = errors6[i4];
            debugTask == null && capturedValue.source !== null && (debugTask = capturedValue.source._debugTask), capturedValue = capturedValue.value, properties.push([
              "Error",
              typeof capturedValue === "object" && capturedValue !== null && typeof capturedValue.message === "string" ? String(capturedValue.message) : String(capturedValue)
            ]);
          }
          fiber.key !== null && addValueToProperties("key", fiber.key, properties, 0, ""), fiber.memoizedProps !== null && addObjectToProperties(fiber.memoizedProps, properties, 0, ""), debugTask == null && (debugTask = fiber._debugTask), fiber = {
            start: startTime,
            end: endTime,
            detail: {
              devtools: {
                color: "error",
                track: "Components \u269B",
                tooltipText: fiber.tag === 13 ? "Hydration failed" : "Error boundary caught an error",
                properties
              }
            }
          }, debugTask ? debugTask.run(performance.measure.bind(performance, "\u200B" + name3, fiber)) : performance.measure("\u200B" + name3, fiber);
        }
      }
    }
    function logComponentEffect(fiber, startTime, endTime, selfTime, errors6) {
      if (errors6 !== null) {
        if (supportsUserTiming) {
          var name3 = getComponentNameFromFiber(fiber);
          if (name3 !== null) {
            selfTime = [];
            for (var i4 = 0;i4 < errors6.length; i4++) {
              var error44 = errors6[i4].value;
              selfTime.push([
                "Error",
                typeof error44 === "object" && error44 !== null && typeof error44.message === "string" ? String(error44.message) : String(error44)
              ]);
            }
            fiber.key !== null && addValueToProperties("key", fiber.key, selfTime, 0, ""), fiber.memoizedProps !== null && addObjectToProperties(fiber.memoizedProps, selfTime, 0, ""), startTime = {
              start: startTime,
              end: endTime,
              detail: {
                devtools: {
                  color: "error",
                  track: "Components \u269B",
                  tooltipText: "A lifecycle or effect errored",
                  properties: selfTime
                }
              }
            }, (fiber = fiber._debugTask) ? fiber.run(performance.measure.bind(performance, "\u200B" + name3, startTime)) : performance.measure("\u200B" + name3, startTime);
          }
        }
      } else
        name3 = getComponentNameFromFiber(fiber), name3 !== null && supportsUserTiming && (errors6 = 1 > selfTime ? "secondary-light" : 100 > selfTime ? "secondary" : 500 > selfTime ? "secondary-dark" : "error", (fiber = fiber._debugTask) ? fiber.run(console.timeStamp.bind(console, name3, startTime, endTime, "Components \u269B", void 0, errors6)) : console.timeStamp(name3, startTime, endTime, "Components \u269B", void 0, errors6));
    }
    function logRenderPhase(startTime, endTime, lanes, debugTask) {
      if (supportsUserTiming && !(endTime <= startTime)) {
        var color = (lanes & 738197653) === lanes ? "tertiary-dark" : "primary-dark";
        lanes = (lanes & 536870912) === lanes ? "Prepared" : (lanes & 201326741) === lanes ? "Hydrated" : "Render", debugTask ? debugTask.run(console.timeStamp.bind(console, lanes, startTime, endTime, currentTrack, "Scheduler \u269B", color)) : console.timeStamp(lanes, startTime, endTime, currentTrack, "Scheduler \u269B", color);
      }
    }
    function logSuspendedRenderPhase(startTime, endTime, lanes, debugTask) {
      !supportsUserTiming || endTime <= startTime || (lanes = (lanes & 738197653) === lanes ? "tertiary-dark" : "primary-dark", debugTask ? debugTask.run(console.timeStamp.bind(console, "Prewarm", startTime, endTime, currentTrack, "Scheduler \u269B", lanes)) : console.timeStamp("Prewarm", startTime, endTime, currentTrack, "Scheduler \u269B", lanes));
    }
    function logSuspendedWithDelayPhase(startTime, endTime, lanes, debugTask) {
      !supportsUserTiming || endTime <= startTime || (lanes = (lanes & 738197653) === lanes ? "tertiary-dark" : "primary-dark", debugTask ? debugTask.run(console.timeStamp.bind(console, "Suspended", startTime, endTime, currentTrack, "Scheduler \u269B", lanes)) : console.timeStamp("Suspended", startTime, endTime, currentTrack, "Scheduler \u269B", lanes));
    }
    function logRecoveredRenderPhase(startTime, endTime, lanes, recoverableErrors, hydrationFailed, debugTask) {
      if (supportsUserTiming && !(endTime <= startTime)) {
        lanes = [];
        for (var i4 = 0;i4 < recoverableErrors.length; i4++) {
          var error44 = recoverableErrors[i4].value;
          lanes.push([
            "Recoverable Error",
            typeof error44 === "object" && error44 !== null && typeof error44.message === "string" ? String(error44.message) : String(error44)
          ]);
        }
        startTime = {
          start: startTime,
          end: endTime,
          detail: {
            devtools: {
              color: "primary-dark",
              track: currentTrack,
              trackGroup: "Scheduler \u269B",
              tooltipText: hydrationFailed ? "Hydration Failed" : "Recovered after Error",
              properties: lanes
            }
          }
        }, debugTask ? debugTask.run(performance.measure.bind(performance, "Recovered", startTime)) : performance.measure("Recovered", startTime);
      }
    }
    function logErroredRenderPhase(startTime, endTime, lanes, debugTask) {
      !supportsUserTiming || endTime <= startTime || (debugTask ? debugTask.run(console.timeStamp.bind(console, "Errored", startTime, endTime, currentTrack, "Scheduler \u269B", "error")) : console.timeStamp("Errored", startTime, endTime, currentTrack, "Scheduler \u269B", "error"));
    }
    function logSuspendedCommitPhase(startTime, endTime, reason, debugTask) {
      !supportsUserTiming || endTime <= startTime || (debugTask ? debugTask.run(console.timeStamp.bind(console, reason, startTime, endTime, currentTrack, "Scheduler \u269B", "secondary-light")) : console.timeStamp(reason, startTime, endTime, currentTrack, "Scheduler \u269B", "secondary-light"));
    }
    function logCommitErrored(startTime, endTime, errors6, passive, debugTask) {
      if (supportsUserTiming && !(endTime <= startTime)) {
        for (var properties = [], i4 = 0;i4 < errors6.length; i4++) {
          var error44 = errors6[i4].value;
          properties.push([
            "Error",
            typeof error44 === "object" && error44 !== null && typeof error44.message === "string" ? String(error44.message) : String(error44)
          ]);
        }
        startTime = {
          start: startTime,
          end: endTime,
          detail: {
            devtools: {
              color: "error",
              track: currentTrack,
              trackGroup: "Scheduler \u269B",
              tooltipText: passive ? "Remaining Effects Errored" : "Commit Errored",
              properties
            }
          }
        }, debugTask ? debugTask.run(performance.measure.bind(performance, "Errored", startTime)) : performance.measure("Errored", startTime);
      }
    }
    function disabledLog() {}
    function disableLogs() {
      if (disabledDepth === 0) {
        prevLog = console.log, prevInfo = console.info, prevWarn = console.warn, prevError = console.error, prevGroup = console.group, prevGroupCollapsed = console.groupCollapsed, prevGroupEnd = console.groupEnd;
        var props = {
          configurable: !0,
          enumerable: !0,
          value: disabledLog,
          writable: !0
        };
        Object.defineProperties(console, {
          info: props,
          log: props,
          warn: props,
          error: props,
          group: props,
          groupCollapsed: props,
          groupEnd: props
        });
      }
      disabledDepth++;
    }
    function reenableLogs() {
      if (disabledDepth--, disabledDepth === 0) {
        var props = { configurable: !0, enumerable: !0, writable: !0 };
        Object.defineProperties(console, {
          log: assign({}, props, { value: prevLog }),
          info: assign({}, props, { value: prevInfo }),
          warn: assign({}, props, { value: prevWarn }),
          error: assign({}, props, { value: prevError }),
          group: assign({}, props, { value: prevGroup }),
          groupCollapsed: assign({}, props, { value: prevGroupCollapsed }),
          groupEnd: assign({}, props, { value: prevGroupEnd })
        });
      }
      0 > disabledDepth && console.error("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
    }
    function formatOwnerStack(error44) {
      var prevPrepareStackTrace = Error.prepareStackTrace;
      if (Error.prepareStackTrace = void 0, error44 = error44.stack, Error.prepareStackTrace = prevPrepareStackTrace, error44.startsWith(`Error: react-stack-top-frame
`) && (error44 = error44.slice(29)), prevPrepareStackTrace = error44.indexOf(`
`), prevPrepareStackTrace !== -1 && (error44 = error44.slice(prevPrepareStackTrace + 1)), prevPrepareStackTrace = error44.indexOf("react_stack_bottom_frame"), prevPrepareStackTrace !== -1 && (prevPrepareStackTrace = error44.lastIndexOf(`
`, prevPrepareStackTrace)), prevPrepareStackTrace !== -1)
        error44 = error44.slice(0, prevPrepareStackTrace);
      else
        return "";
      return error44;
    }
    function describeBuiltInComponentFrame(name3) {
      if (prefix === void 0)
        try {
          throw Error();
        } catch (x3) {
          var match = x3.stack.trim().match(/\n( *(at )?)/);
          prefix = match && match[1] || "", suffix = -1 < x3.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < x3.stack.indexOf("@") ? "@unknown:0:0" : "";
        }
      return `
` + prefix + name3 + suffix;
    }
    function describeNativeComponentFrame(fn, construct) {
      if (!fn || reentry)
        return "";
      var frame = componentFrameCache.get(fn);
      if (frame !== void 0)
        return frame;
      reentry = !0, frame = Error.prepareStackTrace, Error.prepareStackTrace = void 0;
      var previousDispatcher = null;
      previousDispatcher = ReactSharedInternals.H, ReactSharedInternals.H = null, disableLogs();
      try {
        var RunInRootFrame = {
          DetermineComponentFrameRoot: function() {
            try {
              if (construct) {
                var Fake = function() {
                  throw Error();
                };
                if (Object.defineProperty(Fake.prototype, "props", {
                  set: function() {
                    throw Error();
                  }
                }), typeof Reflect === "object" && Reflect.construct) {
                  try {
                    Reflect.construct(Fake, []);
                  } catch (x3) {
                    var control = x3;
                  }
                  Reflect.construct(fn, [], Fake);
                } else {
                  try {
                    Fake.call();
                  } catch (x$0) {
                    control = x$0;
                  }
                  fn.call(Fake.prototype);
                }
              } else {
                try {
                  throw Error();
                } catch (x$1) {
                  control = x$1;
                }
                (Fake = fn()) && typeof Fake.catch === "function" && Fake.catch(function() {});
              }
            } catch (sample) {
              if (sample && control && typeof sample.stack === "string")
                return [sample.stack, control.stack];
            }
            return [null, null];
          }
        };
        RunInRootFrame.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
        var namePropDescriptor = Object.getOwnPropertyDescriptor(RunInRootFrame.DetermineComponentFrameRoot, "name");
        namePropDescriptor && namePropDescriptor.configurable && Object.defineProperty(RunInRootFrame.DetermineComponentFrameRoot, "name", { value: "DetermineComponentFrameRoot" });
        var _RunInRootFrame$Deter = RunInRootFrame.DetermineComponentFrameRoot(), sampleStack = _RunInRootFrame$Deter[0], controlStack = _RunInRootFrame$Deter[1];
        if (sampleStack && controlStack) {
          var sampleLines = sampleStack.split(`
`), controlLines = controlStack.split(`
`);
          for (_RunInRootFrame$Deter = namePropDescriptor = 0;namePropDescriptor < sampleLines.length && !sampleLines[namePropDescriptor].includes("DetermineComponentFrameRoot"); )
            namePropDescriptor++;
          for (;_RunInRootFrame$Deter < controlLines.length && !controlLines[_RunInRootFrame$Deter].includes("DetermineComponentFrameRoot"); )
            _RunInRootFrame$Deter++;
          if (namePropDescriptor === sampleLines.length || _RunInRootFrame$Deter === controlLines.length)
            for (namePropDescriptor = sampleLines.length - 1, _RunInRootFrame$Deter = controlLines.length - 1;1 <= namePropDescriptor && 0 <= _RunInRootFrame$Deter && sampleLines[namePropDescriptor] !== controlLines[_RunInRootFrame$Deter]; )
              _RunInRootFrame$Deter--;
          for (;1 <= namePropDescriptor && 0 <= _RunInRootFrame$Deter; namePropDescriptor--, _RunInRootFrame$Deter--)
            if (sampleLines[namePropDescriptor] !== controlLines[_RunInRootFrame$Deter]) {
              if (namePropDescriptor !== 1 || _RunInRootFrame$Deter !== 1)
                do
                  if (namePropDescriptor--, _RunInRootFrame$Deter--, 0 > _RunInRootFrame$Deter || sampleLines[namePropDescriptor] !== controlLines[_RunInRootFrame$Deter]) {
                    var _frame = `
` + sampleLines[namePropDescriptor].replace(" at new ", " at ");
                    return fn.displayName && _frame.includes("<anonymous>") && (_frame = _frame.replace("<anonymous>", fn.displayName)), typeof fn === "function" && componentFrameCache.set(fn, _frame), _frame;
                  }
                while (1 <= namePropDescriptor && 0 <= _RunInRootFrame$Deter);
              break;
            }
        }
      } finally {
        reentry = !1, ReactSharedInternals.H = previousDispatcher, reenableLogs(), Error.prepareStackTrace = frame;
      }
      return sampleLines = (sampleLines = fn ? fn.displayName || fn.name : "") ? describeBuiltInComponentFrame(sampleLines) : "", typeof fn === "function" && componentFrameCache.set(fn, sampleLines), sampleLines;
    }
    function describeFiber(fiber, childFiber) {
      switch (fiber.tag) {
        case 26:
        case 27:
        case 5:
          return describeBuiltInComponentFrame(fiber.type);
        case 16:
          return describeBuiltInComponentFrame("Lazy");
        case 13:
          return fiber.child !== childFiber && childFiber !== null ? describeBuiltInComponentFrame("Suspense Fallback") : describeBuiltInComponentFrame("Suspense");
        case 19:
          return describeBuiltInComponentFrame("SuspenseList");
        case 0:
        case 15:
          return describeNativeComponentFrame(fiber.type, !1);
        case 11:
          return describeNativeComponentFrame(fiber.type.render, !1);
        case 1:
          return describeNativeComponentFrame(fiber.type, !0);
        case 31:
          return describeBuiltInComponentFrame("Activity");
        default:
          return "";
      }
    }
    function getStackByFiberInDevAndProd(workInProgress2) {
      try {
        var info = "", previous = null;
        do {
          info += describeFiber(workInProgress2, previous);
          var debugInfo = workInProgress2._debugInfo;
          if (debugInfo)
            for (var i4 = debugInfo.length - 1;0 <= i4; i4--) {
              var entry = debugInfo[i4];
              if (typeof entry.name === "string") {
                var JSCompiler_temp_const = info;
                a: {
                  var { name: name3, env: env5, debugLocation: location } = entry;
                  if (location != null) {
                    var childStack = formatOwnerStack(location), idx = childStack.lastIndexOf(`
`), lastLine = idx === -1 ? childStack : childStack.slice(idx + 1);
                    if (lastLine.indexOf(name3) !== -1) {
                      var JSCompiler_inline_result = `
` + lastLine;
                      break a;
                    }
                  }
                  JSCompiler_inline_result = describeBuiltInComponentFrame(name3 + (env5 ? " [" + env5 + "]" : ""));
                }
                info = JSCompiler_temp_const + JSCompiler_inline_result;
              }
            }
          previous = workInProgress2, workInProgress2 = workInProgress2.return;
        } while (workInProgress2);
        return info;
      } catch (x3) {
        return `
Error generating stack: ` + x3.message + `
` + x3.stack;
      }
    }
    function describeFunctionComponentFrameWithoutLineNumber(fn) {
      return (fn = fn ? fn.displayName || fn.name : "") ? describeBuiltInComponentFrame(fn) : "";
    }
    function createCapturedValueAtFiber(value, source) {
      if (typeof value === "object" && value !== null) {
        var existing = CapturedStacks.get(value);
        if (existing !== void 0)
          return existing;
        return source = {
          value,
          source,
          stack: getStackByFiberInDevAndProd(source)
        }, CapturedStacks.set(value, source), source;
      }
      return {
        value,
        source,
        stack: getStackByFiberInDevAndProd(source)
      };
    }
    function pushTreeFork(workInProgress2, totalChildren) {
      warnIfNotHydrating(), forkStack[forkStackIndex++] = treeForkCount, forkStack[forkStackIndex++] = treeForkProvider, treeForkProvider = workInProgress2, treeForkCount = totalChildren;
    }
    function pushTreeId(workInProgress2, totalChildren, index) {
      warnIfNotHydrating(), idStack[idStackIndex++] = treeContextId, idStack[idStackIndex++] = treeContextOverflow, idStack[idStackIndex++] = treeContextProvider, treeContextProvider = workInProgress2;
      var baseIdWithLeadingBit = treeContextId;
      workInProgress2 = treeContextOverflow;
      var baseLength = 32 - clz32(baseIdWithLeadingBit) - 1;
      baseIdWithLeadingBit &= ~(1 << baseLength), index += 1;
      var length = 32 - clz32(totalChildren) + baseLength;
      if (30 < length) {
        var numberOfOverflowBits = baseLength - baseLength % 5;
        length = (baseIdWithLeadingBit & (1 << numberOfOverflowBits) - 1).toString(32), baseIdWithLeadingBit >>= numberOfOverflowBits, baseLength -= numberOfOverflowBits, treeContextId = 1 << 32 - clz32(totalChildren) + baseLength | index << baseLength | baseIdWithLeadingBit, treeContextOverflow = length + workInProgress2;
      } else
        treeContextId = 1 << length | index << baseLength | baseIdWithLeadingBit, treeContextOverflow = workInProgress2;
    }
    function pushMaterializedTreeId(workInProgress2) {
      warnIfNotHydrating(), workInProgress2.return !== null && (pushTreeFork(workInProgress2, 1), pushTreeId(workInProgress2, 1, 0));
    }
    function popTreeContext(workInProgress2) {
      for (;workInProgress2 === treeForkProvider; )
        treeForkProvider = forkStack[--forkStackIndex], forkStack[forkStackIndex] = null, treeForkCount = forkStack[--forkStackIndex], forkStack[forkStackIndex] = null;
      for (;workInProgress2 === treeContextProvider; )
        treeContextProvider = idStack[--idStackIndex], idStack[idStackIndex] = null, treeContextOverflow = idStack[--idStackIndex], idStack[idStackIndex] = null, treeContextId = idStack[--idStackIndex], idStack[idStackIndex] = null;
    }
    function getSuspendedTreeContext() {
      return warnIfNotHydrating(), treeContextProvider !== null ? { id: treeContextId, overflow: treeContextOverflow } : null;
    }
    function restoreSuspendedTreeContext(workInProgress2, suspendedContext) {
      warnIfNotHydrating(), idStack[idStackIndex++] = treeContextId, idStack[idStackIndex++] = treeContextOverflow, idStack[idStackIndex++] = treeContextProvider, treeContextId = suspendedContext.id, treeContextOverflow = suspendedContext.overflow, treeContextProvider = workInProgress2;
    }
    function warnIfNotHydrating() {
      isHydrating || console.error("Expected to be hydrating. This is a bug in React. Please file an issue.");
    }
    function requiredContext(c3) {
      return c3 === null && console.error("Expected host context to exist. This error is likely caused by a bug in React. Please file an issue."), c3;
    }
    function pushHostContainer(fiber, nextRootInstance) {
      push(rootInstanceStackCursor, nextRootInstance, fiber), push(contextFiberStackCursor, fiber, fiber), push(contextStackCursor, null, fiber), nextRootInstance = getRootHostContext(nextRootInstance), pop(contextStackCursor, fiber), push(contextStackCursor, nextRootInstance, fiber);
    }
    function popHostContainer(fiber) {
      pop(contextStackCursor, fiber), pop(contextFiberStackCursor, fiber), pop(rootInstanceStackCursor, fiber);
    }
    function getHostContext() {
      return requiredContext(contextStackCursor.current);
    }
    function pushHostContext(fiber) {
      fiber.memoizedState !== null && push(hostTransitionProviderCursor, fiber, fiber);
      var context3 = requiredContext(contextStackCursor.current), nextContext = getChildHostContext(context3, fiber.type);
      context3 !== nextContext && (push(contextFiberStackCursor, fiber, fiber), push(contextStackCursor, nextContext, fiber));
    }
    function popHostContext(fiber) {
      contextFiberStackCursor.current === fiber && (pop(contextStackCursor, fiber), pop(contextFiberStackCursor, fiber)), hostTransitionProviderCursor.current === fiber && (pop(hostTransitionProviderCursor, fiber), isPrimaryRenderer ? HostTransitionContext._currentValue = NotPendingTransition : HostTransitionContext._currentValue2 = NotPendingTransition);
    }
    function findNotableNode(node, indent) {
      return node.serverProps === void 0 && node.serverTail.length === 0 && node.children.length === 1 && 3 < node.distanceFromLeaf && node.distanceFromLeaf > 15 - indent ? findNotableNode(node.children[0], indent) : node;
    }
    function indentation(indent) {
      return "  " + "  ".repeat(indent);
    }
    function added(indent) {
      return "+ " + "  ".repeat(indent);
    }
    function removed(indent) {
      return "- " + "  ".repeat(indent);
    }
    function describeFiberType(fiber) {
      switch (fiber.tag) {
        case 26:
        case 27:
        case 5:
          return fiber.type;
        case 16:
          return "Lazy";
        case 31:
          return "Activity";
        case 13:
          return "Suspense";
        case 19:
          return "SuspenseList";
        case 0:
        case 15:
          return fiber = fiber.type, fiber.displayName || fiber.name || null;
        case 11:
          return fiber = fiber.type.render, fiber.displayName || fiber.name || null;
        case 1:
          return fiber = fiber.type, fiber.displayName || fiber.name || null;
        default:
          return null;
      }
    }
    function describeTextNode(content, maxLength) {
      return needsEscaping.test(content) ? (content = JSON.stringify(content), content.length > maxLength - 2 ? 8 > maxLength ? '{"..."}' : "{" + content.slice(0, maxLength - 7) + '..."}' : "{" + content + "}") : content.length > maxLength ? 5 > maxLength ? '{"..."}' : content.slice(0, maxLength - 3) + "..." : content;
    }
    function describeTextDiff(clientText, serverProps, indent) {
      var maxLength = 120 - 2 * indent;
      if (serverProps === null)
        return added(indent) + describeTextNode(clientText, maxLength) + `
`;
      if (typeof serverProps === "string") {
        for (var firstDiff = 0;firstDiff < serverProps.length && firstDiff < clientText.length && serverProps.charCodeAt(firstDiff) === clientText.charCodeAt(firstDiff); firstDiff++)
          ;
        return firstDiff > maxLength - 8 && 10 < firstDiff && (clientText = "..." + clientText.slice(firstDiff - 8), serverProps = "..." + serverProps.slice(firstDiff - 8)), added(indent) + describeTextNode(clientText, maxLength) + `
` + removed(indent) + describeTextNode(serverProps, maxLength) + `
`;
      }
      return indentation(indent) + describeTextNode(clientText, maxLength) + `
`;
    }
    function objectName(object2) {
      return Object.prototype.toString.call(object2).replace(/^\[object (.*)\]$/, function(m4, p0) {
        return p0;
      });
    }
    function describeValue(value, maxLength) {
      switch (typeof value) {
        case "string":
          return value = JSON.stringify(value), value.length > maxLength ? 5 > maxLength ? '"..."' : value.slice(0, maxLength - 4) + '..."' : value;
        case "object":
          if (value === null)
            return "null";
          if (isArrayImpl(value))
            return "[...]";
          if (value.$$typeof === REACT_ELEMENT_TYPE)
            return (maxLength = getComponentNameFromType(value.type)) ? "<" + maxLength + ">" : "<...>";
          var name3 = objectName(value);
          if (name3 === "Object") {
            name3 = "", maxLength -= 2;
            for (var propName in value)
              if (value.hasOwnProperty(propName)) {
                var jsonPropName = JSON.stringify(propName);
                if (jsonPropName !== '"' + propName + '"' && (propName = jsonPropName), maxLength -= propName.length - 2, jsonPropName = describeValue(value[propName], 15 > maxLength ? maxLength : 15), maxLength -= jsonPropName.length, 0 > maxLength) {
                  name3 += name3 === "" ? "..." : ", ...";
                  break;
                }
                name3 += (name3 === "" ? "" : ",") + propName + ":" + jsonPropName;
              }
            return "{" + name3 + "}";
          }
          return name3;
        case "function":
          return (maxLength = value.displayName || value.name) ? "function " + maxLength : "function";
        default:
          return String(value);
      }
    }
    function describePropValue(value, maxLength) {
      return typeof value !== "string" || needsEscaping.test(value) ? "{" + describeValue(value, maxLength - 2) + "}" : value.length > maxLength - 2 ? 5 > maxLength ? '"..."' : '"' + value.slice(0, maxLength - 5) + '..."' : '"' + value + '"';
    }
    function describeExpandedElement(type, props, rowPrefix) {
      var remainingRowLength = 120 - rowPrefix.length - type.length, properties = [], propName;
      for (propName in props)
        if (props.hasOwnProperty(propName) && propName !== "children") {
          var propValue = describePropValue(props[propName], 120 - rowPrefix.length - propName.length - 1);
          remainingRowLength -= propName.length + propValue.length + 2, properties.push(propName + "=" + propValue);
        }
      return properties.length === 0 ? rowPrefix + "<" + type + `>
` : 0 < remainingRowLength ? rowPrefix + "<" + type + " " + properties.join(" ") + `>
` : rowPrefix + "<" + type + `
` + rowPrefix + "  " + properties.join(`
` + rowPrefix + "  ") + `
` + rowPrefix + `>
`;
    }
    function describePropertiesDiff(clientObject, serverObject, indent) {
      var properties = "", remainingServerProperties = assign({}, serverObject), propName;
      for (propName in clientObject)
        if (clientObject.hasOwnProperty(propName)) {
          delete remainingServerProperties[propName];
          var maxLength = 120 - 2 * indent - propName.length - 2, clientPropValue = describeValue(clientObject[propName], maxLength);
          serverObject.hasOwnProperty(propName) ? (maxLength = describeValue(serverObject[propName], maxLength), properties += added(indent) + propName + ": " + clientPropValue + `
`, properties += removed(indent) + propName + ": " + maxLength + `
`) : properties += added(indent) + propName + ": " + clientPropValue + `
`;
        }
      for (var _propName in remainingServerProperties)
        remainingServerProperties.hasOwnProperty(_propName) && (clientObject = describeValue(remainingServerProperties[_propName], 120 - 2 * indent - _propName.length - 2), properties += removed(indent) + _propName + ": " + clientObject + `
`);
      return properties;
    }
    function describeElementDiff(type, clientProps, serverProps, indent) {
      var content = "", serverPropNames = /* @__PURE__ */ new Map;
      for (propName$jscomp$0 in serverProps)
        serverProps.hasOwnProperty(propName$jscomp$0) && serverPropNames.set(propName$jscomp$0.toLowerCase(), propName$jscomp$0);
      if (serverPropNames.size === 1 && serverPropNames.has("children"))
        content += describeExpandedElement(type, clientProps, indentation(indent));
      else {
        for (var _propName2 in clientProps)
          if (clientProps.hasOwnProperty(_propName2) && _propName2 !== "children") {
            var maxLength$jscomp$0 = 120 - 2 * (indent + 1) - _propName2.length - 1, serverPropName = serverPropNames.get(_propName2.toLowerCase());
            if (serverPropName !== void 0) {
              serverPropNames.delete(_propName2.toLowerCase());
              var propName$jscomp$0 = clientProps[_propName2];
              serverPropName = serverProps[serverPropName];
              var clientPropValue = describePropValue(propName$jscomp$0, maxLength$jscomp$0);
              maxLength$jscomp$0 = describePropValue(serverPropName, maxLength$jscomp$0), typeof propName$jscomp$0 === "object" && propName$jscomp$0 !== null && typeof serverPropName === "object" && serverPropName !== null && objectName(propName$jscomp$0) === "Object" && objectName(serverPropName) === "Object" && (2 < Object.keys(propName$jscomp$0).length || 2 < Object.keys(serverPropName).length || -1 < clientPropValue.indexOf("...") || -1 < maxLength$jscomp$0.indexOf("...")) ? content += indentation(indent + 1) + _propName2 + `={{
` + describePropertiesDiff(propName$jscomp$0, serverPropName, indent + 2) + indentation(indent + 1) + `}}
` : (content += added(indent + 1) + _propName2 + "=" + clientPropValue + `
`, content += removed(indent + 1) + _propName2 + "=" + maxLength$jscomp$0 + `
`);
            } else
              content += indentation(indent + 1) + _propName2 + "=" + describePropValue(clientProps[_propName2], maxLength$jscomp$0) + `
`;
          }
        serverPropNames.forEach(function(propName) {
          if (propName !== "children") {
            var maxLength = 120 - 2 * (indent + 1) - propName.length - 1;
            content += removed(indent + 1) + propName + "=" + describePropValue(serverProps[propName], maxLength) + `
`;
          }
        }), content = content === "" ? indentation(indent) + "<" + type + `>
` : indentation(indent) + "<" + type + `
` + content + indentation(indent) + `>
`;
      }
      if (type = serverProps.children, clientProps = clientProps.children, typeof type === "string" || typeof type === "number" || typeof type === "bigint") {
        if (serverPropNames = "", typeof clientProps === "string" || typeof clientProps === "number" || typeof clientProps === "bigint")
          serverPropNames = "" + clientProps;
        content += describeTextDiff(serverPropNames, "" + type, indent + 1);
      } else if (typeof clientProps === "string" || typeof clientProps === "number" || typeof clientProps === "bigint")
        content = type == null ? content + describeTextDiff("" + clientProps, null, indent + 1) : content + describeTextDiff("" + clientProps, void 0, indent + 1);
      return content;
    }
    function describeSiblingFiber(fiber, indent) {
      var type = describeFiberType(fiber);
      if (type === null) {
        type = "";
        for (fiber = fiber.child;fiber; )
          type += describeSiblingFiber(fiber, indent), fiber = fiber.sibling;
        return type;
      }
      return indentation(indent) + "<" + type + `>
`;
    }
    function describeNode(node, indent) {
      var skipToNode = findNotableNode(node, indent);
      if (skipToNode !== node && (node.children.length !== 1 || node.children[0] !== skipToNode))
        return indentation(indent) + `...
` + describeNode(skipToNode, indent + 1);
      skipToNode = "";
      var debugInfo = node.fiber._debugInfo;
      if (debugInfo)
        for (var i4 = 0;i4 < debugInfo.length; i4++) {
          var serverComponentName = debugInfo[i4].name;
          typeof serverComponentName === "string" && (skipToNode += indentation(indent) + "<" + serverComponentName + `>
`, indent++);
        }
      if (debugInfo = "", i4 = node.fiber.pendingProps, node.fiber.tag === 6)
        debugInfo = describeTextDiff(i4, node.serverProps, indent), indent++;
      else if (serverComponentName = describeFiberType(node.fiber), serverComponentName !== null)
        if (node.serverProps === void 0) {
          debugInfo = indent;
          var maxLength = 120 - 2 * debugInfo - serverComponentName.length - 2, content = "";
          for (propName in i4)
            if (i4.hasOwnProperty(propName) && propName !== "children") {
              var propValue = describePropValue(i4[propName], 15);
              if (maxLength -= propName.length + propValue.length + 2, 0 > maxLength) {
                content += " ...";
                break;
              }
              content += " " + propName + "=" + propValue;
            }
          debugInfo = indentation(debugInfo) + "<" + serverComponentName + content + `>
`, indent++;
        } else
          node.serverProps === null ? (debugInfo = describeExpandedElement(serverComponentName, i4, added(indent)), indent++) : typeof node.serverProps === "string" ? console.error("Should not have matched a non HostText fiber to a Text node. This is a bug in React.") : (debugInfo = describeElementDiff(serverComponentName, i4, node.serverProps, indent), indent++);
      var propName = "";
      i4 = node.fiber.child;
      for (serverComponentName = 0;i4 && serverComponentName < node.children.length; )
        maxLength = node.children[serverComponentName], maxLength.fiber === i4 ? (propName += describeNode(maxLength, indent), serverComponentName++) : propName += describeSiblingFiber(i4, indent), i4 = i4.sibling;
      i4 && 0 < node.children.length && (propName += indentation(indent) + `...
`), i4 = node.serverTail, node.serverProps === null && indent--;
      for (node = 0;node < i4.length; node++)
        serverComponentName = i4[node], propName = typeof serverComponentName === "string" ? propName + (removed(indent) + describeTextNode(serverComponentName, 120 - 2 * indent) + `
`) : propName + describeExpandedElement(serverComponentName.type, serverComponentName.props, removed(indent));
      return skipToNode + debugInfo + propName;
    }
    function describeDiff(rootNode) {
      try {
        return `

` + describeNode(rootNode, 0);
      } catch (x3) {
        return "";
      }
    }
    function getCurrentFiberStackInDev() {
      if (current === null)
        return "";
      var workInProgress2 = current;
      try {
        var info = "";
        switch (workInProgress2.tag === 6 && (workInProgress2 = workInProgress2.return), workInProgress2.tag) {
          case 26:
          case 27:
          case 5:
            info += describeBuiltInComponentFrame(workInProgress2.type);
            break;
          case 13:
            info += describeBuiltInComponentFrame("Suspense");
            break;
          case 19:
            info += describeBuiltInComponentFrame("SuspenseList");
            break;
          case 31:
            info += describeBuiltInComponentFrame("Activity");
            break;
          case 30:
          case 0:
          case 15:
          case 1:
            workInProgress2._debugOwner || info !== "" || (info += describeFunctionComponentFrameWithoutLineNumber(workInProgress2.type));
            break;
          case 11:
            workInProgress2._debugOwner || info !== "" || (info += describeFunctionComponentFrameWithoutLineNumber(workInProgress2.type.render));
        }
        for (;workInProgress2; )
          if (typeof workInProgress2.tag === "number") {
            var fiber = workInProgress2;
            workInProgress2 = fiber._debugOwner;
            var debugStack = fiber._debugStack;
            if (workInProgress2 && debugStack) {
              var formattedStack = formatOwnerStack(debugStack);
              formattedStack !== "" && (info += `
` + formattedStack);
            }
          } else if (workInProgress2.debugStack != null) {
            var ownerStack = workInProgress2.debugStack;
            (workInProgress2 = workInProgress2.owner) && ownerStack && (info += `
` + formatOwnerStack(ownerStack));
          } else
            break;
        var JSCompiler_inline_result = info;
      } catch (x3) {
        JSCompiler_inline_result = `
Error generating stack: ` + x3.message + `
` + x3.stack;
      }
      return JSCompiler_inline_result;
    }
    function runWithFiberInDEV(fiber, callback, arg0, arg1, arg2, arg3, arg4) {
      var previousFiber = current;
      setCurrentFiber(fiber);
      try {
        return fiber !== null && fiber._debugTask ? fiber._debugTask.run(callback.bind(null, arg0, arg1, arg2, arg3, arg4)) : callback(arg0, arg1, arg2, arg3, arg4);
      } finally {
        setCurrentFiber(previousFiber);
      }
      throw Error("runWithFiberInDEV should never be called in production. This is a bug in React.");
    }
    function setCurrentFiber(fiber) {
      ReactSharedInternals.getCurrentStack = fiber === null ? null : getCurrentFiberStackInDev, isRendering = !1, current = fiber;
    }
    function buildHydrationDiffNode(fiber, distanceFromLeaf) {
      if (fiber.return === null) {
        if (hydrationDiffRootDEV === null)
          hydrationDiffRootDEV = {
            fiber,
            children: [],
            serverProps: void 0,
            serverTail: [],
            distanceFromLeaf
          };
        else {
          if (hydrationDiffRootDEV.fiber !== fiber)
            throw Error("Saw multiple hydration diff roots in a pass. This is a bug in React.");
          hydrationDiffRootDEV.distanceFromLeaf > distanceFromLeaf && (hydrationDiffRootDEV.distanceFromLeaf = distanceFromLeaf);
        }
        return hydrationDiffRootDEV;
      }
      var siblings = buildHydrationDiffNode(fiber.return, distanceFromLeaf + 1).children;
      if (0 < siblings.length && siblings[siblings.length - 1].fiber === fiber)
        return siblings = siblings[siblings.length - 1], siblings.distanceFromLeaf > distanceFromLeaf && (siblings.distanceFromLeaf = distanceFromLeaf), siblings;
      return distanceFromLeaf = {
        fiber,
        children: [],
        serverProps: void 0,
        serverTail: [],
        distanceFromLeaf
      }, siblings.push(distanceFromLeaf), distanceFromLeaf;
    }
    function warnIfHydrating() {
      isHydrating && console.error("We should not be hydrating here. This is a bug in React. Please file a bug.");
    }
    function warnNonHydratedInstance(fiber, rejectedCandidate) {
      didSuspendOrErrorDEV || (fiber = buildHydrationDiffNode(fiber, 0), fiber.serverProps = null, rejectedCandidate !== null && (rejectedCandidate = describeHydratableInstanceForDevWarnings(rejectedCandidate), fiber.serverTail.push(rejectedCandidate)));
    }
    function throwOnHydrationMismatch(fiber) {
      var fromText = 1 < arguments.length && arguments[1] !== void 0 ? arguments[1] : !1, diff = "", diffRoot = hydrationDiffRootDEV;
      throw diffRoot !== null && (hydrationDiffRootDEV = null, diff = describeDiff(diffRoot)), queueHydrationError(createCapturedValueAtFiber(Error("Hydration failed because the server rendered " + (fromText ? "text" : "HTML") + ` didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:

- A server/client branch \`if (typeof window !== 'undefined')\`.
- Variable input such as \`Date.now()\` or \`Math.random()\` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

https://react.dev/link/hydration-mismatch` + diff), fiber)), HydrationMismatchException;
    }
    function prepareToHydrateHostInstance(fiber, hostContext) {
      if (!supportsHydration)
        throw Error("Expected prepareToHydrateHostInstance() to never be called. This error is likely caused by a bug in React. Please file an issue.");
      hydrateInstance(fiber.stateNode, fiber.type, fiber.memoizedProps, hostContext, fiber) || throwOnHydrationMismatch(fiber, !0);
    }
    function popToNextHostParent(fiber) {
      for (hydrationParentFiber = fiber.return;hydrationParentFiber; )
        switch (hydrationParentFiber.tag) {
          case 5:
          case 31:
          case 13:
            rootOrSingletonContext = !1;
            return;
          case 27:
          case 3:
            rootOrSingletonContext = !0;
            return;
          default:
            hydrationParentFiber = hydrationParentFiber.return;
        }
    }
    function popHydrationState(fiber) {
      if (!supportsHydration || fiber !== hydrationParentFiber)
        return !1;
      if (!isHydrating)
        return popToNextHostParent(fiber), isHydrating = !0, !1;
      var tag = fiber.tag;
      if (supportsSingletons ? tag !== 3 && tag !== 27 && (tag !== 5 || shouldDeleteUnhydratedTailInstances(fiber.type) && !shouldSetTextContent(fiber.type, fiber.memoizedProps)) && nextHydratableInstance && (warnIfUnhydratedTailNodes(fiber), throwOnHydrationMismatch(fiber)) : tag !== 3 && (tag !== 5 || shouldDeleteUnhydratedTailInstances(fiber.type) && !shouldSetTextContent(fiber.type, fiber.memoizedProps)) && nextHydratableInstance && (warnIfUnhydratedTailNodes(fiber), throwOnHydrationMismatch(fiber)), popToNextHostParent(fiber), tag === 13) {
        if (!supportsHydration)
          throw Error("Expected skipPastDehydratedSuspenseInstance() to never be called. This error is likely caused by a bug in React. Please file an issue.");
        if (fiber = fiber.memoizedState, fiber = fiber !== null ? fiber.dehydrated : null, !fiber)
          throw Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
        nextHydratableInstance = getNextHydratableInstanceAfterSuspenseInstance(fiber);
      } else if (tag === 31) {
        if (fiber = fiber.memoizedState, fiber = fiber !== null ? fiber.dehydrated : null, !fiber)
          throw Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
        nextHydratableInstance = getNextHydratableInstanceAfterActivityInstance(fiber);
      } else
        nextHydratableInstance = supportsSingletons && tag === 27 ? getNextHydratableSiblingAfterSingleton(fiber.type, nextHydratableInstance) : hydrationParentFiber ? getNextHydratableSibling(fiber.stateNode) : null;
      return !0;
    }
    function warnIfUnhydratedTailNodes(fiber) {
      for (var nextInstance = nextHydratableInstance;nextInstance; ) {
        var diffNode = buildHydrationDiffNode(fiber, 0), description = describeHydratableInstanceForDevWarnings(nextInstance);
        diffNode.serverTail.push(description), nextInstance = description.type === "Suspense" ? getNextHydratableInstanceAfterSuspenseInstance(nextInstance) : getNextHydratableSibling(nextInstance);
      }
    }
    function resetHydrationState() {
      supportsHydration && (nextHydratableInstance = hydrationParentFiber = null, didSuspendOrErrorDEV = isHydrating = !1);
    }
    function upgradeHydrationErrorsToRecoverable() {
      var queuedErrors = hydrationErrors;
      return queuedErrors !== null && (workInProgressRootRecoverableErrors === null ? workInProgressRootRecoverableErrors = queuedErrors : workInProgressRootRecoverableErrors.push.apply(workInProgressRootRecoverableErrors, queuedErrors), hydrationErrors = null), queuedErrors;
    }
    function queueHydrationError(error44) {
      hydrationErrors === null ? hydrationErrors = [error44] : hydrationErrors.push(error44);
    }
    function emitPendingHydrationWarnings() {
      var diffRoot = hydrationDiffRootDEV;
      if (diffRoot !== null) {
        hydrationDiffRootDEV = null;
        for (var diff = describeDiff(diffRoot);0 < diffRoot.children.length; )
          diffRoot = diffRoot.children[0];
        runWithFiberInDEV(diffRoot.fiber, function() {
          console.error(`A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up. This can happen if a SSR-ed Client Component used:

- A server/client branch \`if (typeof window !== 'undefined')\`.
- Variable input such as \`Date.now()\` or \`Math.random()\` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

%s%s`, "https://react.dev/link/hydration-mismatch", diff);
        });
      }
    }
    function resetContextDependencies() {
      lastContextDependency = currentlyRenderingFiber$1 = null, isDisallowedContextReadInDEV = !1;
    }
    function pushProvider(providerFiber, context3, nextValue) {
      isPrimaryRenderer ? (push(valueCursor, context3._currentValue, providerFiber), context3._currentValue = nextValue, push(rendererCursorDEV, context3._currentRenderer, providerFiber), context3._currentRenderer !== void 0 && context3._currentRenderer !== null && context3._currentRenderer !== rendererSigil && console.error("Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported."), context3._currentRenderer = rendererSigil) : (push(valueCursor, context3._currentValue2, providerFiber), context3._currentValue2 = nextValue, push(renderer2CursorDEV, context3._currentRenderer2, providerFiber), context3._currentRenderer2 !== void 0 && context3._currentRenderer2 !== null && context3._currentRenderer2 !== rendererSigil && console.error("Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported."), context3._currentRenderer2 = rendererSigil);
    }
    function popProvider(context3, providerFiber) {
      var currentValue = valueCursor.current;
      isPrimaryRenderer ? (context3._currentValue = currentValue, currentValue = rendererCursorDEV.current, pop(rendererCursorDEV, providerFiber), context3._currentRenderer = currentValue) : (context3._currentValue2 = currentValue, currentValue = renderer2CursorDEV.current, pop(renderer2CursorDEV, providerFiber), context3._currentRenderer2 = currentValue), pop(valueCursor, providerFiber);
    }
    function scheduleContextWorkOnParentPath(parent, renderLanes2, propagationRoot) {
      for (;parent !== null; ) {
        var alternate = parent.alternate;
        if ((parent.childLanes & renderLanes2) !== renderLanes2 ? (parent.childLanes |= renderLanes2, alternate !== null && (alternate.childLanes |= renderLanes2)) : alternate !== null && (alternate.childLanes & renderLanes2) !== renderLanes2 && (alternate.childLanes |= renderLanes2), parent === propagationRoot)
          break;
        parent = parent.return;
      }
      parent !== propagationRoot && console.error("Expected to find the propagation root when scheduling context work. This error is likely caused by a bug in React. Please file an issue.");
    }
    function propagateContextChanges(workInProgress2, contexts, renderLanes2, forcePropagateEntireTree) {
      var fiber = workInProgress2.child;
      fiber !== null && (fiber.return = workInProgress2);
      for (;fiber !== null; ) {
        var list = fiber.dependencies;
        if (list !== null) {
          var nextFiber = fiber.child;
          list = list.firstContext;
          a:
            for (;list !== null; ) {
              var dependency = list;
              list = fiber;
              for (var i4 = 0;i4 < contexts.length; i4++)
                if (dependency.context === contexts[i4]) {
                  list.lanes |= renderLanes2, dependency = list.alternate, dependency !== null && (dependency.lanes |= renderLanes2), scheduleContextWorkOnParentPath(list.return, renderLanes2, workInProgress2), forcePropagateEntireTree || (nextFiber = null);
                  break a;
                }
              list = dependency.next;
            }
        } else if (fiber.tag === 18) {
          if (nextFiber = fiber.return, nextFiber === null)
            throw Error("We just came from a parent so we must have had a parent. This is a bug in React.");
          nextFiber.lanes |= renderLanes2, list = nextFiber.alternate, list !== null && (list.lanes |= renderLanes2), scheduleContextWorkOnParentPath(nextFiber, renderLanes2, workInProgress2), nextFiber = null;
        } else
          nextFiber = fiber.child;
        if (nextFiber !== null)
          nextFiber.return = fiber;
        else
          for (nextFiber = fiber;nextFiber !== null; ) {
            if (nextFiber === workInProgress2) {
              nextFiber = null;
              break;
            }
            if (fiber = nextFiber.sibling, fiber !== null) {
              fiber.return = nextFiber.return, nextFiber = fiber;
              break;
            }
            nextFiber = nextFiber.return;
          }
        fiber = nextFiber;
      }
    }
    function propagateParentContextChanges(current2, workInProgress2, renderLanes2, forcePropagateEntireTree) {
      current2 = null;
      for (var parent = workInProgress2, isInsidePropagationBailout = !1;parent !== null; ) {
        if (!isInsidePropagationBailout) {
          if ((parent.flags & 524288) !== 0)
            isInsidePropagationBailout = !0;
          else if ((parent.flags & 262144) !== 0)
            break;
        }
        if (parent.tag === 10) {
          var currentParent = parent.alternate;
          if (currentParent === null)
            throw Error("Should have a current fiber. This is a bug in React.");
          if (currentParent = currentParent.memoizedProps, currentParent !== null) {
            var context3 = parent.type;
            objectIs(parent.pendingProps.value, currentParent.value) || (current2 !== null ? current2.push(context3) : current2 = [context3]);
          }
        } else if (parent === hostTransitionProviderCursor.current) {
          if (currentParent = parent.alternate, currentParent === null)
            throw Error("Should have a current fiber. This is a bug in React.");
          currentParent.memoizedState.memoizedState !== parent.memoizedState.memoizedState && (current2 !== null ? current2.push(HostTransitionContext) : current2 = [HostTransitionContext]);
        }
        parent = parent.return;
      }
      current2 !== null && propagateContextChanges(workInProgress2, current2, renderLanes2, forcePropagateEntireTree), workInProgress2.flags |= 262144;
    }
    function checkIfContextChanged(currentDependencies) {
      for (currentDependencies = currentDependencies.firstContext;currentDependencies !== null; ) {
        var context3 = currentDependencies.context;
        if (!objectIs(isPrimaryRenderer ? context3._currentValue : context3._currentValue2, currentDependencies.memoizedValue))
          return !0;
        currentDependencies = currentDependencies.next;
      }
      return !1;
    }
    function prepareToReadContext(workInProgress2) {
      currentlyRenderingFiber$1 = workInProgress2, lastContextDependency = null, workInProgress2 = workInProgress2.dependencies, workInProgress2 !== null && (workInProgress2.firstContext = null);
    }
    function readContext(context3) {
      return isDisallowedContextReadInDEV && console.error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo()."), readContextForConsumer(currentlyRenderingFiber$1, context3);
    }
    function readContextDuringReconciliation(consumer2, context3) {
      return currentlyRenderingFiber$1 === null && prepareToReadContext(consumer2), readContextForConsumer(consumer2, context3);
    }
    function readContextForConsumer(consumer2, context3) {
      var value = isPrimaryRenderer ? context3._currentValue : context3._currentValue2;
      if (context3 = { context: context3, memoizedValue: value, next: null }, lastContextDependency === null) {
        if (consumer2 === null)
          throw Error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
        lastContextDependency = context3, consumer2.dependencies = {
          lanes: 0,
          firstContext: context3,
          _debugThenableState: null
        }, consumer2.flags |= 524288;
      } else
        lastContextDependency = lastContextDependency.next = context3;
      return value;
    }
    function createCache() {
      return {
        controller: new AbortControllerLocal,
        data: /* @__PURE__ */ new Map,
        refCount: 0
      };
    }
    function retainCache(cache4) {
      cache4.controller.signal.aborted && console.warn("A cache instance was retained after it was already freed. This likely indicates a bug in React."), cache4.refCount++;
    }
    function releaseCache(cache4) {
      cache4.refCount--, 0 > cache4.refCount && console.warn("A cache instance was released after it was already freed. This likely indicates a bug in React."), cache4.refCount === 0 && scheduleCallback$2(NormalPriority, function() {
        cache4.controller.abort();
      });
    }
    function startUpdateTimerByLane(lane, method, fiber) {
      if ((lane & 127) !== 0)
        0 > blockingUpdateTime && (blockingUpdateTime = now2(), blockingUpdateTask = createTask(method), blockingUpdateMethodName = method, fiber != null && (blockingUpdateComponentName = getComponentNameFromFiber(fiber)), isAlreadyRendering() && (componentEffectSpawnedUpdate = !0, blockingUpdateType = 1), lane = resolveEventTimeStamp(), method = resolveEventType(), lane !== blockingEventRepeatTime || method !== blockingEventType ? blockingEventRepeatTime = -1.1 : method !== null && (blockingUpdateType = 1), blockingEventTime = lane, blockingEventType = method);
      else if ((lane & 4194048) !== 0 && 0 > transitionUpdateTime && (transitionUpdateTime = now2(), transitionUpdateTask = createTask(method), transitionUpdateMethodName = method, fiber != null && (transitionUpdateComponentName = getComponentNameFromFiber(fiber)), 0 > transitionStartTime)) {
        if (lane = resolveEventTimeStamp(), method = resolveEventType(), lane !== transitionEventRepeatTime || method !== transitionEventType)
          transitionEventRepeatTime = -1.1;
        transitionEventTime = lane, transitionEventType = method;
      }
    }
    function startHostActionTimer(fiber) {
      if (0 > blockingUpdateTime) {
        blockingUpdateTime = now2(), blockingUpdateTask = fiber._debugTask != null ? fiber._debugTask : null, isAlreadyRendering() && (blockingUpdateType = 1);
        var newEventTime = resolveEventTimeStamp(), newEventType = resolveEventType();
        newEventTime !== blockingEventRepeatTime || newEventType !== blockingEventType ? blockingEventRepeatTime = -1.1 : newEventType !== null && (blockingUpdateType = 1), blockingEventTime = newEventTime, blockingEventType = newEventType;
      }
      if (0 > transitionUpdateTime && (transitionUpdateTime = now2(), transitionUpdateTask = fiber._debugTask != null ? fiber._debugTask : null, 0 > transitionStartTime)) {
        if (fiber = resolveEventTimeStamp(), newEventTime = resolveEventType(), fiber !== transitionEventRepeatTime || newEventTime !== transitionEventType)
          transitionEventRepeatTime = -1.1;
        transitionEventTime = fiber, transitionEventType = newEventTime;
      }
    }
    function pushNestedEffectDurations() {
      var prevEffectDuration = profilerEffectDuration;
      return profilerEffectDuration = 0, prevEffectDuration;
    }
    function popNestedEffectDurations(prevEffectDuration) {
      var elapsedTime = profilerEffectDuration;
      return profilerEffectDuration = prevEffectDuration, elapsedTime;
    }
    function bubbleNestedEffectDurations(prevEffectDuration) {
      var elapsedTime = profilerEffectDuration;
      return profilerEffectDuration += prevEffectDuration, elapsedTime;
    }
    function resetComponentEffectTimers() {
      componentEffectEndTime = componentEffectStartTime = -1.1;
    }
    function pushComponentEffectStart() {
      var prevEffectStart = componentEffectStartTime;
      return componentEffectStartTime = -1.1, prevEffectStart;
    }
    function popComponentEffectStart(prevEffectStart) {
      0 <= prevEffectStart && (componentEffectStartTime = prevEffectStart);
    }
    function pushComponentEffectDuration() {
      var prevEffectDuration = componentEffectDuration;
      return componentEffectDuration = -0, prevEffectDuration;
    }
    function popComponentEffectDuration(prevEffectDuration) {
      0 <= prevEffectDuration && (componentEffectDuration = prevEffectDuration);
    }
    function pushComponentEffectErrors() {
      var prevErrors = componentEffectErrors;
      return componentEffectErrors = null, prevErrors;
    }
    function pushComponentEffectDidSpawnUpdate() {
      var prev = componentEffectSpawnedUpdate;
      return componentEffectSpawnedUpdate = !1, prev;
    }
    function startProfilerTimer(fiber) {
      profilerStartTime = now2(), 0 > fiber.actualStartTime && (fiber.actualStartTime = profilerStartTime);
    }
    function stopProfilerTimerIfRunningAndRecordDuration(fiber) {
      if (0 <= profilerStartTime) {
        var elapsedTime = now2() - profilerStartTime;
        fiber.actualDuration += elapsedTime, fiber.selfBaseDuration = elapsedTime, profilerStartTime = -1;
      }
    }
    function stopProfilerTimerIfRunningAndRecordIncompleteDuration(fiber) {
      if (0 <= profilerStartTime) {
        var elapsedTime = now2() - profilerStartTime;
        fiber.actualDuration += elapsedTime, profilerStartTime = -1;
      }
    }
    function recordEffectDuration() {
      if (0 <= profilerStartTime) {
        var endTime = now2(), elapsedTime = endTime - profilerStartTime;
        profilerStartTime = -1, profilerEffectDuration += elapsedTime, componentEffectDuration += elapsedTime, componentEffectEndTime = endTime;
      }
    }
    function recordEffectError(errorInfo) {
      componentEffectErrors === null && (componentEffectErrors = []), componentEffectErrors.push(errorInfo), commitErrors === null && (commitErrors = []), commitErrors.push(errorInfo);
    }
    function startEffectTimer() {
      profilerStartTime = now2(), 0 > componentEffectStartTime && (componentEffectStartTime = profilerStartTime);
    }
    function transferActualDuration(fiber) {
      for (var child = fiber.child;child; )
        fiber.actualDuration += child.actualDuration, child = child.sibling;
    }
    function noop$1() {}
    function ensureRootIsScheduled(root2) {
      root2 !== lastScheduledRoot && root2.next === null && (lastScheduledRoot === null ? firstScheduledRoot = lastScheduledRoot = root2 : lastScheduledRoot = lastScheduledRoot.next = root2), mightHavePendingSyncWork = !0, ReactSharedInternals.actQueue !== null ? didScheduleMicrotask_act || (didScheduleMicrotask_act = !0, scheduleImmediateRootScheduleTask()) : didScheduleMicrotask || (didScheduleMicrotask = !0, scheduleImmediateRootScheduleTask());
    }
    function flushSyncWorkAcrossRoots_impl(syncTransitionLanes, onlyLegacy) {
      if (!isFlushingWork && mightHavePendingSyncWork) {
        isFlushingWork = !0;
        do {
          var didPerformSomeWork = !1;
          for (var root2 = firstScheduledRoot;root2 !== null; ) {
            if (!onlyLegacy)
              if (syncTransitionLanes !== 0) {
                var pendingLanes = root2.pendingLanes;
                if (pendingLanes === 0)
                  var nextLanes = 0;
                else {
                  var { suspendedLanes, pingedLanes } = root2;
                  nextLanes = (1 << 31 - clz32(42 | syncTransitionLanes) + 1) - 1, nextLanes &= pendingLanes & ~(suspendedLanes & ~pingedLanes), nextLanes = nextLanes & 201326741 ? nextLanes & 201326741 | 1 : nextLanes ? nextLanes | 2 : 0;
                }
                nextLanes !== 0 && (didPerformSomeWork = !0, performSyncWorkOnRoot(root2, nextLanes));
              } else
                nextLanes = workInProgressRootRenderLanes, nextLanes = getNextLanes(root2, root2 === workInProgressRoot ? nextLanes : 0, root2.cancelPendingCommit !== null || root2.timeoutHandle !== noTimeout), (nextLanes & 3) === 0 || checkIfRootIsPrerendering(root2, nextLanes) || (didPerformSomeWork = !0, performSyncWorkOnRoot(root2, nextLanes));
            root2 = root2.next;
          }
        } while (didPerformSomeWork);
        isFlushingWork = !1;
      }
    }
    function processRootScheduleInImmediateTask() {
      trackSchedulerEvent(), processRootScheduleInMicrotask();
    }
    function processRootScheduleInMicrotask() {
      mightHavePendingSyncWork = didScheduleMicrotask_act = didScheduleMicrotask = !1;
      var syncTransitionLanes = 0;
      currentEventTransitionLane !== 0 && shouldAttemptEagerTransition() && (syncTransitionLanes = currentEventTransitionLane);
      for (var currentTime = now$1(), prev = null, root2 = firstScheduledRoot;root2 !== null; ) {
        var next = root2.next, nextLanes = scheduleTaskForRootDuringMicrotask(root2, currentTime);
        if (nextLanes === 0)
          root2.next = null, prev === null ? firstScheduledRoot = next : prev.next = next, next === null && (lastScheduledRoot = prev);
        else if (prev = root2, syncTransitionLanes !== 0 || (nextLanes & 3) !== 0)
          mightHavePendingSyncWork = !0;
        root2 = next;
      }
      pendingEffectsStatus !== NO_PENDING_EFFECTS && pendingEffectsStatus !== PENDING_PASSIVE_PHASE || flushSyncWorkAcrossRoots_impl(syncTransitionLanes, !1), currentEventTransitionLane !== 0 && (currentEventTransitionLane = 0);
    }
    function scheduleTaskForRootDuringMicrotask(root2, currentTime) {
      for (var { suspendedLanes, pingedLanes, expirationTimes } = root2, lanes = root2.pendingLanes & -62914561;0 < lanes; ) {
        var index = 31 - clz32(lanes), lane = 1 << index, expirationTime = expirationTimes[index];
        if (expirationTime === -1) {
          if ((lane & suspendedLanes) === 0 || (lane & pingedLanes) !== 0)
            expirationTimes[index] = computeExpirationTime(lane, currentTime);
        } else
          expirationTime <= currentTime && (root2.expiredLanes |= lane);
        lanes &= ~lane;
      }
      if (currentTime = workInProgressRoot, suspendedLanes = workInProgressRootRenderLanes, suspendedLanes = getNextLanes(root2, root2 === currentTime ? suspendedLanes : 0, root2.cancelPendingCommit !== null || root2.timeoutHandle !== noTimeout), pingedLanes = root2.callbackNode, suspendedLanes === 0 || root2 === currentTime && (workInProgressSuspendedReason === SuspendedOnData || workInProgressSuspendedReason === SuspendedOnAction) || root2.cancelPendingCommit !== null)
        return pingedLanes !== null && cancelCallback(pingedLanes), root2.callbackNode = null, root2.callbackPriority = 0;
      if ((suspendedLanes & 3) === 0 || checkIfRootIsPrerendering(root2, suspendedLanes)) {
        if (currentTime = suspendedLanes & -suspendedLanes, currentTime !== root2.callbackPriority || ReactSharedInternals.actQueue !== null && pingedLanes !== fakeActCallbackNode$1)
          cancelCallback(pingedLanes);
        else
          return currentTime;
        switch (lanesToEventPriority(suspendedLanes)) {
          case 2:
          case 8:
            suspendedLanes = UserBlockingPriority;
            break;
          case 32:
            suspendedLanes = NormalPriority$1;
            break;
          case 268435456:
            suspendedLanes = IdlePriority;
            break;
          default:
            suspendedLanes = NormalPriority$1;
        }
        return pingedLanes = performWorkOnRootViaSchedulerTask.bind(null, root2), ReactSharedInternals.actQueue !== null ? (ReactSharedInternals.actQueue.push(pingedLanes), suspendedLanes = fakeActCallbackNode$1) : suspendedLanes = scheduleCallback$3(suspendedLanes, pingedLanes), root2.callbackPriority = currentTime, root2.callbackNode = suspendedLanes, currentTime;
      }
      return pingedLanes !== null && cancelCallback(pingedLanes), root2.callbackPriority = 2, root2.callbackNode = null, 2;
    }
    function performWorkOnRootViaSchedulerTask(root2, didTimeout) {
      if (nestedUpdateScheduled = currentUpdateIsNested = !1, trackSchedulerEvent(), pendingEffectsStatus !== NO_PENDING_EFFECTS && pendingEffectsStatus !== PENDING_PASSIVE_PHASE)
        return root2.callbackNode = null, root2.callbackPriority = 0, null;
      var originalCallbackNode = root2.callbackNode;
      if (pendingDelayedCommitReason === IMMEDIATE_COMMIT && (pendingDelayedCommitReason = DELAYED_PASSIVE_COMMIT), flushPendingEffects() && root2.callbackNode !== originalCallbackNode)
        return null;
      var workInProgressRootRenderLanes$jscomp$0 = workInProgressRootRenderLanes;
      if (workInProgressRootRenderLanes$jscomp$0 = getNextLanes(root2, root2 === workInProgressRoot ? workInProgressRootRenderLanes$jscomp$0 : 0, root2.cancelPendingCommit !== null || root2.timeoutHandle !== noTimeout), workInProgressRootRenderLanes$jscomp$0 === 0)
        return null;
      return performWorkOnRoot(root2, workInProgressRootRenderLanes$jscomp$0, didTimeout), scheduleTaskForRootDuringMicrotask(root2, now$1()), root2.callbackNode != null && root2.callbackNode === originalCallbackNode ? performWorkOnRootViaSchedulerTask.bind(null, root2) : null;
    }
    function performSyncWorkOnRoot(root2, lanes) {
      if (flushPendingEffects())
        return null;
      currentUpdateIsNested = nestedUpdateScheduled, nestedUpdateScheduled = !1, performWorkOnRoot(root2, lanes, !0);
    }
    function cancelCallback(callbackNode) {
      callbackNode !== fakeActCallbackNode$1 && callbackNode !== null && cancelCallback$1(callbackNode);
    }
    function scheduleImmediateRootScheduleTask() {
      ReactSharedInternals.actQueue !== null && ReactSharedInternals.actQueue.push(function() {
        return processRootScheduleInMicrotask(), null;
      }), supportsMicrotasks ? scheduleMicrotask(function() {
        (executionContext & (RenderContext | CommitContext)) !== NoContext ? scheduleCallback$3(ImmediatePriority, processRootScheduleInImmediateTask) : processRootScheduleInMicrotask();
      }) : scheduleCallback$3(ImmediatePriority, processRootScheduleInImmediateTask);
    }
    function requestTransitionLane() {
      if (currentEventTransitionLane === 0) {
        var actionScopeLane = currentEntangledLane;
        actionScopeLane === 0 && (actionScopeLane = nextTransitionUpdateLane, nextTransitionUpdateLane <<= 1, (nextTransitionUpdateLane & 261888) === 0 && (nextTransitionUpdateLane = 256)), currentEventTransitionLane = actionScopeLane;
      }
      return currentEventTransitionLane;
    }
    function entangleAsyncAction(transition, thenable) {
      if (currentEntangledListeners === null) {
        var entangledListeners = currentEntangledListeners = [];
        currentEntangledPendingCount = 0, currentEntangledLane = requestTransitionLane(), currentEntangledActionThenable = {
          status: "pending",
          value: void 0,
          then: function(resolve10) {
            entangledListeners.push(resolve10);
          }
        };
      }
      return currentEntangledPendingCount++, thenable.then(pingEngtangledActionScope, pingEngtangledActionScope), thenable;
    }
    function pingEngtangledActionScope() {
      if (--currentEntangledPendingCount === 0 && (-1 < transitionUpdateTime || (transitionStartTime = -1.1), currentEntangledListeners !== null)) {
        currentEntangledActionThenable !== null && (currentEntangledActionThenable.status = "fulfilled");
        var listeners = currentEntangledListeners;
        currentEntangledListeners = null, currentEntangledLane = 0, currentEntangledActionThenable = null;
        for (var i4 = 0;i4 < listeners.length; i4++)
          (0, listeners[i4])();
      }
    }
    function chainThenableValue(thenable, result) {
      var listeners = [], thenableWithOverride = {
        status: "pending",
        value: null,
        reason: null,
        then: function(resolve10) {
          listeners.push(resolve10);
        }
      };
      return thenable.then(function() {
        thenableWithOverride.status = "fulfilled", thenableWithOverride.value = result;
        for (var i4 = 0;i4 < listeners.length; i4++)
          (0, listeners[i4])(result);
      }, function(error44) {
        thenableWithOverride.status = "rejected", thenableWithOverride.reason = error44;
        for (error44 = 0;error44 < listeners.length; error44++)
          (0, listeners[error44])(void 0);
      }), thenableWithOverride;
    }
    function peekCacheFromPool() {
      var cacheResumedFromPreviousRender = resumedCache.current;
      return cacheResumedFromPreviousRender !== null ? cacheResumedFromPreviousRender : workInProgressRoot.pooledCache;
    }
    function pushTransition(offscreenWorkInProgress, prevCachePool) {
      prevCachePool === null ? push(resumedCache, resumedCache.current, offscreenWorkInProgress) : push(resumedCache, prevCachePool.pool, offscreenWorkInProgress);
    }
    function getSuspendedCache() {
      var cacheFromPool = peekCacheFromPool();
      return cacheFromPool === null ? null : {
        parent: isPrimaryRenderer ? CacheContext._currentValue : CacheContext._currentValue2,
        pool: cacheFromPool
      };
    }
    function shallowEqual(objA, objB) {
      if (objectIs(objA, objB))
        return !0;
      if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null)
        return !1;
      var keysA = Object.keys(objA), keysB = Object.keys(objB);
      if (keysA.length !== keysB.length)
        return !1;
      for (keysB = 0;keysB < keysA.length; keysB++) {
        var currentKey = keysA[keysB];
        if (!hasOwnProperty15.call(objB, currentKey) || !objectIs(objA[currentKey], objB[currentKey]))
          return !1;
      }
      return !0;
    }
    function createThenableState() {
      return { didWarnAboutUncachedPromise: !1, thenables: [] };
    }
    function isThenableResolved(thenable) {
      return thenable = thenable.status, thenable === "fulfilled" || thenable === "rejected";
    }
    function trackUsedThenable(thenableState2, thenable, index) {
      ReactSharedInternals.actQueue !== null && (ReactSharedInternals.didUsePromise = !0);
      var trackedThenables = thenableState2.thenables;
      if (index = trackedThenables[index], index === void 0 ? trackedThenables.push(thenable) : index !== thenable && (thenableState2.didWarnAboutUncachedPromise || (thenableState2.didWarnAboutUncachedPromise = !0, console.error("A component was suspended by an uncached promise. Creating promises inside a Client Component or hook is not yet supported, except via a Suspense-compatible library or framework.")), thenable.then(noop$1, noop$1), thenable = index), thenable._debugInfo === void 0) {
        thenableState2 = performance.now(), trackedThenables = thenable.displayName;
        var ioInfo = {
          name: typeof trackedThenables === "string" ? trackedThenables : "Promise",
          start: thenableState2,
          end: thenableState2,
          value: thenable
        };
        thenable._debugInfo = [{ awaited: ioInfo }], thenable.status !== "fulfilled" && thenable.status !== "rejected" && (thenableState2 = function() {
          ioInfo.end = performance.now();
        }, thenable.then(thenableState2, thenableState2));
      }
      switch (thenable.status) {
        case "fulfilled":
          return thenable.value;
        case "rejected":
          throw thenableState2 = thenable.reason, checkIfUseWrappedInAsyncCatch(thenableState2), thenableState2;
        default:
          if (typeof thenable.status === "string")
            thenable.then(noop$1, noop$1);
          else {
            if (thenableState2 = workInProgressRoot, thenableState2 !== null && 100 < thenableState2.shellSuspendCounter)
              throw Error("An unknown Component is an async Client Component. Only Server Components can be async at the moment. This error is often caused by accidentally adding `'use client'` to a module that was originally written for the server.");
            thenableState2 = thenable, thenableState2.status = "pending", thenableState2.then(function(fulfilledValue) {
              if (thenable.status === "pending") {
                var fulfilledThenable = thenable;
                fulfilledThenable.status = "fulfilled", fulfilledThenable.value = fulfilledValue;
              }
            }, function(error44) {
              if (thenable.status === "pending") {
                var rejectedThenable = thenable;
                rejectedThenable.status = "rejected", rejectedThenable.reason = error44;
              }
            });
          }
          switch (thenable.status) {
            case "fulfilled":
              return thenable.value;
            case "rejected":
              throw thenableState2 = thenable.reason, checkIfUseWrappedInAsyncCatch(thenableState2), thenableState2;
          }
          throw suspendedThenable = thenable, needsToResetSuspendedThenableDEV = !0, SuspenseException;
      }
    }
    function resolveLazy(lazyType) {
      try {
        return callLazyInitInDEV(lazyType);
      } catch (x3) {
        if (x3 !== null && typeof x3 === "object" && typeof x3.then === "function")
          throw suspendedThenable = x3, needsToResetSuspendedThenableDEV = !0, SuspenseException;
        throw x3;
      }
    }
    function getSuspendedThenable() {
      if (suspendedThenable === null)
        throw Error("Expected a suspended thenable. This is a bug in React. Please file an issue.");
      var thenable = suspendedThenable;
      return suspendedThenable = null, needsToResetSuspendedThenableDEV = !1, thenable;
    }
    function checkIfUseWrappedInAsyncCatch(rejectedReason) {
      if (rejectedReason === SuspenseException || rejectedReason === SuspenseActionException)
        throw Error("Hooks are not supported inside an async component. This error is often caused by accidentally adding `'use client'` to a module that was originally written for the server.");
    }
    function pushDebugInfo(debugInfo) {
      var previousDebugInfo = currentDebugInfo;
      return debugInfo != null && (currentDebugInfo = previousDebugInfo === null ? debugInfo : previousDebugInfo.concat(debugInfo)), previousDebugInfo;
    }
    function getCurrentDebugTask() {
      var debugInfo = currentDebugInfo;
      if (debugInfo != null) {
        for (var i4 = debugInfo.length - 1;0 <= i4; i4--)
          if (debugInfo[i4].name != null) {
            var debugTask = debugInfo[i4].debugTask;
            if (debugTask != null)
              return debugTask;
          }
      }
      return null;
    }
    function validateFragmentProps(element, fiber, returnFiber) {
      for (var keys2 = Object.keys(element.props), i4 = 0;i4 < keys2.length; i4++) {
        var key = keys2[i4];
        if (key !== "children" && key !== "key") {
          fiber === null && (fiber = createFiberFromElement(element, returnFiber.mode, 0), fiber._debugInfo = currentDebugInfo, fiber.return = returnFiber), runWithFiberInDEV(fiber, function(erroredKey) {
            console.error("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", erroredKey);
          }, key);
          break;
        }
      }
    }
    function unwrapThenable(thenable) {
      var index = thenableIndexCounter$1;
      return thenableIndexCounter$1 += 1, thenableState$1 === null && (thenableState$1 = createThenableState()), trackUsedThenable(thenableState$1, thenable, index);
    }
    function coerceRef(workInProgress2, element) {
      element = element.props.ref, workInProgress2.ref = element !== void 0 ? element : null;
    }
    function throwOnInvalidObjectTypeImpl(returnFiber, newChild) {
      if (newChild.$$typeof === REACT_LEGACY_ELEMENT_TYPE)
        throw Error(`A React Element from an older version of React was rendered. This is not supported. It can happen if:
- Multiple copies of the "react" package is used.
- A library pre-bundled an old copy of "react" or "react/jsx-runtime".
- A compiler tries to "inline" JSX instead of using the runtime.`);
      throw returnFiber = Object.prototype.toString.call(newChild), Error("Objects are not valid as a React child (found: " + (returnFiber === "[object Object]" ? "object with keys {" + Object.keys(newChild).join(", ") + "}" : returnFiber) + "). If you meant to render a collection of children, use an array instead.");
    }
    function throwOnInvalidObjectType(returnFiber, newChild) {
      var debugTask = getCurrentDebugTask();
      debugTask !== null ? debugTask.run(throwOnInvalidObjectTypeImpl.bind(null, returnFiber, newChild)) : throwOnInvalidObjectTypeImpl(returnFiber, newChild);
    }
    function warnOnFunctionTypeImpl(returnFiber, invalidChild) {
      var parentName = getComponentNameFromFiber(returnFiber) || "Component";
      ownerHasFunctionTypeWarning[parentName] || (ownerHasFunctionTypeWarning[parentName] = !0, invalidChild = invalidChild.displayName || invalidChild.name || "Component", returnFiber.tag === 3 ? console.error(`Functions are not valid as a React child. This may happen if you return %s instead of <%s /> from render. Or maybe you meant to call this function rather than return it.
  root.render(%s)`, invalidChild, invalidChild, invalidChild) : console.error(`Functions are not valid as a React child. This may happen if you return %s instead of <%s /> from render. Or maybe you meant to call this function rather than return it.
  <%s>{%s}</%s>`, invalidChild, invalidChild, parentName, invalidChild, parentName));
    }
    function warnOnFunctionType(returnFiber, invalidChild) {
      var debugTask = getCurrentDebugTask();
      debugTask !== null ? debugTask.run(warnOnFunctionTypeImpl.bind(null, returnFiber, invalidChild)) : warnOnFunctionTypeImpl(returnFiber, invalidChild);
    }
    function warnOnSymbolTypeImpl(returnFiber, invalidChild) {
      var parentName = getComponentNameFromFiber(returnFiber) || "Component";
      ownerHasSymbolTypeWarning[parentName] || (ownerHasSymbolTypeWarning[parentName] = !0, invalidChild = String(invalidChild), returnFiber.tag === 3 ? console.error(`Symbols are not valid as a React child.
  root.render(%s)`, invalidChild) : console.error(`Symbols are not valid as a React child.
  <%s>%s</%s>`, parentName, invalidChild, parentName));
    }
    function warnOnSymbolType(returnFiber, invalidChild) {
      var debugTask = getCurrentDebugTask();
      debugTask !== null ? debugTask.run(warnOnSymbolTypeImpl.bind(null, returnFiber, invalidChild)) : warnOnSymbolTypeImpl(returnFiber, invalidChild);
    }
    function createChildReconciler(shouldTrackSideEffects) {
      function deleteChild(returnFiber, childToDelete) {
        if (shouldTrackSideEffects) {
          var deletions = returnFiber.deletions;
          deletions === null ? (returnFiber.deletions = [childToDelete], returnFiber.flags |= 16) : deletions.push(childToDelete);
        }
      }
      function deleteRemainingChildren(returnFiber, currentFirstChild) {
        if (!shouldTrackSideEffects)
          return null;
        for (;currentFirstChild !== null; )
          deleteChild(returnFiber, currentFirstChild), currentFirstChild = currentFirstChild.sibling;
        return null;
      }
      function mapRemainingChildren(currentFirstChild) {
        for (var existingChildren = /* @__PURE__ */ new Map;currentFirstChild !== null; )
          currentFirstChild.key !== null ? existingChildren.set(currentFirstChild.key, currentFirstChild) : existingChildren.set(currentFirstChild.index, currentFirstChild), currentFirstChild = currentFirstChild.sibling;
        return existingChildren;
      }
      function useFiber(fiber, pendingProps) {
        return fiber = createWorkInProgress(fiber, pendingProps), fiber.index = 0, fiber.sibling = null, fiber;
      }
      function placeChild(newFiber, lastPlacedIndex, newIndex) {
        if (newFiber.index = newIndex, !shouldTrackSideEffects)
          return newFiber.flags |= 1048576, lastPlacedIndex;
        if (newIndex = newFiber.alternate, newIndex !== null)
          return newIndex = newIndex.index, newIndex < lastPlacedIndex ? (newFiber.flags |= 67108866, lastPlacedIndex) : newIndex;
        return newFiber.flags |= 67108866, lastPlacedIndex;
      }
      function placeSingleChild(newFiber) {
        return shouldTrackSideEffects && newFiber.alternate === null && (newFiber.flags |= 67108866), newFiber;
      }
      function updateTextNode(returnFiber, current2, textContent, lanes) {
        if (current2 === null || current2.tag !== 6)
          return current2 = createFiberFromText(textContent, returnFiber.mode, lanes), current2.return = returnFiber, current2._debugOwner = returnFiber, current2._debugTask = returnFiber._debugTask, current2._debugInfo = currentDebugInfo, current2;
        return current2 = useFiber(current2, textContent), current2.return = returnFiber, current2._debugInfo = currentDebugInfo, current2;
      }
      function updateElement(returnFiber, current2, element, lanes) {
        var elementType = element.type;
        if (elementType === REACT_FRAGMENT_TYPE)
          return current2 = updateFragment(returnFiber, current2, element.props.children, lanes, element.key), validateFragmentProps(element, current2, returnFiber), current2;
        if (current2 !== null && (current2.elementType === elementType || isCompatibleFamilyForHotReloading(current2, element) || typeof elementType === "object" && elementType !== null && elementType.$$typeof === REACT_LAZY_TYPE && resolveLazy(elementType) === current2.type))
          return current2 = useFiber(current2, element.props), coerceRef(current2, element), current2.return = returnFiber, current2._debugOwner = element._owner, current2._debugInfo = currentDebugInfo, current2;
        return current2 = createFiberFromElement(element, returnFiber.mode, lanes), coerceRef(current2, element), current2.return = returnFiber, current2._debugInfo = currentDebugInfo, current2;
      }
      function updatePortal(returnFiber, current2, portal, lanes) {
        if (current2 === null || current2.tag !== 4 || current2.stateNode.containerInfo !== portal.containerInfo || current2.stateNode.implementation !== portal.implementation)
          return current2 = createFiberFromPortal(portal, returnFiber.mode, lanes), current2.return = returnFiber, current2._debugInfo = currentDebugInfo, current2;
        return current2 = useFiber(current2, portal.children || []), current2.return = returnFiber, current2._debugInfo = currentDebugInfo, current2;
      }
      function updateFragment(returnFiber, current2, fragment, lanes, key) {
        if (current2 === null || current2.tag !== 7)
          return current2 = createFiberFromFragment(fragment, returnFiber.mode, lanes, key), current2.return = returnFiber, current2._debugOwner = returnFiber, current2._debugTask = returnFiber._debugTask, current2._debugInfo = currentDebugInfo, current2;
        return current2 = useFiber(current2, fragment), current2.return = returnFiber, current2._debugInfo = currentDebugInfo, current2;
      }
      function createChild(returnFiber, newChild, lanes) {
        if (typeof newChild === "string" && newChild !== "" || typeof newChild === "number" || typeof newChild === "bigint")
          return newChild = createFiberFromText("" + newChild, returnFiber.mode, lanes), newChild.return = returnFiber, newChild._debugOwner = returnFiber, newChild._debugTask = returnFiber._debugTask, newChild._debugInfo = currentDebugInfo, newChild;
        if (typeof newChild === "object" && newChild !== null) {
          switch (newChild.$$typeof) {
            case REACT_ELEMENT_TYPE:
              return lanes = createFiberFromElement(newChild, returnFiber.mode, lanes), coerceRef(lanes, newChild), lanes.return = returnFiber, returnFiber = pushDebugInfo(newChild._debugInfo), lanes._debugInfo = currentDebugInfo, currentDebugInfo = returnFiber, lanes;
            case REACT_PORTAL_TYPE:
              return newChild = createFiberFromPortal(newChild, returnFiber.mode, lanes), newChild.return = returnFiber, newChild._debugInfo = currentDebugInfo, newChild;
            case REACT_LAZY_TYPE:
              var _prevDebugInfo = pushDebugInfo(newChild._debugInfo);
              return newChild = resolveLazy(newChild), returnFiber = createChild(returnFiber, newChild, lanes), currentDebugInfo = _prevDebugInfo, returnFiber;
          }
          if (isArrayImpl(newChild) || getIteratorFn(newChild))
            return lanes = createFiberFromFragment(newChild, returnFiber.mode, lanes, null), lanes.return = returnFiber, lanes._debugOwner = returnFiber, lanes._debugTask = returnFiber._debugTask, returnFiber = pushDebugInfo(newChild._debugInfo), lanes._debugInfo = currentDebugInfo, currentDebugInfo = returnFiber, lanes;
          if (typeof newChild.then === "function")
            return _prevDebugInfo = pushDebugInfo(newChild._debugInfo), returnFiber = createChild(returnFiber, unwrapThenable(newChild), lanes), currentDebugInfo = _prevDebugInfo, returnFiber;
          if (newChild.$$typeof === REACT_CONTEXT_TYPE)
            return createChild(returnFiber, readContextDuringReconciliation(returnFiber, newChild), lanes);
          throwOnInvalidObjectType(returnFiber, newChild);
        }
        return typeof newChild === "function" && warnOnFunctionType(returnFiber, newChild), typeof newChild === "symbol" && warnOnSymbolType(returnFiber, newChild), null;
      }
      function updateSlot(returnFiber, oldFiber, newChild, lanes) {
        var key = oldFiber !== null ? oldFiber.key : null;
        if (typeof newChild === "string" && newChild !== "" || typeof newChild === "number" || typeof newChild === "bigint")
          return key !== null ? null : updateTextNode(returnFiber, oldFiber, "" + newChild, lanes);
        if (typeof newChild === "object" && newChild !== null) {
          switch (newChild.$$typeof) {
            case REACT_ELEMENT_TYPE:
              return newChild.key === key ? (key = pushDebugInfo(newChild._debugInfo), returnFiber = updateElement(returnFiber, oldFiber, newChild, lanes), currentDebugInfo = key, returnFiber) : null;
            case REACT_PORTAL_TYPE:
              return newChild.key === key ? updatePortal(returnFiber, oldFiber, newChild, lanes) : null;
            case REACT_LAZY_TYPE:
              return key = pushDebugInfo(newChild._debugInfo), newChild = resolveLazy(newChild), returnFiber = updateSlot(returnFiber, oldFiber, newChild, lanes), currentDebugInfo = key, returnFiber;
          }
          if (isArrayImpl(newChild) || getIteratorFn(newChild)) {
            if (key !== null)
              return null;
            return key = pushDebugInfo(newChild._debugInfo), returnFiber = updateFragment(returnFiber, oldFiber, newChild, lanes, null), currentDebugInfo = key, returnFiber;
          }
          if (typeof newChild.then === "function")
            return key = pushDebugInfo(newChild._debugInfo), returnFiber = updateSlot(returnFiber, oldFiber, unwrapThenable(newChild), lanes), currentDebugInfo = key, returnFiber;
          if (newChild.$$typeof === REACT_CONTEXT_TYPE)
            return updateSlot(returnFiber, oldFiber, readContextDuringReconciliation(returnFiber, newChild), lanes);
          throwOnInvalidObjectType(returnFiber, newChild);
        }
        return typeof newChild === "function" && warnOnFunctionType(returnFiber, newChild), typeof newChild === "symbol" && warnOnSymbolType(returnFiber, newChild), null;
      }
      function updateFromMap(existingChildren, returnFiber, newIdx, newChild, lanes) {
        if (typeof newChild === "string" && newChild !== "" || typeof newChild === "number" || typeof newChild === "bigint")
          return existingChildren = existingChildren.get(newIdx) || null, updateTextNode(returnFiber, existingChildren, "" + newChild, lanes);
        if (typeof newChild === "object" && newChild !== null) {
          switch (newChild.$$typeof) {
            case REACT_ELEMENT_TYPE:
              return newIdx = existingChildren.get(newChild.key === null ? newIdx : newChild.key) || null, existingChildren = pushDebugInfo(newChild._debugInfo), returnFiber = updateElement(returnFiber, newIdx, newChild, lanes), currentDebugInfo = existingChildren, returnFiber;
            case REACT_PORTAL_TYPE:
              return existingChildren = existingChildren.get(newChild.key === null ? newIdx : newChild.key) || null, updatePortal(returnFiber, existingChildren, newChild, lanes);
            case REACT_LAZY_TYPE:
              var _prevDebugInfo7 = pushDebugInfo(newChild._debugInfo);
              return newChild = resolveLazy(newChild), returnFiber = updateFromMap(existingChildren, returnFiber, newIdx, newChild, lanes), currentDebugInfo = _prevDebugInfo7, returnFiber;
          }
          if (isArrayImpl(newChild) || getIteratorFn(newChild))
            return newIdx = existingChildren.get(newIdx) || null, existingChildren = pushDebugInfo(newChild._debugInfo), returnFiber = updateFragment(returnFiber, newIdx, newChild, lanes, null), currentDebugInfo = existingChildren, returnFiber;
          if (typeof newChild.then === "function")
            return _prevDebugInfo7 = pushDebugInfo(newChild._debugInfo), returnFiber = updateFromMap(existingChildren, returnFiber, newIdx, unwrapThenable(newChild), lanes), currentDebugInfo = _prevDebugInfo7, returnFiber;
          if (newChild.$$typeof === REACT_CONTEXT_TYPE)
            return updateFromMap(existingChildren, returnFiber, newIdx, readContextDuringReconciliation(returnFiber, newChild), lanes);
          throwOnInvalidObjectType(returnFiber, newChild);
        }
        return typeof newChild === "function" && warnOnFunctionType(returnFiber, newChild), typeof newChild === "symbol" && warnOnSymbolType(returnFiber, newChild), null;
      }
      function warnOnInvalidKey(returnFiber, workInProgress2, child, knownKeys) {
        if (typeof child !== "object" || child === null)
          return knownKeys;
        switch (child.$$typeof) {
          case REACT_ELEMENT_TYPE:
          case REACT_PORTAL_TYPE:
            warnForMissingKey(returnFiber, workInProgress2, child);
            var key = child.key;
            if (typeof key !== "string")
              break;
            if (knownKeys === null) {
              knownKeys = /* @__PURE__ */ new Set, knownKeys.add(key);
              break;
            }
            if (!knownKeys.has(key)) {
              knownKeys.add(key);
              break;
            }
            runWithFiberInDEV(workInProgress2, function() {
              console.error("Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted \u2014 the behavior is unsupported and could change in a future version.", key);
            });
            break;
          case REACT_LAZY_TYPE:
            child = resolveLazy(child), warnOnInvalidKey(returnFiber, workInProgress2, child, knownKeys);
        }
        return knownKeys;
      }
      function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren, lanes) {
        for (var knownKeys = null, resultingFirstChild = null, previousNewFiber = null, oldFiber = currentFirstChild, newIdx = currentFirstChild = 0, nextOldFiber = null;oldFiber !== null && newIdx < newChildren.length; newIdx++) {
          oldFiber.index > newIdx ? (nextOldFiber = oldFiber, oldFiber = null) : nextOldFiber = oldFiber.sibling;
          var newFiber = updateSlot(returnFiber, oldFiber, newChildren[newIdx], lanes);
          if (newFiber === null) {
            oldFiber === null && (oldFiber = nextOldFiber);
            break;
          }
          knownKeys = warnOnInvalidKey(returnFiber, newFiber, newChildren[newIdx], knownKeys), shouldTrackSideEffects && oldFiber && newFiber.alternate === null && deleteChild(returnFiber, oldFiber), currentFirstChild = placeChild(newFiber, currentFirstChild, newIdx), previousNewFiber === null ? resultingFirstChild = newFiber : previousNewFiber.sibling = newFiber, previousNewFiber = newFiber, oldFiber = nextOldFiber;
        }
        if (newIdx === newChildren.length)
          return deleteRemainingChildren(returnFiber, oldFiber), isHydrating && pushTreeFork(returnFiber, newIdx), resultingFirstChild;
        if (oldFiber === null) {
          for (;newIdx < newChildren.length; newIdx++)
            oldFiber = createChild(returnFiber, newChildren[newIdx], lanes), oldFiber !== null && (knownKeys = warnOnInvalidKey(returnFiber, oldFiber, newChildren[newIdx], knownKeys), currentFirstChild = placeChild(oldFiber, currentFirstChild, newIdx), previousNewFiber === null ? resultingFirstChild = oldFiber : previousNewFiber.sibling = oldFiber, previousNewFiber = oldFiber);
          return isHydrating && pushTreeFork(returnFiber, newIdx), resultingFirstChild;
        }
        for (oldFiber = mapRemainingChildren(oldFiber);newIdx < newChildren.length; newIdx++)
          nextOldFiber = updateFromMap(oldFiber, returnFiber, newIdx, newChildren[newIdx], lanes), nextOldFiber !== null && (knownKeys = warnOnInvalidKey(returnFiber, nextOldFiber, newChildren[newIdx], knownKeys), shouldTrackSideEffects && nextOldFiber.alternate !== null && oldFiber.delete(nextOldFiber.key === null ? newIdx : nextOldFiber.key), currentFirstChild = placeChild(nextOldFiber, currentFirstChild, newIdx), previousNewFiber === null ? resultingFirstChild = nextOldFiber : previousNewFiber.sibling = nextOldFiber, previousNewFiber = nextOldFiber);
        return shouldTrackSideEffects && oldFiber.forEach(function(child) {
          return deleteChild(returnFiber, child);
        }), isHydrating && pushTreeFork(returnFiber, newIdx), resultingFirstChild;
      }
      function reconcileChildrenIterator(returnFiber, currentFirstChild, newChildren, lanes) {
        if (newChildren == null)
          throw Error("An iterable object provided no iterator.");
        for (var resultingFirstChild = null, previousNewFiber = null, oldFiber = currentFirstChild, newIdx = currentFirstChild = 0, nextOldFiber = null, knownKeys = null, step = newChildren.next();oldFiber !== null && !step.done; newIdx++, step = newChildren.next()) {
          oldFiber.index > newIdx ? (nextOldFiber = oldFiber, oldFiber = null) : nextOldFiber = oldFiber.sibling;
          var newFiber = updateSlot(returnFiber, oldFiber, step.value, lanes);
          if (newFiber === null) {
            oldFiber === null && (oldFiber = nextOldFiber);
            break;
          }
          knownKeys = warnOnInvalidKey(returnFiber, newFiber, step.value, knownKeys), shouldTrackSideEffects && oldFiber && newFiber.alternate === null && deleteChild(returnFiber, oldFiber), currentFirstChild = placeChild(newFiber, currentFirstChild, newIdx), previousNewFiber === null ? resultingFirstChild = newFiber : previousNewFiber.sibling = newFiber, previousNewFiber = newFiber, oldFiber = nextOldFiber;
        }
        if (step.done)
          return deleteRemainingChildren(returnFiber, oldFiber), isHydrating && pushTreeFork(returnFiber, newIdx), resultingFirstChild;
        if (oldFiber === null) {
          for (;!step.done; newIdx++, step = newChildren.next())
            oldFiber = createChild(returnFiber, step.value, lanes), oldFiber !== null && (knownKeys = warnOnInvalidKey(returnFiber, oldFiber, step.value, knownKeys), currentFirstChild = placeChild(oldFiber, currentFirstChild, newIdx), previousNewFiber === null ? resultingFirstChild = oldFiber : previousNewFiber.sibling = oldFiber, previousNewFiber = oldFiber);
          return isHydrating && pushTreeFork(returnFiber, newIdx), resultingFirstChild;
        }
        for (oldFiber = mapRemainingChildren(oldFiber);!step.done; newIdx++, step = newChildren.next())
          nextOldFiber = updateFromMap(oldFiber, returnFiber, newIdx, step.value, lanes), nextOldFiber !== null && (knownKeys = warnOnInvalidKey(returnFiber, nextOldFiber, step.value, knownKeys), shouldTrackSideEffects && nextOldFiber.alternate !== null && oldFiber.delete(nextOldFiber.key === null ? newIdx : nextOldFiber.key), currentFirstChild = placeChild(nextOldFiber, currentFirstChild, newIdx), previousNewFiber === null ? resultingFirstChild = nextOldFiber : previousNewFiber.sibling = nextOldFiber, previousNewFiber = nextOldFiber);
        return shouldTrackSideEffects && oldFiber.forEach(function(child) {
          return deleteChild(returnFiber, child);
        }), isHydrating && pushTreeFork(returnFiber, newIdx), resultingFirstChild;
      }
      function reconcileChildFibersImpl(returnFiber, currentFirstChild, newChild, lanes) {
        if (typeof newChild === "object" && newChild !== null && newChild.type === REACT_FRAGMENT_TYPE && newChild.key === null && (validateFragmentProps(newChild, null, returnFiber), newChild = newChild.props.children), typeof newChild === "object" && newChild !== null) {
          switch (newChild.$$typeof) {
            case REACT_ELEMENT_TYPE:
              var prevDebugInfo = pushDebugInfo(newChild._debugInfo);
              a: {
                for (var key = newChild.key;currentFirstChild !== null; ) {
                  if (currentFirstChild.key === key) {
                    if (key = newChild.type, key === REACT_FRAGMENT_TYPE) {
                      if (currentFirstChild.tag === 7) {
                        deleteRemainingChildren(returnFiber, currentFirstChild.sibling), lanes = useFiber(currentFirstChild, newChild.props.children), lanes.return = returnFiber, lanes._debugOwner = newChild._owner, lanes._debugInfo = currentDebugInfo, validateFragmentProps(newChild, lanes, returnFiber), returnFiber = lanes;
                        break a;
                      }
                    } else if (currentFirstChild.elementType === key || isCompatibleFamilyForHotReloading(currentFirstChild, newChild) || typeof key === "object" && key !== null && key.$$typeof === REACT_LAZY_TYPE && resolveLazy(key) === currentFirstChild.type) {
                      deleteRemainingChildren(returnFiber, currentFirstChild.sibling), lanes = useFiber(currentFirstChild, newChild.props), coerceRef(lanes, newChild), lanes.return = returnFiber, lanes._debugOwner = newChild._owner, lanes._debugInfo = currentDebugInfo, returnFiber = lanes;
                      break a;
                    }
                    deleteRemainingChildren(returnFiber, currentFirstChild);
                    break;
                  } else
                    deleteChild(returnFiber, currentFirstChild);
                  currentFirstChild = currentFirstChild.sibling;
                }
                newChild.type === REACT_FRAGMENT_TYPE ? (lanes = createFiberFromFragment(newChild.props.children, returnFiber.mode, lanes, newChild.key), lanes.return = returnFiber, lanes._debugOwner = returnFiber, lanes._debugTask = returnFiber._debugTask, lanes._debugInfo = currentDebugInfo, validateFragmentProps(newChild, lanes, returnFiber), returnFiber = lanes) : (lanes = createFiberFromElement(newChild, returnFiber.mode, lanes), coerceRef(lanes, newChild), lanes.return = returnFiber, lanes._debugInfo = currentDebugInfo, returnFiber = lanes);
              }
              return returnFiber = placeSingleChild(returnFiber), currentDebugInfo = prevDebugInfo, returnFiber;
            case REACT_PORTAL_TYPE:
              a: {
                prevDebugInfo = newChild;
                for (newChild = prevDebugInfo.key;currentFirstChild !== null; ) {
                  if (currentFirstChild.key === newChild)
                    if (currentFirstChild.tag === 4 && currentFirstChild.stateNode.containerInfo === prevDebugInfo.containerInfo && currentFirstChild.stateNode.implementation === prevDebugInfo.implementation) {
                      deleteRemainingChildren(returnFiber, currentFirstChild.sibling), lanes = useFiber(currentFirstChild, prevDebugInfo.children || []), lanes.return = returnFiber, returnFiber = lanes;
                      break a;
                    } else {
                      deleteRemainingChildren(returnFiber, currentFirstChild);
                      break;
                    }
                  else
                    deleteChild(returnFiber, currentFirstChild);
                  currentFirstChild = currentFirstChild.sibling;
                }
                lanes = createFiberFromPortal(prevDebugInfo, returnFiber.mode, lanes), lanes.return = returnFiber, returnFiber = lanes;
              }
              return placeSingleChild(returnFiber);
            case REACT_LAZY_TYPE:
              return prevDebugInfo = pushDebugInfo(newChild._debugInfo), newChild = resolveLazy(newChild), returnFiber = reconcileChildFibersImpl(returnFiber, currentFirstChild, newChild, lanes), currentDebugInfo = prevDebugInfo, returnFiber;
          }
          if (isArrayImpl(newChild))
            return prevDebugInfo = pushDebugInfo(newChild._debugInfo), returnFiber = reconcileChildrenArray(returnFiber, currentFirstChild, newChild, lanes), currentDebugInfo = prevDebugInfo, returnFiber;
          if (getIteratorFn(newChild)) {
            if (prevDebugInfo = pushDebugInfo(newChild._debugInfo), key = getIteratorFn(newChild), typeof key !== "function")
              throw Error("An object is not an iterable. This error is likely caused by a bug in React. Please file an issue.");
            var newChildren = key.call(newChild);
            if (newChildren === newChild) {
              if (returnFiber.tag !== 0 || Object.prototype.toString.call(returnFiber.type) !== "[object GeneratorFunction]" || Object.prototype.toString.call(newChildren) !== "[object Generator]")
                didWarnAboutGenerators || console.error("Using Iterators as children is unsupported and will likely yield unexpected results because enumerating a generator mutates it. You may convert it to an array with `Array.from()` or the `[...spread]` operator before rendering. You can also use an Iterable that can iterate multiple times over the same items."), didWarnAboutGenerators = !0;
            } else
              newChild.entries !== key || didWarnAboutMaps || (console.error("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), didWarnAboutMaps = !0);
            return returnFiber = reconcileChildrenIterator(returnFiber, currentFirstChild, newChildren, lanes), currentDebugInfo = prevDebugInfo, returnFiber;
          }
          if (typeof newChild.then === "function")
            return prevDebugInfo = pushDebugInfo(newChild._debugInfo), returnFiber = reconcileChildFibersImpl(returnFiber, currentFirstChild, unwrapThenable(newChild), lanes), currentDebugInfo = prevDebugInfo, returnFiber;
          if (newChild.$$typeof === REACT_CONTEXT_TYPE)
            return reconcileChildFibersImpl(returnFiber, currentFirstChild, readContextDuringReconciliation(returnFiber, newChild), lanes);
          throwOnInvalidObjectType(returnFiber, newChild);
        }
        if (typeof newChild === "string" && newChild !== "" || typeof newChild === "number" || typeof newChild === "bigint")
          return prevDebugInfo = "" + newChild, currentFirstChild !== null && currentFirstChild.tag === 6 ? (deleteRemainingChildren(returnFiber, currentFirstChild.sibling), lanes = useFiber(currentFirstChild, prevDebugInfo), lanes.return = returnFiber, returnFiber = lanes) : (deleteRemainingChildren(returnFiber, currentFirstChild), lanes = createFiberFromText(prevDebugInfo, returnFiber.mode, lanes), lanes.return = returnFiber, lanes._debugOwner = returnFiber, lanes._debugTask = returnFiber._debugTask, lanes._debugInfo = currentDebugInfo, returnFiber = lanes), placeSingleChild(returnFiber);
        return typeof newChild === "function" && warnOnFunctionType(returnFiber, newChild), typeof newChild === "symbol" && warnOnSymbolType(returnFiber, newChild), deleteRemainingChildren(returnFiber, currentFirstChild);
      }
      return function(returnFiber, currentFirstChild, newChild, lanes) {
        var prevDebugInfo = currentDebugInfo;
        currentDebugInfo = null;
        try {
          thenableIndexCounter$1 = 0;
          var firstChildFiber = reconcileChildFibersImpl(returnFiber, currentFirstChild, newChild, lanes);
          return thenableState$1 = null, firstChildFiber;
        } catch (x3) {
          if (x3 === SuspenseException || x3 === SuspenseActionException)
            throw x3;
          var fiber = createFiber(29, x3, null, returnFiber.mode);
          fiber.lanes = lanes, fiber.return = returnFiber;
          var debugInfo = fiber._debugInfo = currentDebugInfo;
          if (fiber._debugOwner = returnFiber._debugOwner, fiber._debugTask = returnFiber._debugTask, debugInfo != null) {
            for (var i4 = debugInfo.length - 1;0 <= i4; i4--)
              if (typeof debugInfo[i4].stack === "string") {
                fiber._debugOwner = debugInfo[i4], fiber._debugTask = debugInfo[i4].debugTask;
                break;
              }
          }
          return fiber;
        } finally {
          currentDebugInfo = prevDebugInfo;
        }
      };
    }
    function validateSuspenseListNestedChild(childSlot, index) {
      var isAnArray = isArrayImpl(childSlot);
      return childSlot = !isAnArray && typeof getIteratorFn(childSlot) === "function", isAnArray || childSlot ? (isAnArray = isAnArray ? "array" : "iterable", console.error("A nested %s was passed to row #%s in <SuspenseList />. Wrap it in an additional SuspenseList to configure its revealOrder: <SuspenseList revealOrder=...> ... <SuspenseList revealOrder=...>{%s}</SuspenseList> ... </SuspenseList>", isAnArray, index, isAnArray), !1) : !0;
    }
    function finishQueueingConcurrentUpdates() {
      for (var endIndex = concurrentQueuesIndex, i4 = concurrentlyUpdatedLanes = concurrentQueuesIndex = 0;i4 < endIndex; ) {
        var fiber = concurrentQueues[i4];
        concurrentQueues[i4++] = null;
        var queue = concurrentQueues[i4];
        concurrentQueues[i4++] = null;
        var update = concurrentQueues[i4];
        concurrentQueues[i4++] = null;
        var lane = concurrentQueues[i4];
        if (concurrentQueues[i4++] = null, queue !== null && update !== null) {
          var pending = queue.pending;
          pending === null ? update.next = update : (update.next = pending.next, pending.next = update), queue.pending = update;
        }
        lane !== 0 && markUpdateLaneFromFiberToRoot(fiber, update, lane);
      }
    }
    function enqueueUpdate$1(fiber, queue, update, lane) {
      concurrentQueues[concurrentQueuesIndex++] = fiber, concurrentQueues[concurrentQueuesIndex++] = queue, concurrentQueues[concurrentQueuesIndex++] = update, concurrentQueues[concurrentQueuesIndex++] = lane, concurrentlyUpdatedLanes |= lane, fiber.lanes |= lane, fiber = fiber.alternate, fiber !== null && (fiber.lanes |= lane);
    }
    function enqueueConcurrentHookUpdate(fiber, queue, update, lane) {
      return enqueueUpdate$1(fiber, queue, update, lane), getRootForUpdatedFiber(fiber);
    }
    function enqueueConcurrentRenderForLane(fiber, lane) {
      return enqueueUpdate$1(fiber, null, null, lane), getRootForUpdatedFiber(fiber);
    }
    function markUpdateLaneFromFiberToRoot(sourceFiber, update, lane) {
      sourceFiber.lanes |= lane;
      var alternate = sourceFiber.alternate;
      alternate !== null && (alternate.lanes |= lane);
      for (var isHidden = !1, parent = sourceFiber.return;parent !== null; )
        parent.childLanes |= lane, alternate = parent.alternate, alternate !== null && (alternate.childLanes |= lane), parent.tag === 22 && (sourceFiber = parent.stateNode, sourceFiber === null || sourceFiber._visibility & OffscreenVisible || (isHidden = !0)), sourceFiber = parent, parent = parent.return;
      return sourceFiber.tag === 3 ? (parent = sourceFiber.stateNode, isHidden && update !== null && (isHidden = 31 - clz32(lane), sourceFiber = parent.hiddenUpdates, alternate = sourceFiber[isHidden], alternate === null ? sourceFiber[isHidden] = [update] : alternate.push(update), update.lane = lane | 536870912), parent) : null;
    }
    function getRootForUpdatedFiber(sourceFiber) {
      if (nestedUpdateCount > NESTED_UPDATE_LIMIT)
        throw nestedPassiveUpdateCount = nestedUpdateCount = 0, rootWithPassiveNestedUpdates = rootWithNestedUpdates = null, Error("Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.");
      nestedPassiveUpdateCount > NESTED_PASSIVE_UPDATE_LIMIT && (nestedPassiveUpdateCount = 0, rootWithPassiveNestedUpdates = null, console.error("Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.")), sourceFiber.alternate === null && (sourceFiber.flags & 4098) !== 0 && warnAboutUpdateOnNotYetMountedFiberInDEV(sourceFiber);
      for (var node = sourceFiber, parent = node.return;parent !== null; )
        node.alternate === null && (node.flags & 4098) !== 0 && warnAboutUpdateOnNotYetMountedFiberInDEV(sourceFiber), node = parent, parent = node.return;
      return node.tag === 3 ? node.stateNode : null;
    }
    function initializeUpdateQueue(fiber) {
      fiber.updateQueue = {
        baseState: fiber.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: { pending: null, lanes: 0, hiddenCallbacks: null },
        callbacks: null
      };
    }
    function cloneUpdateQueue(current2, workInProgress2) {
      current2 = current2.updateQueue, workInProgress2.updateQueue === current2 && (workInProgress2.updateQueue = {
        baseState: current2.baseState,
        firstBaseUpdate: current2.firstBaseUpdate,
        lastBaseUpdate: current2.lastBaseUpdate,
        shared: current2.shared,
        callbacks: null
      });
    }
    function createUpdate(lane) {
      return {
        lane,
        tag: UpdateState,
        payload: null,
        callback: null,
        next: null
      };
    }
    function enqueueUpdate(fiber, update, lane) {
      var updateQueue = fiber.updateQueue;
      if (updateQueue === null)
        return null;
      if (updateQueue = updateQueue.shared, currentlyProcessingQueue === updateQueue && !didWarnUpdateInsideUpdate) {
        var componentName2 = getComponentNameFromFiber(fiber);
        console.error(`An update (setState, replaceState, or forceUpdate) was scheduled from inside an update function. Update functions should be pure, with zero side-effects. Consider using componentDidUpdate or a callback.

Please update the following component: %s`, componentName2), didWarnUpdateInsideUpdate = !0;
      }
      if ((executionContext & RenderContext) !== NoContext)
        return componentName2 = updateQueue.pending, componentName2 === null ? update.next = update : (update.next = componentName2.next, componentName2.next = update), updateQueue.pending = update, update = getRootForUpdatedFiber(fiber), markUpdateLaneFromFiberToRoot(fiber, null, lane), update;
      return enqueueUpdate$1(fiber, updateQueue, update, lane), getRootForUpdatedFiber(fiber);
    }
    function entangleTransitions(root2, fiber, lane) {
      if (fiber = fiber.updateQueue, fiber !== null && (fiber = fiber.shared, (lane & 4194048) !== 0)) {
        var queueLanes = fiber.lanes;
        queueLanes &= root2.pendingLanes, lane |= queueLanes, fiber.lanes = lane, markRootEntangled(root2, lane);
      }
    }
    function enqueueCapturedUpdate(workInProgress2, capturedUpdate) {
      var { updateQueue: queue, alternate: current2 } = workInProgress2;
      if (current2 !== null && (current2 = current2.updateQueue, queue === current2)) {
        var newFirst = null, newLast = null;
        if (queue = queue.firstBaseUpdate, queue !== null) {
          do {
            var clone3 = {
              lane: queue.lane,
              tag: queue.tag,
              payload: queue.payload,
              callback: null,
              next: null
            };
            newLast === null ? newFirst = newLast = clone3 : newLast = newLast.next = clone3, queue = queue.next;
          } while (queue !== null);
          newLast === null ? newFirst = newLast = capturedUpdate : newLast = newLast.next = capturedUpdate;
        } else
          newFirst = newLast = capturedUpdate;
        queue = {
          baseState: current2.baseState,
          firstBaseUpdate: newFirst,
          lastBaseUpdate: newLast,
          shared: current2.shared,
          callbacks: current2.callbacks
        }, workInProgress2.updateQueue = queue;
        return;
      }
      workInProgress2 = queue.lastBaseUpdate, workInProgress2 === null ? queue.firstBaseUpdate = capturedUpdate : workInProgress2.next = capturedUpdate, queue.lastBaseUpdate = capturedUpdate;
    }
    function suspendIfUpdateReadFromEntangledAsyncAction() {
      if (didReadFromEntangledAsyncAction) {
        var entangledActionThenable = currentEntangledActionThenable;
        if (entangledActionThenable !== null)
          throw entangledActionThenable;
      }
    }
    function processUpdateQueue(workInProgress2, props, instance$jscomp$0, renderLanes2) {
      didReadFromEntangledAsyncAction = !1;
      var queue = workInProgress2.updateQueue;
      hasForceUpdate = !1, currentlyProcessingQueue = queue.shared;
      var { firstBaseUpdate, lastBaseUpdate } = queue, pendingQueue = queue.shared.pending;
      if (pendingQueue !== null) {
        queue.shared.pending = null;
        var lastPendingUpdate = pendingQueue, firstPendingUpdate = lastPendingUpdate.next;
        lastPendingUpdate.next = null, lastBaseUpdate === null ? firstBaseUpdate = firstPendingUpdate : lastBaseUpdate.next = firstPendingUpdate, lastBaseUpdate = lastPendingUpdate;
        var current2 = workInProgress2.alternate;
        current2 !== null && (current2 = current2.updateQueue, pendingQueue = current2.lastBaseUpdate, pendingQueue !== lastBaseUpdate && (pendingQueue === null ? current2.firstBaseUpdate = firstPendingUpdate : pendingQueue.next = firstPendingUpdate, current2.lastBaseUpdate = lastPendingUpdate));
      }
      if (firstBaseUpdate !== null) {
        var newState = queue.baseState;
        lastBaseUpdate = 0, current2 = firstPendingUpdate = lastPendingUpdate = null, pendingQueue = firstBaseUpdate;
        do {
          var updateLane = pendingQueue.lane & -536870913, isHiddenUpdate = updateLane !== pendingQueue.lane;
          if (isHiddenUpdate ? (workInProgressRootRenderLanes & updateLane) === updateLane : (renderLanes2 & updateLane) === updateLane) {
            updateLane !== 0 && updateLane === currentEntangledLane && (didReadFromEntangledAsyncAction = !0), current2 !== null && (current2 = current2.next = {
              lane: 0,
              tag: pendingQueue.tag,
              payload: pendingQueue.payload,
              callback: null,
              next: null
            });
            a: {
              updateLane = workInProgress2;
              var partialState = pendingQueue, nextProps = props, instance = instance$jscomp$0;
              switch (partialState.tag) {
                case ReplaceState:
                  if (partialState = partialState.payload, typeof partialState === "function") {
                    isDisallowedContextReadInDEV = !0;
                    var nextState = partialState.call(instance, newState, nextProps);
                    if (updateLane.mode & 8) {
                      setIsStrictModeForDevtools(!0);
                      try {
                        partialState.call(instance, newState, nextProps);
                      } finally {
                        setIsStrictModeForDevtools(!1);
                      }
                    }
                    isDisallowedContextReadInDEV = !1, newState = nextState;
                    break a;
                  }
                  newState = partialState;
                  break a;
                case CaptureUpdate:
                  updateLane.flags = updateLane.flags & -65537 | 128;
                case UpdateState:
                  if (nextState = partialState.payload, typeof nextState === "function") {
                    if (isDisallowedContextReadInDEV = !0, partialState = nextState.call(instance, newState, nextProps), updateLane.mode & 8) {
                      setIsStrictModeForDevtools(!0);
                      try {
                        nextState.call(instance, newState, nextProps);
                      } finally {
                        setIsStrictModeForDevtools(!1);
                      }
                    }
                    isDisallowedContextReadInDEV = !1;
                  } else
                    partialState = nextState;
                  if (partialState === null || partialState === void 0)
                    break a;
                  newState = assign({}, newState, partialState);
                  break a;
                case ForceUpdate:
                  hasForceUpdate = !0;
              }
            }
            updateLane = pendingQueue.callback, updateLane !== null && (workInProgress2.flags |= 64, isHiddenUpdate && (workInProgress2.flags |= 8192), isHiddenUpdate = queue.callbacks, isHiddenUpdate === null ? queue.callbacks = [updateLane] : isHiddenUpdate.push(updateLane));
          } else
            isHiddenUpdate = {
              lane: updateLane,
              tag: pendingQueue.tag,
              payload: pendingQueue.payload,
              callback: pendingQueue.callback,
              next: null
            }, current2 === null ? (firstPendingUpdate = current2 = isHiddenUpdate, lastPendingUpdate = newState) : current2 = current2.next = isHiddenUpdate, lastBaseUpdate |= updateLane;
          if (pendingQueue = pendingQueue.next, pendingQueue === null)
            if (pendingQueue = queue.shared.pending, pendingQueue === null)
              break;
            else
              isHiddenUpdate = pendingQueue, pendingQueue = isHiddenUpdate.next, isHiddenUpdate.next = null, queue.lastBaseUpdate = isHiddenUpdate, queue.shared.pending = null;
        } while (1);
        current2 === null && (lastPendingUpdate = newState), queue.baseState = lastPendingUpdate, queue.firstBaseUpdate = firstPendingUpdate, queue.lastBaseUpdate = current2, firstBaseUpdate === null && (queue.shared.lanes = 0), workInProgressRootSkippedLanes |= lastBaseUpdate, workInProgress2.lanes = lastBaseUpdate, workInProgress2.memoizedState = newState;
      }
      currentlyProcessingQueue = null;
    }
    function callCallback(callback, context3) {
      if (typeof callback !== "function")
        throw Error("Invalid argument passed as callback. Expected a function. Instead received: " + callback);
      callback.call(context3);
    }
    function commitHiddenCallbacks(updateQueue, context3) {
      var hiddenCallbacks = updateQueue.shared.hiddenCallbacks;
      if (hiddenCallbacks !== null)
        for (updateQueue.shared.hiddenCallbacks = null, updateQueue = 0;updateQueue < hiddenCallbacks.length; updateQueue++)
          callCallback(hiddenCallbacks[updateQueue], context3);
    }
    function commitCallbacks(updateQueue, context3) {
      var callbacks = updateQueue.callbacks;
      if (callbacks !== null)
        for (updateQueue.callbacks = null, updateQueue = 0;updateQueue < callbacks.length; updateQueue++)
          callCallback(callbacks[updateQueue], context3);
    }
    function pushHiddenContext(fiber, context3) {
      var prevEntangledRenderLanes = entangledRenderLanes;
      push(prevEntangledRenderLanesCursor, prevEntangledRenderLanes, fiber), push(currentTreeHiddenStackCursor, context3, fiber), entangledRenderLanes = prevEntangledRenderLanes | context3.baseLanes;
    }
    function reuseHiddenContextOnStack(fiber) {
      push(prevEntangledRenderLanesCursor, entangledRenderLanes, fiber), push(currentTreeHiddenStackCursor, currentTreeHiddenStackCursor.current, fiber);
    }
    function popHiddenContext(fiber) {
      entangledRenderLanes = prevEntangledRenderLanesCursor.current, pop(currentTreeHiddenStackCursor, fiber), pop(prevEntangledRenderLanesCursor, fiber);
    }
    function pushPrimaryTreeSuspenseHandler(handler) {
      var current2 = handler.alternate;
      push(suspenseStackCursor, suspenseStackCursor.current & SubtreeSuspenseContextMask, handler), push(suspenseHandlerStackCursor, handler, handler), shellBoundary === null && (current2 === null || currentTreeHiddenStackCursor.current !== null ? shellBoundary = handler : current2.memoizedState !== null && (shellBoundary = handler));
    }
    function pushDehydratedActivitySuspenseHandler(fiber) {
      push(suspenseStackCursor, suspenseStackCursor.current, fiber), push(suspenseHandlerStackCursor, fiber, fiber), shellBoundary === null && (shellBoundary = fiber);
    }
    function pushOffscreenSuspenseHandler(fiber) {
      fiber.tag === 22 ? (push(suspenseStackCursor, suspenseStackCursor.current, fiber), push(suspenseHandlerStackCursor, fiber, fiber), shellBoundary === null && (shellBoundary = fiber)) : reuseSuspenseHandlerOnStack(fiber);
    }
    function reuseSuspenseHandlerOnStack(fiber) {
      push(suspenseStackCursor, suspenseStackCursor.current, fiber), push(suspenseHandlerStackCursor, suspenseHandlerStackCursor.current, fiber);
    }
    function popSuspenseHandler(fiber) {
      pop(suspenseHandlerStackCursor, fiber), shellBoundary === fiber && (shellBoundary = null), pop(suspenseStackCursor, fiber);
    }
    function findFirstSuspended(row) {
      for (var node = row;node !== null; ) {
        if (node.tag === 13) {
          var state3 = node.memoizedState;
          if (state3 !== null && (state3 = state3.dehydrated, state3 === null || isSuspenseInstancePending(state3) || isSuspenseInstanceFallback(state3)))
            return node;
        } else if (node.tag === 19 && (node.memoizedProps.revealOrder === "forwards" || node.memoizedProps.revealOrder === "backwards" || node.memoizedProps.revealOrder === "unstable_legacy-backwards" || node.memoizedProps.revealOrder === "together")) {
          if ((node.flags & 128) !== 0)
            return node;
        } else if (node.child !== null) {
          node.child.return = node, node = node.child;
          continue;
        }
        if (node === row)
          break;
        for (;node.sibling === null; ) {
          if (node.return === null || node.return === row)
            return null;
          node = node.return;
        }
        node.sibling.return = node.return, node = node.sibling;
      }
      return null;
    }
    function mountHookTypesDev() {
      var hookName = currentHookNameInDev;
      hookTypesDev === null ? hookTypesDev = [hookName] : hookTypesDev.push(hookName);
    }
    function updateHookTypesDev() {
      var hookName = currentHookNameInDev;
      if (hookTypesDev !== null && (hookTypesUpdateIndexDev++, hookTypesDev[hookTypesUpdateIndexDev] !== hookName)) {
        var componentName2 = getComponentNameFromFiber(currentlyRenderingFiber);
        if (!didWarnAboutMismatchedHooksForComponent.has(componentName2) && (didWarnAboutMismatchedHooksForComponent.add(componentName2), hookTypesDev !== null)) {
          for (var table = "", i4 = 0;i4 <= hookTypesUpdateIndexDev; i4++) {
            var oldHookName = hookTypesDev[i4], newHookName = i4 === hookTypesUpdateIndexDev ? hookName : oldHookName;
            for (oldHookName = i4 + 1 + ". " + oldHookName;30 > oldHookName.length; )
              oldHookName += " ";
            oldHookName += newHookName + `
`, table += oldHookName;
          }
          console.error(`React has detected a change in the order of Hooks called by %s. This will lead to bugs and errors if not fixed. For more information, read the Rules of Hooks: https://react.dev/link/rules-of-hooks

   Previous render            Next render
   ------------------------------------------------------
%s   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
`, componentName2, table);
        }
      }
    }
    function checkDepsAreArrayDev(deps) {
      deps === void 0 || deps === null || isArrayImpl(deps) || console.error("%s received a final argument that is not an array (instead, received `%s`). When specified, the final argument must be an array.", currentHookNameInDev, typeof deps);
    }
    function warnOnUseFormStateInDev() {
      var componentName2 = getComponentNameFromFiber(currentlyRenderingFiber);
      didWarnAboutUseFormState.has(componentName2) || (didWarnAboutUseFormState.add(componentName2), console.error("ReactDOM.useFormState has been renamed to React.useActionState. Please update %s to use React.useActionState.", componentName2));
    }
    function throwInvalidHookError() {
      throw Error(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem.`);
    }
    function areHookInputsEqual(nextDeps, prevDeps) {
      if (ignorePreviousDependencies)
        return !1;
      if (prevDeps === null)
        return console.error("%s received a final argument during this render, but not during the previous render. Even though the final argument is optional, its type cannot change between renders.", currentHookNameInDev), !1;
      nextDeps.length !== prevDeps.length && console.error(`The final argument passed to %s changed size between renders. The order and size of this array must remain constant.

Previous: %s
Incoming: %s`, currentHookNameInDev, "[" + prevDeps.join(", ") + "]", "[" + nextDeps.join(", ") + "]");
      for (var i4 = 0;i4 < prevDeps.length && i4 < nextDeps.length; i4++)
        if (!objectIs(nextDeps[i4], prevDeps[i4]))
          return !1;
      return !0;
    }
    function renderWithHooks(current2, workInProgress2, Component, props, secondArg, nextRenderLanes) {
      if (renderLanes = nextRenderLanes, currentlyRenderingFiber = workInProgress2, hookTypesDev = current2 !== null ? current2._debugHookTypes : null, hookTypesUpdateIndexDev = -1, ignorePreviousDependencies = current2 !== null && current2.type !== workInProgress2.type, Object.prototype.toString.call(Component) === "[object AsyncFunction]" || Object.prototype.toString.call(Component) === "[object AsyncGeneratorFunction]")
        nextRenderLanes = getComponentNameFromFiber(currentlyRenderingFiber), didWarnAboutAsyncClientComponent.has(nextRenderLanes) || (didWarnAboutAsyncClientComponent.add(nextRenderLanes), console.error("%s is an async Client Component. Only Server Components can be async at the moment. This error is often caused by accidentally adding `'use client'` to a module that was originally written for the server.", nextRenderLanes === null ? "An unknown Component" : "<" + nextRenderLanes + ">"));
      workInProgress2.memoizedState = null, workInProgress2.updateQueue = null, workInProgress2.lanes = 0, ReactSharedInternals.H = current2 !== null && current2.memoizedState !== null ? HooksDispatcherOnUpdateInDEV : hookTypesDev !== null ? HooksDispatcherOnMountWithHookTypesInDEV : HooksDispatcherOnMountInDEV, shouldDoubleInvokeUserFnsInHooksDEV = nextRenderLanes = (workInProgress2.mode & 8) !== NoMode;
      var children = callComponentInDEV(Component, props, secondArg);
      if (shouldDoubleInvokeUserFnsInHooksDEV = !1, didScheduleRenderPhaseUpdateDuringThisPass && (children = renderWithHooksAgain(workInProgress2, Component, props, secondArg)), nextRenderLanes) {
        setIsStrictModeForDevtools(!0);
        try {
          children = renderWithHooksAgain(workInProgress2, Component, props, secondArg);
        } finally {
          setIsStrictModeForDevtools(!1);
        }
      }
      return finishRenderingHooks(current2, workInProgress2), children;
    }
    function finishRenderingHooks(current2, workInProgress2) {
      workInProgress2._debugHookTypes = hookTypesDev, workInProgress2.dependencies === null ? thenableState !== null && (workInProgress2.dependencies = {
        lanes: 0,
        firstContext: null,
        _debugThenableState: thenableState
      }) : workInProgress2.dependencies._debugThenableState = thenableState, ReactSharedInternals.H = ContextOnlyDispatcher;
      var didRenderTooFewHooks = currentHook !== null && currentHook.next !== null;
      if (renderLanes = 0, hookTypesDev = currentHookNameInDev = workInProgressHook = currentHook = currentlyRenderingFiber = null, hookTypesUpdateIndexDev = -1, current2 !== null && (current2.flags & 65011712) !== (workInProgress2.flags & 65011712) && console.error("Internal React error: Expected static flag was missing. Please notify the React team."), didScheduleRenderPhaseUpdate = !1, thenableIndexCounter = 0, thenableState = null, didRenderTooFewHooks)
        throw Error("Rendered fewer hooks than expected. This may be caused by an accidental early return statement.");
      current2 === null || didReceiveUpdate || (current2 = current2.dependencies, current2 !== null && checkIfContextChanged(current2) && (didReceiveUpdate = !0)), needsToResetSuspendedThenableDEV ? (needsToResetSuspendedThenableDEV = !1, current2 = !0) : current2 = !1, current2 && (workInProgress2 = getComponentNameFromFiber(workInProgress2) || "Unknown", didWarnAboutUseWrappedInTryCatch.has(workInProgress2) || didWarnAboutAsyncClientComponent.has(workInProgress2) || (didWarnAboutUseWrappedInTryCatch.add(workInProgress2), console.error("`use` was called from inside a try/catch block. This is not allowed and can lead to unexpected behavior. To handle errors triggered by `use`, wrap your component in a error boundary.")));
    }
    function renderWithHooksAgain(workInProgress2, Component, props, secondArg) {
      currentlyRenderingFiber = workInProgress2;
      var numberOfReRenders = 0;
      do {
        if (didScheduleRenderPhaseUpdateDuringThisPass && (thenableState = null), thenableIndexCounter = 0, didScheduleRenderPhaseUpdateDuringThisPass = !1, numberOfReRenders >= RE_RENDER_LIMIT)
          throw Error("Too many re-renders. React limits the number of renders to prevent an infinite loop.");
        if (numberOfReRenders += 1, ignorePreviousDependencies = !1, workInProgressHook = currentHook = null, workInProgress2.updateQueue != null) {
          var children = workInProgress2.updateQueue;
          children.lastEffect = null, children.events = null, children.stores = null, children.memoCache != null && (children.memoCache.index = 0);
        }
        hookTypesUpdateIndexDev = -1, ReactSharedInternals.H = HooksDispatcherOnRerenderInDEV, children = callComponentInDEV(Component, props, secondArg);
      } while (didScheduleRenderPhaseUpdateDuringThisPass);
      return children;
    }
    function TransitionAwareHostComponent() {
      var dispatcher = ReactSharedInternals.H, maybeThenable = dispatcher.useState()[0];
      return maybeThenable = typeof maybeThenable.then === "function" ? useThenable(maybeThenable) : maybeThenable, dispatcher = dispatcher.useState()[0], (currentHook !== null ? currentHook.memoizedState : null) !== dispatcher && (currentlyRenderingFiber.flags |= 1024), maybeThenable;
    }
    function checkDidRenderIdHook() {
      var didRenderIdHook = localIdCounter !== 0;
      return localIdCounter = 0, didRenderIdHook;
    }
    function bailoutHooks(current2, workInProgress2, lanes) {
      workInProgress2.updateQueue = current2.updateQueue, workInProgress2.flags = (workInProgress2.mode & 16) !== NoMode ? workInProgress2.flags & -402655237 : workInProgress2.flags & -2053, current2.lanes &= ~lanes;
    }
    function resetHooksOnUnwind(workInProgress2) {
      if (didScheduleRenderPhaseUpdate) {
        for (workInProgress2 = workInProgress2.memoizedState;workInProgress2 !== null; ) {
          var queue = workInProgress2.queue;
          queue !== null && (queue.pending = null), workInProgress2 = workInProgress2.next;
        }
        didScheduleRenderPhaseUpdate = !1;
      }
      renderLanes = 0, hookTypesDev = workInProgressHook = currentHook = currentlyRenderingFiber = null, hookTypesUpdateIndexDev = -1, currentHookNameInDev = null, didScheduleRenderPhaseUpdateDuringThisPass = !1, thenableIndexCounter = localIdCounter = 0, thenableState = null;
    }
    function mountWorkInProgressHook() {
      var hook = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null
      };
      return workInProgressHook === null ? currentlyRenderingFiber.memoizedState = workInProgressHook = hook : workInProgressHook = workInProgressHook.next = hook, workInProgressHook;
    }
    function updateWorkInProgressHook() {
      if (currentHook === null) {
        var nextCurrentHook = currentlyRenderingFiber.alternate;
        nextCurrentHook = nextCurrentHook !== null ? nextCurrentHook.memoizedState : null;
      } else
        nextCurrentHook = currentHook.next;
      var nextWorkInProgressHook = workInProgressHook === null ? currentlyRenderingFiber.memoizedState : workInProgressHook.next;
      if (nextWorkInProgressHook !== null)
        workInProgressHook = nextWorkInProgressHook, currentHook = nextCurrentHook;
      else {
        if (nextCurrentHook === null) {
          if (currentlyRenderingFiber.alternate === null)
            throw Error("Update hook called on initial render. This is likely a bug in React. Please file an issue.");
          throw Error("Rendered more hooks than during the previous render.");
        }
        currentHook = nextCurrentHook, nextCurrentHook = {
          memoizedState: currentHook.memoizedState,
          baseState: currentHook.baseState,
          baseQueue: currentHook.baseQueue,
          queue: currentHook.queue,
          next: null
        }, workInProgressHook === null ? currentlyRenderingFiber.memoizedState = workInProgressHook = nextCurrentHook : workInProgressHook = workInProgressHook.next = nextCurrentHook;
      }
      return workInProgressHook;
    }
    function createFunctionComponentUpdateQueue() {
      return { lastEffect: null, events: null, stores: null, memoCache: null };
    }
    function useThenable(thenable) {
      var index = thenableIndexCounter;
      return thenableIndexCounter += 1, thenableState === null && (thenableState = createThenableState()), thenable = trackUsedThenable(thenableState, thenable, index), index = currentlyRenderingFiber, (workInProgressHook === null ? index.memoizedState : workInProgressHook.next) === null && (index = index.alternate, ReactSharedInternals.H = index !== null && index.memoizedState !== null ? HooksDispatcherOnUpdateInDEV : HooksDispatcherOnMountInDEV), thenable;
    }
    function use(usable) {
      if (usable !== null && typeof usable === "object") {
        if (typeof usable.then === "function")
          return useThenable(usable);
        if (usable.$$typeof === REACT_CONTEXT_TYPE)
          return readContext(usable);
      }
      throw Error("An unsupported type was passed to use(): " + String(usable));
    }
    function useMemoCache(size) {
      var memoCache = null, updateQueue = currentlyRenderingFiber.updateQueue;
      if (updateQueue !== null && (memoCache = updateQueue.memoCache), memoCache == null) {
        var current2 = currentlyRenderingFiber.alternate;
        current2 !== null && (current2 = current2.updateQueue, current2 !== null && (current2 = current2.memoCache, current2 != null && (memoCache = {
          data: current2.data.map(function(array2) {
            return array2.slice();
          }),
          index: 0
        })));
      }
      if (memoCache == null && (memoCache = { data: [], index: 0 }), updateQueue === null && (updateQueue = createFunctionComponentUpdateQueue(), currentlyRenderingFiber.updateQueue = updateQueue), updateQueue.memoCache = memoCache, updateQueue = memoCache.data[memoCache.index], updateQueue === void 0 || ignorePreviousDependencies)
        for (updateQueue = memoCache.data[memoCache.index] = Array(size), current2 = 0;current2 < size; current2++)
          updateQueue[current2] = REACT_MEMO_CACHE_SENTINEL;
      else
        updateQueue.length !== size && console.error("Expected a constant size argument for each invocation of useMemoCache. The previous cache was allocated with size %s but size %s was requested.", updateQueue.length, size);
      return memoCache.index++, updateQueue;
    }
    function basicStateReducer(state3, action) {
      return typeof action === "function" ? action(state3) : action;
    }
    function mountReducer(reducer, initialArg, init) {
      var hook = mountWorkInProgressHook();
      if (init !== void 0) {
        var initialState = init(initialArg);
        if (shouldDoubleInvokeUserFnsInHooksDEV) {
          setIsStrictModeForDevtools(!0);
          try {
            init(initialArg);
          } finally {
            setIsStrictModeForDevtools(!1);
          }
        }
      } else
        initialState = initialArg;
      return hook.memoizedState = hook.baseState = initialState, reducer = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: reducer,
        lastRenderedState: initialState
      }, hook.queue = reducer, reducer = reducer.dispatch = dispatchReducerAction.bind(null, currentlyRenderingFiber, reducer), [hook.memoizedState, reducer];
    }
    function updateReducer(reducer) {
      var hook = updateWorkInProgressHook();
      return updateReducerImpl(hook, currentHook, reducer);
    }
    function updateReducerImpl(hook, current2, reducer) {
      var queue = hook.queue;
      if (queue === null)
        throw Error("Should have a queue. You are likely calling Hooks conditionally, which is not allowed. (https://react.dev/link/invalid-hook-call)");
      queue.lastRenderedReducer = reducer;
      var baseQueue = hook.baseQueue, pendingQueue = queue.pending;
      if (pendingQueue !== null) {
        if (baseQueue !== null) {
          var baseFirst = baseQueue.next;
          baseQueue.next = pendingQueue.next, pendingQueue.next = baseFirst;
        }
        current2.baseQueue !== baseQueue && console.error("Internal error: Expected work-in-progress queue to be a clone. This is a bug in React."), current2.baseQueue = baseQueue = pendingQueue, queue.pending = null;
      }
      if (pendingQueue = hook.baseState, baseQueue === null)
        hook.memoizedState = pendingQueue;
      else {
        current2 = baseQueue.next;
        var newBaseQueueFirst = baseFirst = null, newBaseQueueLast = null, update = current2, didReadFromEntangledAsyncAction2 = !1;
        do {
          var updateLane = update.lane & -536870913;
          if (updateLane !== update.lane ? (workInProgressRootRenderLanes & updateLane) === updateLane : (renderLanes & updateLane) === updateLane) {
            var revertLane = update.revertLane;
            if (revertLane === 0)
              newBaseQueueLast !== null && (newBaseQueueLast = newBaseQueueLast.next = {
                lane: 0,
                revertLane: 0,
                gesture: null,
                action: update.action,
                hasEagerState: update.hasEagerState,
                eagerState: update.eagerState,
                next: null
              }), updateLane === currentEntangledLane && (didReadFromEntangledAsyncAction2 = !0);
            else if ((renderLanes & revertLane) === revertLane) {
              update = update.next, revertLane === currentEntangledLane && (didReadFromEntangledAsyncAction2 = !0);
              continue;
            } else
              updateLane = {
                lane: 0,
                revertLane: update.revertLane,
                gesture: null,
                action: update.action,
                hasEagerState: update.hasEagerState,
                eagerState: update.eagerState,
                next: null
              }, newBaseQueueLast === null ? (newBaseQueueFirst = newBaseQueueLast = updateLane, baseFirst = pendingQueue) : newBaseQueueLast = newBaseQueueLast.next = updateLane, currentlyRenderingFiber.lanes |= revertLane, workInProgressRootSkippedLanes |= revertLane;
            updateLane = update.action, shouldDoubleInvokeUserFnsInHooksDEV && reducer(pendingQueue, updateLane), pendingQueue = update.hasEagerState ? update.eagerState : reducer(pendingQueue, updateLane);
          } else
            revertLane = {
              lane: updateLane,
              revertLane: update.revertLane,
              gesture: update.gesture,
              action: update.action,
              hasEagerState: update.hasEagerState,
              eagerState: update.eagerState,
              next: null
            }, newBaseQueueLast === null ? (newBaseQueueFirst = newBaseQueueLast = revertLane, baseFirst = pendingQueue) : newBaseQueueLast = newBaseQueueLast.next = revertLane, currentlyRenderingFiber.lanes |= updateLane, workInProgressRootSkippedLanes |= updateLane;
          update = update.next;
        } while (update !== null && update !== current2);
        if (newBaseQueueLast === null ? baseFirst = pendingQueue : newBaseQueueLast.next = newBaseQueueFirst, !objectIs(pendingQueue, hook.memoizedState) && (didReceiveUpdate = !0, didReadFromEntangledAsyncAction2 && (reducer = currentEntangledActionThenable, reducer !== null)))
          throw reducer;
        hook.memoizedState = pendingQueue, hook.baseState = baseFirst, hook.baseQueue = newBaseQueueLast, queue.lastRenderedState = pendingQueue;
      }
      return baseQueue === null && (queue.lanes = 0), [hook.memoizedState, queue.dispatch];
    }
    function rerenderReducer(reducer) {
      var hook = updateWorkInProgressHook(), queue = hook.queue;
      if (queue === null)
        throw Error("Should have a queue. You are likely calling Hooks conditionally, which is not allowed. (https://react.dev/link/invalid-hook-call)");
      queue.lastRenderedReducer = reducer;
      var { dispatch, pending: lastRenderPhaseUpdate } = queue, newState = hook.memoizedState;
      if (lastRenderPhaseUpdate !== null) {
        queue.pending = null;
        var update = lastRenderPhaseUpdate = lastRenderPhaseUpdate.next;
        do
          newState = reducer(newState, update.action), update = update.next;
        while (update !== lastRenderPhaseUpdate);
        objectIs(newState, hook.memoizedState) || (didReceiveUpdate = !0), hook.memoizedState = newState, hook.baseQueue === null && (hook.baseState = newState), queue.lastRenderedState = newState;
      }
      return [newState, dispatch];
    }
    function mountSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
      var fiber = currentlyRenderingFiber, hook = mountWorkInProgressHook();
      if (isHydrating) {
        if (getServerSnapshot === void 0)
          throw Error("Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.");
        var nextSnapshot = getServerSnapshot();
        didWarnUncachedGetSnapshot || nextSnapshot === getServerSnapshot() || (console.error("The result of getServerSnapshot should be cached to avoid an infinite loop"), didWarnUncachedGetSnapshot = !0);
      } else {
        if (nextSnapshot = getSnapshot(), didWarnUncachedGetSnapshot || (getServerSnapshot = getSnapshot(), objectIs(nextSnapshot, getServerSnapshot) || (console.error("The result of getSnapshot should be cached to avoid an infinite loop"), didWarnUncachedGetSnapshot = !0)), workInProgressRoot === null)
          throw Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        (workInProgressRootRenderLanes & 127) !== 0 || pushStoreConsistencyCheck(fiber, getSnapshot, nextSnapshot);
      }
      return hook.memoizedState = nextSnapshot, getServerSnapshot = { value: nextSnapshot, getSnapshot }, hook.queue = getServerSnapshot, mountEffect(subscribeToStore.bind(null, fiber, getServerSnapshot, subscribe), [subscribe]), fiber.flags |= 2048, pushSimpleEffect(HasEffect | Passive, { destroy: void 0 }, updateStoreInstance.bind(null, fiber, getServerSnapshot, nextSnapshot, getSnapshot), null), nextSnapshot;
    }
    function updateSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
      var fiber = currentlyRenderingFiber, hook = updateWorkInProgressHook(), isHydrating$jscomp$0 = isHydrating;
      if (isHydrating$jscomp$0) {
        if (getServerSnapshot === void 0)
          throw Error("Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.");
        getServerSnapshot = getServerSnapshot();
      } else if (getServerSnapshot = getSnapshot(), !didWarnUncachedGetSnapshot) {
        var cachedSnapshot = getSnapshot();
        objectIs(getServerSnapshot, cachedSnapshot) || (console.error("The result of getSnapshot should be cached to avoid an infinite loop"), didWarnUncachedGetSnapshot = !0);
      }
      if (cachedSnapshot = !objectIs((currentHook || hook).memoizedState, getServerSnapshot))
        hook.memoizedState = getServerSnapshot, didReceiveUpdate = !0;
      hook = hook.queue;
      var create = subscribeToStore.bind(null, fiber, hook, subscribe);
      if (updateEffectImpl(2048, Passive, create, [subscribe]), hook.getSnapshot !== getSnapshot || cachedSnapshot || workInProgressHook !== null && workInProgressHook.memoizedState.tag & HasEffect) {
        if (fiber.flags |= 2048, pushSimpleEffect(HasEffect | Passive, { destroy: void 0 }, updateStoreInstance.bind(null, fiber, hook, getServerSnapshot, getSnapshot), null), workInProgressRoot === null)
          throw Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        isHydrating$jscomp$0 || (renderLanes & 127) !== 0 || pushStoreConsistencyCheck(fiber, getSnapshot, getServerSnapshot);
      }
      return getServerSnapshot;
    }
    function pushStoreConsistencyCheck(fiber, getSnapshot, renderedSnapshot) {
      fiber.flags |= 16384, fiber = { getSnapshot, value: renderedSnapshot }, getSnapshot = currentlyRenderingFiber.updateQueue, getSnapshot === null ? (getSnapshot = createFunctionComponentUpdateQueue(), currentlyRenderingFiber.updateQueue = getSnapshot, getSnapshot.stores = [fiber]) : (renderedSnapshot = getSnapshot.stores, renderedSnapshot === null ? getSnapshot.stores = [fiber] : renderedSnapshot.push(fiber));
    }
    function updateStoreInstance(fiber, inst, nextSnapshot, getSnapshot) {
      inst.value = nextSnapshot, inst.getSnapshot = getSnapshot, checkIfSnapshotChanged(inst) && forceStoreRerender(fiber);
    }
    function subscribeToStore(fiber, inst, subscribe) {
      return subscribe(function() {
        checkIfSnapshotChanged(inst) && (startUpdateTimerByLane(2, "updateSyncExternalStore()", fiber), forceStoreRerender(fiber));
      });
    }
    function checkIfSnapshotChanged(inst) {
      var latestGetSnapshot = inst.getSnapshot;
      inst = inst.value;
      try {
        var nextValue = latestGetSnapshot();
        return !objectIs(inst, nextValue);
      } catch (error44) {
        return !0;
      }
    }
    function forceStoreRerender(fiber) {
      var root2 = enqueueConcurrentRenderForLane(fiber, 2);
      root2 !== null && scheduleUpdateOnFiber(root2, fiber, 2);
    }
    function mountStateImpl(initialState) {
      var hook = mountWorkInProgressHook();
      if (typeof initialState === "function") {
        var initialStateInitializer = initialState;
        if (initialState = initialStateInitializer(), shouldDoubleInvokeUserFnsInHooksDEV) {
          setIsStrictModeForDevtools(!0);
          try {
            initialStateInitializer();
          } finally {
            setIsStrictModeForDevtools(!1);
          }
        }
      }
      return hook.memoizedState = hook.baseState = initialState, hook.queue = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: basicStateReducer,
        lastRenderedState: initialState
      }, hook;
    }
    function mountState(initialState) {
      initialState = mountStateImpl(initialState);
      var queue = initialState.queue, dispatch = dispatchSetState.bind(null, currentlyRenderingFiber, queue);
      return queue.dispatch = dispatch, [initialState.memoizedState, dispatch];
    }
    function mountOptimistic(passthrough) {
      var hook = mountWorkInProgressHook();
      hook.memoizedState = hook.baseState = passthrough;
      var queue = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return hook.queue = queue, hook = dispatchOptimisticSetState.bind(null, currentlyRenderingFiber, !0, queue), queue.dispatch = hook, [passthrough, hook];
    }
    function updateOptimistic(passthrough, reducer) {
      var hook = updateWorkInProgressHook();
      return updateOptimisticImpl(hook, currentHook, passthrough, reducer);
    }
    function updateOptimisticImpl(hook, current2, passthrough, reducer) {
      return hook.baseState = passthrough, updateReducerImpl(hook, currentHook, typeof reducer === "function" ? reducer : basicStateReducer);
    }
    function rerenderOptimistic(passthrough, reducer) {
      var hook = updateWorkInProgressHook();
      if (currentHook !== null)
        return updateOptimisticImpl(hook, currentHook, passthrough, reducer);
      return hook.baseState = passthrough, [passthrough, hook.queue.dispatch];
    }
    function dispatchActionState(fiber, actionQueue, setPendingState, setState, payload) {
      if (isRenderPhaseUpdate(fiber))
        throw Error("Cannot update form state while rendering.");
      if (fiber = actionQueue.action, fiber !== null) {
        var actionNode = {
          payload,
          action: fiber,
          next: null,
          isTransition: !0,
          status: "pending",
          value: null,
          reason: null,
          listeners: [],
          then: function(listener) {
            actionNode.listeners.push(listener);
          }
        };
        ReactSharedInternals.T !== null ? setPendingState(!0) : actionNode.isTransition = !1, setState(actionNode), setPendingState = actionQueue.pending, setPendingState === null ? (actionNode.next = actionQueue.pending = actionNode, runActionStateAction(actionQueue, actionNode)) : (actionNode.next = setPendingState.next, actionQueue.pending = setPendingState.next = actionNode);
      }
    }
    function runActionStateAction(actionQueue, node) {
      var { action, payload } = node, prevState = actionQueue.state;
      if (node.isTransition) {
        var prevTransition = ReactSharedInternals.T, currentTransition = {};
        currentTransition._updatedFibers = /* @__PURE__ */ new Set, ReactSharedInternals.T = currentTransition;
        try {
          var returnValue = action(prevState, payload), onStartTransitionFinish = ReactSharedInternals.S;
          onStartTransitionFinish !== null && onStartTransitionFinish(currentTransition, returnValue), handleActionReturnValue(actionQueue, node, returnValue);
        } catch (error44) {
          onActionError(actionQueue, node, error44);
        } finally {
          prevTransition !== null && currentTransition.types !== null && (prevTransition.types !== null && prevTransition.types !== currentTransition.types && console.error("We expected inner Transitions to have transferred the outer types set and that you cannot add to the outer Transition while inside the inner.This is a bug in React."), prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition, prevTransition === null && currentTransition._updatedFibers && (actionQueue = currentTransition._updatedFibers.size, currentTransition._updatedFibers.clear(), 10 < actionQueue && console.warn("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."));
        }
      } else
        try {
          currentTransition = action(prevState, payload), handleActionReturnValue(actionQueue, node, currentTransition);
        } catch (error$2) {
          onActionError(actionQueue, node, error$2);
        }
    }
    function handleActionReturnValue(actionQueue, node, returnValue) {
      returnValue !== null && typeof returnValue === "object" && typeof returnValue.then === "function" ? (ReactSharedInternals.asyncTransitions++, returnValue.then(releaseAsyncTransition, releaseAsyncTransition), returnValue.then(function(nextState) {
        onActionSuccess(actionQueue, node, nextState);
      }, function(error44) {
        return onActionError(actionQueue, node, error44);
      }), node.isTransition || console.error("An async function with useActionState was called outside of a transition. This is likely not what you intended (for example, isPending will not update correctly). Either call the returned function inside startTransition, or pass it to an `action` or `formAction` prop.")) : onActionSuccess(actionQueue, node, returnValue);
    }
    function onActionSuccess(actionQueue, actionNode, nextState) {
      actionNode.status = "fulfilled", actionNode.value = nextState, notifyActionListeners(actionNode), actionQueue.state = nextState, actionNode = actionQueue.pending, actionNode !== null && (nextState = actionNode.next, nextState === actionNode ? actionQueue.pending = null : (nextState = nextState.next, actionNode.next = nextState, runActionStateAction(actionQueue, nextState)));
    }
    function onActionError(actionQueue, actionNode, error44) {
      var last = actionQueue.pending;
      if (actionQueue.pending = null, last !== null) {
        last = last.next;
        do
          actionNode.status = "rejected", actionNode.reason = error44, notifyActionListeners(actionNode), actionNode = actionNode.next;
        while (actionNode !== last);
      }
      actionQueue.action = null;
    }
    function notifyActionListeners(actionNode) {
      actionNode = actionNode.listeners;
      for (var i4 = 0;i4 < actionNode.length; i4++)
        (0, actionNode[i4])();
    }
    function actionStateReducer(oldState, newState) {
      return newState;
    }
    function mountActionState(action, initialStateProp) {
      if (isHydrating) {
        var ssrFormState = workInProgressRoot.formState;
        if (ssrFormState !== null) {
          a: {
            var isMatching = currentlyRenderingFiber;
            if (isHydrating) {
              if (nextHydratableInstance) {
                var markerInstance = canHydrateFormStateMarker(nextHydratableInstance, rootOrSingletonContext);
                if (markerInstance) {
                  nextHydratableInstance = getNextHydratableSibling(markerInstance), isMatching = isFormStateMarkerMatching(markerInstance);
                  break a;
                }
              }
              throwOnHydrationMismatch(isMatching);
            }
            isMatching = !1;
          }
          isMatching && (initialStateProp = ssrFormState[0]);
        }
      }
      ssrFormState = mountWorkInProgressHook(), ssrFormState.memoizedState = ssrFormState.baseState = initialStateProp, isMatching = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: actionStateReducer,
        lastRenderedState: initialStateProp
      }, ssrFormState.queue = isMatching, ssrFormState = dispatchSetState.bind(null, currentlyRenderingFiber, isMatching), isMatching.dispatch = ssrFormState, isMatching = mountStateImpl(!1);
      var setPendingState = dispatchOptimisticSetState.bind(null, currentlyRenderingFiber, !1, isMatching.queue);
      return isMatching = mountWorkInProgressHook(), markerInstance = {
        state: initialStateProp,
        dispatch: null,
        action,
        pending: null
      }, isMatching.queue = markerInstance, ssrFormState = dispatchActionState.bind(null, currentlyRenderingFiber, markerInstance, setPendingState, ssrFormState), markerInstance.dispatch = ssrFormState, isMatching.memoizedState = action, [initialStateProp, ssrFormState, !1];
    }
    function updateActionState(action) {
      var stateHook = updateWorkInProgressHook();
      return updateActionStateImpl(stateHook, currentHook, action);
    }
    function updateActionStateImpl(stateHook, currentStateHook, action) {
      if (currentStateHook = updateReducerImpl(stateHook, currentStateHook, actionStateReducer)[0], stateHook = updateReducer(basicStateReducer)[0], typeof currentStateHook === "object" && currentStateHook !== null && typeof currentStateHook.then === "function")
        try {
          var state3 = useThenable(currentStateHook);
        } catch (x3) {
          if (x3 === SuspenseException)
            throw SuspenseActionException;
          throw x3;
        }
      else
        state3 = currentStateHook;
      currentStateHook = updateWorkInProgressHook();
      var actionQueue = currentStateHook.queue, dispatch = actionQueue.dispatch;
      return action !== currentStateHook.memoizedState && (currentlyRenderingFiber.flags |= 2048, pushSimpleEffect(HasEffect | Passive, { destroy: void 0 }, actionStateActionEffect.bind(null, actionQueue, action), null)), [state3, dispatch, stateHook];
    }
    function actionStateActionEffect(actionQueue, action) {
      actionQueue.action = action;
    }
    function rerenderActionState(action) {
      var stateHook = updateWorkInProgressHook(), currentStateHook = currentHook;
      if (currentStateHook !== null)
        return updateActionStateImpl(stateHook, currentStateHook, action);
      updateWorkInProgressHook(), stateHook = stateHook.memoizedState, currentStateHook = updateWorkInProgressHook();
      var dispatch = currentStateHook.queue.dispatch;
      return currentStateHook.memoizedState = action, [stateHook, dispatch, !1];
    }
    function pushSimpleEffect(tag, inst, create, deps) {
      return tag = { tag, create, deps, inst, next: null }, inst = currentlyRenderingFiber.updateQueue, inst === null && (inst = createFunctionComponentUpdateQueue(), currentlyRenderingFiber.updateQueue = inst), create = inst.lastEffect, create === null ? inst.lastEffect = tag.next = tag : (deps = create.next, create.next = tag, tag.next = deps, inst.lastEffect = tag), tag;
    }
    function mountRef(initialValue) {
      var hook = mountWorkInProgressHook();
      return initialValue = { current: initialValue }, hook.memoizedState = initialValue;
    }
    function mountEffectImpl(fiberFlags, hookFlags, create, deps) {
      var hook = mountWorkInProgressHook();
      currentlyRenderingFiber.flags |= fiberFlags, hook.memoizedState = pushSimpleEffect(HasEffect | hookFlags, { destroy: void 0 }, create, deps === void 0 ? null : deps);
    }
    function updateEffectImpl(fiberFlags, hookFlags, create, deps) {
      var hook = updateWorkInProgressHook();
      deps = deps === void 0 ? null : deps;
      var inst = hook.memoizedState.inst;
      currentHook !== null && deps !== null && areHookInputsEqual(deps, currentHook.memoizedState.deps) ? hook.memoizedState = pushSimpleEffect(hookFlags, inst, create, deps) : (currentlyRenderingFiber.flags |= fiberFlags, hook.memoizedState = pushSimpleEffect(HasEffect | hookFlags, inst, create, deps));
    }
    function mountEffect(create, deps) {
      (currentlyRenderingFiber.mode & 16) !== NoMode ? mountEffectImpl(276826112, Passive, create, deps) : mountEffectImpl(8390656, Passive, create, deps);
    }
    function useEffectEventImpl(payload) {
      currentlyRenderingFiber.flags |= 4;
      var componentUpdateQueue = currentlyRenderingFiber.updateQueue;
      if (componentUpdateQueue === null)
        componentUpdateQueue = createFunctionComponentUpdateQueue(), currentlyRenderingFiber.updateQueue = componentUpdateQueue, componentUpdateQueue.events = [payload];
      else {
        var events = componentUpdateQueue.events;
        events === null ? componentUpdateQueue.events = [payload] : events.push(payload);
      }
    }
    function mountEvent(callback) {
      var hook = mountWorkInProgressHook(), ref = { impl: callback };
      return hook.memoizedState = ref, function() {
        if ((executionContext & RenderContext) !== NoContext)
          throw Error("A function wrapped in useEffectEvent can't be called during rendering.");
        return ref.impl.apply(void 0, arguments);
      };
    }
    function updateEvent(callback) {
      var ref = updateWorkInProgressHook().memoizedState;
      return useEffectEventImpl({ ref, nextImpl: callback }), function() {
        if ((executionContext & RenderContext) !== NoContext)
          throw Error("A function wrapped in useEffectEvent can't be called during rendering.");
        return ref.impl.apply(void 0, arguments);
      };
    }
    function mountLayoutEffect(create, deps) {
      var fiberFlags = 4194308;
      return (currentlyRenderingFiber.mode & 16) !== NoMode && (fiberFlags |= 134217728), mountEffectImpl(fiberFlags, Layout, create, deps);
    }
    function imperativeHandleEffect(create, ref) {
      if (typeof ref === "function") {
        create = create();
        var refCleanup = ref(create);
        return function() {
          typeof refCleanup === "function" ? refCleanup() : ref(null);
        };
      }
      if (ref !== null && ref !== void 0)
        return ref.hasOwnProperty("current") || console.error("Expected useImperativeHandle() first argument to either be a ref callback or React.createRef() object. Instead received: %s.", "an object with keys {" + Object.keys(ref).join(", ") + "}"), create = create(), ref.current = create, function() {
          ref.current = null;
        };
    }
    function mountImperativeHandle(ref, create, deps) {
      typeof create !== "function" && console.error("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", create !== null ? typeof create : "null"), deps = deps !== null && deps !== void 0 ? deps.concat([ref]) : null;
      var fiberFlags = 4194308;
      (currentlyRenderingFiber.mode & 16) !== NoMode && (fiberFlags |= 134217728), mountEffectImpl(fiberFlags, Layout, imperativeHandleEffect.bind(null, create, ref), deps);
    }
    function updateImperativeHandle(ref, create, deps) {
      typeof create !== "function" && console.error("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", create !== null ? typeof create : "null"), deps = deps !== null && deps !== void 0 ? deps.concat([ref]) : null, updateEffectImpl(4, Layout, imperativeHandleEffect.bind(null, create, ref), deps);
    }
    function mountCallback(callback, deps) {
      return mountWorkInProgressHook().memoizedState = [
        callback,
        deps === void 0 ? null : deps
      ], callback;
    }
    function updateCallback(callback, deps) {
      var hook = updateWorkInProgressHook();
      deps = deps === void 0 ? null : deps;
      var prevState = hook.memoizedState;
      if (deps !== null && areHookInputsEqual(deps, prevState[1]))
        return prevState[0];
      return hook.memoizedState = [callback, deps], callback;
    }
    function mountMemo(nextCreate, deps) {
      var hook = mountWorkInProgressHook();
      deps = deps === void 0 ? null : deps;
      var nextValue = nextCreate();
      if (shouldDoubleInvokeUserFnsInHooksDEV) {
        setIsStrictModeForDevtools(!0);
        try {
          nextCreate();
        } finally {
          setIsStrictModeForDevtools(!1);
        }
      }
      return hook.memoizedState = [nextValue, deps], nextValue;
    }
    function updateMemo(nextCreate, deps) {
      var hook = updateWorkInProgressHook();
      deps = deps === void 0 ? null : deps;
      var prevState = hook.memoizedState;
      if (deps !== null && areHookInputsEqual(deps, prevState[1]))
        return prevState[0];
      if (prevState = nextCreate(), shouldDoubleInvokeUserFnsInHooksDEV) {
        setIsStrictModeForDevtools(!0);
        try {
          nextCreate();
        } finally {
          setIsStrictModeForDevtools(!1);
        }
      }
      return hook.memoizedState = [prevState, deps], prevState;
    }
    function mountDeferredValue(value, initialValue) {
      var hook = mountWorkInProgressHook();
      return mountDeferredValueImpl(hook, value, initialValue);
    }
    function updateDeferredValue(value, initialValue) {
      var hook = updateWorkInProgressHook();
      return updateDeferredValueImpl(hook, currentHook.memoizedState, value, initialValue);
    }
    function rerenderDeferredValue(value, initialValue) {
      var hook = updateWorkInProgressHook();
      return currentHook === null ? mountDeferredValueImpl(hook, value, initialValue) : updateDeferredValueImpl(hook, currentHook.memoizedState, value, initialValue);
    }
    function mountDeferredValueImpl(hook, value, initialValue) {
      if (initialValue === void 0 || (renderLanes & 1073741824) !== 0 && (workInProgressRootRenderLanes & 261930) === 0)
        return hook.memoizedState = value;
      return hook.memoizedState = initialValue, hook = requestDeferredLane(), currentlyRenderingFiber.lanes |= hook, workInProgressRootSkippedLanes |= hook, initialValue;
    }
    function updateDeferredValueImpl(hook, prevValue, value, initialValue) {
      if (objectIs(value, prevValue))
        return value;
      if (currentTreeHiddenStackCursor.current !== null)
        return hook = mountDeferredValueImpl(hook, value, initialValue), objectIs(hook, prevValue) || (didReceiveUpdate = !0), hook;
      if ((renderLanes & 42) === 0 || (renderLanes & 1073741824) !== 0 && (workInProgressRootRenderLanes & 261930) === 0)
        return didReceiveUpdate = !0, hook.memoizedState = value;
      return hook = requestDeferredLane(), currentlyRenderingFiber.lanes |= hook, workInProgressRootSkippedLanes |= hook, prevValue;
    }
    function releaseAsyncTransition() {
      ReactSharedInternals.asyncTransitions--;
    }
    function startTransition(fiber, queue, pendingState, finishedState, callback) {
      var previousPriority = getCurrentUpdatePriority();
      setCurrentUpdatePriority(previousPriority !== 0 && 8 > previousPriority ? previousPriority : 8);
      var prevTransition = ReactSharedInternals.T, currentTransition = {};
      currentTransition._updatedFibers = /* @__PURE__ */ new Set, ReactSharedInternals.T = currentTransition, dispatchOptimisticSetState(fiber, !1, queue, pendingState);
      try {
        var returnValue = callback(), onStartTransitionFinish = ReactSharedInternals.S;
        if (onStartTransitionFinish !== null && onStartTransitionFinish(currentTransition, returnValue), returnValue !== null && typeof returnValue === "object" && typeof returnValue.then === "function") {
          ReactSharedInternals.asyncTransitions++, returnValue.then(releaseAsyncTransition, releaseAsyncTransition);
          var thenableForFinishedState = chainThenableValue(returnValue, finishedState);
          dispatchSetStateInternal(fiber, queue, thenableForFinishedState, requestUpdateLane(fiber));
        } else
          dispatchSetStateInternal(fiber, queue, finishedState, requestUpdateLane(fiber));
      } catch (error44) {
        dispatchSetStateInternal(fiber, queue, { then: function() {}, status: "rejected", reason: error44 }, requestUpdateLane(fiber));
      } finally {
        setCurrentUpdatePriority(previousPriority), prevTransition !== null && currentTransition.types !== null && (prevTransition.types !== null && prevTransition.types !== currentTransition.types && console.error("We expected inner Transitions to have transferred the outer types set and that you cannot add to the outer Transition while inside the inner.This is a bug in React."), prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition, prevTransition === null && currentTransition._updatedFibers && (fiber = currentTransition._updatedFibers.size, currentTransition._updatedFibers.clear(), 10 < fiber && console.warn("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."));
      }
    }
    function ensureFormComponentIsStateful(formFiber) {
      var existingStateHook = formFiber.memoizedState;
      if (existingStateHook !== null)
        return existingStateHook;
      existingStateHook = {
        memoizedState: NotPendingTransition,
        baseState: NotPendingTransition,
        baseQueue: null,
        queue: {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: basicStateReducer,
          lastRenderedState: NotPendingTransition
        },
        next: null
      };
      var initialResetState = {};
      return existingStateHook.next = {
        memoizedState: initialResetState,
        baseState: initialResetState,
        baseQueue: null,
        queue: {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: basicStateReducer,
          lastRenderedState: initialResetState
        },
        next: null
      }, formFiber.memoizedState = existingStateHook, formFiber = formFiber.alternate, formFiber !== null && (formFiber.memoizedState = existingStateHook), existingStateHook;
    }
    function mountTransition() {
      var stateHook = mountStateImpl(!1);
      return stateHook = startTransition.bind(null, currentlyRenderingFiber, stateHook.queue, !0, !1), mountWorkInProgressHook().memoizedState = stateHook, [!1, stateHook];
    }
    function updateTransition() {
      var booleanOrThenable = updateReducer(basicStateReducer)[0], start = updateWorkInProgressHook().memoizedState;
      return [
        typeof booleanOrThenable === "boolean" ? booleanOrThenable : useThenable(booleanOrThenable),
        start
      ];
    }
    function rerenderTransition() {
      var booleanOrThenable = rerenderReducer(basicStateReducer)[0], start = updateWorkInProgressHook().memoizedState;
      return [
        typeof booleanOrThenable === "boolean" ? booleanOrThenable : useThenable(booleanOrThenable),
        start
      ];
    }
    function useHostTransitionStatus() {
      return readContext(HostTransitionContext);
    }
    function mountId() {
      var hook = mountWorkInProgressHook(), identifierPrefix = workInProgressRoot.identifierPrefix;
      if (isHydrating) {
        var treeId = treeContextOverflow, idWithLeadingBit = treeContextId;
        treeId = (idWithLeadingBit & ~(1 << 32 - clz32(idWithLeadingBit) - 1)).toString(32) + treeId, identifierPrefix = "_" + identifierPrefix + "R_" + treeId, treeId = localIdCounter++, 0 < treeId && (identifierPrefix += "H" + treeId.toString(32)), identifierPrefix += "_";
      } else
        treeId = globalClientIdCounter++, identifierPrefix = "_" + identifierPrefix + "r_" + treeId.toString(32) + "_";
      return hook.memoizedState = identifierPrefix;
    }
    function mountRefresh() {
      return mountWorkInProgressHook().memoizedState = refreshCache.bind(null, currentlyRenderingFiber);
    }
    function refreshCache(fiber, seedKey) {
      for (var provider5 = fiber.return;provider5 !== null; ) {
        switch (provider5.tag) {
          case 24:
          case 3:
            var lane = requestUpdateLane(provider5), refreshUpdate = createUpdate(lane), root2 = enqueueUpdate(provider5, refreshUpdate, lane);
            root2 !== null && (startUpdateTimerByLane(lane, "refresh()", fiber), scheduleUpdateOnFiber(root2, provider5, lane), entangleTransitions(root2, provider5, lane)), fiber = createCache(), seedKey !== null && seedKey !== void 0 && root2 !== null && console.error("The seed argument is not enabled outside experimental channels."), refreshUpdate.payload = { cache: fiber };
            return;
        }
        provider5 = provider5.return;
      }
    }
    function dispatchReducerAction(fiber, queue, action) {
      var args = arguments;
      typeof args[3] === "function" && console.error("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect()."), args = requestUpdateLane(fiber);
      var update = {
        lane: args,
        revertLane: 0,
        gesture: null,
        action,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      isRenderPhaseUpdate(fiber) ? enqueueRenderPhaseUpdate(queue, update) : (update = enqueueConcurrentHookUpdate(fiber, queue, update, args), update !== null && (startUpdateTimerByLane(args, "dispatch()", fiber), scheduleUpdateOnFiber(update, fiber, args), entangleTransitionUpdate(update, queue, args)));
    }
    function dispatchSetState(fiber, queue, action) {
      var args = arguments;
      typeof args[3] === "function" && console.error("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect()."), args = requestUpdateLane(fiber), dispatchSetStateInternal(fiber, queue, action, args) && startUpdateTimerByLane(args, "setState()", fiber);
    }
    function dispatchSetStateInternal(fiber, queue, action, lane) {
      var update = {
        lane,
        revertLane: 0,
        gesture: null,
        action,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (isRenderPhaseUpdate(fiber))
        enqueueRenderPhaseUpdate(queue, update);
      else {
        var alternate = fiber.alternate;
        if (fiber.lanes === 0 && (alternate === null || alternate.lanes === 0) && (alternate = queue.lastRenderedReducer, alternate !== null)) {
          var prevDispatcher = ReactSharedInternals.H;
          ReactSharedInternals.H = InvalidNestedHooksDispatcherOnUpdateInDEV;
          try {
            var currentState = queue.lastRenderedState, eagerState = alternate(currentState, action);
            if (update.hasEagerState = !0, update.eagerState = eagerState, objectIs(eagerState, currentState))
              return enqueueUpdate$1(fiber, queue, update, 0), workInProgressRoot === null && finishQueueingConcurrentUpdates(), !1;
          } catch (error44) {} finally {
            ReactSharedInternals.H = prevDispatcher;
          }
        }
        if (action = enqueueConcurrentHookUpdate(fiber, queue, update, lane), action !== null)
          return scheduleUpdateOnFiber(action, fiber, lane), entangleTransitionUpdate(action, queue, lane), !0;
      }
      return !1;
    }
    function dispatchOptimisticSetState(fiber, throwIfDuringRender, queue, action) {
      if (ReactSharedInternals.T === null && currentEntangledLane === 0 && console.error("An optimistic state update occurred outside a transition or action. To fix, move the update to an action, or wrap with startTransition."), action = {
        lane: 2,
        revertLane: requestTransitionLane(),
        gesture: null,
        action,
        hasEagerState: !1,
        eagerState: null,
        next: null
      }, isRenderPhaseUpdate(fiber)) {
        if (throwIfDuringRender)
          throw Error("Cannot update optimistic state while rendering.");
        console.error("Cannot call startTransition while rendering.");
      } else
        throwIfDuringRender = enqueueConcurrentHookUpdate(fiber, queue, action, 2), throwIfDuringRender !== null && (startUpdateTimerByLane(2, "setOptimistic()", fiber), scheduleUpdateOnFiber(throwIfDuringRender, fiber, 2));
    }
    function isRenderPhaseUpdate(fiber) {
      var alternate = fiber.alternate;
      return fiber === currentlyRenderingFiber || alternate !== null && alternate === currentlyRenderingFiber;
    }
    function enqueueRenderPhaseUpdate(queue, update) {
      didScheduleRenderPhaseUpdateDuringThisPass = didScheduleRenderPhaseUpdate = !0;
      var pending = queue.pending;
      pending === null ? update.next = update : (update.next = pending.next, pending.next = update), queue.pending = update;
    }
    function entangleTransitionUpdate(root2, queue, lane) {
      if ((lane & 4194048) !== 0) {
        var queueLanes = queue.lanes;
        queueLanes &= root2.pendingLanes, lane |= queueLanes, queue.lanes = lane, markRootEntangled(root2, lane);
      }
    }
    function warnOnInvalidCallback(callback) {
      if (callback !== null && typeof callback !== "function") {
        var key = String(callback);
        didWarnOnInvalidCallback.has(key) || (didWarnOnInvalidCallback.add(key), console.error("Expected the last optional `callback` argument to be a function. Instead received: %s.", callback));
      }
    }
    function applyDerivedStateFromProps(workInProgress2, ctor, getDerivedStateFromProps, nextProps) {
      var prevState = workInProgress2.memoizedState, partialState = getDerivedStateFromProps(nextProps, prevState);
      if (workInProgress2.mode & 8) {
        setIsStrictModeForDevtools(!0);
        try {
          partialState = getDerivedStateFromProps(nextProps, prevState);
        } finally {
          setIsStrictModeForDevtools(!1);
        }
      }
      partialState === void 0 && (ctor = getComponentNameFromType(ctor) || "Component", didWarnAboutUndefinedDerivedState.has(ctor) || (didWarnAboutUndefinedDerivedState.add(ctor), console.error("%s.getDerivedStateFromProps(): A valid state object (or null) must be returned. You have returned undefined.", ctor))), prevState = partialState === null || partialState === void 0 ? prevState : assign({}, prevState, partialState), workInProgress2.memoizedState = prevState, workInProgress2.lanes === 0 && (workInProgress2.updateQueue.baseState = prevState);
    }
    function checkShouldComponentUpdate(workInProgress2, ctor, oldProps, newProps, oldState, newState, nextContext) {
      var instance = workInProgress2.stateNode;
      if (typeof instance.shouldComponentUpdate === "function") {
        if (oldProps = instance.shouldComponentUpdate(newProps, newState, nextContext), workInProgress2.mode & 8) {
          setIsStrictModeForDevtools(!0);
          try {
            oldProps = instance.shouldComponentUpdate(newProps, newState, nextContext);
          } finally {
            setIsStrictModeForDevtools(!1);
          }
        }
        return oldProps === void 0 && console.error("%s.shouldComponentUpdate(): Returned undefined instead of a boolean value. Make sure to return true or false.", getComponentNameFromType(ctor) || "Component"), oldProps;
      }
      return ctor.prototype && ctor.prototype.isPureReactComponent ? !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState) : !0;
    }
    function callComponentWillReceiveProps(workInProgress2, instance, newProps, nextContext) {
      var oldState = instance.state;
      typeof instance.componentWillReceiveProps === "function" && instance.componentWillReceiveProps(newProps, nextContext), typeof instance.UNSAFE_componentWillReceiveProps === "function" && instance.UNSAFE_componentWillReceiveProps(newProps, nextContext), instance.state !== oldState && (workInProgress2 = getComponentNameFromFiber(workInProgress2) || "Component", didWarnAboutStateAssignmentForComponent.has(workInProgress2) || (didWarnAboutStateAssignmentForComponent.add(workInProgress2), console.error("%s.componentWillReceiveProps(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", workInProgress2)), classComponentUpdater.enqueueReplaceState(instance, instance.state, null));
    }
    function resolveClassComponentProps(Component, baseProps) {
      var newProps = baseProps;
      if ("ref" in baseProps) {
        newProps = {};
        for (var propName in baseProps)
          propName !== "ref" && (newProps[propName] = baseProps[propName]);
      }
      if (Component = Component.defaultProps) {
        newProps === baseProps && (newProps = assign({}, newProps));
        for (var _propName in Component)
          newProps[_propName] === void 0 && (newProps[_propName] = Component[_propName]);
      }
      return newProps;
    }
    function logUncaughtError(root2, errorInfo) {
      try {
        componentName = errorInfo.source ? getComponentNameFromFiber(errorInfo.source) : null, errorBoundaryName = null;
        var error44 = errorInfo.value;
        if (ReactSharedInternals.actQueue !== null)
          ReactSharedInternals.thrownErrors.push(error44);
        else {
          var onUncaughtError = root2.onUncaughtError;
          onUncaughtError(error44, { componentStack: errorInfo.stack });
        }
      } catch (e) {
        setTimeout(function() {
          throw e;
        });
      }
    }
    function logCaughtError(root2, boundary, errorInfo) {
      try {
        componentName = errorInfo.source ? getComponentNameFromFiber(errorInfo.source) : null, errorBoundaryName = getComponentNameFromFiber(boundary);
        var onCaughtError = root2.onCaughtError;
        onCaughtError(errorInfo.value, {
          componentStack: errorInfo.stack,
          errorBoundary: boundary.tag === 1 ? boundary.stateNode : null
        });
      } catch (e) {
        setTimeout(function() {
          throw e;
        });
      }
    }
    function createRootErrorUpdate(root2, errorInfo, lane) {
      return lane = createUpdate(lane), lane.tag = CaptureUpdate, lane.payload = { element: null }, lane.callback = function() {
        runWithFiberInDEV(errorInfo.source, logUncaughtError, root2, errorInfo);
      }, lane;
    }
    function createClassErrorUpdate(lane) {
      return lane = createUpdate(lane), lane.tag = CaptureUpdate, lane;
    }
    function initializeClassErrorUpdate(update, root2, fiber, errorInfo) {
      var getDerivedStateFromError = fiber.type.getDerivedStateFromError;
      if (typeof getDerivedStateFromError === "function") {
        var error44 = errorInfo.value;
        update.payload = function() {
          return getDerivedStateFromError(error44);
        }, update.callback = function() {
          markFailedErrorBoundaryForHotReloading(fiber), runWithFiberInDEV(errorInfo.source, logCaughtError, root2, fiber, errorInfo);
        };
      }
      var inst = fiber.stateNode;
      inst !== null && typeof inst.componentDidCatch === "function" && (update.callback = function() {
        markFailedErrorBoundaryForHotReloading(fiber), runWithFiberInDEV(errorInfo.source, logCaughtError, root2, fiber, errorInfo), typeof getDerivedStateFromError !== "function" && (legacyErrorBoundariesThatAlreadyFailed === null ? legacyErrorBoundariesThatAlreadyFailed = /* @__PURE__ */ new Set([this]) : legacyErrorBoundariesThatAlreadyFailed.add(this)), callComponentDidCatchInDEV(this, errorInfo), typeof getDerivedStateFromError === "function" || (fiber.lanes & 2) === 0 && console.error("%s: Error boundaries should implement getDerivedStateFromError(). In that method, return a state update to display an error message or fallback UI.", getComponentNameFromFiber(fiber) || "Unknown");
      });
    }
    function throwException(root2, returnFiber, sourceFiber, value, rootRenderLanes) {
      if (sourceFiber.flags |= 32768, isDevToolsPresent && restorePendingUpdaters(root2, rootRenderLanes), value !== null && typeof value === "object" && typeof value.then === "function") {
        if (returnFiber = sourceFiber.alternate, returnFiber !== null && propagateParentContextChanges(returnFiber, sourceFiber, rootRenderLanes, !0), isHydrating && (didSuspendOrErrorDEV = !0), sourceFiber = suspenseHandlerStackCursor.current, sourceFiber !== null) {
          switch (sourceFiber.tag) {
            case 31:
            case 13:
              return shellBoundary === null ? renderDidSuspendDelayIfPossible() : sourceFiber.alternate === null && workInProgressRootExitStatus === RootInProgress && (workInProgressRootExitStatus = RootSuspended), sourceFiber.flags &= -257, sourceFiber.flags |= 65536, sourceFiber.lanes = rootRenderLanes, value === noopSuspenseyCommitThenable ? sourceFiber.flags |= 16384 : (returnFiber = sourceFiber.updateQueue, returnFiber === null ? sourceFiber.updateQueue = /* @__PURE__ */ new Set([value]) : returnFiber.add(value), attachPingListener(root2, value, rootRenderLanes)), !1;
            case 22:
              return sourceFiber.flags |= 65536, value === noopSuspenseyCommitThenable ? sourceFiber.flags |= 16384 : (returnFiber = sourceFiber.updateQueue, returnFiber === null ? (returnFiber = {
                transitions: null,
                markerInstances: null,
                retryQueue: /* @__PURE__ */ new Set([value])
              }, sourceFiber.updateQueue = returnFiber) : (sourceFiber = returnFiber.retryQueue, sourceFiber === null ? returnFiber.retryQueue = /* @__PURE__ */ new Set([value]) : sourceFiber.add(value)), attachPingListener(root2, value, rootRenderLanes)), !1;
          }
          throw Error("Unexpected Suspense handler tag (" + sourceFiber.tag + "). This is a bug in React.");
        }
        return attachPingListener(root2, value, rootRenderLanes), renderDidSuspendDelayIfPossible(), !1;
      }
      if (isHydrating)
        return didSuspendOrErrorDEV = !0, returnFiber = suspenseHandlerStackCursor.current, returnFiber !== null ? ((returnFiber.flags & 65536) === 0 && (returnFiber.flags |= 256), returnFiber.flags |= 65536, returnFiber.lanes = rootRenderLanes, value !== HydrationMismatchException && queueHydrationError(createCapturedValueAtFiber(Error("There was an error while hydrating but React was able to recover by instead client rendering from the nearest Suspense boundary.", { cause: value }), sourceFiber))) : (value !== HydrationMismatchException && queueHydrationError(createCapturedValueAtFiber(Error("There was an error while hydrating but React was able to recover by instead client rendering the entire root.", { cause: value }), sourceFiber)), root2 = root2.current.alternate, root2.flags |= 65536, rootRenderLanes &= -rootRenderLanes, root2.lanes |= rootRenderLanes, value = createCapturedValueAtFiber(value, sourceFiber), rootRenderLanes = createRootErrorUpdate(root2.stateNode, value, rootRenderLanes), enqueueCapturedUpdate(root2, rootRenderLanes), workInProgressRootExitStatus !== RootSuspendedWithDelay && (workInProgressRootExitStatus = RootErrored)), !1;
      var error44 = createCapturedValueAtFiber(Error("There was an error during concurrent rendering but React was able to recover by instead synchronously rendering the entire root.", { cause: value }), sourceFiber);
      if (workInProgressRootConcurrentErrors === null ? workInProgressRootConcurrentErrors = [error44] : workInProgressRootConcurrentErrors.push(error44), workInProgressRootExitStatus !== RootSuspendedWithDelay && (workInProgressRootExitStatus = RootErrored), returnFiber === null)
        return !0;
      value = createCapturedValueAtFiber(value, sourceFiber), sourceFiber = returnFiber;
      do {
        switch (sourceFiber.tag) {
          case 3:
            return sourceFiber.flags |= 65536, root2 = rootRenderLanes & -rootRenderLanes, sourceFiber.lanes |= root2, root2 = createRootErrorUpdate(sourceFiber.stateNode, value, root2), enqueueCapturedUpdate(sourceFiber, root2), !1;
          case 1:
            if (returnFiber = sourceFiber.type, error44 = sourceFiber.stateNode, (sourceFiber.flags & 128) === 0 && (typeof returnFiber.getDerivedStateFromError === "function" || error44 !== null && typeof error44.componentDidCatch === "function" && (legacyErrorBoundariesThatAlreadyFailed === null || !legacyErrorBoundariesThatAlreadyFailed.has(error44))))
              return sourceFiber.flags |= 65536, rootRenderLanes &= -rootRenderLanes, sourceFiber.lanes |= rootRenderLanes, rootRenderLanes = createClassErrorUpdate(rootRenderLanes), initializeClassErrorUpdate(rootRenderLanes, root2, sourceFiber, value), enqueueCapturedUpdate(sourceFiber, rootRenderLanes), !1;
        }
        sourceFiber = sourceFiber.return;
      } while (sourceFiber !== null);
      return !1;
    }
    function reconcileChildren(current2, workInProgress2, nextChildren, renderLanes2) {
      workInProgress2.child = current2 === null ? mountChildFibers(workInProgress2, null, nextChildren, renderLanes2) : reconcileChildFibers(workInProgress2, current2.child, nextChildren, renderLanes2);
    }
    function updateForwardRef(current2, workInProgress2, Component, nextProps, renderLanes2) {
      Component = Component.render;
      var ref = workInProgress2.ref;
      if ("ref" in nextProps) {
        var propsWithoutRef = {};
        for (var key in nextProps)
          key !== "ref" && (propsWithoutRef[key] = nextProps[key]);
      } else
        propsWithoutRef = nextProps;
      if (prepareToReadContext(workInProgress2), nextProps = renderWithHooks(current2, workInProgress2, Component, propsWithoutRef, ref, renderLanes2), key = checkDidRenderIdHook(), current2 !== null && !didReceiveUpdate)
        return bailoutHooks(current2, workInProgress2, renderLanes2), bailoutOnAlreadyFinishedWork(current2, workInProgress2, renderLanes2);
      return isHydrating && key && pushMaterializedTreeId(workInProgress2), workInProgress2.flags |= 1, reconcileChildren(current2, workInProgress2, nextProps, renderLanes2), workInProgress2.child;
    }
    function updateMemoComponent(current2, workInProgress2, Component, nextProps, renderLanes2) {
      if (current2 === null) {
        var type = Component.type;
        if (typeof type === "function" && !shouldConstruct(type) && type.defaultProps === void 0 && Component.compare === null)
          return Component = resolveFunctionForHotReloading(type), workInProgress2.tag = 15, workInProgress2.type = Component, validateFunctionComponentInDev(workInProgress2, type), updateSimpleMemoComponent(current2, workInProgress2, Component, nextProps, renderLanes2);
        return current2 = createFiberFromTypeAndProps(Component.type, null, nextProps, workInProgress2, workInProgress2.mode, renderLanes2), current2.ref = workInProgress2.ref, current2.return = workInProgress2, workInProgress2.child = current2;
      }
      if (type = current2.child, !checkScheduledUpdateOrContext(current2, renderLanes2)) {
        var prevProps = type.memoizedProps;
        if (Component = Component.compare, Component = Component !== null ? Component : shallowEqual, Component(prevProps, nextProps) && current2.ref === workInProgress2.ref)
          return bailoutOnAlreadyFinishedWork(current2, workInProgress2, renderLanes2);
      }
      return workInProgress2.flags |= 1, current2 = createWorkInProgress(type, nextProps), current2.ref = workInProgress2.ref, current2.return = workInProgress2, workInProgress2.child = current2;
    }
    function updateSimpleMemoComponent(current2, workInProgress2, Component, nextProps, renderLanes2) {
      if (current2 !== null) {
        var prevProps = current2.memoizedProps;
        if (shallowEqual(prevProps, nextProps) && current2.ref === workInProgress2.ref && workInProgress2.type === current2.type)
          if (didReceiveUpdate = !1, workInProgress2.pendingProps = nextProps = prevProps, checkScheduledUpdateOrContext(current2, renderLanes2))
            (current2.flags & 131072) !== 0 && (didReceiveUpdate = !0);
          else
            return workInProgress2.lanes = current2.lanes, bailoutOnAlreadyFinishedWork(current2, workInProgress2, renderLanes2);
      }
      return updateFunctionComponent(current2, workInProgress2, Component, nextProps, renderLanes2);
    }
    function updateOffscreenComponent(current2, workInProgress2, renderLanes2, nextProps) {
      var nextChildren = nextProps.children, prevState = current2 !== null ? current2.memoizedState : null;
      if (current2 === null && workInProgress2.stateNode === null && (workInProgress2.stateNode = {
        _visibility: OffscreenVisible,
        _pendingMarkers: null,
        _retryCache: null,
        _transitions: null
      }), nextProps.mode === "hidden") {
        if ((workInProgress2.flags & 128) !== 0) {
          if (prevState = prevState !== null ? prevState.baseLanes | renderLanes2 : renderLanes2, current2 !== null) {
            nextProps = workInProgress2.child = current2.child;
            for (nextChildren = 0;nextProps !== null; )
              nextChildren = nextChildren | nextProps.lanes | nextProps.childLanes, nextProps = nextProps.sibling;
            nextProps = nextChildren & ~prevState;
          } else
            nextProps = 0, workInProgress2.child = null;
          return deferHiddenOffscreenComponent(current2, workInProgress2, prevState, renderLanes2, nextProps);
        }
        if ((renderLanes2 & 536870912) !== 0)
          workInProgress2.memoizedState = { baseLanes: 0, cachePool: null }, current2 !== null && pushTransition(workInProgress2, prevState !== null ? prevState.cachePool : null), prevState !== null ? pushHiddenContext(workInProgress2, prevState) : reuseHiddenContextOnStack(workInProgress2), pushOffscreenSuspenseHandler(workInProgress2);
        else
          return nextProps = workInProgress2.lanes = 536870912, deferHiddenOffscreenComponent(current2, workInProgress2, prevState !== null ? prevState.baseLanes | renderLanes2 : renderLanes2, renderLanes2, nextProps);
      } else
        prevState !== null ? (pushTransition(workInProgress2, prevState.cachePool), pushHiddenContext(workInProgress2, prevState), reuseSuspenseHandlerOnStack(workInProgress2), workInProgress2.memoizedState = null) : (current2 !== null && pushTransition(workInProgress2, null), reuseHiddenContextOnStack(workInProgress2), reuseSuspenseHandlerOnStack(workInProgress2));
      return reconcileChildren(current2, workInProgress2, nextChildren, renderLanes2), workInProgress2.child;
    }
    function bailoutOffscreenComponent(current2, workInProgress2) {
      return current2 !== null && current2.tag === 22 || workInProgress2.stateNode !== null || (workInProgress2.stateNode = {
        _visibility: OffscreenVisible,
        _pendingMarkers: null,
        _retryCache: null,
        _transitions: null
      }), workInProgress2.sibling;
    }
    function deferHiddenOffscreenComponent(current2, workInProgress2, nextBaseLanes, renderLanes2, remainingChildLanes) {
      var JSCompiler_inline_result = peekCacheFromPool();
      return JSCompiler_inline_result = JSCompiler_inline_result === null ? null : {
        parent: isPrimaryRenderer ? CacheContext._currentValue : CacheContext._currentValue2,
        pool: JSCompiler_inline_result
      }, workInProgress2.memoizedState = {
        baseLanes: nextBaseLanes,
        cachePool: JSCompiler_inline_result
      }, current2 !== null && pushTransition(workInProgress2, null), reuseHiddenContextOnStack(workInProgress2), pushOffscreenSuspenseHandler(workInProgress2), current2 !== null && propagateParentContextChanges(current2, workInProgress2, renderLanes2, !0), workInProgress2.childLanes = remainingChildLanes, null;
    }
    function mountActivityChildren(workInProgress2, nextProps) {
      var hiddenProp = nextProps.hidden;
      return hiddenProp !== void 0 && console.error(`<Activity> doesn't accept a hidden prop. Use mode="hidden" instead.
- <Activity %s>
+ <Activity %s>`, hiddenProp === !0 ? "hidden" : hiddenProp === !1 ? "hidden={false}" : "hidden={...}", hiddenProp ? 'mode="hidden"' : 'mode="visible"'), nextProps = mountWorkInProgressOffscreenFiber({ mode: nextProps.mode, children: nextProps.children }, workInProgress2.mode), nextProps.ref = workInProgress2.ref, workInProgress2.child = nextProps, nextProps.return = workInProgress2, nextProps;
    }
    function retryActivityComponentWithoutHydrating(current2, workInProgress2, renderLanes2) {
      return reconcileChildFibers(workInProgress2, current2.child, null, renderLanes2), current2 = mountActivityChildren(workInProgress2, workInProgress2.pendingProps), current2.flags |= 2, popSuspenseHandler(workInProgress2), workInProgress2.memoizedState = null, current2;
    }
    function updateActivityComponent(current2, workInProgress2, renderLanes2) {
      var nextProps = workInProgress2.pendingProps, didSuspend = (workInProgress2.flags & 128) !== 0;
      if (workInProgress2.flags &= -129, current2 === null) {
        if (isHydrating) {
          if (nextProps.mode === "hidden")
            return current2 = mountActivityChildren(workInProgress2, nextProps), workInProgress2.lanes = 536870912, bailoutOffscreenComponent(null, current2);
          if (pushDehydratedActivitySuspenseHandler(workInProgress2), (current2 = nextHydratableInstance) ? (renderLanes2 = canHydrateActivityInstance(current2, rootOrSingletonContext), renderLanes2 !== null && (nextProps = {
            dehydrated: renderLanes2,
            treeContext: getSuspendedTreeContext(),
            retryLane: 536870912,
            hydrationErrors: null
          }, workInProgress2.memoizedState = nextProps, nextProps = createFiberFromDehydratedFragment(renderLanes2), nextProps.return = workInProgress2, workInProgress2.child = nextProps, hydrationParentFiber = workInProgress2, nextHydratableInstance = null)) : renderLanes2 = null, renderLanes2 === null)
            throw warnNonHydratedInstance(workInProgress2, current2), throwOnHydrationMismatch(workInProgress2);
          return workInProgress2.lanes = 536870912, null;
        }
        return mountActivityChildren(workInProgress2, nextProps);
      }
      var prevState = current2.memoizedState;
      if (prevState !== null) {
        var activityInstance = prevState.dehydrated;
        if (pushDehydratedActivitySuspenseHandler(workInProgress2), didSuspend)
          if (workInProgress2.flags & 256)
            workInProgress2.flags &= -257, workInProgress2 = retryActivityComponentWithoutHydrating(current2, workInProgress2, renderLanes2);
          else if (workInProgress2.memoizedState !== null)
            workInProgress2.child = current2.child, workInProgress2.flags |= 128, workInProgress2 = null;
          else
            throw Error("Client rendering an Activity suspended it again. This is a bug in React.");
        else if (warnIfHydrating(), (renderLanes2 & 536870912) !== 0 && markRenderDerivedCause(workInProgress2), didReceiveUpdate || propagateParentContextChanges(current2, workInProgress2, renderLanes2, !1), didSuspend = (renderLanes2 & current2.childLanes) !== 0, didReceiveUpdate || didSuspend) {
          if (nextProps = workInProgressRoot, nextProps !== null && (activityInstance = getBumpedLaneForHydration(nextProps, renderLanes2), activityInstance !== 0 && activityInstance !== prevState.retryLane))
            throw prevState.retryLane = activityInstance, enqueueConcurrentRenderForLane(current2, activityInstance), scheduleUpdateOnFiber(nextProps, current2, activityInstance), SelectiveHydrationException;
          renderDidSuspendDelayIfPossible(), workInProgress2 = retryActivityComponentWithoutHydrating(current2, workInProgress2, renderLanes2);
        } else
          current2 = prevState.treeContext, supportsHydration && (nextHydratableInstance = getFirstHydratableChildWithinActivityInstance(activityInstance), hydrationParentFiber = workInProgress2, isHydrating = !0, hydrationErrors = null, didSuspendOrErrorDEV = !1, hydrationDiffRootDEV = null, rootOrSingletonContext = !1, current2 !== null && restoreSuspendedTreeContext(workInProgress2, current2)), workInProgress2 = mountActivityChildren(workInProgress2, nextProps), workInProgress2.flags |= 4096;
        return workInProgress2;
      }
      return prevState = current2.child, nextProps = { mode: nextProps.mode, children: nextProps.children }, (renderLanes2 & 536870912) !== 0 && (renderLanes2 & current2.lanes) !== 0 && markRenderDerivedCause(workInProgress2), current2 = createWorkInProgress(prevState, nextProps), current2.ref = workInProgress2.ref, workInProgress2.child = current2, current2.return = workInProgress2, current2;
    }
    function markRef(current2, workInProgress2) {
      var ref = workInProgress2.ref;
      if (ref === null)
        current2 !== null && current2.ref !== null && (workInProgress2.flags |= 4194816);
      else {
        if (typeof ref !== "function" && typeof ref !== "object")
          throw Error("Expected ref to be a function, an object returned by React.createRef(), or undefined/null.");
        if (current2 === null || current2.ref !== ref)
          workInProgress2.flags |= 4194816;
      }
    }
    function updateFunctionComponent(current2, workInProgress2, Component, nextProps, renderLanes2) {
      if (Component.prototype && typeof Component.prototype.render === "function") {
        var componentName2 = getComponentNameFromType(Component) || "Unknown";
        didWarnAboutBadClass[componentName2] || (console.error("The <%s /> component appears to have a render method, but doesn't extend React.Component. This is likely to cause errors. Change %s to extend React.Component instead.", componentName2, componentName2), didWarnAboutBadClass[componentName2] = !0);
      }
      if (workInProgress2.mode & 8 && ReactStrictModeWarnings.recordLegacyContextWarning(workInProgress2, null), current2 === null && (validateFunctionComponentInDev(workInProgress2, workInProgress2.type), Component.contextTypes && (componentName2 = getComponentNameFromType(Component) || "Unknown", didWarnAboutContextTypes[componentName2] || (didWarnAboutContextTypes[componentName2] = !0, console.error("%s uses the legacy contextTypes API which was removed in React 19. Use React.createContext() with React.useContext() instead. (https://react.dev/link/legacy-context)", componentName2)))), prepareToReadContext(workInProgress2), Component = renderWithHooks(current2, workInProgress2, Component, nextProps, void 0, renderLanes2), nextProps = checkDidRenderIdHook(), current2 !== null && !didReceiveUpdate)
        return bailoutHooks(current2, workInProgress2, renderLanes2), bailoutOnAlreadyFinishedWork(current2, workInProgress2, renderLanes2);
      return isHydrating && nextProps && pushMaterializedTreeId(workInProgress2), workInProgress2.flags |= 1, reconcileChildren(current2, workInProgress2, Component, renderLanes2), workInProgress2.child;
    }
    function replayFunctionComponent(current2, workInProgress2, nextProps, Component, secondArg, renderLanes2) {
      if (prepareToReadContext(workInProgress2), hookTypesUpdateIndexDev = -1, ignorePreviousDependencies = current2 !== null && current2.type !== workInProgress2.type, workInProgress2.updateQueue = null, nextProps = renderWithHooksAgain(workInProgress2, Component, nextProps, secondArg), finishRenderingHooks(current2, workInProgress2), Component = checkDidRenderIdHook(), current2 !== null && !didReceiveUpdate)
        return bailoutHooks(current2, workInProgress2, renderLanes2), bailoutOnAlreadyFinishedWork(current2, workInProgress2, renderLanes2);
      return isHydrating && Component && pushMaterializedTreeId(workInProgress2), workInProgress2.flags |= 1, reconcileChildren(current2, workInProgress2, nextProps, renderLanes2), workInProgress2.child;
    }
    function updateClassComponent(current2, workInProgress2, Component, nextProps, renderLanes2) {
      switch (shouldErrorImpl(workInProgress2)) {
        case !1:
          var _instance = workInProgress2.stateNode, state3 = new workInProgress2.type(workInProgress2.memoizedProps, _instance.context).state;
          _instance.updater.enqueueSetState(_instance, state3, null);
          break;
        case !0:
          workInProgress2.flags |= 128, workInProgress2.flags |= 65536, _instance = Error("Simulated error coming from DevTools");
          var lane = renderLanes2 & -renderLanes2;
          if (workInProgress2.lanes |= lane, state3 = workInProgressRoot, state3 === null)
            throw Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
          lane = createClassErrorUpdate(lane), initializeClassErrorUpdate(lane, state3, workInProgress2, createCapturedValueAtFiber(_instance, workInProgress2)), enqueueCapturedUpdate(workInProgress2, lane);
      }
      if (prepareToReadContext(workInProgress2), workInProgress2.stateNode === null) {
        if (state3 = emptyContextObject, _instance = Component.contextType, "contextType" in Component && _instance !== null && (_instance === void 0 || _instance.$$typeof !== REACT_CONTEXT_TYPE) && !didWarnAboutInvalidateContextType.has(Component) && (didWarnAboutInvalidateContextType.add(Component), lane = _instance === void 0 ? " However, it is set to undefined. This can be caused by a typo or by mixing up named and default imports. This can also happen due to a circular dependency, so try moving the createContext() call to a separate file." : typeof _instance !== "object" ? " However, it is set to a " + typeof _instance + "." : _instance.$$typeof === REACT_CONSUMER_TYPE ? " Did you accidentally pass the Context.Consumer instead?" : " However, it is set to an object with keys {" + Object.keys(_instance).join(", ") + "}.", console.error("%s defines an invalid contextType. contextType should point to the Context object returned by React.createContext().%s", getComponentNameFromType(Component) || "Component", lane)), typeof _instance === "object" && _instance !== null && (state3 = readContext(_instance)), _instance = new Component(nextProps, state3), workInProgress2.mode & 8) {
          setIsStrictModeForDevtools(!0);
          try {
            _instance = new Component(nextProps, state3);
          } finally {
            setIsStrictModeForDevtools(!1);
          }
        }
        if (state3 = workInProgress2.memoizedState = _instance.state !== null && _instance.state !== void 0 ? _instance.state : null, _instance.updater = classComponentUpdater, workInProgress2.stateNode = _instance, _instance._reactInternals = workInProgress2, _instance._reactInternalInstance = fakeInternalInstance, typeof Component.getDerivedStateFromProps === "function" && state3 === null && (state3 = getComponentNameFromType(Component) || "Component", didWarnAboutUninitializedState.has(state3) || (didWarnAboutUninitializedState.add(state3), console.error("`%s` uses `getDerivedStateFromProps` but its initial state is %s. This is not recommended. Instead, define the initial state by assigning an object to `this.state` in the constructor of `%s`. This ensures that `getDerivedStateFromProps` arguments have a consistent shape.", state3, _instance.state === null ? "null" : "undefined", state3))), typeof Component.getDerivedStateFromProps === "function" || typeof _instance.getSnapshotBeforeUpdate === "function") {
          var foundWillUpdateName = lane = state3 = null;
          if (typeof _instance.componentWillMount === "function" && _instance.componentWillMount.__suppressDeprecationWarning !== !0 ? state3 = "componentWillMount" : typeof _instance.UNSAFE_componentWillMount === "function" && (state3 = "UNSAFE_componentWillMount"), typeof _instance.componentWillReceiveProps === "function" && _instance.componentWillReceiveProps.__suppressDeprecationWarning !== !0 ? lane = "componentWillReceiveProps" : typeof _instance.UNSAFE_componentWillReceiveProps === "function" && (lane = "UNSAFE_componentWillReceiveProps"), typeof _instance.componentWillUpdate === "function" && _instance.componentWillUpdate.__suppressDeprecationWarning !== !0 ? foundWillUpdateName = "componentWillUpdate" : typeof _instance.UNSAFE_componentWillUpdate === "function" && (foundWillUpdateName = "UNSAFE_componentWillUpdate"), state3 !== null || lane !== null || foundWillUpdateName !== null) {
            _instance = getComponentNameFromType(Component) || "Component";
            var newApiName = typeof Component.getDerivedStateFromProps === "function" ? "getDerivedStateFromProps()" : "getSnapshotBeforeUpdate()";
            didWarnAboutLegacyLifecyclesAndDerivedState.has(_instance) || (didWarnAboutLegacyLifecyclesAndDerivedState.add(_instance), console.error(`Unsafe legacy lifecycles will not be called for components using new component APIs.

%s uses %s but also contains the following legacy lifecycles:%s%s%s

The above lifecycles should be removed. Learn more about this warning here:
https://react.dev/link/unsafe-component-lifecycles`, _instance, newApiName, state3 !== null ? `
  ` + state3 : "", lane !== null ? `
  ` + lane : "", foundWillUpdateName !== null ? `
  ` + foundWillUpdateName : ""));
          }
        }
        _instance = workInProgress2.stateNode, state3 = getComponentNameFromType(Component) || "Component", _instance.render || (Component.prototype && typeof Component.prototype.render === "function" ? console.error("No `render` method found on the %s instance: did you accidentally return an object from the constructor?", state3) : console.error("No `render` method found on the %s instance: you may have forgotten to define `render`.", state3)), !_instance.getInitialState || _instance.getInitialState.isReactClassApproved || _instance.state || console.error("getInitialState was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Did you mean to define a state property instead?", state3), _instance.getDefaultProps && !_instance.getDefaultProps.isReactClassApproved && console.error("getDefaultProps was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Use a static property to define defaultProps instead.", state3), _instance.contextType && console.error("contextType was defined as an instance property on %s. Use a static property to define contextType instead.", state3), Component.childContextTypes && !didWarnAboutChildContextTypes.has(Component) && (didWarnAboutChildContextTypes.add(Component), console.error("%s uses the legacy childContextTypes API which was removed in React 19. Use React.createContext() instead. (https://react.dev/link/legacy-context)", state3)), Component.contextTypes && !didWarnAboutContextTypes$1.has(Component) && (didWarnAboutContextTypes$1.add(Component), console.error("%s uses the legacy contextTypes API which was removed in React 19. Use React.createContext() with static contextType instead. (https://react.dev/link/legacy-context)", state3)), typeof _instance.componentShouldUpdate === "function" && console.error("%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpdate()? The name is phrased as a question because the function is expected to return a value.", state3), Component.prototype && Component.prototype.isPureReactComponent && typeof _instance.shouldComponentUpdate < "u" && console.error("%s has a method called shouldComponentUpdate(). shouldComponentUpdate should not be used when extending React.PureComponent. Please extend React.Component if shouldComponentUpdate is used.", getComponentNameFromType(Component) || "A pure component"), typeof _instance.componentDidUnmount === "function" && console.error("%s has a method called componentDidUnmount(). But there is no such lifecycle method. Did you mean componentWillUnmount()?", state3), typeof _instance.componentDidReceiveProps === "function" && console.error("%s has a method called componentDidReceiveProps(). But there is no such lifecycle method. If you meant to update the state in response to changing props, use componentWillReceiveProps(). If you meant to fetch data or run side-effects or mutations after React has updated the UI, use componentDidUpdate().", state3), typeof _instance.componentWillRecieveProps === "function" && console.error("%s has a method called componentWillRecieveProps(). Did you mean componentWillReceiveProps()?", state3), typeof _instance.UNSAFE_componentWillRecieveProps === "function" && console.error("%s has a method called UNSAFE_componentWillRecieveProps(). Did you mean UNSAFE_componentWillReceiveProps()?", state3), lane = _instance.props !== nextProps, _instance.props !== void 0 && lane && console.error("When calling super() in `%s`, make sure to pass up the same props that your component's constructor was passed.", state3), _instance.defaultProps && console.error("Setting defaultProps as an instance property on %s is not supported and will be ignored. Instead, define defaultProps as a static property on %s.", state3, state3), typeof _instance.getSnapshotBeforeUpdate !== "function" || typeof _instance.componentDidUpdate === "function" || didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate.has(Component) || (didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate.add(Component), console.error("%s: getSnapshotBeforeUpdate() should be used with componentDidUpdate(). This component defines getSnapshotBeforeUpdate() only.", getComponentNameFromType(Component))), typeof _instance.getDerivedStateFromProps === "function" && console.error("%s: getDerivedStateFromProps() is defined as an instance method and will be ignored. Instead, declare it as a static method.", state3), typeof _instance.getDerivedStateFromError === "function" && console.error("%s: getDerivedStateFromError() is defined as an instance method and will be ignored. Instead, declare it as a static method.", state3), typeof Component.getSnapshotBeforeUpdate === "function" && console.error("%s: getSnapshotBeforeUpdate() is defined as a static method and will be ignored. Instead, declare it as an instance method.", state3), (lane = _instance.state) && (typeof lane !== "object" || isArrayImpl(lane)) && console.error("%s.state: must be set to an object or null", state3), typeof _instance.getChildContext === "function" && typeof Component.childContextTypes !== "object" && console.error("%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().", state3), _instance = workInProgress2.stateNode, _instance.props = nextProps, _instance.state = workInProgress2.memoizedState, _instance.refs = {}, initializeUpdateQueue(workInProgress2), state3 = Component.contextType, _instance.context = typeof state3 === "object" && state3 !== null ? readContext(state3) : emptyContextObject, _instance.state === nextProps && (state3 = getComponentNameFromType(Component) || "Component", didWarnAboutDirectlyAssigningPropsToState.has(state3) || (didWarnAboutDirectlyAssigningPropsToState.add(state3), console.error("%s: It is not recommended to assign props directly to state because updates to props won't be reflected in state. In most cases, it is better to use props directly.", state3))), workInProgress2.mode & 8 && ReactStrictModeWarnings.recordLegacyContextWarning(workInProgress2, _instance), ReactStrictModeWarnings.recordUnsafeLifecycleWarnings(workInProgress2, _instance), _instance.state = workInProgress2.memoizedState, state3 = Component.getDerivedStateFromProps, typeof state3 === "function" && (applyDerivedStateFromProps(workInProgress2, Component, state3, nextProps), _instance.state = workInProgress2.memoizedState), typeof Component.getDerivedStateFromProps === "function" || typeof _instance.getSnapshotBeforeUpdate === "function" || typeof _instance.UNSAFE_componentWillMount !== "function" && typeof _instance.componentWillMount !== "function" || (state3 = _instance.state, typeof _instance.componentWillMount === "function" && _instance.componentWillMount(), typeof _instance.UNSAFE_componentWillMount === "function" && _instance.UNSAFE_componentWillMount(), state3 !== _instance.state && (console.error("%s.componentWillMount(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", getComponentNameFromFiber(workInProgress2) || "Component"), classComponentUpdater.enqueueReplaceState(_instance, _instance.state, null)), processUpdateQueue(workInProgress2, nextProps, _instance, renderLanes2), suspendIfUpdateReadFromEntangledAsyncAction(), _instance.state = workInProgress2.memoizedState), typeof _instance.componentDidMount === "function" && (workInProgress2.flags |= 4194308), (workInProgress2.mode & 16) !== NoMode && (workInProgress2.flags |= 134217728), _instance = !0;
      } else if (current2 === null) {
        _instance = workInProgress2.stateNode;
        var unresolvedOldProps = workInProgress2.memoizedProps;
        lane = resolveClassComponentProps(Component, unresolvedOldProps), _instance.props = lane;
        var oldContext = _instance.context;
        foundWillUpdateName = Component.contextType, state3 = emptyContextObject, typeof foundWillUpdateName === "object" && foundWillUpdateName !== null && (state3 = readContext(foundWillUpdateName)), newApiName = Component.getDerivedStateFromProps, foundWillUpdateName = typeof newApiName === "function" || typeof _instance.getSnapshotBeforeUpdate === "function", unresolvedOldProps = workInProgress2.pendingProps !== unresolvedOldProps, foundWillUpdateName || typeof _instance.UNSAFE_componentWillReceiveProps !== "function" && typeof _instance.componentWillReceiveProps !== "function" || (unresolvedOldProps || oldContext !== state3) && callComponentWillReceiveProps(workInProgress2, _instance, nextProps, state3), hasForceUpdate = !1;
        var oldState = workInProgress2.memoizedState;
        _instance.state = oldState, processUpdateQueue(workInProgress2, nextProps, _instance, renderLanes2), suspendIfUpdateReadFromEntangledAsyncAction(), oldContext = workInProgress2.memoizedState, unresolvedOldProps || oldState !== oldContext || hasForceUpdate ? (typeof newApiName === "function" && (applyDerivedStateFromProps(workInProgress2, Component, newApiName, nextProps), oldContext = workInProgress2.memoizedState), (lane = hasForceUpdate || checkShouldComponentUpdate(workInProgress2, Component, lane, nextProps, oldState, oldContext, state3)) ? (foundWillUpdateName || typeof _instance.UNSAFE_componentWillMount !== "function" && typeof _instance.componentWillMount !== "function" || (typeof _instance.componentWillMount === "function" && _instance.componentWillMount(), typeof _instance.UNSAFE_componentWillMount === "function" && _instance.UNSAFE_componentWillMount()), typeof _instance.componentDidMount === "function" && (workInProgress2.flags |= 4194308), (workInProgress2.mode & 16) !== NoMode && (workInProgress2.flags |= 134217728)) : (typeof _instance.componentDidMount === "function" && (workInProgress2.flags |= 4194308), (workInProgress2.mode & 16) !== NoMode && (workInProgress2.flags |= 134217728), workInProgress2.memoizedProps = nextProps, workInProgress2.memoizedState = oldContext), _instance.props = nextProps, _instance.state = oldContext, _instance.context = state3, _instance = lane) : (typeof _instance.componentDidMount === "function" && (workInProgress2.flags |= 4194308), (workInProgress2.mode & 16) !== NoMode && (workInProgress2.flags |= 134217728), _instance = !1);
      } else {
        _instance = workInProgress2.stateNode, cloneUpdateQueue(current2, workInProgress2), state3 = workInProgress2.memoizedProps, foundWillUpdateName = resolveClassComponentProps(Component, state3), _instance.props = foundWillUpdateName, newApiName = workInProgress2.pendingProps, oldState = _instance.context, oldContext = Component.contextType, lane = emptyContextObject, typeof oldContext === "object" && oldContext !== null && (lane = readContext(oldContext)), unresolvedOldProps = Component.getDerivedStateFromProps, (oldContext = typeof unresolvedOldProps === "function" || typeof _instance.getSnapshotBeforeUpdate === "function") || typeof _instance.UNSAFE_componentWillReceiveProps !== "function" && typeof _instance.componentWillReceiveProps !== "function" || (state3 !== newApiName || oldState !== lane) && callComponentWillReceiveProps(workInProgress2, _instance, nextProps, lane), hasForceUpdate = !1, oldState = workInProgress2.memoizedState, _instance.state = oldState, processUpdateQueue(workInProgress2, nextProps, _instance, renderLanes2), suspendIfUpdateReadFromEntangledAsyncAction();
        var newState = workInProgress2.memoizedState;
        state3 !== newApiName || oldState !== newState || hasForceUpdate || current2 !== null && current2.dependencies !== null && checkIfContextChanged(current2.dependencies) ? (typeof unresolvedOldProps === "function" && (applyDerivedStateFromProps(workInProgress2, Component, unresolvedOldProps, nextProps), newState = workInProgress2.memoizedState), (foundWillUpdateName = hasForceUpdate || checkShouldComponentUpdate(workInProgress2, Component, foundWillUpdateName, nextProps, oldState, newState, lane) || current2 !== null && current2.dependencies !== null && checkIfContextChanged(current2.dependencies)) ? (oldContext || typeof _instance.UNSAFE_componentWillUpdate !== "function" && typeof _instance.componentWillUpdate !== "function" || (typeof _instance.componentWillUpdate === "function" && _instance.componentWillUpdate(nextProps, newState, lane), typeof _instance.UNSAFE_componentWillUpdate === "function" && _instance.UNSAFE_componentWillUpdate(nextProps, newState, lane)), typeof _instance.componentDidUpdate === "function" && (workInProgress2.flags |= 4), typeof _instance.getSnapshotBeforeUpdate === "function" && (workInProgress2.flags |= 1024)) : (typeof _instance.componentDidUpdate !== "function" || state3 === current2.memoizedProps && oldState === current2.memoizedState || (workInProgress2.flags |= 4), typeof _instance.getSnapshotBeforeUpdate !== "function" || state3 === current2.memoizedProps && oldState === current2.memoizedState || (workInProgress2.flags |= 1024), workInProgress2.memoizedProps = nextProps, workInProgress2.memoizedState = newState), _instance.props = nextProps, _instance.state = newState, _instance.context = lane, _instance = foundWillUpdateName) : (typeof _instance.componentDidUpdate !== "function" || state3 === current2.memoizedProps && oldState === current2.memoizedState || (workInProgress2.flags |= 4), typeof _instance.getSnapshotBeforeUpdate !== "function" || state3 === current2.memoizedProps && oldState === current2.memoizedState || (workInProgress2.flags |= 1024), _instance = !1);
      }
      if (lane = _instance, markRef(current2, workInProgress2), state3 = (workInProgress2.flags & 128) !== 0, lane || state3) {
        if (lane = workInProgress2.stateNode, setCurrentFiber(workInProgress2), state3 && typeof Component.getDerivedStateFromError !== "function")
          Component = null, profilerStartTime = -1;
        else if (Component = callRenderInDEV(lane), workInProgress2.mode & 8) {
          setIsStrictModeForDevtools(!0);
          try {
            callRenderInDEV(lane);
          } finally {
            setIsStrictModeForDevtools(!1);
          }
        }
        workInProgress2.flags |= 1, current2 !== null && state3 ? (workInProgress2.child = reconcileChildFibers(workInProgress2, current2.child, null, renderLanes2), workInProgress2.child = reconcileChildFibers(workInProgress2, null, Component, renderLanes2)) : reconcileChildren(current2, workInProgress2, Component, renderLanes2), workInProgress2.memoizedState = lane.state, current2 = workInProgress2.child;
      } else
        current2 = bailoutOnAlreadyFinishedWork(current2, workInProgress2, renderLanes2);
      return renderLanes2 = workInProgress2.stateNode, _instance && renderLanes2.props !== nextProps && (didWarnAboutReassigningProps || console.error("It looks like %s is reassigning its own `this.props` while rendering. This is not supported and can lead to confusing bugs.", getComponentNameFromFiber(workInProgress2) || "a component"), didWarnAboutReassigningProps = !0), current2;
    }
    function mountHostRootWithoutHydrating(current2, workInProgress2, nextChildren, renderLanes2) {
      return resetHydrationState(), workInProgress2.flags |= 256, reconcileChildren(current2, workInProgress2, nextChildren, renderLanes2), workInProgress2.child;
    }
    function validateFunctionComponentInDev(workInProgress2, Component) {
      Component && Component.childContextTypes && console.error(`childContextTypes cannot be defined on a function component.
  %s.childContextTypes = ...`, Component.displayName || Component.name || "Component"), typeof Component.getDerivedStateFromProps === "function" && (workInProgress2 = getComponentNameFromType(Component) || "Unknown", didWarnAboutGetDerivedStateOnFunctionComponent[workInProgress2] || (console.error("%s: Function components do not support getDerivedStateFromProps.", workInProgress2), didWarnAboutGetDerivedStateOnFunctionComponent[workInProgress2] = !0)), typeof Component.contextType === "object" && Component.contextType !== null && (Component = getComponentNameFromType(Component) || "Unknown", didWarnAboutContextTypeOnFunctionComponent[Component] || (console.error("%s: Function components do not support contextType.", Component), didWarnAboutContextTypeOnFunctionComponent[Component] = !0));
    }
    function mountSuspenseOffscreenState(renderLanes2) {
      return { baseLanes: renderLanes2, cachePool: getSuspendedCache() };
    }
    function getRemainingWorkInPrimaryTree(current2, primaryTreeDidDefer, renderLanes2) {
      return current2 = current2 !== null ? current2.childLanes & ~renderLanes2 : 0, primaryTreeDidDefer && (current2 |= workInProgressDeferredLane), current2;
    }
    function updateSuspenseComponent(current2, workInProgress2, renderLanes2) {
      var nextProps = workInProgress2.pendingProps;
      shouldSuspendImpl(workInProgress2) && (workInProgress2.flags |= 128);
      var showFallback = !1, didSuspend = (workInProgress2.flags & 128) !== 0, JSCompiler_temp;
      if ((JSCompiler_temp = didSuspend) || (JSCompiler_temp = current2 !== null && current2.memoizedState === null ? !1 : (suspenseStackCursor.current & ForceSuspenseFallback) !== 0), JSCompiler_temp && (showFallback = !0, workInProgress2.flags &= -129), JSCompiler_temp = (workInProgress2.flags & 32) !== 0, workInProgress2.flags &= -33, current2 === null) {
        if (isHydrating) {
          if (showFallback ? pushPrimaryTreeSuspenseHandler(workInProgress2) : reuseSuspenseHandlerOnStack(workInProgress2), (current2 = nextHydratableInstance) ? (renderLanes2 = canHydrateSuspenseInstance(current2, rootOrSingletonContext), renderLanes2 !== null && (JSCompiler_temp = {
            dehydrated: renderLanes2,
            treeContext: getSuspendedTreeContext(),
            retryLane: 536870912,
            hydrationErrors: null
          }, workInProgress2.memoizedState = JSCompiler_temp, JSCompiler_temp = createFiberFromDehydratedFragment(renderLanes2), JSCompiler_temp.return = workInProgress2, workInProgress2.child = JSCompiler_temp, hydrationParentFiber = workInProgress2, nextHydratableInstance = null)) : renderLanes2 = null, renderLanes2 === null)
            throw warnNonHydratedInstance(workInProgress2, current2), throwOnHydrationMismatch(workInProgress2);
          return isSuspenseInstanceFallback(renderLanes2) ? workInProgress2.lanes = 32 : workInProgress2.lanes = 536870912, null;
        }
        var nextPrimaryChildren = nextProps.children;
        if (nextProps = nextProps.fallback, showFallback)
          return reuseSuspenseHandlerOnStack(workInProgress2), showFallback = workInProgress2.mode, nextPrimaryChildren = mountWorkInProgressOffscreenFiber({ mode: "hidden", children: nextPrimaryChildren }, showFallback), nextProps = createFiberFromFragment(nextProps, showFallback, renderLanes2, null), nextPrimaryChildren.return = workInProgress2, nextProps.return = workInProgress2, nextPrimaryChildren.sibling = nextProps, workInProgress2.child = nextPrimaryChildren, nextProps = workInProgress2.child, nextProps.memoizedState = mountSuspenseOffscreenState(renderLanes2), nextProps.childLanes = getRemainingWorkInPrimaryTree(current2, JSCompiler_temp, renderLanes2), workInProgress2.memoizedState = SUSPENDED_MARKER, bailoutOffscreenComponent(null, nextProps);
        return pushPrimaryTreeSuspenseHandler(workInProgress2), mountSuspensePrimaryChildren(workInProgress2, nextPrimaryChildren);
      }
      var prevState = current2.memoizedState;
      if (prevState !== null && (nextPrimaryChildren = prevState.dehydrated, nextPrimaryChildren !== null)) {
        if (didSuspend)
          workInProgress2.flags & 256 ? (pushPrimaryTreeSuspenseHandler(workInProgress2), workInProgress2.flags &= -257, workInProgress2 = retrySuspenseComponentWithoutHydrating(current2, workInProgress2, renderLanes2)) : workInProgress2.memoizedState !== null ? (reuseSuspenseHandlerOnStack(workInProgress2), workInProgress2.child = current2.child, workInProgress2.flags |= 128, workInProgress2 = null) : (reuseSuspenseHandlerOnStack(workInProgress2), nextPrimaryChildren = nextProps.fallback, showFallback = workInProgress2.mode, nextProps = mountWorkInProgressOffscreenFiber({ mode: "visible", children: nextProps.children }, showFallback), nextPrimaryChildren = createFiberFromFragment(nextPrimaryChildren, showFallback, renderLanes2, null), nextPrimaryChildren.flags |= 2, nextProps.return = workInProgress2, nextPrimaryChildren.return = workInProgress2, nextProps.sibling = nextPrimaryChildren, workInProgress2.child = nextProps, reconcileChildFibers(workInProgress2, current2.child, null, renderLanes2), nextProps = workInProgress2.child, nextProps.memoizedState = mountSuspenseOffscreenState(renderLanes2), nextProps.childLanes = getRemainingWorkInPrimaryTree(current2, JSCompiler_temp, renderLanes2), workInProgress2.memoizedState = SUSPENDED_MARKER, workInProgress2 = bailoutOffscreenComponent(null, nextProps));
        else if (pushPrimaryTreeSuspenseHandler(workInProgress2), warnIfHydrating(), (renderLanes2 & 536870912) !== 0 && markRenderDerivedCause(workInProgress2), isSuspenseInstanceFallback(nextPrimaryChildren))
          showFallback = getSuspenseInstanceFallbackErrorDetails(nextPrimaryChildren), JSCompiler_temp = showFallback.digest, nextPrimaryChildren = showFallback.message, nextProps = showFallback.stack, showFallback = showFallback.componentStack, nextPrimaryChildren = nextPrimaryChildren ? Error(nextPrimaryChildren) : Error("The server could not finish this Suspense boundary, likely due to an error during server rendering. Switched to client rendering."), nextPrimaryChildren.stack = nextProps || "", nextPrimaryChildren.digest = JSCompiler_temp, JSCompiler_temp = showFallback === void 0 ? null : showFallback, nextProps = {
            value: nextPrimaryChildren,
            source: null,
            stack: JSCompiler_temp
          }, typeof JSCompiler_temp === "string" && CapturedStacks.set(nextPrimaryChildren, nextProps), queueHydrationError(nextProps), workInProgress2 = retrySuspenseComponentWithoutHydrating(current2, workInProgress2, renderLanes2);
        else if (didReceiveUpdate || propagateParentContextChanges(current2, workInProgress2, renderLanes2, !1), JSCompiler_temp = (renderLanes2 & current2.childLanes) !== 0, didReceiveUpdate || JSCompiler_temp) {
          if (JSCompiler_temp = workInProgressRoot, JSCompiler_temp !== null && (nextProps = getBumpedLaneForHydration(JSCompiler_temp, renderLanes2), nextProps !== 0 && nextProps !== prevState.retryLane))
            throw prevState.retryLane = nextProps, enqueueConcurrentRenderForLane(current2, nextProps), scheduleUpdateOnFiber(JSCompiler_temp, current2, nextProps), SelectiveHydrationException;
          isSuspenseInstancePending(nextPrimaryChildren) || renderDidSuspendDelayIfPossible(), workInProgress2 = retrySuspenseComponentWithoutHydrating(current2, workInProgress2, renderLanes2);
        } else
          isSuspenseInstancePending(nextPrimaryChildren) ? (workInProgress2.flags |= 192, workInProgress2.child = current2.child, workInProgress2 = null) : (current2 = prevState.treeContext, supportsHydration && (nextHydratableInstance = getFirstHydratableChildWithinSuspenseInstance(nextPrimaryChildren), hydrationParentFiber = workInProgress2, isHydrating = !0, hydrationErrors = null, didSuspendOrErrorDEV = !1, hydrationDiffRootDEV = null, rootOrSingletonContext = !1, current2 !== null && restoreSuspendedTreeContext(workInProgress2, current2)), workInProgress2 = mountSuspensePrimaryChildren(workInProgress2, nextProps.children), workInProgress2.flags |= 4096);
        return workInProgress2;
      }
      if (showFallback)
        return reuseSuspenseHandlerOnStack(workInProgress2), nextPrimaryChildren = nextProps.fallback, showFallback = workInProgress2.mode, prevState = current2.child, didSuspend = prevState.sibling, nextProps = createWorkInProgress(prevState, {
          mode: "hidden",
          children: nextProps.children
        }), nextProps.subtreeFlags = prevState.subtreeFlags & 65011712, didSuspend !== null ? nextPrimaryChildren = createWorkInProgress(didSuspend, nextPrimaryChildren) : (nextPrimaryChildren = createFiberFromFragment(nextPrimaryChildren, showFallback, renderLanes2, null), nextPrimaryChildren.flags |= 2), nextPrimaryChildren.return = workInProgress2, nextProps.return = workInProgress2, nextProps.sibling = nextPrimaryChildren, workInProgress2.child = nextProps, bailoutOffscreenComponent(null, nextProps), nextProps = workInProgress2.child, nextPrimaryChildren = current2.child.memoizedState, nextPrimaryChildren === null ? nextPrimaryChildren = mountSuspenseOffscreenState(renderLanes2) : (showFallback = nextPrimaryChildren.cachePool, showFallback !== null ? (prevState = isPrimaryRenderer ? CacheContext._currentValue : CacheContext._currentValue2, showFallback = showFallback.parent !== prevState ? { parent: prevState, pool: prevState } : showFallback) : showFallback = getSuspendedCache(), nextPrimaryChildren = {
          baseLanes: nextPrimaryChildren.baseLanes | renderLanes2,
          cachePool: showFallback
        }), nextProps.memoizedState = nextPrimaryChildren, nextProps.childLanes = getRemainingWorkInPrimaryTree(current2, JSCompiler_temp, renderLanes2), workInProgress2.memoizedState = SUSPENDED_MARKER, bailoutOffscreenComponent(current2.child, nextProps);
      return prevState !== null && (renderLanes2 & 62914560) === renderLanes2 && (renderLanes2 & current2.lanes) !== 0 && markRenderDerivedCause(workInProgress2), pushPrimaryTreeSuspenseHandler(workInProgress2), renderLanes2 = current2.child, current2 = renderLanes2.sibling, renderLanes2 = createWorkInProgress(renderLanes2, {
        mode: "visible",
        children: nextProps.children
      }), renderLanes2.return = workInProgress2, renderLanes2.sibling = null, current2 !== null && (JSCompiler_temp = workInProgress2.deletions, JSCompiler_temp === null ? (workInProgress2.deletions = [current2], workInProgress2.flags |= 16) : JSCompiler_temp.push(current2)), workInProgress2.child = renderLanes2, workInProgress2.memoizedState = null, renderLanes2;
    }
    function mountSuspensePrimaryChildren(workInProgress2, primaryChildren) {
      return primaryChildren = mountWorkInProgressOffscreenFiber({ mode: "visible", children: primaryChildren }, workInProgress2.mode), primaryChildren.return = workInProgress2, workInProgress2.child = primaryChildren;
    }
    function mountWorkInProgressOffscreenFiber(offscreenProps, mode) {
      return offscreenProps = createFiber(22, offscreenProps, null, mode), offscreenProps.lanes = 0, offscreenProps;
    }
    function retrySuspenseComponentWithoutHydrating(current2, workInProgress2, renderLanes2) {
      return reconcileChildFibers(workInProgress2, current2.child, null, renderLanes2), current2 = mountSuspensePrimaryChildren(workInProgress2, workInProgress2.pendingProps.children), current2.flags |= 2, workInProgress2.memoizedState = null, current2;
    }
    function scheduleSuspenseWorkOnFiber(fiber, renderLanes2, propagationRoot) {
      fiber.lanes |= renderLanes2;
      var alternate = fiber.alternate;
      alternate !== null && (alternate.lanes |= renderLanes2), scheduleContextWorkOnParentPath(fiber.return, renderLanes2, propagationRoot);
    }
    function initSuspenseListRenderState(workInProgress2, isBackwards, tail, lastContentRow, tailMode, treeForkCount2) {
      var renderState = workInProgress2.memoizedState;
      renderState === null ? workInProgress2.memoizedState = {
        isBackwards,
        rendering: null,
        renderingStartTime: 0,
        last: lastContentRow,
        tail,
        tailMode,
        treeForkCount: treeForkCount2
      } : (renderState.isBackwards = isBackwards, renderState.rendering = null, renderState.renderingStartTime = 0, renderState.last = lastContentRow, renderState.tail = tail, renderState.tailMode = tailMode, renderState.treeForkCount = treeForkCount2);
    }
    function updateSuspenseListComponent(current2, workInProgress2, renderLanes2) {
      var nextProps = workInProgress2.pendingProps, revealOrder = nextProps.revealOrder, tailMode = nextProps.tail, newChildren = nextProps.children, suspenseContext = suspenseStackCursor.current;
      if ((nextProps = (suspenseContext & ForceSuspenseFallback) !== 0) ? (suspenseContext = suspenseContext & SubtreeSuspenseContextMask | ForceSuspenseFallback, workInProgress2.flags |= 128) : suspenseContext &= SubtreeSuspenseContextMask, push(suspenseStackCursor, suspenseContext, workInProgress2), suspenseContext = revealOrder == null ? "null" : revealOrder, revealOrder !== "forwards" && revealOrder !== "unstable_legacy-backwards" && revealOrder !== "together" && revealOrder !== "independent" && !didWarnAboutRevealOrder[suspenseContext])
        if (didWarnAboutRevealOrder[suspenseContext] = !0, revealOrder == null)
          console.error('The default for the <SuspenseList revealOrder="..."> prop is changing. To be future compatible you must explictly specify either "independent" (the current default), "together", "forwards" or "legacy_unstable-backwards".');
        else if (revealOrder === "backwards")
          console.error('The rendering order of <SuspenseList revealOrder="backwards"> is changing. To be future compatible you must specify revealOrder="legacy_unstable-backwards" instead.');
        else if (typeof revealOrder === "string")
          switch (revealOrder.toLowerCase()) {
            case "together":
            case "forwards":
            case "backwards":
            case "independent":
              console.error('"%s" is not a valid value for revealOrder on <SuspenseList />. Use lowercase "%s" instead.', revealOrder, revealOrder.toLowerCase());
              break;
            case "forward":
            case "backward":
              console.error('"%s" is not a valid value for revealOrder on <SuspenseList />. React uses the -s suffix in the spelling. Use "%ss" instead.', revealOrder, revealOrder.toLowerCase());
              break;
            default:
              console.error('"%s" is not a supported revealOrder on <SuspenseList />. Did you mean "independent", "together", "forwards" or "backwards"?', revealOrder);
          }
        else
          console.error('%s is not a supported value for revealOrder on <SuspenseList />. Did you mean "independent", "together", "forwards" or "backwards"?', revealOrder);
      if (suspenseContext = tailMode == null ? "null" : tailMode, !didWarnAboutTailOptions[suspenseContext])
        if (tailMode == null) {
          if (revealOrder === "forwards" || revealOrder === "backwards" || revealOrder === "unstable_legacy-backwards")
            didWarnAboutTailOptions[suspenseContext] = !0, console.error('The default for the <SuspenseList tail="..."> prop is changing. To be future compatible you must explictly specify either "visible" (the current default), "collapsed" or "hidden".');
        } else
          tailMode !== "visible" && tailMode !== "collapsed" && tailMode !== "hidden" ? (didWarnAboutTailOptions[suspenseContext] = !0, console.error('"%s" is not a supported value for tail on <SuspenseList />. Did you mean "visible", "collapsed" or "hidden"?', tailMode)) : revealOrder !== "forwards" && revealOrder !== "backwards" && revealOrder !== "unstable_legacy-backwards" && (didWarnAboutTailOptions[suspenseContext] = !0, console.error('<SuspenseList tail="%s" /> is only valid if revealOrder is "forwards" or "backwards". Did you mean to specify revealOrder="forwards"?', tailMode));
      a:
        if ((revealOrder === "forwards" || revealOrder === "backwards" || revealOrder === "unstable_legacy-backwards") && newChildren !== void 0 && newChildren !== null && newChildren !== !1)
          if (isArrayImpl(newChildren)) {
            for (suspenseContext = 0;suspenseContext < newChildren.length; suspenseContext++)
              if (!validateSuspenseListNestedChild(newChildren[suspenseContext], suspenseContext))
                break a;
          } else if (suspenseContext = getIteratorFn(newChildren), typeof suspenseContext === "function") {
            if (suspenseContext = suspenseContext.call(newChildren))
              for (var step = suspenseContext.next(), _i = 0;!step.done; step = suspenseContext.next()) {
                if (!validateSuspenseListNestedChild(step.value, _i))
                  break a;
                _i++;
              }
          } else
            console.error('A single row was passed to a <SuspenseList revealOrder="%s" />. This is not useful since it needs multiple rows. Did you mean to pass multiple children or an array?', revealOrder);
      if (reconcileChildren(current2, workInProgress2, newChildren, renderLanes2), isHydrating ? (warnIfNotHydrating(), newChildren = treeForkCount) : newChildren = 0, !nextProps && current2 !== null && (current2.flags & 128) !== 0)
        a:
          for (current2 = workInProgress2.child;current2 !== null; ) {
            if (current2.tag === 13)
              current2.memoizedState !== null && scheduleSuspenseWorkOnFiber(current2, renderLanes2, workInProgress2);
            else if (current2.tag === 19)
              scheduleSuspenseWorkOnFiber(current2, renderLanes2, workInProgress2);
            else if (current2.child !== null) {
              current2.child.return = current2, current2 = current2.child;
              continue;
            }
            if (current2 === workInProgress2)
              break a;
            for (;current2.sibling === null; ) {
              if (current2.return === null || current2.return === workInProgress2)
                break a;
              current2 = current2.return;
            }
            current2.sibling.return = current2.return, current2 = current2.sibling;
          }
      switch (revealOrder) {
        case "forwards":
          renderLanes2 = workInProgress2.child;
          for (revealOrder = null;renderLanes2 !== null; )
            current2 = renderLanes2.alternate, current2 !== null && findFirstSuspended(current2) === null && (revealOrder = renderLanes2), renderLanes2 = renderLanes2.sibling;
          renderLanes2 = revealOrder, renderLanes2 === null ? (revealOrder = workInProgress2.child, workInProgress2.child = null) : (revealOrder = renderLanes2.sibling, renderLanes2.sibling = null), initSuspenseListRenderState(workInProgress2, !1, revealOrder, renderLanes2, tailMode, newChildren);
          break;
        case "backwards":
        case "unstable_legacy-backwards":
          renderLanes2 = null, revealOrder = workInProgress2.child;
          for (workInProgress2.child = null;revealOrder !== null; ) {
            if (current2 = revealOrder.alternate, current2 !== null && findFirstSuspended(current2) === null) {
              workInProgress2.child = revealOrder;
              break;
            }
            current2 = revealOrder.sibling, revealOrder.sibling = renderLanes2, renderLanes2 = revealOrder, revealOrder = current2;
          }
          initSuspenseListRenderState(workInProgress2, !0, renderLanes2, null, tailMode, newChildren);
          break;
        case "together":
          initSuspenseListRenderState(workInProgress2, !1, null, null, void 0, newChildren);
          break;
        default:
          workInProgress2.memoizedState = null;
      }
      return workInProgress2.child;
    }
    function bailoutOnAlreadyFinishedWork(current2, workInProgress2, renderLanes2) {
      if (current2 !== null && (workInProgress2.dependencies = current2.dependencies), profilerStartTime = -1, workInProgressRootSkippedLanes |= workInProgress2.lanes, (renderLanes2 & workInProgress2.childLanes) === 0)
        if (current2 !== null) {
          if (propagateParentContextChanges(current2, workInProgress2, renderLanes2, !1), (renderLanes2 & workInProgress2.childLanes) === 0)
            return null;
        } else
          return null;
      if (current2 !== null && workInProgress2.child !== current2.child)
        throw Error("Resuming work not yet implemented.");
      if (workInProgress2.child !== null) {
        current2 = workInProgress2.child, renderLanes2 = createWorkInProgress(current2, current2.pendingProps), workInProgress2.child = renderLanes2;
        for (renderLanes2.return = workInProgress2;current2.sibling !== null; )
          current2 = current2.sibling, renderLanes2 = renderLanes2.sibling = createWorkInProgress(current2, current2.pendingProps), renderLanes2.return = workInProgress2;
        renderLanes2.sibling = null;
      }
      return workInProgress2.child;
    }
    function checkScheduledUpdateOrContext(current2, renderLanes2) {
      if ((current2.lanes & renderLanes2) !== 0)
        return !0;
      return current2 = current2.dependencies, current2 !== null && checkIfContextChanged(current2) ? !0 : !1;
    }
    function attemptEarlyBailoutIfNoScheduledUpdate(current2, workInProgress2, renderLanes2) {
      switch (workInProgress2.tag) {
        case 3:
          pushHostContainer(workInProgress2, workInProgress2.stateNode.containerInfo), pushProvider(workInProgress2, CacheContext, current2.memoizedState.cache), resetHydrationState();
          break;
        case 27:
        case 5:
          pushHostContext(workInProgress2);
          break;
        case 4:
          pushHostContainer(workInProgress2, workInProgress2.stateNode.containerInfo);
          break;
        case 10:
          pushProvider(workInProgress2, workInProgress2.type, workInProgress2.memoizedProps.value);
          break;
        case 12:
          (renderLanes2 & workInProgress2.childLanes) !== 0 && (workInProgress2.flags |= 4), workInProgress2.flags |= 2048;
          var stateNode = workInProgress2.stateNode;
          stateNode.effectDuration = -0, stateNode.passiveEffectDuration = -0;
          break;
        case 31:
          if (workInProgress2.memoizedState !== null)
            return workInProgress2.flags |= 128, pushDehydratedActivitySuspenseHandler(workInProgress2), null;
          break;
        case 13:
          if (stateNode = workInProgress2.memoizedState, stateNode !== null) {
            if (stateNode.dehydrated !== null)
              return pushPrimaryTreeSuspenseHandler(workInProgress2), workInProgress2.flags |= 128, null;
            if ((renderLanes2 & workInProgress2.child.childLanes) !== 0)
              return updateSuspenseComponent(current2, workInProgress2, renderLanes2);
            return pushPrimaryTreeSuspenseHandler(workInProgress2), current2 = bailoutOnAlreadyFinishedWork(current2, workInProgress2, renderLanes2), current2 !== null ? current2.sibling : null;
          }
          pushPrimaryTreeSuspenseHandler(workInProgress2);
          break;
        case 19:
          var didSuspendBefore = (current2.flags & 128) !== 0;
          if (stateNode = (renderLanes2 & workInProgress2.childLanes) !== 0, stateNode || (propagateParentContextChanges(current2, workInProgress2, renderLanes2, !1), stateNode = (renderLanes2 & workInProgress2.childLanes) !== 0), didSuspendBefore) {
            if (stateNode)
              return updateSuspenseListComponent(current2, workInProgress2, renderLanes2);
            workInProgress2.flags |= 128;
          }
          if (didSuspendBefore = workInProgress2.memoizedState, didSuspendBefore !== null && (didSuspendBefore.rendering = null, didSuspendBefore.tail = null, didSuspendBefore.lastEffect = null), push(suspenseStackCursor, suspenseStackCursor.current, workInProgress2), stateNode)
            break;
          else
            return null;
        case 22:
          return workInProgress2.lanes = 0, updateOffscreenComponent(current2, workInProgress2, renderLanes2, workInProgress2.pendingProps);
        case 24:
          pushProvider(workInProgress2, CacheContext, current2.memoizedState.cache);
      }
      return bailoutOnAlreadyFinishedWork(current2, workInProgress2, renderLanes2);
    }
    function beginWork(current2, workInProgress2, renderLanes2) {
      if (workInProgress2._debugNeedsRemount && current2 !== null) {
        renderLanes2 = createFiberFromTypeAndProps(workInProgress2.type, workInProgress2.key, workInProgress2.pendingProps, workInProgress2._debugOwner || null, workInProgress2.mode, workInProgress2.lanes), renderLanes2._debugStack = workInProgress2._debugStack, renderLanes2._debugTask = workInProgress2._debugTask;
        var returnFiber = workInProgress2.return;
        if (returnFiber === null)
          throw Error("Cannot swap the root fiber.");
        if (current2.alternate = null, workInProgress2.alternate = null, renderLanes2.index = workInProgress2.index, renderLanes2.sibling = workInProgress2.sibling, renderLanes2.return = workInProgress2.return, renderLanes2.ref = workInProgress2.ref, renderLanes2._debugInfo = workInProgress2._debugInfo, workInProgress2 === returnFiber.child)
          returnFiber.child = renderLanes2;
        else {
          var prevSibling = returnFiber.child;
          if (prevSibling === null)
            throw Error("Expected parent to have a child.");
          for (;prevSibling.sibling !== workInProgress2; )
            if (prevSibling = prevSibling.sibling, prevSibling === null)
              throw Error("Expected to find the previous sibling.");
          prevSibling.sibling = renderLanes2;
        }
        return workInProgress2 = returnFiber.deletions, workInProgress2 === null ? (returnFiber.deletions = [current2], returnFiber.flags |= 16) : workInProgress2.push(current2), renderLanes2.flags |= 2, renderLanes2;
      }
      if (current2 !== null)
        if (current2.memoizedProps !== workInProgress2.pendingProps || workInProgress2.type !== current2.type)
          didReceiveUpdate = !0;
        else {
          if (!checkScheduledUpdateOrContext(current2, renderLanes2) && (workInProgress2.flags & 128) === 0)
            return didReceiveUpdate = !1, attemptEarlyBailoutIfNoScheduledUpdate(current2, workInProgress2, renderLanes2);
          didReceiveUpdate = (current2.flags & 131072) !== 0 ? !0 : !1;
        }
      else {
        if (didReceiveUpdate = !1, returnFiber = isHydrating)
          warnIfNotHydrating(), returnFiber = (workInProgress2.flags & 1048576) !== 0;
        returnFiber && (returnFiber = workInProgress2.index, warnIfNotHydrating(), pushTreeId(workInProgress2, treeForkCount, returnFiber));
      }
      switch (workInProgress2.lanes = 0, workInProgress2.tag) {
        case 16:
          a:
            if (returnFiber = workInProgress2.pendingProps, current2 = resolveLazy(workInProgress2.elementType), workInProgress2.type = current2, typeof current2 === "function")
              shouldConstruct(current2) ? (returnFiber = resolveClassComponentProps(current2, returnFiber), workInProgress2.tag = 1, workInProgress2.type = current2 = resolveFunctionForHotReloading(current2), workInProgress2 = updateClassComponent(null, workInProgress2, current2, returnFiber, renderLanes2)) : (workInProgress2.tag = 0, validateFunctionComponentInDev(workInProgress2, current2), workInProgress2.type = current2 = resolveFunctionForHotReloading(current2), workInProgress2 = updateFunctionComponent(null, workInProgress2, current2, returnFiber, renderLanes2));
            else {
              if (current2 !== void 0 && current2 !== null) {
                if (prevSibling = current2.$$typeof, prevSibling === REACT_FORWARD_REF_TYPE) {
                  workInProgress2.tag = 11, workInProgress2.type = current2 = resolveForwardRefForHotReloading(current2), workInProgress2 = updateForwardRef(null, workInProgress2, current2, returnFiber, renderLanes2);
                  break a;
                } else if (prevSibling === REACT_MEMO_TYPE) {
                  workInProgress2.tag = 14, workInProgress2 = updateMemoComponent(null, workInProgress2, current2, returnFiber, renderLanes2);
                  break a;
                }
              }
              throw workInProgress2 = "", current2 !== null && typeof current2 === "object" && current2.$$typeof === REACT_LAZY_TYPE && (workInProgress2 = " Did you wrap a component in React.lazy() more than once?"), current2 = getComponentNameFromType(current2) || current2, Error("Element type is invalid. Received a promise that resolves to: " + current2 + ". Lazy element type must resolve to a class or function." + workInProgress2);
            }
          return workInProgress2;
        case 0:
          return updateFunctionComponent(current2, workInProgress2, workInProgress2.type, workInProgress2.pendingProps, renderLanes2);
        case 1:
          return returnFiber = workInProgress2.type, prevSibling = resolveClassComponentProps(returnFiber, workInProgress2.pendingProps), updateClassComponent(current2, workInProgress2, returnFiber, prevSibling, renderLanes2);
        case 3:
          a: {
            if (pushHostContainer(workInProgress2, workInProgress2.stateNode.containerInfo), current2 === null)
              throw Error("Should have a current fiber. This is a bug in React.");
            var nextProps = workInProgress2.pendingProps;
            prevSibling = workInProgress2.memoizedState, returnFiber = prevSibling.element, cloneUpdateQueue(current2, workInProgress2), processUpdateQueue(workInProgress2, nextProps, null, renderLanes2);
            var nextState = workInProgress2.memoizedState;
            if (nextProps = nextState.cache, pushProvider(workInProgress2, CacheContext, nextProps), nextProps !== prevSibling.cache && propagateContextChanges(workInProgress2, [CacheContext], renderLanes2, !0), suspendIfUpdateReadFromEntangledAsyncAction(), nextProps = nextState.element, supportsHydration && prevSibling.isDehydrated)
              if (prevSibling = {
                element: nextProps,
                isDehydrated: !1,
                cache: nextState.cache
              }, workInProgress2.updateQueue.baseState = prevSibling, workInProgress2.memoizedState = prevSibling, workInProgress2.flags & 256) {
                workInProgress2 = mountHostRootWithoutHydrating(current2, workInProgress2, nextProps, renderLanes2);
                break a;
              } else if (nextProps !== returnFiber) {
                returnFiber = createCapturedValueAtFiber(Error("This root received an early update, before anything was able hydrate. Switched the entire root to client rendering."), workInProgress2), queueHydrationError(returnFiber), workInProgress2 = mountHostRootWithoutHydrating(current2, workInProgress2, nextProps, renderLanes2);
                break a;
              } else
                for (supportsHydration && (nextHydratableInstance = getFirstHydratableChildWithinContainer(workInProgress2.stateNode.containerInfo), hydrationParentFiber = workInProgress2, isHydrating = !0, hydrationErrors = null, didSuspendOrErrorDEV = !1, hydrationDiffRootDEV = null, rootOrSingletonContext = !0), current2 = mountChildFibers(workInProgress2, null, nextProps, renderLanes2), workInProgress2.child = current2;current2; )
                  current2.flags = current2.flags & -3 | 4096, current2 = current2.sibling;
            else {
              if (resetHydrationState(), nextProps === returnFiber) {
                workInProgress2 = bailoutOnAlreadyFinishedWork(current2, workInProgress2, renderLanes2);
                break a;
              }
              reconcileChildren(current2, workInProgress2, nextProps, renderLanes2);
            }
            workInProgress2 = workInProgress2.child;
          }
          return workInProgress2;
        case 26:
          if (supportsResources)
            return markRef(current2, workInProgress2), current2 === null ? (current2 = getResource(workInProgress2.type, null, workInProgress2.pendingProps, null)) ? workInProgress2.memoizedState = current2 : isHydrating || (workInProgress2.stateNode = createHoistableInstance(workInProgress2.type, workInProgress2.pendingProps, requiredContext(rootInstanceStackCursor.current), workInProgress2)) : workInProgress2.memoizedState = getResource(workInProgress2.type, current2.memoizedProps, workInProgress2.pendingProps, current2.memoizedState), null;
        case 27:
          if (supportsSingletons)
            return pushHostContext(workInProgress2), current2 === null && supportsSingletons && isHydrating && (prevSibling = requiredContext(rootInstanceStackCursor.current), returnFiber = getHostContext(), prevSibling = workInProgress2.stateNode = resolveSingletonInstance(workInProgress2.type, workInProgress2.pendingProps, prevSibling, returnFiber, !1), didSuspendOrErrorDEV || (returnFiber = diffHydratedPropsForDevWarnings(prevSibling, workInProgress2.type, workInProgress2.pendingProps, returnFiber), returnFiber !== null && (buildHydrationDiffNode(workInProgress2, 0).serverProps = returnFiber)), hydrationParentFiber = workInProgress2, rootOrSingletonContext = !0, nextHydratableInstance = getFirstHydratableChildWithinSingleton(workInProgress2.type, prevSibling, nextHydratableInstance)), reconcileChildren(current2, workInProgress2, workInProgress2.pendingProps.children, renderLanes2), markRef(current2, workInProgress2), current2 === null && (workInProgress2.flags |= 4194304), workInProgress2.child;
        case 5:
          return current2 === null && isHydrating && (nextProps = getHostContext(), returnFiber = validateHydratableInstance(workInProgress2.type, workInProgress2.pendingProps, nextProps), prevSibling = nextHydratableInstance, (nextState = !prevSibling) || (nextState = canHydrateInstance(prevSibling, workInProgress2.type, workInProgress2.pendingProps, rootOrSingletonContext), nextState !== null ? (workInProgress2.stateNode = nextState, didSuspendOrErrorDEV || (nextProps = diffHydratedPropsForDevWarnings(nextState, workInProgress2.type, workInProgress2.pendingProps, nextProps), nextProps !== null && (buildHydrationDiffNode(workInProgress2, 0).serverProps = nextProps)), hydrationParentFiber = workInProgress2, nextHydratableInstance = getFirstHydratableChild(nextState), rootOrSingletonContext = !1, nextProps = !0) : nextProps = !1, nextState = !nextProps), nextState && (returnFiber && warnNonHydratedInstance(workInProgress2, prevSibling), throwOnHydrationMismatch(workInProgress2))), pushHostContext(workInProgress2), prevSibling = workInProgress2.type, nextProps = workInProgress2.pendingProps, nextState = current2 !== null ? current2.memoizedProps : null, returnFiber = nextProps.children, shouldSetTextContent(prevSibling, nextProps) ? returnFiber = null : nextState !== null && shouldSetTextContent(prevSibling, nextState) && (workInProgress2.flags |= 32), workInProgress2.memoizedState !== null && (prevSibling = renderWithHooks(current2, workInProgress2, TransitionAwareHostComponent, null, null, renderLanes2), isPrimaryRenderer ? HostTransitionContext._currentValue = prevSibling : HostTransitionContext._currentValue2 = prevSibling), markRef(current2, workInProgress2), reconcileChildren(current2, workInProgress2, returnFiber, renderLanes2), workInProgress2.child;
        case 6:
          return current2 === null && isHydrating && (current2 = workInProgress2.pendingProps, renderLanes2 = getHostContext(), current2 = validateHydratableTextInstance(current2, renderLanes2), renderLanes2 = nextHydratableInstance, (returnFiber = !renderLanes2) || (returnFiber = canHydrateTextInstance(renderLanes2, workInProgress2.pendingProps, rootOrSingletonContext), returnFiber !== null ? (workInProgress2.stateNode = returnFiber, hydrationParentFiber = workInProgress2, nextHydratableInstance = null, returnFiber = !0) : returnFiber = !1, returnFiber = !returnFiber), returnFiber && (current2 && warnNonHydratedInstance(workInProgress2, renderLanes2), throwOnHydrationMismatch(workInProgress2))), null;
        case 13:
          return updateSuspenseComponent(current2, workInProgress2, renderLanes2);
        case 4:
          return pushHostContainer(workInProgress2, workInProgress2.stateNode.containerInfo), returnFiber = workInProgress2.pendingProps, current2 === null ? workInProgress2.child = reconcileChildFibers(workInProgress2, null, returnFiber, renderLanes2) : reconcileChildren(current2, workInProgress2, returnFiber, renderLanes2), workInProgress2.child;
        case 11:
          return updateForwardRef(current2, workInProgress2, workInProgress2.type, workInProgress2.pendingProps, renderLanes2);
        case 7:
          return reconcileChildren(current2, workInProgress2, workInProgress2.pendingProps, renderLanes2), workInProgress2.child;
        case 8:
          return reconcileChildren(current2, workInProgress2, workInProgress2.pendingProps.children, renderLanes2), workInProgress2.child;
        case 12:
          return workInProgress2.flags |= 4, workInProgress2.flags |= 2048, returnFiber = workInProgress2.stateNode, returnFiber.effectDuration = -0, returnFiber.passiveEffectDuration = -0, reconcileChildren(current2, workInProgress2, workInProgress2.pendingProps.children, renderLanes2), workInProgress2.child;
        case 10:
          return returnFiber = workInProgress2.type, prevSibling = workInProgress2.pendingProps, nextProps = prevSibling.value, "value" in prevSibling || hasWarnedAboutUsingNoValuePropOnContextProvider || (hasWarnedAboutUsingNoValuePropOnContextProvider = !0, console.error("The `value` prop is required for the `<Context.Provider>`. Did you misspell it or forget to pass it?")), pushProvider(workInProgress2, returnFiber, nextProps), reconcileChildren(current2, workInProgress2, prevSibling.children, renderLanes2), workInProgress2.child;
        case 9:
          return prevSibling = workInProgress2.type._context, returnFiber = workInProgress2.pendingProps.children, typeof returnFiber !== "function" && console.error("A context consumer was rendered with multiple children, or a child that isn't a function. A context consumer expects a single child that is a function. If you did pass a function, make sure there is no trailing or leading whitespace around it."), prepareToReadContext(workInProgress2), prevSibling = readContext(prevSibling), returnFiber = callComponentInDEV(returnFiber, prevSibling, void 0), workInProgress2.flags |= 1, reconcileChildren(current2, workInProgress2, returnFiber, renderLanes2), workInProgress2.child;
        case 14:
          return updateMemoComponent(current2, workInProgress2, workInProgress2.type, workInProgress2.pendingProps, renderLanes2);
        case 15:
          return updateSimpleMemoComponent(current2, workInProgress2, workInProgress2.type, workInProgress2.pendingProps, renderLanes2);
        case 19:
          return updateSuspenseListComponent(current2, workInProgress2, renderLanes2);
        case 31:
          return updateActivityComponent(current2, workInProgress2, renderLanes2);
        case 22:
          return updateOffscreenComponent(current2, workInProgress2, renderLanes2, workInProgress2.pendingProps);
        case 24:
          return prepareToReadContext(workInProgress2), returnFiber = readContext(CacheContext), current2 === null ? (prevSibling = peekCacheFromPool(), prevSibling === null && (prevSibling = workInProgressRoot, nextProps = createCache(), prevSibling.pooledCache = nextProps, retainCache(nextProps), nextProps !== null && (prevSibling.pooledCacheLanes |= renderLanes2), prevSibling = nextProps), workInProgress2.memoizedState = {
            parent: returnFiber,
            cache: prevSibling
          }, initializeUpdateQueue(workInProgress2), pushProvider(workInProgress2, CacheContext, prevSibling)) : ((current2.lanes & renderLanes2) !== 0 && (cloneUpdateQueue(current2, workInProgress2), processUpdateQueue(workInProgress2, null, null, renderLanes2), suspendIfUpdateReadFromEntangledAsyncAction()), prevSibling = current2.memoizedState, nextProps = workInProgress2.memoizedState, prevSibling.parent !== returnFiber ? (prevSibling = {
            parent: returnFiber,
            cache: returnFiber
          }, workInProgress2.memoizedState = prevSibling, workInProgress2.lanes === 0 && (workInProgress2.memoizedState = workInProgress2.updateQueue.baseState = prevSibling), pushProvider(workInProgress2, CacheContext, returnFiber)) : (returnFiber = nextProps.cache, pushProvider(workInProgress2, CacheContext, returnFiber), returnFiber !== prevSibling.cache && propagateContextChanges(workInProgress2, [CacheContext], renderLanes2, !0))), reconcileChildren(current2, workInProgress2, workInProgress2.pendingProps.children, renderLanes2), workInProgress2.child;
        case 29:
          throw workInProgress2.pendingProps;
      }
      throw Error("Unknown unit of work tag (" + workInProgress2.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function markUpdate(workInProgress2) {
      workInProgress2.flags |= 4;
    }
    function markCloned(workInProgress2) {
      supportsPersistence && (workInProgress2.flags |= 8);
    }
    function doesRequireClone(current2, completedWork) {
      if (current2 !== null && current2.child === completedWork.child)
        return !1;
      if ((completedWork.flags & 16) !== 0)
        return !0;
      for (current2 = completedWork.child;current2 !== null; ) {
        if ((current2.flags & 8218) !== 0 || (current2.subtreeFlags & 8218) !== 0)
          return !0;
        current2 = current2.sibling;
      }
      return !1;
    }
    function appendAllChildren(parent, workInProgress2, needsVisibilityToggle, isHidden) {
      if (supportsMutation)
        for (needsVisibilityToggle = workInProgress2.child;needsVisibilityToggle !== null; ) {
          if (needsVisibilityToggle.tag === 5 || needsVisibilityToggle.tag === 6)
            appendInitialChild(parent, needsVisibilityToggle.stateNode);
          else if (!(needsVisibilityToggle.tag === 4 || supportsSingletons && needsVisibilityToggle.tag === 27) && needsVisibilityToggle.child !== null) {
            needsVisibilityToggle.child.return = needsVisibilityToggle, needsVisibilityToggle = needsVisibilityToggle.child;
            continue;
          }
          if (needsVisibilityToggle === workInProgress2)
            break;
          for (;needsVisibilityToggle.sibling === null; ) {
            if (needsVisibilityToggle.return === null || needsVisibilityToggle.return === workInProgress2)
              return;
            needsVisibilityToggle = needsVisibilityToggle.return;
          }
          needsVisibilityToggle.sibling.return = needsVisibilityToggle.return, needsVisibilityToggle = needsVisibilityToggle.sibling;
        }
      else if (supportsPersistence)
        for (var _node = workInProgress2.child;_node !== null; ) {
          if (_node.tag === 5) {
            var instance = _node.stateNode;
            needsVisibilityToggle && isHidden && (instance = cloneHiddenInstance(instance, _node.type, _node.memoizedProps)), appendInitialChild(parent, instance);
          } else if (_node.tag === 6)
            instance = _node.stateNode, needsVisibilityToggle && isHidden && (instance = cloneHiddenTextInstance(instance, _node.memoizedProps)), appendInitialChild(parent, instance);
          else if (_node.tag !== 4) {
            if (_node.tag === 22 && _node.memoizedState !== null)
              instance = _node.child, instance !== null && (instance.return = _node), appendAllChildren(parent, _node, !0, !0);
            else if (_node.child !== null) {
              _node.child.return = _node, _node = _node.child;
              continue;
            }
          }
          if (_node === workInProgress2)
            break;
          for (;_node.sibling === null; ) {
            if (_node.return === null || _node.return === workInProgress2)
              return;
            _node = _node.return;
          }
          _node.sibling.return = _node.return, _node = _node.sibling;
        }
    }
    function appendAllChildrenToContainer(containerChildSet, workInProgress2, needsVisibilityToggle, isHidden) {
      var hasOffscreenComponentChild = !1;
      if (supportsPersistence)
        for (var node = workInProgress2.child;node !== null; ) {
          if (node.tag === 5) {
            var instance = node.stateNode;
            needsVisibilityToggle && isHidden && (instance = cloneHiddenInstance(instance, node.type, node.memoizedProps)), appendChildToContainerChildSet(containerChildSet, instance);
          } else if (node.tag === 6)
            instance = node.stateNode, needsVisibilityToggle && isHidden && (instance = cloneHiddenTextInstance(instance, node.memoizedProps)), appendChildToContainerChildSet(containerChildSet, instance);
          else if (node.tag !== 4) {
            if (node.tag === 22 && node.memoizedState !== null)
              hasOffscreenComponentChild = node.child, hasOffscreenComponentChild !== null && (hasOffscreenComponentChild.return = node), appendAllChildrenToContainer(containerChildSet, node, !0, !0), hasOffscreenComponentChild = !0;
            else if (node.child !== null) {
              node.child.return = node, node = node.child;
              continue;
            }
          }
          if (node === workInProgress2)
            break;
          for (;node.sibling === null; ) {
            if (node.return === null || node.return === workInProgress2)
              return hasOffscreenComponentChild;
            node = node.return;
          }
          node.sibling.return = node.return, node = node.sibling;
        }
      return hasOffscreenComponentChild;
    }
    function updateHostContainer(current2, workInProgress2) {
      if (supportsPersistence && doesRequireClone(current2, workInProgress2)) {
        current2 = workInProgress2.stateNode;
        var container = current2.containerInfo, newChildSet = createContainerChildSet();
        appendAllChildrenToContainer(newChildSet, workInProgress2, !1, !1), current2.pendingChildren = newChildSet, markUpdate(workInProgress2), finalizeContainerChildren(container, newChildSet);
      }
    }
    function updateHostComponent(current2, workInProgress2, type, newProps) {
      if (supportsMutation)
        current2.memoizedProps !== newProps && markUpdate(workInProgress2);
      else if (supportsPersistence) {
        var { stateNode: currentInstance, memoizedProps: _oldProps } = current2;
        if ((current2 = doesRequireClone(current2, workInProgress2)) || _oldProps !== newProps) {
          var currentHostContext = getHostContext();
          _oldProps = cloneInstance(currentInstance, type, _oldProps, newProps, !current2, null), _oldProps === currentInstance ? workInProgress2.stateNode = currentInstance : (markCloned(workInProgress2), finalizeInitialChildren(_oldProps, type, newProps, currentHostContext) && markUpdate(workInProgress2), workInProgress2.stateNode = _oldProps, current2 && appendAllChildren(_oldProps, workInProgress2, !1, !1));
        } else
          workInProgress2.stateNode = currentInstance;
      }
    }
    function preloadInstanceAndSuspendIfNeeded(workInProgress2, type, oldProps, newProps, renderLanes2) {
      if ((workInProgress2.mode & 32) !== NoMode && (oldProps === null ? maySuspendCommit(type, newProps) : maySuspendCommitOnUpdate(type, oldProps, newProps))) {
        if (workInProgress2.flags |= 16777216, (renderLanes2 & 335544128) === renderLanes2 || maySuspendCommitInSyncRender(type, newProps))
          if (preloadInstance(workInProgress2.stateNode, type, newProps))
            workInProgress2.flags |= 8192;
          else if (shouldRemainOnPreviousScreen())
            workInProgress2.flags |= 8192;
          else
            throw suspendedThenable = noopSuspenseyCommitThenable, SuspenseyCommitException;
      } else
        workInProgress2.flags &= -16777217;
    }
    function preloadResourceAndSuspendIfNeeded(workInProgress2, resource) {
      if (mayResourceSuspendCommit(resource)) {
        if (workInProgress2.flags |= 16777216, !preloadResource(resource))
          if (shouldRemainOnPreviousScreen())
            workInProgress2.flags |= 8192;
          else
            throw suspendedThenable = noopSuspenseyCommitThenable, SuspenseyCommitException;
      } else
        workInProgress2.flags &= -16777217;
    }
    function scheduleRetryEffect(workInProgress2, retryQueue) {
      retryQueue !== null && (workInProgress2.flags |= 4), workInProgress2.flags & 16384 && (retryQueue = workInProgress2.tag !== 22 ? claimNextRetryLane() : 536870912, workInProgress2.lanes |= retryQueue, workInProgressSuspendedRetryLanes |= retryQueue);
    }
    function cutOffTailIfNeeded(renderState, hasRenderedATailFallback) {
      if (!isHydrating)
        switch (renderState.tailMode) {
          case "hidden":
            hasRenderedATailFallback = renderState.tail;
            for (var lastTailNode = null;hasRenderedATailFallback !== null; )
              hasRenderedATailFallback.alternate !== null && (lastTailNode = hasRenderedATailFallback), hasRenderedATailFallback = hasRenderedATailFallback.sibling;
            lastTailNode === null ? renderState.tail = null : lastTailNode.sibling = null;
            break;
          case "collapsed":
            lastTailNode = renderState.tail;
            for (var _lastTailNode = null;lastTailNode !== null; )
              lastTailNode.alternate !== null && (_lastTailNode = lastTailNode), lastTailNode = lastTailNode.sibling;
            _lastTailNode === null ? hasRenderedATailFallback || renderState.tail === null ? renderState.tail = null : renderState.tail.sibling = null : _lastTailNode.sibling = null;
        }
    }
    function bubbleProperties(completedWork) {
      var didBailout = completedWork.alternate !== null && completedWork.alternate.child === completedWork.child, newChildLanes = 0, subtreeFlags = 0;
      if (didBailout)
        if ((completedWork.mode & 2) !== NoMode) {
          for (var { selfBaseDuration: _treeBaseDuration, child: _child2 } = completedWork;_child2 !== null; )
            newChildLanes |= _child2.lanes | _child2.childLanes, subtreeFlags |= _child2.subtreeFlags & 65011712, subtreeFlags |= _child2.flags & 65011712, _treeBaseDuration += _child2.treeBaseDuration, _child2 = _child2.sibling;
          completedWork.treeBaseDuration = _treeBaseDuration;
        } else
          for (_treeBaseDuration = completedWork.child;_treeBaseDuration !== null; )
            newChildLanes |= _treeBaseDuration.lanes | _treeBaseDuration.childLanes, subtreeFlags |= _treeBaseDuration.subtreeFlags & 65011712, subtreeFlags |= _treeBaseDuration.flags & 65011712, _treeBaseDuration.return = completedWork, _treeBaseDuration = _treeBaseDuration.sibling;
      else if ((completedWork.mode & 2) !== NoMode) {
        _treeBaseDuration = completedWork.actualDuration, _child2 = completedWork.selfBaseDuration;
        for (var child = completedWork.child;child !== null; )
          newChildLanes |= child.lanes | child.childLanes, subtreeFlags |= child.subtreeFlags, subtreeFlags |= child.flags, _treeBaseDuration += child.actualDuration, _child2 += child.treeBaseDuration, child = child.sibling;
        completedWork.actualDuration = _treeBaseDuration, completedWork.treeBaseDuration = _child2;
      } else
        for (_treeBaseDuration = completedWork.child;_treeBaseDuration !== null; )
          newChildLanes |= _treeBaseDuration.lanes | _treeBaseDuration.childLanes, subtreeFlags |= _treeBaseDuration.subtreeFlags, subtreeFlags |= _treeBaseDuration.flags, _treeBaseDuration.return = completedWork, _treeBaseDuration = _treeBaseDuration.sibling;
      return completedWork.subtreeFlags |= subtreeFlags, completedWork.childLanes = newChildLanes, didBailout;
    }
    function completeWork(current2, workInProgress2, renderLanes2) {
      var newProps = workInProgress2.pendingProps;
      switch (popTreeContext(workInProgress2), workInProgress2.tag) {
        case 16:
        case 15:
        case 0:
        case 11:
        case 7:
        case 8:
        case 12:
        case 9:
        case 14:
          return bubbleProperties(workInProgress2), null;
        case 1:
          return bubbleProperties(workInProgress2), null;
        case 3:
          if (renderLanes2 = workInProgress2.stateNode, newProps = null, current2 !== null && (newProps = current2.memoizedState.cache), workInProgress2.memoizedState.cache !== newProps && (workInProgress2.flags |= 2048), popProvider(CacheContext, workInProgress2), popHostContainer(workInProgress2), renderLanes2.pendingContext && (renderLanes2.context = renderLanes2.pendingContext, renderLanes2.pendingContext = null), current2 === null || current2.child === null)
            popHydrationState(workInProgress2) ? (emitPendingHydrationWarnings(), markUpdate(workInProgress2)) : current2 === null || current2.memoizedState.isDehydrated && (workInProgress2.flags & 256) === 0 || (workInProgress2.flags |= 1024, upgradeHydrationErrorsToRecoverable());
          return updateHostContainer(current2, workInProgress2), bubbleProperties(workInProgress2), null;
        case 26:
          if (supportsResources) {
            var { type, memoizedState: nextResource } = workInProgress2;
            return current2 === null ? (markUpdate(workInProgress2), nextResource !== null ? (bubbleProperties(workInProgress2), preloadResourceAndSuspendIfNeeded(workInProgress2, nextResource)) : (bubbleProperties(workInProgress2), preloadInstanceAndSuspendIfNeeded(workInProgress2, type, null, newProps, renderLanes2))) : nextResource ? nextResource !== current2.memoizedState ? (markUpdate(workInProgress2), bubbleProperties(workInProgress2), preloadResourceAndSuspendIfNeeded(workInProgress2, nextResource)) : (bubbleProperties(workInProgress2), workInProgress2.flags &= -16777217) : (nextResource = current2.memoizedProps, supportsMutation ? nextResource !== newProps && markUpdate(workInProgress2) : updateHostComponent(current2, workInProgress2, type, newProps), bubbleProperties(workInProgress2), preloadInstanceAndSuspendIfNeeded(workInProgress2, type, nextResource, newProps, renderLanes2)), null;
          }
        case 27:
          if (supportsSingletons) {
            if (popHostContext(workInProgress2), renderLanes2 = requiredContext(rootInstanceStackCursor.current), type = workInProgress2.type, current2 !== null && workInProgress2.stateNode != null)
              supportsMutation ? current2.memoizedProps !== newProps && markUpdate(workInProgress2) : updateHostComponent(current2, workInProgress2, type, newProps);
            else {
              if (!newProps) {
                if (workInProgress2.stateNode === null)
                  throw Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
                return bubbleProperties(workInProgress2), null;
              }
              current2 = getHostContext(), popHydrationState(workInProgress2) ? prepareToHydrateHostInstance(workInProgress2, current2) : (current2 = resolveSingletonInstance(type, newProps, renderLanes2, current2, !0), workInProgress2.stateNode = current2, markUpdate(workInProgress2));
            }
            return bubbleProperties(workInProgress2), null;
          }
        case 5:
          if (popHostContext(workInProgress2), type = workInProgress2.type, current2 !== null && workInProgress2.stateNode != null)
            updateHostComponent(current2, workInProgress2, type, newProps);
          else {
            if (!newProps) {
              if (workInProgress2.stateNode === null)
                throw Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
              return bubbleProperties(workInProgress2), null;
            }
            if (nextResource = getHostContext(), popHydrationState(workInProgress2))
              prepareToHydrateHostInstance(workInProgress2, nextResource), finalizeHydratedChildren(workInProgress2.stateNode, type, newProps, nextResource) && (workInProgress2.flags |= 64);
            else {
              var _rootContainerInstance = requiredContext(rootInstanceStackCursor.current);
              _rootContainerInstance = createInstance2(type, newProps, _rootContainerInstance, nextResource, workInProgress2), markCloned(workInProgress2), appendAllChildren(_rootContainerInstance, workInProgress2, !1, !1), workInProgress2.stateNode = _rootContainerInstance, finalizeInitialChildren(_rootContainerInstance, type, newProps, nextResource) && markUpdate(workInProgress2);
            }
          }
          return bubbleProperties(workInProgress2), preloadInstanceAndSuspendIfNeeded(workInProgress2, workInProgress2.type, current2 === null ? null : current2.memoizedProps, workInProgress2.pendingProps, renderLanes2), null;
        case 6:
          if (current2 && workInProgress2.stateNode != null)
            renderLanes2 = current2.memoizedProps, supportsMutation ? renderLanes2 !== newProps && markUpdate(workInProgress2) : supportsPersistence && (renderLanes2 !== newProps ? (current2 = requiredContext(rootInstanceStackCursor.current), renderLanes2 = getHostContext(), markCloned(workInProgress2), workInProgress2.stateNode = createTextInstance(newProps, current2, renderLanes2, workInProgress2)) : workInProgress2.stateNode = current2.stateNode);
          else {
            if (typeof newProps !== "string" && workInProgress2.stateNode === null)
              throw Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
            if (current2 = requiredContext(rootInstanceStackCursor.current), renderLanes2 = getHostContext(), popHydrationState(workInProgress2)) {
              if (!supportsHydration)
                throw Error("Expected prepareToHydrateHostTextInstance() to never be called. This error is likely caused by a bug in React. Please file an issue.");
              if (current2 = workInProgress2.stateNode, renderLanes2 = workInProgress2.memoizedProps, type = !didSuspendOrErrorDEV, newProps = null, nextResource = hydrationParentFiber, nextResource !== null)
                switch (nextResource.tag) {
                  case 3:
                    type && (type = diffHydratedTextForDevWarnings(current2, renderLanes2, newProps), type !== null && (buildHydrationDiffNode(workInProgress2, 0).serverProps = type));
                    break;
                  case 27:
                  case 5:
                    newProps = nextResource.memoizedProps, type && (type = diffHydratedTextForDevWarnings(current2, renderLanes2, newProps), type !== null && (buildHydrationDiffNode(workInProgress2, 0).serverProps = type));
                }
              hydrateTextInstance(current2, renderLanes2, workInProgress2, newProps) || throwOnHydrationMismatch(workInProgress2, !0);
            } else
              markCloned(workInProgress2), workInProgress2.stateNode = createTextInstance(newProps, current2, renderLanes2, workInProgress2);
          }
          return bubbleProperties(workInProgress2), null;
        case 31:
          if (renderLanes2 = workInProgress2.memoizedState, current2 === null || current2.memoizedState !== null) {
            if (newProps = popHydrationState(workInProgress2), renderLanes2 !== null) {
              if (current2 === null) {
                if (!newProps)
                  throw Error("A dehydrated suspense component was completed without a hydrated node. This is probably a bug in React.");
                if (!supportsHydration)
                  throw Error("Expected prepareToHydrateHostActivityInstance() to never be called. This error is likely caused by a bug in React. Please file an issue.");
                if (current2 = workInProgress2.memoizedState, current2 = current2 !== null ? current2.dehydrated : null, !current2)
                  throw Error("Expected to have a hydrated activity instance. This error is likely caused by a bug in React. Please file an issue.");
                hydrateActivityInstance(current2, workInProgress2), bubbleProperties(workInProgress2), (workInProgress2.mode & 2) !== NoMode && renderLanes2 !== null && (current2 = workInProgress2.child, current2 !== null && (workInProgress2.treeBaseDuration -= current2.treeBaseDuration));
              } else
                emitPendingHydrationWarnings(), resetHydrationState(), (workInProgress2.flags & 128) === 0 && (renderLanes2 = workInProgress2.memoizedState = null), workInProgress2.flags |= 4, bubbleProperties(workInProgress2), (workInProgress2.mode & 2) !== NoMode && renderLanes2 !== null && (current2 = workInProgress2.child, current2 !== null && (workInProgress2.treeBaseDuration -= current2.treeBaseDuration));
              current2 = !1;
            } else
              renderLanes2 = upgradeHydrationErrorsToRecoverable(), current2 !== null && current2.memoizedState !== null && (current2.memoizedState.hydrationErrors = renderLanes2), current2 = !0;
            if (!current2) {
              if (workInProgress2.flags & 256)
                return popSuspenseHandler(workInProgress2), workInProgress2;
              return popSuspenseHandler(workInProgress2), null;
            }
            if ((workInProgress2.flags & 128) !== 0)
              throw Error("Client rendering an Activity suspended it again. This is a bug in React.");
          }
          return bubbleProperties(workInProgress2), null;
        case 13:
          if (newProps = workInProgress2.memoizedState, current2 === null || current2.memoizedState !== null && current2.memoizedState.dehydrated !== null) {
            if (type = newProps, nextResource = popHydrationState(workInProgress2), type !== null && type.dehydrated !== null) {
              if (current2 === null) {
                if (!nextResource)
                  throw Error("A dehydrated suspense component was completed without a hydrated node. This is probably a bug in React.");
                if (!supportsHydration)
                  throw Error("Expected prepareToHydrateHostSuspenseInstance() to never be called. This error is likely caused by a bug in React. Please file an issue.");
                if (nextResource = workInProgress2.memoizedState, nextResource = nextResource !== null ? nextResource.dehydrated : null, !nextResource)
                  throw Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
                hydrateSuspenseInstance(nextResource, workInProgress2), bubbleProperties(workInProgress2), (workInProgress2.mode & 2) !== NoMode && type !== null && (type = workInProgress2.child, type !== null && (workInProgress2.treeBaseDuration -= type.treeBaseDuration));
              } else
                emitPendingHydrationWarnings(), resetHydrationState(), (workInProgress2.flags & 128) === 0 && (type = workInProgress2.memoizedState = null), workInProgress2.flags |= 4, bubbleProperties(workInProgress2), (workInProgress2.mode & 2) !== NoMode && type !== null && (type = workInProgress2.child, type !== null && (workInProgress2.treeBaseDuration -= type.treeBaseDuration));
              type = !1;
            } else
              type = upgradeHydrationErrorsToRecoverable(), current2 !== null && current2.memoizedState !== null && (current2.memoizedState.hydrationErrors = type), type = !0;
            if (!type) {
              if (workInProgress2.flags & 256)
                return popSuspenseHandler(workInProgress2), workInProgress2;
              return popSuspenseHandler(workInProgress2), null;
            }
          }
          if (popSuspenseHandler(workInProgress2), (workInProgress2.flags & 128) !== 0)
            return workInProgress2.lanes = renderLanes2, (workInProgress2.mode & 2) !== NoMode && transferActualDuration(workInProgress2), workInProgress2;
          return renderLanes2 = newProps !== null, current2 = current2 !== null && current2.memoizedState !== null, renderLanes2 && (newProps = workInProgress2.child, type = null, newProps.alternate !== null && newProps.alternate.memoizedState !== null && newProps.alternate.memoizedState.cachePool !== null && (type = newProps.alternate.memoizedState.cachePool.pool), nextResource = null, newProps.memoizedState !== null && newProps.memoizedState.cachePool !== null && (nextResource = newProps.memoizedState.cachePool.pool), nextResource !== type && (newProps.flags |= 2048)), renderLanes2 !== current2 && renderLanes2 && (workInProgress2.child.flags |= 8192), scheduleRetryEffect(workInProgress2, workInProgress2.updateQueue), bubbleProperties(workInProgress2), (workInProgress2.mode & 2) !== NoMode && renderLanes2 && (current2 = workInProgress2.child, current2 !== null && (workInProgress2.treeBaseDuration -= current2.treeBaseDuration)), null;
        case 4:
          return popHostContainer(workInProgress2), updateHostContainer(current2, workInProgress2), current2 === null && preparePortalMount(workInProgress2.stateNode.containerInfo), bubbleProperties(workInProgress2), null;
        case 10:
          return popProvider(workInProgress2.type, workInProgress2), bubbleProperties(workInProgress2), null;
        case 19:
          if (pop(suspenseStackCursor, workInProgress2), newProps = workInProgress2.memoizedState, newProps === null)
            return bubbleProperties(workInProgress2), null;
          if (type = (workInProgress2.flags & 128) !== 0, nextResource = newProps.rendering, nextResource === null)
            if (type)
              cutOffTailIfNeeded(newProps, !1);
            else {
              if (workInProgressRootExitStatus !== RootInProgress || current2 !== null && (current2.flags & 128) !== 0)
                for (current2 = workInProgress2.child;current2 !== null; ) {
                  if (nextResource = findFirstSuspended(current2), nextResource !== null) {
                    workInProgress2.flags |= 128, cutOffTailIfNeeded(newProps, !1), current2 = nextResource.updateQueue, workInProgress2.updateQueue = current2, scheduleRetryEffect(workInProgress2, current2), workInProgress2.subtreeFlags = 0, current2 = renderLanes2;
                    for (renderLanes2 = workInProgress2.child;renderLanes2 !== null; )
                      resetWorkInProgress(renderLanes2, current2), renderLanes2 = renderLanes2.sibling;
                    return push(suspenseStackCursor, suspenseStackCursor.current & SubtreeSuspenseContextMask | ForceSuspenseFallback, workInProgress2), isHydrating && pushTreeFork(workInProgress2, newProps.treeForkCount), workInProgress2.child;
                  }
                  current2 = current2.sibling;
                }
              newProps.tail !== null && now$1() > workInProgressRootRenderTargetTime && (workInProgress2.flags |= 128, type = !0, cutOffTailIfNeeded(newProps, !1), workInProgress2.lanes = 4194304);
            }
          else {
            if (!type)
              if (current2 = findFirstSuspended(nextResource), current2 !== null) {
                if (workInProgress2.flags |= 128, type = !0, current2 = current2.updateQueue, workInProgress2.updateQueue = current2, scheduleRetryEffect(workInProgress2, current2), cutOffTailIfNeeded(newProps, !0), newProps.tail === null && newProps.tailMode === "hidden" && !nextResource.alternate && !isHydrating)
                  return bubbleProperties(workInProgress2), null;
              } else
                2 * now$1() - newProps.renderingStartTime > workInProgressRootRenderTargetTime && renderLanes2 !== 536870912 && (workInProgress2.flags |= 128, type = !0, cutOffTailIfNeeded(newProps, !1), workInProgress2.lanes = 4194304);
            newProps.isBackwards ? (nextResource.sibling = workInProgress2.child, workInProgress2.child = nextResource) : (current2 = newProps.last, current2 !== null ? current2.sibling = nextResource : workInProgress2.child = nextResource, newProps.last = nextResource);
          }
          if (newProps.tail !== null)
            return current2 = newProps.tail, newProps.rendering = current2, newProps.tail = current2.sibling, newProps.renderingStartTime = now$1(), current2.sibling = null, renderLanes2 = suspenseStackCursor.current, renderLanes2 = type ? renderLanes2 & SubtreeSuspenseContextMask | ForceSuspenseFallback : renderLanes2 & SubtreeSuspenseContextMask, push(suspenseStackCursor, renderLanes2, workInProgress2), isHydrating && pushTreeFork(workInProgress2, newProps.treeForkCount), current2;
          return bubbleProperties(workInProgress2), null;
        case 22:
        case 23:
          return popSuspenseHandler(workInProgress2), popHiddenContext(workInProgress2), newProps = workInProgress2.memoizedState !== null, current2 !== null ? current2.memoizedState !== null !== newProps && (workInProgress2.flags |= 8192) : newProps && (workInProgress2.flags |= 8192), newProps ? (renderLanes2 & 536870912) !== 0 && (workInProgress2.flags & 128) === 0 && (bubbleProperties(workInProgress2), workInProgress2.subtreeFlags & 6 && (workInProgress2.flags |= 8192)) : bubbleProperties(workInProgress2), renderLanes2 = workInProgress2.updateQueue, renderLanes2 !== null && scheduleRetryEffect(workInProgress2, renderLanes2.retryQueue), renderLanes2 = null, current2 !== null && current2.memoizedState !== null && current2.memoizedState.cachePool !== null && (renderLanes2 = current2.memoizedState.cachePool.pool), newProps = null, workInProgress2.memoizedState !== null && workInProgress2.memoizedState.cachePool !== null && (newProps = workInProgress2.memoizedState.cachePool.pool), newProps !== renderLanes2 && (workInProgress2.flags |= 2048), current2 !== null && pop(resumedCache, workInProgress2), null;
        case 24:
          return renderLanes2 = null, current2 !== null && (renderLanes2 = current2.memoizedState.cache), workInProgress2.memoizedState.cache !== renderLanes2 && (workInProgress2.flags |= 2048), popProvider(CacheContext, workInProgress2), bubbleProperties(workInProgress2), null;
        case 25:
          return null;
        case 30:
          return null;
      }
      throw Error("Unknown unit of work tag (" + workInProgress2.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function unwindWork(current2, workInProgress2) {
      switch (popTreeContext(workInProgress2), workInProgress2.tag) {
        case 1:
          return current2 = workInProgress2.flags, current2 & 65536 ? (workInProgress2.flags = current2 & -65537 | 128, (workInProgress2.mode & 2) !== NoMode && transferActualDuration(workInProgress2), workInProgress2) : null;
        case 3:
          return popProvider(CacheContext, workInProgress2), popHostContainer(workInProgress2), current2 = workInProgress2.flags, (current2 & 65536) !== 0 && (current2 & 128) === 0 ? (workInProgress2.flags = current2 & -65537 | 128, workInProgress2) : null;
        case 26:
        case 27:
        case 5:
          return popHostContext(workInProgress2), null;
        case 31:
          if (workInProgress2.memoizedState !== null) {
            if (popSuspenseHandler(workInProgress2), workInProgress2.alternate === null)
              throw Error("Threw in newly mounted dehydrated component. This is likely a bug in React. Please file an issue.");
            resetHydrationState();
          }
          return current2 = workInProgress2.flags, current2 & 65536 ? (workInProgress2.flags = current2 & -65537 | 128, (workInProgress2.mode & 2) !== NoMode && transferActualDuration(workInProgress2), workInProgress2) : null;
        case 13:
          if (popSuspenseHandler(workInProgress2), current2 = workInProgress2.memoizedState, current2 !== null && current2.dehydrated !== null) {
            if (workInProgress2.alternate === null)
              throw Error("Threw in newly mounted dehydrated component. This is likely a bug in React. Please file an issue.");
            resetHydrationState();
          }
          return current2 = workInProgress2.flags, current2 & 65536 ? (workInProgress2.flags = current2 & -65537 | 128, (workInProgress2.mode & 2) !== NoMode && transferActualDuration(workInProgress2), workInProgress2) : null;
        case 19:
          return pop(suspenseStackCursor, workInProgress2), null;
        case 4:
          return popHostContainer(workInProgress2), null;
        case 10:
          return popProvider(workInProgress2.type, workInProgress2), null;
        case 22:
        case 23:
          return popSuspenseHandler(workInProgress2), popHiddenContext(workInProgress2), current2 !== null && pop(resumedCache, workInProgress2), current2 = workInProgress2.flags, current2 & 65536 ? (workInProgress2.flags = current2 & -65537 | 128, (workInProgress2.mode & 2) !== NoMode && transferActualDuration(workInProgress2), workInProgress2) : null;
        case 24:
          return popProvider(CacheContext, workInProgress2), null;
        case 25:
          return null;
        default:
          return null;
      }
    }
    function unwindInterruptedWork(current2, interruptedWork) {
      switch (popTreeContext(interruptedWork), interruptedWork.tag) {
        case 3:
          popProvider(CacheContext, interruptedWork), popHostContainer(interruptedWork);
          break;
        case 26:
        case 27:
        case 5:
          popHostContext(interruptedWork);
          break;
        case 4:
          popHostContainer(interruptedWork);
          break;
        case 31:
          interruptedWork.memoizedState !== null && popSuspenseHandler(interruptedWork);
          break;
        case 13:
          popSuspenseHandler(interruptedWork);
          break;
        case 19:
          pop(suspenseStackCursor, interruptedWork);
          break;
        case 10:
          popProvider(interruptedWork.type, interruptedWork);
          break;
        case 22:
        case 23:
          popSuspenseHandler(interruptedWork), popHiddenContext(interruptedWork), current2 !== null && pop(resumedCache, interruptedWork);
          break;
        case 24:
          popProvider(CacheContext, interruptedWork);
      }
    }
    function shouldProfile(current2) {
      return (current2.mode & 2) !== NoMode;
    }
    function commitHookLayoutEffects(finishedWork, hookFlags) {
      shouldProfile(finishedWork) ? (startEffectTimer(), commitHookEffectListMount(hookFlags, finishedWork), recordEffectDuration()) : commitHookEffectListMount(hookFlags, finishedWork);
    }
    function commitHookLayoutUnmountEffects(finishedWork, nearestMountedAncestor, hookFlags) {
      shouldProfile(finishedWork) ? (startEffectTimer(), commitHookEffectListUnmount(hookFlags, finishedWork, nearestMountedAncestor), recordEffectDuration()) : commitHookEffectListUnmount(hookFlags, finishedWork, nearestMountedAncestor);
    }
    function commitHookEffectListMount(flags, finishedWork) {
      try {
        var updateQueue = finishedWork.updateQueue, lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;
        if (lastEffect !== null) {
          var firstEffect = lastEffect.next;
          updateQueue = firstEffect;
          do {
            if ((updateQueue.tag & flags) === flags && (lastEffect = void 0, (flags & Insertion) !== NoFlags && (isRunningInsertionEffect = !0), lastEffect = runWithFiberInDEV(finishedWork, callCreateInDEV, updateQueue), (flags & Insertion) !== NoFlags && (isRunningInsertionEffect = !1), lastEffect !== void 0 && typeof lastEffect !== "function")) {
              var hookName = void 0;
              hookName = (updateQueue.tag & Layout) !== 0 ? "useLayoutEffect" : (updateQueue.tag & Insertion) !== 0 ? "useInsertionEffect" : "useEffect";
              var addendum = void 0;
              addendum = lastEffect === null ? " You returned null. If your effect does not require clean up, return undefined (or nothing)." : typeof lastEffect.then === "function" ? `

It looks like you wrote ` + hookName + `(async () => ...) or returned a Promise. Instead, write the async function inside your effect and call it immediately:

` + hookName + `(() => {
  async function fetchData() {
    // You can await here
    const response = await MyAPI.getData(someId);
    // ...
  }
  fetchData();
}, [someId]); // Or [] if effect doesn't need props or state

Learn more about data fetching with Hooks: https://react.dev/link/hooks-data-fetching` : " You returned: " + lastEffect, runWithFiberInDEV(finishedWork, function(n5, a2) {
                console.error("%s must not return anything besides a function, which is used for clean-up.%s", n5, a2);
              }, hookName, addendum);
            }
            updateQueue = updateQueue.next;
          } while (updateQueue !== firstEffect);
        }
      } catch (error44) {
        captureCommitPhaseError(finishedWork, finishedWork.return, error44);
      }
    }
    function commitHookEffectListUnmount(flags, finishedWork, nearestMountedAncestor) {
      try {
        var updateQueue = finishedWork.updateQueue, lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;
        if (lastEffect !== null) {
          var firstEffect = lastEffect.next;
          updateQueue = firstEffect;
          do {
            if ((updateQueue.tag & flags) === flags) {
              var inst = updateQueue.inst, destroy2 = inst.destroy;
              destroy2 !== void 0 && (inst.destroy = void 0, (flags & Insertion) !== NoFlags && (isRunningInsertionEffect = !0), lastEffect = finishedWork, runWithFiberInDEV(lastEffect, callDestroyInDEV, lastEffect, nearestMountedAncestor, destroy2), (flags & Insertion) !== NoFlags && (isRunningInsertionEffect = !1));
            }
            updateQueue = updateQueue.next;
          } while (updateQueue !== firstEffect);
        }
      } catch (error44) {
        captureCommitPhaseError(finishedWork, finishedWork.return, error44);
      }
    }
    function commitHookPassiveMountEffects(finishedWork, hookFlags) {
      shouldProfile(finishedWork) ? (startEffectTimer(), commitHookEffectListMount(hookFlags, finishedWork), recordEffectDuration()) : commitHookEffectListMount(hookFlags, finishedWork);
    }
    function commitHookPassiveUnmountEffects(finishedWork, nearestMountedAncestor, hookFlags) {
      shouldProfile(finishedWork) ? (startEffectTimer(), commitHookEffectListUnmount(hookFlags, finishedWork, nearestMountedAncestor), recordEffectDuration()) : commitHookEffectListUnmount(hookFlags, finishedWork, nearestMountedAncestor);
    }
    function commitClassCallbacks(finishedWork) {
      var updateQueue = finishedWork.updateQueue;
      if (updateQueue !== null) {
        var instance = finishedWork.stateNode;
        finishedWork.type.defaultProps || "ref" in finishedWork.memoizedProps || didWarnAboutReassigningProps || (instance.props !== finishedWork.memoizedProps && console.error("Expected %s props to match memoized props before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", getComponentNameFromFiber(finishedWork) || "instance"), instance.state !== finishedWork.memoizedState && console.error("Expected %s state to match memoized state before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", getComponentNameFromFiber(finishedWork) || "instance"));
        try {
          runWithFiberInDEV(finishedWork, commitCallbacks, updateQueue, instance);
        } catch (error44) {
          captureCommitPhaseError(finishedWork, finishedWork.return, error44);
        }
      }
    }
    function callGetSnapshotBeforeUpdates(instance, prevProps, prevState) {
      return instance.getSnapshotBeforeUpdate(prevProps, prevState);
    }
    function commitClassSnapshot(finishedWork, current2) {
      var { memoizedProps: prevProps, memoizedState: prevState } = current2;
      current2 = finishedWork.stateNode, finishedWork.type.defaultProps || "ref" in finishedWork.memoizedProps || didWarnAboutReassigningProps || (current2.props !== finishedWork.memoizedProps && console.error("Expected %s props to match memoized props before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", getComponentNameFromFiber(finishedWork) || "instance"), current2.state !== finishedWork.memoizedState && console.error("Expected %s state to match memoized state before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", getComponentNameFromFiber(finishedWork) || "instance"));
      try {
        var resolvedPrevProps = resolveClassComponentProps(finishedWork.type, prevProps), snapshot = runWithFiberInDEV(finishedWork, callGetSnapshotBeforeUpdates, current2, resolvedPrevProps, prevState);
        prevProps = didWarnAboutUndefinedSnapshotBeforeUpdate, snapshot !== void 0 || prevProps.has(finishedWork.type) || (prevProps.add(finishedWork.type), runWithFiberInDEV(finishedWork, function() {
          console.error("%s.getSnapshotBeforeUpdate(): A snapshot value (or null) must be returned. You have returned undefined.", getComponentNameFromFiber(finishedWork));
        })), current2.__reactInternalSnapshotBeforeUpdate = snapshot;
      } catch (error44) {
        captureCommitPhaseError(finishedWork, finishedWork.return, error44);
      }
    }
    function safelyCallComponentWillUnmount(current2, nearestMountedAncestor, instance) {
      instance.props = resolveClassComponentProps(current2.type, current2.memoizedProps), instance.state = current2.memoizedState, shouldProfile(current2) ? (startEffectTimer(), runWithFiberInDEV(current2, callComponentWillUnmountInDEV, current2, nearestMountedAncestor, instance), recordEffectDuration()) : runWithFiberInDEV(current2, callComponentWillUnmountInDEV, current2, nearestMountedAncestor, instance);
    }
    function commitAttachRef(finishedWork) {
      var ref = finishedWork.ref;
      if (ref !== null) {
        switch (finishedWork.tag) {
          case 26:
          case 27:
          case 5:
            var instanceToUse = getPublicInstance(finishedWork.stateNode);
            break;
          case 30:
            instanceToUse = finishedWork.stateNode;
            break;
          default:
            instanceToUse = finishedWork.stateNode;
        }
        if (typeof ref === "function")
          if (shouldProfile(finishedWork))
            try {
              startEffectTimer(), finishedWork.refCleanup = ref(instanceToUse);
            } finally {
              recordEffectDuration();
            }
          else
            finishedWork.refCleanup = ref(instanceToUse);
        else
          typeof ref === "string" ? console.error("String refs are no longer supported.") : ref.hasOwnProperty("current") || console.error("Unexpected ref object provided for %s. Use either a ref-setter function or React.createRef().", getComponentNameFromFiber(finishedWork)), ref.current = instanceToUse;
      }
    }
    function safelyAttachRef(current2, nearestMountedAncestor) {
      try {
        runWithFiberInDEV(current2, commitAttachRef, current2);
      } catch (error44) {
        captureCommitPhaseError(current2, nearestMountedAncestor, error44);
      }
    }
    function safelyDetachRef(current2, nearestMountedAncestor) {
      var { ref, refCleanup } = current2;
      if (ref !== null)
        if (typeof refCleanup === "function")
          try {
            if (shouldProfile(current2))
              try {
                startEffectTimer(), runWithFiberInDEV(current2, refCleanup);
              } finally {
                recordEffectDuration(current2);
              }
            else
              runWithFiberInDEV(current2, refCleanup);
          } catch (error44) {
            captureCommitPhaseError(current2, nearestMountedAncestor, error44);
          } finally {
            current2.refCleanup = null, current2 = current2.alternate, current2 != null && (current2.refCleanup = null);
          }
        else if (typeof ref === "function")
          try {
            if (shouldProfile(current2))
              try {
                startEffectTimer(), runWithFiberInDEV(current2, ref, null);
              } finally {
                recordEffectDuration(current2);
              }
            else
              runWithFiberInDEV(current2, ref, null);
          } catch (error$3) {
            captureCommitPhaseError(current2, nearestMountedAncestor, error$3);
          }
        else
          ref.current = null;
    }
    function commitProfiler(finishedWork, current2, commitStartTime2, effectDuration) {
      var _finishedWork$memoize = finishedWork.memoizedProps, id = _finishedWork$memoize.id, onCommit = _finishedWork$memoize.onCommit;
      _finishedWork$memoize = _finishedWork$memoize.onRender, current2 = current2 === null ? "mount" : "update", currentUpdateIsNested && (current2 = "nested-update"), typeof _finishedWork$memoize === "function" && _finishedWork$memoize(id, current2, finishedWork.actualDuration, finishedWork.treeBaseDuration, finishedWork.actualStartTime, commitStartTime2), typeof onCommit === "function" && onCommit(id, current2, effectDuration, commitStartTime2);
    }
    function commitProfilerPostCommitImpl(finishedWork, current2, commitStartTime2, passiveEffectDuration) {
      var _finishedWork$memoize2 = finishedWork.memoizedProps;
      finishedWork = _finishedWork$memoize2.id, _finishedWork$memoize2 = _finishedWork$memoize2.onPostCommit, current2 = current2 === null ? "mount" : "update", currentUpdateIsNested && (current2 = "nested-update"), typeof _finishedWork$memoize2 === "function" && _finishedWork$memoize2(finishedWork, current2, passiveEffectDuration, commitStartTime2);
    }
    function commitHostMount(finishedWork) {
      var { type, memoizedProps: props, stateNode: instance } = finishedWork;
      try {
        runWithFiberInDEV(finishedWork, commitMount, instance, type, props, finishedWork);
      } catch (error44) {
        captureCommitPhaseError(finishedWork, finishedWork.return, error44);
      }
    }
    function commitHostUpdate(finishedWork, newProps, oldProps) {
      try {
        runWithFiberInDEV(finishedWork, commitUpdate, finishedWork.stateNode, finishedWork.type, oldProps, newProps, finishedWork);
      } catch (error44) {
        captureCommitPhaseError(finishedWork, finishedWork.return, error44);
      }
    }
    function isHostParent(fiber) {
      return fiber.tag === 5 || fiber.tag === 3 || (supportsResources ? fiber.tag === 26 : !1) || (supportsSingletons ? fiber.tag === 27 && isSingletonScope(fiber.type) : !1) || fiber.tag === 4;
    }
    function getHostSibling(fiber) {
      a:
        for (;; ) {
          for (;fiber.sibling === null; ) {
            if (fiber.return === null || isHostParent(fiber.return))
              return null;
            fiber = fiber.return;
          }
          fiber.sibling.return = fiber.return;
          for (fiber = fiber.sibling;fiber.tag !== 5 && fiber.tag !== 6 && fiber.tag !== 18; ) {
            if (supportsSingletons && fiber.tag === 27 && isSingletonScope(fiber.type))
              continue a;
            if (fiber.flags & 2)
              continue a;
            if (fiber.child === null || fiber.tag === 4)
              continue a;
            else
              fiber.child.return = fiber, fiber = fiber.child;
          }
          if (!(fiber.flags & 2))
            return fiber.stateNode;
        }
    }
    function insertOrAppendPlacementNodeIntoContainer(node, before, parent) {
      var tag = node.tag;
      if (tag === 5 || tag === 6)
        node = node.stateNode, before ? insertInContainerBefore(parent, node, before) : appendChildToContainer(parent, node);
      else if (tag !== 4 && (supportsSingletons && tag === 27 && isSingletonScope(node.type) && (parent = node.stateNode, before = null), node = node.child, node !== null))
        for (insertOrAppendPlacementNodeIntoContainer(node, before, parent), node = node.sibling;node !== null; )
          insertOrAppendPlacementNodeIntoContainer(node, before, parent), node = node.sibling;
    }
    function insertOrAppendPlacementNode(node, before, parent) {
      var tag = node.tag;
      if (tag === 5 || tag === 6)
        node = node.stateNode, before ? insertBefore(parent, node, before) : appendChild(parent, node);
      else if (tag !== 4 && (supportsSingletons && tag === 27 && isSingletonScope(node.type) && (parent = node.stateNode), node = node.child, node !== null))
        for (insertOrAppendPlacementNode(node, before, parent), node = node.sibling;node !== null; )
          insertOrAppendPlacementNode(node, before, parent), node = node.sibling;
    }
    function commitPlacement(finishedWork) {
      for (var hostParentFiber, parentFiber = finishedWork.return;parentFiber !== null; ) {
        if (isHostParent(parentFiber)) {
          hostParentFiber = parentFiber;
          break;
        }
        parentFiber = parentFiber.return;
      }
      if (supportsMutation) {
        if (hostParentFiber == null)
          throw Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
        switch (hostParentFiber.tag) {
          case 27:
            if (supportsSingletons) {
              hostParentFiber = hostParentFiber.stateNode, parentFiber = getHostSibling(finishedWork), insertOrAppendPlacementNode(finishedWork, parentFiber, hostParentFiber);
              break;
            }
          case 5:
            parentFiber = hostParentFiber.stateNode, hostParentFiber.flags & 32 && (resetTextContent(parentFiber), hostParentFiber.flags &= -33), hostParentFiber = getHostSibling(finishedWork), insertOrAppendPlacementNode(finishedWork, hostParentFiber, parentFiber);
            break;
          case 3:
          case 4:
            hostParentFiber = hostParentFiber.stateNode.containerInfo, parentFiber = getHostSibling(finishedWork), insertOrAppendPlacementNodeIntoContainer(finishedWork, parentFiber, hostParentFiber);
            break;
          default:
            throw Error("Invalid host parent fiber. This error is likely caused by a bug in React. Please file an issue.");
        }
      }
    }
    function commitHostPortalContainerChildren(portal, finishedWork, pendingChildren) {
      portal = portal.containerInfo;
      try {
        runWithFiberInDEV(finishedWork, replaceContainerChildren, portal, pendingChildren);
      } catch (error44) {
        captureCommitPhaseError(finishedWork, finishedWork.return, error44);
      }
    }
    function commitHostSingletonAcquisition(finishedWork) {
      var { stateNode: singleton, memoizedProps: props } = finishedWork;
      try {
        runWithFiberInDEV(finishedWork, acquireSingletonInstance, finishedWork.type, props, singleton, finishedWork);
      } catch (error44) {
        captureCommitPhaseError(finishedWork, finishedWork.return, error44);
      }
    }
    function isHydratingParent(current2, finishedWork) {
      return finishedWork.tag === 31 ? (finishedWork = finishedWork.memoizedState, current2.memoizedState !== null && finishedWork === null) : finishedWork.tag === 13 ? (current2 = current2.memoizedState, finishedWork = finishedWork.memoizedState, current2 !== null && current2.dehydrated !== null && (finishedWork === null || finishedWork.dehydrated === null)) : finishedWork.tag === 3 ? current2.memoizedState.isDehydrated && (finishedWork.flags & 256) === 0 : !1;
    }
    function commitBeforeMutationEffects(root2, firstChild) {
      prepareForCommit(root2.containerInfo);
      for (nextEffect = firstChild;nextEffect !== null; )
        if (root2 = nextEffect, firstChild = root2.child, (root2.subtreeFlags & 1028) !== 0 && firstChild !== null)
          firstChild.return = root2, nextEffect = firstChild;
        else
          for (;nextEffect !== null; ) {
            firstChild = root2 = nextEffect;
            var { alternate: current2, flags } = firstChild;
            switch (firstChild.tag) {
              case 0:
                if ((flags & 4) !== 0 && (firstChild = firstChild.updateQueue, firstChild = firstChild !== null ? firstChild.events : null, firstChild !== null))
                  for (current2 = 0;current2 < firstChild.length; current2++)
                    flags = firstChild[current2], flags.ref.impl = flags.nextImpl;
                break;
              case 11:
              case 15:
                break;
              case 1:
                (flags & 1024) !== 0 && current2 !== null && commitClassSnapshot(firstChild, current2);
                break;
              case 3:
                (flags & 1024) !== 0 && supportsMutation && clearContainer(firstChild.stateNode.containerInfo);
                break;
              case 5:
              case 26:
              case 27:
              case 6:
              case 4:
              case 17:
                break;
              default:
                if ((flags & 1024) !== 0)
                  throw Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
            }
            if (firstChild = root2.sibling, firstChild !== null) {
              firstChild.return = root2.return, nextEffect = firstChild;
              break;
            }
            nextEffect = root2.return;
          }
    }
    function commitLayoutEffectOnFiber(finishedRoot, current2, finishedWork) {
      var prevEffectStart = pushComponentEffectStart(), prevEffectDuration = pushComponentEffectDuration(), prevEffectErrors = pushComponentEffectErrors(), prevEffectDidSpawnUpdate = pushComponentEffectDidSpawnUpdate(), flags = finishedWork.flags;
      switch (finishedWork.tag) {
        case 0:
        case 11:
        case 15:
          recursivelyTraverseLayoutEffects(finishedRoot, finishedWork), flags & 4 && commitHookLayoutEffects(finishedWork, Layout | HasEffect);
          break;
        case 1:
          if (recursivelyTraverseLayoutEffects(finishedRoot, finishedWork), flags & 4)
            if (finishedRoot = finishedWork.stateNode, current2 === null)
              finishedWork.type.defaultProps || "ref" in finishedWork.memoizedProps || didWarnAboutReassigningProps || (finishedRoot.props !== finishedWork.memoizedProps && console.error("Expected %s props to match memoized props before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", getComponentNameFromFiber(finishedWork) || "instance"), finishedRoot.state !== finishedWork.memoizedState && console.error("Expected %s state to match memoized state before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", getComponentNameFromFiber(finishedWork) || "instance")), shouldProfile(finishedWork) ? (startEffectTimer(), runWithFiberInDEV(finishedWork, callComponentDidMountInDEV, finishedWork, finishedRoot), recordEffectDuration()) : runWithFiberInDEV(finishedWork, callComponentDidMountInDEV, finishedWork, finishedRoot);
            else {
              var prevProps = resolveClassComponentProps(finishedWork.type, current2.memoizedProps);
              current2 = current2.memoizedState, finishedWork.type.defaultProps || "ref" in finishedWork.memoizedProps || didWarnAboutReassigningProps || (finishedRoot.props !== finishedWork.memoizedProps && console.error("Expected %s props to match memoized props before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", getComponentNameFromFiber(finishedWork) || "instance"), finishedRoot.state !== finishedWork.memoizedState && console.error("Expected %s state to match memoized state before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", getComponentNameFromFiber(finishedWork) || "instance")), shouldProfile(finishedWork) ? (startEffectTimer(), runWithFiberInDEV(finishedWork, callComponentDidUpdateInDEV, finishedWork, finishedRoot, prevProps, current2, finishedRoot.__reactInternalSnapshotBeforeUpdate), recordEffectDuration()) : runWithFiberInDEV(finishedWork, callComponentDidUpdateInDEV, finishedWork, finishedRoot, prevProps, current2, finishedRoot.__reactInternalSnapshotBeforeUpdate);
            }
          flags & 64 && commitClassCallbacks(finishedWork), flags & 512 && safelyAttachRef(finishedWork, finishedWork.return);
          break;
        case 3:
          if (current2 = pushNestedEffectDurations(), recursivelyTraverseLayoutEffects(finishedRoot, finishedWork), flags & 64 && (flags = finishedWork.updateQueue, flags !== null)) {
            if (prevProps = null, finishedWork.child !== null)
              switch (finishedWork.child.tag) {
                case 27:
                case 5:
                  prevProps = getPublicInstance(finishedWork.child.stateNode);
                  break;
                case 1:
                  prevProps = finishedWork.child.stateNode;
              }
            try {
              runWithFiberInDEV(finishedWork, commitCallbacks, flags, prevProps);
            } catch (error44) {
              captureCommitPhaseError(finishedWork, finishedWork.return, error44);
            }
          }
          finishedRoot.effectDuration += popNestedEffectDurations(current2);
          break;
        case 27:
          supportsSingletons && current2 === null && flags & 4 && commitHostSingletonAcquisition(finishedWork);
        case 26:
        case 5:
          if (recursivelyTraverseLayoutEffects(finishedRoot, finishedWork), current2 === null) {
            if (flags & 4)
              commitHostMount(finishedWork);
            else if (flags & 64) {
              finishedRoot = finishedWork.type, current2 = finishedWork.memoizedProps, prevProps = finishedWork.stateNode;
              try {
                runWithFiberInDEV(finishedWork, commitHydratedInstance, prevProps, finishedRoot, current2, finishedWork);
              } catch (error44) {
                captureCommitPhaseError(finishedWork, finishedWork.return, error44);
              }
            }
          }
          flags & 512 && safelyAttachRef(finishedWork, finishedWork.return);
          break;
        case 12:
          if (flags & 4) {
            flags = pushNestedEffectDurations(), recursivelyTraverseLayoutEffects(finishedRoot, finishedWork), finishedRoot = finishedWork.stateNode, finishedRoot.effectDuration += bubbleNestedEffectDurations(flags);
            try {
              runWithFiberInDEV(finishedWork, commitProfiler, finishedWork, current2, commitStartTime, finishedRoot.effectDuration);
            } catch (error44) {
              captureCommitPhaseError(finishedWork, finishedWork.return, error44);
            }
          } else
            recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
          break;
        case 31:
          recursivelyTraverseLayoutEffects(finishedRoot, finishedWork), flags & 4 && commitActivityHydrationCallbacks(finishedRoot, finishedWork);
          break;
        case 13:
          recursivelyTraverseLayoutEffects(finishedRoot, finishedWork), flags & 4 && commitSuspenseHydrationCallbacks(finishedRoot, finishedWork), flags & 64 && (finishedRoot = finishedWork.memoizedState, finishedRoot !== null && (finishedRoot = finishedRoot.dehydrated, finishedRoot !== null && (flags = retryDehydratedSuspenseBoundary.bind(null, finishedWork), registerSuspenseInstanceRetry(finishedRoot, flags))));
          break;
        case 22:
          if (flags = finishedWork.memoizedState !== null || offscreenSubtreeIsHidden, !flags) {
            current2 = current2 !== null && current2.memoizedState !== null || offscreenSubtreeWasHidden, prevProps = offscreenSubtreeIsHidden;
            var prevOffscreenSubtreeWasHidden = offscreenSubtreeWasHidden;
            offscreenSubtreeIsHidden = flags, (offscreenSubtreeWasHidden = current2) && !prevOffscreenSubtreeWasHidden ? (recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, (finishedWork.subtreeFlags & 8772) !== 0), (finishedWork.mode & 2) !== NoMode && 0 <= componentEffectStartTime && 0 <= componentEffectEndTime && 0.05 < componentEffectEndTime - componentEffectStartTime && logComponentReappeared(finishedWork, componentEffectStartTime, componentEffectEndTime)) : recursivelyTraverseLayoutEffects(finishedRoot, finishedWork), offscreenSubtreeIsHidden = prevProps, offscreenSubtreeWasHidden = prevOffscreenSubtreeWasHidden;
          }
          break;
        case 30:
          break;
        default:
          recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
      }
      (finishedWork.mode & 2) !== NoMode && 0 <= componentEffectStartTime && 0 <= componentEffectEndTime && ((componentEffectSpawnedUpdate || 0.05 < componentEffectDuration) && logComponentEffect(finishedWork, componentEffectStartTime, componentEffectEndTime, componentEffectDuration, componentEffectErrors), finishedWork.alternate === null && finishedWork.return !== null && finishedWork.return.alternate !== null && 0.05 < componentEffectEndTime - componentEffectStartTime && (isHydratingParent(finishedWork.return.alternate, finishedWork.return) || logComponentTrigger(finishedWork, componentEffectStartTime, componentEffectEndTime, "Mount"))), popComponentEffectStart(prevEffectStart), popComponentEffectDuration(prevEffectDuration), componentEffectErrors = prevEffectErrors, componentEffectSpawnedUpdate = prevEffectDidSpawnUpdate;
    }
    function detachFiberAfterEffects(fiber) {
      var alternate = fiber.alternate;
      alternate !== null && (fiber.alternate = null, detachFiberAfterEffects(alternate)), fiber.child = null, fiber.deletions = null, fiber.sibling = null, fiber.tag === 5 && (alternate = fiber.stateNode, alternate !== null && detachDeletedInstance(alternate)), fiber.stateNode = null, fiber._debugOwner = null, fiber.return = null, fiber.dependencies = null, fiber.memoizedProps = null, fiber.memoizedState = null, fiber.pendingProps = null, fiber.stateNode = null, fiber.updateQueue = null;
    }
    function recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, parent) {
      for (parent = parent.child;parent !== null; )
        commitDeletionEffectsOnFiber(finishedRoot, nearestMountedAncestor, parent), parent = parent.sibling;
    }
    function commitDeletionEffectsOnFiber(finishedRoot, nearestMountedAncestor, deletedFiber) {
      if (injectedHook && typeof injectedHook.onCommitFiberUnmount === "function")
        try {
          injectedHook.onCommitFiberUnmount(rendererID, deletedFiber);
        } catch (err) {
          hasLoggedError || (hasLoggedError = !0, console.error("React instrumentation encountered an error: %o", err));
        }
      var prevEffectStart = pushComponentEffectStart(), prevEffectDuration = pushComponentEffectDuration(), prevEffectErrors = pushComponentEffectErrors(), prevEffectDidSpawnUpdate = pushComponentEffectDidSpawnUpdate();
      switch (deletedFiber.tag) {
        case 26:
          if (supportsResources) {
            offscreenSubtreeWasHidden || safelyDetachRef(deletedFiber, nearestMountedAncestor), recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber), deletedFiber.memoizedState ? releaseResource(deletedFiber.memoizedState) : deletedFiber.stateNode && unmountHoistable(deletedFiber.stateNode);
            break;
          }
        case 27:
          if (supportsSingletons) {
            offscreenSubtreeWasHidden || safelyDetachRef(deletedFiber, nearestMountedAncestor);
            var prevHostParent = hostParent, prevHostParentIsContainer = hostParentIsContainer;
            isSingletonScope(deletedFiber.type) && (hostParent = deletedFiber.stateNode, hostParentIsContainer = !1), recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber), runWithFiberInDEV(deletedFiber, releaseSingletonInstance, deletedFiber.stateNode), hostParent = prevHostParent, hostParentIsContainer = prevHostParentIsContainer;
            break;
          }
        case 5:
          offscreenSubtreeWasHidden || safelyDetachRef(deletedFiber, nearestMountedAncestor);
        case 6:
          if (supportsMutation) {
            if (prevHostParent = hostParent, prevHostParentIsContainer = hostParentIsContainer, hostParent = null, recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber), hostParent = prevHostParent, hostParentIsContainer = prevHostParentIsContainer, hostParent !== null)
              if (hostParentIsContainer)
                try {
                  runWithFiberInDEV(deletedFiber, removeChildFromContainer, hostParent, deletedFiber.stateNode);
                } catch (error44) {
                  captureCommitPhaseError(deletedFiber, nearestMountedAncestor, error44);
                }
              else
                try {
                  runWithFiberInDEV(deletedFiber, removeChild, hostParent, deletedFiber.stateNode);
                } catch (error44) {
                  captureCommitPhaseError(deletedFiber, nearestMountedAncestor, error44);
                }
          } else
            recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
          break;
        case 18:
          supportsMutation && hostParent !== null && (hostParentIsContainer ? clearSuspenseBoundaryFromContainer(hostParent, deletedFiber.stateNode) : clearSuspenseBoundary(hostParent, deletedFiber.stateNode));
          break;
        case 4:
          supportsMutation ? (prevHostParent = hostParent, prevHostParentIsContainer = hostParentIsContainer, hostParent = deletedFiber.stateNode.containerInfo, hostParentIsContainer = !0, recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber), hostParent = prevHostParent, hostParentIsContainer = prevHostParentIsContainer) : (supportsPersistence && commitHostPortalContainerChildren(deletedFiber.stateNode, deletedFiber, createContainerChildSet()), recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber));
          break;
        case 0:
        case 11:
        case 14:
        case 15:
          commitHookEffectListUnmount(Insertion, deletedFiber, nearestMountedAncestor), offscreenSubtreeWasHidden || commitHookLayoutUnmountEffects(deletedFiber, nearestMountedAncestor, Layout), recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
          break;
        case 1:
          offscreenSubtreeWasHidden || (safelyDetachRef(deletedFiber, nearestMountedAncestor), prevHostParent = deletedFiber.stateNode, typeof prevHostParent.componentWillUnmount === "function" && safelyCallComponentWillUnmount(deletedFiber, nearestMountedAncestor, prevHostParent)), recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
          break;
        case 21:
          recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
          break;
        case 22:
          offscreenSubtreeWasHidden = (prevHostParent = offscreenSubtreeWasHidden) || deletedFiber.memoizedState !== null, recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber), offscreenSubtreeWasHidden = prevHostParent;
          break;
        default:
          recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
      }
      (deletedFiber.mode & 2) !== NoMode && 0 <= componentEffectStartTime && 0 <= componentEffectEndTime && (componentEffectSpawnedUpdate || 0.05 < componentEffectDuration) && logComponentEffect(deletedFiber, componentEffectStartTime, componentEffectEndTime, componentEffectDuration, componentEffectErrors), popComponentEffectStart(prevEffectStart), popComponentEffectDuration(prevEffectDuration), componentEffectErrors = prevEffectErrors, componentEffectSpawnedUpdate = prevEffectDidSpawnUpdate;
    }
    function commitActivityHydrationCallbacks(finishedRoot, finishedWork) {
      if (supportsHydration && finishedWork.memoizedState === null && (finishedRoot = finishedWork.alternate, finishedRoot !== null && (finishedRoot = finishedRoot.memoizedState, finishedRoot !== null))) {
        finishedRoot = finishedRoot.dehydrated;
        try {
          runWithFiberInDEV(finishedWork, commitHydratedActivityInstance, finishedRoot);
        } catch (error44) {
          captureCommitPhaseError(finishedWork, finishedWork.return, error44);
        }
      }
    }
    function commitSuspenseHydrationCallbacks(finishedRoot, finishedWork) {
      if (supportsHydration && finishedWork.memoizedState === null && (finishedRoot = finishedWork.alternate, finishedRoot !== null && (finishedRoot = finishedRoot.memoizedState, finishedRoot !== null && (finishedRoot = finishedRoot.dehydrated, finishedRoot !== null))))
        try {
          runWithFiberInDEV(finishedWork, commitHydratedSuspenseInstance, finishedRoot);
        } catch (error44) {
          captureCommitPhaseError(finishedWork, finishedWork.return, error44);
        }
    }
    function getRetryCache(finishedWork) {
      switch (finishedWork.tag) {
        case 31:
        case 13:
        case 19:
          var retryCache = finishedWork.stateNode;
          return retryCache === null && (retryCache = finishedWork.stateNode = new PossiblyWeakSet), retryCache;
        case 22:
          return finishedWork = finishedWork.stateNode, retryCache = finishedWork._retryCache, retryCache === null && (retryCache = finishedWork._retryCache = new PossiblyWeakSet), retryCache;
        default:
          throw Error("Unexpected Suspense handler tag (" + finishedWork.tag + "). This is a bug in React.");
      }
    }
    function attachSuspenseRetryListeners(finishedWork, wakeables) {
      var retryCache = getRetryCache(finishedWork);
      wakeables.forEach(function(wakeable) {
        if (!retryCache.has(wakeable)) {
          if (retryCache.add(wakeable), isDevToolsPresent)
            if (inProgressLanes !== null && inProgressRoot !== null)
              restorePendingUpdaters(inProgressRoot, inProgressLanes);
            else
              throw Error("Expected finished root and lanes to be set. This is a bug in React.");
          var retry8 = resolveRetryWakeable.bind(null, finishedWork, wakeable);
          wakeable.then(retry8, retry8);
        }
      });
    }
    function recursivelyTraverseMutationEffects(root$jscomp$0, parentFiber) {
      var deletions = parentFiber.deletions;
      if (deletions !== null)
        for (var i4 = 0;i4 < deletions.length; i4++) {
          var root2 = root$jscomp$0, returnFiber = parentFiber, deletedFiber = deletions[i4], prevEffectStart = pushComponentEffectStart();
          if (supportsMutation) {
            var parent = returnFiber;
            a:
              for (;parent !== null; ) {
                switch (parent.tag) {
                  case 27:
                    if (supportsSingletons) {
                      if (isSingletonScope(parent.type)) {
                        hostParent = parent.stateNode, hostParentIsContainer = !1;
                        break a;
                      }
                      break;
                    }
                  case 5:
                    hostParent = parent.stateNode, hostParentIsContainer = !1;
                    break a;
                  case 3:
                  case 4:
                    hostParent = parent.stateNode.containerInfo, hostParentIsContainer = !0;
                    break a;
                }
                parent = parent.return;
              }
            if (hostParent === null)
              throw Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
            commitDeletionEffectsOnFiber(root2, returnFiber, deletedFiber), hostParent = null, hostParentIsContainer = !1;
          } else
            commitDeletionEffectsOnFiber(root2, returnFiber, deletedFiber);
          (deletedFiber.mode & 2) !== NoMode && 0 <= componentEffectStartTime && 0 <= componentEffectEndTime && 0.05 < componentEffectEndTime - componentEffectStartTime && logComponentTrigger(deletedFiber, componentEffectStartTime, componentEffectEndTime, "Unmount"), popComponentEffectStart(prevEffectStart), root2 = deletedFiber, returnFiber = root2.alternate, returnFiber !== null && (returnFiber.return = null), root2.return = null;
        }
      if (parentFiber.subtreeFlags & 13886)
        for (parentFiber = parentFiber.child;parentFiber !== null; )
          commitMutationEffectsOnFiber(parentFiber, root$jscomp$0), parentFiber = parentFiber.sibling;
    }
    function commitMutationEffectsOnFiber(finishedWork, root2) {
      var prevEffectStart = pushComponentEffectStart(), prevEffectDuration = pushComponentEffectDuration(), prevEffectErrors = pushComponentEffectErrors(), prevEffectDidSpawnUpdate = pushComponentEffectDidSpawnUpdate(), current2 = finishedWork.alternate, flags = finishedWork.flags;
      switch (finishedWork.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          recursivelyTraverseMutationEffects(root2, finishedWork), commitReconciliationEffects(finishedWork), flags & 4 && (commitHookEffectListUnmount(Insertion | HasEffect, finishedWork, finishedWork.return), commitHookEffectListMount(Insertion | HasEffect, finishedWork), commitHookLayoutUnmountEffects(finishedWork, finishedWork.return, Layout | HasEffect));
          break;
        case 1:
          recursivelyTraverseMutationEffects(root2, finishedWork), commitReconciliationEffects(finishedWork), flags & 512 && (offscreenSubtreeWasHidden || current2 === null || safelyDetachRef(current2, current2.return)), flags & 64 && offscreenSubtreeIsHidden && (flags = finishedWork.updateQueue, flags !== null && (current2 = flags.callbacks, current2 !== null && (root2 = flags.shared.hiddenCallbacks, flags.shared.hiddenCallbacks = root2 === null ? current2 : root2.concat(current2))));
          break;
        case 26:
          if (supportsResources) {
            var hoistableRoot = currentHoistableRoot;
            recursivelyTraverseMutationEffects(root2, finishedWork), commitReconciliationEffects(finishedWork), flags & 512 && (offscreenSubtreeWasHidden || current2 === null || safelyDetachRef(current2, current2.return)), flags & 4 && (flags = current2 !== null ? current2.memoizedState : null, root2 = finishedWork.memoizedState, current2 === null ? root2 === null ? finishedWork.stateNode === null ? finishedWork.stateNode = hydrateHoistable(hoistableRoot, finishedWork.type, finishedWork.memoizedProps, finishedWork) : mountHoistable(hoistableRoot, finishedWork.type, finishedWork.stateNode) : finishedWork.stateNode = acquireResource(hoistableRoot, root2, finishedWork.memoizedProps) : flags !== root2 ? (flags === null ? current2.stateNode !== null && unmountHoistable(current2.stateNode) : releaseResource(flags), root2 === null ? mountHoistable(hoistableRoot, finishedWork.type, finishedWork.stateNode) : acquireResource(hoistableRoot, root2, finishedWork.memoizedProps)) : root2 === null && finishedWork.stateNode !== null && commitHostUpdate(finishedWork, finishedWork.memoizedProps, current2.memoizedProps));
            break;
          }
        case 27:
          if (supportsSingletons) {
            recursivelyTraverseMutationEffects(root2, finishedWork), commitReconciliationEffects(finishedWork), flags & 512 && (offscreenSubtreeWasHidden || current2 === null || safelyDetachRef(current2, current2.return)), current2 !== null && flags & 4 && commitHostUpdate(finishedWork, finishedWork.memoizedProps, current2.memoizedProps);
            break;
          }
        case 5:
          if (recursivelyTraverseMutationEffects(root2, finishedWork), commitReconciliationEffects(finishedWork), flags & 512 && (offscreenSubtreeWasHidden || current2 === null || safelyDetachRef(current2, current2.return)), supportsMutation) {
            if (finishedWork.flags & 32) {
              root2 = finishedWork.stateNode;
              try {
                runWithFiberInDEV(finishedWork, resetTextContent, root2);
              } catch (error44) {
                captureCommitPhaseError(finishedWork, finishedWork.return, error44);
              }
            }
            flags & 4 && finishedWork.stateNode != null && (root2 = finishedWork.memoizedProps, commitHostUpdate(finishedWork, root2, current2 !== null ? current2.memoizedProps : root2)), flags & 1024 && (needsFormReset = !0, finishedWork.type !== "form" && console.error("Unexpected host component type. Expected a form. This is a bug in React."));
          } else
            supportsPersistence && finishedWork.alternate !== null && (finishedWork.alternate.stateNode = finishedWork.stateNode);
          break;
        case 6:
          if (recursivelyTraverseMutationEffects(root2, finishedWork), commitReconciliationEffects(finishedWork), flags & 4 && supportsMutation) {
            if (finishedWork.stateNode === null)
              throw Error("This should have a text node initialized. This error is likely caused by a bug in React. Please file an issue.");
            flags = finishedWork.memoizedProps, current2 = current2 !== null ? current2.memoizedProps : flags, root2 = finishedWork.stateNode;
            try {
              runWithFiberInDEV(finishedWork, commitTextUpdate, root2, current2, flags);
            } catch (error44) {
              captureCommitPhaseError(finishedWork, finishedWork.return, error44);
            }
          }
          break;
        case 3:
          if (hoistableRoot = pushNestedEffectDurations(), supportsResources) {
            prepareToCommitHoistables();
            var previousHoistableRoot = currentHoistableRoot;
            currentHoistableRoot = getHoistableRoot(root2.containerInfo), recursivelyTraverseMutationEffects(root2, finishedWork), currentHoistableRoot = previousHoistableRoot;
          } else
            recursivelyTraverseMutationEffects(root2, finishedWork);
          if (commitReconciliationEffects(finishedWork), flags & 4) {
            if (supportsMutation && supportsHydration && current2 !== null && current2.memoizedState.isDehydrated)
              try {
                runWithFiberInDEV(finishedWork, commitHydratedContainer, root2.containerInfo);
              } catch (error44) {
                captureCommitPhaseError(finishedWork, finishedWork.return, error44);
              }
            if (supportsPersistence) {
              flags = root2.containerInfo, current2 = root2.pendingChildren;
              try {
                runWithFiberInDEV(finishedWork, replaceContainerChildren, flags, current2);
              } catch (error44) {
                captureCommitPhaseError(finishedWork, finishedWork.return, error44);
              }
            }
          }
          needsFormReset && (needsFormReset = !1, recursivelyResetForms(finishedWork)), root2.effectDuration += popNestedEffectDurations(hoistableRoot);
          break;
        case 4:
          supportsResources ? (current2 = currentHoistableRoot, currentHoistableRoot = getHoistableRoot(finishedWork.stateNode.containerInfo), recursivelyTraverseMutationEffects(root2, finishedWork), commitReconciliationEffects(finishedWork), currentHoistableRoot = current2) : (recursivelyTraverseMutationEffects(root2, finishedWork), commitReconciliationEffects(finishedWork)), flags & 4 && supportsPersistence && commitHostPortalContainerChildren(finishedWork.stateNode, finishedWork, finishedWork.stateNode.pendingChildren);
          break;
        case 12:
          flags = pushNestedEffectDurations(), recursivelyTraverseMutationEffects(root2, finishedWork), commitReconciliationEffects(finishedWork), finishedWork.stateNode.effectDuration += bubbleNestedEffectDurations(flags);
          break;
        case 31:
          recursivelyTraverseMutationEffects(root2, finishedWork), commitReconciliationEffects(finishedWork), flags & 4 && (flags = finishedWork.updateQueue, flags !== null && (finishedWork.updateQueue = null, attachSuspenseRetryListeners(finishedWork, flags)));
          break;
        case 13:
          recursivelyTraverseMutationEffects(root2, finishedWork), commitReconciliationEffects(finishedWork), finishedWork.child.flags & 8192 && finishedWork.memoizedState !== null !== (current2 !== null && current2.memoizedState !== null) && (globalMostRecentFallbackTime = now$1()), flags & 4 && (flags = finishedWork.updateQueue, flags !== null && (finishedWork.updateQueue = null, attachSuspenseRetryListeners(finishedWork, flags)));
          break;
        case 22:
          hoistableRoot = finishedWork.memoizedState !== null;
          var wasHidden = current2 !== null && current2.memoizedState !== null, prevOffscreenSubtreeIsHidden = offscreenSubtreeIsHidden, prevOffscreenSubtreeWasHidden = offscreenSubtreeWasHidden;
          if (offscreenSubtreeIsHidden = prevOffscreenSubtreeIsHidden || hoistableRoot, offscreenSubtreeWasHidden = prevOffscreenSubtreeWasHidden || wasHidden, recursivelyTraverseMutationEffects(root2, finishedWork), offscreenSubtreeWasHidden = prevOffscreenSubtreeWasHidden, offscreenSubtreeIsHidden = prevOffscreenSubtreeIsHidden, wasHidden && !hoistableRoot && !prevOffscreenSubtreeIsHidden && !prevOffscreenSubtreeWasHidden && (finishedWork.mode & 2) !== NoMode && 0 <= componentEffectStartTime && 0 <= componentEffectEndTime && 0.05 < componentEffectEndTime - componentEffectStartTime && logComponentReappeared(finishedWork, componentEffectStartTime, componentEffectEndTime), commitReconciliationEffects(finishedWork), flags & 8192 && (root2 = finishedWork.stateNode, root2._visibility = hoistableRoot ? root2._visibility & ~OffscreenVisible : root2._visibility | OffscreenVisible, !hoistableRoot || current2 === null || wasHidden || offscreenSubtreeIsHidden || offscreenSubtreeWasHidden || (recursivelyTraverseDisappearLayoutEffects(finishedWork), (finishedWork.mode & 2) !== NoMode && 0 <= componentEffectStartTime && 0 <= componentEffectEndTime && 0.05 < componentEffectEndTime - componentEffectStartTime && logComponentTrigger(finishedWork, componentEffectStartTime, componentEffectEndTime, "Disconnect")), supportsMutation))
            a:
              if (current2 = null, supportsMutation)
                for (root2 = finishedWork;; ) {
                  if (root2.tag === 5 || supportsResources && root2.tag === 26) {
                    if (current2 === null) {
                      wasHidden = current2 = root2;
                      try {
                        previousHoistableRoot = wasHidden.stateNode, hoistableRoot ? runWithFiberInDEV(wasHidden, hideInstance, previousHoistableRoot) : runWithFiberInDEV(wasHidden, unhideInstance, wasHidden.stateNode, wasHidden.memoizedProps);
                      } catch (error44) {
                        captureCommitPhaseError(wasHidden, wasHidden.return, error44);
                      }
                    }
                  } else if (root2.tag === 6) {
                    if (current2 === null) {
                      wasHidden = root2;
                      try {
                        var instance = wasHidden.stateNode;
                        hoistableRoot ? runWithFiberInDEV(wasHidden, hideTextInstance, instance) : runWithFiberInDEV(wasHidden, unhideTextInstance, instance, wasHidden.memoizedProps);
                      } catch (error44) {
                        captureCommitPhaseError(wasHidden, wasHidden.return, error44);
                      }
                    }
                  } else if (root2.tag === 18) {
                    if (current2 === null) {
                      wasHidden = root2;
                      try {
                        var instance$jscomp$0 = wasHidden.stateNode;
                        hoistableRoot ? runWithFiberInDEV(wasHidden, hideDehydratedBoundary, instance$jscomp$0) : runWithFiberInDEV(wasHidden, unhideDehydratedBoundary, wasHidden.stateNode);
                      } catch (error44) {
                        captureCommitPhaseError(wasHidden, wasHidden.return, error44);
                      }
                    }
                  } else if ((root2.tag !== 22 && root2.tag !== 23 || root2.memoizedState === null || root2 === finishedWork) && root2.child !== null) {
                    root2.child.return = root2, root2 = root2.child;
                    continue;
                  }
                  if (root2 === finishedWork)
                    break a;
                  for (;root2.sibling === null; ) {
                    if (root2.return === null || root2.return === finishedWork)
                      break a;
                    current2 === root2 && (current2 = null), root2 = root2.return;
                  }
                  current2 === root2 && (current2 = null), root2.sibling.return = root2.return, root2 = root2.sibling;
                }
          flags & 4 && (flags = finishedWork.updateQueue, flags !== null && (current2 = flags.retryQueue, current2 !== null && (flags.retryQueue = null, attachSuspenseRetryListeners(finishedWork, current2))));
          break;
        case 19:
          recursivelyTraverseMutationEffects(root2, finishedWork), commitReconciliationEffects(finishedWork), flags & 4 && (flags = finishedWork.updateQueue, flags !== null && (finishedWork.updateQueue = null, attachSuspenseRetryListeners(finishedWork, flags)));
          break;
        case 30:
          break;
        case 21:
          break;
        default:
          recursivelyTraverseMutationEffects(root2, finishedWork), commitReconciliationEffects(finishedWork);
      }
      (finishedWork.mode & 2) !== NoMode && 0 <= componentEffectStartTime && 0 <= componentEffectEndTime && ((componentEffectSpawnedUpdate || 0.05 < componentEffectDuration) && logComponentEffect(finishedWork, componentEffectStartTime, componentEffectEndTime, componentEffectDuration, componentEffectErrors), finishedWork.alternate === null && finishedWork.return !== null && finishedWork.return.alternate !== null && 0.05 < componentEffectEndTime - componentEffectStartTime && (isHydratingParent(finishedWork.return.alternate, finishedWork.return) || logComponentTrigger(finishedWork, componentEffectStartTime, componentEffectEndTime, "Mount"))), popComponentEffectStart(prevEffectStart), popComponentEffectDuration(prevEffectDuration), componentEffectErrors = prevEffectErrors, componentEffectSpawnedUpdate = prevEffectDidSpawnUpdate;
    }
    function commitReconciliationEffects(finishedWork) {
      var flags = finishedWork.flags;
      if (flags & 2) {
        try {
          runWithFiberInDEV(finishedWork, commitPlacement, finishedWork);
        } catch (error44) {
          captureCommitPhaseError(finishedWork, finishedWork.return, error44);
        }
        finishedWork.flags &= -3;
      }
      flags & 4096 && (finishedWork.flags &= -4097);
    }
    function recursivelyResetForms(parentFiber) {
      if (parentFiber.subtreeFlags & 1024)
        for (parentFiber = parentFiber.child;parentFiber !== null; ) {
          var fiber = parentFiber;
          recursivelyResetForms(fiber), fiber.tag === 5 && fiber.flags & 1024 && resetFormInstance(fiber.stateNode), parentFiber = parentFiber.sibling;
        }
    }
    function recursivelyTraverseLayoutEffects(root2, parentFiber) {
      if (parentFiber.subtreeFlags & 8772)
        for (parentFiber = parentFiber.child;parentFiber !== null; )
          commitLayoutEffectOnFiber(root2, parentFiber.alternate, parentFiber), parentFiber = parentFiber.sibling;
    }
    function disappearLayoutEffects(finishedWork) {
      var prevEffectStart = pushComponentEffectStart(), prevEffectDuration = pushComponentEffectDuration(), prevEffectErrors = pushComponentEffectErrors(), prevEffectDidSpawnUpdate = pushComponentEffectDidSpawnUpdate();
      switch (finishedWork.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          commitHookLayoutUnmountEffects(finishedWork, finishedWork.return, Layout), recursivelyTraverseDisappearLayoutEffects(finishedWork);
          break;
        case 1:
          safelyDetachRef(finishedWork, finishedWork.return);
          var instance = finishedWork.stateNode;
          typeof instance.componentWillUnmount === "function" && safelyCallComponentWillUnmount(finishedWork, finishedWork.return, instance), recursivelyTraverseDisappearLayoutEffects(finishedWork);
          break;
        case 27:
          supportsSingletons && runWithFiberInDEV(finishedWork, releaseSingletonInstance, finishedWork.stateNode);
        case 26:
        case 5:
          safelyDetachRef(finishedWork, finishedWork.return), recursivelyTraverseDisappearLayoutEffects(finishedWork);
          break;
        case 22:
          finishedWork.memoizedState === null && recursivelyTraverseDisappearLayoutEffects(finishedWork);
          break;
        case 30:
          recursivelyTraverseDisappearLayoutEffects(finishedWork);
          break;
        default:
          recursivelyTraverseDisappearLayoutEffects(finishedWork);
      }
      (finishedWork.mode & 2) !== NoMode && 0 <= componentEffectStartTime && 0 <= componentEffectEndTime && (componentEffectSpawnedUpdate || 0.05 < componentEffectDuration) && logComponentEffect(finishedWork, componentEffectStartTime, componentEffectEndTime, componentEffectDuration, componentEffectErrors), popComponentEffectStart(prevEffectStart), popComponentEffectDuration(prevEffectDuration), componentEffectErrors = prevEffectErrors, componentEffectSpawnedUpdate = prevEffectDidSpawnUpdate;
    }
    function recursivelyTraverseDisappearLayoutEffects(parentFiber) {
      for (parentFiber = parentFiber.child;parentFiber !== null; )
        disappearLayoutEffects(parentFiber), parentFiber = parentFiber.sibling;
    }
    function reappearLayoutEffects(finishedRoot, current2, finishedWork, includeWorkInProgressEffects) {
      var prevEffectStart = pushComponentEffectStart(), prevEffectDuration = pushComponentEffectDuration(), prevEffectErrors = pushComponentEffectErrors(), prevEffectDidSpawnUpdate = pushComponentEffectDidSpawnUpdate(), flags = finishedWork.flags;
      switch (finishedWork.tag) {
        case 0:
        case 11:
        case 15:
          recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, includeWorkInProgressEffects), commitHookLayoutEffects(finishedWork, Layout);
          break;
        case 1:
          if (recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, includeWorkInProgressEffects), current2 = finishedWork.stateNode, typeof current2.componentDidMount === "function" && runWithFiberInDEV(finishedWork, callComponentDidMountInDEV, finishedWork, current2), current2 = finishedWork.updateQueue, current2 !== null) {
            finishedRoot = finishedWork.stateNode;
            try {
              runWithFiberInDEV(finishedWork, commitHiddenCallbacks, current2, finishedRoot);
            } catch (error44) {
              captureCommitPhaseError(finishedWork, finishedWork.return, error44);
            }
          }
          includeWorkInProgressEffects && flags & 64 && commitClassCallbacks(finishedWork), safelyAttachRef(finishedWork, finishedWork.return);
          break;
        case 27:
          supportsSingletons && commitHostSingletonAcquisition(finishedWork);
        case 26:
        case 5:
          recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, includeWorkInProgressEffects), includeWorkInProgressEffects && current2 === null && flags & 4 && commitHostMount(finishedWork), safelyAttachRef(finishedWork, finishedWork.return);
          break;
        case 12:
          if (includeWorkInProgressEffects && flags & 4) {
            flags = pushNestedEffectDurations(), recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, includeWorkInProgressEffects), includeWorkInProgressEffects = finishedWork.stateNode, includeWorkInProgressEffects.effectDuration += bubbleNestedEffectDurations(flags);
            try {
              runWithFiberInDEV(finishedWork, commitProfiler, finishedWork, current2, commitStartTime, includeWorkInProgressEffects.effectDuration);
            } catch (error44) {
              captureCommitPhaseError(finishedWork, finishedWork.return, error44);
            }
          } else
            recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, includeWorkInProgressEffects);
          break;
        case 31:
          recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, includeWorkInProgressEffects), includeWorkInProgressEffects && flags & 4 && commitActivityHydrationCallbacks(finishedRoot, finishedWork);
          break;
        case 13:
          recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, includeWorkInProgressEffects), includeWorkInProgressEffects && flags & 4 && commitSuspenseHydrationCallbacks(finishedRoot, finishedWork);
          break;
        case 22:
          finishedWork.memoizedState === null && recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, includeWorkInProgressEffects), safelyAttachRef(finishedWork, finishedWork.return);
          break;
        case 30:
          break;
        default:
          recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, includeWorkInProgressEffects);
      }
      (finishedWork.mode & 2) !== NoMode && 0 <= componentEffectStartTime && 0 <= componentEffectEndTime && (componentEffectSpawnedUpdate || 0.05 < componentEffectDuration) && logComponentEffect(finishedWork, componentEffectStartTime, componentEffectEndTime, componentEffectDuration, componentEffectErrors), popComponentEffectStart(prevEffectStart), popComponentEffectDuration(prevEffectDuration), componentEffectErrors = prevEffectErrors, componentEffectSpawnedUpdate = prevEffectDidSpawnUpdate;
    }
    function recursivelyTraverseReappearLayoutEffects(finishedRoot, parentFiber, includeWorkInProgressEffects) {
      includeWorkInProgressEffects = includeWorkInProgressEffects && (parentFiber.subtreeFlags & 8772) !== 0;
      for (parentFiber = parentFiber.child;parentFiber !== null; )
        reappearLayoutEffects(finishedRoot, parentFiber.alternate, parentFiber, includeWorkInProgressEffects), parentFiber = parentFiber.sibling;
    }
    function commitOffscreenPassiveMountEffects(current2, finishedWork) {
      var previousCache = null;
      current2 !== null && current2.memoizedState !== null && current2.memoizedState.cachePool !== null && (previousCache = current2.memoizedState.cachePool.pool), current2 = null, finishedWork.memoizedState !== null && finishedWork.memoizedState.cachePool !== null && (current2 = finishedWork.memoizedState.cachePool.pool), current2 !== previousCache && (current2 != null && retainCache(current2), previousCache != null && releaseCache(previousCache));
    }
    function commitCachePassiveMountEffect(current2, finishedWork) {
      current2 = null, finishedWork.alternate !== null && (current2 = finishedWork.alternate.memoizedState.cache), finishedWork = finishedWork.memoizedState.cache, finishedWork !== current2 && (retainCache(finishedWork), current2 != null && releaseCache(current2));
    }
    function recursivelyTraversePassiveMountEffects(root2, parentFiber, committedLanes, committedTransitions, endTime) {
      if (parentFiber.subtreeFlags & 10256 || parentFiber.actualDuration !== 0 && (parentFiber.alternate === null || parentFiber.alternate.child !== parentFiber.child))
        for (parentFiber = parentFiber.child;parentFiber !== null; ) {
          var nextSibling = parentFiber.sibling;
          commitPassiveMountOnFiber(root2, parentFiber, committedLanes, committedTransitions, nextSibling !== null ? nextSibling.actualStartTime : endTime), parentFiber = nextSibling;
        }
    }
    function commitPassiveMountOnFiber(finishedRoot, finishedWork, committedLanes, committedTransitions, endTime) {
      var prevEffectStart = pushComponentEffectStart(), prevEffectDuration = pushComponentEffectDuration(), prevEffectErrors = pushComponentEffectErrors(), prevEffectDidSpawnUpdate = pushComponentEffectDidSpawnUpdate(), prevDeepEquality = alreadyWarnedForDeepEquality, flags = finishedWork.flags;
      switch (finishedWork.tag) {
        case 0:
        case 11:
        case 15:
          (finishedWork.mode & 2) !== NoMode && 0 < finishedWork.actualStartTime && (finishedWork.flags & 1) !== 0 && logComponentRender(finishedWork, finishedWork.actualStartTime, endTime, inHydratedSubtree, committedLanes), recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, endTime), flags & 2048 && commitHookPassiveMountEffects(finishedWork, Passive | HasEffect);
          break;
        case 1:
          (finishedWork.mode & 2) !== NoMode && 0 < finishedWork.actualStartTime && ((finishedWork.flags & 128) !== 0 ? logComponentErrored(finishedWork, finishedWork.actualStartTime, endTime, []) : (finishedWork.flags & 1) !== 0 && logComponentRender(finishedWork, finishedWork.actualStartTime, endTime, inHydratedSubtree, committedLanes)), recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, endTime);
          break;
        case 3:
          var prevProfilerEffectDuration = pushNestedEffectDurations(), wasInHydratedSubtree = inHydratedSubtree;
          inHydratedSubtree = finishedWork.alternate !== null && finishedWork.alternate.memoizedState.isDehydrated && (finishedWork.flags & 256) === 0, recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, endTime), inHydratedSubtree = wasInHydratedSubtree, flags & 2048 && (committedLanes = null, finishedWork.alternate !== null && (committedLanes = finishedWork.alternate.memoizedState.cache), committedTransitions = finishedWork.memoizedState.cache, committedTransitions !== committedLanes && (retainCache(committedTransitions), committedLanes != null && releaseCache(committedLanes))), finishedRoot.passiveEffectDuration += popNestedEffectDurations(prevProfilerEffectDuration);
          break;
        case 12:
          if (flags & 2048) {
            flags = pushNestedEffectDurations(), recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, endTime), finishedRoot = finishedWork.stateNode, finishedRoot.passiveEffectDuration += bubbleNestedEffectDurations(flags);
            try {
              runWithFiberInDEV(finishedWork, commitProfilerPostCommitImpl, finishedWork, finishedWork.alternate, commitStartTime, finishedRoot.passiveEffectDuration);
            } catch (error44) {
              captureCommitPhaseError(finishedWork, finishedWork.return, error44);
            }
          } else
            recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, endTime);
          break;
        case 31:
          flags = inHydratedSubtree, prevProfilerEffectDuration = finishedWork.alternate !== null ? finishedWork.alternate.memoizedState : null, wasInHydratedSubtree = finishedWork.memoizedState, prevProfilerEffectDuration !== null && wasInHydratedSubtree === null ? (wasInHydratedSubtree = finishedWork.deletions, wasInHydratedSubtree !== null && 0 < wasInHydratedSubtree.length && wasInHydratedSubtree[0].tag === 18 ? (inHydratedSubtree = !1, prevProfilerEffectDuration = prevProfilerEffectDuration.hydrationErrors, prevProfilerEffectDuration !== null && logComponentErrored(finishedWork, finishedWork.actualStartTime, endTime, prevProfilerEffectDuration)) : inHydratedSubtree = !0) : inHydratedSubtree = !1, recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, endTime), inHydratedSubtree = flags;
          break;
        case 13:
          flags = inHydratedSubtree, prevProfilerEffectDuration = finishedWork.alternate !== null ? finishedWork.alternate.memoizedState : null, wasInHydratedSubtree = finishedWork.memoizedState, prevProfilerEffectDuration === null || prevProfilerEffectDuration.dehydrated === null || wasInHydratedSubtree !== null && wasInHydratedSubtree.dehydrated !== null ? inHydratedSubtree = !1 : (wasInHydratedSubtree = finishedWork.deletions, wasInHydratedSubtree !== null && 0 < wasInHydratedSubtree.length && wasInHydratedSubtree[0].tag === 18 ? (inHydratedSubtree = !1, prevProfilerEffectDuration = prevProfilerEffectDuration.hydrationErrors, prevProfilerEffectDuration !== null && logComponentErrored(finishedWork, finishedWork.actualStartTime, endTime, prevProfilerEffectDuration)) : inHydratedSubtree = !0), recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, endTime), inHydratedSubtree = flags;
          break;
        case 23:
          break;
        case 22:
          wasInHydratedSubtree = finishedWork.stateNode, prevProfilerEffectDuration = finishedWork.alternate, finishedWork.memoizedState !== null ? wasInHydratedSubtree._visibility & OffscreenPassiveEffectsConnected ? recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, endTime) : recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, endTime) : wasInHydratedSubtree._visibility & OffscreenPassiveEffectsConnected ? recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, endTime) : (wasInHydratedSubtree._visibility |= OffscreenPassiveEffectsConnected, recursivelyTraverseReconnectPassiveEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, (finishedWork.subtreeFlags & 10256) !== 0 || finishedWork.actualDuration !== 0 && (finishedWork.alternate === null || finishedWork.alternate.child !== finishedWork.child), endTime), (finishedWork.mode & 2) === NoMode || inHydratedSubtree || (finishedRoot = finishedWork.actualStartTime, 0 <= finishedRoot && 0.05 < endTime - finishedRoot && logComponentReappeared(finishedWork, finishedRoot, endTime), 0 <= componentEffectStartTime && 0 <= componentEffectEndTime && 0.05 < componentEffectEndTime - componentEffectStartTime && logComponentReappeared(finishedWork, componentEffectStartTime, componentEffectEndTime))), flags & 2048 && commitOffscreenPassiveMountEffects(prevProfilerEffectDuration, finishedWork);
          break;
        case 24:
          recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, endTime), flags & 2048 && commitCachePassiveMountEffect(finishedWork.alternate, finishedWork);
          break;
        default:
          recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, endTime);
      }
      if ((finishedWork.mode & 2) !== NoMode) {
        if (finishedRoot = !inHydratedSubtree && finishedWork.alternate === null && finishedWork.return !== null && finishedWork.return.alternate !== null)
          committedLanes = finishedWork.actualStartTime, 0 <= committedLanes && 0.05 < endTime - committedLanes && logComponentTrigger(finishedWork, committedLanes, endTime, "Mount");
        0 <= componentEffectStartTime && 0 <= componentEffectEndTime && ((componentEffectSpawnedUpdate || 0.05 < componentEffectDuration) && logComponentEffect(finishedWork, componentEffectStartTime, componentEffectEndTime, componentEffectDuration, componentEffectErrors), finishedRoot && 0.05 < componentEffectEndTime - componentEffectStartTime && logComponentTrigger(finishedWork, componentEffectStartTime, componentEffectEndTime, "Mount"));
      }
      popComponentEffectStart(prevEffectStart), popComponentEffectDuration(prevEffectDuration), componentEffectErrors = prevEffectErrors, componentEffectSpawnedUpdate = prevEffectDidSpawnUpdate, alreadyWarnedForDeepEquality = prevDeepEquality;
    }
    function recursivelyTraverseReconnectPassiveEffects(finishedRoot, parentFiber, committedLanes, committedTransitions, includeWorkInProgressEffects, endTime) {
      includeWorkInProgressEffects = includeWorkInProgressEffects && ((parentFiber.subtreeFlags & 10256) !== 0 || parentFiber.actualDuration !== 0 && (parentFiber.alternate === null || parentFiber.alternate.child !== parentFiber.child));
      for (parentFiber = parentFiber.child;parentFiber !== null; ) {
        var nextSibling = parentFiber.sibling;
        reconnectPassiveEffects(finishedRoot, parentFiber, committedLanes, committedTransitions, includeWorkInProgressEffects, nextSibling !== null ? nextSibling.actualStartTime : endTime), parentFiber = nextSibling;
      }
    }
    function reconnectPassiveEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, includeWorkInProgressEffects, endTime) {
      var prevEffectStart = pushComponentEffectStart(), prevEffectDuration = pushComponentEffectDuration(), prevEffectErrors = pushComponentEffectErrors(), prevEffectDidSpawnUpdate = pushComponentEffectDidSpawnUpdate(), prevDeepEquality = alreadyWarnedForDeepEquality;
      includeWorkInProgressEffects && (finishedWork.mode & 2) !== NoMode && 0 < finishedWork.actualStartTime && (finishedWork.flags & 1) !== 0 && logComponentRender(finishedWork, finishedWork.actualStartTime, endTime, inHydratedSubtree, committedLanes);
      var flags = finishedWork.flags;
      switch (finishedWork.tag) {
        case 0:
        case 11:
        case 15:
          recursivelyTraverseReconnectPassiveEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, includeWorkInProgressEffects, endTime), commitHookPassiveMountEffects(finishedWork, Passive);
          break;
        case 23:
          break;
        case 22:
          var _instance2 = finishedWork.stateNode;
          finishedWork.memoizedState !== null ? _instance2._visibility & OffscreenPassiveEffectsConnected ? recursivelyTraverseReconnectPassiveEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, includeWorkInProgressEffects, endTime) : recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, endTime) : (_instance2._visibility |= OffscreenPassiveEffectsConnected, recursivelyTraverseReconnectPassiveEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, includeWorkInProgressEffects, endTime)), includeWorkInProgressEffects && flags & 2048 && commitOffscreenPassiveMountEffects(finishedWork.alternate, finishedWork);
          break;
        case 24:
          recursivelyTraverseReconnectPassiveEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, includeWorkInProgressEffects, endTime), includeWorkInProgressEffects && flags & 2048 && commitCachePassiveMountEffect(finishedWork.alternate, finishedWork);
          break;
        default:
          recursivelyTraverseReconnectPassiveEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, includeWorkInProgressEffects, endTime);
      }
      (finishedWork.mode & 2) !== NoMode && 0 <= componentEffectStartTime && 0 <= componentEffectEndTime && (componentEffectSpawnedUpdate || 0.05 < componentEffectDuration) && logComponentEffect(finishedWork, componentEffectStartTime, componentEffectEndTime, componentEffectDuration, componentEffectErrors), popComponentEffectStart(prevEffectStart), popComponentEffectDuration(prevEffectDuration), componentEffectErrors = prevEffectErrors, componentEffectSpawnedUpdate = prevEffectDidSpawnUpdate, alreadyWarnedForDeepEquality = prevDeepEquality;
    }
    function recursivelyTraverseAtomicPassiveEffects(finishedRoot$jscomp$0, parentFiber, committedLanes$jscomp$0, committedTransitions$jscomp$0, endTime$jscomp$0) {
      if (parentFiber.subtreeFlags & 10256 || parentFiber.actualDuration !== 0 && (parentFiber.alternate === null || parentFiber.alternate.child !== parentFiber.child))
        for (var child = parentFiber.child;child !== null; ) {
          parentFiber = child.sibling;
          var finishedRoot = finishedRoot$jscomp$0, committedLanes = committedLanes$jscomp$0, committedTransitions = committedTransitions$jscomp$0, endTime = parentFiber !== null ? parentFiber.actualStartTime : endTime$jscomp$0, prevDeepEquality = alreadyWarnedForDeepEquality;
          (child.mode & 2) !== NoMode && 0 < child.actualStartTime && (child.flags & 1) !== 0 && logComponentRender(child, child.actualStartTime, endTime, inHydratedSubtree, committedLanes);
          var flags = child.flags;
          switch (child.tag) {
            case 22:
              recursivelyTraverseAtomicPassiveEffects(finishedRoot, child, committedLanes, committedTransitions, endTime), flags & 2048 && commitOffscreenPassiveMountEffects(child.alternate, child);
              break;
            case 24:
              recursivelyTraverseAtomicPassiveEffects(finishedRoot, child, committedLanes, committedTransitions, endTime), flags & 2048 && commitCachePassiveMountEffect(child.alternate, child);
              break;
            default:
              recursivelyTraverseAtomicPassiveEffects(finishedRoot, child, committedLanes, committedTransitions, endTime);
          }
          alreadyWarnedForDeepEquality = prevDeepEquality, child = parentFiber;
        }
    }
    function recursivelyAccumulateSuspenseyCommit(parentFiber, committedLanes, suspendedState) {
      if (parentFiber.subtreeFlags & suspenseyCommitFlag)
        for (parentFiber = parentFiber.child;parentFiber !== null; )
          accumulateSuspenseyCommitOnFiber(parentFiber, committedLanes, suspendedState), parentFiber = parentFiber.sibling;
    }
    function accumulateSuspenseyCommitOnFiber(fiber, committedLanes, suspendedState) {
      switch (fiber.tag) {
        case 26:
          if (recursivelyAccumulateSuspenseyCommit(fiber, committedLanes, suspendedState), fiber.flags & suspenseyCommitFlag)
            if (fiber.memoizedState !== null)
              suspendResource(suspendedState, currentHoistableRoot, fiber.memoizedState, fiber.memoizedProps);
            else {
              var { stateNode: instance, type } = fiber;
              fiber = fiber.memoizedProps, ((committedLanes & 335544128) === committedLanes || maySuspendCommitInSyncRender(type, fiber)) && suspendInstance(suspendedState, instance, type, fiber);
            }
          break;
        case 5:
          recursivelyAccumulateSuspenseyCommit(fiber, committedLanes, suspendedState), fiber.flags & suspenseyCommitFlag && (instance = fiber.stateNode, type = fiber.type, fiber = fiber.memoizedProps, ((committedLanes & 335544128) === committedLanes || maySuspendCommitInSyncRender(type, fiber)) && suspendInstance(suspendedState, instance, type, fiber));
          break;
        case 3:
        case 4:
          supportsResources ? (instance = currentHoistableRoot, currentHoistableRoot = getHoistableRoot(fiber.stateNode.containerInfo), recursivelyAccumulateSuspenseyCommit(fiber, committedLanes, suspendedState), currentHoistableRoot = instance) : recursivelyAccumulateSuspenseyCommit(fiber, committedLanes, suspendedState);
          break;
        case 22:
          fiber.memoizedState === null && (instance = fiber.alternate, instance !== null && instance.memoizedState !== null ? (instance = suspenseyCommitFlag, suspenseyCommitFlag = 16777216, recursivelyAccumulateSuspenseyCommit(fiber, committedLanes, suspendedState), suspenseyCommitFlag = instance) : recursivelyAccumulateSuspenseyCommit(fiber, committedLanes, suspendedState));
          break;
        default:
          recursivelyAccumulateSuspenseyCommit(fiber, committedLanes, suspendedState);
      }
    }
    function detachAlternateSiblings(parentFiber) {
      var previousFiber = parentFiber.alternate;
      if (previousFiber !== null && (parentFiber = previousFiber.child, parentFiber !== null)) {
        previousFiber.child = null;
        do
          previousFiber = parentFiber.sibling, parentFiber.sibling = null, parentFiber = previousFiber;
        while (parentFiber !== null);
      }
    }
    function recursivelyTraversePassiveUnmountEffects(parentFiber) {
      var deletions = parentFiber.deletions;
      if ((parentFiber.flags & 16) !== 0) {
        if (deletions !== null)
          for (var i4 = 0;i4 < deletions.length; i4++) {
            var childToDelete = deletions[i4], prevEffectStart = pushComponentEffectStart();
            nextEffect = childToDelete, commitPassiveUnmountEffectsInsideOfDeletedTree_begin(childToDelete, parentFiber), (childToDelete.mode & 2) !== NoMode && 0 <= componentEffectStartTime && 0 <= componentEffectEndTime && 0.05 < componentEffectEndTime - componentEffectStartTime && logComponentTrigger(childToDelete, componentEffectStartTime, componentEffectEndTime, "Unmount"), popComponentEffectStart(prevEffectStart);
          }
        detachAlternateSiblings(parentFiber);
      }
      if (parentFiber.subtreeFlags & 10256)
        for (parentFiber = parentFiber.child;parentFiber !== null; )
          commitPassiveUnmountOnFiber(parentFiber), parentFiber = parentFiber.sibling;
    }
    function commitPassiveUnmountOnFiber(finishedWork) {
      var prevEffectStart = pushComponentEffectStart(), prevEffectDuration = pushComponentEffectDuration(), prevEffectErrors = pushComponentEffectErrors(), prevEffectDidSpawnUpdate = pushComponentEffectDidSpawnUpdate();
      switch (finishedWork.tag) {
        case 0:
        case 11:
        case 15:
          recursivelyTraversePassiveUnmountEffects(finishedWork), finishedWork.flags & 2048 && commitHookPassiveUnmountEffects(finishedWork, finishedWork.return, Passive | HasEffect);
          break;
        case 3:
          var prevProfilerEffectDuration = pushNestedEffectDurations();
          recursivelyTraversePassiveUnmountEffects(finishedWork), finishedWork.stateNode.passiveEffectDuration += popNestedEffectDurations(prevProfilerEffectDuration);
          break;
        case 12:
          prevProfilerEffectDuration = pushNestedEffectDurations(), recursivelyTraversePassiveUnmountEffects(finishedWork), finishedWork.stateNode.passiveEffectDuration += bubbleNestedEffectDurations(prevProfilerEffectDuration);
          break;
        case 22:
          prevProfilerEffectDuration = finishedWork.stateNode, finishedWork.memoizedState !== null && prevProfilerEffectDuration._visibility & OffscreenPassiveEffectsConnected && (finishedWork.return === null || finishedWork.return.tag !== 13) ? (prevProfilerEffectDuration._visibility &= ~OffscreenPassiveEffectsConnected, recursivelyTraverseDisconnectPassiveEffects(finishedWork), (finishedWork.mode & 2) !== NoMode && 0 <= componentEffectStartTime && 0 <= componentEffectEndTime && 0.05 < componentEffectEndTime - componentEffectStartTime && logComponentTrigger(finishedWork, componentEffectStartTime, componentEffectEndTime, "Disconnect")) : recursivelyTraversePassiveUnmountEffects(finishedWork);
          break;
        default:
          recursivelyTraversePassiveUnmountEffects(finishedWork);
      }
      (finishedWork.mode & 2) !== NoMode && 0 <= componentEffectStartTime && 0 <= componentEffectEndTime && (componentEffectSpawnedUpdate || 0.05 < componentEffectDuration) && logComponentEffect(finishedWork, componentEffectStartTime, componentEffectEndTime, componentEffectDuration, componentEffectErrors), popComponentEffectStart(prevEffectStart), popComponentEffectDuration(prevEffectDuration), componentEffectSpawnedUpdate = prevEffectDidSpawnUpdate, componentEffectErrors = prevEffectErrors;
    }
    function recursivelyTraverseDisconnectPassiveEffects(parentFiber) {
      var deletions = parentFiber.deletions;
      if ((parentFiber.flags & 16) !== 0) {
        if (deletions !== null)
          for (var i4 = 0;i4 < deletions.length; i4++) {
            var childToDelete = deletions[i4], prevEffectStart = pushComponentEffectStart();
            nextEffect = childToDelete, commitPassiveUnmountEffectsInsideOfDeletedTree_begin(childToDelete, parentFiber), (childToDelete.mode & 2) !== NoMode && 0 <= componentEffectStartTime && 0 <= componentEffectEndTime && 0.05 < componentEffectEndTime - componentEffectStartTime && logComponentTrigger(childToDelete, componentEffectStartTime, componentEffectEndTime, "Unmount"), popComponentEffectStart(prevEffectStart);
          }
        detachAlternateSiblings(parentFiber);
      }
      for (parentFiber = parentFiber.child;parentFiber !== null; )
        disconnectPassiveEffect(parentFiber), parentFiber = parentFiber.sibling;
    }
    function disconnectPassiveEffect(finishedWork) {
      var prevEffectStart = pushComponentEffectStart(), prevEffectDuration = pushComponentEffectDuration(), prevEffectErrors = pushComponentEffectErrors(), prevEffectDidSpawnUpdate = pushComponentEffectDidSpawnUpdate();
      switch (finishedWork.tag) {
        case 0:
        case 11:
        case 15:
          commitHookPassiveUnmountEffects(finishedWork, finishedWork.return, Passive), recursivelyTraverseDisconnectPassiveEffects(finishedWork);
          break;
        case 22:
          var instance = finishedWork.stateNode;
          instance._visibility & OffscreenPassiveEffectsConnected && (instance._visibility &= ~OffscreenPassiveEffectsConnected, recursivelyTraverseDisconnectPassiveEffects(finishedWork));
          break;
        default:
          recursivelyTraverseDisconnectPassiveEffects(finishedWork);
      }
      (finishedWork.mode & 2) !== NoMode && 0 <= componentEffectStartTime && 0 <= componentEffectEndTime && (componentEffectSpawnedUpdate || 0.05 < componentEffectDuration) && logComponentEffect(finishedWork, componentEffectStartTime, componentEffectEndTime, componentEffectDuration, componentEffectErrors), popComponentEffectStart(prevEffectStart), popComponentEffectDuration(prevEffectDuration), componentEffectSpawnedUpdate = prevEffectDidSpawnUpdate, componentEffectErrors = prevEffectErrors;
    }
    function commitPassiveUnmountEffectsInsideOfDeletedTree_begin(deletedSubtreeRoot, nearestMountedAncestor$jscomp$0) {
      for (;nextEffect !== null; ) {
        var fiber = nextEffect, current2 = fiber, nearestMountedAncestor = nearestMountedAncestor$jscomp$0, prevEffectStart = pushComponentEffectStart(), prevEffectDuration = pushComponentEffectDuration(), prevEffectErrors = pushComponentEffectErrors(), prevEffectDidSpawnUpdate = pushComponentEffectDidSpawnUpdate();
        switch (current2.tag) {
          case 0:
          case 11:
          case 15:
            commitHookPassiveUnmountEffects(current2, nearestMountedAncestor, Passive);
            break;
          case 23:
          case 22:
            current2.memoizedState !== null && current2.memoizedState.cachePool !== null && (nearestMountedAncestor = current2.memoizedState.cachePool.pool, nearestMountedAncestor != null && retainCache(nearestMountedAncestor));
            break;
          case 24:
            releaseCache(current2.memoizedState.cache);
        }
        if ((current2.mode & 2) !== NoMode && 0 <= componentEffectStartTime && 0 <= componentEffectEndTime && (componentEffectSpawnedUpdate || 0.05 < componentEffectDuration) && logComponentEffect(current2, componentEffectStartTime, componentEffectEndTime, componentEffectDuration, componentEffectErrors), popComponentEffectStart(prevEffectStart), popComponentEffectDuration(prevEffectDuration), componentEffectSpawnedUpdate = prevEffectDidSpawnUpdate, componentEffectErrors = prevEffectErrors, current2 = fiber.child, current2 !== null)
          current2.return = fiber, nextEffect = current2;
        else
          a:
            for (fiber = deletedSubtreeRoot;nextEffect !== null; ) {
              if (current2 = nextEffect, prevEffectStart = current2.sibling, prevEffectDuration = current2.return, detachFiberAfterEffects(current2), current2 === fiber) {
                nextEffect = null;
                break a;
              }
              if (prevEffectStart !== null) {
                prevEffectStart.return = prevEffectDuration, nextEffect = prevEffectStart;
                break a;
              }
              nextEffect = prevEffectDuration;
            }
      }
    }
    function findFiberRootForHostRoot(hostRoot) {
      var maybeFiber = getInstanceFromNode(hostRoot);
      if (maybeFiber != null) {
        if (typeof maybeFiber.memoizedProps["data-testname"] !== "string")
          throw Error("Invalid host root specified. Should be either a React container or a node with a testname attribute.");
        return maybeFiber;
      }
      if (hostRoot = findFiberRoot(hostRoot), hostRoot === null)
        throw Error("Could not find React container within specified host subtree.");
      return hostRoot.stateNode.current;
    }
    function matchSelector(fiber$jscomp$0, selector) {
      var tag = fiber$jscomp$0.tag;
      switch (selector.$$typeof) {
        case COMPONENT_TYPE:
          if (fiber$jscomp$0.type === selector.value)
            return !0;
          break;
        case HAS_PSEUDO_CLASS_TYPE:
          a: {
            selector = selector.value, fiber$jscomp$0 = [fiber$jscomp$0, 0];
            for (tag = 0;tag < fiber$jscomp$0.length; ) {
              var fiber = fiber$jscomp$0[tag++], tag$jscomp$0 = fiber.tag, selectorIndex = fiber$jscomp$0[tag++], selector$jscomp$0 = selector[selectorIndex];
              if (tag$jscomp$0 !== 5 && tag$jscomp$0 !== 26 && tag$jscomp$0 !== 27 || !isHiddenSubtree(fiber)) {
                for (;selector$jscomp$0 != null && matchSelector(fiber, selector$jscomp$0); )
                  selectorIndex++, selector$jscomp$0 = selector[selectorIndex];
                if (selectorIndex === selector.length) {
                  selector = !0;
                  break a;
                } else
                  for (fiber = fiber.child;fiber !== null; )
                    fiber$jscomp$0.push(fiber, selectorIndex), fiber = fiber.sibling;
              }
            }
            selector = !1;
          }
          return selector;
        case ROLE_TYPE:
          if ((tag === 5 || tag === 26 || tag === 27) && matchAccessibilityRole(fiber$jscomp$0.stateNode, selector.value))
            return !0;
          break;
        case TEXT_TYPE:
          if (tag === 5 || tag === 6 || tag === 26 || tag === 27) {
            if (fiber$jscomp$0 = getTextContent(fiber$jscomp$0), fiber$jscomp$0 !== null && 0 <= fiber$jscomp$0.indexOf(selector.value))
              return !0;
          }
          break;
        case TEST_NAME_TYPE:
          if (tag === 5 || tag === 26 || tag === 27) {
            if (fiber$jscomp$0 = fiber$jscomp$0.memoizedProps["data-testname"], typeof fiber$jscomp$0 === "string" && fiber$jscomp$0.toLowerCase() === selector.value.toLowerCase())
              return !0;
          }
          break;
        default:
          throw Error("Invalid selector type specified.");
      }
      return !1;
    }
    function selectorToString(selector) {
      switch (selector.$$typeof) {
        case COMPONENT_TYPE:
          return "<" + (getComponentNameFromType(selector.value) || "Unknown") + ">";
        case HAS_PSEUDO_CLASS_TYPE:
          return ":has(" + (selectorToString(selector) || "") + ")";
        case ROLE_TYPE:
          return '[role="' + selector.value + '"]';
        case TEXT_TYPE:
          return '"' + selector.value + '"';
        case TEST_NAME_TYPE:
          return '[data-testname="' + selector.value + '"]';
        default:
          throw Error("Invalid selector type specified.");
      }
    }
    function findPaths(root2, selectors) {
      var matchingFibers = [];
      root2 = [root2, 0];
      for (var index = 0;index < root2.length; ) {
        var fiber = root2[index++], tag = fiber.tag, selectorIndex = root2[index++], selector = selectors[selectorIndex];
        if (tag !== 5 && tag !== 26 && tag !== 27 || !isHiddenSubtree(fiber)) {
          for (;selector != null && matchSelector(fiber, selector); )
            selectorIndex++, selector = selectors[selectorIndex];
          if (selectorIndex === selectors.length)
            matchingFibers.push(fiber);
          else
            for (fiber = fiber.child;fiber !== null; )
              root2.push(fiber, selectorIndex), fiber = fiber.sibling;
        }
      }
      return matchingFibers;
    }
    function findAllNodes(hostRoot, selectors) {
      if (!supportsTestSelectors)
        throw Error("Test selector API is not supported by this renderer.");
      hostRoot = findFiberRootForHostRoot(hostRoot), hostRoot = findPaths(hostRoot, selectors), selectors = [], hostRoot = Array.from(hostRoot);
      for (var index = 0;index < hostRoot.length; ) {
        var node = hostRoot[index++], tag = node.tag;
        if (tag === 5 || tag === 26 || tag === 27)
          isHiddenSubtree(node) || selectors.push(node.stateNode);
        else
          for (node = node.child;node !== null; )
            hostRoot.push(node), node = node.sibling;
      }
      return selectors;
    }
    function onCommitRoot() {
      supportsTestSelectors && commitHooks.forEach(function(commitHook) {
        return commitHook();
      });
    }
    function isConcurrentActEnvironment() {
      var isReactActEnvironmentGlobal = typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0;
      return isReactActEnvironmentGlobal || ReactSharedInternals.actQueue === null || console.error("The current testing environment is not configured to support act(...)"), isReactActEnvironmentGlobal;
    }
    function requestUpdateLane(fiber) {
      if ((executionContext & RenderContext) !== NoContext && workInProgressRootRenderLanes !== 0)
        return workInProgressRootRenderLanes & -workInProgressRootRenderLanes;
      var transition = ReactSharedInternals.T;
      return transition !== null ? (transition._updatedFibers || (transition._updatedFibers = /* @__PURE__ */ new Set), transition._updatedFibers.add(fiber), requestTransitionLane()) : resolveUpdatePriority();
    }
    function requestDeferredLane() {
      if (workInProgressDeferredLane === 0)
        if ((workInProgressRootRenderLanes & 536870912) === 0 || isHydrating) {
          var lane = nextTransitionDeferredLane;
          nextTransitionDeferredLane <<= 1, (nextTransitionDeferredLane & 3932160) === 0 && (nextTransitionDeferredLane = 262144), workInProgressDeferredLane = lane;
        } else
          workInProgressDeferredLane = 536870912;
      return lane = suspenseHandlerStackCursor.current, lane !== null && (lane.flags |= 32), workInProgressDeferredLane;
    }
    function scheduleUpdateOnFiber(root2, fiber, lane) {
      if (isRunningInsertionEffect && console.error("useInsertionEffect must not schedule updates."), isFlushingPassiveEffects && (didScheduleUpdateDuringPassiveEffects = !0), root2 === workInProgressRoot && (workInProgressSuspendedReason === SuspendedOnData || workInProgressSuspendedReason === SuspendedOnAction) || root2.cancelPendingCommit !== null)
        prepareFreshStack(root2, 0), markRootSuspended(root2, workInProgressRootRenderLanes, workInProgressDeferredLane, !1);
      if (markRootUpdated$1(root2, lane), (executionContext & RenderContext) !== NoContext && root2 === workInProgressRoot) {
        if (isRendering)
          switch (fiber.tag) {
            case 0:
            case 11:
            case 15:
              root2 = workInProgress && getComponentNameFromFiber(workInProgress) || "Unknown", didWarnAboutUpdateInRenderForAnotherComponent.has(root2) || (didWarnAboutUpdateInRenderForAnotherComponent.add(root2), fiber = getComponentNameFromFiber(fiber) || "Unknown", console.error("Cannot update a component (`%s`) while rendering a different component (`%s`). To locate the bad setState() call inside `%s`, follow the stack trace as described in https://react.dev/link/setstate-in-render", fiber, root2, root2));
              break;
            case 1:
              didWarnAboutUpdateInRender || (console.error("Cannot update during an existing state transition (such as within `render`). Render methods should be a pure function of props and state."), didWarnAboutUpdateInRender = !0);
          }
      } else
        isDevToolsPresent && addFiberToLanesMap(root2, fiber, lane), warnIfUpdatesNotWrappedWithActDEV(fiber), root2 === workInProgressRoot && ((executionContext & RenderContext) === NoContext && (workInProgressRootInterleavedUpdatedLanes |= lane), workInProgressRootExitStatus === RootSuspendedWithDelay && markRootSuspended(root2, workInProgressRootRenderLanes, workInProgressDeferredLane, !1)), ensureRootIsScheduled(root2);
    }
    function performWorkOnRoot(root2, lanes, forceSync) {
      if ((executionContext & (RenderContext | CommitContext)) !== NoContext)
        throw Error("Should not already be working.");
      if (workInProgressRootRenderLanes !== 0 && workInProgress !== null) {
        var yieldedFiber = workInProgress, yieldEndTime = now$1();
        switch (yieldReason) {
          case SuspendedOnImmediate:
          case SuspendedOnData:
            var startTime = yieldStartTime;
            supportsUserTiming && ((yieldedFiber = yieldedFiber._debugTask) ? yieldedFiber.run(console.timeStamp.bind(console, "Suspended", startTime, yieldEndTime, "Components \u269B", void 0, "primary-light")) : console.timeStamp("Suspended", startTime, yieldEndTime, "Components \u269B", void 0, "primary-light"));
            break;
          case SuspendedOnAction:
            startTime = yieldStartTime, supportsUserTiming && ((yieldedFiber = yieldedFiber._debugTask) ? yieldedFiber.run(console.timeStamp.bind(console, "Action", startTime, yieldEndTime, "Components \u269B", void 0, "primary-light")) : console.timeStamp("Action", startTime, yieldEndTime, "Components \u269B", void 0, "primary-light"));
            break;
          default:
            supportsUserTiming && (yieldedFiber = yieldEndTime - yieldStartTime, 3 > yieldedFiber || console.timeStamp("Blocked", yieldStartTime, yieldEndTime, "Components \u269B", void 0, 5 > yieldedFiber ? "primary-light" : 10 > yieldedFiber ? "primary" : 100 > yieldedFiber ? "primary-dark" : "error"));
        }
      }
      startTime = (forceSync = !forceSync && (lanes & 127) === 0 && (lanes & root2.expiredLanes) === 0 || checkIfRootIsPrerendering(root2, lanes)) ? renderRootConcurrent(root2, lanes) : renderRootSync(root2, lanes, !0);
      var renderWasConcurrent = forceSync;
      do {
        if (startTime === RootInProgress) {
          workInProgressRootIsPrerendering && !forceSync && markRootSuspended(root2, lanes, 0, !1), lanes = workInProgressSuspendedReason, yieldStartTime = now2(), yieldReason = lanes;
          break;
        } else {
          if (yieldedFiber = now$1(), yieldEndTime = root2.current.alternate, renderWasConcurrent && !isRenderConsistentWithExternalStores(yieldEndTime)) {
            setCurrentTrackFromLanes(lanes), yieldEndTime = renderStartTime, startTime = yieldedFiber, !supportsUserTiming || startTime <= yieldEndTime || (workInProgressUpdateTask ? workInProgressUpdateTask.run(console.timeStamp.bind(console, "Teared Render", yieldEndTime, startTime, currentTrack, "Scheduler \u269B", "error")) : console.timeStamp("Teared Render", yieldEndTime, startTime, currentTrack, "Scheduler \u269B", "error")), finalizeRender(lanes, yieldedFiber), startTime = renderRootSync(root2, lanes, !1), renderWasConcurrent = !1;
            continue;
          }
          if (startTime === RootErrored) {
            if (renderWasConcurrent = lanes, root2.errorRecoveryDisabledLanes & renderWasConcurrent)
              var errorRetryLanes = 0;
            else
              errorRetryLanes = root2.pendingLanes & -536870913, errorRetryLanes = errorRetryLanes !== 0 ? errorRetryLanes : errorRetryLanes & 536870912 ? 536870912 : 0;
            if (errorRetryLanes !== 0) {
              setCurrentTrackFromLanes(lanes), logErroredRenderPhase(renderStartTime, yieldedFiber, lanes, workInProgressUpdateTask), finalizeRender(lanes, yieldedFiber), lanes = errorRetryLanes;
              a: {
                yieldedFiber = root2, startTime = renderWasConcurrent, renderWasConcurrent = workInProgressRootConcurrentErrors;
                var wasRootDehydrated = supportsHydration && yieldedFiber.current.memoizedState.isDehydrated;
                if (wasRootDehydrated && (prepareFreshStack(yieldedFiber, errorRetryLanes).flags |= 256), errorRetryLanes = renderRootSync(yieldedFiber, errorRetryLanes, !1), errorRetryLanes !== RootErrored) {
                  if (workInProgressRootDidAttachPingListener && !wasRootDehydrated) {
                    yieldedFiber.errorRecoveryDisabledLanes |= startTime, workInProgressRootInterleavedUpdatedLanes |= startTime, startTime = RootSuspendedWithDelay;
                    break a;
                  }
                  yieldedFiber = workInProgressRootRecoverableErrors, workInProgressRootRecoverableErrors = renderWasConcurrent, yieldedFiber !== null && (workInProgressRootRecoverableErrors === null ? workInProgressRootRecoverableErrors = yieldedFiber : workInProgressRootRecoverableErrors.push.apply(workInProgressRootRecoverableErrors, yieldedFiber));
                }
                startTime = errorRetryLanes;
              }
              if (renderWasConcurrent = !1, startTime !== RootErrored)
                continue;
              else
                yieldedFiber = now$1();
            }
          }
          if (startTime === RootFatalErrored) {
            setCurrentTrackFromLanes(lanes), logErroredRenderPhase(renderStartTime, yieldedFiber, lanes, workInProgressUpdateTask), finalizeRender(lanes, yieldedFiber), prepareFreshStack(root2, 0), markRootSuspended(root2, lanes, 0, !0);
            break;
          }
          a: {
            switch (forceSync = root2, startTime) {
              case RootInProgress:
              case RootFatalErrored:
                throw Error("Root did not complete. This is a bug in React.");
              case RootSuspendedWithDelay:
                if ((lanes & 4194048) !== lanes)
                  break;
              case RootSuspendedAtTheShell:
                setCurrentTrackFromLanes(lanes), logSuspendedRenderPhase(renderStartTime, yieldedFiber, lanes, workInProgressUpdateTask), finalizeRender(lanes, yieldedFiber), yieldEndTime = lanes, (yieldEndTime & 127) !== 0 ? blockingSuspendedTime = yieldedFiber : (yieldEndTime & 4194048) !== 0 && (transitionSuspendedTime = yieldedFiber), markRootSuspended(forceSync, lanes, workInProgressDeferredLane, !workInProgressRootDidSkipSuspendedSiblings);
                break a;
              case RootErrored:
                workInProgressRootRecoverableErrors = null;
                break;
              case RootSuspended:
              case RootCompleted:
                break;
              default:
                throw Error("Unknown root exit status.");
            }
            if (ReactSharedInternals.actQueue !== null)
              commitRoot(forceSync, yieldEndTime, lanes, workInProgressRootRecoverableErrors, workInProgressTransitions, workInProgressRootDidIncludeRecursiveRenderUpdate, workInProgressDeferredLane, workInProgressRootInterleavedUpdatedLanes, workInProgressSuspendedRetryLanes, startTime, null, null, renderStartTime, yieldedFiber);
            else {
              if ((lanes & 62914560) === lanes && (renderWasConcurrent = globalMostRecentFallbackTime + FALLBACK_THROTTLE_MS - now$1(), 10 < renderWasConcurrent)) {
                if (markRootSuspended(forceSync, lanes, workInProgressDeferredLane, !workInProgressRootDidSkipSuspendedSiblings), getNextLanes(forceSync, 0, !0) !== 0)
                  break a;
                pendingEffectsLanes = lanes, forceSync.timeoutHandle = scheduleTimeout(commitRootWhenReady.bind(null, forceSync, yieldEndTime, workInProgressRootRecoverableErrors, workInProgressTransitions, workInProgressRootDidIncludeRecursiveRenderUpdate, lanes, workInProgressDeferredLane, workInProgressRootInterleavedUpdatedLanes, workInProgressSuspendedRetryLanes, workInProgressRootDidSkipSuspendedSiblings, startTime, "Throttled", renderStartTime, yieldedFiber), renderWasConcurrent);
                break a;
              }
              commitRootWhenReady(forceSync, yieldEndTime, workInProgressRootRecoverableErrors, workInProgressTransitions, workInProgressRootDidIncludeRecursiveRenderUpdate, lanes, workInProgressDeferredLane, workInProgressRootInterleavedUpdatedLanes, workInProgressSuspendedRetryLanes, workInProgressRootDidSkipSuspendedSiblings, startTime, null, renderStartTime, yieldedFiber);
            }
          }
        }
        break;
      } while (1);
      ensureRootIsScheduled(root2);
    }
    function commitRootWhenReady(root2, finishedWork, recoverableErrors, transitions, didIncludeRenderPhaseUpdate, lanes, spawnedLane, updatedLanes, suspendedRetryLanes, didSkipSuspendedSiblings, exitStatus, suspendedCommitReason, completedRenderStartTime, completedRenderEndTime) {
      root2.timeoutHandle = noTimeout;
      var subtreeFlags = finishedWork.subtreeFlags, suspendedState = null;
      if (subtreeFlags & 8192 || (subtreeFlags & 16785408) === 16785408) {
        if (suspendedState = startSuspendingCommit(), accumulateSuspenseyCommitOnFiber(finishedWork, lanes, suspendedState), subtreeFlags = (lanes & 62914560) === lanes ? globalMostRecentFallbackTime - now$1() : (lanes & 4194048) === lanes ? globalMostRecentTransitionTime - now$1() : 0, subtreeFlags = waitForCommitToBeReady(suspendedState, subtreeFlags), subtreeFlags !== null) {
          pendingEffectsLanes = lanes, root2.cancelPendingCommit = subtreeFlags(commitRoot.bind(null, root2, finishedWork, lanes, recoverableErrors, transitions, didIncludeRenderPhaseUpdate, spawnedLane, updatedLanes, suspendedRetryLanes, exitStatus, suspendedState, getSuspendedCommitReason(suspendedState, root2.containerInfo), completedRenderStartTime, completedRenderEndTime)), markRootSuspended(root2, lanes, spawnedLane, !didSkipSuspendedSiblings);
          return;
        }
      }
      commitRoot(root2, finishedWork, lanes, recoverableErrors, transitions, didIncludeRenderPhaseUpdate, spawnedLane, updatedLanes, suspendedRetryLanes, exitStatus, suspendedState, suspendedCommitReason, completedRenderStartTime, completedRenderEndTime);
    }
    function isRenderConsistentWithExternalStores(finishedWork) {
      for (var node = finishedWork;; ) {
        var tag = node.tag;
        if ((tag === 0 || tag === 11 || tag === 15) && node.flags & 16384 && (tag = node.updateQueue, tag !== null && (tag = tag.stores, tag !== null)))
          for (var i4 = 0;i4 < tag.length; i4++) {
            var check3 = tag[i4], getSnapshot = check3.getSnapshot;
            check3 = check3.value;
            try {
              if (!objectIs(getSnapshot(), check3))
                return !1;
            } catch (error44) {
              return !1;
            }
          }
        if (tag = node.child, node.subtreeFlags & 16384 && tag !== null)
          tag.return = node, node = tag;
        else {
          if (node === finishedWork)
            break;
          for (;node.sibling === null; ) {
            if (node.return === null || node.return === finishedWork)
              return !0;
            node = node.return;
          }
          node.sibling.return = node.return, node = node.sibling;
        }
      }
      return !0;
    }
    function markRootSuspended(root2, suspendedLanes, spawnedLane, didAttemptEntireTree) {
      suspendedLanes &= ~workInProgressRootPingedLanes, suspendedLanes &= ~workInProgressRootInterleavedUpdatedLanes, root2.suspendedLanes |= suspendedLanes, root2.pingedLanes &= ~suspendedLanes, didAttemptEntireTree && (root2.warmLanes |= suspendedLanes), didAttemptEntireTree = root2.expirationTimes;
      for (var lanes = suspendedLanes;0 < lanes; ) {
        var index = 31 - clz32(lanes), lane = 1 << index;
        didAttemptEntireTree[index] = -1, lanes &= ~lane;
      }
      spawnedLane !== 0 && markSpawnedDeferredLane(root2, spawnedLane, suspendedLanes);
    }
    function flushSyncWork() {
      return (executionContext & (RenderContext | CommitContext)) === NoContext ? (flushSyncWorkAcrossRoots_impl(0, !1), !1) : !0;
    }
    function isAlreadyRendering() {
      return (executionContext & (RenderContext | CommitContext)) !== NoContext;
    }
    function resetWorkInProgressStack() {
      if (workInProgress !== null) {
        if (workInProgressSuspendedReason === NotSuspended)
          var interruptedWork = workInProgress.return;
        else
          interruptedWork = workInProgress, resetContextDependencies(), resetHooksOnUnwind(interruptedWork), thenableState$1 = null, thenableIndexCounter$1 = 0, interruptedWork = workInProgress;
        for (;interruptedWork !== null; )
          unwindInterruptedWork(interruptedWork.alternate, interruptedWork), interruptedWork = interruptedWork.return;
        workInProgress = null;
      }
    }
    function finalizeRender(lanes, finalizationTime) {
      (lanes & 127) !== 0 && (blockingClampTime = finalizationTime), (lanes & 4194048) !== 0 && (transitionClampTime = finalizationTime);
    }
    function prepareFreshStack(root2, lanes) {
      supportsUserTiming && (console.timeStamp("Blocking Track", 0.003, 0.003, "Blocking", "Scheduler \u269B", "primary-light"), console.timeStamp("Transition Track", 0.003, 0.003, "Transition", "Scheduler \u269B", "primary-light"), console.timeStamp("Suspense Track", 0.003, 0.003, "Suspense", "Scheduler \u269B", "primary-light"), console.timeStamp("Idle Track", 0.003, 0.003, "Idle", "Scheduler \u269B", "primary-light"));
      var previousRenderStartTime = renderStartTime;
      if (renderStartTime = now2(), workInProgressRootRenderLanes !== 0 && 0 < previousRenderStartTime) {
        if (setCurrentTrackFromLanes(workInProgressRootRenderLanes), workInProgressRootExitStatus === RootSuspended || workInProgressRootExitStatus === RootSuspendedWithDelay)
          logSuspendedRenderPhase(previousRenderStartTime, renderStartTime, lanes, workInProgressUpdateTask);
        else {
          var endTime = renderStartTime, debugTask = workInProgressUpdateTask;
          if (supportsUserTiming && !(endTime <= previousRenderStartTime)) {
            var color = (lanes & 738197653) === lanes ? "tertiary-dark" : "primary-dark", label = (lanes & 536870912) === lanes ? "Prewarm" : (lanes & 201326741) === lanes ? "Interrupted Hydration" : "Interrupted Render";
            debugTask ? debugTask.run(console.timeStamp.bind(console, label, previousRenderStartTime, endTime, currentTrack, "Scheduler \u269B", color)) : console.timeStamp(label, previousRenderStartTime, endTime, currentTrack, "Scheduler \u269B", color);
          }
        }
        finalizeRender(workInProgressRootRenderLanes, renderStartTime);
      }
      if (previousRenderStartTime = workInProgressUpdateTask, workInProgressUpdateTask = null, (lanes & 127) !== 0) {
        workInProgressUpdateTask = blockingUpdateTask, debugTask = 0 <= blockingUpdateTime && blockingUpdateTime < blockingClampTime ? blockingClampTime : blockingUpdateTime, endTime = 0 <= blockingEventTime && blockingEventTime < blockingClampTime ? blockingClampTime : blockingEventTime, color = 0 <= endTime ? endTime : 0 <= debugTask ? debugTask : renderStartTime, 0 <= blockingSuspendedTime && (setCurrentTrackFromLanes(2), logSuspendedWithDelayPhase(blockingSuspendedTime, color, lanes, previousRenderStartTime)), previousRenderStartTime = debugTask;
        var eventTime = endTime, eventType = blockingEventType, eventIsRepeat = 0 < blockingEventRepeatTime, isSpawnedUpdate = blockingUpdateType === 1, isPingedUpdate = blockingUpdateType === 2;
        if (debugTask = renderStartTime, endTime = blockingUpdateTask, color = blockingUpdateMethodName, label = blockingUpdateComponentName, supportsUserTiming) {
          if (currentTrack = "Blocking", 0 < previousRenderStartTime ? previousRenderStartTime > debugTask && (previousRenderStartTime = debugTask) : previousRenderStartTime = debugTask, 0 < eventTime ? eventTime > previousRenderStartTime && (eventTime = previousRenderStartTime) : eventTime = previousRenderStartTime, eventType !== null && previousRenderStartTime > eventTime) {
            var color$jscomp$0 = eventIsRepeat ? "secondary-light" : "warning";
            endTime ? endTime.run(console.timeStamp.bind(console, eventIsRepeat ? "Consecutive" : "Event: " + eventType, eventTime, previousRenderStartTime, currentTrack, "Scheduler \u269B", color$jscomp$0)) : console.timeStamp(eventIsRepeat ? "Consecutive" : "Event: " + eventType, eventTime, previousRenderStartTime, currentTrack, "Scheduler \u269B", color$jscomp$0);
          }
          debugTask > previousRenderStartTime && (eventTime = isSpawnedUpdate ? "error" : (lanes & 738197653) === lanes ? "tertiary-light" : "primary-light", isSpawnedUpdate = isPingedUpdate ? "Promise Resolved" : isSpawnedUpdate ? "Cascading Update" : 5 < debugTask - previousRenderStartTime ? "Update Blocked" : "Update", isPingedUpdate = [], label != null && isPingedUpdate.push(["Component name", label]), color != null && isPingedUpdate.push(["Method name", color]), previousRenderStartTime = {
            start: previousRenderStartTime,
            end: debugTask,
            detail: {
              devtools: {
                properties: isPingedUpdate,
                track: currentTrack,
                trackGroup: "Scheduler \u269B",
                color: eventTime
              }
            }
          }, endTime ? endTime.run(performance.measure.bind(performance, isSpawnedUpdate, previousRenderStartTime)) : performance.measure(isSpawnedUpdate, previousRenderStartTime));
        }
        blockingUpdateTime = -1.1, blockingUpdateType = 0, blockingUpdateComponentName = blockingUpdateMethodName = null, blockingSuspendedTime = -1.1, blockingEventRepeatTime = blockingEventTime, blockingEventTime = -1.1, blockingClampTime = now2();
      }
      if ((lanes & 4194048) !== 0 && (workInProgressUpdateTask = transitionUpdateTask, debugTask = 0 <= transitionStartTime && transitionStartTime < transitionClampTime ? transitionClampTime : transitionStartTime, previousRenderStartTime = 0 <= transitionUpdateTime && transitionUpdateTime < transitionClampTime ? transitionClampTime : transitionUpdateTime, endTime = 0 <= transitionEventTime && transitionEventTime < transitionClampTime ? transitionClampTime : transitionEventTime, color = 0 <= endTime ? endTime : 0 <= previousRenderStartTime ? previousRenderStartTime : renderStartTime, 0 <= transitionSuspendedTime && (setCurrentTrackFromLanes(256), logSuspendedWithDelayPhase(transitionSuspendedTime, color, lanes, workInProgressUpdateTask)), isPingedUpdate = endTime, eventTime = transitionEventType, eventType = 0 < transitionEventRepeatTime, eventIsRepeat = transitionUpdateType === 2, color = renderStartTime, endTime = transitionUpdateTask, label = transitionUpdateMethodName, isSpawnedUpdate = transitionUpdateComponentName, supportsUserTiming && (currentTrack = "Transition", 0 < previousRenderStartTime ? previousRenderStartTime > color && (previousRenderStartTime = color) : previousRenderStartTime = color, 0 < debugTask ? debugTask > previousRenderStartTime && (debugTask = previousRenderStartTime) : debugTask = previousRenderStartTime, 0 < isPingedUpdate ? isPingedUpdate > debugTask && (isPingedUpdate = debugTask) : isPingedUpdate = debugTask, debugTask > isPingedUpdate && eventTime !== null && (color$jscomp$0 = eventType ? "secondary-light" : "warning", endTime ? endTime.run(console.timeStamp.bind(console, eventType ? "Consecutive" : "Event: " + eventTime, isPingedUpdate, debugTask, currentTrack, "Scheduler \u269B", color$jscomp$0)) : console.timeStamp(eventType ? "Consecutive" : "Event: " + eventTime, isPingedUpdate, debugTask, currentTrack, "Scheduler \u269B", color$jscomp$0)), previousRenderStartTime > debugTask && (endTime ? endTime.run(console.timeStamp.bind(console, "Action", debugTask, previousRenderStartTime, currentTrack, "Scheduler \u269B", "primary-dark")) : console.timeStamp("Action", debugTask, previousRenderStartTime, currentTrack, "Scheduler \u269B", "primary-dark")), color > previousRenderStartTime && (debugTask = eventIsRepeat ? "Promise Resolved" : 5 < color - previousRenderStartTime ? "Update Blocked" : "Update", isPingedUpdate = [], isSpawnedUpdate != null && isPingedUpdate.push(["Component name", isSpawnedUpdate]), label != null && isPingedUpdate.push(["Method name", label]), previousRenderStartTime = {
        start: previousRenderStartTime,
        end: color,
        detail: {
          devtools: {
            properties: isPingedUpdate,
            track: currentTrack,
            trackGroup: "Scheduler \u269B",
            color: "primary-light"
          }
        }
      }, endTime ? endTime.run(performance.measure.bind(performance, debugTask, previousRenderStartTime)) : performance.measure(debugTask, previousRenderStartTime))), transitionUpdateTime = transitionStartTime = -1.1, transitionUpdateType = 0, transitionSuspendedTime = -1.1, transitionEventRepeatTime = transitionEventTime, transitionEventTime = -1.1, transitionClampTime = now2()), previousRenderStartTime = root2.timeoutHandle, previousRenderStartTime !== noTimeout && (root2.timeoutHandle = noTimeout, cancelTimeout(previousRenderStartTime)), previousRenderStartTime = root2.cancelPendingCommit, previousRenderStartTime !== null && (root2.cancelPendingCommit = null, previousRenderStartTime()), pendingEffectsLanes = 0, resetWorkInProgressStack(), workInProgressRoot = root2, workInProgress = previousRenderStartTime = createWorkInProgress(root2.current, null), workInProgressRootRenderLanes = lanes, workInProgressSuspendedReason = NotSuspended, workInProgressThrownValue = null, workInProgressRootDidSkipSuspendedSiblings = !1, workInProgressRootIsPrerendering = checkIfRootIsPrerendering(root2, lanes), workInProgressRootDidAttachPingListener = !1, workInProgressRootExitStatus = RootInProgress, workInProgressSuspendedRetryLanes = workInProgressDeferredLane = workInProgressRootPingedLanes = workInProgressRootInterleavedUpdatedLanes = workInProgressRootSkippedLanes = 0, workInProgressRootRecoverableErrors = workInProgressRootConcurrentErrors = null, workInProgressRootDidIncludeRecursiveRenderUpdate = !1, (lanes & 8) !== 0 && (lanes |= lanes & 32), endTime = root2.entangledLanes, endTime !== 0)
        for (root2 = root2.entanglements, endTime &= lanes;0 < endTime; )
          debugTask = 31 - clz32(endTime), color = 1 << debugTask, lanes |= root2[debugTask], endTime &= ~color;
      return entangledRenderLanes = lanes, finishQueueingConcurrentUpdates(), root2 = getCurrentTime(), 1000 < root2 - lastResetTime && (ReactSharedInternals.recentlyCreatedOwnerStacks = 0, lastResetTime = root2), ReactStrictModeWarnings.discardPendingWarnings(), previousRenderStartTime;
    }
    function handleThrow(root2, thrownValue) {
      currentlyRenderingFiber = null, ReactSharedInternals.H = ContextOnlyDispatcher, ReactSharedInternals.getCurrentStack = null, isRendering = !1, current = null, thrownValue === SuspenseException || thrownValue === SuspenseActionException ? (thrownValue = getSuspendedThenable(), workInProgressSuspendedReason = SuspendedOnImmediate) : thrownValue === SuspenseyCommitException ? (thrownValue = getSuspendedThenable(), workInProgressSuspendedReason = SuspendedOnInstance) : workInProgressSuspendedReason = thrownValue === SelectiveHydrationException ? SuspendedOnHydration : thrownValue !== null && typeof thrownValue === "object" && typeof thrownValue.then === "function" ? SuspendedOnDeprecatedThrowPromise : SuspendedOnError, workInProgressThrownValue = thrownValue;
      var erroredWork = workInProgress;
      erroredWork === null ? (workInProgressRootExitStatus = RootFatalErrored, logUncaughtError(root2, createCapturedValueAtFiber(thrownValue, root2.current))) : erroredWork.mode & 2 && stopProfilerTimerIfRunningAndRecordDuration(erroredWork);
    }
    function shouldRemainOnPreviousScreen() {
      var handler = suspenseHandlerStackCursor.current;
      return handler === null ? !0 : (workInProgressRootRenderLanes & 4194048) === workInProgressRootRenderLanes ? shellBoundary === null ? !0 : !1 : (workInProgressRootRenderLanes & 62914560) === workInProgressRootRenderLanes || (workInProgressRootRenderLanes & 536870912) !== 0 ? handler === shellBoundary : !1;
    }
    function pushDispatcher() {
      var prevDispatcher = ReactSharedInternals.H;
      return ReactSharedInternals.H = ContextOnlyDispatcher, prevDispatcher === null ? ContextOnlyDispatcher : prevDispatcher;
    }
    function pushAsyncDispatcher() {
      var prevAsyncDispatcher = ReactSharedInternals.A;
      return ReactSharedInternals.A = DefaultAsyncDispatcher, prevAsyncDispatcher;
    }
    function markRenderDerivedCause(fiber) {
      workInProgressUpdateTask === null && (workInProgressUpdateTask = fiber._debugTask == null ? null : fiber._debugTask);
    }
    function renderDidSuspendDelayIfPossible() {
      workInProgressRootExitStatus = RootSuspendedWithDelay, workInProgressRootDidSkipSuspendedSiblings || (workInProgressRootRenderLanes & 4194048) !== workInProgressRootRenderLanes && suspenseHandlerStackCursor.current !== null || (workInProgressRootIsPrerendering = !0), (workInProgressRootSkippedLanes & 134217727) === 0 && (workInProgressRootInterleavedUpdatedLanes & 134217727) === 0 || workInProgressRoot === null || markRootSuspended(workInProgressRoot, workInProgressRootRenderLanes, workInProgressDeferredLane, !1);
    }
    function renderRootSync(root2, lanes, shouldYieldForPrerendering) {
      var prevExecutionContext = executionContext;
      executionContext |= RenderContext;
      var prevDispatcher = pushDispatcher(), prevAsyncDispatcher = pushAsyncDispatcher();
      if (workInProgressRoot !== root2 || workInProgressRootRenderLanes !== lanes) {
        if (isDevToolsPresent) {
          var memoizedUpdaters = root2.memoizedUpdaters;
          0 < memoizedUpdaters.size && (restorePendingUpdaters(root2, workInProgressRootRenderLanes), memoizedUpdaters.clear()), movePendingFibersToMemoized(root2, lanes);
        }
        workInProgressTransitions = null, prepareFreshStack(root2, lanes);
      }
      lanes = !1, memoizedUpdaters = workInProgressRootExitStatus;
      a:
        do
          try {
            if (workInProgressSuspendedReason !== NotSuspended && workInProgress !== null) {
              var unitOfWork = workInProgress, thrownValue = workInProgressThrownValue;
              switch (workInProgressSuspendedReason) {
                case SuspendedOnHydration:
                  resetWorkInProgressStack(), memoizedUpdaters = RootSuspendedAtTheShell;
                  break a;
                case SuspendedOnImmediate:
                case SuspendedOnData:
                case SuspendedOnAction:
                case SuspendedOnDeprecatedThrowPromise:
                  suspenseHandlerStackCursor.current === null && (lanes = !0);
                  var reason = workInProgressSuspendedReason;
                  if (workInProgressSuspendedReason = NotSuspended, workInProgressThrownValue = null, throwAndUnwindWorkLoop(root2, unitOfWork, thrownValue, reason), shouldYieldForPrerendering && workInProgressRootIsPrerendering) {
                    memoizedUpdaters = RootInProgress;
                    break a;
                  }
                  break;
                default:
                  reason = workInProgressSuspendedReason, workInProgressSuspendedReason = NotSuspended, workInProgressThrownValue = null, throwAndUnwindWorkLoop(root2, unitOfWork, thrownValue, reason);
              }
            }
            workLoopSync(), memoizedUpdaters = workInProgressRootExitStatus;
            break;
          } catch (thrownValue$4) {
            handleThrow(root2, thrownValue$4);
          }
        while (1);
      return lanes && root2.shellSuspendCounter++, resetContextDependencies(), executionContext = prevExecutionContext, ReactSharedInternals.H = prevDispatcher, ReactSharedInternals.A = prevAsyncDispatcher, workInProgress === null && (workInProgressRoot = null, workInProgressRootRenderLanes = 0, finishQueueingConcurrentUpdates()), memoizedUpdaters;
    }
    function workLoopSync() {
      for (;workInProgress !== null; )
        performUnitOfWork(workInProgress);
    }
    function renderRootConcurrent(root2, lanes) {
      var prevExecutionContext = executionContext;
      executionContext |= RenderContext;
      var prevDispatcher = pushDispatcher(), prevAsyncDispatcher = pushAsyncDispatcher();
      if (workInProgressRoot !== root2 || workInProgressRootRenderLanes !== lanes) {
        if (isDevToolsPresent) {
          var memoizedUpdaters = root2.memoizedUpdaters;
          0 < memoizedUpdaters.size && (restorePendingUpdaters(root2, workInProgressRootRenderLanes), memoizedUpdaters.clear()), movePendingFibersToMemoized(root2, lanes);
        }
        workInProgressTransitions = null, workInProgressRootRenderTargetTime = now$1() + RENDER_TIMEOUT_MS, prepareFreshStack(root2, lanes);
      } else
        workInProgressRootIsPrerendering = checkIfRootIsPrerendering(root2, lanes);
      a:
        do
          try {
            if (workInProgressSuspendedReason !== NotSuspended && workInProgress !== null)
              b:
                switch (lanes = workInProgress, memoizedUpdaters = workInProgressThrownValue, workInProgressSuspendedReason) {
                  case SuspendedOnError:
                    workInProgressSuspendedReason = NotSuspended, workInProgressThrownValue = null, throwAndUnwindWorkLoop(root2, lanes, memoizedUpdaters, SuspendedOnError);
                    break;
                  case SuspendedOnData:
                  case SuspendedOnAction:
                    if (isThenableResolved(memoizedUpdaters)) {
                      workInProgressSuspendedReason = NotSuspended, workInProgressThrownValue = null, replaySuspendedUnitOfWork(lanes);
                      break;
                    }
                    lanes = function() {
                      workInProgressSuspendedReason !== SuspendedOnData && workInProgressSuspendedReason !== SuspendedOnAction || workInProgressRoot !== root2 || (workInProgressSuspendedReason = SuspendedAndReadyToContinue), ensureRootIsScheduled(root2);
                    }, memoizedUpdaters.then(lanes, lanes);
                    break a;
                  case SuspendedOnImmediate:
                    workInProgressSuspendedReason = SuspendedAndReadyToContinue;
                    break a;
                  case SuspendedOnInstance:
                    workInProgressSuspendedReason = SuspendedOnInstanceAndReadyToContinue;
                    break a;
                  case SuspendedAndReadyToContinue:
                    isThenableResolved(memoizedUpdaters) ? (workInProgressSuspendedReason = NotSuspended, workInProgressThrownValue = null, replaySuspendedUnitOfWork(lanes)) : (workInProgressSuspendedReason = NotSuspended, workInProgressThrownValue = null, throwAndUnwindWorkLoop(root2, lanes, memoizedUpdaters, SuspendedAndReadyToContinue));
                    break;
                  case SuspendedOnInstanceAndReadyToContinue:
                    var resource = null;
                    switch (workInProgress.tag) {
                      case 26:
                        resource = workInProgress.memoizedState;
                      case 5:
                      case 27:
                        var hostFiber = workInProgress, type = hostFiber.type, props = hostFiber.pendingProps;
                        if (resource ? preloadResource(resource) : preloadInstance(hostFiber.stateNode, type, props)) {
                          workInProgressSuspendedReason = NotSuspended, workInProgressThrownValue = null;
                          var sibling = hostFiber.sibling;
                          if (sibling !== null)
                            workInProgress = sibling;
                          else {
                            var returnFiber = hostFiber.return;
                            returnFiber !== null ? (workInProgress = returnFiber, completeUnitOfWork(returnFiber)) : workInProgress = null;
                          }
                          break b;
                        }
                        break;
                      default:
                        console.error("Unexpected type of fiber triggered a suspensey commit. This is a bug in React.");
                    }
                    workInProgressSuspendedReason = NotSuspended, workInProgressThrownValue = null, throwAndUnwindWorkLoop(root2, lanes, memoizedUpdaters, SuspendedOnInstanceAndReadyToContinue);
                    break;
                  case SuspendedOnDeprecatedThrowPromise:
                    workInProgressSuspendedReason = NotSuspended, workInProgressThrownValue = null, throwAndUnwindWorkLoop(root2, lanes, memoizedUpdaters, SuspendedOnDeprecatedThrowPromise);
                    break;
                  case SuspendedOnHydration:
                    resetWorkInProgressStack(), workInProgressRootExitStatus = RootSuspendedAtTheShell;
                    break a;
                  default:
                    throw Error("Unexpected SuspendedReason. This is a bug in React.");
                }
            ReactSharedInternals.actQueue !== null ? workLoopSync() : workLoopConcurrentByScheduler();
            break;
          } catch (thrownValue$5) {
            handleThrow(root2, thrownValue$5);
          }
        while (1);
      if (resetContextDependencies(), ReactSharedInternals.H = prevDispatcher, ReactSharedInternals.A = prevAsyncDispatcher, executionContext = prevExecutionContext, workInProgress !== null)
        return RootInProgress;
      return workInProgressRoot = null, workInProgressRootRenderLanes = 0, finishQueueingConcurrentUpdates(), workInProgressRootExitStatus;
    }
    function workLoopConcurrentByScheduler() {
      for (;workInProgress !== null && !shouldYield(); )
        performUnitOfWork(workInProgress);
    }
    function performUnitOfWork(unitOfWork) {
      var current2 = unitOfWork.alternate;
      (unitOfWork.mode & 2) !== NoMode ? (startProfilerTimer(unitOfWork), current2 = runWithFiberInDEV(unitOfWork, beginWork, current2, unitOfWork, entangledRenderLanes), stopProfilerTimerIfRunningAndRecordDuration(unitOfWork)) : current2 = runWithFiberInDEV(unitOfWork, beginWork, current2, unitOfWork, entangledRenderLanes), unitOfWork.memoizedProps = unitOfWork.pendingProps, current2 === null ? completeUnitOfWork(unitOfWork) : workInProgress = current2;
    }
    function replaySuspendedUnitOfWork(unitOfWork) {
      var next = runWithFiberInDEV(unitOfWork, replayBeginWork, unitOfWork);
      unitOfWork.memoizedProps = unitOfWork.pendingProps, next === null ? completeUnitOfWork(unitOfWork) : workInProgress = next;
    }
    function replayBeginWork(unitOfWork) {
      var current2 = unitOfWork.alternate, isProfilingMode = (unitOfWork.mode & 2) !== NoMode;
      switch (isProfilingMode && startProfilerTimer(unitOfWork), unitOfWork.tag) {
        case 15:
        case 0:
          current2 = replayFunctionComponent(current2, unitOfWork, unitOfWork.pendingProps, unitOfWork.type, void 0, workInProgressRootRenderLanes);
          break;
        case 11:
          current2 = replayFunctionComponent(current2, unitOfWork, unitOfWork.pendingProps, unitOfWork.type.render, unitOfWork.ref, workInProgressRootRenderLanes);
          break;
        case 5:
          resetHooksOnUnwind(unitOfWork);
        default:
          unwindInterruptedWork(current2, unitOfWork), unitOfWork = workInProgress = resetWorkInProgress(unitOfWork, entangledRenderLanes), current2 = beginWork(current2, unitOfWork, entangledRenderLanes);
      }
      return isProfilingMode && stopProfilerTimerIfRunningAndRecordDuration(unitOfWork), current2;
    }
    function throwAndUnwindWorkLoop(root2, unitOfWork, thrownValue, suspendedReason) {
      resetContextDependencies(), resetHooksOnUnwind(unitOfWork), thenableState$1 = null, thenableIndexCounter$1 = 0;
      var returnFiber = unitOfWork.return;
      try {
        if (throwException(root2, returnFiber, unitOfWork, thrownValue, workInProgressRootRenderLanes)) {
          workInProgressRootExitStatus = RootFatalErrored, logUncaughtError(root2, createCapturedValueAtFiber(thrownValue, root2.current)), workInProgress = null;
          return;
        }
      } catch (error44) {
        if (returnFiber !== null)
          throw workInProgress = returnFiber, error44;
        workInProgressRootExitStatus = RootFatalErrored, logUncaughtError(root2, createCapturedValueAtFiber(thrownValue, root2.current)), workInProgress = null;
        return;
      }
      if (unitOfWork.flags & 32768) {
        if (isHydrating || suspendedReason === SuspendedOnError)
          root2 = !0;
        else if (workInProgressRootIsPrerendering || (workInProgressRootRenderLanes & 536870912) !== 0)
          root2 = !1;
        else if (workInProgressRootDidSkipSuspendedSiblings = root2 = !0, suspendedReason === SuspendedOnData || suspendedReason === SuspendedOnAction || suspendedReason === SuspendedOnImmediate || suspendedReason === SuspendedOnDeprecatedThrowPromise)
          suspendedReason = suspenseHandlerStackCursor.current, suspendedReason !== null && suspendedReason.tag === 13 && (suspendedReason.flags |= 16384);
        unwindUnitOfWork(unitOfWork, root2);
      } else
        completeUnitOfWork(unitOfWork);
    }
    function completeUnitOfWork(unitOfWork) {
      var completedWork = unitOfWork;
      do {
        if ((completedWork.flags & 32768) !== 0) {
          unwindUnitOfWork(completedWork, workInProgressRootDidSkipSuspendedSiblings);
          return;
        }
        var current2 = completedWork.alternate;
        if (unitOfWork = completedWork.return, startProfilerTimer(completedWork), current2 = runWithFiberInDEV(completedWork, completeWork, current2, completedWork, entangledRenderLanes), (completedWork.mode & 2) !== NoMode && stopProfilerTimerIfRunningAndRecordIncompleteDuration(completedWork), current2 !== null) {
          workInProgress = current2;
          return;
        }
        if (completedWork = completedWork.sibling, completedWork !== null) {
          workInProgress = completedWork;
          return;
        }
        workInProgress = completedWork = unitOfWork;
      } while (completedWork !== null);
      workInProgressRootExitStatus === RootInProgress && (workInProgressRootExitStatus = RootCompleted);
    }
    function unwindUnitOfWork(unitOfWork, skipSiblings) {
      do {
        var next = unwindWork(unitOfWork.alternate, unitOfWork);
        if (next !== null) {
          next.flags &= 32767, workInProgress = next;
          return;
        }
        if ((unitOfWork.mode & 2) !== NoMode) {
          stopProfilerTimerIfRunningAndRecordIncompleteDuration(unitOfWork), next = unitOfWork.actualDuration;
          for (var child = unitOfWork.child;child !== null; )
            next += child.actualDuration, child = child.sibling;
          unitOfWork.actualDuration = next;
        }
        if (next = unitOfWork.return, next !== null && (next.flags |= 32768, next.subtreeFlags = 0, next.deletions = null), !skipSiblings && (unitOfWork = unitOfWork.sibling, unitOfWork !== null)) {
          workInProgress = unitOfWork;
          return;
        }
        workInProgress = unitOfWork = next;
      } while (unitOfWork !== null);
      workInProgressRootExitStatus = RootSuspendedAtTheShell, workInProgress = null;
    }
    function commitRoot(root2, finishedWork, lanes, recoverableErrors, transitions, didIncludeRenderPhaseUpdate, spawnedLane, updatedLanes, suspendedRetryLanes, exitStatus, suspendedState, suspendedCommitReason, completedRenderStartTime, completedRenderEndTime) {
      root2.cancelPendingCommit = null;
      do
        flushPendingEffects();
      while (pendingEffectsStatus !== NO_PENDING_EFFECTS);
      if (ReactStrictModeWarnings.flushLegacyContextWarning(), ReactStrictModeWarnings.flushPendingUnsafeLifecycleWarnings(), (executionContext & (RenderContext | CommitContext)) !== NoContext)
        throw Error("Should not already be working.");
      if (setCurrentTrackFromLanes(lanes), exitStatus === RootErrored ? logErroredRenderPhase(completedRenderStartTime, completedRenderEndTime, lanes, workInProgressUpdateTask) : recoverableErrors !== null ? logRecoveredRenderPhase(completedRenderStartTime, completedRenderEndTime, lanes, recoverableErrors, finishedWork !== null && finishedWork.alternate !== null && finishedWork.alternate.memoizedState.isDehydrated && (finishedWork.flags & 256) !== 0, workInProgressUpdateTask) : logRenderPhase(completedRenderStartTime, completedRenderEndTime, lanes, workInProgressUpdateTask), finishedWork !== null) {
        if (lanes === 0 && console.error("finishedLanes should not be empty during a commit. This is a bug in React."), finishedWork === root2.current)
          throw Error("Cannot commit the same tree as before. This error is likely caused by a bug in React. Please file an issue.");
        if (didIncludeRenderPhaseUpdate = finishedWork.lanes | finishedWork.childLanes, didIncludeRenderPhaseUpdate |= concurrentlyUpdatedLanes, markRootFinished(root2, lanes, didIncludeRenderPhaseUpdate, spawnedLane, updatedLanes, suspendedRetryLanes), root2 === workInProgressRoot && (workInProgress = workInProgressRoot = null, workInProgressRootRenderLanes = 0), pendingFinishedWork = finishedWork, pendingEffectsRoot = root2, pendingEffectsLanes = lanes, pendingEffectsRemainingLanes = didIncludeRenderPhaseUpdate, pendingPassiveTransitions = transitions, pendingRecoverableErrors = recoverableErrors, pendingEffectsRenderEndTime = completedRenderEndTime, pendingSuspendedCommitReason = suspendedCommitReason, pendingDelayedCommitReason = IMMEDIATE_COMMIT, pendingSuspendedViewTransitionReason = null, finishedWork.actualDuration !== 0 || (finishedWork.subtreeFlags & 10256) !== 0 || (finishedWork.flags & 10256) !== 0 ? (root2.callbackNode = null, root2.callbackPriority = 0, scheduleCallback(NormalPriority$1, function() {
          return trackSchedulerEvent(), pendingDelayedCommitReason === IMMEDIATE_COMMIT && (pendingDelayedCommitReason = DELAYED_PASSIVE_COMMIT), flushPassiveEffects(), null;
        })) : (root2.callbackNode = null, root2.callbackPriority = 0), commitErrors = null, commitStartTime = now2(), suspendedCommitReason !== null && logSuspendedCommitPhase(completedRenderEndTime, commitStartTime, suspendedCommitReason, workInProgressUpdateTask), recoverableErrors = (finishedWork.flags & 13878) !== 0, (finishedWork.subtreeFlags & 13878) !== 0 || recoverableErrors) {
          recoverableErrors = ReactSharedInternals.T, ReactSharedInternals.T = null, transitions = getCurrentUpdatePriority(), setCurrentUpdatePriority(2), spawnedLane = executionContext, executionContext |= CommitContext;
          try {
            commitBeforeMutationEffects(root2, finishedWork, lanes);
          } finally {
            executionContext = spawnedLane, setCurrentUpdatePriority(transitions), ReactSharedInternals.T = recoverableErrors;
          }
        }
        pendingEffectsStatus = PENDING_MUTATION_PHASE, flushMutationEffects(), flushLayoutEffects(), flushSpawnedWork();
      }
    }
    function flushMutationEffects() {
      if (pendingEffectsStatus === PENDING_MUTATION_PHASE) {
        pendingEffectsStatus = NO_PENDING_EFFECTS;
        var root2 = pendingEffectsRoot, finishedWork = pendingFinishedWork, lanes = pendingEffectsLanes, rootMutationHasEffect = (finishedWork.flags & 13878) !== 0;
        if ((finishedWork.subtreeFlags & 13878) !== 0 || rootMutationHasEffect) {
          rootMutationHasEffect = ReactSharedInternals.T, ReactSharedInternals.T = null;
          var previousPriority = getCurrentUpdatePriority();
          setCurrentUpdatePriority(2);
          var prevExecutionContext = executionContext;
          executionContext |= CommitContext;
          try {
            inProgressLanes = lanes, inProgressRoot = root2, resetComponentEffectTimers(), commitMutationEffectsOnFiber(finishedWork, root2), inProgressRoot = inProgressLanes = null, resetAfterCommit(root2.containerInfo);
          } finally {
            executionContext = prevExecutionContext, setCurrentUpdatePriority(previousPriority), ReactSharedInternals.T = rootMutationHasEffect;
          }
        }
        root2.current = finishedWork, pendingEffectsStatus = PENDING_LAYOUT_PHASE;
      }
    }
    function flushLayoutEffects() {
      if (pendingEffectsStatus === PENDING_LAYOUT_PHASE) {
        pendingEffectsStatus = NO_PENDING_EFFECTS;
        var suspendedViewTransitionReason = pendingSuspendedViewTransitionReason;
        if (suspendedViewTransitionReason !== null) {
          commitStartTime = now2();
          var startTime = commitEndTime, endTime = commitStartTime;
          !supportsUserTiming || endTime <= startTime || (animatingTask ? animatingTask.run(console.timeStamp.bind(console, suspendedViewTransitionReason, startTime, endTime, currentTrack, "Scheduler \u269B", "secondary-light")) : console.timeStamp(suspendedViewTransitionReason, startTime, endTime, currentTrack, "Scheduler \u269B", "secondary-light"));
        }
        suspendedViewTransitionReason = pendingEffectsRoot, startTime = pendingFinishedWork, endTime = pendingEffectsLanes;
        var rootHasLayoutEffect = (startTime.flags & 8772) !== 0;
        if ((startTime.subtreeFlags & 8772) !== 0 || rootHasLayoutEffect) {
          rootHasLayoutEffect = ReactSharedInternals.T, ReactSharedInternals.T = null;
          var _previousPriority = getCurrentUpdatePriority();
          setCurrentUpdatePriority(2);
          var _prevExecutionContext = executionContext;
          executionContext |= CommitContext;
          try {
            inProgressLanes = endTime, inProgressRoot = suspendedViewTransitionReason, resetComponentEffectTimers(), commitLayoutEffectOnFiber(suspendedViewTransitionReason, startTime.alternate, startTime), inProgressRoot = inProgressLanes = null;
          } finally {
            executionContext = _prevExecutionContext, setCurrentUpdatePriority(_previousPriority), ReactSharedInternals.T = rootHasLayoutEffect;
          }
        }
        suspendedViewTransitionReason = pendingEffectsRenderEndTime, startTime = pendingSuspendedCommitReason, commitEndTime = now2(), suspendedViewTransitionReason = startTime === null ? suspendedViewTransitionReason : commitStartTime, startTime = commitEndTime, endTime = pendingDelayedCommitReason === ABORTED_VIEW_TRANSITION_COMMIT, rootHasLayoutEffect = workInProgressUpdateTask, commitErrors !== null ? logCommitErrored(suspendedViewTransitionReason, startTime, commitErrors, !1, rootHasLayoutEffect) : !supportsUserTiming || startTime <= suspendedViewTransitionReason || (rootHasLayoutEffect ? rootHasLayoutEffect.run(console.timeStamp.bind(console, endTime ? "Commit Interrupted View Transition" : "Commit", suspendedViewTransitionReason, startTime, currentTrack, "Scheduler \u269B", endTime ? "error" : "secondary-dark")) : console.timeStamp(endTime ? "Commit Interrupted View Transition" : "Commit", suspendedViewTransitionReason, startTime, currentTrack, "Scheduler \u269B", endTime ? "error" : "secondary-dark")), pendingEffectsStatus = PENDING_AFTER_MUTATION_PHASE;
      }
    }
    function flushSpawnedWork() {
      if (pendingEffectsStatus === PENDING_SPAWNED_WORK || pendingEffectsStatus === PENDING_AFTER_MUTATION_PHASE) {
        if (pendingEffectsStatus === PENDING_SPAWNED_WORK) {
          var startViewTransitionStartTime = commitEndTime;
          commitEndTime = now2();
          var endTime = commitEndTime, abortedViewTransition = pendingDelayedCommitReason === ABORTED_VIEW_TRANSITION_COMMIT;
          !supportsUserTiming || endTime <= startViewTransitionStartTime || (animatingTask ? animatingTask.run(console.timeStamp.bind(console, abortedViewTransition ? "Interrupted View Transition" : "Starting Animation", startViewTransitionStartTime, endTime, currentTrack, "Scheduler \u269B", abortedViewTransition ? "error" : "secondary-light")) : console.timeStamp(abortedViewTransition ? "Interrupted View Transition" : "Starting Animation", startViewTransitionStartTime, endTime, currentTrack, "Scheduler \u269B", abortedViewTransition ? " error" : "secondary-light")), pendingDelayedCommitReason !== ABORTED_VIEW_TRANSITION_COMMIT && (pendingDelayedCommitReason = ANIMATION_STARTED_COMMIT);
        }
        pendingEffectsStatus = NO_PENDING_EFFECTS, requestPaint(), startViewTransitionStartTime = pendingEffectsRoot;
        var finishedWork = pendingFinishedWork;
        endTime = pendingEffectsLanes, abortedViewTransition = pendingRecoverableErrors;
        var rootDidHavePassiveEffects = finishedWork.actualDuration !== 0 || (finishedWork.subtreeFlags & 10256) !== 0 || (finishedWork.flags & 10256) !== 0;
        rootDidHavePassiveEffects ? pendingEffectsStatus = PENDING_PASSIVE_PHASE : (pendingEffectsStatus = NO_PENDING_EFFECTS, pendingFinishedWork = pendingEffectsRoot = null, releaseRootPooledCache(startViewTransitionStartTime, startViewTransitionStartTime.pendingLanes), nestedPassiveUpdateCount = 0, rootWithPassiveNestedUpdates = null);
        var remainingLanes = startViewTransitionStartTime.pendingLanes;
        if (remainingLanes === 0 && (legacyErrorBoundariesThatAlreadyFailed = null), rootDidHavePassiveEffects || commitDoubleInvokeEffectsInDEV(startViewTransitionStartTime), remainingLanes = lanesToEventPriority(endTime), finishedWork = finishedWork.stateNode, injectedHook && typeof injectedHook.onCommitFiberRoot === "function")
          try {
            var didError = (finishedWork.current.flags & 128) === 128;
            switch (remainingLanes) {
              case 2:
                var schedulerPriority = ImmediatePriority;
                break;
              case 8:
                schedulerPriority = UserBlockingPriority;
                break;
              case 32:
                schedulerPriority = NormalPriority$1;
                break;
              case 268435456:
                schedulerPriority = IdlePriority;
                break;
              default:
                schedulerPriority = NormalPriority$1;
            }
            injectedHook.onCommitFiberRoot(rendererID, finishedWork, schedulerPriority, didError);
          } catch (err) {
            hasLoggedError || (hasLoggedError = !0, console.error("React instrumentation encountered an error: %o", err));
          }
        if (isDevToolsPresent && startViewTransitionStartTime.memoizedUpdaters.clear(), onCommitRoot(), abortedViewTransition !== null) {
          didError = ReactSharedInternals.T, schedulerPriority = getCurrentUpdatePriority(), setCurrentUpdatePriority(2), ReactSharedInternals.T = null;
          try {
            var onRecoverableError = startViewTransitionStartTime.onRecoverableError;
            for (finishedWork = 0;finishedWork < abortedViewTransition.length; finishedWork++) {
              var recoverableError = abortedViewTransition[finishedWork], errorInfo = makeErrorInfo(recoverableError.stack);
              runWithFiberInDEV(recoverableError.source, onRecoverableError, recoverableError.value, errorInfo);
            }
          } finally {
            ReactSharedInternals.T = didError, setCurrentUpdatePriority(schedulerPriority);
          }
        }
        (pendingEffectsLanes & 3) !== 0 && flushPendingEffects(), ensureRootIsScheduled(startViewTransitionStartTime), remainingLanes = startViewTransitionStartTime.pendingLanes, (endTime & 261930) !== 0 && (remainingLanes & 42) !== 0 ? (nestedUpdateScheduled = !0, startViewTransitionStartTime === rootWithNestedUpdates ? nestedUpdateCount++ : (nestedUpdateCount = 0, rootWithNestedUpdates = startViewTransitionStartTime)) : nestedUpdateCount = 0, rootDidHavePassiveEffects || finalizeRender(endTime, commitEndTime), supportsHydration && flushHydrationEvents(), flushSyncWorkAcrossRoots_impl(0, !1);
      }
    }
    function makeErrorInfo(componentStack) {
      return componentStack = { componentStack }, Object.defineProperty(componentStack, "digest", {
        get: function() {
          console.error('You are accessing "digest" from the errorInfo object passed to onRecoverableError. This property is no longer provided as part of errorInfo but can be accessed as a property of the Error instance itself.');
        }
      }), componentStack;
    }
    function releaseRootPooledCache(root2, remainingLanes) {
      (root2.pooledCacheLanes &= remainingLanes) === 0 && (remainingLanes = root2.pooledCache, remainingLanes != null && (root2.pooledCache = null, releaseCache(remainingLanes)));
    }
    function flushPendingEffects() {
      return flushMutationEffects(), flushLayoutEffects(), flushSpawnedWork(), flushPassiveEffects();
    }
    function flushPassiveEffects() {
      if (pendingEffectsStatus !== PENDING_PASSIVE_PHASE)
        return !1;
      var root2 = pendingEffectsRoot, remainingLanes = pendingEffectsRemainingLanes;
      pendingEffectsRemainingLanes = 0;
      var renderPriority = lanesToEventPriority(pendingEffectsLanes), priority = 32 > renderPriority ? 32 : renderPriority;
      renderPriority = ReactSharedInternals.T;
      var previousPriority = getCurrentUpdatePriority();
      try {
        setCurrentUpdatePriority(priority), ReactSharedInternals.T = null;
        var transitions = pendingPassiveTransitions;
        pendingPassiveTransitions = null, priority = pendingEffectsRoot;
        var lanes = pendingEffectsLanes;
        if (pendingEffectsStatus = NO_PENDING_EFFECTS, pendingFinishedWork = pendingEffectsRoot = null, pendingEffectsLanes = 0, (executionContext & (RenderContext | CommitContext)) !== NoContext)
          throw Error("Cannot flush passive effects while already rendering.");
        setCurrentTrackFromLanes(lanes), isFlushingPassiveEffects = !0, didScheduleUpdateDuringPassiveEffects = !1;
        var passiveEffectStartTime = 0;
        if (commitErrors = null, passiveEffectStartTime = now$1(), pendingDelayedCommitReason === ANIMATION_STARTED_COMMIT) {
          var startTime = commitEndTime, endTime = passiveEffectStartTime;
          !supportsUserTiming || endTime <= startTime || (animatingTask ? animatingTask.run(console.timeStamp.bind(console, "Animating", startTime, endTime, currentTrack, "Scheduler \u269B", "secondary-dark")) : console.timeStamp("Animating", startTime, endTime, currentTrack, "Scheduler \u269B", "secondary-dark"));
        } else {
          startTime = commitEndTime, endTime = passiveEffectStartTime;
          var delayedUntilPaint = pendingDelayedCommitReason === DELAYED_PASSIVE_COMMIT;
          !supportsUserTiming || endTime <= startTime || (workInProgressUpdateTask ? workInProgressUpdateTask.run(console.timeStamp.bind(console, delayedUntilPaint ? "Waiting for Paint" : "Waiting", startTime, endTime, currentTrack, "Scheduler \u269B", "secondary-light")) : console.timeStamp(delayedUntilPaint ? "Waiting for Paint" : "Waiting", startTime, endTime, currentTrack, "Scheduler \u269B", "secondary-light"));
        }
        startTime = executionContext, executionContext |= CommitContext;
        var finishedWork = priority.current;
        resetComponentEffectTimers(), commitPassiveUnmountOnFiber(finishedWork);
        var finishedWork$jscomp$0 = priority.current;
        finishedWork = pendingEffectsRenderEndTime, resetComponentEffectTimers(), commitPassiveMountOnFiber(priority, finishedWork$jscomp$0, lanes, transitions, finishedWork), commitDoubleInvokeEffectsInDEV(priority), executionContext = startTime;
        var passiveEffectsEndTime = now$1();
        if (finishedWork$jscomp$0 = passiveEffectStartTime, finishedWork = workInProgressUpdateTask, commitErrors !== null ? logCommitErrored(finishedWork$jscomp$0, passiveEffectsEndTime, commitErrors, !0, finishedWork) : !supportsUserTiming || passiveEffectsEndTime <= finishedWork$jscomp$0 || (finishedWork ? finishedWork.run(console.timeStamp.bind(console, "Remaining Effects", finishedWork$jscomp$0, passiveEffectsEndTime, currentTrack, "Scheduler \u269B", "secondary-dark")) : console.timeStamp("Remaining Effects", finishedWork$jscomp$0, passiveEffectsEndTime, currentTrack, "Scheduler \u269B", "secondary-dark")), finalizeRender(lanes, passiveEffectsEndTime), flushSyncWorkAcrossRoots_impl(0, !1), didScheduleUpdateDuringPassiveEffects ? priority === rootWithPassiveNestedUpdates ? nestedPassiveUpdateCount++ : (nestedPassiveUpdateCount = 0, rootWithPassiveNestedUpdates = priority) : nestedPassiveUpdateCount = 0, didScheduleUpdateDuringPassiveEffects = isFlushingPassiveEffects = !1, injectedHook && typeof injectedHook.onPostCommitFiberRoot === "function")
          try {
            injectedHook.onPostCommitFiberRoot(rendererID, priority);
          } catch (err) {
            hasLoggedError || (hasLoggedError = !0, console.error("React instrumentation encountered an error: %o", err));
          }
        var stateNode = priority.current.stateNode;
        return stateNode.effectDuration = 0, stateNode.passiveEffectDuration = 0, !0;
      } finally {
        setCurrentUpdatePriority(previousPriority), ReactSharedInternals.T = renderPriority, releaseRootPooledCache(root2, remainingLanes);
      }
    }
    function captureCommitPhaseErrorOnRoot(rootFiber, sourceFiber, error44) {
      sourceFiber = createCapturedValueAtFiber(error44, sourceFiber), recordEffectError(sourceFiber), sourceFiber = createRootErrorUpdate(rootFiber.stateNode, sourceFiber, 2), rootFiber = enqueueUpdate(rootFiber, sourceFiber, 2), rootFiber !== null && (markRootUpdated$1(rootFiber, 2), ensureRootIsScheduled(rootFiber));
    }
    function captureCommitPhaseError(sourceFiber, nearestMountedAncestor, error44) {
      if (isRunningInsertionEffect = !1, sourceFiber.tag === 3)
        captureCommitPhaseErrorOnRoot(sourceFiber, sourceFiber, error44);
      else {
        for (;nearestMountedAncestor !== null; ) {
          if (nearestMountedAncestor.tag === 3) {
            captureCommitPhaseErrorOnRoot(nearestMountedAncestor, sourceFiber, error44);
            return;
          }
          if (nearestMountedAncestor.tag === 1) {
            var instance = nearestMountedAncestor.stateNode;
            if (typeof nearestMountedAncestor.type.getDerivedStateFromError === "function" || typeof instance.componentDidCatch === "function" && (legacyErrorBoundariesThatAlreadyFailed === null || !legacyErrorBoundariesThatAlreadyFailed.has(instance))) {
              sourceFiber = createCapturedValueAtFiber(error44, sourceFiber), recordEffectError(sourceFiber), error44 = createClassErrorUpdate(2), instance = enqueueUpdate(nearestMountedAncestor, error44, 2), instance !== null && (initializeClassErrorUpdate(error44, instance, nearestMountedAncestor, sourceFiber), markRootUpdated$1(instance, 2), ensureRootIsScheduled(instance));
              return;
            }
          }
          nearestMountedAncestor = nearestMountedAncestor.return;
        }
        console.error(`Internal React error: Attempted to capture a commit phase error inside a detached tree. This indicates a bug in React. Potential causes include deleting the same fiber more than once, committing an already-finished tree, or an inconsistent return pointer.

Error message:

%s`, error44);
      }
    }
    function attachPingListener(root2, wakeable, lanes) {
      var pingCache = root2.pingCache;
      if (pingCache === null) {
        pingCache = root2.pingCache = new PossiblyWeakMap;
        var threadIDs = /* @__PURE__ */ new Set;
        pingCache.set(wakeable, threadIDs);
      } else
        threadIDs = pingCache.get(wakeable), threadIDs === void 0 && (threadIDs = /* @__PURE__ */ new Set, pingCache.set(wakeable, threadIDs));
      threadIDs.has(lanes) || (workInProgressRootDidAttachPingListener = !0, threadIDs.add(lanes), pingCache = pingSuspendedRoot.bind(null, root2, wakeable, lanes), isDevToolsPresent && restorePendingUpdaters(root2, lanes), wakeable.then(pingCache, pingCache));
    }
    function pingSuspendedRoot(root2, wakeable, pingedLanes) {
      var pingCache = root2.pingCache;
      pingCache !== null && pingCache.delete(wakeable), root2.pingedLanes |= root2.suspendedLanes & pingedLanes, root2.warmLanes &= ~pingedLanes, (pingedLanes & 127) !== 0 ? 0 > blockingUpdateTime && (blockingClampTime = blockingUpdateTime = now2(), blockingUpdateTask = createTask("Promise Resolved"), blockingUpdateType = 2) : (pingedLanes & 4194048) !== 0 && 0 > transitionUpdateTime && (transitionClampTime = transitionUpdateTime = now2(), transitionUpdateTask = createTask("Promise Resolved"), transitionUpdateType = 2), isConcurrentActEnvironment() && ReactSharedInternals.actQueue === null && console.error(`A suspended resource finished loading inside a test, but the event was not wrapped in act(...).

When testing, code that resolves suspended data should be wrapped into act(...):

act(() => {
  /* finish loading suspended data */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act`), workInProgressRoot === root2 && (workInProgressRootRenderLanes & pingedLanes) === pingedLanes && (workInProgressRootExitStatus === RootSuspendedWithDelay || workInProgressRootExitStatus === RootSuspended && (workInProgressRootRenderLanes & 62914560) === workInProgressRootRenderLanes && now$1() - globalMostRecentFallbackTime < FALLBACK_THROTTLE_MS ? (executionContext & RenderContext) === NoContext && prepareFreshStack(root2, 0) : workInProgressRootPingedLanes |= pingedLanes, workInProgressSuspendedRetryLanes === workInProgressRootRenderLanes && (workInProgressSuspendedRetryLanes = 0)), ensureRootIsScheduled(root2);
    }
    function retryTimedOutBoundary(boundaryFiber, retryLane) {
      retryLane === 0 && (retryLane = claimNextRetryLane()), boundaryFiber = enqueueConcurrentRenderForLane(boundaryFiber, retryLane), boundaryFiber !== null && (markRootUpdated$1(boundaryFiber, retryLane), ensureRootIsScheduled(boundaryFiber));
    }
    function retryDehydratedSuspenseBoundary(boundaryFiber) {
      var suspenseState = boundaryFiber.memoizedState, retryLane = 0;
      suspenseState !== null && (retryLane = suspenseState.retryLane), retryTimedOutBoundary(boundaryFiber, retryLane);
    }
    function resolveRetryWakeable(boundaryFiber, wakeable) {
      var retryLane = 0;
      switch (boundaryFiber.tag) {
        case 31:
        case 13:
          var { stateNode: retryCache, memoizedState: suspenseState } = boundaryFiber;
          suspenseState !== null && (retryLane = suspenseState.retryLane);
          break;
        case 19:
          retryCache = boundaryFiber.stateNode;
          break;
        case 22:
          retryCache = boundaryFiber.stateNode._retryCache;
          break;
        default:
          throw Error("Pinged unknown suspense boundary type. This is probably a bug in React.");
      }
      retryCache !== null && retryCache.delete(wakeable), retryTimedOutBoundary(boundaryFiber, retryLane);
    }
    function recursivelyTraverseAndDoubleInvokeEffectsInDEV(root$jscomp$0, parentFiber, isInStrictMode) {
      if ((parentFiber.subtreeFlags & 67117056) !== 0)
        for (parentFiber = parentFiber.child;parentFiber !== null; ) {
          var root2 = root$jscomp$0, fiber = parentFiber, isStrictModeFiber = fiber.type === REACT_STRICT_MODE_TYPE;
          isStrictModeFiber = isInStrictMode || isStrictModeFiber, fiber.tag !== 22 ? fiber.flags & 67108864 ? isStrictModeFiber && runWithFiberInDEV(fiber, doubleInvokeEffectsOnFiber, root2, fiber) : recursivelyTraverseAndDoubleInvokeEffectsInDEV(root2, fiber, isStrictModeFiber) : fiber.memoizedState === null && (isStrictModeFiber && fiber.flags & 8192 ? runWithFiberInDEV(fiber, doubleInvokeEffectsOnFiber, root2, fiber) : fiber.subtreeFlags & 67108864 && runWithFiberInDEV(fiber, recursivelyTraverseAndDoubleInvokeEffectsInDEV, root2, fiber, isStrictModeFiber)), parentFiber = parentFiber.sibling;
        }
    }
    function doubleInvokeEffectsOnFiber(root2, fiber) {
      setIsStrictModeForDevtools(!0);
      try {
        disappearLayoutEffects(fiber), disconnectPassiveEffect(fiber), reappearLayoutEffects(root2, fiber.alternate, fiber, !1), reconnectPassiveEffects(root2, fiber, 0, null, !1, 0);
      } finally {
        setIsStrictModeForDevtools(!1);
      }
    }
    function commitDoubleInvokeEffectsInDEV(root2) {
      var doubleInvokeEffects = !0;
      root2.current.mode & 24 || (doubleInvokeEffects = !1), recursivelyTraverseAndDoubleInvokeEffectsInDEV(root2, root2.current, doubleInvokeEffects);
    }
    function warnAboutUpdateOnNotYetMountedFiberInDEV(fiber) {
      if ((executionContext & RenderContext) === NoContext) {
        var tag = fiber.tag;
        if (tag === 3 || tag === 1 || tag === 0 || tag === 11 || tag === 14 || tag === 15) {
          if (tag = getComponentNameFromFiber(fiber) || "ReactComponent", didWarnStateUpdateForNotYetMountedComponent !== null) {
            if (didWarnStateUpdateForNotYetMountedComponent.has(tag))
              return;
            didWarnStateUpdateForNotYetMountedComponent.add(tag);
          } else
            didWarnStateUpdateForNotYetMountedComponent = /* @__PURE__ */ new Set([tag]);
          runWithFiberInDEV(fiber, function() {
            console.error("Can't perform a React state update on a component that hasn't mounted yet. This indicates that you have a side-effect in your render function that asynchronously tries to update the component. Move this work to useEffect instead.");
          });
        }
      }
    }
    function restorePendingUpdaters(root2, lanes) {
      isDevToolsPresent && root2.memoizedUpdaters.forEach(function(schedulingFiber) {
        addFiberToLanesMap(root2, schedulingFiber, lanes);
      });
    }
    function scheduleCallback(priorityLevel, callback) {
      var actQueue = ReactSharedInternals.actQueue;
      return actQueue !== null ? (actQueue.push(callback), fakeActCallbackNode) : scheduleCallback$3(priorityLevel, callback);
    }
    function warnIfUpdatesNotWrappedWithActDEV(fiber) {
      isConcurrentActEnvironment() && ReactSharedInternals.actQueue === null && runWithFiberInDEV(fiber, function() {
        console.error(`An update to %s inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act`, getComponentNameFromFiber(fiber));
      });
    }
    function resolveFunctionForHotReloading(type) {
      if (resolveFamily2 === null)
        return type;
      var family = resolveFamily2(type);
      return family === void 0 ? type : family.current;
    }
    function resolveForwardRefForHotReloading(type) {
      if (resolveFamily2 === null)
        return type;
      var family = resolveFamily2(type);
      return family === void 0 ? type !== null && type !== void 0 && typeof type.render === "function" && (family = resolveFunctionForHotReloading(type.render), type.render !== family) ? (family = { $$typeof: REACT_FORWARD_REF_TYPE, render: family }, type.displayName !== void 0 && (family.displayName = type.displayName), family) : type : family.current;
    }
    function isCompatibleFamilyForHotReloading(fiber, element) {
      if (resolveFamily2 === null)
        return !1;
      var prevType = fiber.elementType;
      element = element.type;
      var needsCompareFamilies = !1, $$typeofNextType = typeof element === "object" && element !== null ? element.$$typeof : null;
      switch (fiber.tag) {
        case 1:
          typeof element === "function" && (needsCompareFamilies = !0);
          break;
        case 0:
          typeof element === "function" ? needsCompareFamilies = !0 : $$typeofNextType === REACT_LAZY_TYPE && (needsCompareFamilies = !0);
          break;
        case 11:
          $$typeofNextType === REACT_FORWARD_REF_TYPE ? needsCompareFamilies = !0 : $$typeofNextType === REACT_LAZY_TYPE && (needsCompareFamilies = !0);
          break;
        case 14:
        case 15:
          $$typeofNextType === REACT_MEMO_TYPE ? needsCompareFamilies = !0 : $$typeofNextType === REACT_LAZY_TYPE && (needsCompareFamilies = !0);
          break;
        default:
          return !1;
      }
      return needsCompareFamilies && (fiber = resolveFamily2(prevType), fiber !== void 0 && fiber === resolveFamily2(element)) ? !0 : !1;
    }
    function markFailedErrorBoundaryForHotReloading(fiber) {
      resolveFamily2 !== null && typeof WeakSet === "function" && (failedBoundaries === null && (failedBoundaries = /* @__PURE__ */ new WeakSet), failedBoundaries.add(fiber));
    }
    function scheduleFibersWithFamiliesRecursively(fiber, updatedFamilies, staleFamilies) {
      do {
        var _fiber = fiber, alternate = _fiber.alternate, child = _fiber.child, sibling = _fiber.sibling, tag = _fiber.tag;
        _fiber = _fiber.type;
        var candidateType = null;
        switch (tag) {
          case 0:
          case 15:
          case 1:
            candidateType = _fiber;
            break;
          case 11:
            candidateType = _fiber.render;
        }
        if (resolveFamily2 === null)
          throw Error("Expected resolveFamily to be set during hot reload.");
        var needsRender = !1;
        if (_fiber = !1, candidateType !== null && (candidateType = resolveFamily2(candidateType), candidateType !== void 0 && (staleFamilies.has(candidateType) ? _fiber = !0 : updatedFamilies.has(candidateType) && (tag === 1 ? _fiber = !0 : needsRender = !0))), failedBoundaries !== null && (failedBoundaries.has(fiber) || alternate !== null && failedBoundaries.has(alternate)) && (_fiber = !0), _fiber && (fiber._debugNeedsRemount = !0), _fiber || needsRender)
          alternate = enqueueConcurrentRenderForLane(fiber, 2), alternate !== null && scheduleUpdateOnFiber(alternate, fiber, 2);
        if (child === null || _fiber || scheduleFibersWithFamiliesRecursively(child, updatedFamilies, staleFamilies), sibling === null)
          break;
        fiber = sibling;
      } while (1);
    }
    function FiberNode(tag, pendingProps, key, mode) {
      this.tag = tag, this.key = key, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = pendingProps, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = mode, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null, this.actualDuration = -0, this.actualStartTime = -1.1, this.treeBaseDuration = this.selfBaseDuration = -0, this._debugTask = this._debugStack = this._debugOwner = this._debugInfo = null, this._debugNeedsRemount = !1, this._debugHookTypes = null, hasBadMapPolyfill || typeof Object.preventExtensions !== "function" || Object.preventExtensions(this);
    }
    function shouldConstruct(Component) {
      return Component = Component.prototype, !(!Component || !Component.isReactComponent);
    }
    function createWorkInProgress(current2, pendingProps) {
      var workInProgress2 = current2.alternate;
      switch (workInProgress2 === null ? (workInProgress2 = createFiber(current2.tag, pendingProps, current2.key, current2.mode), workInProgress2.elementType = current2.elementType, workInProgress2.type = current2.type, workInProgress2.stateNode = current2.stateNode, workInProgress2._debugOwner = current2._debugOwner, workInProgress2._debugStack = current2._debugStack, workInProgress2._debugTask = current2._debugTask, workInProgress2._debugHookTypes = current2._debugHookTypes, workInProgress2.alternate = current2, current2.alternate = workInProgress2) : (workInProgress2.pendingProps = pendingProps, workInProgress2.type = current2.type, workInProgress2.flags = 0, workInProgress2.subtreeFlags = 0, workInProgress2.deletions = null, workInProgress2.actualDuration = -0, workInProgress2.actualStartTime = -1.1), workInProgress2.flags = current2.flags & 65011712, workInProgress2.childLanes = current2.childLanes, workInProgress2.lanes = current2.lanes, workInProgress2.child = current2.child, workInProgress2.memoizedProps = current2.memoizedProps, workInProgress2.memoizedState = current2.memoizedState, workInProgress2.updateQueue = current2.updateQueue, pendingProps = current2.dependencies, workInProgress2.dependencies = pendingProps === null ? null : {
        lanes: pendingProps.lanes,
        firstContext: pendingProps.firstContext,
        _debugThenableState: pendingProps._debugThenableState
      }, workInProgress2.sibling = current2.sibling, workInProgress2.index = current2.index, workInProgress2.ref = current2.ref, workInProgress2.refCleanup = current2.refCleanup, workInProgress2.selfBaseDuration = current2.selfBaseDuration, workInProgress2.treeBaseDuration = current2.treeBaseDuration, workInProgress2._debugInfo = current2._debugInfo, workInProgress2._debugNeedsRemount = current2._debugNeedsRemount, workInProgress2.tag) {
        case 0:
        case 15:
          workInProgress2.type = resolveFunctionForHotReloading(current2.type);
          break;
        case 1:
          workInProgress2.type = resolveFunctionForHotReloading(current2.type);
          break;
        case 11:
          workInProgress2.type = resolveForwardRefForHotReloading(current2.type);
      }
      return workInProgress2;
    }
    function resetWorkInProgress(workInProgress2, renderLanes2) {
      workInProgress2.flags &= 65011714;
      var current2 = workInProgress2.alternate;
      return current2 === null ? (workInProgress2.childLanes = 0, workInProgress2.lanes = renderLanes2, workInProgress2.child = null, workInProgress2.subtreeFlags = 0, workInProgress2.memoizedProps = null, workInProgress2.memoizedState = null, workInProgress2.updateQueue = null, workInProgress2.dependencies = null, workInProgress2.stateNode = null, workInProgress2.selfBaseDuration = 0, workInProgress2.treeBaseDuration = 0) : (workInProgress2.childLanes = current2.childLanes, workInProgress2.lanes = current2.lanes, workInProgress2.child = current2.child, workInProgress2.subtreeFlags = 0, workInProgress2.deletions = null, workInProgress2.memoizedProps = current2.memoizedProps, workInProgress2.memoizedState = current2.memoizedState, workInProgress2.updateQueue = current2.updateQueue, workInProgress2.type = current2.type, renderLanes2 = current2.dependencies, workInProgress2.dependencies = renderLanes2 === null ? null : {
        lanes: renderLanes2.lanes,
        firstContext: renderLanes2.firstContext,
        _debugThenableState: renderLanes2._debugThenableState
      }, workInProgress2.selfBaseDuration = current2.selfBaseDuration, workInProgress2.treeBaseDuration = current2.treeBaseDuration), workInProgress2;
    }
    function createFiberFromTypeAndProps(type, key, pendingProps, owner, mode, lanes) {
      var fiberTag = 0, resolvedType = type;
      if (typeof type === "function")
        shouldConstruct(type) && (fiberTag = 1), resolvedType = resolveFunctionForHotReloading(resolvedType);
      else if (typeof type === "string")
        supportsResources && supportsSingletons ? (fiberTag = getHostContext(), fiberTag = isHostHoistableType(type, pendingProps, fiberTag) ? 26 : isHostSingletonType(type) ? 27 : 5) : supportsResources ? (fiberTag = getHostContext(), fiberTag = isHostHoistableType(type, pendingProps, fiberTag) ? 26 : 5) : fiberTag = supportsSingletons ? isHostSingletonType(type) ? 27 : 5 : 5;
      else
        a:
          switch (type) {
            case REACT_ACTIVITY_TYPE:
              return key = createFiber(31, pendingProps, key, mode), key.elementType = REACT_ACTIVITY_TYPE, key.lanes = lanes, key;
            case REACT_FRAGMENT_TYPE:
              return createFiberFromFragment(pendingProps.children, mode, lanes, key);
            case REACT_STRICT_MODE_TYPE:
              fiberTag = 8, mode |= 24;
              break;
            case REACT_PROFILER_TYPE:
              return type = pendingProps, owner = mode, typeof type.id !== "string" && console.error('Profiler must specify an "id" of type `string` as a prop. Received the type `%s` instead.', typeof type.id), key = createFiber(12, type, key, owner | 2), key.elementType = REACT_PROFILER_TYPE, key.lanes = lanes, key.stateNode = { effectDuration: 0, passiveEffectDuration: 0 }, key;
            case REACT_SUSPENSE_TYPE:
              return key = createFiber(13, pendingProps, key, mode), key.elementType = REACT_SUSPENSE_TYPE, key.lanes = lanes, key;
            case REACT_SUSPENSE_LIST_TYPE:
              return key = createFiber(19, pendingProps, key, mode), key.elementType = REACT_SUSPENSE_LIST_TYPE, key.lanes = lanes, key;
            default:
              if (typeof type === "object" && type !== null)
                switch (type.$$typeof) {
                  case REACT_CONTEXT_TYPE:
                    fiberTag = 10;
                    break a;
                  case REACT_CONSUMER_TYPE:
                    fiberTag = 9;
                    break a;
                  case REACT_FORWARD_REF_TYPE:
                    fiberTag = 11, resolvedType = resolveForwardRefForHotReloading(resolvedType);
                    break a;
                  case REACT_MEMO_TYPE:
                    fiberTag = 14;
                    break a;
                  case REACT_LAZY_TYPE:
                    fiberTag = 16, resolvedType = null;
                    break a;
                }
              if (resolvedType = "", type === void 0 || typeof type === "object" && type !== null && Object.keys(type).length === 0)
                resolvedType += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.";
              type === null ? pendingProps = "null" : isArrayImpl(type) ? pendingProps = "array" : type !== void 0 && type.$$typeof === REACT_ELEMENT_TYPE ? (pendingProps = "<" + (getComponentNameFromType(type.type) || "Unknown") + " />", resolvedType = " Did you accidentally export a JSX literal instead of a component?") : pendingProps = typeof type, fiberTag = owner ? typeof owner.tag === "number" ? getComponentNameFromFiber(owner) : typeof owner.name === "string" ? owner.name : null : null, fiberTag && (resolvedType += `

Check the render method of \`` + fiberTag + "`."), fiberTag = 29, pendingProps = Error("Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: " + (pendingProps + "." + resolvedType)), resolvedType = null;
          }
      return key = createFiber(fiberTag, pendingProps, key, mode), key.elementType = type, key.type = resolvedType, key.lanes = lanes, key._debugOwner = owner, key;
    }
    function createFiberFromElement(element, mode, lanes) {
      return mode = createFiberFromTypeAndProps(element.type, element.key, element.props, element._owner, mode, lanes), mode._debugOwner = element._owner, mode._debugStack = element._debugStack, mode._debugTask = element._debugTask, mode;
    }
    function createFiberFromFragment(elements, mode, lanes, key) {
      return elements = createFiber(7, elements, key, mode), elements.lanes = lanes, elements;
    }
    function createFiberFromText(content, mode, lanes) {
      return content = createFiber(6, content, null, mode), content.lanes = lanes, content;
    }
    function createFiberFromDehydratedFragment(dehydratedNode) {
      var fiber = createFiber(18, null, null, NoMode);
      return fiber.stateNode = dehydratedNode, fiber;
    }
    function createFiberFromPortal(portal, mode, lanes) {
      return mode = createFiber(4, portal.children !== null ? portal.children : [], portal.key, mode), mode.lanes = lanes, mode.stateNode = {
        containerInfo: portal.containerInfo,
        pendingChildren: null,
        implementation: portal.implementation
      }, mode;
    }
    function FiberRootNode(containerInfo, tag, hydrate, identifierPrefix, onUncaughtError, onCaughtError, onRecoverableError, onDefaultTransitionIndicator, formState) {
      this.tag = 1, this.containerInfo = containerInfo, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = noTimeout, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = createLaneMap(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = createLaneMap(0), this.hiddenUpdates = createLaneMap(null), this.identifierPrefix = identifierPrefix, this.onUncaughtError = onUncaughtError, this.onCaughtError = onCaughtError, this.onRecoverableError = onRecoverableError, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = formState, this.incompleteTransitions = /* @__PURE__ */ new Map, this.passiveEffectDuration = this.effectDuration = -0, this.memoizedUpdaters = /* @__PURE__ */ new Set, containerInfo = this.pendingUpdatersLaneMap = [];
      for (tag = 0;31 > tag; tag++)
        containerInfo.push(/* @__PURE__ */ new Set);
      this._debugRootType = hydrate ? "hydrateRoot()" : "createRoot()";
    }
    function createFiberRoot(containerInfo, tag, hydrate, initialChildren, hydrationCallbacks, isStrictMode, identifierPrefix, formState, onUncaughtError, onCaughtError, onRecoverableError, onDefaultTransitionIndicator) {
      return containerInfo = new FiberRootNode(containerInfo, tag, hydrate, identifierPrefix, onUncaughtError, onCaughtError, onRecoverableError, onDefaultTransitionIndicator, formState), tag = 1, isStrictMode === !0 && (tag |= 24), isStrictMode = createFiber(3, null, null, tag | 2), containerInfo.current = isStrictMode, isStrictMode.stateNode = containerInfo, tag = createCache(), retainCache(tag), containerInfo.pooledCache = tag, retainCache(tag), isStrictMode.memoizedState = {
        element: initialChildren,
        isDehydrated: hydrate,
        cache: tag
      }, initializeUpdateQueue(isStrictMode), containerInfo;
    }
    function testStringCoercion(value) {
      return "" + value;
    }
    function getContextForSubtree(parentComponent) {
      if (!parentComponent)
        return emptyContextObject;
      return parentComponent = emptyContextObject, parentComponent;
    }
    function updateContainerSync(element, container, parentComponent, callback) {
      return updateContainerImpl(container.current, 2, element, container, parentComponent, callback), 2;
    }
    function updateContainerImpl(rootFiber, lane, element, container, parentComponent, callback) {
      if (injectedHook && typeof injectedHook.onScheduleFiberRoot === "function")
        try {
          injectedHook.onScheduleFiberRoot(rendererID, container, element);
        } catch (err) {
          hasLoggedError || (hasLoggedError = !0, console.error("React instrumentation encountered an error: %o", err));
        }
      parentComponent = getContextForSubtree(parentComponent), container.context === null ? container.context = parentComponent : container.pendingContext = parentComponent, isRendering && current !== null && !didWarnAboutNestedUpdates && (didWarnAboutNestedUpdates = !0, console.error(`Render methods should be a pure function of props and state; triggering nested component updates from render is not allowed. If necessary, trigger nested updates in componentDidUpdate.

Check the render method of %s.`, getComponentNameFromFiber(current) || "Unknown")), container = createUpdate(lane), container.payload = { element }, callback = callback === void 0 ? null : callback, callback !== null && (typeof callback !== "function" && console.error("Expected the last optional `callback` argument to be a function. Instead received: %s.", callback), container.callback = callback), element = enqueueUpdate(rootFiber, container, lane), element !== null && (startUpdateTimerByLane(lane, "root.render()", null), scheduleUpdateOnFiber(element, rootFiber, lane), entangleTransitions(element, rootFiber, lane));
    }
    function markRetryLaneImpl(fiber, retryLane) {
      if (fiber = fiber.memoizedState, fiber !== null && fiber.dehydrated !== null) {
        var a2 = fiber.retryLane;
        fiber.retryLane = a2 !== 0 && a2 < retryLane ? a2 : retryLane;
      }
    }
    function markRetryLaneIfNotHydrated(fiber, retryLane) {
      markRetryLaneImpl(fiber, retryLane), (fiber = fiber.alternate) && markRetryLaneImpl(fiber, retryLane);
    }
    function getCurrentFiberForDevTools() {
      return current;
    }
    var exports2 = {}, assign = Object.assign, REACT_LEGACY_ELEMENT_TYPE = Symbol.for("react.element"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_MEMO_CACHE_SENTINEL = Symbol.for("react.memo_cache_sentinel"), MAYBE_ITERATOR_SYMBOL = Symbol.iterator, REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), isArrayImpl = Array.isArray, ReactSharedInternals = React2.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, rendererVersion = $$$config.rendererVersion, rendererPackageName = $$$config.rendererPackageName, extraDevToolsConfig = $$$config.extraDevToolsConfig, getPublicInstance = $$$config.getPublicInstance, getRootHostContext = $$$config.getRootHostContext, getChildHostContext = $$$config.getChildHostContext, prepareForCommit = $$$config.prepareForCommit, resetAfterCommit = $$$config.resetAfterCommit, createInstance2 = $$$config.createInstance;
    $$$config.cloneMutableInstance;
    var { appendInitialChild, finalizeInitialChildren, shouldSetTextContent, createTextInstance } = $$$config;
    $$$config.cloneMutableTextInstance;
    var { scheduleTimeout, cancelTimeout, noTimeout, isPrimaryRenderer } = $$$config;
    $$$config.warnsIfNotActing;
    var { supportsMutation, supportsPersistence, supportsHydration, getInstanceFromNode } = $$$config;
    $$$config.beforeActiveInstanceBlur;
    var preparePortalMount = $$$config.preparePortalMount;
    $$$config.prepareScopeUpdate, $$$config.getInstanceFromScope;
    var { setCurrentUpdatePriority, getCurrentUpdatePriority, resolveUpdatePriority, trackSchedulerEvent, resolveEventType, resolveEventTimeStamp, shouldAttemptEagerTransition, detachDeletedInstance } = $$$config;
    $$$config.requestPostPaintCallback;
    var { maySuspendCommit, maySuspendCommitOnUpdate, maySuspendCommitInSyncRender, preloadInstance, startSuspendingCommit, suspendInstance } = $$$config;
    $$$config.suspendOnActiveViewTransition;
    var { waitForCommitToBeReady, getSuspendedCommitReason, NotPendingTransition, HostTransitionContext, resetFormInstance, bindToConsole, supportsMicrotasks, scheduleMicrotask, supportsTestSelectors, findFiberRoot, getBoundingRect, getTextContent, isHiddenSubtree, matchAccessibilityRole, setFocusIfFocusable, setupIntersectionObserver, appendChild, appendChildToContainer, commitTextUpdate, commitMount, commitUpdate, insertBefore, insertInContainerBefore, removeChild, removeChildFromContainer, resetTextContent, hideInstance, hideTextInstance, unhideInstance, unhideTextInstance } = $$$config;
    $$$config.cancelViewTransitionName, $$$config.cancelRootViewTransitionName, $$$config.restoreRootViewTransitionName, $$$config.cloneRootViewTransitionContainer, $$$config.removeRootViewTransitionClone, $$$config.measureClonedInstance, $$$config.hasInstanceChanged, $$$config.hasInstanceAffectedParent, $$$config.startViewTransition, $$$config.startGestureTransition, $$$config.stopViewTransition, $$$config.getCurrentGestureOffset, $$$config.createViewTransitionInstance;
    var clearContainer = $$$config.clearContainer;
    $$$config.createFragmentInstance, $$$config.updateFragmentInstanceFiber, $$$config.commitNewChildToFragmentInstance, $$$config.deleteChildFromFragmentInstance;
    var { cloneInstance, createContainerChildSet, appendChildToContainerChildSet, finalizeContainerChildren, replaceContainerChildren, cloneHiddenInstance, cloneHiddenTextInstance, isSuspenseInstancePending, isSuspenseInstanceFallback, getSuspenseInstanceFallbackErrorDetails, registerSuspenseInstanceRetry, canHydrateFormStateMarker, isFormStateMarkerMatching, getNextHydratableSibling, getNextHydratableSiblingAfterSingleton, getFirstHydratableChild, getFirstHydratableChildWithinContainer, getFirstHydratableChildWithinActivityInstance, getFirstHydratableChildWithinSuspenseInstance, getFirstHydratableChildWithinSingleton, canHydrateInstance, canHydrateTextInstance, canHydrateActivityInstance, canHydrateSuspenseInstance, hydrateInstance, hydrateTextInstance, hydrateActivityInstance, hydrateSuspenseInstance, getNextHydratableInstanceAfterActivityInstance, getNextHydratableInstanceAfterSuspenseInstance, commitHydratedInstance, commitHydratedContainer, commitHydratedActivityInstance, commitHydratedSuspenseInstance, finalizeHydratedChildren, flushHydrationEvents } = $$$config;
    $$$config.clearActivityBoundary;
    var clearSuspenseBoundary = $$$config.clearSuspenseBoundary;
    $$$config.clearActivityBoundaryFromContainer;
    var { clearSuspenseBoundaryFromContainer, hideDehydratedBoundary, unhideDehydratedBoundary, shouldDeleteUnhydratedTailInstances, diffHydratedPropsForDevWarnings, diffHydratedTextForDevWarnings, describeHydratableInstanceForDevWarnings, validateHydratableInstance, validateHydratableTextInstance, supportsResources, isHostHoistableType, getHoistableRoot, getResource, acquireResource, releaseResource, hydrateHoistable, mountHoistable, unmountHoistable, createHoistableInstance, prepareToCommitHoistables, mayResourceSuspendCommit, preloadResource, suspendResource, supportsSingletons, resolveSingletonInstance, acquireSingletonInstance, releaseSingletonInstance, isHostSingletonType, isSingletonScope } = $$$config, valueStack = [], fiberStack = [], index$jscomp$0 = -1, emptyContextObject = {};
    Object.freeze(emptyContextObject);
    var clz32 = Math.clz32 ? Math.clz32 : clz32Fallback, log$1 = Math.log, LN2 = Math.LN2, nextTransitionUpdateLane = 256, nextTransitionDeferredLane = 262144, nextRetryLane = 4194304, scheduleCallback$3 = Scheduler.unstable_scheduleCallback, cancelCallback$1 = Scheduler.unstable_cancelCallback, shouldYield = Scheduler.unstable_shouldYield, requestPaint = Scheduler.unstable_requestPaint, now$1 = Scheduler.unstable_now, ImmediatePriority = Scheduler.unstable_ImmediatePriority, UserBlockingPriority = Scheduler.unstable_UserBlockingPriority, NormalPriority$1 = Scheduler.unstable_NormalPriority, IdlePriority = Scheduler.unstable_IdlePriority, log4 = Scheduler.log, unstable_setDisableYieldValue2 = Scheduler.unstable_setDisableYieldValue, rendererID = null, injectedHook = null, hasLoggedError = !1, isDevToolsPresent = typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u", lastResetTime = 0;
    if (typeof performance === "object" && typeof performance.now === "function")
      var localPerformance = performance, getCurrentTime = function() {
        return localPerformance.now();
      };
    else {
      var localDate = Date;
      getCurrentTime = function() {
        return localDate.now();
      };
    }
    var objectIs = typeof Object.is === "function" ? Object.is : is, reportGlobalError = typeof reportError === "function" ? reportError : function(error44) {
      if (typeof window === "object" && typeof window.ErrorEvent === "function") {
        var event = new window.ErrorEvent("error", {
          bubbles: !0,
          cancelable: !0,
          message: typeof error44 === "object" && error44 !== null && typeof error44.message === "string" ? String(error44.message) : String(error44),
          error: error44
        });
        if (!window.dispatchEvent(event))
          return;
      } else if (typeof process === "object" && typeof process.emit === "function") {
        process.emit("uncaughtException", error44);
        return;
      }
      console.error(error44);
    }, hasOwnProperty15 = Object.prototype.hasOwnProperty, supportsUserTiming = typeof console < "u" && typeof console.timeStamp === "function" && typeof performance < "u" && typeof performance.measure === "function", currentTrack = "Blocking", alreadyWarnedForDeepEquality = !1, reusableComponentDevToolDetails = {
      color: "primary",
      properties: null,
      tooltipText: "",
      track: "Components \u269B"
    }, reusableComponentOptions = {
      start: -0,
      end: -0,
      detail: { devtools: reusableComponentDevToolDetails }
    }, resuableChangedPropsEntry = ["Changed Props", ""], reusableDeeplyEqualPropsEntry = [
      "Changed Props",
      "This component received deeply equal props. It might benefit from useMemo or the React Compiler in its owner."
    ], disabledDepth = 0, prevLog, prevInfo, prevWarn, prevError, prevGroup, prevGroupCollapsed, prevGroupEnd;
    disabledLog.__reactDisabledLog = !0;
    var prefix, suffix, reentry = !1, componentFrameCache = new (typeof WeakMap === "function" ? WeakMap : Map), CapturedStacks = /* @__PURE__ */ new WeakMap, forkStack = [], forkStackIndex = 0, treeForkProvider = null, treeForkCount = 0, idStack = [], idStackIndex = 0, treeContextProvider = null, treeContextId = 1, treeContextOverflow = "", contextStackCursor = createCursor(null), contextFiberStackCursor = createCursor(null), rootInstanceStackCursor = createCursor(null), hostTransitionProviderCursor = createCursor(null), needsEscaping = /["'&<>\n\t]|^\s|\s$/, current = null, isRendering = !1, hydrationParentFiber = null, nextHydratableInstance = null, isHydrating = !1, didSuspendOrErrorDEV = !1, hydrationDiffRootDEV = null, hydrationErrors = null, rootOrSingletonContext = !1, HydrationMismatchException = Error("Hydration Mismatch Exception: This is not a real error, and should not leak into userspace. If you're seeing this, it's likely a bug in React."), NoMode = 0, valueCursor = createCursor(null), rendererCursorDEV = createCursor(null), renderer2CursorDEV = createCursor(null), rendererSigil = {}, currentlyRenderingFiber$1 = null, lastContextDependency = null, isDisallowedContextReadInDEV = !1, AbortControllerLocal = typeof AbortController < "u" ? AbortController : function() {
      var listeners = [], signal = this.signal = {
        aborted: !1,
        addEventListener: function(type, listener) {
          listeners.push(listener);
        }
      };
      this.abort = function() {
        signal.aborted = !0, listeners.forEach(function(listener) {
          return listener();
        });
      };
    }, scheduleCallback$2 = Scheduler.unstable_scheduleCallback, NormalPriority = Scheduler.unstable_NormalPriority, CacheContext = {
      $$typeof: REACT_CONTEXT_TYPE,
      Consumer: null,
      Provider: null,
      _currentValue: null,
      _currentValue2: null,
      _threadCount: 0,
      _currentRenderer: null,
      _currentRenderer2: null
    }, now2 = Scheduler.unstable_now, createTask = console.createTask ? console.createTask : function() {
      return null;
    }, renderStartTime = -0, commitStartTime = -0, commitEndTime = -0, commitErrors = null, profilerStartTime = -1.1, profilerEffectDuration = -0, componentEffectDuration = -0, componentEffectStartTime = -1.1, componentEffectEndTime = -1.1, componentEffectErrors = null, componentEffectSpawnedUpdate = !1, blockingClampTime = -0, blockingUpdateTime = -1.1, blockingUpdateTask = null, blockingUpdateType = 0, blockingUpdateMethodName = null, blockingUpdateComponentName = null, blockingEventTime = -1.1, blockingEventType = null, blockingEventRepeatTime = -1.1, blockingSuspendedTime = -1.1, transitionClampTime = -0, transitionStartTime = -1.1, transitionUpdateTime = -1.1, transitionUpdateType = 0, transitionUpdateTask = null, transitionUpdateMethodName = null, transitionUpdateComponentName = null, transitionEventTime = -1.1, transitionEventType = null, transitionEventRepeatTime = -1.1, transitionSuspendedTime = -1.1, animatingTask = null, yieldReason = 0, yieldStartTime = -1.1, currentUpdateIsNested = !1, nestedUpdateScheduled = !1, firstScheduledRoot = null, lastScheduledRoot = null, didScheduleMicrotask = !1, didScheduleMicrotask_act = !1, mightHavePendingSyncWork = !1, isFlushingWork = !1, currentEventTransitionLane = 0, fakeActCallbackNode$1 = {}, currentEntangledListeners = null, currentEntangledPendingCount = 0, currentEntangledLane = 0, currentEntangledActionThenable = null, prevOnStartTransitionFinish = ReactSharedInternals.S;
    ReactSharedInternals.S = function(transition, returnValue) {
      if (globalMostRecentTransitionTime = now$1(), typeof returnValue === "object" && returnValue !== null && typeof returnValue.then === "function") {
        if (0 > transitionStartTime && 0 > transitionUpdateTime) {
          transitionStartTime = now2();
          var newEventTime = resolveEventTimeStamp(), newEventType = resolveEventType();
          if (newEventTime !== transitionEventRepeatTime || newEventType !== transitionEventType)
            transitionEventRepeatTime = -1.1;
          transitionEventTime = newEventTime, transitionEventType = newEventType;
        }
        entangleAsyncAction(transition, returnValue);
      }
      prevOnStartTransitionFinish !== null && prevOnStartTransitionFinish(transition, returnValue);
    };
    var resumedCache = createCursor(null), ReactStrictModeWarnings = {
      recordUnsafeLifecycleWarnings: function() {},
      flushPendingUnsafeLifecycleWarnings: function() {},
      recordLegacyContextWarning: function() {},
      flushLegacyContextWarning: function() {},
      discardPendingWarnings: function() {}
    }, pendingComponentWillMountWarnings = [], pendingUNSAFE_ComponentWillMountWarnings = [], pendingComponentWillReceivePropsWarnings = [], pendingUNSAFE_ComponentWillReceivePropsWarnings = [], pendingComponentWillUpdateWarnings = [], pendingUNSAFE_ComponentWillUpdateWarnings = [], didWarnAboutUnsafeLifecycles = /* @__PURE__ */ new Set;
    ReactStrictModeWarnings.recordUnsafeLifecycleWarnings = function(fiber, instance) {
      didWarnAboutUnsafeLifecycles.has(fiber.type) || (typeof instance.componentWillMount === "function" && instance.componentWillMount.__suppressDeprecationWarning !== !0 && pendingComponentWillMountWarnings.push(fiber), fiber.mode & 8 && typeof instance.UNSAFE_componentWillMount === "function" && pendingUNSAFE_ComponentWillMountWarnings.push(fiber), typeof instance.componentWillReceiveProps === "function" && instance.componentWillReceiveProps.__suppressDeprecationWarning !== !0 && pendingComponentWillReceivePropsWarnings.push(fiber), fiber.mode & 8 && typeof instance.UNSAFE_componentWillReceiveProps === "function" && pendingUNSAFE_ComponentWillReceivePropsWarnings.push(fiber), typeof instance.componentWillUpdate === "function" && instance.componentWillUpdate.__suppressDeprecationWarning !== !0 && pendingComponentWillUpdateWarnings.push(fiber), fiber.mode & 8 && typeof instance.UNSAFE_componentWillUpdate === "function" && pendingUNSAFE_ComponentWillUpdateWarnings.push(fiber));
    }, ReactStrictModeWarnings.flushPendingUnsafeLifecycleWarnings = function() {
      var componentWillMountUniqueNames = /* @__PURE__ */ new Set;
      0 < pendingComponentWillMountWarnings.length && (pendingComponentWillMountWarnings.forEach(function(fiber) {
        componentWillMountUniqueNames.add(getComponentNameFromFiber(fiber) || "Component"), didWarnAboutUnsafeLifecycles.add(fiber.type);
      }), pendingComponentWillMountWarnings = []);
      var UNSAFE_componentWillMountUniqueNames = /* @__PURE__ */ new Set;
      0 < pendingUNSAFE_ComponentWillMountWarnings.length && (pendingUNSAFE_ComponentWillMountWarnings.forEach(function(fiber) {
        UNSAFE_componentWillMountUniqueNames.add(getComponentNameFromFiber(fiber) || "Component"), didWarnAboutUnsafeLifecycles.add(fiber.type);
      }), pendingUNSAFE_ComponentWillMountWarnings = []);
      var componentWillReceivePropsUniqueNames = /* @__PURE__ */ new Set;
      0 < pendingComponentWillReceivePropsWarnings.length && (pendingComponentWillReceivePropsWarnings.forEach(function(fiber) {
        componentWillReceivePropsUniqueNames.add(getComponentNameFromFiber(fiber) || "Component"), didWarnAboutUnsafeLifecycles.add(fiber.type);
      }), pendingComponentWillReceivePropsWarnings = []);
      var UNSAFE_componentWillReceivePropsUniqueNames = /* @__PURE__ */ new Set;
      0 < pendingUNSAFE_ComponentWillReceivePropsWarnings.length && (pendingUNSAFE_ComponentWillReceivePropsWarnings.forEach(function(fiber) {
        UNSAFE_componentWillReceivePropsUniqueNames.add(getComponentNameFromFiber(fiber) || "Component"), didWarnAboutUnsafeLifecycles.add(fiber.type);
      }), pendingUNSAFE_ComponentWillReceivePropsWarnings = []);
      var componentWillUpdateUniqueNames = /* @__PURE__ */ new Set;
      0 < pendingComponentWillUpdateWarnings.length && (pendingComponentWillUpdateWarnings.forEach(function(fiber) {
        componentWillUpdateUniqueNames.add(getComponentNameFromFiber(fiber) || "Component"), didWarnAboutUnsafeLifecycles.add(fiber.type);
      }), pendingComponentWillUpdateWarnings = []);
      var UNSAFE_componentWillUpdateUniqueNames = /* @__PURE__ */ new Set;
      if (0 < pendingUNSAFE_ComponentWillUpdateWarnings.length && (pendingUNSAFE_ComponentWillUpdateWarnings.forEach(function(fiber) {
        UNSAFE_componentWillUpdateUniqueNames.add(getComponentNameFromFiber(fiber) || "Component"), didWarnAboutUnsafeLifecycles.add(fiber.type);
      }), pendingUNSAFE_ComponentWillUpdateWarnings = []), 0 < UNSAFE_componentWillMountUniqueNames.size) {
        var sortedNames = setToSortedString(UNSAFE_componentWillMountUniqueNames);
        console.error(`Using UNSAFE_componentWillMount in strict mode is not recommended and may indicate bugs in your code. See https://react.dev/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.

Please update the following components: %s`, sortedNames);
      }
      0 < UNSAFE_componentWillReceivePropsUniqueNames.size && (sortedNames = setToSortedString(UNSAFE_componentWillReceivePropsUniqueNames), console.error(`Using UNSAFE_componentWillReceiveProps in strict mode is not recommended and may indicate bugs in your code. See https://react.dev/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://react.dev/link/derived-state

Please update the following components: %s`, sortedNames)), 0 < UNSAFE_componentWillUpdateUniqueNames.size && (sortedNames = setToSortedString(UNSAFE_componentWillUpdateUniqueNames), console.error(`Using UNSAFE_componentWillUpdate in strict mode is not recommended and may indicate bugs in your code. See https://react.dev/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.

Please update the following components: %s`, sortedNames)), 0 < componentWillMountUniqueNames.size && (sortedNames = setToSortedString(componentWillMountUniqueNames), console.warn(`componentWillMount has been renamed, and is not recommended for use. See https://react.dev/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.
* Rename componentWillMount to UNSAFE_componentWillMount to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, sortedNames)), 0 < componentWillReceivePropsUniqueNames.size && (sortedNames = setToSortedString(componentWillReceivePropsUniqueNames), console.warn(`componentWillReceiveProps has been renamed, and is not recommended for use. See https://react.dev/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://react.dev/link/derived-state
* Rename componentWillReceiveProps to UNSAFE_componentWillReceiveProps to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, sortedNames)), 0 < componentWillUpdateUniqueNames.size && (sortedNames = setToSortedString(componentWillUpdateUniqueNames), console.warn(`componentWillUpdate has been renamed, and is not recommended for use. See https://react.dev/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* Rename componentWillUpdate to UNSAFE_componentWillUpdate to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, sortedNames));
    };
    var pendingLegacyContextWarning = /* @__PURE__ */ new Map, didWarnAboutLegacyContext = /* @__PURE__ */ new Set;
    ReactStrictModeWarnings.recordLegacyContextWarning = function(fiber, instance) {
      var strictRoot = null;
      for (var node = fiber;node !== null; )
        node.mode & 8 && (strictRoot = node), node = node.return;
      strictRoot === null ? console.error("Expected to find a StrictMode component in a strict mode tree. This error is likely caused by a bug in React. Please file an issue.") : !didWarnAboutLegacyContext.has(fiber.type) && (node = pendingLegacyContextWarning.get(strictRoot), fiber.type.contextTypes != null || fiber.type.childContextTypes != null || instance !== null && typeof instance.getChildContext === "function") && (node === void 0 && (node = [], pendingLegacyContextWarning.set(strictRoot, node)), node.push(fiber));
    }, ReactStrictModeWarnings.flushLegacyContextWarning = function() {
      pendingLegacyContextWarning.forEach(function(fiberArray) {
        if (fiberArray.length !== 0) {
          var firstFiber = fiberArray[0], uniqueNames = /* @__PURE__ */ new Set;
          fiberArray.forEach(function(fiber) {
            uniqueNames.add(getComponentNameFromFiber(fiber) || "Component"), didWarnAboutLegacyContext.add(fiber.type);
          });
          var sortedNames = setToSortedString(uniqueNames);
          runWithFiberInDEV(firstFiber, function() {
            console.error(`Legacy context API has been detected within a strict-mode tree.

The old API will be supported in all 16.x releases, but applications using it should migrate to the new version.

Please update the following components: %s

Learn more about this warning here: https://react.dev/link/legacy-context`, sortedNames);
          });
        }
      });
    }, ReactStrictModeWarnings.discardPendingWarnings = function() {
      pendingComponentWillMountWarnings = [], pendingUNSAFE_ComponentWillMountWarnings = [], pendingComponentWillReceivePropsWarnings = [], pendingUNSAFE_ComponentWillReceivePropsWarnings = [], pendingComponentWillUpdateWarnings = [], pendingUNSAFE_ComponentWillUpdateWarnings = [], pendingLegacyContextWarning = /* @__PURE__ */ new Map;
    };
    var callComponent = {
      react_stack_bottom_frame: function(Component, props, secondArg) {
        var wasRendering = isRendering;
        isRendering = !0;
        try {
          return Component(props, secondArg);
        } finally {
          isRendering = wasRendering;
        }
      }
    }, callComponentInDEV = callComponent.react_stack_bottom_frame.bind(callComponent), callRender = {
      react_stack_bottom_frame: function(instance) {
        var wasRendering = isRendering;
        isRendering = !0;
        try {
          return instance.render();
        } finally {
          isRendering = wasRendering;
        }
      }
    }, callRenderInDEV = callRender.react_stack_bottom_frame.bind(callRender), callComponentDidMount = {
      react_stack_bottom_frame: function(finishedWork, instance) {
        try {
          instance.componentDidMount();
        } catch (error44) {
          captureCommitPhaseError(finishedWork, finishedWork.return, error44);
        }
      }
    }, callComponentDidMountInDEV = callComponentDidMount.react_stack_bottom_frame.bind(callComponentDidMount), callComponentDidUpdate = {
      react_stack_bottom_frame: function(finishedWork, instance, prevProps, prevState, snapshot) {
        try {
          instance.componentDidUpdate(prevProps, prevState, snapshot);
        } catch (error44) {
          captureCommitPhaseError(finishedWork, finishedWork.return, error44);
        }
      }
    }, callComponentDidUpdateInDEV = callComponentDidUpdate.react_stack_bottom_frame.bind(callComponentDidUpdate), callComponentDidCatch = {
      react_stack_bottom_frame: function(instance, errorInfo) {
        var stack = errorInfo.stack;
        instance.componentDidCatch(errorInfo.value, {
          componentStack: stack !== null ? stack : ""
        });
      }
    }, callComponentDidCatchInDEV = callComponentDidCatch.react_stack_bottom_frame.bind(callComponentDidCatch), callComponentWillUnmount = {
      react_stack_bottom_frame: function(current2, nearestMountedAncestor, instance) {
        try {
          instance.componentWillUnmount();
        } catch (error44) {
          captureCommitPhaseError(current2, nearestMountedAncestor, error44);
        }
      }
    }, callComponentWillUnmountInDEV = callComponentWillUnmount.react_stack_bottom_frame.bind(callComponentWillUnmount), callCreate = {
      react_stack_bottom_frame: function(effect) {
        var create = effect.create;
        return effect = effect.inst, create = create(), effect.destroy = create;
      }
    }, callCreateInDEV = callCreate.react_stack_bottom_frame.bind(callCreate), callDestroy = {
      react_stack_bottom_frame: function(current2, nearestMountedAncestor, destroy2) {
        try {
          destroy2();
        } catch (error44) {
          captureCommitPhaseError(current2, nearestMountedAncestor, error44);
        }
      }
    }, callDestroyInDEV = callDestroy.react_stack_bottom_frame.bind(callDestroy), callLazyInit = {
      react_stack_bottom_frame: function(lazy2) {
        var init = lazy2._init;
        return init(lazy2._payload);
      }
    }, callLazyInitInDEV = callLazyInit.react_stack_bottom_frame.bind(callLazyInit), SuspenseException = Error("Suspense Exception: This is not a real error! It's an implementation detail of `use` to interrupt the current render. You must either rethrow it immediately, or move the `use` call outside of the `try/catch` block. Capturing without rethrowing will lead to unexpected behavior.\n\nTo handle async errors, wrap your component in an error boundary, or call the promise's `.catch` method and pass the result to `use`."), SuspenseyCommitException = Error("Suspense Exception: This is not a real error, and should not leak into userspace. If you're seeing this, it's likely a bug in React."), SuspenseActionException = Error("Suspense Exception: This is not a real error! It's an implementation detail of `useActionState` to interrupt the current render. You must either rethrow it immediately, or move the `useActionState` call outside of the `try/catch` block. Capturing without rethrowing will lead to unexpected behavior.\n\nTo handle async errors, wrap your component in an error boundary."), noopSuspenseyCommitThenable = {
      then: function() {
        console.error('Internal React error: A listener was unexpectedly attached to a "noop" thenable. This is a bug in React. Please file an issue.');
      }
    }, suspendedThenable = null, needsToResetSuspendedThenableDEV = !1, thenableState$1 = null, thenableIndexCounter$1 = 0, currentDebugInfo = null, didWarnAboutMaps, didWarnAboutGenerators = didWarnAboutMaps = !1, ownerHasKeyUseWarning = {}, ownerHasFunctionTypeWarning = {}, ownerHasSymbolTypeWarning = {};
    warnForMissingKey = function(returnFiber, workInProgress2, child) {
      if (child !== null && typeof child === "object" && child._store && (!child._store.validated && child.key == null || child._store.validated === 2)) {
        if (typeof child._store !== "object")
          throw Error("React Component in warnForMissingKey should have a _store. This error is likely caused by a bug in React. Please file an issue.");
        child._store.validated = 1;
        var componentName2 = getComponentNameFromFiber(returnFiber), componentKey = componentName2 || "null";
        if (!ownerHasKeyUseWarning[componentKey]) {
          ownerHasKeyUseWarning[componentKey] = !0, child = child._owner, returnFiber = returnFiber._debugOwner;
          var currentComponentErrorInfo = "";
          returnFiber && typeof returnFiber.tag === "number" && (componentKey = getComponentNameFromFiber(returnFiber)) && (currentComponentErrorInfo = `

Check the render method of \`` + componentKey + "`."), currentComponentErrorInfo || componentName2 && (currentComponentErrorInfo = `

Check the top-level render call using <` + componentName2 + ">.");
          var childOwnerAppendix = "";
          child != null && returnFiber !== child && (componentName2 = null, typeof child.tag === "number" ? componentName2 = getComponentNameFromFiber(child) : typeof child.name === "string" && (componentName2 = child.name), componentName2 && (childOwnerAppendix = " It was passed a child from " + componentName2 + ".")), runWithFiberInDEV(workInProgress2, function() {
            console.error('Each child in a list should have a unique "key" prop.%s%s See https://react.dev/link/warning-keys for more information.', currentComponentErrorInfo, childOwnerAppendix);
          });
        }
      }
    };
    var reconcileChildFibers = createChildReconciler(!0), mountChildFibers = createChildReconciler(!1), OffscreenVisible = 1, OffscreenPassiveEffectsConnected = 2, concurrentQueues = [], concurrentQueuesIndex = 0, concurrentlyUpdatedLanes = 0, UpdateState = 0, ReplaceState = 1, ForceUpdate = 2, CaptureUpdate = 3, hasForceUpdate = !1, didWarnUpdateInsideUpdate = !1, currentlyProcessingQueue = null, didReadFromEntangledAsyncAction = !1, currentTreeHiddenStackCursor = createCursor(null), prevEntangledRenderLanesCursor = createCursor(0), suspenseHandlerStackCursor = createCursor(null), shellBoundary = null, SubtreeSuspenseContextMask = 1, ForceSuspenseFallback = 2, suspenseStackCursor = createCursor(0), NoFlags = 0, HasEffect = 1, Insertion = 2, Layout = 4, Passive = 8, didWarnUncachedGetSnapshot, didWarnAboutMismatchedHooksForComponent = /* @__PURE__ */ new Set, didWarnAboutUseWrappedInTryCatch = /* @__PURE__ */ new Set, didWarnAboutAsyncClientComponent = /* @__PURE__ */ new Set, didWarnAboutUseFormState = /* @__PURE__ */ new Set, renderLanes = 0, currentlyRenderingFiber = null, currentHook = null, workInProgressHook = null, didScheduleRenderPhaseUpdate = !1, didScheduleRenderPhaseUpdateDuringThisPass = !1, shouldDoubleInvokeUserFnsInHooksDEV = !1, localIdCounter = 0, thenableIndexCounter = 0, thenableState = null, globalClientIdCounter = 0, RE_RENDER_LIMIT = 25, currentHookNameInDev = null, hookTypesDev = null, hookTypesUpdateIndexDev = -1, ignorePreviousDependencies = !1, ContextOnlyDispatcher = {
      readContext,
      use,
      useCallback: throwInvalidHookError,
      useContext: throwInvalidHookError,
      useEffect: throwInvalidHookError,
      useImperativeHandle: throwInvalidHookError,
      useLayoutEffect: throwInvalidHookError,
      useInsertionEffect: throwInvalidHookError,
      useMemo: throwInvalidHookError,
      useReducer: throwInvalidHookError,
      useRef: throwInvalidHookError,
      useState: throwInvalidHookError,
      useDebugValue: throwInvalidHookError,
      useDeferredValue: throwInvalidHookError,
      useTransition: throwInvalidHookError,
      useSyncExternalStore: throwInvalidHookError,
      useId: throwInvalidHookError,
      useHostTransitionStatus: throwInvalidHookError,
      useFormState: throwInvalidHookError,
      useActionState: throwInvalidHookError,
      useOptimistic: throwInvalidHookError,
      useMemoCache: throwInvalidHookError,
      useCacheRefresh: throwInvalidHookError
    };
    ContextOnlyDispatcher.useEffectEvent = throwInvalidHookError;
    var HooksDispatcherOnMountInDEV = null, HooksDispatcherOnMountWithHookTypesInDEV = null, HooksDispatcherOnUpdateInDEV = null, HooksDispatcherOnRerenderInDEV = null, InvalidNestedHooksDispatcherOnMountInDEV = null, InvalidNestedHooksDispatcherOnUpdateInDEV = null, InvalidNestedHooksDispatcherOnRerenderInDEV = null;
    HooksDispatcherOnMountInDEV = {
      readContext: function(context3) {
        return readContext(context3);
      },
      use,
      useCallback: function(callback, deps) {
        return currentHookNameInDev = "useCallback", mountHookTypesDev(), checkDepsAreArrayDev(deps), mountCallback(callback, deps);
      },
      useContext: function(context3) {
        return currentHookNameInDev = "useContext", mountHookTypesDev(), readContext(context3);
      },
      useEffect: function(create, deps) {
        return currentHookNameInDev = "useEffect", mountHookTypesDev(), checkDepsAreArrayDev(deps), mountEffect(create, deps);
      },
      useImperativeHandle: function(ref, create, deps) {
        return currentHookNameInDev = "useImperativeHandle", mountHookTypesDev(), checkDepsAreArrayDev(deps), mountImperativeHandle(ref, create, deps);
      },
      useInsertionEffect: function(create, deps) {
        currentHookNameInDev = "useInsertionEffect", mountHookTypesDev(), checkDepsAreArrayDev(deps), mountEffectImpl(4, Insertion, create, deps);
      },
      useLayoutEffect: function(create, deps) {
        return currentHookNameInDev = "useLayoutEffect", mountHookTypesDev(), checkDepsAreArrayDev(deps), mountLayoutEffect(create, deps);
      },
      useMemo: function(create, deps) {
        currentHookNameInDev = "useMemo", mountHookTypesDev(), checkDepsAreArrayDev(deps);
        var prevDispatcher = ReactSharedInternals.H;
        ReactSharedInternals.H = InvalidNestedHooksDispatcherOnMountInDEV;
        try {
          return mountMemo(create, deps);
        } finally {
          ReactSharedInternals.H = prevDispatcher;
        }
      },
      useReducer: function(reducer, initialArg, init) {
        currentHookNameInDev = "useReducer", mountHookTypesDev();
        var prevDispatcher = ReactSharedInternals.H;
        ReactSharedInternals.H = InvalidNestedHooksDispatcherOnMountInDEV;
        try {
          return mountReducer(reducer, initialArg, init);
        } finally {
          ReactSharedInternals.H = prevDispatcher;
        }
      },
      useRef: function(initialValue) {
        return currentHookNameInDev = "useRef", mountHookTypesDev(), mountRef(initialValue);
      },
      useState: function(initialState) {
        currentHookNameInDev = "useState", mountHookTypesDev();
        var prevDispatcher = ReactSharedInternals.H;
        ReactSharedInternals.H = InvalidNestedHooksDispatcherOnMountInDEV;
        try {
          return mountState(initialState);
        } finally {
          ReactSharedInternals.H = prevDispatcher;
        }
      },
      useDebugValue: function() {
        currentHookNameInDev = "useDebugValue", mountHookTypesDev();
      },
      useDeferredValue: function(value, initialValue) {
        return currentHookNameInDev = "useDeferredValue", mountHookTypesDev(), mountDeferredValue(value, initialValue);
      },
      useTransition: function() {
        return currentHookNameInDev = "useTransition", mountHookTypesDev(), mountTransition();
      },
      useSyncExternalStore: function(subscribe, getSnapshot, getServerSnapshot) {
        return currentHookNameInDev = "useSyncExternalStore", mountHookTypesDev(), mountSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
      },
      useId: function() {
        return currentHookNameInDev = "useId", mountHookTypesDev(), mountId();
      },
      useFormState: function(action, initialState) {
        return currentHookNameInDev = "useFormState", mountHookTypesDev(), warnOnUseFormStateInDev(), mountActionState(action, initialState);
      },
      useActionState: function(action, initialState) {
        return currentHookNameInDev = "useActionState", mountHookTypesDev(), mountActionState(action, initialState);
      },
      useOptimistic: function(passthrough) {
        return currentHookNameInDev = "useOptimistic", mountHookTypesDev(), mountOptimistic(passthrough);
      },
      useHostTransitionStatus,
      useMemoCache,
      useCacheRefresh: function() {
        return currentHookNameInDev = "useCacheRefresh", mountHookTypesDev(), mountRefresh();
      },
      useEffectEvent: function(callback) {
        return currentHookNameInDev = "useEffectEvent", mountHookTypesDev(), mountEvent(callback);
      }
    }, HooksDispatcherOnMountWithHookTypesInDEV = {
      readContext: function(context3) {
        return readContext(context3);
      },
      use,
      useCallback: function(callback, deps) {
        return currentHookNameInDev = "useCallback", updateHookTypesDev(), mountCallback(callback, deps);
      },
      useContext: function(context3) {
        return currentHookNameInDev = "useContext", updateHookTypesDev(), readContext(context3);
      },
      useEffect: function(create, deps) {
        return currentHookNameInDev = "useEffect", updateHookTypesDev(), mountEffect(create, deps);
      },
      useImperativeHandle: function(ref, create, deps) {
        return currentHookNameInDev = "useImperativeHandle", updateHookTypesDev(), mountImperativeHandle(ref, create, deps);
      },
      useInsertionEffect: function(create, deps) {
        currentHookNameInDev = "useInsertionEffect", updateHookTypesDev(), mountEffectImpl(4, Insertion, create, deps);
      },
      useLayoutEffect: function(create, deps) {
        return currentHookNameInDev = "useLayoutEffect", updateHookTypesDev(), mountLayoutEffect(create, deps);
      },
      useMemo: function(create, deps) {
        currentHookNameInDev = "useMemo", updateHookTypesDev();
        var prevDispatcher = ReactSharedInternals.H;
        ReactSharedInternals.H = InvalidNestedHooksDispatcherOnMountInDEV;
        try {
          return mountMemo(create, deps);
        } finally {
          ReactSharedInternals.H = prevDispatcher;
        }
      },
      useReducer: function(reducer, initialArg, init) {
        currentHookNameInDev = "useReducer", updateHookTypesDev();
        var prevDispatcher = ReactSharedInternals.H;
        ReactSharedInternals.H = InvalidNestedHooksDispatcherOnMountInDEV;
        try {
          return mountReducer(reducer, initialArg, init);
        } finally {
          ReactSharedInternals.H = prevDispatcher;
        }
      },
      useRef: function(initialValue) {
        return currentHookNameInDev = "useRef", updateHookTypesDev(), mountRef(initialValue);
      },
      useState: function(initialState) {
        currentHookNameInDev = "useState", updateHookTypesDev();
        var prevDispatcher = ReactSharedInternals.H;
        ReactSharedInternals.H = InvalidNestedHooksDispatcherOnMountInDEV;
        try {
          return mountState(initialState);
        } finally {
          ReactSharedInternals.H = prevDispatcher;
        }
      },
      useDebugValue: function() {
        currentHookNameInDev = "useDebugValue", updateHookTypesDev();
      },
      useDeferredValue: function(value, initialValue) {
        return currentHookNameInDev = "useDeferredValue", updateHookTypesDev(), mountDeferredValue(value, initialValue);
      },
      useTransition: function() {
        return currentHookNameInDev = "useTransition", updateHookTypesDev(), mountTransition();
      },
      useSyncExternalStore: function(subscribe, getSnapshot, getServerSnapshot) {
        return currentHookNameInDev = "useSyncExternalStore", updateHookTypesDev(), mountSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
      },
      useId: function() {
        return currentHookNameInDev = "useId", updateHookTypesDev(), mountId();
      },
      useActionState: function(action, initialState) {
        return currentHookNameInDev = "useActionState", updateHookTypesDev(), mountActionState(action, initialState);
      },
      useFormState: function(action, initialState) {
        return currentHookNameInDev = "useFormState", updateHookTypesDev(), warnOnUseFormStateInDev(), mountActionState(action, initialState);
      },
      useOptimistic: function(passthrough) {
        return currentHookNameInDev = "useOptimistic", updateHookTypesDev(), mountOptimistic(passthrough);
      },
      useHostTransitionStatus,
      useMemoCache,
      useCacheRefresh: function() {
        return currentHookNameInDev = "useCacheRefresh", updateHookTypesDev(), mountRefresh();
      },
      useEffectEvent: function(callback) {
        return currentHookNameInDev = "useEffectEvent", updateHookTypesDev(), mountEvent(callback);
      }
    }, HooksDispatcherOnUpdateInDEV = {
      readContext: function(context3) {
        return readContext(context3);
      },
      use,
      useCallback: function(callback, deps) {
        return currentHookNameInDev = "useCallback", updateHookTypesDev(), updateCallback(callback, deps);
      },
      useContext: function(context3) {
        return currentHookNameInDev = "useContext", updateHookTypesDev(), readContext(context3);
      },
      useEffect: function(create, deps) {
        currentHookNameInDev = "useEffect", updateHookTypesDev(), updateEffectImpl(2048, Passive, create, deps);
      },
      useImperativeHandle: function(ref, create, deps) {
        return currentHookNameInDev = "useImperativeHandle", updateHookTypesDev(), updateImperativeHandle(ref, create, deps);
      },
      useInsertionEffect: function(create, deps) {
        return currentHookNameInDev = "useInsertionEffect", updateHookTypesDev(), updateEffectImpl(4, Insertion, create, deps);
      },
      useLayoutEffect: function(create, deps) {
        return currentHookNameInDev = "useLayoutEffect", updateHookTypesDev(), updateEffectImpl(4, Layout, create, deps);
      },
      useMemo: function(create, deps) {
        currentHookNameInDev = "useMemo", updateHookTypesDev();
        var prevDispatcher = ReactSharedInternals.H;
        ReactSharedInternals.H = InvalidNestedHooksDispatcherOnUpdateInDEV;
        try {
          return updateMemo(create, deps);
        } finally {
          ReactSharedInternals.H = prevDispatcher;
        }
      },
      useReducer: function(reducer, initialArg, init) {
        currentHookNameInDev = "useReducer", updateHookTypesDev();
        var prevDispatcher = ReactSharedInternals.H;
        ReactSharedInternals.H = InvalidNestedHooksDispatcherOnUpdateInDEV;
        try {
          return updateReducer(reducer, initialArg, init);
        } finally {
          ReactSharedInternals.H = prevDispatcher;
        }
      },
      useRef: function() {
        return currentHookNameInDev = "useRef", updateHookTypesDev(), updateWorkInProgressHook().memoizedState;
      },
      useState: function() {
        currentHookNameInDev = "useState", updateHookTypesDev();
        var prevDispatcher = ReactSharedInternals.H;
        ReactSharedInternals.H = InvalidNestedHooksDispatcherOnUpdateInDEV;
        try {
          return updateReducer(basicStateReducer);
        } finally {
          ReactSharedInternals.H = prevDispatcher;
        }
      },
      useDebugValue: function() {
        currentHookNameInDev = "useDebugValue", updateHookTypesDev();
      },
      useDeferredValue: function(value, initialValue) {
        return currentHookNameInDev = "useDeferredValue", updateHookTypesDev(), updateDeferredValue(value, initialValue);
      },
      useTransition: function() {
        return currentHookNameInDev = "useTransition", updateHookTypesDev(), updateTransition();
      },
      useSyncExternalStore: function(subscribe, getSnapshot, getServerSnapshot) {
        return currentHookNameInDev = "useSyncExternalStore", updateHookTypesDev(), updateSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
      },
      useId: function() {
        return currentHookNameInDev = "useId", updateHookTypesDev(), updateWorkInProgressHook().memoizedState;
      },
      useFormState: function(action) {
        return currentHookNameInDev = "useFormState", updateHookTypesDev(), warnOnUseFormStateInDev(), updateActionState(action);
      },
      useActionState: function(action) {
        return currentHookNameInDev = "useActionState", updateHookTypesDev(), updateActionState(action);
      },
      useOptimistic: function(passthrough, reducer) {
        return currentHookNameInDev = "useOptimistic", updateHookTypesDev(), updateOptimistic(passthrough, reducer);
      },
      useHostTransitionStatus,
      useMemoCache,
      useCacheRefresh: function() {
        return currentHookNameInDev = "useCacheRefresh", updateHookTypesDev(), updateWorkInProgressHook().memoizedState;
      },
      useEffectEvent: function(callback) {
        return currentHookNameInDev = "useEffectEvent", updateHookTypesDev(), updateEvent(callback);
      }
    }, HooksDispatcherOnRerenderInDEV = {
      readContext: function(context3) {
        return readContext(context3);
      },
      use,
      useCallback: function(callback, deps) {
        return currentHookNameInDev = "useCallback", updateHookTypesDev(), updateCallback(callback, deps);
      },
      useContext: function(context3) {
        return currentHookNameInDev = "useContext", updateHookTypesDev(), readContext(context3);
      },
      useEffect: function(create, deps) {
        currentHookNameInDev = "useEffect", updateHookTypesDev(), updateEffectImpl(2048, Passive, create, deps);
      },
      useImperativeHandle: function(ref, create, deps) {
        return currentHookNameInDev = "useImperativeHandle", updateHookTypesDev(), updateImperativeHandle(ref, create, deps);
      },
      useInsertionEffect: function(create, deps) {
        return currentHookNameInDev = "useInsertionEffect", updateHookTypesDev(), updateEffectImpl(4, Insertion, create, deps);
      },
      useLayoutEffect: function(create, deps) {
        return currentHookNameInDev = "useLayoutEffect", updateHookTypesDev(), updateEffectImpl(4, Layout, create, deps);
      },
      useMemo: function(create, deps) {
        currentHookNameInDev = "useMemo", updateHookTypesDev();
        var prevDispatcher = ReactSharedInternals.H;
        ReactSharedInternals.H = InvalidNestedHooksDispatcherOnRerenderInDEV;
        try {
          return updateMemo(create, deps);
        } finally {
          ReactSharedInternals.H = prevDispatcher;
        }
      },
      useReducer: function(reducer, initialArg, init) {
        currentHookNameInDev = "useReducer", updateHookTypesDev();
        var prevDispatcher = ReactSharedInternals.H;
        ReactSharedInternals.H = InvalidNestedHooksDispatcherOnRerenderInDEV;
        try {
          return rerenderReducer(reducer, initialArg, init);
        } finally {
          ReactSharedInternals.H = prevDispatcher;
        }
      },
      useRef: function() {
        return currentHookNameInDev = "useRef", updateHookTypesDev(), updateWorkInProgressHook().memoizedState;
      },
      useState: function() {
        currentHookNameInDev = "useState", updateHookTypesDev();
        var prevDispatcher = ReactSharedInternals.H;
        ReactSharedInternals.H = InvalidNestedHooksDispatcherOnRerenderInDEV;
        try {
          return rerenderReducer(basicStateReducer);
        } finally {
          ReactSharedInternals.H = prevDispatcher;
        }
      },
      useDebugValue: function() {
        currentHookNameInDev = "useDebugValue", updateHookTypesDev();
      },
      useDeferredValue: function(value, initialValue) {
        return currentHookNameInDev = "useDeferredValue", updateHookTypesDev(), rerenderDeferredValue(value, initialValue);
      },
      useTransition: function() {
        return currentHookNameInDev = "useTransition", updateHookTypesDev(), rerenderTransition();
      },
      useSyncExternalStore: function(subscribe, getSnapshot, getServerSnapshot) {
        return currentHookNameInDev = "useSyncExternalStore", updateHookTypesDev(), updateSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
      },
      useId: function() {
        return currentHookNameInDev = "useId", updateHookTypesDev(), updateWorkInProgressHook().memoizedState;
      },
      useFormState: function(action) {
        return currentHookNameInDev = "useFormState", updateHookTypesDev(), warnOnUseFormStateInDev(), rerenderActionState(action);
      },
      useActionState: function(action) {
        return currentHookNameInDev = "useActionState", updateHookTypesDev(), rerenderActionState(action);
      },
      useOptimistic: function(passthrough, reducer) {
        return currentHookNameInDev = "useOptimistic", updateHookTypesDev(), rerenderOptimistic(passthrough, reducer);
      },
      useHostTransitionStatus,
      useMemoCache,
      useCacheRefresh: function() {
        return currentHookNameInDev = "useCacheRefresh", updateHookTypesDev(), updateWorkInProgressHook().memoizedState;
      },
      useEffectEvent: function(callback) {
        return currentHookNameInDev = "useEffectEvent", updateHookTypesDev(), updateEvent(callback);
      }
    }, InvalidNestedHooksDispatcherOnMountInDEV = {
      readContext: function(context3) {
        return warnInvalidContextAccess(), readContext(context3);
      },
      use: function(usable) {
        return warnInvalidHookAccess(), use(usable);
      },
      useCallback: function(callback, deps) {
        return currentHookNameInDev = "useCallback", warnInvalidHookAccess(), mountHookTypesDev(), mountCallback(callback, deps);
      },
      useContext: function(context3) {
        return currentHookNameInDev = "useContext", warnInvalidHookAccess(), mountHookTypesDev(), readContext(context3);
      },
      useEffect: function(create, deps) {
        return currentHookNameInDev = "useEffect", warnInvalidHookAccess(), mountHookTypesDev(), mountEffect(create, deps);
      },
      useImperativeHandle: function(ref, create, deps) {
        return currentHookNameInDev = "useImperativeHandle", warnInvalidHookAccess(), mountHookTypesDev(), mountImperativeHandle(ref, create, deps);
      },
      useInsertionEffect: function(create, deps) {
        currentHookNameInDev = "useInsertionEffect", warnInvalidHookAccess(), mountHookTypesDev(), mountEffectImpl(4, Insertion, create, deps);
      },
      useLayoutEffect: function(create, deps) {
        return currentHookNameInDev = "useLayoutEffect", warnInvalidHookAccess(), mountHookTypesDev(), mountLayoutEffect(create, deps);
      },
      useMemo: function(create, deps) {
        currentHookNameInDev = "useMemo", warnInvalidHookAccess(), mountHookTypesDev();
        var prevDispatcher = ReactSharedInternals.H;
        ReactSharedInternals.H = InvalidNestedHooksDispatcherOnMountInDEV;
        try {
          return mountMemo(create, deps);
        } finally {
          ReactSharedInternals.H = prevDispatcher;
        }
      },
      useReducer: function(reducer, initialArg, init) {
        currentHookNameInDev = "useReducer", warnInvalidHookAccess(), mountHookTypesDev();
        var prevDispatcher = ReactSharedInternals.H;
        ReactSharedInternals.H = InvalidNestedHooksDispatcherOnMountInDEV;
        try {
          return mountReducer(reducer, initialArg, init);
        } finally {
          ReactSharedInternals.H = prevDispatcher;
        }
      },
      useRef: function(initialValue) {
        return currentHookNameInDev = "useRef", warnInvalidHookAccess(), mountHookTypesDev(), mountRef(initialValue);
      },
      useState: function(initialState) {
        currentHookNameInDev = "useState", warnInvalidHookAccess(), mountHookTypesDev();
        var prevDispatcher = ReactSharedInternals.H;
        ReactSharedInternals.H = InvalidNestedHooksDispatcherOnMountInDEV;
        try {
          return mountState(initialState);
        } finally {
          ReactSharedInternals.H = prevDispatcher;
        }
      },
      useDebugValue: function() {
        currentHookNameInDev = "useDebugValue", warnInvalidHookAccess(), mountHookTypesDev();
      },
      useDeferredValue: function(value, initialValue) {
        return currentHookNameInDev = "useDeferredValue", warnInvalidHookAccess(), mountHookTypesDev(), mountDeferredValue(value, initialValue);
      },
      useTransition: function() {
        return currentHookNameInDev = "useTransition", warnInvalidHookAccess(), mountHookTypesDev(), mountTransition();
      },
      useSyncExternalStore: function(subscribe, getSnapshot, getServerSnapshot) {
        return currentHookNameInDev = "useSyncExternalStore", warnInvalidHookAccess(), mountHookTypesDev(), mountSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
      },
      useId: function() {
        return currentHookNameInDev = "useId", warnInvalidHookAccess(), mountHookTypesDev(), mountId();
      },
      useFormState: function(action, initialState) {
        return currentHookNameInDev = "useFormState", warnInvalidHookAccess(), mountHookTypesDev(), mountActionState(action, initialState);
      },
      useActionState: function(action, initialState) {
        return currentHookNameInDev = "useActionState", warnInvalidHookAccess(), mountHookTypesDev(), mountActionState(action, initialState);
      },
      useOptimistic: function(passthrough) {
        return currentHookNameInDev = "useOptimistic", warnInvalidHookAccess(), mountHookTypesDev(), mountOptimistic(passthrough);
      },
      useMemoCache: function(size) {
        return warnInvalidHookAccess(), useMemoCache(size);
      },
      useHostTransitionStatus,
      useCacheRefresh: function() {
        return currentHookNameInDev = "useCacheRefresh", mountHookTypesDev(), mountRefresh();
      },
      useEffectEvent: function(callback) {
        return currentHookNameInDev = "useEffectEvent", warnInvalidHookAccess(), mountHookTypesDev(), mountEvent(callback);
      }
    }, InvalidNestedHooksDispatcherOnUpdateInDEV = {
      readContext: function(context3) {
        return warnInvalidContextAccess(), readContext(context3);
      },
      use: function(usable) {
        return warnInvalidHookAccess(), use(usable);
      },
      useCallback: function(callback, deps) {
        return currentHookNameInDev = "useCallback", warnInvalidHookAccess(), updateHookTypesDev(), updateCallback(callback, deps);
      },
      useContext: function(context3) {
        return currentHookNameInDev = "useContext", warnInvalidHookAccess(), updateHookTypesDev(), readContext(context3);
      },
      useEffect: function(create, deps) {
        currentHookNameInDev = "useEffect", warnInvalidHookAccess(), updateHookTypesDev(), updateEffectImpl(2048, Passive, create, deps);
      },
      useImperativeHandle: function(ref, create, deps) {
        return currentHookNameInDev = "useImperativeHandle", warnInvalidHookAccess(), updateHookTypesDev(), updateImperativeHandle(ref, create, deps);
      },
      useInsertionEffect: function(create, deps) {
        return currentHookNameInDev = "useInsertionEffect", warnInvalidHookAccess(), updateHookTypesDev(), updateEffectImpl(4, Insertion, create, deps);
      },
      useLayoutEffect: function(create, deps) {
        return currentHookNameInDev = "useLayoutEffect", warnInvalidHookAccess(), updateHookTypesDev(), updateEffectImpl(4, Layout, create, deps);
      },
      useMemo: function(create, deps) {
        currentHookNameInDev = "useMemo", warnInvalidHookAccess(), updateHookTypesDev();
        var prevDispatcher = ReactSharedInternals.H;
        ReactSharedInternals.H = InvalidNestedHooksDispatcherOnUpdateInDEV;
        try {
          return updateMemo(create, deps);
        } finally {
          ReactSharedInternals.H = prevDispatcher;
        }
      },
      useReducer: function(reducer, initialArg, init) {
        currentHookNameInDev = "useReducer", warnInvalidHookAccess(), updateHookTypesDev();
        var prevDispatcher = ReactSharedInternals.H;
        ReactSharedInternals.H = InvalidNestedHooksDispatcherOnUpdateInDEV;
        try {
          return updateReducer(reducer, initialArg, init);
        } finally {
          ReactSharedInternals.H = prevDispatcher;
        }
      },
      useRef: function() {
        return currentHookNameInDev = "useRef", warnInvalidHookAccess(), updateHookTypesDev(), updateWorkInProgressHook().memoizedState;
      },
      useState: function() {
        currentHookNameInDev = "useState", warnInvalidHookAccess(), updateHookTypesDev();
        var prevDispatcher = ReactSharedInternals.H;
        ReactSharedInternals.H = InvalidNestedHooksDispatcherOnUpdateInDEV;
        try {
          return updateReducer(basicStateReducer);
        } finally {
          ReactSharedInternals.H = prevDispatcher;
        }
      },
      useDebugValue: function() {
        currentHookNameInDev = "useDebugValue", warnInvalidHookAccess(), updateHookTypesDev();
      },
      useDeferredValue: function(value, initialValue) {
        return currentHookNameInDev = "useDeferredValue", warnInvalidHookAccess(), updateHookTypesDev(), updateDeferredValue(value, initialValue);
      },
      useTransition: function() {
        return currentHookNameInDev = "useTransition", warnInvalidHookAccess(), updateHookTypesDev(), updateTransition();
      },
      useSyncExternalStore: function(subscribe, getSnapshot, getServerSnapshot) {
        return currentHookNameInDev = "useSyncExternalStore", warnInvalidHookAccess(), updateHookTypesDev(), updateSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
      },
      useId: function() {
        return currentHookNameInDev = "useId", warnInvalidHookAccess(), updateHookTypesDev(), updateWorkInProgressHook().memoizedState;
      },
      useFormState: function(action) {
        return currentHookNameInDev = "useFormState", warnInvalidHookAccess(), updateHookTypesDev(), updateActionState(action);
      },
      useActionState: function(action) {
        return currentHookNameInDev = "useActionState", warnInvalidHookAccess(), updateHookTypesDev(), updateActionState(action);
      },
      useOptimistic: function(passthrough, reducer) {
        return currentHookNameInDev = "useOptimistic", warnInvalidHookAccess(), updateHookTypesDev(), updateOptimistic(passthrough, reducer);
      },
      useMemoCache: function(size) {
        return warnInvalidHookAccess(), useMemoCache(size);
      },
      useHostTransitionStatus,
      useCacheRefresh: function() {
        return currentHookNameInDev = "useCacheRefresh", updateHookTypesDev(), updateWorkInProgressHook().memoizedState;
      },
      useEffectEvent: function(callback) {
        return currentHookNameInDev = "useEffectEvent", warnInvalidHookAccess(), updateHookTypesDev(), updateEvent(callback);
      }
    }, InvalidNestedHooksDispatcherOnRerenderInDEV = {
      readContext: function(context3) {
        return warnInvalidContextAccess(), readContext(context3);
      },
      use: function(usable) {
        return warnInvalidHookAccess(), use(usable);
      },
      useCallback: function(callback, deps) {
        return currentHookNameInDev = "useCallback", warnInvalidHookAccess(), updateHookTypesDev(), updateCallback(callback, deps);
      },
      useContext: function(context3) {
        return currentHookNameInDev = "useContext", warnInvalidHookAccess(), updateHookTypesDev(), readContext(context3);
      },
      useEffect: function(create, deps) {
        currentHookNameInDev = "useEffect", warnInvalidHookAccess(), updateHookTypesDev(), updateEffectImpl(2048, Passive, create, deps);
      },
      useImperativeHandle: function(ref, create, deps) {
        return currentHookNameInDev = "useImperativeHandle", warnInvalidHookAccess(), updateHookTypesDev(), updateImperativeHandle(ref, create, deps);
      },
      useInsertionEffect: function(create, deps) {
        return currentHookNameInDev = "useInsertionEffect", warnInvalidHookAccess(), updateHookTypesDev(), updateEffectImpl(4, Insertion, create, deps);
      },
      useLayoutEffect: function(create, deps) {
        return currentHookNameInDev = "useLayoutEffect", warnInvalidHookAccess(), updateHookTypesDev(), updateEffectImpl(4, Layout, create, deps);
      },
      useMemo: function(create, deps) {
        currentHookNameInDev = "useMemo", warnInvalidHookAccess(), updateHookTypesDev();
        var prevDispatcher = ReactSharedInternals.H;
        ReactSharedInternals.H = InvalidNestedHooksDispatcherOnUpdateInDEV;
        try {
          return updateMemo(create, deps);
        } finally {
          ReactSharedInternals.H = prevDispatcher;
        }
      },
      useReducer: function(reducer, initialArg, init) {
        currentHookNameInDev = "useReducer", warnInvalidHookAccess(), updateHookTypesDev();
        var prevDispatcher = ReactSharedInternals.H;
        ReactSharedInternals.H = InvalidNestedHooksDispatcherOnUpdateInDEV;
        try {
          return rerenderReducer(reducer, initialArg, init);
        } finally {
          ReactSharedInternals.H = prevDispatcher;
        }
      },
      useRef: function() {
        return currentHookNameInDev = "useRef", warnInvalidHookAccess(), updateHookTypesDev(), updateWorkInProgressHook().memoizedState;
      },
      useState: function() {
        currentHookNameInDev = "useState", warnInvalidHookAccess(), updateHookTypesDev();
        var prevDispatcher = ReactSharedInternals.H;
        ReactSharedInternals.H = InvalidNestedHooksDispatcherOnUpdateInDEV;
        try {
          return rerenderReducer(basicStateReducer);
        } finally {
          ReactSharedInternals.H = prevDispatcher;
        }
      },
      useDebugValue: function() {
        currentHookNameInDev = "useDebugValue", warnInvalidHookAccess(), updateHookTypesDev();
      },
      useDeferredValue: function(value, initialValue) {
        return currentHookNameInDev = "useDeferredValue", warnInvalidHookAccess(), updateHookTypesDev(), rerenderDeferredValue(value, initialValue);
      },
      useTransition: function() {
        return currentHookNameInDev = "useTransition", warnInvalidHookAccess(), updateHookTypesDev(), rerenderTransition();
      },
      useSyncExternalStore: function(subscribe, getSnapshot, getServerSnapshot) {
        return currentHookNameInDev = "useSyncExternalStore", warnInvalidHookAccess(), updateHookTypesDev(), updateSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
      },
      useId: function() {
        return currentHookNameInDev = "useId", warnInvalidHookAccess(), updateHookTypesDev(), updateWorkInProgressHook().memoizedState;
      },
      useFormState: function(action) {
        return currentHookNameInDev = "useFormState", warnInvalidHookAccess(), updateHookTypesDev(), rerenderActionState(action);
      },
      useActionState: function(action) {
        return currentHookNameInDev = "useActionState", warnInvalidHookAccess(), updateHookTypesDev(), rerenderActionState(action);
      },
      useOptimistic: function(passthrough, reducer) {
        return currentHookNameInDev = "useOptimistic", warnInvalidHookAccess(), updateHookTypesDev(), rerenderOptimistic(passthrough, reducer);
      },
      useMemoCache: function(size) {
        return warnInvalidHookAccess(), useMemoCache(size);
      },
      useHostTransitionStatus,
      useCacheRefresh: function() {
        return currentHookNameInDev = "useCacheRefresh", updateHookTypesDev(), updateWorkInProgressHook().memoizedState;
      },
      useEffectEvent: function(callback) {
        return currentHookNameInDev = "useEffectEvent", warnInvalidHookAccess(), updateHookTypesDev(), updateEvent(callback);
      }
    };
    var fakeInternalInstance = {}, didWarnAboutStateAssignmentForComponent = /* @__PURE__ */ new Set, didWarnAboutUninitializedState = /* @__PURE__ */ new Set, didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate = /* @__PURE__ */ new Set, didWarnAboutLegacyLifecyclesAndDerivedState = /* @__PURE__ */ new Set, didWarnAboutDirectlyAssigningPropsToState = /* @__PURE__ */ new Set, didWarnAboutUndefinedDerivedState = /* @__PURE__ */ new Set, didWarnAboutContextTypes$1 = /* @__PURE__ */ new Set, didWarnAboutChildContextTypes = /* @__PURE__ */ new Set, didWarnAboutInvalidateContextType = /* @__PURE__ */ new Set, didWarnOnInvalidCallback = /* @__PURE__ */ new Set;
    Object.freeze(fakeInternalInstance);
    var classComponentUpdater = {
      enqueueSetState: function(inst, payload, callback) {
        inst = inst._reactInternals;
        var lane = requestUpdateLane(inst), update = createUpdate(lane);
        update.payload = payload, callback !== void 0 && callback !== null && (warnOnInvalidCallback(callback), update.callback = callback), payload = enqueueUpdate(inst, update, lane), payload !== null && (startUpdateTimerByLane(lane, "this.setState()", inst), scheduleUpdateOnFiber(payload, inst, lane), entangleTransitions(payload, inst, lane));
      },
      enqueueReplaceState: function(inst, payload, callback) {
        inst = inst._reactInternals;
        var lane = requestUpdateLane(inst), update = createUpdate(lane);
        update.tag = ReplaceState, update.payload = payload, callback !== void 0 && callback !== null && (warnOnInvalidCallback(callback), update.callback = callback), payload = enqueueUpdate(inst, update, lane), payload !== null && (startUpdateTimerByLane(lane, "this.replaceState()", inst), scheduleUpdateOnFiber(payload, inst, lane), entangleTransitions(payload, inst, lane));
      },
      enqueueForceUpdate: function(inst, callback) {
        inst = inst._reactInternals;
        var lane = requestUpdateLane(inst), update = createUpdate(lane);
        update.tag = ForceUpdate, callback !== void 0 && callback !== null && (warnOnInvalidCallback(callback), update.callback = callback), callback = enqueueUpdate(inst, update, lane), callback !== null && (startUpdateTimerByLane(lane, "this.forceUpdate()", inst), scheduleUpdateOnFiber(callback, inst, lane), entangleTransitions(callback, inst, lane));
      }
    }, componentName = null, errorBoundaryName = null, SelectiveHydrationException = Error("This is not a real error. It's an implementation detail of React's selective hydration feature. If this leaks into userspace, it's a bug in React. Please file an issue."), didReceiveUpdate = !1, didWarnAboutBadClass = {}, didWarnAboutContextTypeOnFunctionComponent = {}, didWarnAboutContextTypes = {}, didWarnAboutGetDerivedStateOnFunctionComponent = {}, didWarnAboutReassigningProps = !1, didWarnAboutRevealOrder = {}, didWarnAboutTailOptions = {}, SUSPENDED_MARKER = {
      dehydrated: null,
      treeContext: null,
      retryLane: 0,
      hydrationErrors: null
    }, hasWarnedAboutUsingNoValuePropOnContextProvider = !1, didWarnAboutUndefinedSnapshotBeforeUpdate = null;
    didWarnAboutUndefinedSnapshotBeforeUpdate = /* @__PURE__ */ new Set;
    var offscreenSubtreeIsHidden = !1, offscreenSubtreeWasHidden = !1, needsFormReset = !1, PossiblyWeakSet = typeof WeakSet === "function" ? WeakSet : Set, nextEffect = null, inProgressLanes = null, inProgressRoot = null, hostParent = null, hostParentIsContainer = !1, currentHoistableRoot = null, inHydratedSubtree = !1, suspenseyCommitFlag = 8192, DefaultAsyncDispatcher = {
      getCacheForType: function(resourceType) {
        var cache4 = readContext(CacheContext), cacheForType = cache4.data.get(resourceType);
        return cacheForType === void 0 && (cacheForType = resourceType(), cache4.data.set(resourceType, cacheForType)), cacheForType;
      },
      cacheSignal: function() {
        return readContext(CacheContext).controller.signal;
      },
      getOwner: function() {
        return current;
      }
    }, COMPONENT_TYPE = 0, HAS_PSEUDO_CLASS_TYPE = 1, ROLE_TYPE = 2, TEST_NAME_TYPE = 3, TEXT_TYPE = 4;
    if (typeof Symbol === "function" && Symbol.for) {
      var symbolFor = Symbol.for;
      COMPONENT_TYPE = symbolFor("selector.component"), HAS_PSEUDO_CLASS_TYPE = symbolFor("selector.has_pseudo_class"), ROLE_TYPE = symbolFor("selector.role"), TEST_NAME_TYPE = symbolFor("selector.test_id"), TEXT_TYPE = symbolFor("selector.text");
    }
    var commitHooks = [], PossiblyWeakMap = typeof WeakMap === "function" ? WeakMap : Map, NoContext = 0, RenderContext = 2, CommitContext = 4, RootInProgress = 0, RootFatalErrored = 1, RootErrored = 2, RootSuspended = 3, RootSuspendedWithDelay = 4, RootSuspendedAtTheShell = 6, RootCompleted = 5, executionContext = NoContext, workInProgressRoot = null, workInProgress = null, workInProgressRootRenderLanes = 0, NotSuspended = 0, SuspendedOnError = 1, SuspendedOnData = 2, SuspendedOnImmediate = 3, SuspendedOnInstance = 4, SuspendedOnInstanceAndReadyToContinue = 5, SuspendedOnDeprecatedThrowPromise = 6, SuspendedAndReadyToContinue = 7, SuspendedOnHydration = 8, SuspendedOnAction = 9, workInProgressSuspendedReason = NotSuspended, workInProgressThrownValue = null, workInProgressRootDidSkipSuspendedSiblings = !1, workInProgressRootIsPrerendering = !1, workInProgressRootDidAttachPingListener = !1, entangledRenderLanes = 0, workInProgressRootExitStatus = RootInProgress, workInProgressRootSkippedLanes = 0, workInProgressRootInterleavedUpdatedLanes = 0, workInProgressRootPingedLanes = 0, workInProgressDeferredLane = 0, workInProgressSuspendedRetryLanes = 0, workInProgressRootConcurrentErrors = null, workInProgressRootRecoverableErrors = null, workInProgressRootDidIncludeRecursiveRenderUpdate = !1, globalMostRecentFallbackTime = 0, globalMostRecentTransitionTime = 0, FALLBACK_THROTTLE_MS = 300, workInProgressRootRenderTargetTime = 1 / 0, RENDER_TIMEOUT_MS = 500, workInProgressTransitions = null, workInProgressUpdateTask = null, legacyErrorBoundariesThatAlreadyFailed = null, IMMEDIATE_COMMIT = 0, ABORTED_VIEW_TRANSITION_COMMIT = 1, DELAYED_PASSIVE_COMMIT = 2, ANIMATION_STARTED_COMMIT = 3, NO_PENDING_EFFECTS = 0, PENDING_MUTATION_PHASE = 1, PENDING_LAYOUT_PHASE = 2, PENDING_AFTER_MUTATION_PHASE = 3, PENDING_SPAWNED_WORK = 4, PENDING_PASSIVE_PHASE = 5, pendingEffectsStatus = 0, pendingEffectsRoot = null, pendingFinishedWork = null, pendingEffectsLanes = 0, pendingEffectsRemainingLanes = 0, pendingEffectsRenderEndTime = -0, pendingPassiveTransitions = null, pendingRecoverableErrors = null, pendingSuspendedCommitReason = null, pendingDelayedCommitReason = IMMEDIATE_COMMIT, pendingSuspendedViewTransitionReason = null, NESTED_UPDATE_LIMIT = 50, nestedUpdateCount = 0, rootWithNestedUpdates = null, isFlushingPassiveEffects = !1, didScheduleUpdateDuringPassiveEffects = !1, NESTED_PASSIVE_UPDATE_LIMIT = 50, nestedPassiveUpdateCount = 0, rootWithPassiveNestedUpdates = null, isRunningInsertionEffect = !1, didWarnStateUpdateForNotYetMountedComponent = null, didWarnAboutUpdateInRender = !1, didWarnAboutUpdateInRenderForAnotherComponent = /* @__PURE__ */ new Set, fakeActCallbackNode = {}, resolveFamily2 = null, failedBoundaries = null, hasBadMapPolyfill = !1;
    try {
      var nonExtensibleObject = Object.preventExtensions({});
      ;
    } catch (e) {
      hasBadMapPolyfill = !0;
    }
    var didWarnAboutNestedUpdates = !1, didWarnAboutFindNodeInStrictMode = {}, overrideHookState = null, overrideHookStateDeletePath = null, overrideHookStateRenamePath = null, overrideProps = null, overridePropsDeletePath = null, overridePropsRenamePath = null, scheduleUpdate = null, scheduleRetry = null, setErrorHandler = null, setSuspenseHandler = null;
    return overrideHookState = function(fiber, id, path12, value) {
      id = findHook(fiber, id), id !== null && (path12 = copyWithSetImpl(id.memoizedState, path12, 0, value), id.memoizedState = path12, id.baseState = path12, fiber.memoizedProps = assign({}, fiber.memoizedProps), path12 = enqueueConcurrentRenderForLane(fiber, 2), path12 !== null && scheduleUpdateOnFiber(path12, fiber, 2));
    }, overrideHookStateDeletePath = function(fiber, id, path12) {
      id = findHook(fiber, id), id !== null && (path12 = copyWithDeleteImpl(id.memoizedState, path12, 0), id.memoizedState = path12, id.baseState = path12, fiber.memoizedProps = assign({}, fiber.memoizedProps), path12 = enqueueConcurrentRenderForLane(fiber, 2), path12 !== null && scheduleUpdateOnFiber(path12, fiber, 2));
    }, overrideHookStateRenamePath = function(fiber, id, oldPath, newPath) {
      id = findHook(fiber, id), id !== null && (oldPath = copyWithRename(id.memoizedState, oldPath, newPath), id.memoizedState = oldPath, id.baseState = oldPath, fiber.memoizedProps = assign({}, fiber.memoizedProps), oldPath = enqueueConcurrentRenderForLane(fiber, 2), oldPath !== null && scheduleUpdateOnFiber(oldPath, fiber, 2));
    }, overrideProps = function(fiber, path12, value) {
      fiber.pendingProps = copyWithSetImpl(fiber.memoizedProps, path12, 0, value), fiber.alternate && (fiber.alternate.pendingProps = fiber.pendingProps), path12 = enqueueConcurrentRenderForLane(fiber, 2), path12 !== null && scheduleUpdateOnFiber(path12, fiber, 2);
    }, overridePropsDeletePath = function(fiber, path12) {
      fiber.pendingProps = copyWithDeleteImpl(fiber.memoizedProps, path12, 0), fiber.alternate && (fiber.alternate.pendingProps = fiber.pendingProps), path12 = enqueueConcurrentRenderForLane(fiber, 2), path12 !== null && scheduleUpdateOnFiber(path12, fiber, 2);
    }, overridePropsRenamePath = function(fiber, oldPath, newPath) {
      fiber.pendingProps = copyWithRename(fiber.memoizedProps, oldPath, newPath), fiber.alternate && (fiber.alternate.pendingProps = fiber.pendingProps), oldPath = enqueueConcurrentRenderForLane(fiber, 2), oldPath !== null && scheduleUpdateOnFiber(oldPath, fiber, 2);
    }, scheduleUpdate = function(fiber) {
      var root2 = enqueueConcurrentRenderForLane(fiber, 2);
      root2 !== null && scheduleUpdateOnFiber(root2, fiber, 2);
    }, scheduleRetry = function(fiber) {
      var lane = claimNextRetryLane(), root2 = enqueueConcurrentRenderForLane(fiber, lane);
      root2 !== null && scheduleUpdateOnFiber(root2, fiber, lane);
    }, setErrorHandler = function(newShouldErrorImpl) {
      shouldErrorImpl = newShouldErrorImpl;
    }, setSuspenseHandler = function(newShouldSuspendImpl) {
      shouldSuspendImpl = newShouldSuspendImpl;
    }, exports2.attemptContinuousHydration = function(fiber) {
      if (fiber.tag === 13 || fiber.tag === 31) {
        var root2 = enqueueConcurrentRenderForLane(fiber, 67108864);
        root2 !== null && scheduleUpdateOnFiber(root2, fiber, 67108864), markRetryLaneIfNotHydrated(fiber, 67108864);
      }
    }, exports2.attemptHydrationAtCurrentPriority = function(fiber) {
      if (fiber.tag === 13 || fiber.tag === 31) {
        var lane = requestUpdateLane(fiber);
        lane = getBumpedLaneForHydrationByLane(lane);
        var root2 = enqueueConcurrentRenderForLane(fiber, lane);
        root2 !== null && scheduleUpdateOnFiber(root2, fiber, lane), markRetryLaneIfNotHydrated(fiber, lane);
      }
    }, exports2.attemptSynchronousHydration = function(fiber) {
      switch (fiber.tag) {
        case 3:
          if (fiber = fiber.stateNode, fiber.current.memoizedState.isDehydrated) {
            var lanes = getHighestPriorityLanes(fiber.pendingLanes);
            if (lanes !== 0) {
              fiber.pendingLanes |= 2;
              for (fiber.entangledLanes |= 2;lanes; ) {
                var lane = 1 << 31 - clz32(lanes);
                fiber.entanglements[1] |= lane, lanes &= ~lane;
              }
              ensureRootIsScheduled(fiber), (executionContext & (RenderContext | CommitContext)) === NoContext && (workInProgressRootRenderTargetTime = now$1() + RENDER_TIMEOUT_MS, flushSyncWorkAcrossRoots_impl(0, !1));
            }
          }
          break;
        case 31:
        case 13:
          lanes = enqueueConcurrentRenderForLane(fiber, 2), lanes !== null && scheduleUpdateOnFiber(lanes, fiber, 2), flushSyncWork(), markRetryLaneIfNotHydrated(fiber, 2);
      }
    }, exports2.batchedUpdates = function(fn, a2) {
      return fn(a2);
    }, exports2.createComponentSelector = function(component) {
      return { $$typeof: COMPONENT_TYPE, value: component };
    }, exports2.createContainer = function(containerInfo, tag, hydrationCallbacks, isStrictMode, concurrentUpdatesByDefaultOverride, identifierPrefix, onUncaughtError, onCaughtError, onRecoverableError, onDefaultTransitionIndicator) {
      return createFiberRoot(containerInfo, tag, !1, null, hydrationCallbacks, isStrictMode, identifierPrefix, null, onUncaughtError, onCaughtError, onRecoverableError, onDefaultTransitionIndicator);
    }, exports2.createHasPseudoClassSelector = function(selectors) {
      return { $$typeof: HAS_PSEUDO_CLASS_TYPE, value: selectors };
    }, exports2.createHydrationContainer = function(initialChildren, callback, containerInfo, tag, hydrationCallbacks, isStrictMode, concurrentUpdatesByDefaultOverride, identifierPrefix, onUncaughtError, onCaughtError, onRecoverableError, onDefaultTransitionIndicator, transitionCallbacks, formState) {
      return initialChildren = createFiberRoot(containerInfo, tag, !0, initialChildren, hydrationCallbacks, isStrictMode, identifierPrefix, formState, onUncaughtError, onCaughtError, onRecoverableError, onDefaultTransitionIndicator), initialChildren.context = getContextForSubtree(null), containerInfo = initialChildren.current, tag = requestUpdateLane(containerInfo), tag = getBumpedLaneForHydrationByLane(tag), hydrationCallbacks = createUpdate(tag), hydrationCallbacks.callback = callback !== void 0 && callback !== null ? callback : null, enqueueUpdate(containerInfo, hydrationCallbacks, tag), startUpdateTimerByLane(tag, "hydrateRoot()", null), callback = tag, initialChildren.current.lanes = callback, markRootUpdated$1(initialChildren, callback), ensureRootIsScheduled(initialChildren), initialChildren;
    }, exports2.createPortal = function(children, containerInfo, implementation) {
      var key = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
      try {
        testStringCoercion(key);
        var JSCompiler_inline_result = !1;
      } catch (e$6) {
        JSCompiler_inline_result = !0;
      }
      return JSCompiler_inline_result && (console.error("The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", typeof Symbol === "function" && Symbol.toStringTag && key[Symbol.toStringTag] || key.constructor.name || "Object"), testStringCoercion(key)), {
        $$typeof: REACT_PORTAL_TYPE,
        key: key == null ? null : "" + key,
        children,
        containerInfo,
        implementation
      };
    }, exports2.createRoleSelector = function(role) {
      return { $$typeof: ROLE_TYPE, value: role };
    }, exports2.createTestNameSelector = function(id) {
      return { $$typeof: TEST_NAME_TYPE, value: id };
    }, exports2.createTextSelector = function(text) {
      return { $$typeof: TEXT_TYPE, value: text };
    }, exports2.defaultOnCaughtError = function(error44) {
      var componentNameMessage = componentName ? "The above error occurred in the <" + componentName + "> component." : "The above error occurred in one of your React components.", recreateMessage = "React will try to recreate this component tree from scratch using the error boundary you provided, " + ((errorBoundaryName || "Anonymous") + ".");
      typeof error44 === "object" && error44 !== null && typeof error44.environmentName === "string" ? bindToConsole("error", [`%o

%s

%s
`, error44, componentNameMessage, recreateMessage], error44.environmentName)() : console.error(`%o

%s

%s
`, error44, componentNameMessage, recreateMessage);
    }, exports2.defaultOnRecoverableError = function(error44) {
      reportGlobalError(error44);
    }, exports2.defaultOnUncaughtError = function(error44) {
      reportGlobalError(error44), console.warn(`%s

%s
`, componentName ? "An error occurred in the <" + componentName + "> component." : "An error occurred in one of your React components.", `Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://react.dev/link/error-boundaries to learn more about error boundaries.`);
    }, exports2.deferredUpdates = function(fn) {
      var prevTransition = ReactSharedInternals.T, previousPriority = getCurrentUpdatePriority();
      try {
        return setCurrentUpdatePriority(32), ReactSharedInternals.T = null, fn();
      } finally {
        setCurrentUpdatePriority(previousPriority), ReactSharedInternals.T = prevTransition;
      }
    }, exports2.discreteUpdates = function(fn, a2, b, c3, d) {
      var prevTransition = ReactSharedInternals.T, previousPriority = getCurrentUpdatePriority();
      try {
        return setCurrentUpdatePriority(2), ReactSharedInternals.T = null, fn(a2, b, c3, d);
      } finally {
        setCurrentUpdatePriority(previousPriority), ReactSharedInternals.T = prevTransition, executionContext === NoContext && (workInProgressRootRenderTargetTime = now$1() + RENDER_TIMEOUT_MS);
      }
    }, exports2.findAllNodes = findAllNodes, exports2.findBoundingRects = function(hostRoot, selectors) {
      if (!supportsTestSelectors)
        throw Error("Test selector API is not supported by this renderer.");
      selectors = findAllNodes(hostRoot, selectors), hostRoot = [];
      for (var i4 = 0;i4 < selectors.length; i4++)
        hostRoot.push(getBoundingRect(selectors[i4]));
      for (selectors = hostRoot.length - 1;0 < selectors; selectors--) {
        i4 = hostRoot[selectors];
        for (var targetLeft = i4.x, targetRight = targetLeft + i4.width, targetTop = i4.y, targetBottom = targetTop + i4.height, j4 = selectors - 1;0 <= j4; j4--)
          if (selectors !== j4) {
            var otherRect = hostRoot[j4], otherLeft = otherRect.x, otherRight = otherLeft + otherRect.width, otherTop = otherRect.y, otherBottom = otherTop + otherRect.height;
            if (targetLeft >= otherLeft && targetTop >= otherTop && targetRight <= otherRight && targetBottom <= otherBottom) {
              hostRoot.splice(selectors, 1);
              break;
            } else if (!(targetLeft !== otherLeft || i4.width !== otherRect.width || otherBottom < targetTop || otherTop > targetBottom)) {
              otherTop > targetTop && (otherRect.height += otherTop - targetTop, otherRect.y = targetTop), otherBottom < targetBottom && (otherRect.height = targetBottom - otherTop), hostRoot.splice(selectors, 1);
              break;
            } else if (!(targetTop !== otherTop || i4.height !== otherRect.height || otherRight < targetLeft || otherLeft > targetRight)) {
              otherLeft > targetLeft && (otherRect.width += otherLeft - targetLeft, otherRect.x = targetLeft), otherRight < targetRight && (otherRect.width = targetRight - otherLeft), hostRoot.splice(selectors, 1);
              break;
            }
          }
      }
      return hostRoot;
    }, exports2.findHostInstance = function(component) {
      var fiber = component._reactInternals;
      if (fiber === void 0) {
        if (typeof component.render === "function")
          throw Error("Unable to find node on an unmounted component.");
        throw component = Object.keys(component).join(","), Error("Argument appears to not be a ReactComponent. Keys: " + component);
      }
      return component = findCurrentHostFiber(fiber), component === null ? null : getPublicInstance(component.stateNode);
    }, exports2.findHostInstanceWithNoPortals = function(fiber) {
      return fiber = findCurrentFiberUsingSlowPath(fiber), fiber = fiber !== null ? findCurrentHostFiberWithNoPortalsImpl(fiber) : null, fiber === null ? null : getPublicInstance(fiber.stateNode);
    }, exports2.findHostInstanceWithWarning = function(component, methodName) {
      var fiber = component._reactInternals;
      if (fiber === void 0) {
        if (typeof component.render === "function")
          throw Error("Unable to find node on an unmounted component.");
        throw component = Object.keys(component).join(","), Error("Argument appears to not be a ReactComponent. Keys: " + component);
      }
      if (component = findCurrentHostFiber(fiber), component === null)
        return null;
      if (component.mode & 8) {
        var componentName2 = getComponentNameFromFiber(fiber) || "Component";
        didWarnAboutFindNodeInStrictMode[componentName2] || (didWarnAboutFindNodeInStrictMode[componentName2] = !0, runWithFiberInDEV(component, function() {
          fiber.mode & 8 ? console.error("%s is deprecated in StrictMode. %s was passed an instance of %s which is inside StrictMode. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://react.dev/link/strict-mode-find-node", methodName, methodName, componentName2) : console.error("%s is deprecated in StrictMode. %s was passed an instance of %s which renders StrictMode children. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://react.dev/link/strict-mode-find-node", methodName, methodName, componentName2);
        }));
      }
      return getPublicInstance(component.stateNode);
    }, exports2.flushPassiveEffects = flushPendingEffects, exports2.flushSyncFromReconciler = function(fn) {
      var prevExecutionContext = executionContext;
      executionContext |= 1;
      var prevTransition = ReactSharedInternals.T, previousPriority = getCurrentUpdatePriority();
      try {
        if (setCurrentUpdatePriority(2), ReactSharedInternals.T = null, fn)
          return fn();
      } finally {
        setCurrentUpdatePriority(previousPriority), ReactSharedInternals.T = prevTransition, executionContext = prevExecutionContext, (executionContext & (RenderContext | CommitContext)) === NoContext && flushSyncWorkAcrossRoots_impl(0, !1);
      }
    }, exports2.flushSyncWork = flushSyncWork, exports2.focusWithin = function(hostRoot, selectors) {
      if (!supportsTestSelectors)
        throw Error("Test selector API is not supported by this renderer.");
      hostRoot = findFiberRootForHostRoot(hostRoot), selectors = findPaths(hostRoot, selectors), selectors = Array.from(selectors);
      for (hostRoot = 0;hostRoot < selectors.length; ) {
        var fiber = selectors[hostRoot++], tag = fiber.tag;
        if (!isHiddenSubtree(fiber)) {
          if ((tag === 5 || tag === 26 || tag === 27) && setFocusIfFocusable(fiber.stateNode))
            return !0;
          for (fiber = fiber.child;fiber !== null; )
            selectors.push(fiber), fiber = fiber.sibling;
        }
      }
      return !1;
    }, exports2.getFindAllNodesFailureDescription = function(hostRoot, selectors) {
      if (!supportsTestSelectors)
        throw Error("Test selector API is not supported by this renderer.");
      var maxSelectorIndex = 0, matchedNames = [];
      hostRoot = [findFiberRootForHostRoot(hostRoot), 0];
      for (var index = 0;index < hostRoot.length; ) {
        var fiber = hostRoot[index++], tag = fiber.tag, selectorIndex = hostRoot[index++], selector = selectors[selectorIndex];
        if (tag !== 5 && tag !== 26 && tag !== 27 || !isHiddenSubtree(fiber)) {
          if (matchSelector(fiber, selector) && (matchedNames.push(selectorToString(selector)), selectorIndex++, selectorIndex > maxSelectorIndex && (maxSelectorIndex = selectorIndex)), selectorIndex < selectors.length)
            for (fiber = fiber.child;fiber !== null; )
              hostRoot.push(fiber, selectorIndex), fiber = fiber.sibling;
        }
      }
      if (maxSelectorIndex < selectors.length) {
        for (hostRoot = [];maxSelectorIndex < selectors.length; maxSelectorIndex++)
          hostRoot.push(selectorToString(selectors[maxSelectorIndex]));
        return `findAllNodes was able to match part of the selector:
  ` + (matchedNames.join(" > ") + `

No matching component was found for:
  `) + hostRoot.join(" > ");
      }
      return null;
    }, exports2.getPublicRootInstance = function(container) {
      if (container = container.current, !container.child)
        return null;
      switch (container.child.tag) {
        case 27:
        case 5:
          return getPublicInstance(container.child.stateNode);
        default:
          return container.child.stateNode;
      }
    }, exports2.injectIntoDevTools = function() {
      var internals = {
        bundleType: 1,
        version: rendererVersion,
        rendererPackageName,
        currentDispatcherRef: ReactSharedInternals,
        reconcilerVersion: "19.2.0"
      };
      return extraDevToolsConfig !== null && (internals.rendererConfig = extraDevToolsConfig), internals.overrideHookState = overrideHookState, internals.overrideHookStateDeletePath = overrideHookStateDeletePath, internals.overrideHookStateRenamePath = overrideHookStateRenamePath, internals.overrideProps = overrideProps, internals.overridePropsDeletePath = overridePropsDeletePath, internals.overridePropsRenamePath = overridePropsRenamePath, internals.scheduleUpdate = scheduleUpdate, internals.scheduleRetry = scheduleRetry, internals.setErrorHandler = setErrorHandler, internals.setSuspenseHandler = setSuspenseHandler, internals.scheduleRefresh = scheduleRefresh, internals.scheduleRoot = scheduleRoot, internals.setRefreshHandler = setRefreshHandler, internals.getCurrentFiber = getCurrentFiberForDevTools, injectInternals(internals);
    }, exports2.isAlreadyRendering = isAlreadyRendering, exports2.observeVisibleRects = function(hostRoot, selectors, callback, options) {
      function commitHook() {
        var nextInstanceRoots = findAllNodes(hostRoot, selectors);
        instanceRoots.forEach(function(target) {
          0 > nextInstanceRoots.indexOf(target) && unobserve(target);
        }), nextInstanceRoots.forEach(function(target) {
          0 > instanceRoots.indexOf(target) && observe(target);
        });
      }
      if (!supportsTestSelectors)
        throw Error("Test selector API is not supported by this renderer.");
      var instanceRoots = findAllNodes(hostRoot, selectors);
      callback = setupIntersectionObserver(instanceRoots, callback, options);
      var { disconnect: disconnect2, observe, unobserve } = callback;
      return commitHooks.push(commitHook), {
        disconnect: function() {
          var index = commitHooks.indexOf(commitHook);
          0 <= index && commitHooks.splice(index, 1), disconnect2();
        }
      };
    }, exports2.shouldError = function(fiber) {
      return shouldErrorImpl(fiber);
    }, exports2.shouldSuspend = function(fiber) {
      return shouldSuspendImpl(fiber);
    }, exports2.startHostTransition = function(formFiber, pendingState, action, formData) {
      if (formFiber.tag !== 5)
        throw Error("Expected the form instance to be a HostComponent. This is a bug in React.");
      var queue = ensureFormComponentIsStateful(formFiber).queue;
      startHostActionTimer(formFiber), startTransition(formFiber, queue, pendingState, NotPendingTransition, action === null ? noop8 : function() {
        ReactSharedInternals.T === null && console.error("requestFormReset was called outside a transition or action. To fix, move to an action, or wrap with startTransition.");
        var stateHook = ensureFormComponentIsStateful(formFiber);
        return stateHook.next === null && (stateHook = formFiber.alternate.memoizedState), dispatchSetStateInternal(formFiber, stateHook.next.queue, {}, requestUpdateLane(formFiber)), action(formData);
      });
    }, exports2.updateContainer = function(element, container, parentComponent, callback) {
      var current2 = container.current, lane = requestUpdateLane(current2);
      return updateContainerImpl(current2, lane, element, container, parentComponent, callback), lane;
    }, exports2.updateContainerSync = updateContainerSync, exports2;
  }, module.exports.default = module.exports, Object.defineProperty(module.exports, "__esModule", { value: !0 });
});
