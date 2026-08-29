// function: createGitHubIssueUrl
function createGitHubIssueUrl(feedbackId, title, description, errors8) {
  let sanitizedTitle = redactSensitiveInfo(title), bodyPrefix = `**Bug Description**
${redactSensitiveInfo(description)}

**Environment Info**
- Platform: ${env3.platform}
- Terminal: ${env3.terminal}
- Version: 2.1.90
- Feedback ID: ${feedbackId}

**Errors**
\`\`\`json
`, errorSuffix = "\n```\n", errorsJson = jsonStringify(errors8), baseUrl = `${GITHUB_ISSUES_REPO_URL}/new?title=${encodeURIComponent(sanitizedTitle)}&labels=user-reported,bug&body=`, truncationNote = `
**Note:** Content was truncated.
`, encodedPrefix = encodeURIComponent(bodyPrefix), encodedSuffix = encodeURIComponent("\n```\n"), encodedNote = encodeURIComponent(`
**Note:** Content was truncated.
`), encodedErrors = encodeURIComponent(errorsJson), spaceForErrors = GITHUB_URL_LIMIT - baseUrl.length - encodedPrefix.length - encodedSuffix.length - encodedNote.length;
  if (spaceForErrors <= 0) {
    let ellipsis2 = encodeURIComponent("\u2026"), buffer2 = 50, maxEncodedLength = GITHUB_URL_LIMIT - baseUrl.length - ellipsis2.length - encodedNote.length - 50, fullBody = bodyPrefix + errorsJson + "\n```\n", encodedFullBody = encodeURIComponent(fullBody);
    if (encodedFullBody.length > maxEncodedLength) {
      encodedFullBody = encodedFullBody.slice(0, maxEncodedLength);
      let lastPercent2 = encodedFullBody.lastIndexOf("%");
      if (lastPercent2 >= encodedFullBody.length - 2)
        encodedFullBody = encodedFullBody.slice(0, lastPercent2);
    }
    return baseUrl + encodedFullBody + ellipsis2 + encodedNote;
  }
  if (encodedErrors.length <= spaceForErrors)
    return baseUrl + encodedPrefix + encodedErrors + encodedSuffix;
  let ellipsis = encodeURIComponent("\u2026"), buffer = 50, truncatedEncodedErrors = encodedErrors.slice(0, spaceForErrors - ellipsis.length - buffer), lastPercent = truncatedEncodedErrors.lastIndexOf("%");
  if (lastPercent >= truncatedEncodedErrors.length - 2)
    truncatedEncodedErrors = truncatedEncodedErrors.slice(0, lastPercent);
  return baseUrl + encodedPrefix + truncatedEncodedErrors + ellipsis + encodedSuffix + encodedNote;
}
