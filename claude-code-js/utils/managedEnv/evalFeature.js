// function: evalFeature
function evalFeature(id, ctx) {
  if (ctx.stack.evaluatedFeatures.has(id))
    return ctx.global.log(`evalFeature: circular dependency detected: ${ctx.stack.id} -> ${id}`, {
      from: ctx.stack.id,
      to: id
    }), getFeatureResult(ctx, id, null, "cyclicPrerequisite");
  ctx.stack.evaluatedFeatures.add(id), ctx.stack.id = id;
  let forcedValues = getForcedFeatureValues(ctx);
  if (forcedValues.has(id))
    return ctx.global.log("Global override", {
      id,
      value: forcedValues.get(id)
    }), getFeatureResult(ctx, id, forcedValues.get(id), "override");
  if (!ctx.global.features || !ctx.global.features[id])
    return ctx.global.log("Unknown feature", {
      id
    }), getFeatureResult(ctx, id, null, "unknownFeature");
  let feature = ctx.global.features[id];
  if (feature.rules) {
    let evaluatedFeatures = new Set(ctx.stack.evaluatedFeatures);
    rules:
      for (let rule of feature.rules) {
        if (rule.parentConditions)
          for (let parentCondition of rule.parentConditions) {
            ctx.stack.evaluatedFeatures = new Set(evaluatedFeatures);
            let parentResult = evalFeature(parentCondition.id, ctx);
            if (parentResult.source === "cyclicPrerequisite")
              return getFeatureResult(ctx, id, null, "cyclicPrerequisite");
            let evalObj = {
              value: parentResult.value
            };
            if (!evalCondition(evalObj, parentCondition.condition || {})) {
              if (parentCondition.gate)
                return ctx.global.log("Feature blocked by prerequisite", {
                  id,
                  rule
                }), getFeatureResult(ctx, id, null, "prerequisite");
              ctx.global.log("Skip rule because prerequisite evaluation fails", {
                id,
                rule
              });
              continue rules;
            }
          }
        if (rule.filters && isFilteredOut(rule.filters, ctx)) {
          ctx.global.log("Skip rule because of filters", {
            id,
            rule
          });
          continue;
        }
        if ("force" in rule) {
          if (rule.condition && !conditionPasses(rule.condition, ctx)) {
            ctx.global.log("Skip rule because of condition ff", {
              id,
              rule
            });
            continue;
          }
          if (!isIncludedInRollout(ctx, rule.seed || id, rule.hashAttribute, ctx.user.saveStickyBucketAssignmentDoc && !rule.disableStickyBucketing ? rule.fallbackAttribute : void 0, rule.range, rule.coverage, rule.hashVersion)) {
            ctx.global.log("Skip rule because user not included in rollout", {
              id,
              rule
            });
            continue;
          }
          if (ctx.global.log("Force value from rule", {
            id,
            rule
          }), rule.tracks)
            rule.tracks.forEach((t2) => {
              if (!onExperimentViewed(ctx, t2.experiment, t2.result).length && ctx.global.saveDeferredTrack)
                ctx.global.saveDeferredTrack({
                  experiment: t2.experiment,
                  result: t2.result
                });
            });
          return getFeatureResult(ctx, id, rule.force, "force", rule.id);
        }
        if (!rule.variations) {
          ctx.global.log("Skip invalid rule", {
            id,
            rule
          });
          continue;
        }
        let exp = {
          variations: rule.variations,
          key: rule.key || id
        };
        if ("coverage" in rule)
          exp.coverage = rule.coverage;
        if (rule.weights)
          exp.weights = rule.weights;
        if (rule.hashAttribute)
          exp.hashAttribute = rule.hashAttribute;
        if (rule.fallbackAttribute)
          exp.fallbackAttribute = rule.fallbackAttribute;
        if (rule.disableStickyBucketing)
          exp.disableStickyBucketing = rule.disableStickyBucketing;
        if (rule.bucketVersion !== void 0)
          exp.bucketVersion = rule.bucketVersion;
        if (rule.minBucketVersion !== void 0)
          exp.minBucketVersion = rule.minBucketVersion;
        if (rule.namespace)
          exp.namespace = rule.namespace;
        if (rule.meta)
          exp.meta = rule.meta;
        if (rule.ranges)
          exp.ranges = rule.ranges;
        if (rule.name)
          exp.name = rule.name;
        if (rule.phase)
          exp.phase = rule.phase;
        if (rule.seed)
          exp.seed = rule.seed;
        if (rule.hashVersion)
          exp.hashVersion = rule.hashVersion;
        if (rule.filters)
          exp.filters = rule.filters;
        if (rule.condition)
          exp.condition = rule.condition;
        let {
          result
        } = runExperiment(exp, id, ctx);
        if (ctx.global.onExperimentEval && ctx.global.onExperimentEval(exp, result), result.inExperiment && !result.passthrough)
          return getFeatureResult(ctx, id, result.value, "experiment", rule.id, exp, result);
      }
  }
  return ctx.global.log("Use default value", {
    id,
    value: feature.defaultValue
  }), getFeatureResult(ctx, id, feature.defaultValue === void 0 ? null : feature.defaultValue, "defaultValue");
}
