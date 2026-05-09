// function: isUnicodeSupported
function isUnicodeSupported() {
  let { env: env2 } = process5, { TERM, TERM_PROGRAM } = env2;
  if (process5.platform !== "win32")
    return TERM !== "linux";
  return Boolean(env2.WT_SESSION) || Boolean(env2.TERMINUS_SUBLIME) || env2.ConEmuTask === "{cmd::Cmder}" || TERM_PROGRAM === "Terminus-Sublime" || TERM_PROGRAM === "vscode" || TERM === "xterm-256color" || TERM === "alacritty" || TERM === "rxvt-unicode" || TERM === "rxvt-unicode-256color" || env2.TERMINAL_EMULATOR === "JetBrains-JediTerm";
}
