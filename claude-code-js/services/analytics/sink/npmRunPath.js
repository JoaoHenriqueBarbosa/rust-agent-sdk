// var: npmRunPath
var npmRunPath = ({
  cwd: cwd2 = process6.cwd(),
  path: pathOption = process6.env[pathKey()],
  preferLocal = !0,
  execPath = process6.execPath,
  addExecPath = !0
} = {}) => {
  let cwdPath = path3.resolve(toPath(cwd2)), result = [], pathParts = pathOption.split(path3.delimiter);
  if (preferLocal)
    applyPreferLocal(result, pathParts, cwdPath);
  if (addExecPath)
    applyExecPath(result, pathParts, execPath, cwdPath);
  return pathOption === "" || pathOption === path3.delimiter ? `${result.join(path3.delimiter)}${pathOption}` : [...result, pathOption].join(path3.delimiter);
}, applyPreferLocal = (result, pathParts, cwdPath) => {
  for (let directory of traversePathUp(cwdPath)) {
    let pathPart = path3.join(directory, "node_modules/.bin");
    if (!pathParts.includes(pathPart))
      result.push(pathPart);
  }
}, applyExecPath = (result, pathParts, execPath, cwdPath) => {
  let pathPart = path3.resolve(cwdPath, toPath(execPath), "..");
  if (!pathParts.includes(pathPart))
    result.push(pathPart);
}, npmRunPathEnv = ({ env: env2 = process6.env, ...options } = {}) => {
  env2 = { ...env2 };
  let pathName = pathKey({ env: env2 });
  return options.path = env2[pathName], env2[pathName] = npmRunPath(options), env2;
};
