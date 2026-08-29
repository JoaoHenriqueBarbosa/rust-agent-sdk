// function: tlsPolicy
function tlsPolicy(tlsSettings) {
  return {
    name: "tlsPolicy",
    sendRequest: async (req, next) => {
      if (!req.tlsSettings)
        req.tlsSettings = tlsSettings;
      return next(req);
    }
  };
}
