// Original: src/utils/model/modelStrings.ts
function getBuiltinModelStrings(provider3) {
  let out = {};
  for (let key of MODEL_KEYS)
    out[key] = ALL_MODEL_CONFIGS[key][provider3];
  return out;
}
async function getBedrockModelStrings() {
  let fallback = getBuiltinModelStrings("bedrock"), profiles;
  try {
    profiles = await getBedrockInferenceProfiles();
  } catch (error41) {
    return logError2(error41), fallback;
  }
  if (!profiles?.length)
    return fallback;
  let out = {};
  for (let key of MODEL_KEYS) {
    let needle = ALL_MODEL_CONFIGS[key].firstParty;
    out[key] = findFirstMatch(profiles, needle) || fallback[key];
  }
  return out;
}
function applyModelOverrides(ms) {
  let overrides = getInitialSettings().modelOverrides;
  if (!overrides)
    return ms;
  let out = { ...ms };
  for (let [canonicalId, override] of Object.entries(overrides)) {
    let key = CANONICAL_ID_TO_KEY[canonicalId];
    if (key && override)
      out[key] = override;
  }
  return out;
}
function resolveOverriddenModel(modelId) {
  let overrides;
  try {
    overrides = getInitialSettings().modelOverrides;
  } catch {
    return modelId;
  }
  if (!overrides)
    return modelId;
  for (let [canonicalId, override] of Object.entries(overrides))
    if (override === modelId)
      return canonicalId;
  return modelId;
}
function initModelStrings() {
  if (getModelStrings() !== null)
    return;
  if (getAPIProvider() !== "bedrock") {
    setModelStrings(getBuiltinModelStrings(getAPIProvider()));
    return;
  }
  updateBedrockModelStrings();
}
function getModelStrings2() {
  let ms = getModelStrings();
  if (ms === null)
    return initModelStrings(), applyModelOverrides(getBuiltinModelStrings(getAPIProvider()));
  return applyModelOverrides(ms);
}
async function ensureModelStringsInitialized() {
  if (getModelStrings() !== null)
    return;
  if (getAPIProvider() !== "bedrock") {
    setModelStrings(getBuiltinModelStrings(getAPIProvider()));
    return;
  }
  await updateBedrockModelStrings();
}
var MODEL_KEYS, updateBedrockModelStrings;
var init_modelStrings = __esm(() => {
  init_state();
  init_log3();
  init_settings2();
  init_bedrock();
  init_configs();
  init_providers();
  MODEL_KEYS = Object.keys(ALL_MODEL_CONFIGS);
  updateBedrockModelStrings = sequential(async () => {
    if (getModelStrings() !== null)
      return;
    try {
      let ms = await getBedrockModelStrings();
      setModelStrings(ms);
    } catch (error41) {
      logError2(error41);
    }
  });
});

// node_modules/lodash-es/_baseSet.js
function baseSet(object2, path9, value, customizer) {
  if (!isObject_default(object2))
    return object2;
  path9 = _castPath_default(path9, object2);
  var index = -1, length = path9.length, lastIndex = length - 1, nested = object2;
  while (nested != null && ++index < length) {
    var key = _toKey_default(path9[index]), newValue = value;
    if (key === "__proto__" || key === "constructor" || key === "prototype")
      return object2;
    if (index != lastIndex) {
      var objValue = nested[key];
      if (newValue = customizer ? customizer(objValue, key, nested) : void 0, newValue === void 0)
        newValue = isObject_default(objValue) ? objValue : _isIndex_default(path9[index + 1]) ? [] : {};
    }
    _assignValue_default(nested, key, newValue), nested = nested[key];
  }
  return object2;
}
var _baseSet_default;
var init__baseSet = __esm(() => {
  init__assignValue();
  init__castPath();
  init__isIndex();
  init_isObject();
  init__toKey();
  _baseSet_default = baseSet;
});

// node_modules/lodash-es/_basePickBy.js
function basePickBy(object2, paths2, predicate) {
  var index = -1, length = paths2.length, result = {};
  while (++index < length) {
    var path9 = paths2[index], value = _baseGet_default(object2, path9);
    if (predicate(value, path9))
      _baseSet_default(result, _castPath_default(path9, object2), value);
  }
  return result;
}
var _basePickBy_default;
var init__basePickBy = __esm(() => {
  init__baseGet();
  init__baseSet();
  init__castPath();
  _basePickBy_default = basePickBy;
});

// node_modules/lodash-es/pickBy.js
function pickBy(object2, predicate) {
  if (object2 == null)
    return {};
  var props = _arrayMap_default(_getAllKeysIn_default(object2), function(prop) {
    return [prop];
  });
  return predicate = _baseIteratee_default(predicate), _basePickBy_default(object2, props, function(value, path9) {
    return predicate(value, path9[0]);
  });
}
var pickBy_default;
var init_pickBy = __esm(() => {
  init__arrayMap();
  init__baseIteratee();
  init__basePickBy();
  init__getAllKeysIn();
  pickBy_default = pickBy;
});
