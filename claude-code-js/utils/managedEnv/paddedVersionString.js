// function: paddedVersionString
function paddedVersionString(input) {
  if (typeof input === "number")
    input = input + "";
  if (!input || typeof input !== "string")
    input = "0";
  let parts = input.replace(/(^v|\+.*$)/g, "").split(/[-.]/);
  if (parts.length === 3)
    parts.push("~");
  return parts.map((v2) => v2.match(/^[0-9]+$/) ? v2.padStart(5, " ") : v2).join("-");
}
