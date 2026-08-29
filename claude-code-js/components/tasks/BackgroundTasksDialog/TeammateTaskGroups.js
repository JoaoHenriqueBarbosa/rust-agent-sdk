// function: TeammateTaskGroups
function TeammateTaskGroups(t0) {
  let $3 = import_compiler_runtime229.c(3), {
    teammateTasks,
    currentSelectionId
  } = t0, t1;
  if ($3[0] !== currentSelectionId || $3[1] !== teammateTasks) {
    let leaderItems = teammateTasks.filter(_temp140), teammateItems = teammateTasks.filter(_temp256), teams = /* @__PURE__ */ new Map;
    for (let item of teammateItems) {
      let teamName = item.task.identity.teamName, group = teams.get(teamName);
      if (group)
        group.push(item);
      else
        teams.set(teamName, [item]);
    }
    let teamEntries = [...teams.entries()];
    t1 = /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(jsx_dev_runtime289.Fragment, {
      children: teamEntries.map((t2) => {
        let [teamName_0, items] = t2, memberCount = items.length + leaderItems.length;
        return /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          children: [
            /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(ThemedText, {
              dimColor: !0,
              children: [
                "  ",
                "Team: ",
                teamName_0,
                " (",
                memberCount,
                ")"
              ]
            }, void 0, !0, void 0, this),
            leaderItems.map((item_0) => /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(Item, {
              item: item_0,
              isSelected: item_0.id === currentSelectionId
            }, `${item_0.id}-${teamName_0}`, !1, void 0, this)),
            items.map((item_1) => /* @__PURE__ */ jsx_dev_runtime289.jsxDEV(Item, {
              item: item_1,
              isSelected: item_1.id === currentSelectionId
            }, item_1.id, !1, void 0, this))
          ]
        }, teamName_0, !0, void 0, this);
      })
    }, void 0, !1, void 0, this), $3[0] = currentSelectionId, $3[1] = teammateTasks, $3[2] = t1;
  } else
    t1 = $3[2];
  return t1;
}
