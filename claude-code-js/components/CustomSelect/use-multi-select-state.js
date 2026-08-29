// Original: src/components/CustomSelect/use-multi-select-state.ts
import { isDeepStrictEqual as isDeepStrictEqual2 } from "util";
function useMultiSelectState({
  isDisabled = !1,
  visibleOptionCount = 5,
  options: options2,
  defaultValue = [],
  onChange,
  onCancel,
  onFocus,
  focusValue,
  submitButtonText,
  onSubmit,
  onDownFromLastItem,
  onUpFromFirstItem,
  initialFocusLast,
  hideIndexes = !1
}) {
  let [selectedValues, setSelectedValues] = import_react46.useState(defaultValue), [isSubmitFocused, setIsSubmitFocused] = import_react46.useState(!1), [lastOptions, setLastOptions] = import_react46.useState(options2);
  if (options2 !== lastOptions && !isDeepStrictEqual2(options2, lastOptions))
    setSelectedValues(defaultValue), setLastOptions(options2);
  let [inputValues, setInputValues] = import_react46.useState(() => {
    let initialMap = /* @__PURE__ */ new Map;
    return options2.forEach((option) => {
      if (option.type === "input" && option.initialValue)
        initialMap.set(option.value, option.initialValue);
    }), initialMap;
  }), updateSelectedValues = import_react46.useCallback((values3) => {
    let newValues = typeof values3 === "function" ? values3(selectedValues) : values3;
    setSelectedValues(newValues), onChange?.(newValues);
  }, [selectedValues, onChange]), navigation = useSelectNavigation({
    visibleOptionCount,
    options: options2,
    initialFocusValue: initialFocusLast ? options2[options2.length - 1]?.value : void 0,
    onFocus,
    focusValue
  });
  useRegisterOverlay("multi-select");
  let updateInputValue = import_react46.useCallback((value, inputValue) => {
    setInputValues((prev) => {
      let next = new Map(prev);
      return next.set(value, inputValue), next;
    });
    let option = options2.find((opt) => opt.value === value);
    if (option && option.type === "input")
      option.onChange(inputValue);
    updateSelectedValues((prev) => {
      if (inputValue) {
        if (!prev.includes(value))
          return [...prev, value];
        return prev;
      } else
        return prev.filter((v2) => v2 !== value);
    });
  }, [options2, updateSelectedValues]);
  return use_input_default((input, key2, event) => {
    let normalizedInput = normalizeFullWidthDigits(input), isInInput = options2.find((opt) => opt.value === navigation.focusedValue)?.type === "input";
    if (isInInput) {
      if (!(key2.upArrow || key2.downArrow || key2.escape || key2.tab || key2.return || key2.ctrl && (input === "n" || input === "p" || key2.return)))
        return;
    }
    let lastOptionValue = options2[options2.length - 1]?.value;
    if (key2.tab && !key2.shift) {
      if (submitButtonText && onSubmit && navigation.focusedValue === lastOptionValue && !isSubmitFocused)
        setIsSubmitFocused(!0);
      else if (!isSubmitFocused)
        navigation.focusNextOption();
      return;
    }
    if (key2.tab && key2.shift) {
      if (submitButtonText && onSubmit && isSubmitFocused)
        setIsSubmitFocused(!1), navigation.focusOption(lastOptionValue);
      else
        navigation.focusPreviousOption();
      return;
    }
    if (key2.downArrow || key2.ctrl && input === "n" || !key2.ctrl && !key2.shift && input === "j") {
      if (isSubmitFocused && onDownFromLastItem)
        onDownFromLastItem();
      else if (submitButtonText && onSubmit && navigation.focusedValue === lastOptionValue && !isSubmitFocused)
        setIsSubmitFocused(!0);
      else if (!submitButtonText && onDownFromLastItem && navigation.focusedValue === lastOptionValue)
        onDownFromLastItem();
      else if (!isSubmitFocused)
        navigation.focusNextOption();
      return;
    }
    if (key2.upArrow || key2.ctrl && input === "p" || !key2.ctrl && !key2.shift && input === "k") {
      if (submitButtonText && onSubmit && isSubmitFocused)
        setIsSubmitFocused(!1), navigation.focusOption(lastOptionValue);
      else if (onUpFromFirstItem && navigation.focusedValue === options2[0]?.value)
        onUpFromFirstItem();
      else
        navigation.focusPreviousOption();
      return;
    }
    if (key2.pageDown) {
      navigation.focusNextPage();
      return;
    }
    if (key2.pageUp) {
      navigation.focusPreviousPage();
      return;
    }
    if (key2.return || normalizeFullWidthSpace(input) === " ") {
      if (key2.ctrl && key2.return && isInInput && onSubmit) {
        onSubmit(selectedValues);
        return;
      }
      if (isSubmitFocused && onSubmit) {
        onSubmit(selectedValues);
        return;
      }
      if (key2.return && !submitButtonText && onSubmit) {
        onSubmit(selectedValues);
        return;
      }
      if (navigation.focusedValue !== void 0) {
        let newValues = selectedValues.includes(navigation.focusedValue) ? selectedValues.filter((v2) => v2 !== navigation.focusedValue) : [...selectedValues, navigation.focusedValue];
        updateSelectedValues(newValues);
      }
      return;
    }
    if (!hideIndexes && /^[0-9]+$/.test(normalizedInput)) {
      let index = parseInt(normalizedInput) - 1;
      if (index >= 0 && index < options2.length) {
        let value = options2[index].value, newValues = selectedValues.includes(value) ? selectedValues.filter((v2) => v2 !== value) : [...selectedValues, value];
        updateSelectedValues(newValues);
      }
      return;
    }
    if (key2.escape)
      onCancel(), event.stopImmediatePropagation();
  }, { isActive: !isDisabled }), {
    ...navigation,
    selectedValues,
    inputValues,
    isSubmitFocused,
    updateInputValue,
    onCancel
  };
}
var import_react46;
var init_use_multi_select_state = __esm(() => {
  init_overlayContext();
  init_ink2();
  init_use_select_navigation();
  import_react46 = __toESM(require_react_development(), 1);
});
