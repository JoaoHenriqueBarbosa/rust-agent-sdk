// function: maskBracesInQuotedContexts
function maskBracesInQuotedContexts(cmd) {
  if (!cmd.includes("{"))
    return cmd;
  let out = [], inSingle = !1, inDouble = !1, i5 = 0;
  while (i5 < cmd.length) {
    let c3 = cmd[i5];
    if (inSingle) {
      if (c3 === "'")
        inSingle = !1;
      out.push(c3 === "{" ? " " : c3), i5++;
    } else if (inDouble)
      if (c3 === "\\" && (cmd[i5 + 1] === '"' || cmd[i5 + 1] === "\\"))
        out.push(c3, cmd[i5 + 1]), i5 += 2;
      else {
        if (c3 === '"')
          inDouble = !1;
        out.push(c3 === "{" ? " " : c3), i5++;
      }
    else if (c3 === "\\" && i5 + 1 < cmd.length)
      out.push(c3, cmd[i5 + 1]), i5 += 2;
    else {
      if (c3 === "'")
        inSingle = !0;
      else if (c3 === '"')
        inDouble = !0;
      out.push(c3), i5++;
    }
  }
  return out.join("");
}
async function parseForSecurity(cmd) {
  if (cmd === "")
    return { kind: "simple", commands: [] };
  let root2 = await parseCommandRaw(cmd);
  return root2 === null ? { kind: "parse-unavailable" } : parseForSecurityFromAst(cmd, root2);
}
function parseForSecurityFromAst(cmd, root2) {
  if (CONTROL_CHAR_RE.test(cmd))
    return { kind: "too-complex", reason: "Contains control characters" };
  if (UNICODE_WHITESPACE_RE.test(cmd))
    return { kind: "too-complex", reason: "Contains Unicode whitespace" };
  if (BACKSLASH_WHITESPACE_RE.test(cmd))
    return {
      kind: "too-complex",
      reason: "Contains backslash-escaped whitespace"
    };
  if (ZSH_TILDE_BRACKET_RE.test(cmd))
    return {
      kind: "too-complex",
      reason: "Contains zsh ~[ dynamic directory syntax"
    };
  if (ZSH_EQUALS_EXPANSION_RE.test(cmd))
    return {
      kind: "too-complex",
      reason: "Contains zsh =cmd equals expansion"
    };
  if (BRACE_WITH_QUOTE_RE.test(maskBracesInQuotedContexts(cmd)))
    return {
      kind: "too-complex",
      reason: "Contains brace with quote character (expansion obfuscation)"
    };
  if (cmd.trim() === "")
    return { kind: "simple", commands: [] };
  if (root2 === PARSE_ABORTED)
    return {
      kind: "too-complex",
      reason: "Parser aborted (timeout or resource limit) \u2014 possible adversarial input",
      nodeType: "PARSE_ABORT"
    };
  return walkProgram(root2);
}
function walkProgram(root2) {
  let commands7 = [], err2 = collectCommands(root2, commands7, /* @__PURE__ */ new Map);
  if (err2)
    return err2;
  return { kind: "simple", commands: commands7 };
}
function collectCommands(node, commands7, varScope) {
  if (node.type === "command") {
    let result = walkCommand(node, [], commands7, varScope);
    if (result.kind !== "simple")
      return result;
    return commands7.push(...result.commands), null;
  }
  if (node.type === "redirected_statement")
    return walkRedirectedStatement(node, commands7, varScope);
  if (node.type === "comment")
    return null;
  if (STRUCTURAL_TYPES.has(node.type)) {
    let isPipeline = node.type === "pipeline", needsSnapshot = !1;
    if (!isPipeline) {
      for (let c3 of node.children)
        if (c3 && (c3.type === "||" || c3.type === "&")) {
          needsSnapshot = !0;
          break;
        }
    }
    let snapshot2 = needsSnapshot ? new Map(varScope) : null, scope = isPipeline ? new Map(varScope) : varScope;
    for (let child of node.children) {
      if (!child)
        continue;
      if (SEPARATOR_TYPES.has(child.type)) {
        if (child.type === "||" || child.type === "|" || child.type === "|&" || child.type === "&")
          scope = new Map(snapshot2 ?? varScope);
        continue;
      }
      let err2 = collectCommands(child, commands7, scope);
      if (err2)
        return err2;
    }
    return null;
  }
  if (node.type === "negated_command") {
    for (let child of node.children) {
      if (!child)
        continue;
      if (child.type === "!")
        continue;
      return collectCommands(child, commands7, varScope);
    }
    return null;
  }
  if (node.type === "declaration_command") {
    let argv = [];
    for (let child of node.children) {
      if (!child)
        continue;
      switch (child.type) {
        case "export":
        case "local":
        case "readonly":
        case "declare":
        case "typeset":
          argv.push(child.text);
          break;
        case "word":
        case "number":
        case "raw_string":
        case "string":
        case "concatenation": {
          let arg = walkArgument(child, commands7, varScope);
          if (typeof arg !== "string")
            return arg;
          if ((argv[0] === "declare" || argv[0] === "typeset" || argv[0] === "local") && /^-[a-zA-Z]*[niaA]/.test(arg))
            return {
              kind: "too-complex",
              reason: `declare flag ${arg} changes assignment semantics (nameref/integer/array)`,
              nodeType: "declaration_command"
            };
          if ((argv[0] === "declare" || argv[0] === "typeset" || argv[0] === "local") && arg[0] !== "-" && /^[^=]*\[/.test(arg))
            return {
              kind: "too-complex",
              reason: `declare positional '${arg}' contains array subscript \u2014 bash evaluates $(cmd) in subscripts`,
              nodeType: "declaration_command"
            };
          argv.push(arg);
          break;
        }
        case "variable_assignment": {
          let ev = walkVariableAssignment(child, commands7, varScope);
          if ("kind" in ev)
            return ev;
          applyVarToScope(varScope, ev), argv.push(`${ev.name}=${ev.value}`);
          break;
        }
        case "variable_name":
          argv.push(child.text);
          break;
        default:
          return tooComplex(child);
      }
    }
    return commands7.push({ argv, envVars: [], redirects: [], text: node.text }), null;
  }
  if (node.type === "variable_assignment") {
    let ev = walkVariableAssignment(node, commands7, varScope);
    if ("kind" in ev)
      return ev;
    return applyVarToScope(varScope, ev), null;
  }
  if (node.type === "for_statement") {
    let loopVar = null, doGroup = null;
    for (let child of node.children) {
      if (!child)
        continue;
      if (child.type === "variable_name")
        loopVar = child.text;
      else if (child.type === "do_group")
        doGroup = child;
      else if (child.type === "for" || child.type === "in" || child.type === "select" || child.type === ";")
        continue;
      else if (child.type === "command_substitution") {
        let err2 = collectCommandSubstitution(child, commands7, varScope);
        if (err2)
          return err2;
      } else {
        let arg = walkArgument(child, commands7, varScope);
        if (typeof arg !== "string")
          return arg;
      }
    }
    if (loopVar === null || doGroup === null)
      return tooComplex(node);
    if (loopVar === "PS4" || loopVar === "IFS")
      return {
        kind: "too-complex",
        reason: `${loopVar} as loop variable bypasses assignment validation`,
        nodeType: "for_statement"
      };
    varScope.set(loopVar, VAR_PLACEHOLDER);
    let bodyScope = new Map(varScope);
    for (let c3 of doGroup.children) {
      if (!c3)
        continue;
      if (c3.type === "do" || c3.type === "done" || c3.type === ";")
        continue;
      let err2 = collectCommands(c3, commands7, bodyScope);
      if (err2)
        return err2;
    }
    return null;
  }
  if (node.type === "if_statement" || node.type === "while_statement") {
    let seenThen = !1;
    for (let child of node.children) {
      if (!child)
        continue;
      if (child.type === "if" || child.type === "fi" || child.type === "else" || child.type === "elif" || child.type === "while" || child.type === "until" || child.type === ";")
        continue;
      if (child.type === "then") {
        seenThen = !0;
        continue;
      }
      if (child.type === "do_group") {
        let bodyScope = new Map(varScope);
        for (let c3 of child.children) {
          if (!c3)
            continue;
          if (c3.type === "do" || c3.type === "done" || c3.type === ";")
            continue;
          let err3 = collectCommands(c3, commands7, bodyScope);
          if (err3)
            return err3;
        }
        continue;
      }
      if (child.type === "elif_clause" || child.type === "else_clause") {
        let branchScope = new Map(varScope);
        for (let c3 of child.children) {
          if (!c3)
            continue;
          if (c3.type === "elif" || c3.type === "else" || c3.type === "then" || c3.type === ";")
            continue;
          let err3 = collectCommands(c3, commands7, branchScope);
          if (err3)
            return err3;
        }
        continue;
      }
      let targetScope = seenThen ? new Map(varScope) : varScope, before = commands7.length, err2 = collectCommands(child, commands7, targetScope);
      if (err2)
        return err2;
      if (!seenThen)
        for (let i5 = before;i5 < commands7.length; i5++) {
          let c3 = commands7[i5];
          if (c3?.argv[0] === "read") {
            for (let a2 of c3.argv.slice(1))
              if (!a2.startsWith("-") && /^[A-Za-z_][A-Za-z0-9_]*$/.test(a2)) {
                let existing = varScope.get(a2);
                if (existing !== void 0 && !containsAnyPlaceholder(existing))
                  return {
                    kind: "too-complex",
                    reason: `'read ${a2}' in condition may not execute (||/pipeline/subshell); cannot prove it overwrites tracked literal '${existing}'`,
                    nodeType: "if_statement"
                  };
                varScope.set(a2, VAR_PLACEHOLDER);
              }
          }
        }
    }
    return null;
  }
  if (node.type === "subshell") {
    let innerScope = new Map(varScope);
    for (let child of node.children) {
      if (!child)
        continue;
      if (child.type === "(" || child.type === ")")
        continue;
      let err2 = collectCommands(child, commands7, innerScope);
      if (err2)
        return err2;
    }
    return null;
  }
  if (node.type === "test_command") {
    let argv = ["[["];
    for (let child of node.children) {
      if (!child)
        continue;
      if (child.type === "[[" || child.type === "]]")
        continue;
      if (child.type === "[" || child.type === "]")
        continue;
      let err2 = walkTestExpr(child, argv, commands7, varScope);
      if (err2)
        return err2;
    }
    return commands7.push({ argv, envVars: [], redirects: [], text: node.text }), null;
  }
  if (node.type === "unset_command") {
    let argv = [];
    for (let child of node.children) {
      if (!child)
        continue;
      switch (child.type) {
        case "unset":
          argv.push(child.text);
          break;
        case "variable_name":
          argv.push(child.text), varScope.delete(child.text);
          break;
        case "word": {
          let arg = walkArgument(child, commands7, varScope);
          if (typeof arg !== "string")
            return arg;
          argv.push(arg);
          break;
        }
        default:
          return tooComplex(child);
      }
    }
    return commands7.push({ argv, envVars: [], redirects: [], text: node.text }), null;
  }
  return tooComplex(node);
}
function walkTestExpr(node, argv, innerCommands, varScope) {
  switch (node.type) {
    case "unary_expression":
    case "binary_expression":
    case "negated_expression":
    case "parenthesized_expression": {
      for (let c3 of node.children) {
        if (!c3)
          continue;
        let err2 = walkTestExpr(c3, argv, innerCommands, varScope);
        if (err2)
          return err2;
      }
      return null;
    }
    case "test_operator":
    case "!":
    case "(":
    case ")":
    case "&&":
    case "||":
    case "==":
    case "=":
    case "!=":
    case "<":
    case ">":
    case "=~":
      return argv.push(node.text), null;
    case "regex":
    case "extglob_pattern":
      return argv.push(node.text), null;
    default: {
      let arg = walkArgument(node, innerCommands, varScope);
      if (typeof arg !== "string")
        return arg;
      return argv.push(arg), null;
    }
  }
}
function walkRedirectedStatement(node, commands7, varScope) {
  let redirects = [], innerCommand = null;
  for (let child of node.children) {
    if (!child)
      continue;
    if (child.type === "file_redirect") {
      let r4 = walkFileRedirect(child, commands7, varScope);
      if ("kind" in r4)
        return r4;
      redirects.push(r4);
    } else if (child.type === "heredoc_redirect") {
      let r4 = walkHeredocRedirect(child);
      if (r4)
        return r4;
    } else if (child.type === "command" || child.type === "pipeline" || child.type === "list" || child.type === "negated_command" || child.type === "declaration_command" || child.type === "unset_command")
      innerCommand = child;
    else
      return tooComplex(child);
  }
  if (!innerCommand)
    return commands7.push({ argv: [], envVars: [], redirects, text: node.text }), null;
  let before = commands7.length, err2 = collectCommands(innerCommand, commands7, varScope);
  if (err2)
    return err2;
  if (commands7.length > before && redirects.length > 0) {
    let last2 = commands7[commands7.length - 1];
    if (last2)
      last2.redirects.push(...redirects);
  }
  return null;
}
function walkFileRedirect(node, innerCommands, varScope) {
  let op = null, target = null, fd2;
  for (let child of node.children) {
    if (!child)
      continue;
    if (child.type === "file_descriptor")
      fd2 = Number(child.text);
    else if (child.type in REDIRECT_OPS)
      op = REDIRECT_OPS[child.type] ?? null;
    else if (child.type === "word" || child.type === "number") {
      if (child.children.length > 0)
        return tooComplex(child);
      if (BRACE_EXPANSION_RE.test(child.text))
        return tooComplex(child);
      target = child.text.replace(/\\(.)/g, "$1");
    } else if (child.type === "raw_string")
      target = stripRawString(child.text);
    else if (child.type === "string") {
      let s2 = walkString(child, innerCommands, varScope);
      if (typeof s2 !== "string")
        return s2;
      target = s2;
    } else if (child.type === "concatenation") {
      let s2 = walkArgument(child, innerCommands, varScope);
      if (typeof s2 !== "string")
        return s2;
      target = s2;
    } else
      return tooComplex(child);
  }
  if (!op || target === null)
    return {
      kind: "too-complex",
      reason: "Unrecognized redirect shape",
      nodeType: node.type
    };
  return { op, target, fd: fd2 };
}
function walkHeredocRedirect(node) {
  let startText = null, body = null;
  for (let child of node.children) {
    if (!child)
      continue;
    if (child.type === "heredoc_start")
      startText = child.text;
    else if (child.type === "heredoc_body")
      body = child;
    else if (child.type === "<<" || child.type === "<<-" || child.type === "heredoc_end" || child.type === "file_descriptor")
      ;
    else
      return tooComplex(child);
  }
  if (!(startText !== null && (startText.startsWith("'") && startText.endsWith("'") || startText.startsWith('"') && startText.endsWith('"') || startText.startsWith("\\"))))
    return {
      kind: "too-complex",
      reason: "Heredoc with unquoted delimiter undergoes shell expansion",
      nodeType: "heredoc_redirect"
    };
  if (body)
    for (let child of body.children) {
      if (!child)
        continue;
      if (child.type !== "heredoc_content")
        return tooComplex(child);
    }
  return null;
}
function walkHerestringRedirect(node, innerCommands, varScope) {
  for (let child of node.children) {
    if (!child)
      continue;
    if (child.type === "<<<")
      continue;
    let content = walkArgument(child, innerCommands, varScope);
    if (typeof content !== "string")
      return content;
    if (NEWLINE_HASH_RE.test(content))
      return tooComplex(child);
  }
  return null;
}
function walkCommand(node, extraRedirects, innerCommands, varScope) {
  let argv = [], envVars = [], redirects = [...extraRedirects];
  for (let child of node.children) {
    if (!child)
      continue;
    switch (child.type) {
      case "variable_assignment": {
        let ev = walkVariableAssignment(child, innerCommands, varScope);
        if ("kind" in ev)
          return ev;
        envVars.push({ name: ev.name, value: ev.value });
        break;
      }
      case "command_name": {
        let arg = walkArgument(child.children[0] ?? child, innerCommands, varScope);
        if (typeof arg !== "string")
          return arg;
        argv.push(arg);
        break;
      }
      case "word":
      case "number":
      case "raw_string":
      case "string":
      case "concatenation":
      case "arithmetic_expansion": {
        let arg = walkArgument(child, innerCommands, varScope);
        if (typeof arg !== "string")
          return arg;
        argv.push(arg);
        break;
      }
      case "simple_expansion": {
        let v2 = resolveSimpleExpansion(child, varScope, !1);
        if (typeof v2 !== "string")
          return v2;
        argv.push(v2);
        break;
      }
      case "file_redirect": {
        let r4 = walkFileRedirect(child, innerCommands, varScope);
        if ("kind" in r4)
          return r4;
        redirects.push(r4);
        break;
      }
      case "herestring_redirect": {
        let err2 = walkHerestringRedirect(child, innerCommands, varScope);
        if (err2)
          return err2;
        break;
      }
      default:
        return tooComplex(child);
    }
  }
  let text2 = /\$[A-Za-z_]/.test(node.text) || node.text.includes(`
`) ? argv.map((a2) => a2 === "" || /["'\\ \t\n$`;|&<>(){}*?[\]~#]/.test(a2) ? `'${a2.replace(/'/g, "'\\''")}'` : a2).join(" ") : node.text;
  return {
    kind: "simple",
    commands: [{ argv, envVars, redirects, text: text2 }]
  };
}
function collectCommandSubstitution(csNode, innerCommands, varScope) {
  let innerScope = new Map(varScope);
  for (let child of csNode.children) {
    if (!child)
      continue;
    if (child.type === "$(" || child.type === "`" || child.type === ")")
      continue;
    let err2 = collectCommands(child, innerCommands, innerScope);
    if (err2)
      return err2;
  }
  return null;
}
function walkArgument(node, innerCommands, varScope) {
  if (!node)
    return { kind: "too-complex", reason: "Null argument node" };
  switch (node.type) {
    case "word": {
      if (BRACE_EXPANSION_RE.test(node.text))
        return {
          kind: "too-complex",
          reason: "Word contains brace expansion syntax",
          nodeType: "word"
        };
      return node.text.replace(/\\(.)/g, "$1");
    }
    case "number":
      if (node.children.length > 0)
        return {
          kind: "too-complex",
          reason: "Number node contains expansion (NN# arithmetic base syntax)",
          nodeType: node.children[0]?.type
        };
      return node.text;
    case "raw_string":
      return stripRawString(node.text);
    case "string":
      return walkString(node, innerCommands, varScope);
    case "concatenation": {
      if (BRACE_EXPANSION_RE.test(node.text))
        return {
          kind: "too-complex",
          reason: "Brace expansion",
          nodeType: "concatenation"
        };
      let result = "";
      for (let child of node.children) {
        if (!child)
          continue;
        let part = walkArgument(child, innerCommands, varScope);
        if (typeof part !== "string")
          return part;
        result += part;
      }
      return result;
    }
    case "arithmetic_expansion": {
      let err2 = walkArithmetic(node);
      if (err2)
        return err2;
      return node.text;
    }
    case "simple_expansion":
      return resolveSimpleExpansion(node, varScope, !1);
    default:
      return tooComplex(node);
  }
}
function walkString(node, innerCommands, varScope) {
  let result = "", cursor = -1, sawDynamicPlaceholder = !1, sawLiteralContent = !1;
  for (let child of node.children) {
    if (!child)
      continue;
    if (cursor !== -1 && child.startIndex > cursor && child.type !== '"')
      result += `
`.repeat(child.startIndex - cursor), sawLiteralContent = !0;
    switch (cursor = child.endIndex, child.type) {
      case '"':
        cursor = child.endIndex;
        break;
      case "string_content":
        result += child.text.replace(/\\([$`"\\])/g, "$1"), sawLiteralContent = !0;
        break;
      case DOLLAR:
        result += DOLLAR, sawLiteralContent = !0;
        break;
      case "command_substitution": {
        let heredocBody = extractSafeCatHeredoc(child);
        if (heredocBody === "DANGEROUS")
          return tooComplex(child);
        if (heredocBody !== null) {
          let trimmed = heredocBody.replace(/\n+$/, "");
          if (trimmed.includes(`
`)) {
            sawLiteralContent = !0;
            break;
          }
          result += trimmed, sawLiteralContent = !0;
          break;
        }
        let err2 = collectCommandSubstitution(child, innerCommands, varScope);
        if (err2)
          return err2;
        result += CMDSUB_PLACEHOLDER, sawDynamicPlaceholder = !0;
        break;
      }
      case "simple_expansion": {
        let v2 = resolveSimpleExpansion(child, varScope, !0);
        if (typeof v2 !== "string")
          return v2;
        if (v2 === VAR_PLACEHOLDER)
          sawDynamicPlaceholder = !0;
        else
          sawLiteralContent = !0;
        result += v2;
        break;
      }
      case "arithmetic_expansion": {
        let err2 = walkArithmetic(child);
        if (err2)
          return err2;
        result += child.text, sawLiteralContent = !0;
        break;
      }
      default:
        return tooComplex(child);
    }
  }
  if (sawDynamicPlaceholder && !sawLiteralContent)
    return tooComplex(node);
  if (!sawLiteralContent && !sawDynamicPlaceholder && node.text.length > 2)
    return tooComplex(node);
  return result;
}
function walkArithmetic(node) {
  for (let child of node.children) {
    if (!child)
      continue;
    if (child.children.length === 0) {
      if (!ARITH_LEAF_RE.test(child.text))
        return {
          kind: "too-complex",
          reason: `Arithmetic expansion references variable or non-literal: ${child.text}`,
          nodeType: "arithmetic_expansion"
        };
      continue;
    }
    switch (child.type) {
      case "binary_expression":
      case "unary_expression":
      case "ternary_expression":
      case "parenthesized_expression": {
        let err2 = walkArithmetic(child);
        if (err2)
          return err2;
        break;
      }
      default:
        return tooComplex(child);
    }
  }
  return null;
}
function extractSafeCatHeredoc(subNode) {
  let stmt = null;
  for (let child of subNode.children) {
    if (!child)
      continue;
    if (child.type === "$(" || child.type === ")")
      continue;
    if (child.type === "redirected_statement" && stmt === null)
      stmt = child;
    else
      return null;
  }
  if (!stmt)
    return null;
  let sawCat = !1, body = null;
  for (let child of stmt.children) {
    if (!child)
      continue;
    if (child.type === "command") {
      let cmdChildren = child.children.filter((c3) => c3);
      if (cmdChildren.length !== 1)
        return null;
      let nameNode = cmdChildren[0];
      if (nameNode?.type !== "command_name" || nameNode.text !== "cat")
        return null;
      sawCat = !0;
    } else if (child.type === "heredoc_redirect") {
      if (walkHeredocRedirect(child) !== null)
        return null;
      for (let hc of child.children)
        if (hc?.type === "heredoc_body")
          body = hc.text;
    } else
      return null;
  }
  if (!sawCat || body === null)
    return null;
  if (PROC_ENVIRON_RE.test(body))
    return "DANGEROUS";
  if (/\bsystem\s*\(/.test(body))
    return "DANGEROUS";
  return body;
}
function walkVariableAssignment(node, innerCommands, varScope) {
  let name3 = null, value = "", isAppend = !1;
  for (let child of node.children) {
    if (!child)
      continue;
    if (child.type === "variable_name")
      name3 = child.text;
    else if (child.type === "=" || child.type === "+=") {
      isAppend = child.type === "+=";
      continue;
    } else if (child.type === "command_substitution") {
      let err2 = collectCommandSubstitution(child, innerCommands, varScope);
      if (err2)
        return err2;
      value = CMDSUB_PLACEHOLDER;
    } else if (child.type === "simple_expansion") {
      let v2 = resolveSimpleExpansion(child, varScope, !0);
      if (typeof v2 !== "string")
        return v2;
      value = v2;
    } else {
      let v2 = walkArgument(child, innerCommands, varScope);
      if (typeof v2 !== "string")
        return v2;
      value = v2;
    }
  }
  if (name3 === null)
    return {
      kind: "too-complex",
      reason: "Variable assignment without name",
      nodeType: "variable_assignment"
    };
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name3))
    return {
      kind: "too-complex",
      reason: `Invalid variable name (bash treats as command): ${name3}`,
      nodeType: "variable_assignment"
    };
  if (name3 === "IFS")
    return {
      kind: "too-complex",
      reason: "IFS assignment changes word-splitting \u2014 cannot model statically",
      nodeType: "variable_assignment"
    };
  if (name3 === "PS4") {
    if (isAppend)
      return {
        kind: "too-complex",
        reason: "PS4 += cannot be statically verified \u2014 combine into a single PS4= assignment",
        nodeType: "variable_assignment"
      };
    if (containsAnyPlaceholder(value))
      return {
        kind: "too-complex",
        reason: "PS4 value derived from cmdsub/variable \u2014 runtime unknowable",
        nodeType: "variable_assignment"
      };
    if (!/^[A-Za-z0-9 _+:./=[\]-]*$/.test(value.replace(/\$\{[A-Za-z_][A-Za-z0-9_]*\}/g, "")))
      return {
        kind: "too-complex",
        reason: "PS4 value outside safe charset \u2014 only ${VAR} refs and [A-Za-z0-9 _+:.=/[]-] allowed",
        nodeType: "variable_assignment"
      };
  }
  if (value.includes("~"))
    return {
      kind: "too-complex",
      reason: "Tilde in assignment value \u2014 bash may expand at assignment time",
      nodeType: "variable_assignment"
    };
  return { name: name3, value, isAppend };
}
function resolveSimpleExpansion(node, varScope, insideString) {
  let varName = null, isSpecial = !1;
  for (let c3 of node.children) {
    if (c3?.type === "variable_name") {
      varName = c3.text;
      break;
    }
    if (c3?.type === "special_variable_name") {
      varName = c3.text, isSpecial = !0;
      break;
    }
  }
  if (varName === null)
    return tooComplex(node);
  let trackedValue = varScope.get(varName);
  if (trackedValue !== void 0) {
    if (containsAnyPlaceholder(trackedValue)) {
      if (!insideString)
        return tooComplex(node);
      return VAR_PLACEHOLDER;
    }
    if (!insideString) {
      if (trackedValue === "")
        return tooComplex(node);
      if (BARE_VAR_UNSAFE_RE.test(trackedValue))
        return tooComplex(node);
    }
    return trackedValue;
  }
  if (insideString) {
    if (SAFE_ENV_VARS.has(varName))
      return VAR_PLACEHOLDER;
    if (isSpecial && (SPECIAL_VAR_NAMES.has(varName) || /^[0-9]+$/.test(varName)))
      return VAR_PLACEHOLDER;
  }
  return tooComplex(node);
}
function applyVarToScope(varScope, ev) {
  let existing = varScope.get(ev.name) ?? "", combined = ev.isAppend ? existing + ev.value : ev.value;
  varScope.set(ev.name, containsAnyPlaceholder(combined) ? VAR_PLACEHOLDER : combined);
}
function stripRawString(text2) {
  return text2.slice(1, -1);
}
function tooComplex(node) {
  return { kind: "too-complex", reason: node.type === "ERROR" ? "Parse error" : DANGEROUS_TYPES.has(node.type) ? `Contains ${node.type}` : `Unhandled node type: ${node.type}`, nodeType: node.type };
}
function checkSemantics(commands7) {
  for (let cmd of commands7) {
    let a2 = cmd.argv;
    for (;; )
      if (a2[0] === "time" || a2[0] === "nohup")
        a2 = a2.slice(1);
      else if (a2[0] === "timeout") {
        let i5 = 1;
        while (i5 < a2.length) {
          let arg = a2[i5];
          if (arg === "--foreground" || arg === "--preserve-status" || arg === "--verbose")
            i5++;
          else if (/^--(?:kill-after|signal)=[A-Za-z0-9_.+-]+$/.test(arg))
            i5++;
          else if ((arg === "--kill-after" || arg === "--signal") && a2[i5 + 1] && /^[A-Za-z0-9_.+-]+$/.test(a2[i5 + 1]))
            i5 += 2;
          else if (arg.startsWith("--"))
            return {
              ok: !1,
              reason: `timeout with ${arg} flag cannot be statically analyzed`
            };
          else if (arg === "-v")
            i5++;
          else if ((arg === "-k" || arg === "-s") && a2[i5 + 1] && /^[A-Za-z0-9_.+-]+$/.test(a2[i5 + 1]))
            i5 += 2;
          else if (/^-[ks][A-Za-z0-9_.+-]+$/.test(arg))
            i5++;
          else if (arg.startsWith("-"))
            return {
              ok: !1,
              reason: `timeout with ${arg} flag cannot be statically analyzed`
            };
          else
            break;
        }
        if (a2[i5] && /^\d+(?:\.\d+)?[smhd]?$/.test(a2[i5]))
          a2 = a2.slice(i5 + 1);
        else if (a2[i5])
          return {
            ok: !1,
            reason: `timeout duration '${a2[i5]}' cannot be statically analyzed`
          };
        else
          break;
      } else if (a2[0] === "nice")
        if (a2[1] === "-n" && a2[2] && /^-?\d+$/.test(a2[2]))
          a2 = a2.slice(3);
        else if (a2[1] && /^-\d+$/.test(a2[1]))
          a2 = a2.slice(2);
        else if (a2[1] && /[$(`]/.test(a2[1]))
          return {
            ok: !1,
            reason: `nice argument '${a2[1]}' contains expansion \u2014 cannot statically determine wrapped command`
          };
        else
          a2 = a2.slice(1);
      else if (a2[0] === "env") {
        let i5 = 1;
        while (i5 < a2.length) {
          let arg = a2[i5];
          if (arg.includes("=") && !arg.startsWith("-"))
            i5++;
          else if (arg === "-i" || arg === "-0" || arg === "-v")
            i5++;
          else if (arg === "-u" && a2[i5 + 1])
            i5 += 2;
          else if (arg.startsWith("-"))
            return {
              ok: !1,
              reason: `env with ${arg} flag cannot be statically analyzed`
            };
          else
            break;
        }
        if (i5 < a2.length)
          a2 = a2.slice(i5);
        else
          break;
      } else if (a2[0] === "stdbuf") {
        let i5 = 1;
        while (i5 < a2.length) {
          let arg = a2[i5];
          if (STDBUF_SHORT_SEP_RE.test(arg) && a2[i5 + 1])
            i5 += 2;
          else if (STDBUF_SHORT_FUSED_RE.test(arg))
            i5++;
          else if (STDBUF_LONG_RE.test(arg))
            i5++;
          else if (arg.startsWith("-"))
            return {
              ok: !1,
              reason: `stdbuf with ${arg} flag cannot be statically analyzed`
            };
          else
            break;
        }
        if (i5 > 1 && i5 < a2.length)
          a2 = a2.slice(i5);
        else
          break;
      } else
        break;
    let name3 = a2[0];
    if (name3 === void 0)
      continue;
    if (name3 === "")
      return {
        ok: !1,
        reason: "Empty command name \u2014 argv[0] may not reflect what bash runs"
      };
    if (name3.includes(CMDSUB_PLACEHOLDER) || name3.includes(VAR_PLACEHOLDER))
      return {
        ok: !1,
        reason: "Command name is runtime-determined (placeholder argv[0])"
      };
    if (name3.startsWith("-") || name3.startsWith("|") || name3.startsWith("&"))
      return {
        ok: !1,
        reason: "Command appears to be an incomplete fragment"
      };
    let dangerFlags = SUBSCRIPT_EVAL_FLAGS[name3];
    if (dangerFlags !== void 0)
      for (let i5 = 1;i5 < a2.length; i5++) {
        let arg = a2[i5];
        if (dangerFlags.has(arg) && a2[i5 + 1]?.includes("["))
          return {
            ok: !1,
            reason: `'${name3} ${arg}' operand contains array subscript \u2014 bash evaluates $(cmd) in subscripts`
          };
        if (arg.length > 2 && arg[0] === "-" && arg[1] !== "-" && !arg.includes("[")) {
          for (let flag of dangerFlags)
            if (flag.length === 2 && arg.includes(flag[1])) {
              if (a2[i5 + 1]?.includes("["))
                return {
                  ok: !1,
                  reason: `'${name3} ${flag}' (combined in '${arg}') operand contains array subscript \u2014 bash evaluates $(cmd) in subscripts`
                };
            }
        }
        for (let flag of dangerFlags)
          if (flag.length === 2 && arg.startsWith(flag) && arg.length > 2 && arg.includes("["))
            return {
              ok: !1,
              reason: `'${name3} ${flag}' (fused) operand contains array subscript \u2014 bash evaluates $(cmd) in subscripts`
            };
      }
    if (name3 === "[[")
      for (let i5 = 2;i5 < a2.length; i5++) {
        if (!TEST_ARITH_CMP_OPS.has(a2[i5]))
          continue;
        if (a2[i5 - 1]?.includes("[") || a2[i5 + 1]?.includes("["))
          return {
            ok: !1,
            reason: `'[[ ... ${a2[i5]} ... ]]' operand contains array subscript \u2014 bash arithmetically evaluates $(cmd) in subscripts`
          };
      }
    if (BARE_SUBSCRIPT_NAME_BUILTINS.has(name3)) {
      let skipNext = !1;
      for (let i5 = 1;i5 < a2.length; i5++) {
        let arg = a2[i5];
        if (skipNext) {
          skipNext = !1;
          continue;
        }
        if (arg[0] === "-") {
          if (name3 === "read") {
            if (READ_DATA_FLAGS.has(arg))
              skipNext = !0;
            else if (arg.length > 2 && arg[1] !== "-") {
              for (let j4 = 1;j4 < arg.length; j4++)
                if (READ_DATA_FLAGS.has("-" + arg[j4])) {
                  if (j4 === arg.length - 1)
                    skipNext = !0;
                  break;
                }
            }
          }
          continue;
        }
        if (arg.includes("["))
          return {
            ok: !1,
            reason: `'${name3}' positional NAME '${arg}' contains array subscript \u2014 bash evaluates $(cmd) in subscripts`
          };
      }
    }
    if (SHELL_KEYWORDS.has(name3))
      return {
        ok: !1,
        reason: `Shell keyword '${name3}' as command name \u2014 tree-sitter mis-parse`
      };
    for (let arg of cmd.argv)
      if (arg.includes(`
`) && NEWLINE_HASH_RE.test(arg))
        return {
          ok: !1,
          reason: "Newline followed by # inside a quoted argument can hide arguments from path validation"
        };
    for (let ev of cmd.envVars)
      if (ev.value.includes(`
`) && NEWLINE_HASH_RE.test(ev.value))
        return {
          ok: !1,
          reason: "Newline followed by # inside an env var value can hide arguments from path validation"
        };
    for (let r4 of cmd.redirects)
      if (r4.target.includes(`
`) && NEWLINE_HASH_RE.test(r4.target))
        return {
          ok: !1,
          reason: "Newline followed by # inside a redirect target can hide arguments from path validation"
        };
    if (name3 === "jq") {
      for (let arg of a2)
        if (/\bsystem\s*\(/.test(arg))
          return {
            ok: !1,
            reason: "jq command contains system() function which executes arbitrary commands"
          };
      if (a2.some((arg) => /^(?:-[fL](?:$|[^A-Za-z])|--(?:from-file|rawfile|slurpfile|library-path)(?:$|=))/.test(arg)))
        return {
          ok: !1,
          reason: "jq command contains dangerous flags that could execute code or read arbitrary files"
        };
    }
    if (ZSH_DANGEROUS_BUILTINS.has(name3))
      return {
        ok: !1,
        reason: `Zsh builtin '${name3}' can bypass security checks`
      };
    if (EVAL_LIKE_BUILTINS.has(name3))
      if (name3 === "command" && (a2[1] === "-v" || a2[1] === "-V"))
        ;
      else if (name3 === "fc" && !a2.slice(1).some((arg) => /^-[^-]*[es]/.test(arg)))
        ;
      else if (name3 === "compgen" && !a2.slice(1).some((arg) => /^-[^-]*[CFW]/.test(arg)))
        ;
      else
        return {
          ok: !1,
          reason: `'${name3}' evaluates arguments as shell code`
        };
    for (let arg of cmd.argv)
      if (arg.includes("/proc/") && PROC_ENVIRON_RE.test(arg))
        return {
          ok: !1,
          reason: "Accesses /proc/*/environ which may expose secrets"
        };
    for (let r4 of cmd.redirects)
      if (r4.target.includes("/proc/") && PROC_ENVIRON_RE.test(r4.target))
        return {
          ok: !1,
          reason: "Accesses /proc/*/environ which may expose secrets"
        };
  }
  return { ok: !0 };
}
var STRUCTURAL_TYPES, SEPARATOR_TYPES, CMDSUB_PLACEHOLDER = "__CMDSUB_OUTPUT__", VAR_PLACEHOLDER = "__TRACKED_VAR__", BARE_VAR_UNSAFE_RE, STDBUF_SHORT_SEP_RE, STDBUF_SHORT_FUSED_RE, STDBUF_LONG_RE, SAFE_ENV_VARS, SPECIAL_VAR_NAMES, DANGEROUS_TYPES, DANGEROUS_TYPE_IDS, REDIRECT_OPS, BRACE_EXPANSION_RE, CONTROL_CHAR_RE, UNICODE_WHITESPACE_RE, BACKSLASH_WHITESPACE_RE, ZSH_TILDE_BRACKET_RE, ZSH_EQUALS_EXPANSION_RE, BRACE_WITH_QUOTE_RE, DOLLAR, ARITH_LEAF_RE, ZSH_DANGEROUS_BUILTINS, EVAL_LIKE_BUILTINS, SUBSCRIPT_EVAL_FLAGS, TEST_ARITH_CMP_OPS, BARE_SUBSCRIPT_NAME_BUILTINS, READ_DATA_FLAGS, PROC_ENVIRON_RE, NEWLINE_HASH_RE;
var init_ast = __esm(() => {
  init_bashParser();
  init_parser4();
  STRUCTURAL_TYPES = /* @__PURE__ */ new Set([
    "program",
    "list",
    "pipeline",
    "redirected_statement"
  ]), SEPARATOR_TYPES = /* @__PURE__ */ new Set(["&&", "||", "|", ";", "&", "|&", `
`]);
  BARE_VAR_UNSAFE_RE = /[ \t\n*?[]/, STDBUF_SHORT_SEP_RE = /^-[ioe]$/, STDBUF_SHORT_FUSED_RE = /^-[ioe]./, STDBUF_LONG_RE = /^--(input|output|error)=/, SAFE_ENV_VARS = /* @__PURE__ */ new Set([
    "HOME",
    "PWD",
    "OLDPWD",
    "USER",
    "LOGNAME",
    "SHELL",
    "PATH",
    "HOSTNAME",
    "UID",
    "EUID",
    "PPID",
    "RANDOM",
    "SECONDS",
    "LINENO",
    "TMPDIR",
    "BASH_VERSION",
    "BASHPID",
    "SHLVL",
    "HISTFILE",
    "IFS"
  ]), SPECIAL_VAR_NAMES = /* @__PURE__ */ new Set([
    "?",
    "$",
    "!",
    "#",
    "0",
    "-"
  ]), DANGEROUS_TYPES = /* @__PURE__ */ new Set([
    "command_substitution",
    "process_substitution",
    "expansion",
    "simple_expansion",
    "brace_expression",
    "subshell",
    "compound_statement",
    "for_statement",
    "while_statement",
    "until_statement",
    "if_statement",
    "case_statement",
    "function_definition",
    "test_command",
    "ansi_c_string",
    "translated_string",
    "herestring_redirect",
    "heredoc_redirect"
  ]), DANGEROUS_TYPE_IDS = [...DANGEROUS_TYPES];
  REDIRECT_OPS = {
    ">": ">",
    ">>": ">>",
    "<": "<",
    ">&": ">&",
    "<&": "<&",
    ">|": ">|",
    "&>": "&>",
    "&>>": "&>>",
    "<<<": "<<<"
  }, BRACE_EXPANSION_RE = /\{[^{}\s]*(,|\.\.)[^{}\s]*\}/, CONTROL_CHAR_RE = /[\x00-\x08\x0B-\x1F\x7F]/, UNICODE_WHITESPACE_RE = /[\u00A0\u1680\u2000-\u200B\u2028\u2029\u202F\u205F\u3000\uFEFF]/, BACKSLASH_WHITESPACE_RE = /\\[ \t]|[^ \t\n\\]\\\n/, ZSH_TILDE_BRACKET_RE = /~\[/, ZSH_EQUALS_EXPANSION_RE = /(?:^|[\s;&|])=[a-zA-Z_]/, BRACE_WITH_QUOTE_RE = /\{[^}]*['"]/;
  DOLLAR = String.fromCharCode(36);
  ARITH_LEAF_RE = /^(?:[0-9]+|0[xX][0-9a-fA-F]+|[0-9]+#[0-9a-zA-Z]+|[-+*/%^&|~!<>=?:(),]+|<<|>>|\*\*|&&|\|\||[<>=!]=|\$\(\(|\)\))$/;
  ZSH_DANGEROUS_BUILTINS = /* @__PURE__ */ new Set([
    "zmodload",
    "emulate",
    "sysopen",
    "sysread",
    "syswrite",
    "sysseek",
    "zpty",
    "ztcp",
    "zsocket",
    "zf_rm",
    "zf_mv",
    "zf_ln",
    "zf_chmod",
    "zf_chown",
    "zf_mkdir",
    "zf_rmdir",
    "zf_chgrp"
  ]), EVAL_LIKE_BUILTINS = /* @__PURE__ */ new Set([
    "eval",
    "source",
    ".",
    "exec",
    "command",
    "builtin",
    "fc",
    "coproc",
    "noglob",
    "nocorrect",
    "trap",
    "enable",
    "mapfile",
    "readarray",
    "hash",
    "bind",
    "complete",
    "compgen",
    "alias",
    "let"
  ]), SUBSCRIPT_EVAL_FLAGS = {
    test: /* @__PURE__ */ new Set(["-v", "-R"]),
    "[": /* @__PURE__ */ new Set(["-v", "-R"]),
    "[[": /* @__PURE__ */ new Set(["-v", "-R"]),
    printf: /* @__PURE__ */ new Set(["-v"]),
    read: /* @__PURE__ */ new Set(["-a"]),
    unset: /* @__PURE__ */ new Set(["-v"]),
    wait: /* @__PURE__ */ new Set(["-p"])
  }, TEST_ARITH_CMP_OPS = /* @__PURE__ */ new Set(["-eq", "-ne", "-lt", "-le", "-gt", "-ge"]), BARE_SUBSCRIPT_NAME_BUILTINS = /* @__PURE__ */ new Set(["read", "unset"]), READ_DATA_FLAGS = /* @__PURE__ */ new Set(["-p", "-d", "-n", "-N", "-t", "-u", "-i"]), PROC_ENVIRON_RE = /\/proc\/.*\/environ/, NEWLINE_HASH_RE = /\n[ \t]*#/;
});

