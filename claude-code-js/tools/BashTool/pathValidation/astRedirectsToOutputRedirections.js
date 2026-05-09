// function: astRedirectsToOutputRedirections
function astRedirectsToOutputRedirections(redirects) {
  let redirections = [];
  for (let r4 of redirects)
    switch (r4.op) {
      case ">":
      case ">|":
      case "&>":
        redirections.push({ target: r4.target, operator: ">" });
        break;
      case ">>":
      case "&>>":
        redirections.push({ target: r4.target, operator: ">>" });
        break;
      case ">&":
        if (!/^\d+$/.test(r4.target))
          redirections.push({ target: r4.target, operator: ">" });
        break;
      case "<":
      case "<<":
      case "<&":
      case "<<<":
        break;
    }
  return { redirections, hasDangerousRedirection: !1 };
}
