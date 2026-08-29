// var: initializeConcurrentStreams
var initializeConcurrentStreams = () => ({
  readableDestroy: /* @__PURE__ */ new WeakMap,
  writableFinal: /* @__PURE__ */ new WeakMap,
  writableDestroy: /* @__PURE__ */ new WeakMap
}), addConcurrentStream = (concurrentStreams, stream, waitName) => {
  let weakMap = concurrentStreams[waitName];
  if (!weakMap.has(stream))
    weakMap.set(stream, []);
  let promises = weakMap.get(stream), promise2 = createDeferred();
  return promises.push(promise2), { resolve: promise2.resolve.bind(promise2), promises };
}, waitForConcurrentStreams = async ({ resolve: resolve2, promises }, subprocess) => {
  resolve2();
  let [isSubprocessExit] = await Promise.race([
    Promise.allSettled([!0, subprocess]),
    Promise.all([!1, ...promises])
  ]);
  return !isSubprocessExit;
};
