// Original: src/commands/remote-setup/remote-setup.tsx
var exports_remote_setup = {};
__export(exports_remote_setup, {
  call: () => call69
});
async function checkLoginState() {
  if (!await isSignedIn())
    return {
      status: "not_signed_in"
    };
  let ghStatus = await getGhAuthStatus();
  if (ghStatus === "not_installed")
    return {
      status: "gh_not_installed"
    };
  if (ghStatus === "not_authenticated")
    return {
      status: "gh_not_authenticated"
    };
  let {
    stdout
  } = await execa("gh", ["auth", "token"], {
    stdout: "pipe",
    stderr: "ignore",
    timeout: 5000,
    reject: !1
  }), trimmed = stdout.trim();
  if (!trimmed)
    return {
      status: "gh_not_authenticated"
    };
  return {
    status: "has_gh_token",
    token: new RedactedGithubToken(trimmed)
  };
}
function errorMessage3(err2, codeUrl) {
  switch (err2.kind) {
    case "not_signed_in":
      return `Login failed. Please visit ${codeUrl} and login using the GitHub App`;
    case "invalid_token":
      return "GitHub rejected that token. Run `gh auth login` and try again.";
    case "server":
      return `Server error (${err2.status}). Try again in a moment.`;
    case "network":
      return "Couldn't reach the server. Check your connection.";
  }
}
function Web({
  onDone
}) {
  let [step, setStep] = import_react194.useState({
    name: "checking"
  });
  import_react194.useEffect(() => {
    logEvent("tengu_remote_setup_started", {}), checkLoginState().then(async (result) => {
      switch (result.status) {
        case "not_signed_in":
          logEvent("tengu_remote_setup_result", {
            result: "not_signed_in"
          }), onDone("Not signed in to Claude. Run /login first.");
          return;
        case "gh_not_installed":
        case "gh_not_authenticated": {
          let url3 = `${getCodeWebUrl()}/onboarding?step=alt-auth`;
          await openBrowser(url3), logEvent("tengu_remote_setup_result", {
            result: result.status
          }), onDone(result.status === "gh_not_installed" ? `GitHub CLI not found. Install it via https://cli.github.com/, then run \`gh auth login\`, or connect GitHub on the web: ${url3}` : `GitHub CLI not authenticated. Run \`gh auth login\` and try again, or connect GitHub on the web: ${url3}`);
          return;
        }
        case "has_gh_token":
          setStep({
            name: "confirm",
            token: result.token
          });
      }
    });
  }, []);
  let handleCancel = () => {
    logEvent("tengu_remote_setup_result", {
      result: "cancelled"
    }), onDone();
  }, handleConfirm = async (token2) => {
    setStep({
      name: "uploading"
    });
    let result = await importGithubToken(token2);
    if (!result.ok) {
      logEvent("tengu_remote_setup_result", {
        result: "import_failed",
        error_kind: result.error.kind
      }), onDone(errorMessage3(result.error, getCodeWebUrl()));
      return;
    }
    await createDefaultEnvironment();
    let url3 = getCodeWebUrl();
    await openBrowser(url3), logEvent("tengu_remote_setup_result", {
      result: "success"
    }), onDone(`Connected as ${result.result.github_username}. Opened ${url3}`);
  };
  if (step.name === "checking")
    return /* @__PURE__ */ jsx_dev_runtime361.jsxDEV(LoadingState, {
      message: "Checking login status\u2026"
    }, void 0, !1, void 0, this);
  if (step.name === "uploading")
    return /* @__PURE__ */ jsx_dev_runtime361.jsxDEV(LoadingState, {
      message: "Connecting GitHub to Claude\u2026"
    }, void 0, !1, void 0, this);
  let token = step.token;
  return /* @__PURE__ */ jsx_dev_runtime361.jsxDEV(Dialog, {
    title: "Connect Claude on the web to GitHub?",
    onCancel: handleCancel,
    hideInputGuide: !0,
    children: [
      /* @__PURE__ */ jsx_dev_runtime361.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        children: [
          /* @__PURE__ */ jsx_dev_runtime361.jsxDEV(ThemedText, {
            children: "Claude on the web requires connecting to your GitHub account to clone and push code on your behalf."
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime361.jsxDEV(ThemedText, {
            dimColor: !0,
            children: "Your local credentials are used to authenticate with GitHub"
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime361.jsxDEV(Select, {
        options: [{
          label: "Continue",
          value: "send"
        }, {
          label: "Cancel",
          value: "cancel"
        }],
        onChange: (value) => {
          if (value === "send")
            handleConfirm(token);
          else
            handleCancel();
        },
        onCancel: handleCancel
      }, void 0, !1, void 0, this)
    ]
  }, void 0, !0, void 0, this);
}
async function call69(onDone) {
  return /* @__PURE__ */ jsx_dev_runtime361.jsxDEV(Web, {
    onDone
  }, void 0, !1, void 0, this);
}
var import_react194, jsx_dev_runtime361;
var init_remote_setup = __esm(() => {
  init_execa();
  init_CustomSelect();
  init_Dialog();
  init_LoadingState();
  init_ink2();
  init_browser();
  init_ghAuthStatus();
  init_api3();
  import_react194 = __toESM(require_react_development(), 1), jsx_dev_runtime361 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
