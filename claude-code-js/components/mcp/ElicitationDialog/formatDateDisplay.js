// function: formatDateDisplay
function formatDateDisplay(isoValue, schema5) {
  try {
    let date6 = new Date(isoValue);
    if (Number.isNaN(date6.getTime()))
      return isoValue;
    if (("format" in schema5 ? schema5.format : void 0) === "date-time")
      return date6.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short"
      });
    let parts = isoValue.split("-");
    if (parts.length === 3)
      return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])).toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    return isoValue;
  } catch {
    return isoValue;
  }
}
