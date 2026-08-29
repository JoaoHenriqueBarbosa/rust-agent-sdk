// var: mapNode
var mapNode = ({ options }) => {
  if (options.node === !1)
    throw TypeError('The "node" option cannot be false with `execaNode()`.');
  return { options: { ...options, node: !0 } };
}, handleNodeOption = (file2, commandArguments, {
  node: shouldHandleNode = !1,
  nodePath: nodePath2 = execPath,
  nodeOptions = execArgv.filter((nodeOption) => !nodeOption.startsWith("--inspect")),
  cwd: cwd2,
  execPath: formerNodePath,
  ...options
}) => {
  if (formerNodePath !== void 0)
    throw TypeError('The "execPath" option has been removed. Please use the "nodePath" option instead.');
  let normalizedNodePath = safeNormalizeFileUrl(nodePath2, 'The "nodePath" option'), resolvedNodePath = path4.resolve(cwd2, normalizedNodePath), newOptions = {
    ...options,
    nodePath: resolvedNodePath,
    node: shouldHandleNode,
    cwd: cwd2
  };
  if (!shouldHandleNode)
    return [file2, commandArguments, newOptions];
  if (path4.basename(file2, ".exe") === "node")
    throw TypeError('When the "node" option is true, the first argument does not need to be "node".');
  return [
    resolvedNodePath,
    [...nodeOptions, file2, ...commandArguments],
    { ipc: !0, ...newOptions, shell: !1 }
  ];
};
