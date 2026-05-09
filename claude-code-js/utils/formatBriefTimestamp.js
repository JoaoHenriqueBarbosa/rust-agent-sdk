// Original: src/utils/formatBriefTimestamp.ts
function formatBriefTimestamp(isoString, now2 = /* @__PURE__ */ new Date) {
  let d = new Date(isoString);
  if (Number.isNaN(d.getTime()))
    return "";
  let locale = getLocale(), dayDiff = startOfDay(now2) - startOfDay(d), daysAgo = Math.round(dayDiff / 86400000);
  if (daysAgo === 0)
    return d.toLocaleTimeString(locale, {
      hour: "numeric",
      minute: "2-digit"
    });
  if (daysAgo > 0 && daysAgo < 7)
    return d.toLocaleString(locale, {
      weekday: "long",
      hour: "numeric",
      minute: "2-digit"
    });
  return d.toLocaleString(locale, {
    weekday: "long",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}
function getLocale() {
  let raw = process.env.LC_ALL || process.env.LC_TIME || process.env.LANG || "";
  if (!raw || raw === "C" || raw === "POSIX")
    return;
  let base2 = raw.split(".")[0].split("@")[0];
  if (!base2)
    return;
  let tag2 = base2.replaceAll("_", "-");
  try {
    return new Intl.DateTimeFormat(tag2), tag2;
  } catch {
    return;
  }
}
function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}
