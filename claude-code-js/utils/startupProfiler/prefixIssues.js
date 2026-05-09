// function: prefixIssues
function prefixIssues(path2, issues) {
  return issues.map((iss) => {
    var _a2;
    return (_a2 = iss).path ?? (_a2.path = []), iss.path.unshift(path2), iss;
  });
}
