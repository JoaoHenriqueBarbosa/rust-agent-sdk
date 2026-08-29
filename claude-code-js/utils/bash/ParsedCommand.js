// Original: src/utils/bash/ParsedCommand.ts
class RegexParsedCommand_DEPRECATED {
  originalCommand;
  constructor(command12) {
    this.originalCommand = command12;
  }
  toString() {
    return this.originalCommand;
  }
  getPipeSegments() {
    try {
      let parts = splitCommandWithOperators(this.originalCommand), segments = [], currentSegment = [];
      for (let part of parts)
        if (part === "|") {
          if (currentSegment.length > 0)
            segments.push(currentSegment.join(" ")), currentSegment = [];
        } else
          currentSegment.push(part);
      if (currentSegment.length > 0)
        segments.push(currentSegment.join(" "));
      return segments.length > 0 ? segments : [this.originalCommand];
    } catch {
      return [this.originalCommand];
    }
  }
  withoutOutputRedirections() {
    if (!this.originalCommand.includes(">"))
      return this.originalCommand;
    let { commandWithoutRedirections, redirections } = extractOutputRedirections(this.originalCommand);
    return redirections.length > 0 ? commandWithoutRedirections : this.originalCommand;
  }
  getOutputRedirections() {
    let { redirections } = extractOutputRedirections(this.originalCommand);
    return redirections;
  }
  getTreeSitterAnalysis() {
    return null;
  }
}
function visitNodes(node, visitor) {
  visitor(node);
  for (let child of node.children)
    visitNodes(child, visitor);
}
function extractPipePositions(rootNode) {
  let pipePositions = [];
  return visitNodes(rootNode, (node) => {
    if (node.type === "pipeline") {
      for (let child of node.children)
        if (child.type === "|")
          pipePositions.push(child.startIndex);
    }
  }), pipePositions.sort((a2, b) => a2 - b);
}
function extractRedirectionNodes(rootNode) {
  let redirections = [];
  return visitNodes(rootNode, (node) => {
    if (node.type === "file_redirect") {
      let children = node.children, op = children.find((c3) => c3.type === ">" || c3.type === ">>"), target = children.find((c3) => c3.type === "word");
      if (op && target)
        redirections.push({
          startIndex: node.startIndex,
          endIndex: node.endIndex,
          target: target.text,
          operator: op.type
        });
    }
  }), redirections;
}

class TreeSitterParsedCommand {
  originalCommand;
  commandBytes;
  pipePositions;
  redirectionNodes;
  treeSitterAnalysis;
  constructor(command12, pipePositions, redirectionNodes, treeSitterAnalysis) {
    this.originalCommand = command12, this.commandBytes = Buffer.from(command12, "utf8"), this.pipePositions = pipePositions, this.redirectionNodes = redirectionNodes, this.treeSitterAnalysis = treeSitterAnalysis;
  }
  toString() {
    return this.originalCommand;
  }
  getPipeSegments() {
    if (this.pipePositions.length === 0)
      return [this.originalCommand];
    let segments = [], currentStart = 0;
    for (let pipePos of this.pipePositions) {
      let segment = this.commandBytes.subarray(currentStart, pipePos).toString("utf8").trim();
      if (segment)
        segments.push(segment);
      currentStart = pipePos + 1;
    }
    let lastSegment = this.commandBytes.subarray(currentStart).toString("utf8").trim();
    if (lastSegment)
      segments.push(lastSegment);
    return segments;
  }
  withoutOutputRedirections() {
    if (this.redirectionNodes.length === 0)
      return this.originalCommand;
    let sorted = [...this.redirectionNodes].sort((a2, b) => b.startIndex - a2.startIndex), result = this.commandBytes;
    for (let redir of sorted)
      result = Buffer.concat([
        result.subarray(0, redir.startIndex),
        result.subarray(redir.endIndex)
      ]);
    return result.toString("utf8").trim().replace(/\s+/g, " ");
  }
  getOutputRedirections() {
    return this.redirectionNodes.map(({ target, operator }) => ({
      target,
      operator
    }));
  }
  getTreeSitterAnalysis() {
    return this.treeSitterAnalysis;
  }
}
function buildParsedCommandFromRoot(command12, root2) {
  let pipePositions = extractPipePositions(root2), redirectionNodes = extractRedirectionNodes(root2), analysis = analyzeCommand(root2, command12);
  return new TreeSitterParsedCommand(command12, pipePositions, redirectionNodes, analysis);
}
async function doParse(command12) {
  if (!command12)
    return null;
  if (await getTreeSitterAvailable())
    try {
      let { parseCommand: parseCommand4 } = await Promise.resolve().then(() => (init_parser4(), exports_parser2)), data = await parseCommand4(command12);
      if (data)
        return buildParsedCommandFromRoot(command12, data.rootNode);
    } catch {}
  return new RegexParsedCommand_DEPRECATED(command12);
}
var getTreeSitterAvailable, lastCmd, lastResult, ParsedCommand;
var init_ParsedCommand = __esm(() => {
  init_memoize();
  init_commands4();
  getTreeSitterAvailable = memoize_default(async () => {
    try {
      let { parseCommand: parseCommand4 } = await Promise.resolve().then(() => (init_parser4(), exports_parser2));
      return await parseCommand4("echo test") !== null;
    } catch {
      return !1;
    }
  });
  ParsedCommand = {
    parse(command12) {
      if (command12 === lastCmd && lastResult !== void 0)
        return lastResult;
      return lastCmd = command12, lastResult = doParse(command12), lastResult;
    }
  };
});
