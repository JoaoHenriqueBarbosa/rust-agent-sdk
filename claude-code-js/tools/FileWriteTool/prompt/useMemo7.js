// function: useMemo7
function useMemo7(fn, dependencies) {
  return withPointer((pointer) => {
    let prev = pointer.get();
    if (!prev || prev.dependencies.length !== dependencies.length || prev.dependencies.some((dep, i4) => dep !== dependencies[i4])) {
      let value = fn();
      return pointer.set({ value, dependencies }), value;
    }
    return prev.value;
  });
}
