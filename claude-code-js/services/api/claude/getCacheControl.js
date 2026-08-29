// function: getCacheControl
function getCacheControl({
  scope,
  querySource
} = {}) {
  return {
    type: "ephemeral",
    ...should1hCacheTTL(querySource) && { ttl: "1h" },
    ...scope === "global" && { scope }
  };
}
