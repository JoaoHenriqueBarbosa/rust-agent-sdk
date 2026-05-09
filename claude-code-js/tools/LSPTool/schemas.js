// Original: src/tools/LSPTool/schemas.ts
var lspToolInputSchema;
var init_schemas6 = __esm(() => {
  init_v4();
  lspToolInputSchema = lazySchema(() => {
    let goToDefinitionSchema = exports_external.strictObject({
      operation: exports_external.literal("goToDefinition"),
      filePath: exports_external.string().describe("The absolute or relative path to the file"),
      line: exports_external.number().int().positive().describe("The line number (1-based, as shown in editors)"),
      character: exports_external.number().int().positive().describe("The character offset (1-based, as shown in editors)")
    }), findReferencesSchema = exports_external.strictObject({
      operation: exports_external.literal("findReferences"),
      filePath: exports_external.string().describe("The absolute or relative path to the file"),
      line: exports_external.number().int().positive().describe("The line number (1-based, as shown in editors)"),
      character: exports_external.number().int().positive().describe("The character offset (1-based, as shown in editors)")
    }), hoverSchema = exports_external.strictObject({
      operation: exports_external.literal("hover"),
      filePath: exports_external.string().describe("The absolute or relative path to the file"),
      line: exports_external.number().int().positive().describe("The line number (1-based, as shown in editors)"),
      character: exports_external.number().int().positive().describe("The character offset (1-based, as shown in editors)")
    }), documentSymbolSchema = exports_external.strictObject({
      operation: exports_external.literal("documentSymbol"),
      filePath: exports_external.string().describe("The absolute or relative path to the file"),
      line: exports_external.number().int().positive().describe("The line number (1-based, as shown in editors)"),
      character: exports_external.number().int().positive().describe("The character offset (1-based, as shown in editors)")
    }), workspaceSymbolSchema = exports_external.strictObject({
      operation: exports_external.literal("workspaceSymbol"),
      filePath: exports_external.string().describe("The absolute or relative path to the file"),
      line: exports_external.number().int().positive().describe("The line number (1-based, as shown in editors)"),
      character: exports_external.number().int().positive().describe("The character offset (1-based, as shown in editors)")
    }), goToImplementationSchema = exports_external.strictObject({
      operation: exports_external.literal("goToImplementation"),
      filePath: exports_external.string().describe("The absolute or relative path to the file"),
      line: exports_external.number().int().positive().describe("The line number (1-based, as shown in editors)"),
      character: exports_external.number().int().positive().describe("The character offset (1-based, as shown in editors)")
    }), prepareCallHierarchySchema = exports_external.strictObject({
      operation: exports_external.literal("prepareCallHierarchy"),
      filePath: exports_external.string().describe("The absolute or relative path to the file"),
      line: exports_external.number().int().positive().describe("The line number (1-based, as shown in editors)"),
      character: exports_external.number().int().positive().describe("The character offset (1-based, as shown in editors)")
    }), incomingCallsSchema = exports_external.strictObject({
      operation: exports_external.literal("incomingCalls"),
      filePath: exports_external.string().describe("The absolute or relative path to the file"),
      line: exports_external.number().int().positive().describe("The line number (1-based, as shown in editors)"),
      character: exports_external.number().int().positive().describe("The character offset (1-based, as shown in editors)")
    }), outgoingCallsSchema = exports_external.strictObject({
      operation: exports_external.literal("outgoingCalls"),
      filePath: exports_external.string().describe("The absolute or relative path to the file"),
      line: exports_external.number().int().positive().describe("The line number (1-based, as shown in editors)"),
      character: exports_external.number().int().positive().describe("The character offset (1-based, as shown in editors)")
    });
    return exports_external.discriminatedUnion("operation", [
      goToDefinitionSchema,
      findReferencesSchema,
      hoverSchema,
      documentSymbolSchema,
      workspaceSymbolSchema,
      goToImplementationSchema,
      prepareCallHierarchySchema,
      incomingCallsSchema,
      outgoingCallsSchema
    ]);
  });
});
