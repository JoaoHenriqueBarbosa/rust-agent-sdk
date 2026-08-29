// function: getEmail
function getEmail() {
  if (cachedEmail !== null)
    return cachedEmail;
  let oauthAccount = getOauthAccountInfo();
  if (oauthAccount?.emailAddress)
    return oauthAccount.emailAddress;
  return;
}
