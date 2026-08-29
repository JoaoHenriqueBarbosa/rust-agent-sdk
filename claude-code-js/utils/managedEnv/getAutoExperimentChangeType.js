// function: getAutoExperimentChangeType
function getAutoExperimentChangeType(exp) {
  if (exp.urlPatterns && exp.variations.some((variation) => isObj3(variation) && ("urlRedirect" in variation)))
    return "redirect";
  else if (exp.variations.some((variation) => isObj3(variation) && (variation.domMutations || ("js" in variation) || ("css" in variation))))
    return "visual";
  return "unknown";
}
