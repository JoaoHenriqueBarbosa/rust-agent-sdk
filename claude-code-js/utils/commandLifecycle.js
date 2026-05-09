// Original: src/utils/commandLifecycle.ts
function setCommandLifecycleListener(cb) {
  listener = cb;
}
function notifyCommandLifecycle(uuid8, state3) {
  listener?.(uuid8, state3);
}
var listener = null;
