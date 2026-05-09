// function: extractIncludePathsFromTokens
function extractIncludePathsFromTokens(tokens, basePath) {
  let absolutePaths = /* @__PURE__ */ new Set;
  function extractPathsFromText(textContent) {
    let includeRegex = /(?:^|\s)@((?:[^\s\\]|\\ )+)/g, match;
    while ((match = includeRegex.exec(textContent)) !== null) {
      let path16 = match[1];
      if (!path16)
        continue;
      let hashIndex = path16.indexOf("#");
      if (hashIndex !== -1)
        path16 = path16.substring(0, hashIndex);
      if (!path16)
        continue;
      if (path16 = path16.replace(/\\ /g, " "), path16) {
        if (path16.startsWith("./") || path16.startsWith("~/") || path16.startsWith("/") && path16 !== "/" || !path16.startsWith("@") && !path16.match(/^[#%^&*()]+/) && path16.match(/^[a-zA-Z0-9._-]/)) {
          let resolvedPath5 = expandPath(path16, dirname24(basePath));
          absolutePaths.add(resolvedPath5);
        }
      }
    }
  }
  function processElements(elements) {
    for (let element of elements) {
      if (element.type === "code" || element.type === "codespan")
        continue;
      if (element.type === "html") {
        let raw = element.raw || "", trimmed = raw.trimStart();
        if (trimmed.startsWith("<!--") && trimmed.includes("-->")) {
          let commentSpan = /<!--[\s\S]*?-->/g, residue = raw.replace(commentSpan, "");
          if (residue.trim().length > 0)
            extractPathsFromText(residue);
        }
        continue;
      }
      if (element.type === "text")
        extractPathsFromText(element.text || "");
      if (element.tokens)
        processElements(element.tokens);
      if (element.items)
        processElements(element.items);
    }
  }
  return processElements(tokens), [...absolutePaths];
}
