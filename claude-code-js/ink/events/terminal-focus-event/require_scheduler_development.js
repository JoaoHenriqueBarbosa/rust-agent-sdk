// var: require_scheduler_development
var require_scheduler_development = __commonJS((exports) => {
  (function() {
    function performWorkUntilDeadline() {
      if (needsPaint = !1, isMessageLoopRunning) {
        var currentTime = exports.unstable_now();
        startTime = currentTime;
        var hasMoreWork = !0;
        try {
          a: {
            isHostCallbackScheduled = !1, isHostTimeoutScheduled && (isHostTimeoutScheduled = !1, localClearTimeout(taskTimeoutID), taskTimeoutID = -1), isPerformingWork = !0;
            var previousPriorityLevel = currentPriorityLevel;
            try {
              b: {
                advanceTimers(currentTime);
                for (currentTask = peek(taskQueue);currentTask !== null && !(currentTask.expirationTime > currentTime && shouldYieldToHost()); ) {
                  var callback = currentTask.callback;
                  if (typeof callback === "function") {
                    currentTask.callback = null, currentPriorityLevel = currentTask.priorityLevel;
                    var continuationCallback = callback(currentTask.expirationTime <= currentTime);
                    if (currentTime = exports.unstable_now(), typeof continuationCallback === "function") {
                      currentTask.callback = continuationCallback, advanceTimers(currentTime), hasMoreWork = !0;
                      break b;
                    }
                    currentTask === peek(taskQueue) && pop(taskQueue), advanceTimers(currentTime);
                  } else
                    pop(taskQueue);
                  currentTask = peek(taskQueue);
                }
                if (currentTask !== null)
                  hasMoreWork = !0;
                else {
                  var firstTimer = peek(timerQueue);
                  firstTimer !== null && requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime), hasMoreWork = !1;
                }
              }
              break a;
            } finally {
              currentTask = null, currentPriorityLevel = previousPriorityLevel, isPerformingWork = !1;
            }
            hasMoreWork = void 0;
          }
        } finally {
          hasMoreWork ? schedulePerformWorkUntilDeadline() : isMessageLoopRunning = !1;
        }
      }
    }
    function push(heap, node) {
      var index = heap.length;
      heap.push(node);
      a:
        for (;0 < index; ) {
          var parentIndex = index - 1 >>> 1, parent = heap[parentIndex];
          if (0 < compare(parent, node))
            heap[parentIndex] = node, heap[index] = parent, index = parentIndex;
          else
            break a;
        }
    }
    function peek(heap) {
      return heap.length === 0 ? null : heap[0];
    }
    function pop(heap) {
      if (heap.length === 0)
        return null;
      var first = heap[0], last = heap.pop();
      if (last !== first) {
        heap[0] = last;
        a:
          for (var index = 0, length = heap.length, halfLength = length >>> 1;index < halfLength; ) {
            var leftIndex = 2 * (index + 1) - 1, left = heap[leftIndex], rightIndex = leftIndex + 1, right = heap[rightIndex];
            if (0 > compare(left, last))
              rightIndex < length && 0 > compare(right, left) ? (heap[index] = right, heap[rightIndex] = last, index = rightIndex) : (heap[index] = left, heap[leftIndex] = last, index = leftIndex);
            else if (rightIndex < length && 0 > compare(right, last))
              heap[index] = right, heap[rightIndex] = last, index = rightIndex;
            else
              break a;
          }
      }
      return first;
    }
    function compare(a2, b) {
      var diff = a2.sortIndex - b.sortIndex;
      return diff !== 0 ? diff : a2.id - b.id;
    }
    function advanceTimers(currentTime) {
      for (var timer = peek(timerQueue);timer !== null; ) {
        if (timer.callback === null)
          pop(timerQueue);
        else if (timer.startTime <= currentTime)
          pop(timerQueue), timer.sortIndex = timer.expirationTime, push(taskQueue, timer);
        else
          break;
        timer = peek(timerQueue);
      }
    }
    function handleTimeout(currentTime) {
      if (isHostTimeoutScheduled = !1, advanceTimers(currentTime), !isHostCallbackScheduled)
        if (peek(taskQueue) !== null)
          isHostCallbackScheduled = !0, isMessageLoopRunning || (isMessageLoopRunning = !0, schedulePerformWorkUntilDeadline());
        else {
          var firstTimer = peek(timerQueue);
          firstTimer !== null && requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
        }
    }
    function shouldYieldToHost() {
      return needsPaint ? !0 : exports.unstable_now() - startTime < frameInterval ? !1 : !0;
    }
    function requestHostTimeout(callback, ms) {
      taskTimeoutID = localSetTimeout(function() {
        callback(exports.unstable_now());
      }, ms);
    }
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart === "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error()), exports.unstable_now = void 0, typeof performance === "object" && typeof performance.now === "function") {
      var localPerformance = performance;
      exports.unstable_now = function() {
        return localPerformance.now();
      };
    } else {
      var localDate = Date, initialTime = localDate.now();
      exports.unstable_now = function() {
        return localDate.now() - initialTime;
      };
    }
    var taskQueue = [], timerQueue = [], taskIdCounter = 1, currentTask = null, currentPriorityLevel = 3, isPerformingWork = !1, isHostCallbackScheduled = !1, isHostTimeoutScheduled = !1, needsPaint = !1, localSetTimeout = typeof setTimeout === "function" ? setTimeout : null, localClearTimeout = typeof clearTimeout === "function" ? clearTimeout : null, localSetImmediate = typeof setImmediate < "u" ? setImmediate : null, isMessageLoopRunning = !1, taskTimeoutID = -1, frameInterval = 5, startTime = -1;
    if (typeof localSetImmediate === "function")
      var schedulePerformWorkUntilDeadline = function() {
        localSetImmediate(performWorkUntilDeadline);
      };
    else if (typeof MessageChannel < "u") {
      var channel = new MessageChannel, port = channel.port2;
      channel.port1.onmessage = performWorkUntilDeadline, schedulePerformWorkUntilDeadline = function() {
        port.postMessage(null);
      };
    } else
      schedulePerformWorkUntilDeadline = function() {
        localSetTimeout(performWorkUntilDeadline, 0);
      };
    exports.unstable_IdlePriority = 5, exports.unstable_ImmediatePriority = 1, exports.unstable_LowPriority = 4, exports.unstable_NormalPriority = 3, exports.unstable_Profiling = null, exports.unstable_UserBlockingPriority = 2, exports.unstable_cancelCallback = function(task) {
      task.callback = null;
    }, exports.unstable_forceFrameRate = function(fps) {
      0 > fps || 125 < fps ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : frameInterval = 0 < fps ? Math.floor(1000 / fps) : 5;
    }, exports.unstable_getCurrentPriorityLevel = function() {
      return currentPriorityLevel;
    }, exports.unstable_next = function(eventHandler) {
      switch (currentPriorityLevel) {
        case 1:
        case 2:
        case 3:
          var priorityLevel = 3;
          break;
        default:
          priorityLevel = currentPriorityLevel;
      }
      var previousPriorityLevel = currentPriorityLevel;
      currentPriorityLevel = priorityLevel;
      try {
        return eventHandler();
      } finally {
        currentPriorityLevel = previousPriorityLevel;
      }
    }, exports.unstable_requestPaint = function() {
      needsPaint = !0;
    }, exports.unstable_runWithPriority = function(priorityLevel, eventHandler) {
      switch (priorityLevel) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          priorityLevel = 3;
      }
      var previousPriorityLevel = currentPriorityLevel;
      currentPriorityLevel = priorityLevel;
      try {
        return eventHandler();
      } finally {
        currentPriorityLevel = previousPriorityLevel;
      }
    }, exports.unstable_scheduleCallback = function(priorityLevel, callback, options) {
      var currentTime = exports.unstable_now();
      switch (typeof options === "object" && options !== null ? (options = options.delay, options = typeof options === "number" && 0 < options ? currentTime + options : currentTime) : options = currentTime, priorityLevel) {
        case 1:
          var timeout = -1;
          break;
        case 2:
          timeout = 250;
          break;
        case 5:
          timeout = 1073741823;
          break;
        case 4:
          timeout = 1e4;
          break;
        default:
          timeout = 5000;
      }
      return timeout = options + timeout, priorityLevel = {
        id: taskIdCounter++,
        callback,
        priorityLevel,
        startTime: options,
        expirationTime: timeout,
        sortIndex: -1
      }, options > currentTime ? (priorityLevel.sortIndex = options, push(timerQueue, priorityLevel), peek(taskQueue) === null && priorityLevel === peek(timerQueue) && (isHostTimeoutScheduled ? (localClearTimeout(taskTimeoutID), taskTimeoutID = -1) : isHostTimeoutScheduled = !0, requestHostTimeout(handleTimeout, options - currentTime))) : (priorityLevel.sortIndex = timeout, push(taskQueue, priorityLevel), isHostCallbackScheduled || isPerformingWork || (isHostCallbackScheduled = !0, isMessageLoopRunning || (isMessageLoopRunning = !0, schedulePerformWorkUntilDeadline()))), priorityLevel;
    }, exports.unstable_shouldYield = shouldYieldToHost, exports.unstable_wrapCallback = function(callback) {
      var parentPriorityLevel = currentPriorityLevel;
      return function() {
        var previousPriorityLevel = currentPriorityLevel;
        currentPriorityLevel = parentPriorityLevel;
        try {
          return callback.apply(this, arguments);
        } finally {
          currentPriorityLevel = previousPriorityLevel;
        }
      };
    }, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop === "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
  })();
});
