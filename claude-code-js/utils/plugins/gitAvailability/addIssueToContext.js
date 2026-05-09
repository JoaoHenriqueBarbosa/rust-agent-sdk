// function: addIssueToContext
function addIssueToContext(ctx, issueData) {
  let overrideMap = getErrorMap2(), issue2 = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      ctx.schemaErrorMap,
      overrideMap,
      overrideMap === en_default2 ? void 0 : en_default2
    ].filter((x3) => !!x3)
  });
  ctx.common.issues.push(issue2);
}
