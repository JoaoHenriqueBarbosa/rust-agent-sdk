// Original: src/ink/hooks/use-tab-status.ts
function useTabStatus(kind) {
  let writeRaw = import_react22.useContext(TerminalWriteContext), prevKindRef = import_react22.useRef(null);
  import_react22.useEffect(() => {
    if (kind === null) {
      if (prevKindRef.current !== null && writeRaw && supportsTabStatus())
        writeRaw(wrapForMultiplexer(CLEAR_TAB_STATUS));
      prevKindRef.current = null;
      return;
    }
    if (prevKindRef.current = kind, !writeRaw || !supportsTabStatus())
      return;
    writeRaw(wrapForMultiplexer(tabStatus(TAB_STATUS_PRESETS[kind])));
  }, [kind, writeRaw]);
}
var import_react22, rgb = (r4, g, b) => ({
  type: "rgb",
  r: r4,
  g,
  b
}), TAB_STATUS_PRESETS;
var init_use_tab_status = __esm(() => {
  init_osc();
  init_useTerminalNotification();
  import_react22 = __toESM(require_react_development(), 1), TAB_STATUS_PRESETS = {
    idle: {
      indicator: rgb(0, 215, 95),
      status: "Idle",
      statusColor: rgb(136, 136, 136)
    },
    busy: {
      indicator: rgb(255, 149, 0),
      status: "Working\u2026",
      statusColor: rgb(255, 149, 0)
    },
    waiting: {
      indicator: rgb(95, 135, 255),
      status: "Waiting",
      statusColor: rgb(95, 135, 255)
    }
  };
});
