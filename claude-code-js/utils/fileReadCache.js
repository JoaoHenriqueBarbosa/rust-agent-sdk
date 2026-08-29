// Original: src/utils/fileReadCache.ts
class FileReadCache {
  cache = /* @__PURE__ */ new Map;
  maxCacheSize = 1000;
  readFile(filePath) {
    let fs2 = getFsImplementation(), stats;
    try {
      stats = fs2.statSync(filePath);
    } catch (error41) {
      throw this.cache.delete(filePath), error41;
    }
    let cacheKey = filePath, cachedData = this.cache.get(cacheKey);
    if (cachedData && cachedData.mtime === stats.mtimeMs)
      return {
        content: cachedData.content,
        encoding: cachedData.encoding
      };
    let encoding = detectFileEncoding(filePath), content = fs2.readFileSync(filePath, { encoding }).replaceAll(`\r
`, `
`);
    if (this.cache.set(cacheKey, {
      content,
      encoding,
      mtime: stats.mtimeMs
    }), this.cache.size > this.maxCacheSize) {
      let firstKey = this.cache.keys().next().value;
      if (firstKey)
        this.cache.delete(firstKey);
    }
    return { content, encoding };
  }
  clear() {
    this.cache.clear();
  }
  invalidate(filePath) {
    this.cache.delete(filePath);
  }
  getStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }
}
var fileReadCache;
var init_fileReadCache = __esm(() => {
  init_file();
  init_fsOperations();
  fileReadCache = new FileReadCache;
});
