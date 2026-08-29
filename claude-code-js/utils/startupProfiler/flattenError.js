// function: flattenError
function flattenError(error2, mapper = (issue2) => issue2.message) {
  let fieldErrors = {}, formErrors = [];
  for (let sub of error2.issues)
    if (sub.path.length > 0)
      fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [], fieldErrors[sub.path[0]].push(mapper(sub));
    else
      formErrors.push(mapper(sub));
  return { formErrors, fieldErrors };
}
