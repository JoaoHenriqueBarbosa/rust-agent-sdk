// function: handleOidcResponse
function handleOidcResponse(response7) {
  let text = response7.bodyAsText;
  if (!text)
    throw logger31.error(`${credentialName4}: Authentication Failed. Received null token from OIDC request. Response status- ${response7.status}. Complete response - ${JSON.stringify(response7)}`), new AuthenticationError2(response7.status, {
      error: `${credentialName4}: Authentication Failed. Received null token from OIDC request.`,
      error_description: `${JSON.stringify(response7)}. See the troubleshooting guide for more information: https://aka.ms/azsdk/js/identity/azurepipelinescredential/troubleshoot`
    });
  try {
    let result = JSON.parse(text);
    if (result?.oidcToken)
      return result.oidcToken;
    else {
      let errorMessage2 = `${credentialName4}: Authentication Failed. oidcToken field not detected in the response.`, errorDescription = "";
      if (response7.status !== 200)
        errorDescription = `Response body = ${text}. Response Headers ["x-vss-e2eid"] = ${response7.headers.get("x-vss-e2eid")} and ["x-msedge-ref"] = ${response7.headers.get("x-msedge-ref")}. See the troubleshooting guide for more information: https://aka.ms/azsdk/js/identity/azurepipelinescredential/troubleshoot`;
      throw logger31.error(errorMessage2), logger31.error(errorDescription), new AuthenticationError2(response7.status, {
        error: errorMessage2,
        error_description: errorDescription
      });
    }
  } catch (e) {
    let errorDetails = `${credentialName4}: Authentication Failed. oidcToken field not detected in the response.`;
    throw logger31.error(`Response from service = ${text}, Response Headers ["x-vss-e2eid"] = ${response7.headers.get("x-vss-e2eid")} 
      and ["x-msedge-ref"] = ${response7.headers.get("x-msedge-ref")}, error message = ${e.message}`), logger31.error(errorDetails), new AuthenticationError2(response7.status, {
      error: errorDetails,
      error_description: `Response = ${text}. Response headers ["x-vss-e2eid"] = ${response7.headers.get("x-vss-e2eid")} and ["x-msedge-ref"] =  ${response7.headers.get("x-msedge-ref")}. See the troubleshooting guide for more information: https://aka.ms/azsdk/js/identity/azurepipelinescredential/troubleshoot`
    });
  }
}
