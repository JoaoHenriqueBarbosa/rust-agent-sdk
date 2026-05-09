// Original: src/services/api/overageCreditGrant.ts
async function fetchOverageCreditGrant() {
  try {
    let { accessToken, orgUUID } = await prepareApiRequest(), url3 = `${getOauthConfig().BASE_API_URL}/api/oauth/organizations/${orgUUID}/overage_credit_grant`;
    return (await axios_default.get(url3, {
      headers: getOAuthHeaders(accessToken)
    })).data;
  } catch (err2) {
    return logError2(err2), null;
  }
}
function getCachedOverageCreditGrant() {
  let orgId = getOauthAccountInfo()?.organizationUuid;
  if (!orgId)
    return null;
  let cached3 = getGlobalConfig().overageCreditGrantCache?.[orgId];
  if (!cached3)
    return null;
  if (Date.now() - cached3.timestamp > CACHE_TTL_MS)
    return null;
  return cached3.info;
}
function invalidateOverageCreditGrantCache() {
  let orgId = getOauthAccountInfo()?.organizationUuid;
  if (!orgId)
    return;
  let cache5 = getGlobalConfig().overageCreditGrantCache;
  if (!cache5 || !(orgId in cache5))
    return;
  saveGlobalConfig((prev) => {
    let next = { ...prev.overageCreditGrantCache };
    return delete next[orgId], { ...prev, overageCreditGrantCache: next };
  });
}
async function refreshOverageCreditGrantCache() {
  if (isEssentialTrafficOnly())
    return;
  let orgId = getOauthAccountInfo()?.organizationUuid;
  if (!orgId)
    return;
  let info = await fetchOverageCreditGrant();
  if (!info)
    return;
  saveGlobalConfig((prev) => {
    let prevCached = prev.overageCreditGrantCache?.[orgId], existing = prevCached?.info, dataUnchanged = existing && existing.available === info.available && existing.eligible === info.eligible && existing.granted === info.granted && existing.amount_minor_units === info.amount_minor_units && existing.currency === info.currency;
    if (dataUnchanged && prevCached && Date.now() - prevCached.timestamp <= CACHE_TTL_MS)
      return prev;
    let entry = {
      info: dataUnchanged ? existing : info,
      timestamp: Date.now()
    };
    return {
      ...prev,
      overageCreditGrantCache: {
        ...prev.overageCreditGrantCache,
        [orgId]: entry
      }
    };
  });
}
function formatGrantAmount(info) {
  if (info.amount_minor_units == null || !info.currency)
    return null;
  if (info.currency.toUpperCase() === "USD") {
    let dollars = info.amount_minor_units / 100;
    return Number.isInteger(dollars) ? `$${dollars}` : `$${dollars.toFixed(2)}`;
  }
  return null;
}
var CACHE_TTL_MS = 3600000;
var init_overageCreditGrant = __esm(() => {
  init_axios2();
  init_oauth();
  init_auth14();
  init_config4();
  init_log3();
  init_api2();
});
