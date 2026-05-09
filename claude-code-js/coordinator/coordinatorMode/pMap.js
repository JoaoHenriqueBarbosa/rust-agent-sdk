// function: pMap
async function pMap(iterable, mapper, {
  concurrency = Number.POSITIVE_INFINITY,
  stopOnError = !0,
  signal
} = {}) {
  return new Promise((resolve_, reject_) => {
    if (iterable[Symbol.iterator] === void 0 && iterable[Symbol.asyncIterator] === void 0)
      throw TypeError(`Expected \`input\` to be either an \`Iterable\` or \`AsyncIterable\`, got (${typeof iterable})`);
    if (typeof mapper !== "function")
      throw TypeError("Mapper function is required");
    if (!(Number.isSafeInteger(concurrency) && concurrency >= 1 || concurrency === Number.POSITIVE_INFINITY))
      throw TypeError(`Expected \`concurrency\` to be an integer from 1 and up or \`Infinity\`, got \`${concurrency}\` (${typeof concurrency})`);
    let result = [], errors8 = [], skippedIndexesMap = /* @__PURE__ */ new Map, isRejected = !1, isResolved = !1, isIterableDone = !1, resolvingCount = 0, currentIndex = 0, iterator2 = iterable[Symbol.iterator] === void 0 ? iterable[Symbol.asyncIterator]() : iterable[Symbol.iterator](), signalListener = () => {
      reject2(signal.reason);
    }, cleanup = () => {
      signal?.removeEventListener("abort", signalListener);
    }, resolve24 = (value) => {
      resolve_(value), cleanup();
    }, reject2 = (reason) => {
      isRejected = !0, isResolved = !0, reject_(reason), cleanup();
    };
    if (signal) {
      if (signal.aborted)
        reject2(signal.reason);
      signal.addEventListener("abort", signalListener, { once: !0 });
    }
    let next = async () => {
      if (isResolved)
        return;
      let nextItem = await iterator2.next(), index = currentIndex;
      if (currentIndex++, nextItem.done) {
        if (isIterableDone = !0, resolvingCount === 0 && !isResolved) {
          if (!stopOnError && errors8.length > 0) {
            reject2(AggregateError(errors8));
            return;
          }
          if (isResolved = !0, skippedIndexesMap.size === 0) {
            resolve24(result);
            return;
          }
          let pureResult = [];
          for (let [index2, value] of result.entries()) {
            if (skippedIndexesMap.get(index2) === pMapSkip)
              continue;
            pureResult.push(value);
          }
          resolve24(pureResult);
        }
        return;
      }
      resolvingCount++, (async () => {
        try {
          let element = await nextItem.value;
          if (isResolved)
            return;
          let value = await mapper(element, index);
          if (value === pMapSkip)
            skippedIndexesMap.set(index, value);
          result[index] = value, resolvingCount--, await next();
        } catch (error44) {
          if (stopOnError)
            reject2(error44);
          else {
            errors8.push(error44), resolvingCount--;
            try {
              await next();
            } catch (error45) {
              reject2(error45);
            }
          }
        }
      })();
    };
    (async () => {
      for (let index = 0;index < concurrency; index++) {
        try {
          await next();
        } catch (error44) {
          reject2(error44);
          break;
        }
        if (isIterableDone || isRejected)
          break;
      }
    })();
  });
}
