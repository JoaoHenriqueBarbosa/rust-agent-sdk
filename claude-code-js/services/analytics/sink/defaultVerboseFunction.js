// var: defaultVerboseFunction
var defaultVerboseFunction = ({
  type,
  message,
  timestamp,
  piped,
  commandId,
  result: { failed = !1 } = {},
  options: { reject = !0 }
}) => {
  let timestampString = serializeTimestamp(timestamp), icon = ICONS[type]({ failed, reject, piped }), color = COLORS[type]({ reject });
  return `${gray(`[${timestampString}]`)} ${gray(`[${commandId}]`)} ${color(icon)} ${color(message)}`;
}, serializeTimestamp = (timestamp) => `${padField(timestamp.getHours(), 2)}:${padField(timestamp.getMinutes(), 2)}:${padField(timestamp.getSeconds(), 2)}.${padField(timestamp.getMilliseconds(), 3)}`, padField = (field, padding) => String(field).padStart(padding, "0"), getFinalIcon = ({ failed, reject }) => {
  if (!failed)
    return figures_default.tick;
  return reject ? figures_default.cross : figures_default.warning;
}, ICONS, identity2 = (string4) => string4, COLORS;
