// function: mergeOverrides
function mergeOverrides(experiment, ctx) {
  let key3 = experiment.key, o5 = ctx.global.overrides;
  if (o5 && o5[key3]) {
    if (experiment = Object.assign({}, experiment, o5[key3]), typeof experiment.url === "string")
      experiment.url = getUrlRegExp(experiment.url);
  }
  return experiment;
}
