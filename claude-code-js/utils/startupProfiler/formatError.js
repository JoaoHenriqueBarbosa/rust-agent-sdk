// function: formatError
function formatError(error2, _mapper) {
  let mapper = _mapper || function(issue2) {
    return issue2.message;
  }, fieldErrors = { _errors: [] }, processError = (error3) => {
    for (let issue2 of error3.issues)
      if (issue2.code === "invalid_union" && issue2.errors.length)
        issue2.errors.map((issues) => processError({ issues }));
      else if (issue2.code === "invalid_key")
        processError({ issues: issue2.issues });
      else if (issue2.code === "invalid_element")
        processError({ issues: issue2.issues });
      else if (issue2.path.length === 0)
        fieldErrors._errors.push(mapper(issue2));
      else {
        let curr = fieldErrors, i = 0;
        while (i < issue2.path.length) {
          let el = issue2.path[i];
          if (i !== issue2.path.length - 1)
            curr[el] = curr[el] || { _errors: [] };
          else
            curr[el] = curr[el] || { _errors: [] }, curr[el]._errors.push(mapper(issue2));
          curr = curr[el], i++;
        }
      }
  };
  return processError(error2), fieldErrors;
}
