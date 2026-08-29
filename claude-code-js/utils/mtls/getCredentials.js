// function: getCredentials
async function getCredentials(response2, logger2) {
  let str = await import_util_stream.sdkStreamMixin(response2.body).transformToString();
  if (response2.statusCode === 200) {
    let parsed = JSON.parse(str);
    if (typeof parsed.AccessKeyId !== "string" || typeof parsed.SecretAccessKey !== "string" || typeof parsed.Token !== "string" || typeof parsed.Expiration !== "string")
      throw new import_property_provider7.CredentialsProviderError("HTTP credential provider response not of the required format, an object matching: { AccessKeyId: string, SecretAccessKey: string, Token: string, Expiration: string(rfc3339) }", { logger: logger2 });
    return {
      accessKeyId: parsed.AccessKeyId,
      secretAccessKey: parsed.SecretAccessKey,
      sessionToken: parsed.Token,
      expiration: exports_dist_es3.parseRfc3339DateTime(parsed.Expiration)
    };
  }
  if (response2.statusCode >= 400 && response2.statusCode < 500) {
    let parsedBody = {};
    try {
      parsedBody = JSON.parse(str);
    } catch (e) {}
    throw Object.assign(new import_property_provider7.CredentialsProviderError(`Server responded with status: ${response2.statusCode}`, { logger: logger2 }), {
      Code: parsedBody.Code,
      Message: parsedBody.Message
    });
  }
  throw new import_property_provider7.CredentialsProviderError(`Server responded with status: ${response2.statusCode}`, { logger: logger2 });
}
