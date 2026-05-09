// Original: src/utils/debugFilter.ts
function extractDebugCategories(message) {
  let categories = [], mcpMatch = message.match(/^MCP server ["']([^"']+)["']/);
  if (mcpMatch && mcpMatch[1])
    categories.push("mcp"), categories.push(mcpMatch[1].toLowerCase());
  else {
    let prefixMatch = message.match(/^([^:[]+):/);
    if (prefixMatch && prefixMatch[1])
      categories.push(prefixMatch[1].trim().toLowerCase());
  }
  let bracketMatch = message.match(/^\[([^\]]+)]/);
  if (bracketMatch && bracketMatch[1])
    categories.push(bracketMatch[1].trim().toLowerCase());
  if (message.toLowerCase().includes("1p event:"))
    categories.push("1p");
  let secondaryMatch = message.match(/:\s*([^:]+?)(?:\s+(?:type|mode|status|event))?:/);
  if (secondaryMatch && secondaryMatch[1]) {
    let secondary = secondaryMatch[1].trim().toLowerCase();
    if (secondary.length < 30 && !secondary.includes(" "))
      categories.push(secondary);
  }
  return Array.from(new Set(categories));
}
function shouldShowDebugCategories(categories, filter) {
  if (!filter)
    return !0;
  if (categories.length === 0)
    return !1;
  if (filter.isExclusive)
    return !categories.some((cat) => filter.exclude.includes(cat));
  else
    return categories.some((cat) => filter.include.includes(cat));
}
function shouldShowDebugMessage(message, filter) {
  if (!filter)
    return !0;
  let categories = extractDebugCategories(message);
  return shouldShowDebugCategories(categories, filter);
}
var parseDebugFilter;
var init_debugFilter = __esm(() => {
  init_memoize();
  parseDebugFilter = memoize_default((filterString) => {
    if (!filterString || filterString.trim() === "")
      return null;
    let filters = filterString.split(",").map((f) => f.trim()).filter(Boolean);
    if (filters.length === 0)
      return null;
    let hasExclusive = filters.some((f) => f.startsWith("!")), hasInclusive = filters.some((f) => !f.startsWith("!"));
    if (hasExclusive && hasInclusive)
      return null;
    let cleanFilters = filters.map((f) => f.replace(/^!/, "").toLowerCase());
    return {
      include: hasExclusive ? [] : cleanFilters,
      exclude: hasExclusive ? cleanFilters : [],
      isExclusive: hasExclusive
    };
  });
});
