// function: deserializeAuthenticationRecord
function deserializeAuthenticationRecord(serializedRecord) {
  let parsed = JSON.parse(serializedRecord);
  if (parsed.version && parsed.version !== LatestAuthenticationRecordVersion)
    throw Error("Unsupported AuthenticationRecord version");
  return parsed;
}
