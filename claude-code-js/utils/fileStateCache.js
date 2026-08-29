// Original: src/utils/fileStateCache.ts
import { normalize as normalize9 } from "path";

class FileStateCache {
  cache;
  constructor(maxEntries, maxSizeBytes) {
    this.cache = new L({
      max: maxEntries,
      maxSize: maxSizeBytes,
      sizeCalculation: (value) => Math.max(1, Buffer.byteLength(value.content))
    });
  }
  get(key2) {
    return this.cache.get(normalize9(key2));
  }
  set(key2, value) {
    return this.cache.set(normalize9(key2), value), this;
  }
  has(key2) {
    return this.cache.has(normalize9(key2));
  }
  delete(key2) {
    return this.cache.delete(normalize9(key2));
  }
  clear() {
    this.cache.clear();
  }
  get size() {
    return this.cache.size;
  }
  get max() {
    return this.cache.max;
  }
  get maxSize() {
    return this.cache.maxSize;
  }
  get calculatedSize() {
    return this.cache.calculatedSize;
  }
  keys() {
    return this.cache.keys();
  }
  entries() {
    return this.cache.entries();
  }
  dump() {
    return this.cache.dump();
  }
  load(entries) {
    this.cache.load(entries);
  }
}
function createFileStateCacheWithSizeLimit(maxEntries, maxSizeBytes = DEFAULT_MAX_CACHE_SIZE_BYTES) {
  return new FileStateCache(maxEntries, maxSizeBytes);
}
function cacheToObject(cache5) {
  return Object.fromEntries(cache5.entries());
}
function cacheKeys(cache5) {
  return Array.from(cache5.keys());
}
function cloneFileStateCache(cache5) {
  let cloned = createFileStateCacheWithSizeLimit(cache5.max, cache5.maxSize);
  return cloned.load(cache5.dump()), cloned;
}
function mergeFileStateCaches(first, second) {
  let merged = cloneFileStateCache(first);
  for (let [filePath, fileState] of second.entries()) {
    let existing = merged.get(filePath);
    if (!existing || fileState.timestamp > existing.timestamp)
      merged.set(filePath, fileState);
  }
  return merged;
}
var READ_FILE_STATE_CACHE_SIZE = 100, DEFAULT_MAX_CACHE_SIZE_BYTES = 26214400;
var init_fileStateCache = __esm(() => {
  init_index_min();
});
