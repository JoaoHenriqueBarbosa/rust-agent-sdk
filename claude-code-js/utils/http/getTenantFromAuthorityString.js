// function: getTenantFromAuthorityString
function getTenantFromAuthorityString(authority) {
  let tenantId = new UrlString(authority).getUrlComponents().PathSegments.slice(-1)[0]?.toLowerCase();
  switch (tenantId) {
    case AADAuthority.COMMON:
    case AADAuthority.ORGANIZATIONS:
    case AADAuthority.CONSUMERS:
      return;
    default:
      return tenantId;
  }
}
