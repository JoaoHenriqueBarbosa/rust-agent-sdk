// Original: src/utils/notebook.ts
function isLargeOutputs(outputs) {
  let size = 0;
  for (let o5 of outputs) {
    if (!o5)
      continue;
    if (size += (o5.text?.length ?? 0) + (o5.image?.image_data.length ?? 0), size > LARGE_OUTPUT_THRESHOLD)
      return !0;
  }
  return !1;
}
function processOutputText(text2) {
  if (!text2)
    return "";
  let rawText = Array.isArray(text2) ? text2.join("") : text2, { truncatedContent } = formatOutput(rawText);
  return truncatedContent;
}
function extractImage(data) {
  if (typeof data["image/png"] === "string")
    return {
      image_data: data["image/png"].replace(/\s/g, ""),
      media_type: "image/png"
    };
  if (typeof data["image/jpeg"] === "string")
    return {
      image_data: data["image/jpeg"].replace(/\s/g, ""),
      media_type: "image/jpeg"
    };
  return;
}
function processOutput(output) {
  switch (output.output_type) {
    case "stream":
      return {
        output_type: output.output_type,
        text: processOutputText(output.text)
      };
    case "execute_result":
    case "display_data":
      return {
        output_type: output.output_type,
        text: processOutputText(output.data?.["text/plain"]),
        image: output.data && extractImage(output.data)
      };
    case "error":
      return {
        output_type: output.output_type,
        text: processOutputText(`${output.ename}: ${output.evalue}
${output.traceback.join(`
`)}`)
      };
  }
}
function processCell(cell, index, codeLanguage, includeLargeOutputs) {
  let cellId = cell.id ?? `cell-${index}`, cellData = {
    cellType: cell.cell_type,
    source: Array.isArray(cell.source) ? cell.source.join("") : cell.source,
    execution_count: cell.cell_type === "code" ? cell.execution_count || void 0 : void 0,
    cell_id: cellId
  };
  if (cell.cell_type === "code")
    cellData.language = codeLanguage;
  if (cell.cell_type === "code" && cell.outputs?.length) {
    let outputs = cell.outputs.map(processOutput);
    if (!includeLargeOutputs && isLargeOutputs(outputs))
      cellData.outputs = [
        {
          output_type: "stream",
          text: `Outputs are too large to include. Use ${BASH_TOOL_NAME} with: cat <notebook_path> | jq '.cells[${index}].outputs'`
        }
      ];
    else
      cellData.outputs = outputs;
  }
  return cellData;
}
function cellContentToToolResult(cell) {
  let metadata = [];
  if (cell.cellType !== "code")
    metadata.push(`<cell_type>${cell.cellType}</cell_type>`);
  if (cell.language !== "python" && cell.cellType === "code")
    metadata.push(`<language>${cell.language}</language>`);
  return {
    text: `<cell id="${cell.cell_id}">${metadata.join("")}${cell.source}</cell id="${cell.cell_id}">`,
    type: "text"
  };
}
function cellOutputToToolResult(output) {
  let outputs = [];
  if (output.text)
    outputs.push({
      text: `
${output.text}`,
      type: "text"
    });
  if (output.image)
    outputs.push({
      type: "image",
      source: {
        data: output.image.image_data,
        media_type: output.image.media_type,
        type: "base64"
      }
    });
  return outputs;
}
function getToolResultFromCell(cell) {
  let contentResult = cellContentToToolResult(cell), outputResults = cell.outputs?.flatMap(cellOutputToToolResult);
  return [contentResult, ...outputResults ?? []];
}
async function readNotebook(notebookPath, cellId) {
  let fullPath = expandPath(notebookPath), content = (await getFsImplementation().readFileBytes(fullPath)).toString("utf-8"), notebook = jsonParse(content), language = notebook.metadata.language_info?.name ?? "python";
  if (cellId) {
    let cell = notebook.cells.find((c3) => c3.id === cellId);
    if (!cell)
      throw Error(`Cell with ID "${cellId}" not found in notebook`);
    return [processCell(cell, notebook.cells.indexOf(cell), language, !0)];
  }
  return notebook.cells.map((cell, index) => processCell(cell, index, language, !1));
}
function mapNotebookCellsToToolResult(data, toolUseID) {
  let allResults = data.flatMap(getToolResultFromCell);
  return {
    tool_use_id: toolUseID,
    type: "tool_result",
    content: allResults.reduce((acc, curr) => {
      if (acc.length === 0)
        return [curr];
      let prev = acc[acc.length - 1];
      if (prev && prev.type === "text" && curr.type === "text")
        return prev.text += `
` + curr.text, acc;
      return acc.push(curr), acc;
    }, [])
  };
}
function parseCellId(cellId) {
  let match = cellId.match(/^cell-(\d+)$/);
  if (match && match[1]) {
    let index = parseInt(match[1], 10);
    return isNaN(index) ? void 0 : index;
  }
  return;
}
var LARGE_OUTPUT_THRESHOLD = 1e4;
var init_notebook = __esm(() => {
  init_utils12();
  init_fsOperations();
  init_path2();
  init_slowOperations();
});
