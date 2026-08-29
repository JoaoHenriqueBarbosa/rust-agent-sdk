// Original: src/commands/effort/effort.tsx
var exports_effort = {};
__export(exports_effort, {
  showCurrentEffort: () => showCurrentEffort,
  executeEffort: () => executeEffort,
  call: () => call66
});
function setEffortValue(effortValue) {
  let persistable = toPersistableEffort(effortValue);
  if (persistable !== void 0) {
    let result = updateSettingsForSource("userSettings", {
      effortLevel: persistable
    });
    if (result.error)
      return {
        message: `Failed to set effort level: ${result.error.message}`
      };
  }
  logEvent("tengu_effort_command", {
    effort: effortValue
  });
  let envOverride = getEffortEnvOverride();
  if (envOverride !== void 0 && envOverride !== effortValue) {
    let envRaw = process.env.CLAUDE_CODE_EFFORT_LEVEL;
    if (persistable === void 0)
      return {
        message: `Not applied: CLAUDE_CODE_EFFORT_LEVEL=${envRaw} overrides effort this session, and ${effortValue} is session-only (nothing saved)`,
        effortUpdate: {
          value: effortValue
        }
      };
    return {
      message: `CLAUDE_CODE_EFFORT_LEVEL=${envRaw} overrides this session \u2014 clear it and ${effortValue} takes over`,
      effortUpdate: {
        value: effortValue
      }
    };
  }
  let description = getEffortValueDescription(effortValue);
  return {
    message: `Set effort level to ${effortValue}${persistable !== void 0 ? "" : " (this session only)"}: ${description}`,
    effortUpdate: {
      value: effortValue
    }
  };
}
function showCurrentEffort(appStateEffort, model) {
  let envOverride = getEffortEnvOverride(), effectiveValue = envOverride === null ? void 0 : envOverride ?? appStateEffort;
  if (effectiveValue === void 0)
    return {
      message: `Effort level: auto (currently ${getDisplayedEffortLevel(model, appStateEffort)})`
    };
  let description = getEffortValueDescription(effectiveValue);
  return {
    message: `Current effort level: ${effectiveValue} (${description})`
  };
}
function unsetEffortLevel() {
  let result = updateSettingsForSource("userSettings", {
    effortLevel: void 0
  });
  if (result.error)
    return {
      message: `Failed to set effort level: ${result.error.message}`
    };
  logEvent("tengu_effort_command", {
    effort: "auto"
  });
  let envOverride = getEffortEnvOverride();
  if (envOverride !== void 0 && envOverride !== null)
    return {
      message: `Cleared effort from settings, but CLAUDE_CODE_EFFORT_LEVEL=${process.env.CLAUDE_CODE_EFFORT_LEVEL} still controls this session`,
      effortUpdate: {
        value: void 0
      }
    };
  return {
    message: "Effort level set to auto",
    effortUpdate: {
      value: void 0
    }
  };
}
function executeEffort(args) {
  let normalized = args.toLowerCase();
  if (normalized === "auto" || normalized === "unset")
    return unsetEffortLevel();
  if (!isEffortLevel(normalized))
    return {
      message: `Invalid argument: ${args}. Valid options are: low, medium, high, max, auto`
    };
  return setEffortValue(normalized);
}
function ShowCurrentEffort(t0) {
  let {
    onDone
  } = t0, effortValue = useAppState(_temp169), model = useMainLoopModel(), {
    message
  } = showCurrentEffort(effortValue, model);
  return onDone(message), null;
}
function _temp169(s2) {
  return s2.effortValue;
}
function ApplyEffortAndClose(t0) {
  let $3 = import_compiler_runtime277.c(6), {
    result,
    onDone
  } = t0, setAppState = useSetAppState(), {
    effortUpdate,
    message
  } = result, t1, t2;
  if ($3[0] !== effortUpdate || $3[1] !== message || $3[2] !== onDone || $3[3] !== setAppState)
    t1 = () => {
      if (effortUpdate)
        setAppState((prev) => ({
          ...prev,
          effortValue: effortUpdate.value
        }));
      onDone(message);
    }, t2 = [setAppState, effortUpdate, message, onDone], $3[0] = effortUpdate, $3[1] = message, $3[2] = onDone, $3[3] = setAppState, $3[4] = t1, $3[5] = t2;
  else
    t1 = $3[4], t2 = $3[5];
  return React111.useEffect(t1, t2), null;
}
async function call66(onDone, _context, args) {
  if (args = args?.trim() || "", COMMON_HELP_ARGS2.includes(args)) {
    onDone(`Usage: /effort [low|medium|high|max|auto]

Effort levels:
- low: Quick, straightforward implementation
- medium: Balanced approach with standard testing
- high: Comprehensive implementation with extensive testing
- max: Maximum capability with deepest reasoning (Opus 4.6 only)
- auto: Use the default effort level for your model`);
    return;
  }
  if (!args || args === "current" || args === "status")
    return /* @__PURE__ */ jsx_dev_runtime358.jsxDEV(ShowCurrentEffort, {
      onDone
    }, void 0, !1, void 0, this);
  let result = executeEffort(args);
  return /* @__PURE__ */ jsx_dev_runtime358.jsxDEV(ApplyEffortAndClose, {
    result,
    onDone
  }, void 0, !1, void 0, this);
}
var import_compiler_runtime277, React111, jsx_dev_runtime358, COMMON_HELP_ARGS2;
var init_effort2 = __esm(() => {
  init_useMainLoopModel();
  init_AppState();
  init_effort();
  init_settings2();
  import_compiler_runtime277 = __toESM(require_react_compiler_runtime_development(), 1), React111 = __toESM(require_react_development(), 1), jsx_dev_runtime358 = __toESM(require_react_jsx_dev_runtime_development(), 1), COMMON_HELP_ARGS2 = ["help", "-h", "--help"];
});
