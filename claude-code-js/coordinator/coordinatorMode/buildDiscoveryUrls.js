// function: buildDiscoveryUrls
function buildDiscoveryUrls(authorizationServerUrl) {
  let url3 = typeof authorizationServerUrl === "string" ? new URL(authorizationServerUrl) : authorizationServerUrl, hasPath2 = url3.pathname !== "/", urlsToTry = [];
  if (!hasPath2)
    return urlsToTry.push({
      url: new URL("/.well-known/oauth-authorization-server", url3.origin),
      type: "oauth"
    }), urlsToTry.push({
      url: new URL("/.well-known/openid-configuration", url3.origin),
      type: "oidc"
    }), urlsToTry;
  let pathname = url3.pathname;
  if (pathname.endsWith("/"))
    pathname = pathname.slice(0, -1);
  return urlsToTry.push({
    url: new URL(`/.well-known/oauth-authorization-server${pathname}`, url3.origin),
    type: "oauth"
  }), urlsToTry.push({
    url: new URL(`/.well-known/openid-configuration${pathname}`, url3.origin),
    type: "oidc"
  }), urlsToTry.push({
    url: new URL(`${pathname}/.well-known/openid-configuration`, url3.origin),
    type: "oidc"
  }), urlsToTry;
}
