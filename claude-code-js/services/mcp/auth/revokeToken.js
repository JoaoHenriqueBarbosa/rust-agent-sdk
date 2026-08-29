// function: revokeToken
async function revokeToken({
  serverName,
  endpoint: endpoint7,
  token,
  tokenTypeHint,
  clientId,
  clientSecret,
  accessToken,
  authMethod = "client_secret_basic"
}) {
  let params = new URLSearchParams;
  params.set("token", token), params.set("token_type_hint", tokenTypeHint);
  let headers = {
    "Content-Type": "application/x-www-form-urlencoded"
  };
  if (clientId && clientSecret)
    if (authMethod === "client_secret_post")
      params.set("client_id", clientId), params.set("client_secret", clientSecret);
    else {
      let basic = Buffer.from(`${encodeURIComponent(clientId)}:${encodeURIComponent(clientSecret)}`).toString("base64");
      headers.Authorization = `Basic ${basic}`;
    }
  else if (clientId)
    params.set("client_id", clientId);
  else
    logMCPDebug(serverName, `No client_id available for ${tokenTypeHint} revocation - server may reject`);
  try {
    await axios_default.post(endpoint7, params, { headers }), logMCPDebug(serverName, `Successfully revoked ${tokenTypeHint}`);
  } catch (error44) {
    if (axios_default.isAxiosError(error44) && error44.response?.status === 401 && accessToken)
      logMCPDebug(serverName, `Got 401, retrying ${tokenTypeHint} revocation with Bearer auth`), params.delete("client_id"), params.delete("client_secret"), await axios_default.post(endpoint7, params, {
        headers: { ...headers, Authorization: `Bearer ${accessToken}` }
      }), logMCPDebug(serverName, `Successfully revoked ${tokenTypeHint} with Bearer auth`);
    else
      throw error44;
  }
}
