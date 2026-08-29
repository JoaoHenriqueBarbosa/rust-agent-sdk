// function: getEnvironmentValue
function getEnvironmentValue(name3) {
  if (process.env[name3])
    return process.env[name3];
  else if (process.env[name3.toLowerCase()])
    return process.env[name3.toLowerCase()];
  return;
}
