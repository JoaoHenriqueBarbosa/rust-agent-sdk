// function: getKey
function getKey(instance) {
  let [apiHost, clientKey] = instance.getApiInfo();
  return `${apiHost}||${clientKey}`;
}
