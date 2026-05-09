// function: filterMcpServersByPolicy
function filterMcpServersByPolicy(configs) {
  let allowed = {}, blocked = [];
  for (let [name3, config10] of Object.entries(configs)) {
    let c3 = config10;
    if (c3.type === "sdk" || isMcpServerAllowedByPolicy(name3, c3))
      allowed[name3] = config10;
    else
      blocked.push(name3);
  }
  return { allowed, blocked };
}
