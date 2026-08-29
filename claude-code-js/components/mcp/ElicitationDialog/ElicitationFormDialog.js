// function: ElicitationFormDialog
function ElicitationFormDialog({
  event,
  onResponse
}) {
  let {
    serverName,
    signal
  } = event, request2 = event.params, {
    message,
    requestedSchema
  } = request2, hasFields = Object.keys(requestedSchema.properties).length > 0, [focusedButton, setFocusedButton] = import_react220.useState(hasFields ? null : "accept"), [formValues, setFormValues] = import_react220.useState(() => {
    let initialValues = {};
    if (requestedSchema.properties) {
      for (let [propName, propSchema] of Object.entries(requestedSchema.properties))
        if (typeof propSchema === "object" && propSchema !== null) {
          if (propSchema.default !== void 0)
            initialValues[propName] = propSchema.default;
        }
    }
    return initialValues;
  }), [validationErrors, setValidationErrors] = import_react220.useState(() => {
    let initialErrors = {};
    for (let [propName_0, propSchema_0] of Object.entries(requestedSchema.properties))
      if (isTextField(propSchema_0) && propSchema_0?.default !== void 0) {
        let validation = validateElicitationInput(String(propSchema_0.default), propSchema_0);
        if (!validation.isValid && validation.error)
          initialErrors[propName_0] = validation.error;
      }
    return initialErrors;
  });
  import_react220.useEffect(() => {
    if (!signal)
      return;
    let handleAbort2 = () => {
      onResponse("cancel");
    };
    if (signal.aborted) {
      handleAbort2();
      return;
    }
    return signal.addEventListener("abort", handleAbort2), () => {
      signal.removeEventListener("abort", handleAbort2);
    };
  }, [signal, onResponse]);
  let schemaFields = import_react220.useMemo(() => {
    let requiredFields = requestedSchema.required ?? [];
    return Object.entries(requestedSchema.properties).map(([name3, schema5]) => ({
      name: name3,
      schema: schema5,
      isRequired: requiredFields.includes(name3)
    }));
  }, [requestedSchema]), [currentFieldIndex, setCurrentFieldIndex] = import_react220.useState(hasFields ? 0 : void 0), [textInputValue, setTextInputValue] = import_react220.useState(() => {
    let firstField = schemaFields[0];
    if (firstField && isTextField(firstField.schema)) {
      let val = formValues[firstField.name];
      if (val === void 0)
        return "";
      return String(val);
    }
    return "";
  }), [textInputCursorOffset, setTextInputCursorOffset] = import_react220.useState(textInputValue.length), [resolvingFields, setResolvingFields] = import_react220.useState(() => /* @__PURE__ */ new Set), [expandedAccordion, setExpandedAccordion] = import_react220.useState(), [accordionOptionIndex, setAccordionOptionIndex] = import_react220.useState(0), dateDebounceRef = import_react220.useRef(void 0), resolveAbortRef = import_react220.useRef(/* @__PURE__ */ new Map), enumTypeaheadRef = import_react220.useRef({
    buffer: "",
    timer: void 0
  });
  import_react220.useEffect(() => () => {
    if (dateDebounceRef.current !== void 0)
      clearTimeout(dateDebounceRef.current);
    let ta = enumTypeaheadRef.current;
    if (ta.timer !== void 0)
      clearTimeout(ta.timer);
    for (let controller of resolveAbortRef.current.values())
      controller.abort();
    resolveAbortRef.current.clear();
  }, []);
  let {
    columns,
    rows
  } = useTerminalSize(), currentField = currentFieldIndex !== void 0 ? schemaFields[currentFieldIndex] : void 0, isEditingTextField = currentField !== void 0 && isTextField(currentField.schema) && !isEnumSchema(currentField.schema) && !focusedButton;
  useRegisterOverlay("elicitation"), useNotifyAfterTimeout("Claude Code needs your input", "elicitation_dialog");
  let syncTextInput = import_react220.useCallback((fieldIndex) => {
    if (fieldIndex === void 0) {
      setTextInputValue(""), setTextInputCursorOffset(0);
      return;
    }
    let field = schemaFields[fieldIndex];
    if (field && isTextField(field.schema) && !isEnumSchema(field.schema)) {
      let val_0 = formValues[field.name], text2 = val_0 !== void 0 ? String(val_0) : "";
      setTextInputValue(text2), setTextInputCursorOffset(text2.length);
    }
  }, [schemaFields, formValues]);
  function validateMultiSelect(fieldName, schema_0) {
    if (!isMultiSelectEnumSchema(schema_0))
      return;
    let selected = formValues[fieldName] ?? [], fieldRequired = schemaFields.find((f) => f.name === fieldName)?.isRequired ?? !1, min = schema_0.minItems, max2 = schema_0.maxItems;
    if (min !== void 0 && selected.length < min && (selected.length > 0 || fieldRequired))
      updateValidationError(fieldName, `Select at least ${min} ${plural(min, "item")}`);
    else if (max2 !== void 0 && selected.length > max2)
      updateValidationError(fieldName, `Select at most ${max2} ${plural(max2, "item")}`);
    else
      updateValidationError(fieldName);
  }
  function handleNavigation(direction) {
    if (currentField && isMultiSelectEnumSchema(currentField.schema))
      validateMultiSelect(currentField.name, currentField.schema), setExpandedAccordion(void 0);
    else if (currentField && isEnumSchema(currentField.schema))
      setExpandedAccordion(void 0);
    if (isEditingTextField && currentField) {
      if (commitTextField(currentField.name, currentField.schema, textInputValue), dateDebounceRef.current !== void 0)
        clearTimeout(dateDebounceRef.current), dateDebounceRef.current = void 0;
      if (isDateTimeSchema(currentField.schema) && textInputValue.trim() !== "" && validationErrors[currentField.name])
        resolveFieldAsync(currentField.name, currentField.schema, textInputValue);
    }
    let itemCount = schemaFields.length + 2, index2 = currentFieldIndex ?? (focusedButton === "accept" ? schemaFields.length : focusedButton === "decline" ? schemaFields.length + 1 : void 0), nextIndex = index2 !== void 0 ? (index2 + (direction === "up" ? itemCount - 1 : 1)) % itemCount : 0;
    if (nextIndex < schemaFields.length)
      setCurrentFieldIndex(nextIndex), setFocusedButton(null), syncTextInput(nextIndex);
    else
      setCurrentFieldIndex(void 0), setFocusedButton(nextIndex === schemaFields.length ? "accept" : "decline"), setTextInputValue("");
  }
  function setField(fieldName_0, value) {
    if (setFormValues((prev) => {
      let next2 = {
        ...prev
      };
      if (value === void 0)
        delete next2[fieldName_0];
      else
        next2[fieldName_0] = value;
      return next2;
    }), value !== void 0 && validationErrors[fieldName_0] === "This field is required")
      updateValidationError(fieldName_0);
  }
  function updateValidationError(fieldName_1, error44) {
    setValidationErrors((prev_0) => {
      let next_0 = {
        ...prev_0
      };
      if (error44)
        next_0[fieldName_1] = error44;
      else
        delete next_0[fieldName_1];
      return next_0;
    });
  }
  function unsetField(fieldName_2) {
    if (!fieldName_2)
      return;
    setField(fieldName_2, void 0), updateValidationError(fieldName_2), setTextInputValue(""), setTextInputCursorOffset(0);
  }
  function commitTextField(fieldName_3, schema_1, value_0) {
    let trimmedValue = value_0.trim();
    if (trimmedValue === "" && (schema_1.type !== "string" || ("format" in schema_1) && schema_1.format !== void 0)) {
      unsetField(fieldName_3);
      return;
    }
    if (trimmedValue === "") {
      if (formValues[fieldName_3] !== void 0)
        setField(fieldName_3, "");
      return;
    }
    let validation_0 = validateElicitationInput(value_0, schema_1);
    setField(fieldName_3, validation_0.isValid ? validation_0.value : value_0), updateValidationError(fieldName_3, validation_0.isValid ? void 0 : validation_0.error);
  }
  function resolveFieldAsync(fieldName_4, schema_2, rawValue) {
    if (!signal)
      return;
    let existing = resolveAbortRef.current.get(fieldName_4);
    if (existing)
      existing.abort();
    let controller_0 = new AbortController;
    resolveAbortRef.current.set(fieldName_4, controller_0), setResolvingFields((prev_1) => new Set(prev_1).add(fieldName_4)), validateElicitationInputAsync(rawValue, schema_2, controller_0.signal).then((result) => {
      if (resolveAbortRef.current.delete(fieldName_4), setResolvingFields((prev_2) => {
        let next_1 = new Set(prev_2);
        return next_1.delete(fieldName_4), next_1;
      }), controller_0.signal.aborted)
        return;
      if (result.isValid) {
        setField(fieldName_4, result.value), updateValidationError(fieldName_4);
        let isoText = String(result.value);
        setTextInputValue((prev_3) => {
          if (prev_3 === rawValue)
            return setTextInputCursorOffset(isoText.length), isoText;
          return prev_3;
        });
      } else
        updateValidationError(fieldName_4, result.error);
    }, () => {
      resolveAbortRef.current.delete(fieldName_4), setResolvingFields((prev_4) => {
        let next_2 = new Set(prev_4);
        return next_2.delete(fieldName_4), next_2;
      });
    });
  }
  function handleTextInputChange(newValue) {
    if (setTextInputValue(newValue), currentField) {
      if (commitTextField(currentField.name, currentField.schema, newValue), dateDebounceRef.current !== void 0)
        clearTimeout(dateDebounceRef.current), dateDebounceRef.current = void 0;
      if (isDateTimeSchema(currentField.schema) && newValue.trim() !== "" && validationErrors[currentField.name]) {
        let { name: fieldName_5, schema: schema_3 } = currentField;
        dateDebounceRef.current = setTimeout((dateDebounceRef_0, resolveFieldAsync_0, fieldName_6, schema_4, newValue_0) => {
          dateDebounceRef_0.current = void 0, resolveFieldAsync_0(fieldName_6, schema_4, newValue_0);
        }, 2000, dateDebounceRef, resolveFieldAsync, fieldName_5, schema_3, newValue);
      }
    }
  }
  function handleTextInputSubmit() {
    handleNavigation("down");
  }
  function runTypeahead(char, labels, onMatch) {
    let ta_0 = enumTypeaheadRef.current;
    if (ta_0.timer !== void 0)
      clearTimeout(ta_0.timer);
    ta_0.buffer += char.toLowerCase(), ta_0.timer = setTimeout(resetTypeahead, 2000, ta_0);
    let match = labels.findIndex((l3) => l3.startsWith(ta_0.buffer));
    if (match !== -1)
      onMatch(match);
  }
  useKeybinding("confirm:no", () => {
    if (isEditingTextField && currentField) {
      let val_1 = formValues[currentField.name];
      setTextInputValue(val_1 !== void 0 ? String(val_1) : ""), setTextInputCursorOffset(0);
    }
    onResponse("cancel");
  }, {
    context: "Settings",
    isActive: !!currentField && !focusedButton && !expandedAccordion
  }), use_input_default((_input, key3) => {
    if (isEditingTextField && !key3.upArrow && !key3.downArrow && !key3.return && !key3.backspace)
      return;
    if (expandedAccordion && currentField && isMultiSelectEnumSchema(currentField.schema)) {
      let msSchema = currentField.schema, msValues = getMultiSelectValues(msSchema), selected_0 = formValues[currentField.name] ?? [];
      if (key3.leftArrow || key3.escape) {
        setExpandedAccordion(void 0), validateMultiSelect(currentField.name, msSchema);
        return;
      }
      if (key3.upArrow) {
        if (accordionOptionIndex === 0)
          setExpandedAccordion(void 0), validateMultiSelect(currentField.name, msSchema);
        else
          setAccordionOptionIndex(accordionOptionIndex - 1);
        return;
      }
      if (key3.downArrow) {
        if (accordionOptionIndex >= msValues.length - 1)
          setExpandedAccordion(void 0), handleNavigation("down");
        else
          setAccordionOptionIndex(accordionOptionIndex + 1);
        return;
      }
      if (_input === " ") {
        let optionValue = msValues[accordionOptionIndex];
        if (optionValue !== void 0) {
          let newSelected = selected_0.includes(optionValue) ? selected_0.filter((v2) => v2 !== optionValue) : [...selected_0, optionValue], newValue_1 = newSelected.length > 0 ? newSelected : void 0;
          setField(currentField.name, newValue_1);
          let { minItems: min_0, maxItems: max_0 } = msSchema;
          if (min_0 !== void 0 && newSelected.length < min_0 && (newSelected.length > 0 || currentField.isRequired))
            updateValidationError(currentField.name, `Select at least ${min_0} ${plural(min_0, "item")}`);
          else if (max_0 !== void 0 && newSelected.length > max_0)
            updateValidationError(currentField.name, `Select at most ${max_0} ${plural(max_0, "item")}`);
          else
            updateValidationError(currentField.name);
        }
        return;
      }
      if (key3.return) {
        let optionValue_0 = msValues[accordionOptionIndex];
        if (optionValue_0 !== void 0 && !selected_0.includes(optionValue_0))
          setField(currentField.name, [...selected_0, optionValue_0]);
        setExpandedAccordion(void 0), handleNavigation("down");
        return;
      }
      if (_input) {
        let labels_0 = msValues.map((v_0) => getMultiSelectLabel(msSchema, v_0).toLowerCase());
        runTypeahead(_input, labels_0, setAccordionOptionIndex);
        return;
      }
      return;
    }
    if (expandedAccordion && currentField && isEnumSchema(currentField.schema)) {
      let enumSchema = currentField.schema, enumValues = getEnumValues2(enumSchema);
      if (key3.leftArrow || key3.escape) {
        setExpandedAccordion(void 0);
        return;
      }
      if (key3.upArrow) {
        if (accordionOptionIndex === 0)
          setExpandedAccordion(void 0);
        else
          setAccordionOptionIndex(accordionOptionIndex - 1);
        return;
      }
      if (key3.downArrow) {
        if (accordionOptionIndex >= enumValues.length - 1)
          setExpandedAccordion(void 0), handleNavigation("down");
        else
          setAccordionOptionIndex(accordionOptionIndex + 1);
        return;
      }
      if (_input === " ") {
        let optionValue_1 = enumValues[accordionOptionIndex];
        if (optionValue_1 !== void 0)
          setField(currentField.name, optionValue_1);
        setExpandedAccordion(void 0);
        return;
      }
      if (key3.return) {
        let optionValue_2 = enumValues[accordionOptionIndex];
        if (optionValue_2 !== void 0)
          setField(currentField.name, optionValue_2);
        setExpandedAccordion(void 0), handleNavigation("down");
        return;
      }
      if (_input) {
        let labels_1 = enumValues.map((v_1) => getEnumLabel(enumSchema, v_1).toLowerCase());
        runTypeahead(_input, labels_1, setAccordionOptionIndex);
        return;
      }
      return;
    }
    if (key3.return && focusedButton === "accept") {
      if (validateRequired() && Object.keys(validationErrors).length === 0)
        onResponse("accept", formValues);
      else {
        let requiredFields_0 = requestedSchema.required || [];
        for (let fieldName_7 of requiredFields_0)
          if (formValues[fieldName_7] === void 0)
            updateValidationError(fieldName_7, "This field is required");
        let firstBadIndex = schemaFields.findIndex((f_0) => requiredFields_0.includes(f_0.name) && formValues[f_0.name] === void 0 || validationErrors[f_0.name] !== void 0);
        if (firstBadIndex !== -1)
          setCurrentFieldIndex(firstBadIndex), setFocusedButton(null), syncTextInput(firstBadIndex);
      }
      return;
    }
    if (key3.return && focusedButton === "decline") {
      onResponse("decline");
      return;
    }
    if (key3.upArrow || key3.downArrow) {
      let ta_1 = enumTypeaheadRef.current;
      if (ta_1.buffer = "", ta_1.timer !== void 0)
        clearTimeout(ta_1.timer), ta_1.timer = void 0;
      handleNavigation(key3.upArrow ? "up" : "down");
      return;
    }
    if (focusedButton && (key3.leftArrow || key3.rightArrow)) {
      setFocusedButton(focusedButton === "accept" ? "decline" : "accept");
      return;
    }
    if (!currentField)
      return;
    let {
      schema: schema_5,
      name: name_0
    } = currentField, value_1 = formValues[name_0];
    if (schema_5.type === "boolean") {
      if (_input === " ") {
        setField(name_0, value_1 === void 0 ? !0 : !value_1);
        return;
      }
      if (key3.return) {
        handleNavigation("down");
        return;
      }
      if (key3.backspace && value_1 !== void 0) {
        unsetField(name_0);
        return;
      }
      if (_input && !key3.return) {
        runTypeahead(_input, ["yes", "no"], (i5) => setField(name_0, i5 === 0));
        return;
      }
      return;
    }
    if (isEnumSchema(schema_5) || isMultiSelectEnumSchema(schema_5)) {
      if (key3.return) {
        handleNavigation("down");
        return;
      }
      if (key3.backspace && value_1 !== void 0) {
        unsetField(name_0);
        return;
      }
      let labels_2, startIdx = 0;
      if (isEnumSchema(schema_5)) {
        let vals = getEnumValues2(schema_5);
        if (labels_2 = vals.map((v_2) => getEnumLabel(schema_5, v_2).toLowerCase()), value_1 !== void 0)
          startIdx = Math.max(0, vals.indexOf(value_1));
      } else
        labels_2 = getMultiSelectValues(schema_5).map((v_3) => getMultiSelectLabel(schema_5, v_3).toLowerCase());
      if (key3.rightArrow) {
        setExpandedAccordion(name_0), setAccordionOptionIndex(startIdx);
        return;
      }
      if (_input && !key3.leftArrow) {
        runTypeahead(_input, labels_2, (i_0) => {
          setExpandedAccordion(name_0), setAccordionOptionIndex(i_0);
        });
        return;
      }
      return;
    }
    if (key3.backspace) {
      if (isEditingTextField && textInputValue === "") {
        unsetField(name_0);
        return;
      }
    }
  }, {
    isActive: !0
  });
  function validateRequired() {
    let requiredFields_1 = requestedSchema.required || [];
    for (let fieldName_8 of requiredFields_1) {
      let value_2 = formValues[fieldName_8];
      if (value_2 === void 0 || value_2 === null || value_2 === "")
        return !1;
      if (Array.isArray(value_2) && value_2.length === 0)
        return !1;
    }
    return !0;
  }
  let LINES_PER_FIELD = 3, maxVisibleFields = Math.max(2, Math.floor((rows - 14) / LINES_PER_FIELD)), scrollWindow = import_react220.useMemo(() => {
    let total = schemaFields.length;
    if (total <= maxVisibleFields)
      return {
        start: 0,
        end: total
      };
    let focusIdx = currentFieldIndex ?? total - 1, start = Math.max(0, focusIdx - Math.floor(maxVisibleFields / 2)), end = Math.min(start + maxVisibleFields, total);
    return start = Math.max(0, end - maxVisibleFields), {
      start,
      end
    };
  }, [schemaFields.length, maxVisibleFields, currentFieldIndex]), hasFieldsAbove = scrollWindow.start > 0, hasFieldsBelow = scrollWindow.end < schemaFields.length;
  function renderFormFields() {
    if (!schemaFields.length)
      return null;
    return /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        hasFieldsAbove && /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedBox_default, {
          marginLeft: 2,
          children: /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
            dimColor: !0,
            children: [
              figures_default.arrowUp,
              " ",
              scrollWindow.start,
              " more above"
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this),
        schemaFields.slice(scrollWindow.start, scrollWindow.end).map((field_0, visibleIdx) => {
          let index_0 = scrollWindow.start + visibleIdx, {
            name: name_1,
            schema: schema_6,
            isRequired
          } = field_0, isActive = index_0 === currentFieldIndex && !focusedButton, value_3 = formValues[name_1], hasValue = value_3 !== void 0 && (!Array.isArray(value_3) || value_3.length > 0), error_0 = validationErrors[name_1], checkbox = resolvingFields.has(name_1) ? /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ResolvingSpinner, {}, void 0, !1, void 0, this) : error_0 ? /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
            color: "error",
            children: figures_default.warning
          }, void 0, !1, void 0, this) : hasValue ? /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
            color: "success",
            dimColor: !isActive,
            children: figures_default.tick
          }, void 0, !1, void 0, this) : isRequired ? /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
            color: "error",
            children: "*"
          }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
            children: " "
          }, void 0, !1, void 0, this), selectionColor = error_0 ? "error" : hasValue ? "success" : isRequired ? "error" : "suggestion", activeColor = isActive ? selectionColor : void 0, label = /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
            color: activeColor,
            bold: isActive,
            children: schema_6.title || name_1
          }, void 0, !1, void 0, this), valueContent, accordionContent = null;
          if (isMultiSelectEnumSchema(schema_6)) {
            let msValues_0 = getMultiSelectValues(schema_6), selected_1 = value_3 ?? [];
            if (expandedAccordion === name_1 && isActive)
              valueContent = /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
                dimColor: !0,
                children: figures_default.triangleDownSmall
              }, void 0, !1, void 0, this), accordionContent = /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedBox_default, {
                flexDirection: "column",
                marginLeft: 6,
                children: msValues_0.map((optVal, optIdx) => {
                  let optLabel = getMultiSelectLabel(schema_6, optVal), isChecked = selected_1.includes(optVal), isFocused = optIdx === accordionOptionIndex;
                  return /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedBox_default, {
                    gap: 1,
                    children: [
                      /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
                        color: "suggestion",
                        children: isFocused ? figures_default.pointer : " "
                      }, void 0, !1, void 0, this),
                      /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
                        color: isChecked ? "success" : void 0,
                        children: isChecked ? figures_default.checkboxOn : figures_default.checkboxOff
                      }, void 0, !1, void 0, this),
                      /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
                        color: isFocused ? "suggestion" : void 0,
                        bold: isFocused,
                        children: optLabel
                      }, void 0, !1, void 0, this)
                    ]
                  }, optVal, !0, void 0, this);
                })
              }, void 0, !1, void 0, this);
            else {
              let arrow = isActive ? /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
                dimColor: !0,
                children: [
                  figures_default.triangleRightSmall,
                  " "
                ]
              }, void 0, !0, void 0, this) : null;
              if (selected_1.length > 0) {
                let displayLabels = selected_1.map((v_4) => getMultiSelectLabel(schema_6, v_4));
                valueContent = /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
                  children: [
                    arrow,
                    /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
                      color: activeColor,
                      bold: isActive,
                      children: displayLabels.join(", ")
                    }, void 0, !1, void 0, this)
                  ]
                }, void 0, !0, void 0, this);
              } else
                valueContent = /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
                  children: [
                    arrow,
                    /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
                      dimColor: !0,
                      italic: !0,
                      children: "not set"
                    }, void 0, !1, void 0, this)
                  ]
                }, void 0, !0, void 0, this);
            }
          } else if (isEnumSchema(schema_6)) {
            let enumValues_0 = getEnumValues2(schema_6);
            if (expandedAccordion === name_1 && isActive)
              valueContent = /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
                dimColor: !0,
                children: figures_default.triangleDownSmall
              }, void 0, !1, void 0, this), accordionContent = /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedBox_default, {
                flexDirection: "column",
                marginLeft: 6,
                children: enumValues_0.map((optVal_0, optIdx_0) => {
                  let optLabel_0 = getEnumLabel(schema_6, optVal_0), isSelected = value_3 === optVal_0, isFocused_0 = optIdx_0 === accordionOptionIndex;
                  return /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedBox_default, {
                    gap: 1,
                    children: [
                      /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
                        color: "suggestion",
                        children: isFocused_0 ? figures_default.pointer : " "
                      }, void 0, !1, void 0, this),
                      /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
                        color: isSelected ? "success" : void 0,
                        children: isSelected ? figures_default.radioOn : figures_default.radioOff
                      }, void 0, !1, void 0, this),
                      /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
                        color: isFocused_0 ? "suggestion" : void 0,
                        bold: isFocused_0,
                        children: optLabel_0
                      }, void 0, !1, void 0, this)
                    ]
                  }, optVal_0, !0, void 0, this);
                })
              }, void 0, !1, void 0, this);
            else {
              let arrow_0 = isActive ? /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
                dimColor: !0,
                children: [
                  figures_default.triangleRightSmall,
                  " "
                ]
              }, void 0, !0, void 0, this) : null;
              if (hasValue)
                valueContent = /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
                  children: [
                    arrow_0,
                    /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
                      color: activeColor,
                      bold: isActive,
                      children: getEnumLabel(schema_6, value_3)
                    }, void 0, !1, void 0, this)
                  ]
                }, void 0, !0, void 0, this);
              else
                valueContent = /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
                  children: [
                    arrow_0,
                    /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
                      dimColor: !0,
                      italic: !0,
                      children: "not set"
                    }, void 0, !1, void 0, this)
                  ]
                }, void 0, !0, void 0, this);
            }
          } else if (schema_6.type === "boolean")
            if (isActive)
              valueContent = hasValue ? /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
                color: activeColor,
                bold: !0,
                children: value_3 ? figures_default.checkboxOn : figures_default.checkboxOff
              }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
                dimColor: !0,
                children: figures_default.checkboxOff
              }, void 0, !1, void 0, this);
            else
              valueContent = hasValue ? /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
                children: value_3 ? figures_default.checkboxOn : figures_default.checkboxOff
              }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
                dimColor: !0,
                italic: !0,
                children: "not set"
              }, void 0, !1, void 0, this);
          else if (isTextField(schema_6))
            if (isActive)
              valueContent = /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(TextInput, {
                value: textInputValue,
                onChange: handleTextInputChange,
                onSubmit: handleTextInputSubmit,
                placeholder: "Type something\u2026",
                columns: Math.min(columns - 20, 60),
                cursorOffset: textInputCursorOffset,
                onChangeCursorOffset: setTextInputCursorOffset,
                focus: !0,
                showCursor: !0
              }, void 0, !1, void 0, this);
            else {
              let displayValue = hasValue && isDateTimeSchema(schema_6) ? formatDateDisplay(String(value_3), schema_6) : String(value_3);
              valueContent = hasValue ? /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
                children: displayValue
              }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
                dimColor: !0,
                italic: !0,
                children: "not set"
              }, void 0, !1, void 0, this);
            }
          else
            valueContent = hasValue ? /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
              children: String(value_3)
            }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
              dimColor: !0,
              italic: !0,
              children: "not set"
            }, void 0, !1, void 0, this);
          return /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            children: [
              /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedBox_default, {
                gap: 1,
                children: [
                  /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
                    color: selectionColor,
                    children: isActive ? figures_default.pointer : " "
                  }, void 0, !1, void 0, this),
                  checkbox,
                  /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedBox_default, {
                    children: [
                      label,
                      /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
                        color: activeColor,
                        children: ": "
                      }, void 0, !1, void 0, this),
                      valueContent
                    ]
                  }, void 0, !0, void 0, this)
                ]
              }, void 0, !0, void 0, this),
              accordionContent,
              schema_6.description && /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedBox_default, {
                marginLeft: 6,
                children: /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
                  dimColor: !0,
                  children: schema_6.description
                }, void 0, !1, void 0, this)
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedBox_default, {
                marginLeft: 6,
                height: 1,
                children: error_0 ? /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
                  color: "error",
                  italic: !0,
                  children: error_0
                }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
                  children: " "
                }, void 0, !1, void 0, this)
              }, void 0, !1, void 0, this)
            ]
          }, name_1, !0, void 0, this);
        }),
        hasFieldsBelow && /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedBox_default, {
          marginLeft: 2,
          children: /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
            dimColor: !0,
            children: [
              figures_default.arrowDown,
              " ",
              schemaFields.length - scrollWindow.end,
              " more below"
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this);
  }
  return /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(Dialog, {
    title: `MCP server \u201C${serverName}\u201D requests your input`,
    subtitle: `
${message}`,
    color: "permission",
    onCancel: () => onResponse("cancel"),
    isCancelActive: (!currentField || !!focusedButton) && !expandedAccordion,
    inputGuide: (exitState) => exitState.pending ? /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
      children: [
        "Press ",
        exitState.keyName,
        " again to exit"
      ]
    }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(Byline, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ConfigurableShortcutHint, {
          action: "confirm:no",
          context: "Confirmation",
          fallback: "Esc",
          description: "cancel"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(KeyboardShortcutHint, {
          shortcut: "\u2191\u2193",
          action: "navigate"
        }, void 0, !1, void 0, this),
        currentField && /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(KeyboardShortcutHint, {
          shortcut: "Backspace",
          action: "unset"
        }, void 0, !1, void 0, this),
        currentField && currentField.schema.type === "boolean" && /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(KeyboardShortcutHint, {
          shortcut: "Space",
          action: "toggle"
        }, void 0, !1, void 0, this),
        currentField && isEnumSchema(currentField.schema) && (expandedAccordion ? /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(KeyboardShortcutHint, {
          shortcut: "Space",
          action: "select"
        }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(KeyboardShortcutHint, {
          shortcut: "\u2192",
          action: "expand"
        }, void 0, !1, void 0, this)),
        currentField && isMultiSelectEnumSchema(currentField.schema) && (expandedAccordion ? /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(KeyboardShortcutHint, {
          shortcut: "Space",
          action: "toggle"
        }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(KeyboardShortcutHint, {
          shortcut: "\u2192",
          action: "expand"
        }, void 0, !1, void 0, this))
      ]
    }, void 0, !0, void 0, this),
    children: /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        renderFormFields(),
        /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedBox_default, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
              color: "success",
              children: focusedButton === "accept" ? figures_default.pointer : " "
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
              bold: focusedButton === "accept",
              color: focusedButton === "accept" ? "success" : void 0,
              dimColor: focusedButton !== "accept",
              children: " Accept  "
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
              color: "error",
              children: focusedButton === "decline" ? figures_default.pointer : " "
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ThemedText, {
              bold: focusedButton === "decline",
              color: focusedButton === "decline" ? "error" : void 0,
              dimColor: focusedButton !== "decline",
              children: " Decline"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this)
  }, void 0, !1, void 0, this);
}
