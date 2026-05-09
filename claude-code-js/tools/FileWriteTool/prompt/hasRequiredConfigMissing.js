// function: hasRequiredConfigMissing
function hasRequiredConfigMissing({ manifest, userConfig }) {
  if (!manifest.user_config)
    return !1;
  let config9 = userConfig || {};
  for (let [key2, configOption] of Object.entries(manifest.user_config))
    if (configOption.required) {
      let value = config9[key2];
      if (isInvalidSingleValue(value) || Array.isArray(value) && (value.length === 0 || value.some(isInvalidSingleValue)))
        return !0;
    }
  return !1;
}
