// function: applyClientAuthentication
function applyClientAuthentication(method, clientInformation, headers, params) {
  let { client_id, client_secret } = clientInformation;
  switch (method) {
    case "client_secret_basic":
      applyBasicAuth(client_id, client_secret, headers);
      return;
    case "client_secret_post":
      applyPostAuth(client_id, client_secret, params);
      return;
    case "none":
      applyPublicAuth(client_id, params);
      return;
    default:
      throw Error(`Unsupported client authentication method: ${method}`);
  }
}
