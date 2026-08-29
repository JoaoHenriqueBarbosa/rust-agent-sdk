// Original: src/tools/FileEditTool/utils.ts
function normalizeQuotes(str2) {
  return str2.replaceAll(LEFT_SINGLE_CURLY_QUOTE, "'").replaceAll(RIGHT_SINGLE_CURLY_QUOTE, "'").replaceAll(LEFT_DOUBLE_CURLY_QUOTE, '"').replaceAll(RIGHT_DOUBLE_CURLY_QUOTE, '"');
}
function stripTrailingWhitespace(str2) {
  let lines2 = str2.split(/(\r\n|\n|\r)/), result = "";
  for (let i5 = 0;i5 < lines2.length; i5++) {
    let part = lines2[i5];
    if (part !== void 0)
      if (i5 % 2 === 0)
        result += part.replace(/\s+$/, "");
      else
        result += part;
  }
  return result;
}
function findActualString(fileContent, searchString) {
  if (fileContent.includes(searchString))
    return searchString;
  let normalizedSearch = normalizeQuotes(searchString), searchIndex = normalizeQuotes(fileContent).indexOf(normalizedSearch);
  if (searchIndex !== -1)
    return fileContent.substring(searchIndex, searchIndex + searchString.length);
  return null;
}
function preserveQuoteStyle(oldString, actualOldString, newString) {
  if (oldString === actualOldString)
    return newString;
  let hasDoubleQuotes = actualOldString.includes(LEFT_DOUBLE_CURLY_QUOTE) || actualOldString.includes(RIGHT_DOUBLE_CURLY_QUOTE), hasSingleQuotes = actualOldString.includes(LEFT_SINGLE_CURLY_QUOTE) || actualOldString.includes(RIGHT_SINGLE_CURLY_QUOTE);
  if (!hasDoubleQuotes && !hasSingleQuotes)
    return newString;
  let result = newString;
  if (hasDoubleQuotes)
    result = applyCurlyDoubleQuotes(result);
  if (hasSingleQuotes)
    result = applyCurlySingleQuotes(result);
  return result;
}
function isOpeningContext(chars, index) {
  if (index === 0)
    return !0;
  let prev = chars[index - 1];
  return prev === " " || prev === "\t" || prev === `
` || prev === "\r" || prev === "(" || prev === "[" || prev === "{" || prev === "\u2014" || prev === "\u2013";
}
function applyCurlyDoubleQuotes(str2) {
  let chars = [...str2], result = [];
  for (let i5 = 0;i5 < chars.length; i5++)
    if (chars[i5] === '"')
      result.push(isOpeningContext(chars, i5) ? LEFT_DOUBLE_CURLY_QUOTE : RIGHT_DOUBLE_CURLY_QUOTE);
    else
      result.push(chars[i5]);
  return result.join("");
}
function applyCurlySingleQuotes(str2) {
  let chars = [...str2], result = [];
  for (let i5 = 0;i5 < chars.length; i5++)
    if (chars[i5] === "'") {
      let prev = i5 > 0 ? chars[i5 - 1] : void 0, next = i5 < chars.length - 1 ? chars[i5 + 1] : void 0, prevIsLetter = prev !== void 0 && /\p{L}/u.test(prev), nextIsLetter = next !== void 0 && /\p{L}/u.test(next);
      if (prevIsLetter && nextIsLetter)
        result.push(RIGHT_SINGLE_CURLY_QUOTE);
      else
        result.push(isOpeningContext(chars, i5) ? LEFT_SINGLE_CURLY_QUOTE : RIGHT_SINGLE_CURLY_QUOTE);
    } else
      result.push(chars[i5]);
  return result.join("");
}
function applyEditToFile(originalContent, oldString, newString, replaceAll2 = !1) {
  let f = replaceAll2 ? (content, search, replace) => content.replaceAll(search, () => replace) : (content, search, replace) => content.replace(search, () => replace);
  if (newString !== "")
    return f(originalContent, oldString, newString);
  return !oldString.endsWith(`
`) && originalContent.includes(oldString + `
`) ? f(originalContent, oldString + `
`, newString) : f(originalContent, oldString, newString);
}
function getPatchForEdit({
  filePath,
  fileContents,
  oldString,
  newString,
  replaceAll: replaceAll2 = !1
}) {
  return getPatchForEdits({
    filePath,
    fileContents,
    edits: [
      { old_string: oldString, new_string: newString, replace_all: replaceAll2 }
    ]
  });
}
function getPatchForEdits({
  filePath,
  fileContents,
  edits
}) {
  let updatedFile = fileContents, appliedNewStrings = [];
  if (!fileContents && edits.length === 1 && edits[0] && edits[0].old_string === "" && edits[0].new_string === "")
    return { patch: getPatchForDisplay({
      filePath,
      fileContents,
      edits: [
        {
          old_string: fileContents,
          new_string: updatedFile,
          replace_all: !1
        }
      ]
    }), updatedFile: "" };
  for (let edit2 of edits) {
    let oldStringToCheck = edit2.old_string.replace(/\n+$/, "");
    for (let previousNewString of appliedNewStrings)
      if (oldStringToCheck !== "" && previousNewString.includes(oldStringToCheck))
        throw Error("Cannot edit file: old_string is a substring of a new_string from a previous edit.");
    let previousContent = updatedFile;
    if (updatedFile = edit2.old_string === "" ? edit2.new_string : applyEditToFile(updatedFile, edit2.old_string, edit2.new_string, edit2.replace_all), updatedFile === previousContent)
      throw Error("String not found in file. Failed to apply edit.");
    appliedNewStrings.push(edit2.new_string);
  }
  if (updatedFile === fileContents)
    throw Error("Original and edited file match exactly. Failed to apply edit.");
  return { patch: getPatchFromContents({
    filePath,
    oldContent: convertLeadingTabsToSpaces(fileContents),
    newContent: convertLeadingTabsToSpaces(updatedFile)
  }), updatedFile };
}
function getSnippetForTwoFileDiff(fileAContents, fileBContents) {
  let patch = structuredPatch("file.txt", "file.txt", fileAContents, fileBContents, void 0, void 0, {
    context: 8,
    timeout: DIFF_TIMEOUT_MS
  });
  if (!patch)
    return "";
  let full = patch.hunks.map((_) => ({
    startLine: _.oldStart,
    content: _.lines.filter((_2) => !_2.startsWith("-") && !_2.startsWith("\\")).map((_2) => _2.slice(1)).join(`
`)
  })).map(addLineNumbers).join(`
...
`);
  if (full.length <= DIFF_SNIPPET_MAX_BYTES)
    return full;
  let cutoff = full.lastIndexOf(`
`, DIFF_SNIPPET_MAX_BYTES), kept = cutoff > 0 ? full.slice(0, cutoff) : full.slice(0, DIFF_SNIPPET_MAX_BYTES), remaining = countCharInString(full, `
`, kept.length) + 1;
  return `${kept}

... [${remaining} lines truncated] ...`;
}
function getEditsForPatch(patch) {
  return patch.map((hunk) => {
    let contextLines = [], oldLines = [], newLines = [];
    for (let line of hunk.lines)
      if (line.startsWith(" "))
        contextLines.push(line.slice(1)), oldLines.push(line.slice(1)), newLines.push(line.slice(1));
      else if (line.startsWith("-"))
        oldLines.push(line.slice(1));
      else if (line.startsWith("+"))
        newLines.push(line.slice(1));
    return {
      old_string: oldLines.join(`
`),
      new_string: newLines.join(`
`),
      replace_all: !1
    };
  });
}
function desanitizeMatchString(matchString) {
  let result = matchString, appliedReplacements = [];
  for (let [from, to] of Object.entries(DESANITIZATIONS)) {
    let beforeReplace = result;
    if (result = result.replaceAll(from, to), beforeReplace !== result)
      appliedReplacements.push({ from, to });
  }
  return { result, appliedReplacements };
}
function normalizeFileEditInput({
  file_path,
  edits
}) {
  if (edits.length === 0)
    return { file_path, edits };
  let isMarkdown = /\.(md|mdx)$/i.test(file_path);
  try {
    let fullPath = expandPath(file_path), fileContent = readFileSyncCached(fullPath);
    return {
      file_path,
      edits: edits.map(({ old_string, new_string, replace_all }) => {
        let normalizedNewString = isMarkdown ? new_string : stripTrailingWhitespace(new_string);
        if (fileContent.includes(old_string))
          return {
            old_string,
            new_string: normalizedNewString,
            replace_all
          };
        let { result: desanitizedOldString, appliedReplacements } = desanitizeMatchString(old_string);
        if (fileContent.includes(desanitizedOldString)) {
          let desanitizedNewString = normalizedNewString;
          for (let { from, to } of appliedReplacements)
            desanitizedNewString = desanitizedNewString.replaceAll(from, to);
          return {
            old_string: desanitizedOldString,
            new_string: desanitizedNewString,
            replace_all
          };
        }
        return {
          old_string,
          new_string: normalizedNewString,
          replace_all
        };
      })
    };
  } catch (error44) {
    if (!isENOENT(error44))
      logError2(error44);
  }
  return { file_path, edits };
}
function areFileEditsEquivalent(edits1, edits2, originalContent) {
  if (edits1.length === edits2.length && edits1.every((edit1, index) => {
    let edit2 = edits2[index];
    return edit2 !== void 0 && edit1.old_string === edit2.old_string && edit1.new_string === edit2.new_string && edit1.replace_all === edit2.replace_all;
  }))
    return !0;
  let result1 = null, error1 = null, result2 = null, error210 = null;
  try {
    result1 = getPatchForEdits({
      filePath: "temp",
      fileContents: originalContent,
      edits: edits1
    });
  } catch (e) {
    error1 = errorMessage(e);
  }
  try {
    result2 = getPatchForEdits({
      filePath: "temp",
      fileContents: originalContent,
      edits: edits2
    });
  } catch (e) {
    error210 = errorMessage(e);
  }
  if (error1 !== null && error210 !== null)
    return error1 === error210;
  if (error1 !== null || error210 !== null)
    return !1;
  return result1.updatedFile === result2.updatedFile;
}
function areFileEditsInputsEquivalent(input1, input2) {
  if (input1.file_path !== input2.file_path)
    return !1;
  if (input1.edits.length === input2.edits.length && input1.edits.every((edit1, index) => {
    let edit2 = input2.edits[index];
    return edit2 !== void 0 && edit1.old_string === edit2.old_string && edit1.new_string === edit2.new_string && edit1.replace_all === edit2.replace_all;
  }))
    return !0;
  let fileContent = "";
  try {
    fileContent = readFileSyncCached(input1.file_path);
  } catch (error44) {
    if (!isENOENT(error44))
      throw error44;
  }
  return areFileEditsEquivalent(input1.edits, input2.edits, fileContent);
}
var LEFT_SINGLE_CURLY_QUOTE = "\u2018", RIGHT_SINGLE_CURLY_QUOTE = "\u2019", LEFT_DOUBLE_CURLY_QUOTE = "\u201C", RIGHT_DOUBLE_CURLY_QUOTE = "\u201D", DIFF_SNIPPET_MAX_BYTES = 8192, DESANITIZATIONS;
var init_utils13 = __esm(() => {
  init_lib();
  init_log3();
  init_path2();
  init_diff2();
  init_errors();
  init_file();
  DESANITIZATIONS = {
    "<fnr>": "<function_results>",
    "<n>": "<name>",
    "</n>": "</name>",
    "<o>": "<output>",
    "</o>": "</output>",
    "<e>": "<error>",
    "</e>": "</error>",
    "<s>": "<system>",
    "</s>": "</system>",
    "<r>": "<result>",
    "</r>": "</result>",
    "< META_START >": "<META_START>",
    "< META_END >": "<META_END>",
    "< EOT >": "<EOT>",
    "< META >": "<META>",
    "< SOS >": "<SOS>",
    "\n\nH:": `

Human:`,
    "\n\nA:": `

Assistant:`
  };
});
