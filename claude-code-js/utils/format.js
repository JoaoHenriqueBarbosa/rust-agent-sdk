// Original: src/utils/format.ts
function formatFileSize(sizeInBytes) {
  let kb = sizeInBytes / 1024;
  if (kb < 1)
    return `${sizeInBytes} bytes`;
  if (kb < 1024)
    return `${kb.toFixed(1).replace(/\.0$/, "")}KB`;
  let mb = kb / 1024;
  if (mb < 1024)
    return `${mb.toFixed(1).replace(/\.0$/, "")}MB`;
  return `${(mb / 1024).toFixed(1).replace(/\.0$/, "")}GB`;
}
function formatSecondsShort(ms) {
  return `${(ms / 1000).toFixed(1)}s`;
}
function formatDuration(ms, options) {
  if (ms < 60000) {
    if (ms === 0)
      return "0s";
    if (ms < 1)
      return `${(ms / 1000).toFixed(1)}s`;
    return `${Math.floor(ms / 1000).toString()}s`;
  }
  let days = Math.floor(ms / 86400000), hours = Math.floor(ms % 86400000 / 3600000), minutes = Math.floor(ms % 3600000 / 60000), seconds = Math.round(ms % 60000 / 1000);
  if (seconds === 60)
    seconds = 0, minutes++;
  if (minutes === 60)
    minutes = 0, hours++;
  if (hours === 24)
    hours = 0, days++;
  let hide = options?.hideTrailingZeros;
  if (options?.mostSignificantOnly) {
    if (days > 0)
      return `${days}d`;
    if (hours > 0)
      return `${hours}h`;
    if (minutes > 0)
      return `${minutes}m`;
    return `${seconds}s`;
  }
  if (days > 0) {
    if (hide && hours === 0 && minutes === 0)
      return `${days}d`;
    if (hide && minutes === 0)
      return `${days}d ${hours}h`;
    return `${days}d ${hours}h ${minutes}m`;
  }
  if (hours > 0) {
    if (hide && minutes === 0 && seconds === 0)
      return `${hours}h`;
    if (hide && seconds === 0)
      return `${hours}h ${minutes}m`;
    return `${hours}h ${minutes}m ${seconds}s`;
  }
  if (minutes > 0) {
    if (hide && seconds === 0)
      return `${minutes}m`;
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}
function formatNumber(number) {
  let shouldUseConsistentDecimals = number >= 1000;
  return getNumberFormatter(shouldUseConsistentDecimals).format(number).toLowerCase();
}
function formatTokens(count) {
  return formatNumber(count).replace(".0", "");
}
function formatRelativeTime(date, options = {}) {
  let { style = "narrow", numeric = "always", now = /* @__PURE__ */ new Date } = options, diffInMs = date.getTime() - now.getTime(), diffInSeconds = Math.trunc(diffInMs / 1000), intervals = [
    { unit: "year", seconds: 31536000, shortUnit: "y" },
    { unit: "month", seconds: 2592000, shortUnit: "mo" },
    { unit: "week", seconds: 604800, shortUnit: "w" },
    { unit: "day", seconds: 86400, shortUnit: "d" },
    { unit: "hour", seconds: 3600, shortUnit: "h" },
    { unit: "minute", seconds: 60, shortUnit: "m" },
    { unit: "second", seconds: 1, shortUnit: "s" }
  ];
  for (let { unit, seconds: intervalSeconds, shortUnit } of intervals)
    if (Math.abs(diffInSeconds) >= intervalSeconds) {
      let value = Math.trunc(diffInSeconds / intervalSeconds);
      if (style === "narrow")
        return diffInSeconds < 0 ? `${Math.abs(value)}${shortUnit} ago` : `in ${value}${shortUnit}`;
      return getRelativeTimeFormat("long", numeric).format(value, unit);
    }
  if (style === "narrow")
    return diffInSeconds <= 0 ? "0s ago" : "in 0s";
  return getRelativeTimeFormat(style, numeric).format(0, "second");
}
function formatRelativeTimeAgo(date, options = {}) {
  let { now = /* @__PURE__ */ new Date, ...restOptions } = options;
  if (date > now)
    return formatRelativeTime(date, { ...restOptions, now });
  return formatRelativeTime(date, { ...restOptions, numeric: "always", now });
}
function formatLogMetadata(log) {
  let sizeOrCount = log.fileSize !== void 0 ? formatFileSize(log.fileSize) : `${log.messageCount} messages`, parts = [
    formatRelativeTimeAgo(log.modified, { style: "short" }),
    ...log.gitBranch ? [log.gitBranch] : [],
    sizeOrCount
  ];
  if (log.tag)
    parts.push(`#${log.tag}`);
  if (log.agentSetting)
    parts.push(`@${log.agentSetting}`);
  if (log.prNumber)
    parts.push(log.prRepository ? `${log.prRepository}#${log.prNumber}` : `#${log.prNumber}`);
  return parts.join(" \xB7 ");
}
function formatResetTime(timestampInSeconds, showTimezone = !1, showTime = !0) {
  if (!timestampInSeconds)
    return;
  let date = new Date(timestampInSeconds * 1000), now = /* @__PURE__ */ new Date, minutes = date.getMinutes();
  if ((date.getTime() - now.getTime()) / 3600000 > 24) {
    let dateOptions = {
      month: "short",
      day: "numeric",
      hour: showTime ? "numeric" : void 0,
      minute: !showTime || minutes === 0 ? void 0 : "2-digit",
      hour12: showTime ? !0 : void 0
    };
    if (date.getFullYear() !== now.getFullYear())
      dateOptions.year = "numeric";
    return date.toLocaleString("en-US", dateOptions).replace(/ ([AP]M)/i, (_match, ampm) => ampm.toLowerCase()) + (showTimezone ? ` (${getTimeZone()})` : "");
  }
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: minutes === 0 ? void 0 : "2-digit",
    hour12: !0
  }).replace(/ ([AP]M)/i, (_match, ampm) => ampm.toLowerCase()) + (showTimezone ? ` (${getTimeZone()})` : "");
}
function formatResetText(resetsAt, showTimezone = !1, showTime = !0) {
  let dt = new Date(resetsAt);
  return `${formatResetTime(Math.floor(dt.getTime() / 1000), showTimezone, showTime)}`;
}
var numberFormatterForConsistentDecimals = null, numberFormatterForInconsistentDecimals = null, getNumberFormatter = (useConsistentDecimals) => {
  if (useConsistentDecimals) {
    if (!numberFormatterForConsistentDecimals)
      numberFormatterForConsistentDecimals = new Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 1,
        minimumFractionDigits: 1
      });
    return numberFormatterForConsistentDecimals;
  } else {
    if (!numberFormatterForInconsistentDecimals)
      numberFormatterForInconsistentDecimals = new Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 1,
        minimumFractionDigits: 0
      });
    return numberFormatterForInconsistentDecimals;
  }
};
var init_format = __esm(() => {
  init_intl();
  init_truncate();
});
