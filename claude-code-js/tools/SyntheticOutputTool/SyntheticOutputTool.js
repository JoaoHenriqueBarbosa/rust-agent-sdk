// Original: src/tools/SyntheticOutputTool/SyntheticOutputTool.ts
function isSyntheticOutputToolEnabled(opts) {
  return opts.isNonInteractiveSession;
}
function createSyntheticOutputTool(jsonSchema) {
  let cached2 = toolCache.get(jsonSchema);
  if (cached2)
    return cached2;
  let result = buildSyntheticOutputTool(jsonSchema);
  return toolCache.set(jsonSchema, result), result;
}
function buildSyntheticOutputTool(jsonSchema) {
  try {
    let ajv = new import_ajv.Ajv({ allErrors: !0 });
    if (!ajv.validateSchema(jsonSchema))
      return { error: ajv.errorsText(ajv.errors) };
    let validateSchema = ajv.compile(jsonSchema);
    return {
      tool: {
        ...SyntheticOutputTool,
        inputJSONSchema: jsonSchema,
        async call(input) {
          if (!validateSchema(input)) {
            let errors8 = validateSchema.errors?.map((e) => `${e.instancePath || "root"}: ${e.message}`).join(", ");
            throw new TelemetrySafeError_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS(`Output does not match required schema: ${errors8}`, `StructuredOutput schema mismatch: ${(errors8 ?? "").slice(0, 150)}`);
          }
          return {
            data: "Structured output provided successfully",
            structured_output: input
          };
        }
      }
    };
  } catch (e) {
    return { error: e instanceof Error ? e.message : String(e) };
  }
}
var import_ajv, inputSchema2, outputSchema2, SYNTHETIC_OUTPUT_TOOL_NAME = "StructuredOutput", SyntheticOutputTool, toolCache;
var init_SyntheticOutputTool = __esm(() => {
  init_v4();
  init_Tool();
  init_errors();
  init_slowOperations();
  import_ajv = __toESM(require_ajv(), 1), inputSchema2 = lazySchema(() => exports_external.object({}).passthrough()), outputSchema2 = lazySchema(() => exports_external.string().describe("Structured output tool result"));
  SyntheticOutputTool = buildTool({
    isMcp: !1,
    isEnabled() {
      return !0;
    },
    isConcurrencySafe() {
      return !0;
    },
    isReadOnly() {
      return !0;
    },
    isOpenWorld() {
      return !1;
    },
    name: SYNTHETIC_OUTPUT_TOOL_NAME,
    searchHint: "return the final response as structured JSON",
    maxResultSizeChars: 1e5,
    async description() {
      return "Return structured output in the requested format";
    },
    async prompt() {
      return "Use this tool to return your final response in the requested structured format. You MUST call this tool exactly once at the end of your response to provide the structured output.";
    },
    get inputSchema() {
      return inputSchema2();
    },
    get outputSchema() {
      return outputSchema2();
    },
    async call(input) {
      return {
        data: "Structured output provided successfully",
        structured_output: input
      };
    },
    async checkPermissions(input) {
      return {
        behavior: "allow",
        updatedInput: input
      };
    },
    renderToolUseMessage(input) {
      let keys2 = Object.keys(input);
      if (keys2.length === 0)
        return null;
      if (keys2.length <= 3)
        return keys2.map((k3) => `${k3}: ${jsonStringify(input[k3])}`).join(", ");
      return `${keys2.length} fields: ${keys2.slice(0, 3).join(", ")}\u2026`;
    },
    renderToolUseRejectedMessage() {
      return "Structured output rejected";
    },
    renderToolUseErrorMessage() {
      return "Structured output error";
    },
    renderToolUseProgressMessage() {
      return null;
    },
    renderToolResultMessage(output) {
      return output;
    },
    mapToolResultToToolResultBlockParam(content, toolUseID) {
      return {
        tool_use_id: toolUseID,
        type: "tool_result",
        content
      };
    }
  }), toolCache = /* @__PURE__ */ new WeakMap;
});
