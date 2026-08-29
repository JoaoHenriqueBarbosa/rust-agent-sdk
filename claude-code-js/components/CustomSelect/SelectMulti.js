// Original: src/components/CustomSelect/SelectMulti.tsx
function SelectMulti(t0) {
  let $3 = import_compiler_runtime48.c(44), {
    isDisabled: t1,
    visibleOptionCount: t2,
    options: options2,
    defaultValue: t3,
    onCancel,
    onChange,
    onFocus,
    focusValue,
    submitButtonText,
    onSubmit,
    onDownFromLastItem,
    onUpFromFirstItem,
    initialFocusLast,
    onOpenEditor,
    hideIndexes: t4,
    onImagePaste,
    pastedContents,
    onRemoveImage
  } = t0, isDisabled = t1 === void 0 ? !1 : t1, visibleOptionCount = t2 === void 0 ? 5 : t2, t5;
  if ($3[0] !== t3)
    t5 = t3 === void 0 ? [] : t3, $3[0] = t3, $3[1] = t5;
  else
    t5 = $3[1];
  let defaultValue = t5, hideIndexes = t4 === void 0 ? !1 : t4, t6;
  if ($3[2] !== defaultValue || $3[3] !== focusValue || $3[4] !== hideIndexes || $3[5] !== initialFocusLast || $3[6] !== isDisabled || $3[7] !== onCancel || $3[8] !== onChange || $3[9] !== onDownFromLastItem || $3[10] !== onFocus || $3[11] !== onSubmit || $3[12] !== onUpFromFirstItem || $3[13] !== options2 || $3[14] !== submitButtonText || $3[15] !== visibleOptionCount)
    t6 = {
      isDisabled,
      visibleOptionCount,
      options: options2,
      defaultValue,
      onChange,
      onCancel,
      onFocus,
      focusValue,
      submitButtonText,
      onSubmit,
      onDownFromLastItem,
      onUpFromFirstItem,
      initialFocusLast,
      hideIndexes
    }, $3[2] = defaultValue, $3[3] = focusValue, $3[4] = hideIndexes, $3[5] = initialFocusLast, $3[6] = isDisabled, $3[7] = onCancel, $3[8] = onChange, $3[9] = onDownFromLastItem, $3[10] = onFocus, $3[11] = onSubmit, $3[12] = onUpFromFirstItem, $3[13] = options2, $3[14] = submitButtonText, $3[15] = visibleOptionCount, $3[16] = t6;
  else
    t6 = $3[16];
  let state3 = useMultiSelectState(t6), T0, T1, t7, t8, t9;
  if ($3[17] !== hideIndexes || $3[18] !== isDisabled || $3[19] !== onCancel || $3[20] !== onImagePaste || $3[21] !== onOpenEditor || $3[22] !== onRemoveImage || $3[23] !== options2.length || $3[24] !== pastedContents || $3[25] !== state3) {
    let maxIndexWidth = options2.length.toString().length;
    T1 = ThemedBox_default, t9 = "column", T0 = ThemedBox_default, t7 = "column", t8 = state3.visibleOptions.map((option, index) => {
      let isOptionFocused = !isDisabled && state3.focusedValue === option.value && !state3.isSubmitFocused, isSelected = state3.selectedValues.includes(option.value), isFirstVisibleOption = option.index === state3.visibleFromIndex, isLastVisibleOption = option.index === state3.visibleToIndex - 1, areMoreOptionsBelow = state3.visibleToIndex < options2.length, areMoreOptionsAbove = state3.visibleFromIndex > 0, i5 = state3.visibleFromIndex + index + 1;
      if (option.type === "input") {
        let inputValue = state3.inputValues.get(option.value) || "";
        return /* @__PURE__ */ jsx_dev_runtime53.jsxDEV(ThemedBox_default, {
          gap: 1,
          children: /* @__PURE__ */ jsx_dev_runtime53.jsxDEV(SelectInputOption, {
            option,
            isFocused: isOptionFocused,
            isSelected: !1,
            shouldShowDownArrow: areMoreOptionsBelow && isLastVisibleOption,
            shouldShowUpArrow: areMoreOptionsAbove && isFirstVisibleOption,
            maxIndexWidth,
            index: i5,
            inputValue,
            onInputChange: (value) => {
              state3.updateInputValue(option.value, value);
            },
            onSubmit: _temp8,
            onExit: () => {
              onCancel();
            },
            layout: "compact",
            onOpenEditor,
            onImagePaste,
            pastedContents,
            onRemoveImage,
            children: /* @__PURE__ */ jsx_dev_runtime53.jsxDEV(ThemedText, {
              color: isSelected ? "success" : void 0,
              children: [
                "[",
                isSelected ? figures_default.tick : " ",
                "]",
                " "
              ]
            }, void 0, !0, void 0, this)
          }, void 0, !1, void 0, this)
        }, String(option.value), !1, void 0, this);
      }
      return /* @__PURE__ */ jsx_dev_runtime53.jsxDEV(ThemedBox_default, {
        gap: 1,
        children: /* @__PURE__ */ jsx_dev_runtime53.jsxDEV(SelectOption, {
          isFocused: isOptionFocused,
          isSelected: !1,
          shouldShowDownArrow: areMoreOptionsBelow && isLastVisibleOption,
          shouldShowUpArrow: areMoreOptionsAbove && isFirstVisibleOption,
          description: option.description,
          children: [
            !hideIndexes && /* @__PURE__ */ jsx_dev_runtime53.jsxDEV(ThemedText, {
              dimColor: !0,
              children: `${i5}.`.padEnd(maxIndexWidth)
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime53.jsxDEV(ThemedText, {
              color: isSelected ? "success" : void 0,
              children: [
                "[",
                isSelected ? figures_default.tick : " ",
                "]"
              ]
            }, void 0, !0, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime53.jsxDEV(ThemedText, {
              color: isOptionFocused ? "suggestion" : void 0,
              children: option.label
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this)
      }, String(option.value), !1, void 0, this);
    }), $3[17] = hideIndexes, $3[18] = isDisabled, $3[19] = onCancel, $3[20] = onImagePaste, $3[21] = onOpenEditor, $3[22] = onRemoveImage, $3[23] = options2.length, $3[24] = pastedContents, $3[25] = state3, $3[26] = T0, $3[27] = T1, $3[28] = t7, $3[29] = t8, $3[30] = t9;
  } else
    T0 = $3[26], T1 = $3[27], t7 = $3[28], t8 = $3[29], t9 = $3[30];
  let t10;
  if ($3[31] !== T0 || $3[32] !== t7 || $3[33] !== t8)
    t10 = /* @__PURE__ */ jsx_dev_runtime53.jsxDEV(T0, {
      flexDirection: t7,
      children: t8
    }, void 0, !1, void 0, this), $3[31] = T0, $3[32] = t7, $3[33] = t8, $3[34] = t10;
  else
    t10 = $3[34];
  let t11;
  if ($3[35] !== onSubmit || $3[36] !== state3.isSubmitFocused || $3[37] !== submitButtonText)
    t11 = submitButtonText && onSubmit && /* @__PURE__ */ jsx_dev_runtime53.jsxDEV(ThemedBox_default, {
      marginTop: 0,
      gap: 1,
      children: [
        state3.isSubmitFocused ? /* @__PURE__ */ jsx_dev_runtime53.jsxDEV(ThemedText, {
          color: "suggestion",
          children: figures_default.pointer
        }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime53.jsxDEV(ThemedText, {
          children: " "
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime53.jsxDEV(ThemedBox_default, {
          marginLeft: 3,
          children: /* @__PURE__ */ jsx_dev_runtime53.jsxDEV(ThemedText, {
            color: state3.isSubmitFocused ? "suggestion" : void 0,
            bold: !0,
            children: submitButtonText
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[35] = onSubmit, $3[36] = state3.isSubmitFocused, $3[37] = submitButtonText, $3[38] = t11;
  else
    t11 = $3[38];
  let t12;
  if ($3[39] !== T1 || $3[40] !== t10 || $3[41] !== t11 || $3[42] !== t9)
    t12 = /* @__PURE__ */ jsx_dev_runtime53.jsxDEV(T1, {
      flexDirection: t9,
      children: [
        t10,
        t11
      ]
    }, void 0, !0, void 0, this), $3[39] = T1, $3[40] = t10, $3[41] = t11, $3[42] = t9, $3[43] = t12;
  else
    t12 = $3[43];
  return t12;
}
function _temp8() {}
var import_compiler_runtime48, jsx_dev_runtime53;
var init_SelectMulti = __esm(() => {
  init_figures();
  init_ink2();
  init_select_input_option();
  init_select_option();
  init_use_multi_select_state();
  import_compiler_runtime48 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime53 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
