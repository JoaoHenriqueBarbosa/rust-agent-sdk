// Original: src/context/notifications.tsx
function useNotifications() {
  let store = useAppStateStore(), setAppState = useSetAppState(), processQueue = import_react84.useCallback(() => {
    setAppState((prev) => {
      let next2 = getNext(prev.notifications.queue);
      if (prev.notifications.current !== null || !next2)
        return prev;
      return currentTimeoutId = setTimeout((setAppState2, nextKey, processQueue2) => {
        currentTimeoutId = null, setAppState2((prev2) => {
          if (prev2.notifications.current?.key !== nextKey)
            return prev2;
          return {
            ...prev2,
            notifications: {
              queue: prev2.notifications.queue,
              current: null
            }
          };
        }), processQueue2();
      }, next2.timeoutMs ?? DEFAULT_TIMEOUT_MS, setAppState, next2.key, processQueue), {
        ...prev,
        notifications: {
          queue: prev.notifications.queue.filter((_) => _ !== next2),
          current: next2
        }
      };
    });
  }, [setAppState]), addNotification = import_react84.useCallback((notif) => {
    if (notif.priority === "immediate") {
      if (currentTimeoutId)
        clearTimeout(currentTimeoutId), currentTimeoutId = null;
      currentTimeoutId = setTimeout((setAppState2, notif2, processQueue2) => {
        currentTimeoutId = null, setAppState2((prev) => {
          if (prev.notifications.current?.key !== notif2.key)
            return prev;
          return {
            ...prev,
            notifications: {
              queue: prev.notifications.queue.filter((_) => !notif2.invalidates?.includes(_.key)),
              current: null
            }
          };
        }), processQueue2();
      }, notif.timeoutMs ?? DEFAULT_TIMEOUT_MS, setAppState, notif, processQueue), setAppState((prev) => ({
        ...prev,
        notifications: {
          current: notif,
          queue: [...prev.notifications.current ? [prev.notifications.current] : [], ...prev.notifications.queue].filter((_) => _.priority !== "immediate" && !notif.invalidates?.includes(_.key))
        }
      }));
      return;
    }
    setAppState((prev) => {
      if (notif.fold) {
        if (prev.notifications.current?.key === notif.key) {
          let folded = notif.fold(prev.notifications.current, notif);
          if (currentTimeoutId)
            clearTimeout(currentTimeoutId), currentTimeoutId = null;
          return currentTimeoutId = setTimeout((setAppState2, foldedKey, processQueue2) => {
            currentTimeoutId = null, setAppState2((p4) => {
              if (p4.notifications.current?.key !== foldedKey)
                return p4;
              return {
                ...p4,
                notifications: {
                  queue: p4.notifications.queue,
                  current: null
                }
              };
            }), processQueue2();
          }, folded.timeoutMs ?? DEFAULT_TIMEOUT_MS, setAppState, folded.key, processQueue), {
            ...prev,
            notifications: {
              current: folded,
              queue: prev.notifications.queue
            }
          };
        }
        let queueIdx = prev.notifications.queue.findIndex((_) => _.key === notif.key);
        if (queueIdx !== -1) {
          let folded = notif.fold(prev.notifications.queue[queueIdx], notif), newQueue = [...prev.notifications.queue];
          return newQueue[queueIdx] = folded, {
            ...prev,
            notifications: {
              current: prev.notifications.current,
              queue: newQueue
            }
          };
        }
      }
      if (!(!new Set(prev.notifications.queue.map((_) => _.key)).has(notif.key) && prev.notifications.current?.key !== notif.key))
        return prev;
      let invalidatesCurrent = prev.notifications.current !== null && notif.invalidates?.includes(prev.notifications.current.key);
      if (invalidatesCurrent && currentTimeoutId)
        clearTimeout(currentTimeoutId), currentTimeoutId = null;
      return {
        ...prev,
        notifications: {
          current: invalidatesCurrent ? null : prev.notifications.current,
          queue: [...prev.notifications.queue.filter((_) => _.priority !== "immediate" && !notif.invalidates?.includes(_.key)), notif]
        }
      };
    }), processQueue();
  }, [setAppState, processQueue]), removeNotification = import_react84.useCallback((key3) => {
    setAppState((prev) => {
      let isCurrent = prev.notifications.current?.key === key3, inQueue = prev.notifications.queue.some((n5) => n5.key === key3);
      if (!isCurrent && !inQueue)
        return prev;
      if (isCurrent && currentTimeoutId)
        clearTimeout(currentTimeoutId), currentTimeoutId = null;
      return {
        ...prev,
        notifications: {
          current: isCurrent ? null : prev.notifications.current,
          queue: prev.notifications.queue.filter((n5) => n5.key !== key3)
        }
      };
    }), processQueue();
  }, [setAppState, processQueue]);
  return import_react84.useEffect(() => {
    if (store.getState().notifications.queue.length > 0)
      processQueue();
  }, []), {
    addNotification,
    removeNotification
  };
}
function getNext(queue2) {
  if (queue2.length === 0)
    return;
  return queue2.reduce((min, n5) => PRIORITIES[n5.priority] < PRIORITIES[min.priority] ? n5 : min);
}
var import_react84, DEFAULT_TIMEOUT_MS = 8000, currentTimeoutId = null, PRIORITIES;
var init_notifications = __esm(() => {
  init_AppState();
  import_react84 = __toESM(require_react_development(), 1);
  PRIORITIES = {
    immediate: 0,
    high: 1,
    medium: 2,
    low: 3
  };
});
