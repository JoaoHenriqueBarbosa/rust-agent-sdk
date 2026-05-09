// Original: src/utils/bash/treeSitterAnalysis.ts
function collectQuoteSpans(node, out, inDouble) {
  switch (node.type) {
    case "raw_string":
      out.raw.push([node.startIndex, node.endIndex]);
      return;
    case "ansi_c_string":
      out.ansiC.push([node.startIndex, node.endIndex]);
      return;
    case "string":
      if (!inDouble)
        out.double.push([node.startIndex, node.endIndex]);
      for (let child of node.children)
        if (child)
          collectQuoteSpans(child, out, !0);
      return;
    case "heredoc_redirect": {
      let isQuoted = !1;
      for (let child of node.children)
        if (child && child.type === "heredoc_start") {
          let first = child.text[0];
          isQuoted = first === "'" || first === '"' || first === "\\";
          break;
        }
      if (isQuoted) {
        out.heredoc.push([node.startIndex, node.endIndex]);
        return;
      }
      break;
    }
  }
  for (let child of node.children)
    if (child)
      collectQuoteSpans(child, out, inDouble);
}
function buildPositionSet(spans) {
  let set2 = /* @__PURE__ */ new Set;
  for (let [start, end] of spans)
    for (let i5 = start;i5 < end; i5++)
      set2.add(i5);
  return set2;
}
function dropContainedSpans(spans) {
  return spans.filter((s2, i5) => !spans.some((other2, j4) => j4 !== i5 && other2[0] <= s2[0] && other2[1] >= s2[1] && (other2[0] < s2[0] || other2[1] > s2[1])));
}
function removeSpans(command12, spans) {
  if (spans.length === 0)
    return command12;
  let sorted = dropContainedSpans(spans).sort((a2, b) => b[0] - a2[0]), result = command12;
  for (let [start, end] of sorted)
    result = result.slice(0, start) + result.slice(end);
  return result;
}
function replaceSpansKeepQuotes(command12, spans) {
  if (spans.length === 0)
    return command12;
  let sorted = dropContainedSpans(spans).sort((a2, b) => b[0] - a2[0]), result = command12;
  for (let [start, end, open5, close] of sorted)
    result = result.slice(0, start) + open5 + close + result.slice(end);
  return result;
}
function extractQuoteContext(rootNode, command12) {
  let spans = { raw: [], ansiC: [], double: [], heredoc: [] };
  collectQuoteSpans(rootNode, spans, !1);
  let { raw: singleQuoteSpans, ansiC: ansiCSpans, double: doubleQuoteSpans, heredoc: quotedHeredocSpans } = spans, allQuoteSpans = [
    ...singleQuoteSpans,
    ...ansiCSpans,
    ...doubleQuoteSpans,
    ...quotedHeredocSpans
  ], singleQuoteSet = buildPositionSet([
    ...singleQuoteSpans,
    ...ansiCSpans,
    ...quotedHeredocSpans
  ]), doubleQuoteDelimSet = /* @__PURE__ */ new Set;
  for (let [start, end] of doubleQuoteSpans)
    doubleQuoteDelimSet.add(start), doubleQuoteDelimSet.add(end - 1);
  let withDoubleQuotes = "";
  for (let i5 = 0;i5 < command12.length; i5++) {
    if (singleQuoteSet.has(i5))
      continue;
    if (doubleQuoteDelimSet.has(i5))
      continue;
    withDoubleQuotes += command12[i5];
  }
  let fullyUnquoted = removeSpans(command12, allQuoteSpans), spansWithQuoteChars = [];
  for (let [start, end] of singleQuoteSpans)
    spansWithQuoteChars.push([start, end, "'", "'"]);
  for (let [start, end] of ansiCSpans)
    spansWithQuoteChars.push([start, end, "$'", "'"]);
  for (let [start, end] of doubleQuoteSpans)
    spansWithQuoteChars.push([start, end, '"', '"']);
  for (let [start, end] of quotedHeredocSpans)
    spansWithQuoteChars.push([start, end, "", ""]);
  let unquotedKeepQuoteChars = replaceSpansKeepQuotes(command12, spansWithQuoteChars);
  return { withDoubleQuotes, fullyUnquoted, unquotedKeepQuoteChars };
}
function extractCompoundStructure(rootNode, command12) {
  let n5 = rootNode, operators = [], segments = [], hasSubshell = !1, hasCommandGroup = !1, hasPipeline = !1;
  function walkTopLevel(node) {
    for (let child of node.children) {
      if (!child)
        continue;
      if (child.type === "list")
        for (let listChild of child.children) {
          if (!listChild)
            continue;
          if (listChild.type === "&&" || listChild.type === "||")
            operators.push(listChild.type);
          else if (listChild.type === "list" || listChild.type === "redirected_statement")
            walkTopLevel({ ...node, children: [listChild] });
          else if (listChild.type === "pipeline")
            hasPipeline = !0, segments.push(listChild.text);
          else if (listChild.type === "subshell")
            hasSubshell = !0, segments.push(listChild.text);
          else if (listChild.type === "compound_statement")
            hasCommandGroup = !0, segments.push(listChild.text);
          else
            segments.push(listChild.text);
        }
      else if (child.type === ";")
        operators.push(";");
      else if (child.type === "pipeline")
        hasPipeline = !0, segments.push(child.text);
      else if (child.type === "subshell")
        hasSubshell = !0, segments.push(child.text);
      else if (child.type === "compound_statement")
        hasCommandGroup = !0, segments.push(child.text);
      else if (child.type === "command" || child.type === "declaration_command" || child.type === "variable_assignment")
        segments.push(child.text);
      else if (child.type === "redirected_statement") {
        let foundInner = !1;
        for (let inner of child.children) {
          if (!inner || inner.type === "file_redirect")
            continue;
          foundInner = !0, walkTopLevel({ ...child, children: [inner] });
        }
        if (!foundInner)
          segments.push(child.text);
      } else if (child.type === "negated_command")
        segments.push(child.text), walkTopLevel(child);
      else if (child.type === "if_statement" || child.type === "while_statement" || child.type === "for_statement" || child.type === "case_statement" || child.type === "function_definition")
        segments.push(child.text), walkTopLevel(child);
    }
  }
  if (walkTopLevel(n5), segments.length === 0)
    segments.push(command12);
  return {
    hasCompoundOperators: operators.length > 0,
    hasPipeline,
    hasSubshell,
    hasCommandGroup,
    operators,
    segments
  };
}
function hasActualOperatorNodes(rootNode) {
  let n5 = rootNode;
  function walk(node) {
    if (node.type === ";" || node.type === "&&" || node.type === "||")
      return !0;
    if (node.type === "list")
      return !0;
    for (let child of node.children)
      if (child && walk(child))
        return !0;
    return !1;
  }
  return walk(n5);
}
function extractDangerousPatterns(rootNode) {
  let n5 = rootNode, hasCommandSubstitution = !1, hasProcessSubstitution = !1, hasParameterExpansion = !1, hasHeredoc = !1, hasComment = !1;
  function walk(node) {
    switch (node.type) {
      case "command_substitution":
        hasCommandSubstitution = !0;
        break;
      case "process_substitution":
        hasProcessSubstitution = !0;
        break;
      case "expansion":
        hasParameterExpansion = !0;
        break;
      case "heredoc_redirect":
        hasHeredoc = !0;
        break;
      case "comment":
        hasComment = !0;
        break;
    }
    for (let child of node.children)
      if (child)
        walk(child);
  }
  return walk(n5), {
    hasCommandSubstitution,
    hasProcessSubstitution,
    hasParameterExpansion,
    hasHeredoc,
    hasComment
  };
}
function analyzeCommand(rootNode, command12) {
  return {
    quoteContext: extractQuoteContext(rootNode, command12),
    compoundStructure: extractCompoundStructure(rootNode, command12),
    hasActualOperatorNodes: hasActualOperatorNodes(rootNode),
    dangerousPatterns: extractDangerousPatterns(rootNode)
  };
}
