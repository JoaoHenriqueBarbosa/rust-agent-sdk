// function: auth13
async function auth13(provider5, options2) {
  try {
    return await authInternal(provider5, options2);
  } catch (error44) {
    if (error44 instanceof InvalidClientError || error44 instanceof UnauthorizedClientError)
      return await provider5.invalidateCredentials?.("all"), await authInternal(provider5, options2);
    else if (error44 instanceof InvalidGrantError)
      return await provider5.invalidateCredentials?.("tokens"), await authInternal(provider5, options2);
    throw error44;
  }
}
