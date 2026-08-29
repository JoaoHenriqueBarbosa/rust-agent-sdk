// var: getHttpAuthExtensionConfiguration
var getHttpAuthExtensionConfiguration = (runtimeConfig) => {
  let { httpAuthSchemes: _httpAuthSchemes, httpAuthSchemeProvider: _httpAuthSchemeProvider, credentials: _credentials, token: _token } = runtimeConfig;
  return {
    setHttpAuthScheme(httpAuthScheme) {
      let index = _httpAuthSchemes.findIndex((scheme) => scheme.schemeId === httpAuthScheme.schemeId);
      if (index === -1)
        _httpAuthSchemes.push(httpAuthScheme);
      else
        _httpAuthSchemes.splice(index, 1, httpAuthScheme);
    },
    httpAuthSchemes() {
      return _httpAuthSchemes;
    },
    setHttpAuthSchemeProvider(httpAuthSchemeProvider) {
      _httpAuthSchemeProvider = httpAuthSchemeProvider;
    },
    httpAuthSchemeProvider() {
      return _httpAuthSchemeProvider;
    },
    setCredentials(credentials) {
      _credentials = credentials;
    },
    credentials() {
      return _credentials;
    },
    setToken(token) {
      _token = token;
    },
    token() {
      return _token;
    }
  };
}, resolveHttpAuthRuntimeConfig = (config4) => {
  return {
    httpAuthSchemes: config4.httpAuthSchemes(),
    httpAuthSchemeProvider: config4.httpAuthSchemeProvider(),
    credentials: config4.credentials(),
    token: config4.token()
  };
};
