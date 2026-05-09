// function: checkTenantId
function checkTenantId(logger14, tenantId) {
  if (!tenantId.match(/^[0-9a-zA-Z-.]+$/)) {
    let error43 = Error("Invalid tenant id provided. You can locate your tenant id by following the instructions listed here: https://learn.microsoft.com/partner-center/find-ids-and-domain-names.");
    throw logger14.info(formatError2("", error43)), error43;
  }
}
