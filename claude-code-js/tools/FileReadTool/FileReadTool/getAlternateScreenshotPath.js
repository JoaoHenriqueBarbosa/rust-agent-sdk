// function: getAlternateScreenshotPath
function getAlternateScreenshotPath(filePath) {
  let filename = path20.basename(filePath), amPmPattern = /^(.+)([ \u202F])(AM|PM)(\.png)$/, match = filename.match(amPmPattern);
  if (!match)
    return;
  let currentSpace = match[2], alternateSpace = currentSpace === " " ? THIN_SPACE : " ";
  return filePath.replace(`${currentSpace}${match[3]}${match[4]}`, `${alternateSpace}${match[3]}${match[4]}`);
}
