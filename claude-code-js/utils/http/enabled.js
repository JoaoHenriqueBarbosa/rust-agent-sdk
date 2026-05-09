// function: enabled
function enabled(namespace) {
  if (namespace.endsWith("*"))
    return !0;
  for (let skipped of skippedNamespaces)
    if (namespaceMatches(namespace, skipped))
      return !1;
  for (let enabledNamespace of enabledNamespaces)
    if (namespaceMatches(namespace, enabledNamespace))
      return !0;
  return !1;
}
