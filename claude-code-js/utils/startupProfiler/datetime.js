// function: datetime
function datetime(args) {
  let time2 = timeSource({ precision: args.precision }), opts = ["Z"];
  if (args.local)
    opts.push("");
  if (args.offset)
    opts.push("([+-]\\d{2}:\\d{2})");
  let timeRegex = `${time2}(?:${opts.join("|")})`;
  return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
}
