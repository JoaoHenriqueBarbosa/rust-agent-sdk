// Original: src/tools/ConfigTool/ConfigTool.ts
function getValue2(source, path20) {
  if (source === "global") {
    let config10 = getGlobalConfig(), key3 = path20[0];
    if (!key3)
      return;
    return config10[key3];
  }
  let current = getInitialSettings();
  for (let key3 of path20)
    if (current && typeof current === "object" && key3 in current)
      current = current[key3];
    else
      return;
  return current;
}
function buildNestedObject(path20, value) {
  if (path20.length === 0)
    return {};
  let key3 = path20[0];
  if (path20.length === 1)
    return { [key3]: value };
  return { [key3]: buildNestedObject(path20.slice(1), value) };
}
var inputSchema30, outputSchema24, ConfigTool;
var init_ConfigTool = __esm(() => {
  init_v4();
  init_Tool();
  init_config4();
  init_errors();
  init_log3();
  init_settings2();
  init_slowOperations();
  init_prompt15();
  init_supportedSettings();
  init_UI22();
  inputSchema30 = lazySchema(() => exports_external.strictObject({
    setting: exports_external.string().describe('The setting key (e.g., "theme", "model", "permissions.defaultMode")'),
    value: exports_external.union([exports_external.string(), exports_external.boolean(), exports_external.number()]).optional().describe("The new value. Omit to get current value.")
  })), outputSchema24 = lazySchema(() => exports_external.object({
    success: exports_external.boolean(),
    operation: exports_external.enum(["get", "set"]).optional(),
    setting: exports_external.string().optional(),
    value: exports_external.unknown().optional(),
    previousValue: exports_external.unknown().optional(),
    newValue: exports_external.unknown().optional(),
    error: exports_external.string().optional()
  })), ConfigTool = buildTool({
    name: CONFIG_TOOL_NAME,
    searchHint: "get or set Claude Code settings (theme, model)",
    maxResultSizeChars: 1e5,
    async description() {
      return DESCRIPTION13;
    },
    async prompt() {
      return generatePrompt();
    },
    get inputSchema() {
      return inputSchema30();
    },
    get outputSchema() {
      return outputSchema24();
    },
    userFacingName() {
      return "Config";
    },
    shouldDefer: !0,
    isConcurrencySafe() {
      return !0;
    },
    isReadOnly(input) {
      return input.value === void 0;
    },
    toAutoClassifierInput(input) {
      return input.value === void 0 ? input.setting : `${input.setting} = ${input.value}`;
    },
    async checkPermissions(input) {
      if (input.value === void 0)
        return { behavior: "allow", updatedInput: input };
      return {
        behavior: "ask",
        message: `Set ${input.setting} to ${jsonStringify(input.value)}`
      };
    },
    renderToolUseMessage: renderToolUseMessage23,
    renderToolResultMessage: renderToolResultMessage22,
    renderToolUseRejectedMessage: renderToolUseRejectedMessage8,
    async call({ setting, value }, context6) {
      if (!isSupported(setting))
        return {
          data: { success: !1, error: `Unknown setting: "${setting}"` }
        };
      let config10 = getConfig3(setting), path20 = getPath(setting);
      if (value === void 0) {
        let currentValue = getValue2(config10.source, path20), displayValue = config10.formatOnRead ? config10.formatOnRead(currentValue) : currentValue;
        return {
          data: { success: !0, operation: "get", setting, value: displayValue }
        };
      }
      if (setting === "remoteControlAtStartup" && typeof value === "string" && value.toLowerCase().trim() === "default") {
        saveGlobalConfig((prev) => {
          if (prev.remoteControlAtStartup === void 0)
            return prev;
          let next2 = { ...prev };
          return delete next2.remoteControlAtStartup, next2;
        });
        let resolved = getRemoteControlAtStartup();
        return context6.setAppState((prev) => {
          if (prev.replBridgeEnabled === resolved && !prev.replBridgeOutboundOnly)
            return prev;
          return {
            ...prev,
            replBridgeEnabled: resolved,
            replBridgeOutboundOnly: !1
          };
        }), {
          data: {
            success: !0,
            operation: "set",
            setting,
            value: resolved
          }
        };
      }
      let finalValue = value;
      if (config10.type === "boolean") {
        if (typeof value === "string") {
          let lower = value.toLowerCase().trim();
          if (lower === "true")
            finalValue = !0;
          else if (lower === "false")
            finalValue = !1;
        }
        if (typeof finalValue !== "boolean")
          return {
            data: {
              success: !1,
              operation: "set",
              setting,
              error: `${setting} requires true or false.`
            }
          };
      }
      let options2 = getOptionsForSetting(setting);
      if (options2 && !options2.includes(String(finalValue)))
        return {
          data: {
            success: !1,
            operation: "set",
            setting,
            error: `Invalid value "${value}". Options: ${options2.join(", ")}`
          }
        };
      if (config10.validateOnWrite) {
        let result = await config10.validateOnWrite(finalValue);
        if (!result.valid)
          return {
            data: {
              success: !1,
              operation: "set",
              setting,
              error: result.error
            }
          };
      }
      let previousValue = getValue2(config10.source, path20);
      try {
        if (config10.source === "global") {
          let key3 = path20[0];
          if (!key3)
            return {
              data: {
                success: !1,
                operation: "set",
                setting,
                error: "Invalid setting path"
              }
            };
          saveGlobalConfig((prev) => {
            if (prev[key3] === finalValue)
              return prev;
            return { ...prev, [key3]: finalValue };
          });
        } else {
          let update2 = buildNestedObject(path20, finalValue), result = updateSettingsForSource("userSettings", update2);
          if (result.error)
            return {
              data: {
                success: !1,
                operation: "set",
                setting,
                error: result.error.message
              }
            };
        }
        if (config10.appStateKey) {
          let appKey = config10.appStateKey;
          context6.setAppState((prev) => {
            if (prev[appKey] === finalValue)
              return prev;
            return { ...prev, [appKey]: finalValue };
          });
        }
        if (setting === "remoteControlAtStartup") {
          let resolved = getRemoteControlAtStartup();
          context6.setAppState((prev) => {
            if (prev.replBridgeEnabled === resolved && !prev.replBridgeOutboundOnly)
              return prev;
            return {
              ...prev,
              replBridgeEnabled: resolved,
              replBridgeOutboundOnly: !1
            };
          });
        }
        return logEvent("tengu_config_tool_changed", {
          setting,
          value: String(finalValue)
        }), {
          data: {
            success: !0,
            operation: "set",
            setting,
            previousValue,
            newValue: finalValue
          }
        };
      } catch (error44) {
        return logError2(error44), {
          data: {
            success: !1,
            operation: "set",
            setting,
            error: errorMessage(error44)
          }
        };
      }
    },
    mapToolResultToToolResultBlockParam(content, toolUseID) {
      if (content.success) {
        if (content.operation === "get")
          return {
            tool_use_id: toolUseID,
            type: "tool_result",
            content: `${content.setting} = ${jsonStringify(content.value)}`
          };
        return {
          tool_use_id: toolUseID,
          type: "tool_result",
          content: `Set ${content.setting} to ${jsonStringify(content.newValue)}`
        };
      }
      return {
        tool_use_id: toolUseID,
        type: "tool_result",
        content: `Error: ${content.error}`,
        is_error: !0
      };
    }
  });
});
