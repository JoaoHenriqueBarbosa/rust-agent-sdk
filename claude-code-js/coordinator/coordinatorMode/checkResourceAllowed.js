// function: checkResourceAllowed
function checkResourceAllowed({ requestedResource, configuredResource }) {
  let requested = typeof requestedResource === "string" ? new URL(requestedResource) : new URL(requestedResource.href), configured = typeof configuredResource === "string" ? new URL(configuredResource) : new URL(configuredResource.href);
  if (requested.origin !== configured.origin)
    return !1;
  if (requested.pathname.length < configured.pathname.length)
    return !1;
  let requestedPath = requested.pathname.endsWith("/") ? requested.pathname : requested.pathname + "/", configuredPath = configured.pathname.endsWith("/") ? configured.pathname : configured.pathname + "/";
  return requestedPath.startsWith(configuredPath);
}
