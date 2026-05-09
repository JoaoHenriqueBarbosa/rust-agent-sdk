// Original: src/components/LogoV2/feedConfigs.tsx
import { homedir as homedir32 } from "os";
function createRecentActivityFeed(activities) {
  let lines2 = activities.map((log3) => {
    let time3 = formatRelativeTimeAgo(log3.modified);
    return {
      text: (log3.summary && log3.summary !== "No prompt" ? log3.summary : log3.firstPrompt) || "",
      timestamp: time3
    };
  });
  return {
    title: "Recent activity",
    lines: lines2,
    footer: lines2.length > 0 ? "/resume for more" : void 0,
    emptyMessage: "No recent activity"
  };
}
function createWhatsNewFeed(releaseNotes2) {
  let lines2 = releaseNotes2.map((note) => {
    return {
      text: note
    };
  }), emptyMessage = "Check the Claude Code changelog for updates";
  return {
    title: "What's new",
    lines: lines2,
    footer: lines2.length > 0 ? "/release-notes for more" : void 0,
    emptyMessage: "Check the Claude Code changelog for updates"
  };
}
function createProjectOnboardingFeed(steps) {
  let lines2 = steps.filter(({
    isEnabled: isEnabled2
  }) => isEnabled2).sort((a2, b) => Number(a2.isComplete) - Number(b.isComplete)).map(({
    text: text2,
    isComplete
  }) => {
    return {
      text: `${isComplete ? `${figures_default.tick} ` : ""}${text2}`
    };
  }), warningText = getCwd() === homedir32() ? "Note: You have launched claude in your home directory. For the best experience, launch it in a project directory instead." : void 0;
  if (warningText)
    lines2.push({
      text: warningText
    });
  return {
    title: "Tips for getting started",
    lines: lines2
  };
}
function createGuestPassesFeed() {
  let reward = getCachedReferrerReward(), subtitle = reward ? `Share Claude Code and earn ${formatCreditAmount(reward)} of extra usage` : "Share Claude Code with friends";
  return {
    title: "3 guest passes",
    lines: [],
    customContent: {
      content: /* @__PURE__ */ jsx_dev_runtime250.jsxDEV(jsx_dev_runtime250.Fragment, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime250.jsxDEV(ThemedBox_default, {
            marginY: 1,
            children: /* @__PURE__ */ jsx_dev_runtime250.jsxDEV(ThemedText, {
              color: "claude",
              children: "[\u273B] [\u273B] [\u273B]"
            }, void 0, !1, void 0, this)
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime250.jsxDEV(ThemedText, {
            dimColor: !0,
            children: subtitle
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this),
      width: 48
    },
    footer: "/passes"
  };
}
var jsx_dev_runtime250;
var init_feedConfigs = __esm(() => {
  init_figures();
  init_ink2();
  init_referral();
  init_cwd2();
  init_format();
  jsx_dev_runtime250 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
