// function: dispatchBeforeRedirect
function dispatchBeforeRedirect(options, responseDetails) {
  if (options.beforeRedirects.proxy)
    options.beforeRedirects.proxy(options);
  if (options.beforeRedirects.config)
    options.beforeRedirects.config(options, responseDetails);
}
