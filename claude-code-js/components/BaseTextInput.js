// Original: src/components/BaseTextInput.tsx
function BaseTextInput(t0) {
  let $3 = import_compiler_runtime125.c(14), {
    inputState,
    children,
    terminalFocus,
    invert,
    hidePlaceholderText,
    ...props
  } = t0, {
    onInput,
    renderedValue,
    cursorLine,
    cursorColumn
  } = inputState, t1 = Boolean(props.focus && props.showCursor && terminalFocus), t2;
  if ($3[0] !== cursorColumn || $3[1] !== cursorLine || $3[2] !== t1)
    t2 = {
      line: cursorLine,
      column: cursorColumn,
      active: t1
    }, $3[0] = cursorColumn, $3[1] = cursorLine, $3[2] = t1, $3[3] = t2;
  else
    t2 = $3[3];
  let cursorRef = useDeclaredCursor(t2), {
    wrappedOnInput,
    isPasting: t3
  } = usePasteHandler({
    onPaste: props.onPaste,
    onInput: (input, key3) => {
      if (isPasting && key3.return)
        return;
      onInput(input, key3);
    },
    onImagePaste: props.onImagePaste
  }), isPasting = t3, {
    onIsPastingChange
  } = props;
  import_react87.default.useEffect(() => {
    if (onIsPastingChange)
      onIsPastingChange(isPasting);
  }, [isPasting, onIsPastingChange]);
  let {
    showPlaceholder,
    renderedPlaceholder
  } = renderPlaceholder({
    placeholder: props.placeholder,
    value: props.value,
    showCursor: props.showCursor,
    focus: props.focus,
    terminalFocus,
    invert,
    hidePlaceholderText
  });
  use_input_default(wrappedOnInput, {
    isActive: props.focus
  });
  let commandWithoutArgs = props.value && props.value.trim().indexOf(" ") === -1 || props.value && props.value.endsWith(" "), showArgumentHint = Boolean(props.argumentHint && props.value && commandWithoutArgs && props.value.startsWith("/")), cursorFiltered = props.showCursor && props.highlights ? props.highlights.filter((h4) => h4.dimColor || props.cursorOffset < h4.start || props.cursorOffset >= h4.end) : props.highlights, {
    viewportCharOffset,
    viewportCharEnd
  } = inputState, filteredHighlights = cursorFiltered && viewportCharOffset > 0 ? cursorFiltered.filter((h_0) => h_0.end > viewportCharOffset && h_0.start < viewportCharEnd).map((h_1) => ({
    ...h_1,
    start: Math.max(0, h_1.start - viewportCharOffset),
    end: h_1.end - viewportCharOffset
  })) : cursorFiltered;
  if (filteredHighlights && filteredHighlights.length > 0)
    return /* @__PURE__ */ jsx_dev_runtime157.jsxDEV(ThemedBox_default, {
      ref: cursorRef,
      children: [
        /* @__PURE__ */ jsx_dev_runtime157.jsxDEV(HighlightedInput, {
          text: renderedValue,
          highlights: filteredHighlights
        }, void 0, !1, void 0, this),
        showArgumentHint && /* @__PURE__ */ jsx_dev_runtime157.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            props.value?.endsWith(" ") ? "" : " ",
            props.argumentHint
          ]
        }, void 0, !0, void 0, this),
        children
      ]
    }, void 0, !0, void 0, this);
  let T0 = ThemedBox_default, T1 = ThemedText, t4 = "truncate-end", t5 = showPlaceholder && props.placeholderElement ? props.placeholderElement : showPlaceholder && renderedPlaceholder ? /* @__PURE__ */ jsx_dev_runtime157.jsxDEV(Ansi, {
    children: renderedPlaceholder
  }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime157.jsxDEV(Ansi, {
    children: renderedValue
  }, void 0, !1, void 0, this), t6 = showArgumentHint && /* @__PURE__ */ jsx_dev_runtime157.jsxDEV(ThemedText, {
    dimColor: !0,
    children: [
      props.value?.endsWith(" ") ? "" : " ",
      props.argumentHint
    ]
  }, void 0, !0, void 0, this), t7;
  if ($3[4] !== T1 || $3[5] !== children || $3[6] !== props || $3[7] !== t5 || $3[8] !== t6)
    t7 = /* @__PURE__ */ jsx_dev_runtime157.jsxDEV(T1, {
      wrap: t4,
      dimColor: props.dimColor,
      children: [
        t5,
        t6,
        children
      ]
    }, void 0, !0, void 0, this), $3[4] = T1, $3[5] = children, $3[6] = props, $3[7] = t5, $3[8] = t6, $3[9] = t7;
  else
    t7 = $3[9];
  let t8;
  if ($3[10] !== T0 || $3[11] !== cursorRef || $3[12] !== t7)
    t8 = /* @__PURE__ */ jsx_dev_runtime157.jsxDEV(T0, {
      ref: cursorRef,
      children: t7
    }, void 0, !1, void 0, this), $3[10] = T0, $3[11] = cursorRef, $3[12] = t7, $3[13] = t8;
  else
    t8 = $3[13];
  return t8;
}
var import_compiler_runtime125, import_react87, jsx_dev_runtime157;
var init_BaseTextInput = __esm(() => {
  init_renderPlaceholder();
  init_usePasteHandler();
  init_use_declared_cursor();
  init_ink2();
  init_ShimmeredInput();
  import_compiler_runtime125 = __toESM(require_react_compiler_runtime_development(), 1), import_react87 = __toESM(require_react_development(), 1), jsx_dev_runtime157 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
