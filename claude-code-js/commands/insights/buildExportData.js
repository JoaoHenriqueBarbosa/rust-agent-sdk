// function: buildExportData
function buildExportData(data, insights, facets, remoteStats) {
  let version6 = typeof MACRO < "u" ? "2.1.90" : "unknown", remote_hosts_collected = remoteStats?.hosts.filter((h4) => h4.sessionCount > 0).map((h4) => h4.name), facets_summary = {
    total: facets.size,
    goal_categories: {},
    outcomes: {},
    satisfaction: {},
    friction: {}
  };
  for (let f of facets.values()) {
    for (let [cat, count4] of safeEntries(f.goal_categories))
      if (count4 > 0)
        facets_summary.goal_categories[cat] = (facets_summary.goal_categories[cat] || 0) + count4;
    facets_summary.outcomes[f.outcome] = (facets_summary.outcomes[f.outcome] || 0) + 1;
    for (let [level, count4] of safeEntries(f.user_satisfaction_counts))
      if (count4 > 0)
        facets_summary.satisfaction[level] = (facets_summary.satisfaction[level] || 0) + count4;
    for (let [type, count4] of safeEntries(f.friction_counts))
      if (count4 > 0)
        facets_summary.friction[type] = (facets_summary.friction[type] || 0) + count4;
  }
  return {
    metadata: {
      username: process.env.SAFEUSER || process.env.USER || "unknown",
      generated_at: (/* @__PURE__ */ new Date()).toISOString(),
      claude_code_version: version6,
      date_range: data.date_range,
      session_count: data.total_sessions,
      ...remote_hosts_collected && remote_hosts_collected.length > 0 && {
        remote_hosts_collected
      }
    },
    aggregated_data: data,
    insights,
    facets_summary
  };
}
