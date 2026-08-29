// function: enable
function enable(namespaces) {
  enabledString = namespaces, enabledNamespaces = [], skippedNamespaces = [];
  let namespaceList = namespaces.split(",").map((ns) => ns.trim());
  for (let ns of namespaceList)
    if (ns.startsWith("-"))
      skippedNamespaces.push(ns.substring(1));
    else
      enabledNamespaces.push(ns);
  for (let instance of debuggers)
    instance.enabled = enabled(instance.namespace);
}
