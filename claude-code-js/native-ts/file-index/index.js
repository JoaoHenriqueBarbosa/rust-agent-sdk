// Original: src/native-ts/file-index/index.ts
class FileIndex {
  paths = [];
  lowerPaths = [];
  charBits = new Int32Array(0);
  pathLens = new Uint16Array(0);
  topLevelCache = null;
  readyCount = 0;
  loadFromFileList(fileList) {
    let seen = /* @__PURE__ */ new Set, paths2 = [];
    for (let line of fileList)
      if (line.length > 0 && !seen.has(line))
        seen.add(line), paths2.push(line);
    this.buildIndex(paths2);
  }
  loadFromFileListAsync(fileList) {
    let markQueryable = () => {}, queryable = new Promise((resolve41) => {
      markQueryable = resolve41;
    }), done = this.buildAsync(fileList, markQueryable);
    return { queryable, done };
  }
  async buildAsync(fileList, markQueryable) {
    let seen = /* @__PURE__ */ new Set, paths2 = [], chunkStart = performance.now();
    for (let i5 = 0;i5 < fileList.length; i5++) {
      let line = fileList[i5];
      if (line.length > 0 && !seen.has(line))
        seen.add(line), paths2.push(line);
      if ((i5 & 255) === 255 && performance.now() - chunkStart > 4)
        await yieldToEventLoop(), chunkStart = performance.now();
    }
    this.resetArrays(paths2), chunkStart = performance.now();
    let firstChunk = !0;
    for (let i5 = 0;i5 < paths2.length; i5++)
      if (this.indexPath(i5), (i5 & 255) === 255 && performance.now() - chunkStart > 4) {
        if (this.readyCount = i5 + 1, firstChunk)
          markQueryable(), firstChunk = !1;
        await yieldToEventLoop(), chunkStart = performance.now();
      }
    this.readyCount = paths2.length, markQueryable();
  }
  buildIndex(paths2) {
    this.resetArrays(paths2);
    for (let i5 = 0;i5 < paths2.length; i5++)
      this.indexPath(i5);
    this.readyCount = paths2.length;
  }
  resetArrays(paths2) {
    let n5 = paths2.length;
    this.paths = paths2, this.lowerPaths = Array(n5), this.charBits = new Int32Array(n5), this.pathLens = new Uint16Array(n5), this.readyCount = 0, this.topLevelCache = computeTopLevelEntries(paths2, 100);
  }
  indexPath(i5) {
    let lp = this.paths[i5].toLowerCase();
    this.lowerPaths[i5] = lp;
    let len = lp.length;
    this.pathLens[i5] = len;
    let bits2 = 0;
    for (let j4 = 0;j4 < len; j4++) {
      let c3 = lp.charCodeAt(j4);
      if (c3 >= 97 && c3 <= 122)
        bits2 |= 1 << c3 - 97;
    }
    this.charBits[i5] = bits2;
  }
  search(query3, limit) {
    if (limit <= 0)
      return [];
    if (query3.length === 0) {
      if (this.topLevelCache)
        return this.topLevelCache.slice(0, limit);
      return [];
    }
    let caseSensitive = query3 !== query3.toLowerCase(), needle = caseSensitive ? query3 : query3.toLowerCase(), nLen = Math.min(needle.length, 64), needleChars = Array(nLen), needleBitmap = 0;
    for (let j4 = 0;j4 < nLen; j4++) {
      let ch2 = needle.charAt(j4);
      needleChars[j4] = ch2;
      let cc = ch2.charCodeAt(0);
      if (cc >= 97 && cc <= 122)
        needleBitmap |= 1 << cc - 97;
    }
    let scoreCeiling = nLen * 24 + 8 + 32, topK = [], threshold = -1 / 0, { paths: paths2, lowerPaths, charBits, pathLens, readyCount } = this;
    outer:
      for (let i5 = 0;i5 < readyCount; i5++) {
        if ((charBits[i5] & needleBitmap) !== needleBitmap)
          continue;
        let haystack = caseSensitive ? paths2[i5] : lowerPaths[i5], pos = haystack.indexOf(needleChars[0]);
        if (pos === -1)
          continue;
        posBuf[0] = pos;
        let gapPenalty = 0, consecBonus = 0, prev = pos;
        for (let j4 = 1;j4 < nLen; j4++) {
          if (pos = haystack.indexOf(needleChars[j4], prev + 1), pos === -1)
            continue outer;
          posBuf[j4] = pos;
          let gap = pos - prev - 1;
          if (gap === 0)
            consecBonus += 4;
          else
            gapPenalty += 3 + gap * 1;
          prev = pos;
        }
        if (topK.length === limit && scoreCeiling + consecBonus - gapPenalty <= threshold)
          continue;
        let path21 = paths2[i5], hLen = pathLens[i5], score = nLen * 16 + consecBonus - gapPenalty;
        score += scoreBonusAt(path21, posBuf[0], !0);
        for (let j4 = 1;j4 < nLen; j4++)
          score += scoreBonusAt(path21, posBuf[j4], !1);
        if (score += Math.max(0, 32 - (hLen >> 2)), topK.length < limit) {
          if (topK.push({ path: path21, fuzzScore: score }), topK.length === limit)
            topK.sort((a2, b) => a2.fuzzScore - b.fuzzScore), threshold = topK[0].fuzzScore;
        } else if (score > threshold) {
          let lo = 0, hi = topK.length;
          while (lo < hi) {
            let mid = lo + hi >> 1;
            if (topK[mid].fuzzScore < score)
              lo = mid + 1;
            else
              hi = mid;
          }
          topK.splice(lo, 0, { path: path21, fuzzScore: score }), topK.shift(), threshold = topK[0].fuzzScore;
        }
      }
    topK.sort((a2, b) => b.fuzzScore - a2.fuzzScore);
    let matchCount = topK.length, denom = Math.max(matchCount, 1), results = Array(matchCount);
    for (let i5 = 0;i5 < matchCount; i5++) {
      let path21 = topK[i5].path, positionScore = i5 / denom, finalScore = path21.includes("test") ? Math.min(positionScore * 1.05, 1) : positionScore;
      results[i5] = { path: path21, score: finalScore };
    }
    return results;
  }
}
function scoreBonusAt(path21, pos, first) {
  if (pos === 0)
    return first ? 8 : 0;
  let prevCh = path21.charCodeAt(pos - 1);
  if (isBoundary(prevCh))
    return 8;
  if (isLower(prevCh) && isUpper(path21.charCodeAt(pos)))
    return 6;
  return 0;
}
function isBoundary(code) {
  return code === 47 || code === 92 || code === 45 || code === 95 || code === 46 || code === 32;
}
function isLower(code) {
  return code >= 97 && code <= 122;
}
function isUpper(code) {
  return code >= 65 && code <= 90;
}
function yieldToEventLoop() {
  return new Promise((resolve41) => setImmediate(resolve41));
}
function computeTopLevelEntries(paths2, limit) {
  let topLevel = /* @__PURE__ */ new Set;
  for (let p4 of paths2) {
    let end = p4.length;
    for (let i5 = 0;i5 < p4.length; i5++) {
      let c3 = p4.charCodeAt(i5);
      if (c3 === 47 || c3 === 92) {
        end = i5;
        break;
      }
    }
    let segment = p4.slice(0, end);
    if (segment.length > 0) {
      if (topLevel.add(segment), topLevel.size >= limit)
        break;
    }
  }
  let sorted = Array.from(topLevel);
  return sorted.sort((a2, b) => {
    let lenDiff = a2.length - b.length;
    if (lenDiff !== 0)
      return lenDiff;
    return a2 < b ? -1 : a2 > b ? 1 : 0;
  }), sorted.slice(0, limit).map((path21) => ({ path: path21, score: 0 }));
}
var CHUNK_MS = 4, posBuf;
var init_file_index = __esm(() => {
  posBuf = new Int32Array(64);
});
