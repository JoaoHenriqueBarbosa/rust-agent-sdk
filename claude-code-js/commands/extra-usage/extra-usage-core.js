// Original: src/commands/extra-usage/extra-usage-core.ts
async function runExtraUsage() {
  if (!getGlobalConfig().hasVisitedExtraUsage)
    saveGlobalConfig((prev) => ({ ...prev, hasVisitedExtraUsage: !0 }));
  invalidateOverageCreditGrantCache();
  let subscriptionType = getSubscriptionType(), isTeamOrEnterprise = subscriptionType === "team" || subscriptionType === "enterprise";
  if (!hasClaudeAiBillingAccess() && isTeamOrEnterprise) {
    let extraUsage;
    try {
      extraUsage = (await fetchUtilization())?.extra_usage;
    } catch (error44) {
      logError2(error44);
    }
    if (extraUsage?.is_enabled && extraUsage.monthly_limit === null)
      return {
        type: "message",
        value: "Your organization already has unlimited extra usage. No request needed."
      };
    try {
      if ((await checkAdminRequestEligibility("limit_increase"))?.is_allowed === !1)
        return {
          type: "message",
          value: "Please contact your admin to manage extra usage settings."
        };
    } catch (error44) {
      logError2(error44);
    }
    try {
      let pendingOrDismissedRequests = await getMyAdminRequests("limit_increase", ["pending", "dismissed"]);
      if (pendingOrDismissedRequests && pendingOrDismissedRequests.length > 0)
        return {
          type: "message",
          value: "You have already submitted a request for extra usage to your admin."
        };
    } catch (error44) {
      logError2(error44);
    }
    try {
      return await createAdminRequest({
        request_type: "limit_increase",
        details: null
      }), {
        type: "message",
        value: extraUsage?.is_enabled ? "Request sent to your admin to increase extra usage." : "Request sent to your admin to enable extra usage."
      };
    } catch (error44) {
      logError2(error44);
    }
    return {
      type: "message",
      value: "Please contact your admin to manage extra usage settings."
    };
  }
  let url3 = isTeamOrEnterprise ? "https://claude.ai/admin-settings/usage" : "https://claude.ai/settings/usage";
  try {
    let opened = await openBrowser(url3);
    return { type: "browser-opened", url: url3, opened };
  } catch (error44) {
    return logError2(error44), {
      type: "message",
      value: `Failed to open browser. Please visit ${url3} to manage extra usage.`
    };
  }
}
var init_extra_usage_core = __esm(() => {
  init_adminRequests();
  init_overageCreditGrant();
  init_usage();
  init_auth14();
  init_billing();
  init_browser();
  init_config4();
  init_log3();
});
