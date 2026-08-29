// Shared module state and imports
// Original: src/tools/BashTool/bashSecurity.ts
  for (let outer of verified)
    for (let inner of verified) {
      if (inner === outer)
        continue;
      if (inner.start > outer.start && inner.start < outer.end)
        return !1;
    }
  let sortedVerified = [...verified].sort((a2, b) => b.start - a2.start), remaining = command12;
  for (let { start, end } of sortedVerified)
    remaining = remaining.slice(0, start) + remaining.slice(end);
  if (remaining.trim().length > 0) {
    let firstHeredocStart = Math.min(...verified.map((v2) => v2.start));
    if (command12.slice(0, firstHeredocStart).trim().length === 0)
      return !1;
  }
  if (!/^[a-zA-Z0-9 \t"'.\-/_@=,:+~]*$/.test(remaining))
    return !1;
  if (bashCommandIsSafe_DEPRECATED(remaining).behavior !== "passthrough")
    return !1;
  return !0;
}
