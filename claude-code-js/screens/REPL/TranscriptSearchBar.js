// function: TranscriptSearchBar
function TranscriptSearchBar({
  jumpRef,
  count: count4,
  current,
  onClose,
  onCancel,
  setHighlight,
  initialQuery
}) {
  let {
    query: query3,
    cursorOffset
  } = useSearchInput({
    isActive: !0,
    initialQuery,
    onExit: () => onClose(query3),
    onCancel
  }), [indexStatus, setIndexStatus] = React152.useState("building");
  React152.useEffect(() => {
    let alive = !0, warm = jumpRef.current?.warmSearchIndex;
    if (!warm) {
      setIndexStatus(null);
      return;
    }
    return setIndexStatus("building"), warm().then((ms) => {
      if (!alive)
        return;
      if (ms < 20)
        setIndexStatus(null);
      else
        setIndexStatus({
          ms
        }), setTimeout(() => alive && setIndexStatus(null), 2000);
    }), () => {
      alive = !1;
    };
  }, []);
  let warmDone = indexStatus !== "building";
  import_react303.useEffect(() => {
    if (!warmDone)
      return;
    jumpRef.current?.setSearchQuery(query3), setHighlight(query3);
  }, [query3, warmDone]);
  let off = cursorOffset, cursorChar = off < query3.length ? query3[off] : " ";
  return /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(ThemedBox_default, {
    borderTopDimColor: !0,
    borderBottom: !1,
    borderLeft: !1,
    borderRight: !1,
    borderStyle: "single",
    marginTop: 1,
    paddingLeft: 2,
    width: "100%",
    noSelect: !0,
    children: [
      /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(ThemedText, {
        children: "/"
      }, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(ThemedText, {
        children: query3.slice(0, off)
      }, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(ThemedText, {
        inverse: !0,
        children: cursorChar
      }, void 0, !1, void 0, this),
      off < query3.length && /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(ThemedText, {
        children: query3.slice(off + 1)
      }, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(ThemedBox_default, {
        flexGrow: 1
      }, void 0, !1, void 0, this),
      indexStatus === "building" ? /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "indexing\u2026 "
      }, void 0, !1, void 0, this) : indexStatus ? /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          "indexed in ",
          indexStatus.ms,
          "ms "
        ]
      }, void 0, !0, void 0, this) : count4 === 0 && query3 ? /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(ThemedText, {
        color: "error",
        children: "no matches "
      }, void 0, !1, void 0, this) : count4 > 0 ? /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          current,
          "/",
          count4,
          "  "
        ]
      }, void 0, !0, void 0, this) : null
    ]
  }, void 0, !0, void 0, this);
}
