// function: createAllTimeStatsPromise
function createAllTimeStatsPromise() {
  return aggregateClaudeCodeStatsForRange("all").then((data) => {
    if (!data || data.totalSessions === 0)
      return {
        type: "empty"
      };
    return {
      type: "success",
      data
    };
  }).catch((err2) => {
    return {
      type: "error",
      message: err2 instanceof Error ? err2.message : "Failed to load stats"
    };
  });
}
