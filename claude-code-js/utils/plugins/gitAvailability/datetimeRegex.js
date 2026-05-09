// function: datetimeRegex
function datetimeRegex(args) {
  let regex2 = `${dateRegexSource}T${timeRegexSource(args)}`, opts = [];
  if (opts.push(args.local ? "Z?" : "Z"), args.offset)
    opts.push("([+-]\\d{2}:?\\d{2})");
  return regex2 = `${regex2}(${opts.join("|")})`, new RegExp(`^${regex2}$`);
}
