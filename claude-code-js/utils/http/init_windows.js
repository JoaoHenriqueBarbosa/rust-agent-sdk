// var: init_windows
var init_windows = __esm(() => {
  execFileAsync4 = promisify7(execFile4), windowsBrowserProgIds = {
    MSEdgeHTM: { name: "Edge", id: "com.microsoft.edge" },
    MSEdgeBHTML: { name: "Edge Beta", id: "com.microsoft.edge.beta" },
    MSEdgeDHTML: { name: "Edge Dev", id: "com.microsoft.edge.dev" },
    AppXq0fevzme2pys62n3e0fbqa7peapykr8v: { name: "Edge", id: "com.microsoft.edge.old" },
    ChromeHTML: { name: "Chrome", id: "com.google.chrome" },
    ChromeBHTML: { name: "Chrome Beta", id: "com.google.chrome.beta" },
    ChromeDHTML: { name: "Chrome Dev", id: "com.google.chrome.dev" },
    ChromiumHTM: { name: "Chromium", id: "org.chromium.Chromium" },
    BraveHTML: { name: "Brave", id: "com.brave.Browser" },
    BraveBHTML: { name: "Brave Beta", id: "com.brave.Browser.beta" },
    BraveDHTML: { name: "Brave Dev", id: "com.brave.Browser.dev" },
    BraveSSHTM: { name: "Brave Nightly", id: "com.brave.Browser.nightly" },
    FirefoxURL: { name: "Firefox", id: "org.mozilla.firefox" },
    OperaStable: { name: "Opera", id: "com.operasoftware.Opera" },
    VivaldiHTM: { name: "Vivaldi", id: "com.vivaldi.Vivaldi" },
    "IE.HTTP": { name: "Internet Explorer", id: "com.microsoft.ie" }
  }, _windowsBrowserProgIdMap = new Map(Object.entries(windowsBrowserProgIds));
  UnknownBrowserError = class UnknownBrowserError extends Error {
  };
});
