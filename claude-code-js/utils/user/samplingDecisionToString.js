// function: samplingDecisionToString
function samplingDecisionToString(decision) {
  switch (decision) {
    case SamplingDecision.RECORD_AND_SAMPLED:
      return "RECORD_AND_SAMPLE";
    case SamplingDecision.RECORD:
      return "RECORD_ONLY";
    case SamplingDecision.NOT_RECORD:
      return "DROP";
  }
}
