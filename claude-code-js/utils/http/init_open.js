// var: init_open
var init_open = __esm(() => {
  init_wsl_utils();
  init_default_browser();
  init_is_inside_container();
  execFile6 = promisify9(childProcess.execFile), __dirname2 = path11.dirname(fileURLToPath3(import.meta.url)), localXdgOpenPath = path11.join(__dirname2, "xdg-open"), { platform: platform2, arch } = process20;
  apps = {};
  defineLazyProperty(apps, "chrome", () => detectPlatformBinary({
    darwin: "google chrome",
    win32: "chrome",
    linux: ["google-chrome", "google-chrome-stable", "chromium"]
  }, {
    wsl: {
      ia32: "/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe",
      x64: ["/mnt/c/Program Files/Google/Chrome/Application/chrome.exe", "/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe"]
    }
  }));
  defineLazyProperty(apps, "brave", () => detectPlatformBinary({
    darwin: "brave browser",
    win32: "brave",
    linux: ["brave-browser", "brave"]
  }, {
    wsl: {
      ia32: "/mnt/c/Program Files (x86)/BraveSoftware/Brave-Browser/Application/brave.exe",
      x64: ["/mnt/c/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe", "/mnt/c/Program Files (x86)/BraveSoftware/Brave-Browser/Application/brave.exe"]
    }
  }));
  defineLazyProperty(apps, "firefox", () => detectPlatformBinary({
    darwin: "firefox",
    win32: String.raw`C:\Program Files\Mozilla Firefox\firefox.exe`,
    linux: "firefox"
  }, {
    wsl: "/mnt/c/Program Files/Mozilla Firefox/firefox.exe"
  }));
  defineLazyProperty(apps, "edge", () => detectPlatformBinary({
    darwin: "microsoft edge",
    win32: "msedge",
    linux: ["microsoft-edge", "microsoft-edge-dev"]
  }, {
    wsl: "/mnt/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
  }));
  defineLazyProperty(apps, "browser", () => "browser");
  defineLazyProperty(apps, "browserPrivate", () => "browserPrivate");
  open_default = open3;
});
