// Original: src/components/CustomSelect/use-select-navigation.ts
import { isDeepStrictEqual } from "util";
function useSelectNavigation({
  visibleOptionCount = 5,
  options: options2,
  initialFocusValue,
  onFocus,
  focusValue
}) {
  let [state3, dispatch] = import_react45.useReducer(reducer, {
    visibleOptionCount,
    options: options2,
    initialFocusValue: focusValue || initialFocusValue
  }, createDefaultState), onFocusRef = import_react45.useRef(onFocus);
  onFocusRef.current = onFocus;
  let [lastOptions, setLastOptions] = import_react45.useState(options2);
  if (options2 !== lastOptions && !isDeepStrictEqual(options2, lastOptions))
    dispatch({
      type: "reset",
      state: createDefaultState({
        visibleOptionCount,
        options: options2,
        initialFocusValue: focusValue ?? state3.focusedValue ?? initialFocusValue,
        currentViewport: {
          visibleFromIndex: state3.visibleFromIndex,
          visibleToIndex: state3.visibleToIndex
        }
      })
    }), setLastOptions(options2);
  let focusNextOption = import_react45.useCallback(() => {
    dispatch({
      type: "focus-next-option"
    });
  }, []), focusPreviousOption = import_react45.useCallback(() => {
    dispatch({
      type: "focus-previous-option"
    });
  }, []), focusNextPage = import_react45.useCallback(() => {
    dispatch({
      type: "focus-next-page"
    });
  }, []), focusPreviousPage = import_react45.useCallback(() => {
    dispatch({
      type: "focus-previous-page"
    });
  }, []), focusOption = import_react45.useCallback((value) => {
    if (value !== void 0)
      dispatch({
        type: "set-focus",
        value
      });
  }, []), visibleOptions = import_react45.useMemo(() => {
    return options2.map((option, index) => ({
      ...option,
      index
    })).slice(state3.visibleFromIndex, state3.visibleToIndex);
  }, [options2, state3.visibleFromIndex, state3.visibleToIndex]), validatedFocusedValue = import_react45.useMemo(() => {
    if (state3.focusedValue === void 0)
      return;
    if (options2.some((opt) => opt.value === state3.focusedValue))
      return state3.focusedValue;
    return options2[0]?.value;
  }, [state3.focusedValue, options2]), isInInput = import_react45.useMemo(() => {
    return options2.find((opt) => opt.value === validatedFocusedValue)?.type === "input";
  }, [validatedFocusedValue, options2]);
  import_react45.useEffect(() => {
    if (validatedFocusedValue !== void 0)
      onFocusRef.current?.(validatedFocusedValue);
  }, [validatedFocusedValue]), import_react45.useEffect(() => {
    if (focusValue !== void 0)
      dispatch({
        type: "set-focus",
        value: focusValue
      });
  }, [focusValue]);
  let focusedIndex = import_react45.useMemo(() => {
    if (validatedFocusedValue === void 0)
      return 0;
    let index = options2.findIndex((opt) => opt.value === validatedFocusedValue);
    return index >= 0 ? index + 1 : 0;
  }, [validatedFocusedValue, options2]);
  return {
    focusedValue: validatedFocusedValue,
    focusedIndex,
    visibleFromIndex: state3.visibleFromIndex,
    visibleToIndex: state3.visibleToIndex,
    visibleOptions,
    isInInput: isInInput ?? !1,
    focusNextOption,
    focusPreviousOption,
    focusNextPage,
    focusPreviousPage,
    focusOption,
    options: options2
  };
}
var import_react45, reducer = (state3, action2) => {
  switch (action2.type) {
    case "focus-next-option": {
      if (state3.focusedValue === void 0)
        return state3;
      let item = state3.optionMap.get(state3.focusedValue);
      if (!item)
        return state3;
      let next = item.next || state3.optionMap.first;
      if (!next)
        return state3;
      if (!item.next && next === state3.optionMap.first)
        return {
          ...state3,
          focusedValue: next.value,
          visibleFromIndex: 0,
          visibleToIndex: state3.visibleOptionCount
        };
      if (!(next.index >= state3.visibleToIndex))
        return {
          ...state3,
          focusedValue: next.value
        };
      let nextVisibleToIndex = Math.min(state3.optionMap.size, state3.visibleToIndex + 1), nextVisibleFromIndex = nextVisibleToIndex - state3.visibleOptionCount;
      return {
        ...state3,
        focusedValue: next.value,
        visibleFromIndex: nextVisibleFromIndex,
        visibleToIndex: nextVisibleToIndex
      };
    }
    case "focus-previous-option": {
      if (state3.focusedValue === void 0)
        return state3;
      let item = state3.optionMap.get(state3.focusedValue);
      if (!item)
        return state3;
      let previous = item.previous || state3.optionMap.last;
      if (!previous)
        return state3;
      if (!item.previous && previous === state3.optionMap.last) {
        let nextVisibleToIndex2 = state3.optionMap.size, nextVisibleFromIndex2 = Math.max(0, nextVisibleToIndex2 - state3.visibleOptionCount);
        return {
          ...state3,
          focusedValue: previous.value,
          visibleFromIndex: nextVisibleFromIndex2,
          visibleToIndex: nextVisibleToIndex2
        };
      }
      if (!(previous.index <= state3.visibleFromIndex))
        return {
          ...state3,
          focusedValue: previous.value
        };
      let nextVisibleFromIndex = Math.max(0, state3.visibleFromIndex - 1), nextVisibleToIndex = nextVisibleFromIndex + state3.visibleOptionCount;
      return {
        ...state3,
        focusedValue: previous.value,
        visibleFromIndex: nextVisibleFromIndex,
        visibleToIndex: nextVisibleToIndex
      };
    }
    case "focus-next-page": {
      if (state3.focusedValue === void 0)
        return state3;
      let item = state3.optionMap.get(state3.focusedValue);
      if (!item)
        return state3;
      let targetIndex = Math.min(state3.optionMap.size - 1, item.index + state3.visibleOptionCount), targetItem = state3.optionMap.first;
      while (targetItem && targetItem.index < targetIndex)
        if (targetItem.next)
          targetItem = targetItem.next;
        else
          break;
      if (!targetItem)
        return state3;
      let nextVisibleToIndex = Math.min(state3.optionMap.size, targetItem.index + 1), nextVisibleFromIndex = Math.max(0, nextVisibleToIndex - state3.visibleOptionCount);
      return {
        ...state3,
        focusedValue: targetItem.value,
        visibleFromIndex: nextVisibleFromIndex,
        visibleToIndex: nextVisibleToIndex
      };
    }
    case "focus-previous-page": {
      if (state3.focusedValue === void 0)
        return state3;
      let item = state3.optionMap.get(state3.focusedValue);
      if (!item)
        return state3;
      let targetIndex = Math.max(0, item.index - state3.visibleOptionCount), targetItem = state3.optionMap.first;
      while (targetItem && targetItem.index < targetIndex)
        if (targetItem.next)
          targetItem = targetItem.next;
        else
          break;
      if (!targetItem)
        return state3;
      let nextVisibleFromIndex = Math.max(0, targetItem.index), nextVisibleToIndex = Math.min(state3.optionMap.size, nextVisibleFromIndex + state3.visibleOptionCount);
      return {
        ...state3,
        focusedValue: targetItem.value,
        visibleFromIndex: nextVisibleFromIndex,
        visibleToIndex: nextVisibleToIndex
      };
    }
    case "reset":
      return action2.state;
    case "set-focus": {
      if (state3.focusedValue === action2.value)
        return state3;
      let item = state3.optionMap.get(action2.value);
      if (!item)
        return state3;
      if (item.index >= state3.visibleFromIndex && item.index < state3.visibleToIndex)
        return {
          ...state3,
          focusedValue: action2.value
        };
      let nextVisibleFromIndex, nextVisibleToIndex;
      if (item.index < state3.visibleFromIndex)
        nextVisibleFromIndex = item.index, nextVisibleToIndex = Math.min(state3.optionMap.size, nextVisibleFromIndex + state3.visibleOptionCount);
      else
        nextVisibleToIndex = Math.min(state3.optionMap.size, item.index + 1), nextVisibleFromIndex = Math.max(0, nextVisibleToIndex - state3.visibleOptionCount);
      return {
        ...state3,
        focusedValue: action2.value,
        visibleFromIndex: nextVisibleFromIndex,
        visibleToIndex: nextVisibleToIndex
      };
    }
  }
}, createDefaultState = ({
  visibleOptionCount: customVisibleOptionCount,
  options: options2,
  initialFocusValue,
  currentViewport
}) => {
  let visibleOptionCount = typeof customVisibleOptionCount === "number" ? Math.min(customVisibleOptionCount, options2.length) : options2.length, optionMap = new OptionMap(options2), focusedItem = initialFocusValue !== void 0 && optionMap.get(initialFocusValue), focusedValue = focusedItem ? initialFocusValue : optionMap.first?.value, visibleFromIndex = 0, visibleToIndex = visibleOptionCount;
  if (focusedItem) {
    let focusedIndex = focusedItem.index;
    if (currentViewport)
      if (focusedIndex >= currentViewport.visibleFromIndex && focusedIndex < currentViewport.visibleToIndex)
        visibleFromIndex = currentViewport.visibleFromIndex, visibleToIndex = Math.min(optionMap.size, currentViewport.visibleToIndex);
      else if (focusedIndex < currentViewport.visibleFromIndex)
        visibleFromIndex = focusedIndex, visibleToIndex = Math.min(optionMap.size, visibleFromIndex + visibleOptionCount);
      else
        visibleToIndex = Math.min(optionMap.size, focusedIndex + 1), visibleFromIndex = Math.max(0, visibleToIndex - visibleOptionCount);
    else if (focusedIndex >= visibleOptionCount)
      visibleToIndex = Math.min(optionMap.size, focusedIndex + 1), visibleFromIndex = Math.max(0, visibleToIndex - visibleOptionCount);
    visibleFromIndex = Math.max(0, Math.min(visibleFromIndex, optionMap.size - 1)), visibleToIndex = Math.min(optionMap.size, Math.max(visibleOptionCount, visibleToIndex));
  }
  return {
    optionMap,
    visibleOptionCount,
    focusedValue,
    visibleFromIndex,
    visibleToIndex
  };
};
var init_use_select_navigation = __esm(() => {
  init_option_map();
  import_react45 = __toESM(require_react_development(), 1);
});
