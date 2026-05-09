// function: urlPatternToRegex
function urlPatternToRegex(pattern) {
  let regexStr = pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
  return new RegExp(`^${regexStr}$`);
}
