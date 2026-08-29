// function: isUnicodeSupported2
function isUnicodeSupported2() {
  if (process21.platform !== "win32")
    return process21.env.TERM !== "linux";
  return Boolean(process21.env.WT_SESSION) || Boolean(process21.env.TERMINUS_SUBLIME) || process21.env.ConEmuTask === "{cmd::Cmder}" || process21.env.TERM_PROGRAM === "Terminus-Sublime" || process21.env.TERM_PROGRAM === "vscode" || process21.env.TERM === "xterm-256color" || process21.env.TERM === "alacritty" || process21.env.TERMINAL_EMULATOR === "JetBrains-JediTerm";
}
