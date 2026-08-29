// Original: src/hooks/useDiffData.ts
function useDiffData() {
  let [diffResult, setDiffResult] = import_react109.useState(null), [hunks, setHunks] = import_react109.useState(/* @__PURE__ */ new Map), [loading, setLoading] = import_react109.useState(!0);
  return import_react109.useEffect(() => {
    let cancelled = !1;
    async function loadDiffData() {
      try {
        let [statsResult, hunksResult] = await Promise.all([
          fetchGitDiff(),
          fetchGitDiffHunks()
        ]);
        if (!cancelled)
          setDiffResult(statsResult), setHunks(hunksResult), setLoading(!1);
      } catch (_error) {
        if (!cancelled)
          setDiffResult(null), setHunks(/* @__PURE__ */ new Map), setLoading(!1);
      }
    }
    return loadDiffData(), () => {
      cancelled = !0;
    };
  }, []), import_react109.useMemo(() => {
    if (!diffResult)
      return { stats: null, files: [], hunks: /* @__PURE__ */ new Map, loading };
    let { stats, perFileStats } = diffResult, files2 = [];
    for (let [path22, fileStats] of perFileStats) {
      let fileHunks = hunks.get(path22), isUntracked = fileStats.isUntracked ?? !1, isLargeFile = !fileStats.isBinary && !isUntracked && !fileHunks, totalLines = fileStats.added + fileStats.removed, isTruncated = !isLargeFile && !fileStats.isBinary && totalLines > MAX_LINES_PER_FILE2;
      files2.push({
        path: path22,
        linesAdded: fileStats.added,
        linesRemoved: fileStats.removed,
        isBinary: fileStats.isBinary,
        isLargeFile,
        isTruncated,
        isUntracked
      });
    }
    return files2.sort((a2, b) => a2.path.localeCompare(b.path)), { stats, files: files2, hunks, loading: !1 };
  }, [diffResult, hunks, loading]);
}
var import_react109, MAX_LINES_PER_FILE2 = 400;
var init_useDiffData = __esm(() => {
  init_gitDiff();
  import_react109 = __toESM(require_react_development(), 1);
});
