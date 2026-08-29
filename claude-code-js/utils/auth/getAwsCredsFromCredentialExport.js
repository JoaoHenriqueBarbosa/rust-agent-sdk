// function: getAwsCredsFromCredentialExport
async function getAwsCredsFromCredentialExport() {
  let awsCredentialExport = getConfiguredAwsCredentialExport();
  if (!awsCredentialExport)
    return null;
  if (isAwsCredentialExportFromProjectSettings()) {
    if (!checkHasTrustDialogAccepted() && !getIsNonInteractiveSession()) {
      let error44 = Error("Security: awsCredentialExport executed before workspace trust is confirmed. If you see this message, post in https://github.com/anthropics/claude-code/issues.");
      return logAntError("awsCredentialExport invoked before trust check", error44), logEvent("tengu_awsCredentialExport_missing_trust", {}), null;
    }
  }
  try {
    return logForDebugging("Fetching AWS caller identity for credential export command"), await checkStsCallerIdentity(), logForDebugging("Fetched AWS caller identity, skipping AWS credential export command"), null;
  } catch {
    try {
      logForDebugging("Running AWS credential export command");
      let result = await execa(awsCredentialExport, {
        shell: !0,
        reject: !1
      });
      if (result.exitCode !== 0 || !result.stdout)
        throw Error("awsCredentialExport did not return a valid value");
      let awsOutput = jsonParse(result.stdout.trim());
      if (!isValidAwsStsOutput(awsOutput))
        throw Error("awsCredentialExport did not return valid AWS STS output structure");
      return logForDebugging("AWS credentials retrieved from awsCredentialExport"), {
        accessKeyId: awsOutput.Credentials.AccessKeyId,
        secretAccessKey: awsOutput.Credentials.SecretAccessKey,
        sessionToken: awsOutput.Credentials.SessionToken
      };
    } catch (e) {
      let message = source_default.red("Error getting AWS credentials from awsCredentialExport (in settings or ~/.claude.json):");
      if (e instanceof Error)
        console.error(message, e.message);
      else
        console.error(message, e);
      return null;
    }
  }
}
