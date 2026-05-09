// function: reviewCountsLine
function reviewCountsLine(session2) {
  let p4 = session2.reviewProgress;
  if (!p4)
    return session2.status === "completed" ? "done" : "setting up";
  let verified = p4.bugsVerified, refuted = p4.bugsRefuted ?? 0;
  if (session2.status === "completed") {
    let parts = [`${verified} ${plural(verified, "finding")}`];
    if (refuted > 0)
      parts.push(`${refuted} refuted`);
    return parts.join(" \xB7 ");
  }
  return formatReviewStageCounts(p4.stage, p4.bugsFound, verified, refuted);
}
