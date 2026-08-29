// function: runExperiment
function runExperiment(experiment, featureId, ctx) {
  let key3 = experiment.key, numVariations = experiment.variations.length;
  if (numVariations < 2)
    return ctx.global.log("Invalid experiment", {
      id: key3
    }), {
      result: getExperimentResult(ctx, experiment, -1, !1, featureId)
    };
  if (ctx.global.enabled === !1 || ctx.user.enabled === !1)
    return ctx.global.log("Context disabled", {
      id: key3
    }), {
      result: getExperimentResult(ctx, experiment, -1, !1, featureId)
    };
  if (experiment = mergeOverrides(experiment, ctx), experiment.urlPatterns && !isURLTargeted(ctx.user.url || "", experiment.urlPatterns))
    return ctx.global.log("Skip because of url targeting", {
      id: key3
    }), {
      result: getExperimentResult(ctx, experiment, -1, !1, featureId)
    };
  let qsOverride = getQueryStringOverride(key3, ctx.user.url || "", numVariations);
  if (qsOverride !== null)
    return ctx.global.log("Force via querystring", {
      id: key3,
      variation: qsOverride
    }), {
      result: getExperimentResult(ctx, experiment, qsOverride, !1, featureId)
    };
  let forcedVariations = getForcedVariations(ctx);
  if (key3 in forcedVariations) {
    let variation = forcedVariations[key3];
    return ctx.global.log("Force via dev tools", {
      id: key3,
      variation
    }), {
      result: getExperimentResult(ctx, experiment, variation, !1, featureId)
    };
  }
  if (experiment.status === "draft" || experiment.active === !1)
    return ctx.global.log("Skip because inactive", {
      id: key3
    }), {
      result: getExperimentResult(ctx, experiment, -1, !1, featureId)
    };
  let {
    hashAttribute,
    hashValue
  } = getHashAttribute(ctx, experiment.hashAttribute, ctx.user.saveStickyBucketAssignmentDoc && !experiment.disableStickyBucketing ? experiment.fallbackAttribute : void 0);
  if (!hashValue)
    return ctx.global.log("Skip because missing hashAttribute", {
      id: key3
    }), {
      result: getExperimentResult(ctx, experiment, -1, !1, featureId)
    };
  let assigned = -1, foundStickyBucket = !1, stickyBucketVersionIsBlocked = !1;
  if (ctx.user.saveStickyBucketAssignmentDoc && !experiment.disableStickyBucketing) {
    let {
      variation,
      versionIsBlocked
    } = getStickyBucketVariation({
      ctx,
      expKey: experiment.key,
      expBucketVersion: experiment.bucketVersion,
      expHashAttribute: experiment.hashAttribute,
      expFallbackAttribute: experiment.fallbackAttribute,
      expMinBucketVersion: experiment.minBucketVersion,
      expMeta: experiment.meta
    });
    foundStickyBucket = variation >= 0, assigned = variation, stickyBucketVersionIsBlocked = !!versionIsBlocked;
  }
  if (!foundStickyBucket) {
    if (experiment.filters) {
      if (isFilteredOut(experiment.filters, ctx))
        return ctx.global.log("Skip because of filters", {
          id: key3
        }), {
          result: getExperimentResult(ctx, experiment, -1, !1, featureId)
        };
    } else if (experiment.namespace && !inNamespace(hashValue, experiment.namespace))
      return ctx.global.log("Skip because of namespace", {
        id: key3
      }), {
        result: getExperimentResult(ctx, experiment, -1, !1, featureId)
      };
    if (experiment.include && !isIncluded(experiment.include))
      return ctx.global.log("Skip because of include function", {
        id: key3
      }), {
        result: getExperimentResult(ctx, experiment, -1, !1, featureId)
      };
    if (experiment.condition && !conditionPasses(experiment.condition, ctx))
      return ctx.global.log("Skip because of condition exp", {
        id: key3
      }), {
        result: getExperimentResult(ctx, experiment, -1, !1, featureId)
      };
    if (experiment.parentConditions) {
      let evaluatedFeatures = new Set(ctx.stack.evaluatedFeatures);
      for (let parentCondition of experiment.parentConditions) {
        ctx.stack.evaluatedFeatures = new Set(evaluatedFeatures);
        let parentResult = evalFeature(parentCondition.id, ctx);
        if (parentResult.source === "cyclicPrerequisite")
          return {
            result: getExperimentResult(ctx, experiment, -1, !1, featureId)
          };
        let evalObj = {
          value: parentResult.value
        };
        if (!evalCondition(evalObj, parentCondition.condition || {}))
          return ctx.global.log("Skip because prerequisite evaluation fails", {
            id: key3
          }), {
            result: getExperimentResult(ctx, experiment, -1, !1, featureId)
          };
      }
    }
    if (experiment.groups && !hasGroupOverlap(experiment.groups, ctx))
      return ctx.global.log("Skip because of groups", {
        id: key3
      }), {
        result: getExperimentResult(ctx, experiment, -1, !1, featureId)
      };
  }
  if (experiment.url && !urlIsValid(experiment.url, ctx))
    return ctx.global.log("Skip because of url", {
      id: key3
    }), {
      result: getExperimentResult(ctx, experiment, -1, !1, featureId)
    };
  let n6 = hash(experiment.seed || key3, hashValue, experiment.hashVersion || 1);
  if (n6 === null)
    return ctx.global.log("Skip because of invalid hash version", {
      id: key3
    }), {
      result: getExperimentResult(ctx, experiment, -1, !1, featureId)
    };
  if (!foundStickyBucket) {
    let ranges = experiment.ranges || getBucketRanges(numVariations, experiment.coverage === void 0 ? 1 : experiment.coverage, experiment.weights);
    assigned = chooseVariation(n6, ranges);
  }
  if (stickyBucketVersionIsBlocked)
    return ctx.global.log("Skip because sticky bucket version is blocked", {
      id: key3
    }), {
      result: getExperimentResult(ctx, experiment, -1, !1, featureId, void 0, !0)
    };
  if (assigned < 0)
    return ctx.global.log("Skip because of coverage", {
      id: key3
    }), {
      result: getExperimentResult(ctx, experiment, -1, !1, featureId)
    };
  if ("force" in experiment)
    return ctx.global.log("Force variation", {
      id: key3,
      variation: experiment.force
    }), {
      result: getExperimentResult(ctx, experiment, experiment.force === void 0 ? -1 : experiment.force, !1, featureId)
    };
  if (ctx.global.qaMode || ctx.user.qaMode)
    return ctx.global.log("Skip because QA mode", {
      id: key3
    }), {
      result: getExperimentResult(ctx, experiment, -1, !1, featureId)
    };
  if (experiment.status === "stopped")
    return ctx.global.log("Skip because stopped", {
      id: key3
    }), {
      result: getExperimentResult(ctx, experiment, -1, !1, featureId)
    };
  let result = getExperimentResult(ctx, experiment, assigned, !0, featureId, n6, foundStickyBucket);
  if (ctx.user.saveStickyBucketAssignmentDoc && !experiment.disableStickyBucketing) {
    let {
      changed,
      key: attrKey,
      doc: doc2
    } = generateStickyBucketAssignmentDoc(ctx, hashAttribute, toString7(hashValue), {
      [getStickyBucketExperimentKey(experiment.key, experiment.bucketVersion)]: result.key
    });
    if (changed)
      ctx.user.stickyBucketAssignmentDocs = ctx.user.stickyBucketAssignmentDocs || {}, ctx.user.stickyBucketAssignmentDocs[attrKey] = doc2, ctx.user.saveStickyBucketAssignmentDoc(doc2);
  }
  let trackingCalls = onExperimentViewed(ctx, experiment, result);
  if (trackingCalls.length === 0 && ctx.global.saveDeferredTrack)
    ctx.global.saveDeferredTrack({
      experiment,
      result
    });
  let trackingCall = !trackingCalls.length ? void 0 : trackingCalls.length === 1 ? trackingCalls[0] : Promise.all(trackingCalls).then(() => {});
  return "changeId" in experiment && experiment.changeId && ctx.global.recordChangeId && ctx.global.recordChangeId(experiment.changeId), ctx.global.log("In experiment", {
    id: key3,
    variation: result.variationId
  }), {
    result,
    trackingCall
  };
}
