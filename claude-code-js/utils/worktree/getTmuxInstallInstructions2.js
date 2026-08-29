// function: getTmuxInstallInstructions2
function getTmuxInstallInstructions2() {
  switch (getPlatform()) {
    case "macos":
      return "Install tmux with: brew install tmux";
    case "linux":
    case "wsl":
      return "Install tmux with: sudo apt install tmux (Debian/Ubuntu) or sudo dnf install tmux (Fedora/RHEL)";
    case "windows":
      return "tmux is not natively available on Windows. Consider using WSL or Cygwin.";
    default:
      return "Install tmux using your system package manager.";
  }
}
