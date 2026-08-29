// function: useState9
function useState9(defaultValue) {
  return withPointer((pointer) => {
    let setFn = (newValue) => {
      if (pointer.get() !== newValue)
        pointer.set(newValue), handleChange2();
    };
    if (pointer.initialized)
      return [pointer.get(), setFn];
    let value = typeof defaultValue === "function" ? defaultValue() : defaultValue;
    return pointer.set(value), [value, setFn];
  });
}
