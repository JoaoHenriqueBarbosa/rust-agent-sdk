// function: isTokenExpired
function isTokenExpired(expiresOn, offset) {
  let expirationSec = Number(expiresOn) || 0;
  return nowSeconds() + offset > expirationSec;
}
