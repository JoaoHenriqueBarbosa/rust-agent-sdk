// Original: src/components/HelpV2/Commands.tsx
function Commands(t0) {
  let $3 = import_compiler_runtime162.c(14), {
    commands: commands7,
    maxHeight,
    columns,
    title,
    onCancel,
    emptyMessage
  } = t0, {
    headerFocused,
    focusHeader
  } = useTabHeaderFocus(), maxWidth = Math.max(1, columns - 10), visibleCount = Math.max(1, Math.floor((maxHeight - 10) / 2)), t1;
  if ($3[0] !== commands7 || $3[1] !== maxWidth) {
    let seen = /* @__PURE__ */ new Set, t22;
    if ($3[3] !== maxWidth)
      t22 = (cmd_0) => ({
        label: `/${cmd_0.name}`,
        value: cmd_0.name,
        description: truncate(formatDescriptionWithSource(cmd_0), maxWidth, !0)
      }), $3[3] = maxWidth, $3[4] = t22;
    else
      t22 = $3[4];
    t1 = commands7.filter((cmd) => {
      if (seen.has(cmd.name))
        return !1;
      return seen.add(cmd.name), !0;
    }).sort(_temp94).map(t22), $3[0] = commands7, $3[1] = maxWidth, $3[2] = t1;
  } else
    t1 = $3[2];
  let options2 = t1, t2;
  if ($3[5] !== commands7.length || $3[6] !== emptyMessage || $3[7] !== focusHeader || $3[8] !== headerFocused || $3[9] !== onCancel || $3[10] !== options2 || $3[11] !== title || $3[12] !== visibleCount)
    t2 = /* @__PURE__ */ jsx_dev_runtime203.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      paddingY: 1,
      children: commands7.length === 0 && emptyMessage ? /* @__PURE__ */ jsx_dev_runtime203.jsxDEV(ThemedText, {
        dimColor: !0,
        children: emptyMessage
      }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime203.jsxDEV(jsx_dev_runtime203.Fragment, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime203.jsxDEV(ThemedText, {
            children: title
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime203.jsxDEV(ThemedBox_default, {
            marginTop: 1,
            children: /* @__PURE__ */ jsx_dev_runtime203.jsxDEV(Select, {
              options: options2,
              visibleOptionCount: visibleCount,
              onCancel,
              disableSelection: !0,
              hideIndexes: !0,
              layout: "compact-vertical",
              onUpFromFirstItem: focusHeader,
              isDisabled: headerFocused
            }, void 0, !1, void 0, this)
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[5] = commands7.length, $3[6] = emptyMessage, $3[7] = focusHeader, $3[8] = headerFocused, $3[9] = onCancel, $3[10] = options2, $3[11] = title, $3[12] = visibleCount, $3[13] = t2;
  else
    t2 = $3[13];
  return t2;
}
function _temp94(a2, b) {
  return a2.name.localeCompare(b.name);
}
var import_compiler_runtime162, jsx_dev_runtime203;
var init_Commands = __esm(() => {
  init_commands5();
  init_ink2();
  init_format();
  init_select();
  init_Tabs();
  import_compiler_runtime162 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime203 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
