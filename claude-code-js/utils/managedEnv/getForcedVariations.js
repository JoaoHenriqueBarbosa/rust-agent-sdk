// function: getForcedVariations
function getForcedVariations(ctx) {
  if (ctx.global.forcedVariations && ctx.user.forcedVariations)
    return {
      ...ctx.global.forcedVariations,
      ...ctx.user.forcedVariations
    };
  else if (ctx.global.forcedVariations)
    return ctx.global.forcedVariations;
  else if (ctx.user.forcedVariations)
    return ctx.user.forcedVariations;
  else
    return {};
}
