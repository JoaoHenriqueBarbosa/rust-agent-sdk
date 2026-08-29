// Original: src/services/api/adminRequests.ts
async function createAdminRequest(params) {
  let { accessToken, orgUUID } = await prepareApiRequest(), headers = {
    ...getOAuthHeaders(accessToken),
    "x-organization-uuid": orgUUID
  }, url3 = `${getOauthConfig().BASE_API_URL}/api/oauth/organizations/${orgUUID}/admin_requests`;
  return (await axios_default.post(url3, params, { headers })).data;
}
async function getMyAdminRequests(requestType, statuses) {
  let { accessToken, orgUUID } = await prepareApiRequest(), headers = {
    ...getOAuthHeaders(accessToken),
    "x-organization-uuid": orgUUID
  }, url3 = `${getOauthConfig().BASE_API_URL}/api/oauth/organizations/${orgUUID}/admin_requests/me?request_type=${requestType}`;
  for (let status of statuses)
    url3 += `&statuses=${status}`;
  return (await axios_default.get(url3, {
    headers
  })).data;
}
async function checkAdminRequestEligibility(requestType) {
  let { accessToken, orgUUID } = await prepareApiRequest(), headers = {
    ...getOAuthHeaders(accessToken),
    "x-organization-uuid": orgUUID
  }, url3 = `${getOauthConfig().BASE_API_URL}/api/oauth/organizations/${orgUUID}/admin_requests/eligibility?request_type=${requestType}`;
  return (await axios_default.get(url3, {
    headers
  })).data;
}
var init_adminRequests = __esm(() => {
  init_axios2();
  init_oauth();
  init_api2();
});
