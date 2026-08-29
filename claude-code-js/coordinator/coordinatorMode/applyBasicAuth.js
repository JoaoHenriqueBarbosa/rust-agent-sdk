// function: applyBasicAuth
function applyBasicAuth(clientId, clientSecret, headers) {
  if (!clientSecret)
    throw Error("client_secret_basic authentication requires a client_secret");
  let credentials = btoa(`${clientId}:${clientSecret}`);
  headers.set("Authorization", `Basic ${credentials}`);
}
