// function: shouldAttemptFallback
function shouldAttemptFallback(response7, pathname) {
  return !response7 || response7.status >= 400 && response7.status < 500 && pathname !== "/";
}
