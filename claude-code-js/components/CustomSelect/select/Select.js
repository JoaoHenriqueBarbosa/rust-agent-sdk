// function: Select
function Select(t0) {
  let $3 = import_compiler_runtime49.c(72), {
    isDisabled: t1,
    hideIndexes: t2,
    visibleOptionCount: t3,
    highlightText,
    options: options2,
    defaultValue,
    onCancel,
    onChange,
    onFocus,
    defaultFocusValue,
    layout: t4,
    disableSelection: t5,
    inlineDescriptions: t6,
    onUpFromFirstItem,
    onDownFromLastItem,
    onInputModeToggle,
    onOpenEditor,
    onImagePaste,
    pastedContents,
    onRemoveImage
  } = t0, isDisabled = t1 === void 0 ? !1 : t1, hideIndexes = t2 === void 0 ? !1 : t2, visibleOptionCount = t3 === void 0 ? 5 : t3, layout = t4 === void 0 ? "compact" : t4, disableSelection = t5 === void 0 ? !1 : t5, inlineDescriptions = t6 === void 0 ? !1 : t6, [imagesSelected, setImagesSelected] = import_react49.useState(!1), [selectedImageIndex, setSelectedImageIndex] = import_react49.useState(0), t7;
  if ($3[0] !== options2)
    t7 = () => {
      let initialMap = /* @__PURE__ */ new Map;
      return options2.forEach((option) => {
        if (option.type === "input" && option.initialValue)
          initialMap.set(option.value, option.initialValue);
      }), initialMap;
    }, $3[0] = options2, $3[1] = t7;
  else
    t7 = $3[1];
  let [inputValues, setInputValues] = import_react49.useState(t7), t8;
  if ($3[2] === Symbol.for("react.memo_cache_sentinel"))
    t8 = /* @__PURE__ */ new Map, $3[2] = t8;
  else
    t8 = $3[2];
  let lastInitialValues = import_react49.useRef(t8), t10, t9;
  if ($3[3] !== inputValues || $3[4] !== options2)
    t9 = () => {
      for (let option_0 of options2)
        if (option_0.type === "input" && option_0.initialValue !== void 0) {
          let lastInitial = lastInitialValues.current.get(option_0.value) ?? "", currentValue = inputValues.get(option_0.value) ?? "", newInitial = option_0.initialValue;
          if (newInitial !== lastInitial && currentValue === lastInitial)
            setInputValues((prev) => {
              let next = new Map(prev);
              return next.set(option_0.value, newInitial), next;
            });
          lastInitialValues.current.set(option_0.value, newInitial);
        }
    }, t10 = [options2, inputValues], $3[3] = inputValues, $3[4] = options2, $3[5] = t10, $3[6] = t9;
  else
    t10 = $3[5], t9 = $3[6];
  import_react49.useEffect(t9, t10);
  let t11;
  if ($3[7] !== defaultFocusValue || $3[8] !== defaultValue || $3[9] !== onCancel || $3[10] !== onChange || $3[11] !== onFocus || $3[12] !== options2 || $3[13] !== visibleOptionCount)
    t11 = {
      visibleOptionCount,
      options: options2,
      defaultValue,
      onChange,
      onCancel,
      onFocus,
      focusValue: defaultFocusValue
    }, $3[7] = defaultFocusValue, $3[8] = defaultValue, $3[9] = onCancel, $3[10] = onChange, $3[11] = onFocus, $3[12] = options2, $3[13] = visibleOptionCount, $3[14] = t11;
  else
    t11 = $3[14];
  let state3 = useSelectState(t11), t12 = disableSelection || (hideIndexes ? "numeric" : !1), t13;
  if ($3[15] !== pastedContents)
    t13 = () => {
      if (pastedContents && Object.values(pastedContents).some(_temp10)) {
        let imageCount = count2(Object.values(pastedContents), _temp23);
        return setImagesSelected(!0), setSelectedImageIndex(imageCount - 1), !0;
      }
      return !1;
    }, $3[15] = pastedContents, $3[16] = t13;
  else
    t13 = $3[16];
  let t14;
  if ($3[17] !== imagesSelected || $3[18] !== inputValues || $3[19] !== isDisabled || $3[20] !== onDownFromLastItem || $3[21] !== onInputModeToggle || $3[22] !== onUpFromFirstItem || $3[23] !== options2 || $3[24] !== state3 || $3[25] !== t12 || $3[26] !== t13)
    t14 = {
      isDisabled,
      disableSelection: t12,
      state: state3,
      options: options2,
      isMultiSelect: !1,
      onUpFromFirstItem,
      onDownFromLastItem,
      onInputModeToggle,
      inputValues,
      imagesSelected,
      onEnterImageSelection: t13
    }, $3[17] = imagesSelected, $3[18] = inputValues, $3[19] = isDisabled, $3[20] = onDownFromLastItem, $3[21] = onInputModeToggle, $3[22] = onUpFromFirstItem, $3[23] = options2, $3[24] = state3, $3[25] = t12, $3[26] = t13, $3[27] = t14;
  else
    t14 = $3[27];
  useSelectInput(t14);
  let T0, t15, t16, t17;
  if ($3[28] !== hideIndexes || $3[29] !== highlightText || $3[30] !== imagesSelected || $3[31] !== inlineDescriptions || $3[32] !== inputValues || $3[33] !== isDisabled || $3[34] !== layout || $3[35] !== onCancel || $3[36] !== onChange || $3[37] !== onImagePaste || $3[38] !== onOpenEditor || $3[39] !== onRemoveImage || $3[40] !== options2.length || $3[41] !== pastedContents || $3[42] !== selectedImageIndex || $3[43] !== state3.focusedValue || $3[44] !== state3.options || $3[45] !== state3.value || $3[46] !== state3.visibleFromIndex || $3[47] !== state3.visibleOptions || $3[48] !== state3.visibleToIndex) {
    t17 = Symbol.for("react.early_return_sentinel");
    bb0: {
      let styles5 = {
        container: _temp33,
        highlightedText: _temp42
      };
      if (layout === "expanded") {
        let t183;
        if ($3[53] !== state3.options.length)
          t183 = state3.options.length.toString(), $3[53] = state3.options.length, $3[54] = t183;
        else
          t183 = $3[54];
        let maxIndexWidth = t183.length;
        t17 = /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(ThemedBox_default, {
          ...styles5.container(),
          children: state3.visibleOptions.map((option_1, index) => {
            let isFirstVisibleOption = option_1.index === state3.visibleFromIndex, isLastVisibleOption = option_1.index === state3.visibleToIndex - 1, areMoreOptionsBelow = state3.visibleToIndex < options2.length, areMoreOptionsAbove = state3.visibleFromIndex > 0, i5 = state3.visibleFromIndex + index + 1, isFocused = !isDisabled && state3.focusedValue === option_1.value, isSelected = state3.value === option_1.value;
            if (option_1.type === "input") {
              let inputValue = inputValues.has(option_1.value) ? inputValues.get(option_1.value) : option_1.initialValue || "";
              return /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(SelectInputOption, {
                option: option_1,
                isFocused,
                isSelected,
                shouldShowDownArrow: areMoreOptionsBelow && isLastVisibleOption,
                shouldShowUpArrow: areMoreOptionsAbove && isFirstVisibleOption,
                maxIndexWidth,
                index: i5,
                inputValue,
                onInputChange: (value) => {
                  setInputValues((prev_0) => {
                    let next_0 = new Map(prev_0);
                    return next_0.set(option_1.value, value), next_0;
                  });
                },
                onSubmit: (value_0) => {
                  let hasImageAttachments = pastedContents && Object.values(pastedContents).some(_temp52);
                  if (value_0.trim() || hasImageAttachments || option_1.allowEmptySubmitToCancel)
                    onChange?.(option_1.value);
                  else
                    onCancel?.();
                },
                onExit: onCancel,
                layout: "expanded",
                showLabel: inlineDescriptions,
                onOpenEditor,
                resetCursorOnUpdate: option_1.resetCursorOnUpdate,
                onImagePaste,
                pastedContents,
                onRemoveImage,
                imagesSelected,
                selectedImageIndex,
                onImagesSelectedChange: setImagesSelected,
                onSelectedImageIndexChange: setSelectedImageIndex
              }, String(option_1.value), !1, void 0, this);
            }
            let label = option_1.label;
            if (typeof option_1.label === "string" && highlightText && option_1.label.includes(highlightText)) {
              let labelText = option_1.label, index_0 = labelText.indexOf(highlightText);
              label = /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(jsx_dev_runtime54.Fragment, {
                children: [
                  labelText.slice(0, index_0),
                  /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(ThemedText, {
                    ...styles5.highlightedText(),
                    children: highlightText
                  }, void 0, !1, void 0, this),
                  labelText.slice(index_0 + highlightText.length)
                ]
              }, void 0, !0, void 0, this);
            }
            let isOptionDisabled = option_1.disabled === !0, optionColor = isOptionDisabled ? void 0 : isSelected ? "success" : isFocused ? "suggestion" : void 0;
            return /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(ThemedBox_default, {
              flexDirection: "column",
              flexShrink: 0,
              children: [
                /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(SelectOption, {
                  isFocused,
                  isSelected,
                  shouldShowDownArrow: areMoreOptionsBelow && isLastVisibleOption,
                  shouldShowUpArrow: areMoreOptionsAbove && isFirstVisibleOption,
                  children: /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(ThemedText, {
                    dimColor: isOptionDisabled,
                    color: optionColor,
                    children: label
                  }, void 0, !1, void 0, this)
                }, void 0, !1, void 0, this),
                option_1.description && /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(ThemedBox_default, {
                  paddingLeft: 2,
                  children: /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(ThemedText, {
                    dimColor: isOptionDisabled || option_1.dimDescription !== !1,
                    color: optionColor,
                    children: /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(Ansi, {
                      children: option_1.description
                    }, void 0, !1, void 0, this)
                  }, void 0, !1, void 0, this)
                }, void 0, !1, void 0, this),
                /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(ThemedText, {
                  children: " "
                }, void 0, !1, void 0, this)
              ]
            }, String(option_1.value), !0, void 0, this);
          })
        }, void 0, !1, void 0, this);
        break bb0;
      }
      if (layout === "compact-vertical") {
        let t183;
        if ($3[55] !== hideIndexes || $3[56] !== state3.options)
          t183 = hideIndexes ? 0 : state3.options.length.toString().length, $3[55] = hideIndexes, $3[56] = state3.options, $3[57] = t183;
        else
          t183 = $3[57];
        let maxIndexWidth_0 = t183;
        t17 = /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(ThemedBox_default, {
          ...styles5.container(),
          children: state3.visibleOptions.map((option_2, index_1) => {
            let isFirstVisibleOption_0 = option_2.index === state3.visibleFromIndex, isLastVisibleOption_0 = option_2.index === state3.visibleToIndex - 1, areMoreOptionsBelow_0 = state3.visibleToIndex < options2.length, areMoreOptionsAbove_0 = state3.visibleFromIndex > 0, i_0 = state3.visibleFromIndex + index_1 + 1, isFocused_0 = !isDisabled && state3.focusedValue === option_2.value, isSelected_0 = state3.value === option_2.value;
            if (option_2.type === "input") {
              let inputValue_0 = inputValues.has(option_2.value) ? inputValues.get(option_2.value) : option_2.initialValue || "";
              return /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(SelectInputOption, {
                option: option_2,
                isFocused: isFocused_0,
                isSelected: isSelected_0,
                shouldShowDownArrow: areMoreOptionsBelow_0 && isLastVisibleOption_0,
                shouldShowUpArrow: areMoreOptionsAbove_0 && isFirstVisibleOption_0,
                maxIndexWidth: maxIndexWidth_0,
                index: i_0,
                inputValue: inputValue_0,
                onInputChange: (value_1) => {
                  setInputValues((prev_1) => {
                    let next_1 = new Map(prev_1);
                    return next_1.set(option_2.value, value_1), next_1;
                  });
                },
                onSubmit: (value_2) => {
                  let hasImageAttachments_0 = pastedContents && Object.values(pastedContents).some(_temp62);
                  if (value_2.trim() || hasImageAttachments_0 || option_2.allowEmptySubmitToCancel)
                    onChange?.(option_2.value);
                  else
                    onCancel?.();
                },
                onExit: onCancel,
                layout: "compact",
                showLabel: inlineDescriptions,
                onOpenEditor,
                resetCursorOnUpdate: option_2.resetCursorOnUpdate,
                onImagePaste,
                pastedContents,
                onRemoveImage,
                imagesSelected,
                selectedImageIndex,
                onImagesSelectedChange: setImagesSelected,
                onSelectedImageIndexChange: setSelectedImageIndex
              }, String(option_2.value), !1, void 0, this);
            }
            let label_0 = option_2.label;
            if (typeof option_2.label === "string" && highlightText && option_2.label.includes(highlightText)) {
              let labelText_0 = option_2.label, index_2 = labelText_0.indexOf(highlightText);
              label_0 = /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(jsx_dev_runtime54.Fragment, {
                children: [
                  labelText_0.slice(0, index_2),
                  /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(ThemedText, {
                    ...styles5.highlightedText(),
                    children: highlightText
                  }, void 0, !1, void 0, this),
                  labelText_0.slice(index_2 + highlightText.length)
                ]
              }, void 0, !0, void 0, this);
            }
            let isOptionDisabled_0 = option_2.disabled === !0;
            return /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(ThemedBox_default, {
              flexDirection: "column",
              flexShrink: 0,
              children: [
                /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(SelectOption, {
                  isFocused: isFocused_0,
                  isSelected: isSelected_0,
                  shouldShowDownArrow: areMoreOptionsBelow_0 && isLastVisibleOption_0,
                  shouldShowUpArrow: areMoreOptionsAbove_0 && isFirstVisibleOption_0,
                  children: /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(jsx_dev_runtime54.Fragment, {
                    children: [
                      !hideIndexes && /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(ThemedText, {
                        dimColor: !0,
                        children: `${i_0}.`.padEnd(maxIndexWidth_0 + 1)
                      }, void 0, !1, void 0, this),
                      /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(ThemedText, {
                        dimColor: isOptionDisabled_0,
                        color: isOptionDisabled_0 ? void 0 : isSelected_0 ? "success" : isFocused_0 ? "suggestion" : void 0,
                        children: label_0
                      }, void 0, !1, void 0, this)
                    ]
                  }, void 0, !0, void 0, this)
                }, void 0, !1, void 0, this),
                option_2.description && /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(ThemedBox_default, {
                  paddingLeft: hideIndexes ? 4 : maxIndexWidth_0 + 4,
                  children: /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(ThemedText, {
                    dimColor: isOptionDisabled_0 || option_2.dimDescription !== !1,
                    color: isOptionDisabled_0 ? void 0 : isSelected_0 ? "success" : isFocused_0 ? "suggestion" : void 0,
                    children: /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(Ansi, {
                      children: option_2.description
                    }, void 0, !1, void 0, this)
                  }, void 0, !1, void 0, this)
                }, void 0, !1, void 0, this)
              ]
            }, String(option_2.value), !0, void 0, this);
          })
        }, void 0, !1, void 0, this);
        break bb0;
      }
      let t182;
      if ($3[58] !== hideIndexes || $3[59] !== state3.options)
        t182 = hideIndexes ? 0 : state3.options.length.toString().length, $3[58] = hideIndexes, $3[59] = state3.options, $3[60] = t182;
      else
        t182 = $3[60];
      let maxIndexWidth_1 = t182, hasInputOptions = state3.visibleOptions.some(_temp72), hasDescriptions = !inlineDescriptions && !hasInputOptions && state3.visibleOptions.some(_temp82), optionData = state3.visibleOptions.map((option_3, index_3) => {
        let isFirstVisibleOption_1 = option_3.index === state3.visibleFromIndex, isLastVisibleOption_1 = option_3.index === state3.visibleToIndex - 1, areMoreOptionsBelow_1 = state3.visibleToIndex < options2.length, areMoreOptionsAbove_1 = state3.visibleFromIndex > 0, i_1 = state3.visibleFromIndex + index_3 + 1, isFocused_1 = !isDisabled && state3.focusedValue === option_3.value, isSelected_1 = state3.value === option_3.value, isOptionDisabled_1 = option_3.disabled === !0, label_1 = option_3.label;
        if (typeof option_3.label === "string" && highlightText && option_3.label.includes(highlightText)) {
          let labelText_1 = option_3.label, idx = labelText_1.indexOf(highlightText);
          label_1 = /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(jsx_dev_runtime54.Fragment, {
            children: [
              labelText_1.slice(0, idx),
              /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(ThemedText, {
                ...styles5.highlightedText(),
                children: highlightText
              }, void 0, !1, void 0, this),
              labelText_1.slice(idx + highlightText.length)
            ]
          }, void 0, !0, void 0, this);
        }
        return {
          option: option_3,
          index: i_1,
          label: label_1,
          isFocused: isFocused_1,
          isSelected: isSelected_1,
          isOptionDisabled: isOptionDisabled_1,
          shouldShowDownArrow: areMoreOptionsBelow_1 && isLastVisibleOption_1,
          shouldShowUpArrow: areMoreOptionsAbove_1 && isFirstVisibleOption_1
        };
      });
      if (hasDescriptions) {
        let t19;
        if ($3[61] !== hideIndexes || $3[62] !== maxIndexWidth_1)
          t19 = (data) => {
            if (data.option.type === "input")
              return 0;
            let labelText_2 = getTextContent(data.option.label), indexWidth = hideIndexes ? 0 : maxIndexWidth_1 + 2, checkmarkWidth = data.isSelected ? 2 : 0;
            return 2 + indexWidth + stringWidth(labelText_2) + checkmarkWidth;
          }, $3[61] = hideIndexes, $3[62] = maxIndexWidth_1, $3[63] = t19;
        else
          t19 = $3[63];
        let maxLabelWidth = Math.max(...optionData.map(t19)), t20;
        if ($3[64] !== hideIndexes || $3[65] !== maxIndexWidth_1 || $3[66] !== maxLabelWidth)
          t20 = (data_0) => {
            if (data_0.option.type === "input")
              return null;
            let labelText_3 = getTextContent(data_0.option.label), indexWidth_0 = hideIndexes ? 0 : maxIndexWidth_1 + 2, checkmarkWidth_0 = data_0.isSelected ? 2 : 0, currentLabelWidth = 2 + indexWidth_0 + stringWidth(labelText_3) + checkmarkWidth_0, padding = maxLabelWidth - currentLabelWidth;
            return /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(TwoColumnRow, {
              isFocused: data_0.isFocused,
              children: [
                /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(ThemedBox_default, {
                  flexDirection: "row",
                  flexShrink: 0,
                  children: [
                    data_0.isFocused ? /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(ThemedText, {
                      color: "suggestion",
                      children: figures_default.pointer
                    }, void 0, !1, void 0, this) : data_0.shouldShowDownArrow ? /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(ThemedText, {
                      dimColor: !0,
                      children: figures_default.arrowDown
                    }, void 0, !1, void 0, this) : data_0.shouldShowUpArrow ? /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(ThemedText, {
                      dimColor: !0,
                      children: figures_default.arrowUp
                    }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(ThemedText, {
                      children: " "
                    }, void 0, !1, void 0, this),
                    /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(ThemedText, {
                      children: " "
                    }, void 0, !1, void 0, this),
                    /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(ThemedText, {
                      dimColor: data_0.isOptionDisabled,
                      color: data_0.isOptionDisabled ? void 0 : data_0.isSelected ? "success" : data_0.isFocused ? "suggestion" : void 0,
                      children: [
                        !hideIndexes && /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(ThemedText, {
                          dimColor: !0,
                          children: `${data_0.index}.`.padEnd(maxIndexWidth_1 + 2)
                        }, void 0, !1, void 0, this),
                        data_0.label
                      ]
                    }, void 0, !0, void 0, this),
                    data_0.isSelected && /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(ThemedText, {
                      color: "success",
                      children: [
                        " ",
                        figures_default.tick
                      ]
                    }, void 0, !0, void 0, this),
                    padding > 0 && /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(ThemedText, {
                      children: " ".repeat(padding)
                    }, void 0, !1, void 0, this)
                  ]
                }, void 0, !0, void 0, this),
                /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(ThemedBox_default, {
                  flexGrow: 1,
                  marginLeft: 2,
                  children: /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(ThemedText, {
                    wrap: "wrap",
                    dimColor: data_0.isOptionDisabled || data_0.option.dimDescription !== !1,
                    color: data_0.isOptionDisabled ? void 0 : data_0.isSelected ? "success" : data_0.isFocused ? "suggestion" : void 0,
                    children: /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(Ansi, {
                      children: data_0.option.description || " "
                    }, void 0, !1, void 0, this)
                  }, void 0, !1, void 0, this)
                }, void 0, !1, void 0, this)
              ]
            }, String(data_0.option.value), !0, void 0, this);
          }, $3[64] = hideIndexes, $3[65] = maxIndexWidth_1, $3[66] = maxLabelWidth, $3[67] = t20;
        else
          t20 = $3[67];
        t17 = /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(ThemedBox_default, {
          ...styles5.container(),
          children: optionData.map(t20)
        }, void 0, !1, void 0, this);
        break bb0;
      }
      T0 = ThemedBox_default, t15 = styles5.container(), t16 = state3.visibleOptions.map((option_4, index_4) => {
        if (option_4.type === "input") {
          let inputValue_1 = inputValues.has(option_4.value) ? inputValues.get(option_4.value) : option_4.initialValue || "", isFirstVisibleOption_2 = option_4.index === state3.visibleFromIndex, isLastVisibleOption_2 = option_4.index === state3.visibleToIndex - 1, areMoreOptionsBelow_2 = state3.visibleToIndex < options2.length, areMoreOptionsAbove_2 = state3.visibleFromIndex > 0, i_2 = state3.visibleFromIndex + index_4 + 1, isFocused_2 = !isDisabled && state3.focusedValue === option_4.value, isSelected_2 = state3.value === option_4.value;
          return /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(SelectInputOption, {
            option: option_4,
            isFocused: isFocused_2,
            isSelected: isSelected_2,
            shouldShowDownArrow: areMoreOptionsBelow_2 && isLastVisibleOption_2,
            shouldShowUpArrow: areMoreOptionsAbove_2 && isFirstVisibleOption_2,
            maxIndexWidth: maxIndexWidth_1,
            index: i_2,
            inputValue: inputValue_1,
            onInputChange: (value_3) => {
              setInputValues((prev_2) => {
                let next_2 = new Map(prev_2);
                return next_2.set(option_4.value, value_3), next_2;
              });
            },
            onSubmit: (value_4) => {
              let hasImageAttachments_1 = pastedContents && Object.values(pastedContents).some(_temp9);
              if (value_4.trim() || hasImageAttachments_1 || option_4.allowEmptySubmitToCancel)
                onChange?.(option_4.value);
              else
                onCancel?.();
            },
            onExit: onCancel,
            layout: "compact",
            showLabel: inlineDescriptions,
            onOpenEditor,
            resetCursorOnUpdate: option_4.resetCursorOnUpdate,
            onImagePaste,
            pastedContents,
            onRemoveImage,
            imagesSelected,
            selectedImageIndex,
            onImagesSelectedChange: setImagesSelected,
            onSelectedImageIndexChange: setSelectedImageIndex
          }, String(option_4.value), !1, void 0, this);
        }
        let label_2 = option_4.label;
        if (typeof option_4.label === "string" && highlightText && option_4.label.includes(highlightText)) {
          let labelText_4 = option_4.label, index_5 = labelText_4.indexOf(highlightText);
          label_2 = /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(jsx_dev_runtime54.Fragment, {
            children: [
              labelText_4.slice(0, index_5),
              /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(ThemedText, {
                ...styles5.highlightedText(),
                children: highlightText
              }, void 0, !1, void 0, this),
              labelText_4.slice(index_5 + highlightText.length)
            ]
          }, void 0, !0, void 0, this);
        }
        let isFirstVisibleOption_3 = option_4.index === state3.visibleFromIndex, isLastVisibleOption_3 = option_4.index === state3.visibleToIndex - 1, areMoreOptionsBelow_3 = state3.visibleToIndex < options2.length, areMoreOptionsAbove_3 = state3.visibleFromIndex > 0, i_3 = state3.visibleFromIndex + index_4 + 1, isFocused_3 = !isDisabled && state3.focusedValue === option_4.value, isSelected_3 = state3.value === option_4.value, isOptionDisabled_2 = option_4.disabled === !0;
        return /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(SelectOption, {
          isFocused: isFocused_3,
          isSelected: isSelected_3,
          shouldShowDownArrow: areMoreOptionsBelow_3 && isLastVisibleOption_3,
          shouldShowUpArrow: areMoreOptionsAbove_3 && isFirstVisibleOption_3,
          children: [
            /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(ThemedBox_default, {
              flexDirection: "row",
              flexShrink: 0,
              children: [
                !hideIndexes && /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(ThemedText, {
                  dimColor: !0,
                  children: `${i_3}.`.padEnd(maxIndexWidth_1 + 2)
                }, void 0, !1, void 0, this),
                /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(ThemedText, {
                  dimColor: isOptionDisabled_2,
                  color: isOptionDisabled_2 ? void 0 : isSelected_3 ? "success" : isFocused_3 ? "suggestion" : void 0,
                  children: [
                    label_2,
                    inlineDescriptions && option_4.description && /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(ThemedText, {
                      dimColor: isOptionDisabled_2 || option_4.dimDescription !== !1,
                      children: [
                        " ",
                        option_4.description
                      ]
                    }, void 0, !0, void 0, this)
                  ]
                }, void 0, !0, void 0, this)
              ]
            }, void 0, !0, void 0, this),
            !inlineDescriptions && option_4.description && /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(ThemedBox_default, {
              flexShrink: 99,
              marginLeft: 2,
              children: /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(ThemedText, {
                wrap: "wrap-trim",
                dimColor: isOptionDisabled_2 || option_4.dimDescription !== !1,
                color: isOptionDisabled_2 ? void 0 : isSelected_3 ? "success" : isFocused_3 ? "suggestion" : void 0,
                children: /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(Ansi, {
                  children: option_4.description
                }, void 0, !1, void 0, this)
              }, void 0, !1, void 0, this)
            }, void 0, !1, void 0, this)
          ]
        }, String(option_4.value), !0, void 0, this);
      });
    }
    $3[28] = hideIndexes, $3[29] = highlightText, $3[30] = imagesSelected, $3[31] = inlineDescriptions, $3[32] = inputValues, $3[33] = isDisabled, $3[34] = layout, $3[35] = onCancel, $3[36] = onChange, $3[37] = onImagePaste, $3[38] = onOpenEditor, $3[39] = onRemoveImage, $3[40] = options2.length, $3[41] = pastedContents, $3[42] = selectedImageIndex, $3[43] = state3.focusedValue, $3[44] = state3.options, $3[45] = state3.value, $3[46] = state3.visibleFromIndex, $3[47] = state3.visibleOptions, $3[48] = state3.visibleToIndex, $3[49] = T0, $3[50] = t15, $3[51] = t16, $3[52] = t17;
  } else
    T0 = $3[49], t15 = $3[50], t16 = $3[51], t17 = $3[52];
  if (t17 !== Symbol.for("react.early_return_sentinel"))
    return t17;
  let t18;
  if ($3[68] !== T0 || $3[69] !== t15 || $3[70] !== t16)
    t18 = /* @__PURE__ */ jsx_dev_runtime54.jsxDEV(T0, {
      ...t15,
      children: t16
    }, void 0, !1, void 0, this), $3[68] = T0, $3[69] = t15, $3[70] = t16, $3[71] = t18;
  else
    t18 = $3[71];
  return t18;
}
