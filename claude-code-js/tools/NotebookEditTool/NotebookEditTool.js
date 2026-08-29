// Original: src/tools/NotebookEditTool/NotebookEditTool.ts
import { extname as extname9, isAbsolute as isAbsolute23, resolve as resolve34 } from "path";
var inputSchema16, outputSchema13, NotebookEditTool;
var init_NotebookEditTool = __esm(() => {
  init_fileHistory();
  init_v4();
  init_Tool();
  init_cwd2();
  init_errors();
  init_file();
  init_fileRead();
  init_json();
  init_notebook();
  init_filesystem();
  init_slowOperations();
  init_UI12();
  inputSchema16 = lazySchema(() => exports_external.strictObject({
    notebook_path: exports_external.string().describe("The absolute path to the Jupyter notebook file to edit (must be absolute, not relative)"),
    cell_id: exports_external.string().optional().describe("The ID of the cell to edit. When inserting a new cell, the new cell will be inserted after the cell with this ID, or at the beginning if not specified."),
    new_source: exports_external.string().describe("The new source for the cell"),
    cell_type: exports_external.enum(["code", "markdown"]).optional().describe("The type of the cell (code or markdown). If not specified, it defaults to the current cell type. If using edit_mode=insert, this is required."),
    edit_mode: exports_external.enum(["replace", "insert", "delete"]).optional().describe("The type of edit to make (replace, insert, delete). Defaults to replace.")
  })), outputSchema13 = lazySchema(() => exports_external.object({
    new_source: exports_external.string().describe("The new source code that was written to the cell"),
    cell_id: exports_external.string().optional().describe("The ID of the cell that was edited"),
    cell_type: exports_external.enum(["code", "markdown"]).describe("The type of the cell"),
    language: exports_external.string().describe("The programming language of the notebook"),
    edit_mode: exports_external.string().describe("The edit mode that was used"),
    error: exports_external.string().optional().describe("Error message if the operation failed"),
    notebook_path: exports_external.string().describe("The path to the notebook file"),
    original_file: exports_external.string().describe("The original notebook content before modification"),
    updated_file: exports_external.string().describe("The updated notebook content after modification")
  })), NotebookEditTool = buildTool({
    name: NOTEBOOK_EDIT_TOOL_NAME,
    searchHint: "edit Jupyter notebook cells (.ipynb)",
    maxResultSizeChars: 1e5,
    shouldDefer: !0,
    async description() {
      return DESCRIPTION11;
    },
    async prompt() {
      return PROMPT6;
    },
    userFacingName() {
      return "Edit Notebook";
    },
    getToolUseSummary: getToolUseSummary5,
    getActivityDescription(input) {
      let summary = getToolUseSummary5(input);
      return summary ? `Editing notebook ${summary}` : "Editing notebook";
    },
    get inputSchema() {
      return inputSchema16();
    },
    get outputSchema() {
      return outputSchema13();
    },
    toAutoClassifierInput(input) {
      return "";
    },
    getPath(input) {
      return input.notebook_path;
    },
    async checkPermissions(input, context6) {
      let appState = context6.getAppState();
      return checkWritePermissionForTool(NotebookEditTool, input, appState.toolPermissionContext);
    },
    mapToolResultToToolResultBlockParam({ cell_id, edit_mode, new_source, error: error44 }, toolUseID) {
      if (error44)
        return {
          tool_use_id: toolUseID,
          type: "tool_result",
          content: error44,
          is_error: !0
        };
      switch (edit_mode) {
        case "replace":
          return {
            tool_use_id: toolUseID,
            type: "tool_result",
            content: `Updated cell ${cell_id} with ${new_source}`
          };
        case "insert":
          return {
            tool_use_id: toolUseID,
            type: "tool_result",
            content: `Inserted cell ${cell_id} with ${new_source}`
          };
        case "delete":
          return {
            tool_use_id: toolUseID,
            type: "tool_result",
            content: `Deleted cell ${cell_id}`
          };
        default:
          return {
            tool_use_id: toolUseID,
            type: "tool_result",
            content: "Unknown edit mode"
          };
      }
    },
    renderToolUseMessage: renderToolUseMessage13,
    renderToolUseRejectedMessage: renderToolUseRejectedMessage5,
    renderToolUseErrorMessage: renderToolUseErrorMessage9,
    renderToolResultMessage: renderToolResultMessage12,
    async validateInput({ notebook_path, cell_type, cell_id, edit_mode = "replace" }, toolUseContext) {
      let fullPath = isAbsolute23(notebook_path) ? notebook_path : resolve34(getCwd(), notebook_path);
      if (fullPath.startsWith("\\\\") || fullPath.startsWith("//"))
        return { result: !0 };
      if (extname9(fullPath) !== ".ipynb")
        return {
          result: !1,
          message: "File must be a Jupyter notebook (.ipynb file). For editing other file types, use the FileEdit tool.",
          errorCode: 2
        };
      if (edit_mode !== "replace" && edit_mode !== "insert" && edit_mode !== "delete")
        return {
          result: !1,
          message: "Edit mode must be replace, insert, or delete.",
          errorCode: 4
        };
      if (edit_mode === "insert" && !cell_type)
        return {
          result: !1,
          message: "Cell type is required when using edit_mode=insert.",
          errorCode: 5
        };
      let readTimestamp = toolUseContext.readFileState.get(fullPath);
      if (!readTimestamp)
        return {
          result: !1,
          message: "File has not been read yet. Read it first before writing to it.",
          errorCode: 9
        };
      if (getFileModificationTime(fullPath) > readTimestamp.timestamp)
        return {
          result: !1,
          message: "File has been modified since read, either by the user or by a linter. Read it again before attempting to write it.",
          errorCode: 10
        };
      let content;
      try {
        content = readFileSyncWithMetadata(fullPath).content;
      } catch (e) {
        if (isENOENT(e))
          return {
            result: !1,
            message: "Notebook file does not exist.",
            errorCode: 1
          };
        throw e;
      }
      let notebook = safeParseJSON(content);
      if (!notebook)
        return {
          result: !1,
          message: "Notebook is not valid JSON.",
          errorCode: 6
        };
      if (!cell_id) {
        if (edit_mode !== "insert")
          return {
            result: !1,
            message: "Cell ID must be specified when not inserting a new cell.",
            errorCode: 7
          };
      } else if (notebook.cells.findIndex((cell) => cell.id === cell_id) === -1) {
        let parsedCellIndex = parseCellId(cell_id);
        if (parsedCellIndex !== void 0) {
          if (!notebook.cells[parsedCellIndex])
            return {
              result: !1,
              message: `Cell with index ${parsedCellIndex} does not exist in notebook.`,
              errorCode: 7
            };
        } else
          return {
            result: !1,
            message: `Cell with ID "${cell_id}" not found in notebook.`,
            errorCode: 8
          };
      }
      return { result: !0 };
    },
    async call({
      notebook_path,
      new_source,
      cell_id,
      cell_type,
      edit_mode: originalEditMode
    }, { readFileState, updateFileHistoryState }, _, parentMessage) {
      let fullPath = isAbsolute23(notebook_path) ? notebook_path : resolve34(getCwd(), notebook_path);
      if (fileHistoryEnabled())
        await fileHistoryTrackEdit(updateFileHistoryState, fullPath, parentMessage.uuid);
      try {
        let { content, encoding, lineEndings } = readFileSyncWithMetadata(fullPath), notebook;
        try {
          notebook = jsonParse(content);
        } catch {
          return {
            data: {
              new_source,
              cell_type: cell_type ?? "code",
              language: "python",
              edit_mode: "replace",
              error: "Notebook is not valid JSON.",
              cell_id,
              notebook_path: fullPath,
              original_file: "",
              updated_file: ""
            }
          };
        }
        let cellIndex;
        if (!cell_id)
          cellIndex = 0;
        else {
          if (cellIndex = notebook.cells.findIndex((cell) => cell.id === cell_id), cellIndex === -1) {
            let parsedCellIndex = parseCellId(cell_id);
            if (parsedCellIndex !== void 0)
              cellIndex = parsedCellIndex;
          }
          if (originalEditMode === "insert")
            cellIndex += 1;
        }
        let edit_mode = originalEditMode;
        if (edit_mode === "replace" && cellIndex === notebook.cells.length) {
          if (edit_mode = "insert", !cell_type)
            cell_type = "code";
        }
        let language = notebook.metadata.language_info?.name ?? "python", new_cell_id = void 0;
        if (notebook.nbformat > 4 || notebook.nbformat === 4 && notebook.nbformat_minor >= 5) {
          if (edit_mode === "insert")
            new_cell_id = Math.random().toString(36).substring(2, 15);
          else if (cell_id !== null)
            new_cell_id = cell_id;
        }
        if (edit_mode === "delete")
          notebook.cells.splice(cellIndex, 1);
        else if (edit_mode === "insert") {
          let new_cell;
          if (cell_type === "markdown")
            new_cell = {
              cell_type: "markdown",
              id: new_cell_id,
              source: new_source,
              metadata: {}
            };
          else
            new_cell = {
              cell_type: "code",
              id: new_cell_id,
              source: new_source,
              metadata: {},
              execution_count: null,
              outputs: []
            };
          notebook.cells.splice(cellIndex, 0, new_cell);
        } else {
          let targetCell = notebook.cells[cellIndex];
          if (targetCell.source = new_source, targetCell.cell_type === "code")
            targetCell.execution_count = null, targetCell.outputs = [];
          if (cell_type && cell_type !== targetCell.cell_type)
            targetCell.cell_type = cell_type;
        }
        let updatedContent = jsonStringify(notebook, null, 1);
        return writeTextContent(fullPath, updatedContent, encoding, lineEndings), readFileState.set(fullPath, {
          content: updatedContent,
          timestamp: getFileModificationTime(fullPath),
          offset: void 0,
          limit: void 0
        }), {
          data: {
            new_source,
            cell_type: cell_type ?? "code",
            language,
            edit_mode: edit_mode ?? "replace",
            cell_id: new_cell_id || void 0,
            error: "",
            notebook_path: fullPath,
            original_file: content,
            updated_file: updatedContent
          }
        };
      } catch (error44) {
        if (error44 instanceof Error)
          return {
            data: {
              new_source,
              cell_type: cell_type ?? "code",
              language: "python",
              edit_mode: "replace",
              error: error44.message,
              cell_id,
              notebook_path: fullPath,
              original_file: "",
              updated_file: ""
            }
          };
        return {
          data: {
            new_source,
            cell_type: cell_type ?? "code",
            language: "python",
            edit_mode: "replace",
            error: "Unknown error occurred while editing notebook",
            cell_id,
            notebook_path: fullPath,
            original_file: "",
            updated_file: ""
          }
        };
      }
    }
  });
});
