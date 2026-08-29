// function: localStorage2
function localStorage2() {
  if (typeof self === "object" && self.indexedDB)
    return new IndexedDbStorage;
  if (typeof window === "object" && window.localStorage)
    return window.localStorage;
  return inMemoryStorage;
}
