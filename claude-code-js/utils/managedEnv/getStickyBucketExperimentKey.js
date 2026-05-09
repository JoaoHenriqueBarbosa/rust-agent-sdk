// function: getStickyBucketExperimentKey
function getStickyBucketExperimentKey(experimentKey, experimentBucketVersion) {
  return experimentBucketVersion = experimentBucketVersion || 0, `${experimentKey}__${experimentBucketVersion}`;
}
