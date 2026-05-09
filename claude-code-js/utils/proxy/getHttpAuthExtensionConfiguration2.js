// var: getHttpAuthExtensionConfiguration2
var getHttpAuthExtensionConfiguration2 = (runtimeConfig) => {
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
}, resolveHttpAuthRuntimeConfig2 = (config5) => {
  return {
    httpAuthSchemes: config5.httpAuthSchemes(),
    httpAuthSchemeProvider: config5.httpAuthSchemeProvider(),
    credentials: config5.credentials(),
    token: config5.token()
  };
};
