// function: generateAccountId
function generateAccountId(accountEntity) {
  return [
    accountEntity.homeAccountId,
    accountEntity.environment
  ].join(CACHE_KEY_SEPARATOR).toLowerCase();
}
