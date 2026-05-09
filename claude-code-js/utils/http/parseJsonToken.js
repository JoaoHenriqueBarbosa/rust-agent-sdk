// function: parseJsonToken
async function parseJsonToken(result) {
  let jsonRegex = /{[^{}]*}/g, matches = result.match(jsonRegex), resultWithoutToken = result;
  if (matches)
    try {
      for (let item of matches)
        try {
          let jsonContent = JSON.parse(item);
          if (jsonContent?.Token) {
            if (resultWithoutToken = resultWithoutToken.replace(item, ""), resultWithoutToken)
              logger25.getToken.warning(resultWithoutToken);
            return jsonContent;
          }
        } catch (e) {
          continue;
        }
    } catch (e) {
      throw Error(`Unable to parse the output of PowerShell. Received output: ${result}`);
    }
  throw Error(`No access token found in the output. Received output: ${result}`);
}
