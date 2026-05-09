// function: stripSafeRedirections
function stripSafeRedirections(content) {
  return content.replace(/\s+2\s*>&\s*1(?=\s|$)/g, "").replace(/[012]?\s*>\s*\/dev\/null(?=\s|$)/g, "").replace(/\s*<\s*\/dev\/null(?=\s|$)/g, "");
}
