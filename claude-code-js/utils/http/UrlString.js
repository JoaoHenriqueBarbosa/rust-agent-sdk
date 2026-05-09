// class: UrlString
class UrlString {
  get urlString() {
    return this._urlString;
  }
  constructor(url3) {
    if (this._urlString = url3, !this._urlString)
      throw createClientConfigurationError(urlEmptyError);
    if (!url3.includes("#"))
      this._urlString = UrlString.canonicalizeUri(url3);
  }
  static canonicalizeUri(url3) {
    if (url3) {
      let lowerCaseUrl = url3.toLowerCase();
      if (StringUtils.endsWith(lowerCaseUrl, "?"))
        lowerCaseUrl = lowerCaseUrl.slice(0, -1);
      else if (StringUtils.endsWith(lowerCaseUrl, "?/"))
        lowerCaseUrl = lowerCaseUrl.slice(0, -2);
      if (!StringUtils.endsWith(lowerCaseUrl, "/"))
        lowerCaseUrl += "/";
      return lowerCaseUrl;
    }
    return url3;
  }
  validateAsUri() {
    let components;
    try {
      components = this.getUrlComponents();
    } catch (e) {
      throw createClientConfigurationError(urlParseError);
    }
    if (!components.HostNameAndPort || !components.PathSegments)
      throw createClientConfigurationError(urlParseError);
    if (!components.Protocol || components.Protocol.toLowerCase() !== "https:")
      throw createClientConfigurationError(authorityUriInsecure);
  }
  static appendQueryString(url3, queryString) {
    if (!queryString)
      return url3;
    return url3.indexOf("?") < 0 ? `${url3}?${queryString}` : `${url3}&${queryString}`;
  }
  static removeHashFromUrl(url3) {
    return UrlString.canonicalizeUri(url3.split("#")[0]);
  }
  replaceTenantPath(tenantId) {
    let urlObject = this.getUrlComponents(), pathArray = urlObject.PathSegments;
    if (tenantId && pathArray.length !== 0 && (pathArray[0] === AADAuthority.COMMON || pathArray[0] === AADAuthority.ORGANIZATIONS))
      pathArray[0] = tenantId;
    return UrlString.constructAuthorityUriFromObject(urlObject);
  }
  getUrlComponents() {
    let regEx = RegExp("^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?"), match = this.urlString.match(regEx);
    if (!match)
      throw createClientConfigurationError(urlParseError);
    let urlComponents = {
      Protocol: match[1],
      HostNameAndPort: match[4],
      AbsolutePath: match[5],
      QueryString: match[7]
    }, pathSegments = urlComponents.AbsolutePath.split("/");
    if (pathSegments = pathSegments.filter((val) => val && val.length > 0), urlComponents.PathSegments = pathSegments, urlComponents.QueryString && urlComponents.QueryString.endsWith("/"))
      urlComponents.QueryString = urlComponents.QueryString.substring(0, urlComponents.QueryString.length - 1);
    return urlComponents;
  }
  static getDomainFromUrl(url3) {
    let regEx = RegExp("^([^:/?#]+://)?([^/?#]*)"), match = url3.match(regEx);
    if (!match)
      throw createClientConfigurationError(urlParseError);
    return match[2];
  }
  static getAbsoluteUrl(relativeUrl, baseUrl) {
    if (relativeUrl[0] === FORWARD_SLASH) {
      let baseComponents = new UrlString(baseUrl).getUrlComponents();
      return baseComponents.Protocol + "//" + baseComponents.HostNameAndPort + relativeUrl;
    }
    return relativeUrl;
  }
  static constructAuthorityUriFromObject(urlObject) {
    return new UrlString(urlObject.Protocol + "//" + urlObject.HostNameAndPort + "/" + urlObject.PathSegments.join("/"));
  }
}
