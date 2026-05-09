// function: buildIgnoreChecker
function buildIgnoreChecker(additionalPatterns) {
  return import_ignore.default().add(EXCLUDE_PATTERNS).add(additionalPatterns);
}
