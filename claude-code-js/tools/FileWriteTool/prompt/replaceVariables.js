// function: replaceVariables
function replaceVariables(value, variables) {
  if (typeof value === "string") {
    let result = value;
    for (let [key2, replacement] of Object.entries(variables)) {
      let pattern = new RegExp(`\\$\\{${key2}\\}`, "g");
      if (result.match(pattern))
        if (Array.isArray(replacement))
          console.warn(`Cannot replace ${key2} with array value in string context: "${value}"`, { key: key2, replacement });
        else
          result = result.replace(pattern, replacement);
    }
    return result;
  } else if (Array.isArray(value)) {
    let result = [];
    for (let item of value)
      if (typeof item === "string" && item.match(/^\$\{user_config\.[^}]+\}$/)) {
        let varName = item.match(/^\$\{([^}]+)\}$/)?.[1];
        if (varName && variables[varName]) {
          let replacement = variables[varName];
          if (Array.isArray(replacement))
            result.push(...replacement);
          else
            result.push(replacement);
        } else
          result.push(item);
      } else
