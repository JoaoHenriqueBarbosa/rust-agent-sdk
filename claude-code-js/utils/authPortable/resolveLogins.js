// function: resolveLogins
function resolveLogins(logins) {
  return Promise.all(Object.keys(logins).reduce((arr, name) => {
    let tokenOrProvider = logins[name];
    if (typeof tokenOrProvider === "string")
      arr.push([name, tokenOrProvider]);
    else
      arr.push(tokenOrProvider().then((token) => [name, token]));
    return arr;
  }, [])).then((resolvedPairs) => resolvedPairs.reduce((logins2, [key, value]) => {
    return logins2[key] = value, logins2;
  }, {}));
}
