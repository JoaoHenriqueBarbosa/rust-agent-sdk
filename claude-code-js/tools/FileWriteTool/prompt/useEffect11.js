// function: useEffect11
function useEffect11(cb, depArray) {
  withPointer((pointer) => {
    let oldDeps = pointer.get();
    if (!Array.isArray(oldDeps) || depArray.some((dep, i4) => !Object.is(dep, oldDeps[i4])))
      effectScheduler.queue(cb);
    pointer.set(depArray);
  });
}
