// Original: src/utils/logoV2Utils.ts
function getLayoutMode(columns) {
  if (columns >= 70)
    return "horizontal";
  return "compact";
}
function calculateLayoutDimensions(columns, layoutMode, optimalLeftWidth) {
  if (layoutMode === "horizontal") {
    let leftWidth = optimalLeftWidth, usedSpace = BORDER_PADDING + CONTENT_PADDING + DIVIDER_WIDTH + leftWidth, availableForRight = columns - usedSpace, rightWidth = Math.max(30, availableForRight), totalWidth2 = Math.min(leftWidth + rightWidth + DIVIDER_WIDTH + CONTENT_PADDING, columns - BORDER_PADDING);
    if (totalWidth2 < leftWidth + rightWidth + DIVIDER_WIDTH + CONTENT_PADDING)
      rightWidth = totalWidth2 - leftWidth - DIVIDER_WIDTH - CONTENT_PADDING;
    return { leftWidth, rightWidth, totalWidth: totalWidth2 };
  }
  let totalWidth = Math.min(columns - BORDER_PADDING, MAX_LEFT_WIDTH + 20);
  return {
    leftWidth: totalWidth,
    rightWidth: totalWidth,
    totalWidth
  };
}
function calculateOptimalLeftWidth(welcomeMessage, truncatedCwd, modelLine) {
  let contentWidth = Math.max(stringWidth(welcomeMessage), stringWidth(truncatedCwd), stringWidth(modelLine), 20);
  return Math.min(contentWidth + 4, MAX_LEFT_WIDTH);
}
function formatWelcomeMessage(username) {
  if (!username || username.length > MAX_USERNAME_LENGTH)
    return "Welcome back!";
  return `Welcome back ${username}!`;
}
function truncatePath(path25, maxLength) {
  if (stringWidth(path25) <= maxLength)
    return path25;
  let separator = "/", ellipsis = "\u2026", ellipsisWidth = 1, separatorWidth = 1, parts = path25.split(separator), first = parts[0] || "", last2 = parts[parts.length - 1] || "", firstWidth = stringWidth(first), lastWidth = stringWidth(last2);
  if (parts.length === 1)
    return truncateToWidth(path25, maxLength);
  if (first === "" && ellipsisWidth + separatorWidth + lastWidth >= maxLength)
    return `${separator}${truncateToWidth(last2, Math.max(1, maxLength - separatorWidth))}`;
  if (first !== "" && ellipsisWidth * 2 + separatorWidth + lastWidth >= maxLength)
    return `${ellipsis}${separator}${truncateToWidth(last2, Math.max(1, maxLength - ellipsisWidth - separatorWidth))}`;
  if (parts.length === 2) {
    let availableForFirst = maxLength - ellipsisWidth - separatorWidth - lastWidth;
    return `${truncateToWidthNoEllipsis(first, availableForFirst)}${ellipsis}${separator}${last2}`;
  }
  let available = maxLength - firstWidth - lastWidth - ellipsisWidth - 2 * separatorWidth;
  if (available <= 0) {
    let availableForFirst = Math.max(0, maxLength - lastWidth - ellipsisWidth - 2 * separatorWidth);
    return `${truncateToWidthNoEllipsis(first, availableForFirst)}${separator}${ellipsis}${separator}${last2}`;
  }
  let middleParts = [];
  for (let i5 = parts.length - 2;i5 > 0; i5--) {
    let part = parts[i5];
    if (part && stringWidth(part) + separatorWidth <= available)
      middleParts.unshift(part), available -= stringWidth(part) + separatorWidth;
    else
      break;
  }
  if (middleParts.length === 0)
    return `${first}${separator}${ellipsis}${separator}${last2}`;
  return `${first}${separator}${ellipsis}${separator}${middleParts.join(separator)}${separator}${last2}`;
}
async function getRecentActivity() {
  if (cachePromise)
    return cachePromise;
  let currentSessionId = getSessionId();
  return cachePromise = loadMessageLogs(10).then((logs2) => {
    return cachedActivity = logs2.filter((log3) => {
      if (log3.isSidechain)
        return !1;
      if (log3.sessionId === currentSessionId)
        return !1;
      if (log3.summary?.includes("I apologize"))
        return !1;
      let hasSummary = log3.summary && log3.summary !== "No prompt", hasFirstPrompt = log3.firstPrompt && log3.firstPrompt !== "No prompt";
      return hasSummary || hasFirstPrompt;
    }).slice(0, 3), cachedActivity;
  }).catch(() => {
    return cachedActivity = [], cachedActivity;
  }), cachePromise;
}
function getRecentActivitySync() {
  return cachedActivity;
}
function getLogoDisplayData() {
  let version5 = process.env.DEMO_VERSION ?? "2.1.90", serverUrl = getDirectConnectServerUrl(), displayPath = process.env.DEMO_VERSION ? "/code/claude" : getDisplayPath(getCwd()), cwd2 = serverUrl ? `${displayPath} in ${serverUrl.replace(/^https?:\/\//, "")}` : displayPath, billingType = isClaudeAISubscriber() ? getSubscriptionName() : "API Usage Billing", agentName = getInitialSettings().agent;
  return {
    version: version5,
    cwd: cwd2,
    billingType,
    agentName
  };
}
function formatModelAndBilling(modelName, billingType, availableWidth) {
  if (stringWidth(modelName) + 3 + stringWidth(billingType) > availableWidth)
    return {
      shouldSplit: !0,
      truncatedModel: truncate(modelName, availableWidth),
      truncatedBilling: truncate(billingType, availableWidth)
    };
  return {
    shouldSplit: !1,
    truncatedModel: truncate(modelName, Math.max(availableWidth - stringWidth(billingType) - 3, 10)),
    truncatedBilling: billingType
  };
}
function getRecentReleaseNotesSync(maxItems) {
  let changelog = getStoredChangelogFromMemory();
  if (!changelog)
    return [];
  let parsed;
  try {
    parsed = parseChangelog(changelog);
  } catch {
    return [];
  }
  let allNotes = [], versions2 = Object.keys(parsed).sort((a2, b) => gt(a2, b) ? -1 : 1).slice(0, 3);
  for (let version5 of versions2) {
    let notes = parsed[version5];
    if (notes)
      allNotes.push(...notes);
  }
  return allNotes.slice(0, maxItems);
}
var MAX_LEFT_WIDTH = 50, MAX_USERNAME_LENGTH = 20, BORDER_PADDING = 4, DIVIDER_WIDTH = 1, CONTENT_PADDING = 2, cachedActivity, cachePromise = null;
var init_logoV2Utils = __esm(() => {
  init_state();
  init_stringWidth();
  init_auth14();
  init_cwd2();
  init_file();
  init_format();
  init_releaseNotes();
  init_sessionStorage();
  init_settings2();
  cachedActivity = [];
});
