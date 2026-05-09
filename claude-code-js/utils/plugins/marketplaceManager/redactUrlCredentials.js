// function: redactUrlCredentials
function redactUrlCredentials(urlString) {
  try {
    let parsed = new URL(urlString);
    if ((parsed.protocol === "http:" || parsed.protocol === "https:") && (parsed.username || parsed.password)) {
      if (parsed.username)
        parsed.username = "***";
      if (parsed.password)
        parsed.password = "***";
      return parsed.toString();
    }
  } catch {}
  return urlString;
}
