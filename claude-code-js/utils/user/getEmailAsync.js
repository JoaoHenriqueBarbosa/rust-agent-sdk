// function: getEmailAsync
async function getEmailAsync() {
  let oauthAccount = getOauthAccountInfo();
  if (oauthAccount?.emailAddress)
    return oauthAccount.emailAddress;
  return;
}
