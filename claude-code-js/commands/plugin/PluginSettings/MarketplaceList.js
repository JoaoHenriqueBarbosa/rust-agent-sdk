// function: MarketplaceList
function MarketplaceList(t0) {
  let $3 = import_compiler_runtime193.c(4), {
    onComplete
  } = t0, t1, t2;
  if ($3[0] !== onComplete)
    t1 = () => {
      (async function() {
        try {
          let config11 = await loadKnownMarketplacesConfig(), names = Object.keys(config11);
          if (names.length === 0)
            onComplete("No marketplaces configured");
          else
            onComplete(`Configured marketplaces:
${names.map(_temp109).join(`
`)}`);
        } catch (t32) {
          onComplete(`Error loading marketplaces: ${errorMessage(t32)}`);
        }
      })();
    }, t2 = [onComplete], $3[0] = onComplete, $3[1] = t1, $3[2] = t2;
  else
    t1 = $3[1], t2 = $3[2];
  import_react139.useEffect(t1, t2);
  let t3;
  if ($3[3] === Symbol.for("react.memo_cache_sentinel"))
    t3 = /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedText, {
      children: "Loading marketplaces..."
    }, void 0, !1, void 0, this), $3[3] = t3;
  else
    t3 = $3[3];
  return t3;
}
