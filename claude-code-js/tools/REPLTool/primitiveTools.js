// Original: src/tools/REPLTool/primitiveTools.ts
function getReplPrimitiveTools() {
  return _primitiveTools ??= [
    FileReadTool,
    FileWriteTool,
    FileEditTool,
    GlobTool,
    GrepTool,
    BashTool,
    NotebookEditTool,
    AgentTool
  ];
}
var _primitiveTools;
var init_primitiveTools = __esm(() => {
  init_AgentTool();
  init_BashTool();
  init_FileEditTool();
  init_FileReadTool();
  init_FileWriteTool();
  init_GlobTool();
  init_GrepTool();
  init_NotebookEditTool();
});
