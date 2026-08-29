// function: handleOAuth401Error
function handleOAuth401Error(failedAccessToken) {
  let pending = pending401Handlers.get(failedAccessToken);
  if (pending)
    return pending;
  let promise2 = handleOAuth401ErrorImpl(failedAccessToken).finally(() => {
    pending401Handlers.delete(failedAccessToken);
  });
  return pending401Handlers.set(failedAccessToken, promise2), promise2;
}
