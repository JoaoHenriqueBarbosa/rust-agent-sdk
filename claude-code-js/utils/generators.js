// Original: src/utils/generators.ts
async function returnValue(as) {
  let e;
  do
    e = await as.next();
  while (!e.done);
  return e.value;
}
async function* all3(generators, concurrencyCap = 1 / 0) {
  let next = (generator) => {
    let promise2 = generator.next().then(({ done, value }) => ({
      done,
      value,
      generator,
      promise: promise2
    }));
    return promise2;
  }, waiting = [...generators], promises = /* @__PURE__ */ new Set;
  while (promises.size < concurrencyCap && waiting.length > 0) {
    let gen = waiting.shift();
    promises.add(next(gen));
  }
  while (promises.size > 0) {
    let { done, value, generator, promise: promise2 } = await Promise.race(promises);
    if (promises.delete(promise2), !done) {
      if (promises.add(next(generator)), value !== void 0)
        yield value;
    } else if (waiting.length > 0) {
      let nextGen = waiting.shift();
      promises.add(next(nextGen));
    }
  }
}
async function toArray2(generator) {
  let result = [];
  for await (let a2 of generator)
    result.push(a2);
  return result;
}
async function* fromArray(values3) {
  for (let value of values3)
    yield value;
}
var NO_VALUE;
var init_generators = __esm(() => {
  NO_VALUE = Symbol("NO_VALUE");
});
