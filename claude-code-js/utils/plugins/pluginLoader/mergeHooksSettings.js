// function: mergeHooksSettings
function mergeHooksSettings(base2, additional) {
  if (!base2)
    return additional;
  let merged = { ...base2 };
  for (let [event, matchers] of Object.entries(additional))
    if (!merged[event])
      merged[event] = matchers;
    else
      merged[event] = [
        ...merged[event] || [],
        ...matchers
      ];
  return merged;
}
