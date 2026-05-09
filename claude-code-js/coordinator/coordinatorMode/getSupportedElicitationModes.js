// function: getSupportedElicitationModes
function getSupportedElicitationModes(capabilities) {
  if (!capabilities)
    return { supportsFormMode: !1, supportsUrlMode: !1 };
  let hasFormCapability = capabilities.form !== void 0, hasUrlCapability = capabilities.url !== void 0;
  return { supportsFormMode: hasFormCapability || !hasFormCapability && !hasUrlCapability, supportsUrlMode: hasUrlCapability };
}
