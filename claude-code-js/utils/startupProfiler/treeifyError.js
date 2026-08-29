// function: treeifyError
function treeifyError(error2, _mapper) {
  let mapper = _mapper || function(issue2) {
    return issue2.message;
  }, result = { errors: [] }, processError = (error3, path2 = []) => {
    var _a2, _b;
    for (let issue2 of error3.issues)
      if (issue2.code === "invalid_union" && issue2.errors.length)
        issue2.errors.map((issues) => processError({ issues }, issue2.path));
      else if (issue2.code === "invalid_key")
        processError({ issues: issue2.issues }, issue2.path);
      else if (issue2.code === "invalid_element")
        processError({ issues: issue2.issues }, issue2.path);
      else {
        let fullpath = [...path2, ...issue2.path];
        if (fullpath.length === 0) {
          result.errors.push(mapper(issue2));
          continue;
        }
        let curr = result, i = 0;
        while (i < fullpath.length) {
          let el = fullpath[i], terminal = i === fullpath.length - 1;
          if (typeof el === "string")
            curr.properties ?? (curr.properties = {}), (_a2 = curr.properties)[el] ?? (_a2[el] = { errors: [] }), curr = curr.properties[el];
          else
            curr.items ?? (curr.items = []), (_b = curr.items)[el] ?? (_b[el] = { errors: [] }), curr = curr.items[el];
          if (terminal)
            curr.errors.push(mapper(issue2));
          i++;
        }
      }
  };
  return processError(error2), result;
}
