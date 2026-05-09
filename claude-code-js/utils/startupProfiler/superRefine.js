// function: superRefine
function superRefine(fn) {
  let ch = check((payload) => {
    return payload.addIssue = (issue2) => {
      if (typeof issue2 === "string")
        payload.issues.push(exports_util.issue(issue2, payload.value, ch._zod.def));
      else {
        let _issue = issue2;
        if (_issue.fatal)
          _issue.continue = !1;
        _issue.code ?? (_issue.code = "custom"), _issue.input ?? (_issue.input = payload.value), _issue.inst ?? (_issue.inst = ch), _issue.continue ?? (_issue.continue = !ch._zod.def.abort), payload.issues.push(exports_util.issue(_issue));
      }
    }, fn(payload.value, payload);
  });
  return ch;
}
