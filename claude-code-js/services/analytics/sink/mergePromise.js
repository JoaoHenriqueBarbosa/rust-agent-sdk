// var: mergePromise
var mergePromise = (subprocess, promise2) => {
  for (let [property2, descriptor] of descriptors) {
    let value = descriptor.value.bind(promise2);
    Reflect.defineProperty(subprocess, property2, { ...descriptor, value });
  }
}, nativePromisePrototype, descriptors;
