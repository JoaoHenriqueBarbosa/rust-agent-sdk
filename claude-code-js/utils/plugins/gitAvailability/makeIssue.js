// var: makeIssue
var makeIssue = (params) => {
  let { data, path: path16, errorMaps, issueData } = params, fullPath = [...path16, ...issueData.path || []], fullIssue = {
    ...issueData,
    path: fullPath
  };
  if (issueData.message !== void 0)
    return {
      ...issueData,
      path: fullPath,
      message: issueData.message
    };
  let errorMessage2 = "", maps = errorMaps.filter((m4) => !!m4).slice().reverse();
  for (let map7 of maps)
    errorMessage2 = map7(fullIssue, { data, defaultError: errorMessage2 }).message;
  return {
    ...issueData,
    path: fullPath,
    message: errorMessage2
  };
}, EMPTY_PATH, INVALID, DIRTY = (value) => ({ status: "dirty", value }), OK = (value) => ({ status: "valid", value }), isAborted = (x3) => x3.status === "aborted", isDirty = (x3) => x3.status === "dirty", isValid = (x3) => x3.status === "valid", isAsync = (x3) => typeof Promise < "u" && x3 instanceof Promise;
