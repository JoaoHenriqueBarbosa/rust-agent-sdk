// Original: src/keybindings/defaultBindings.ts
var IMAGE_PASTE_KEY, SUPPORTS_TERMINAL_VT_MODE, MODE_CYCLE_KEY, DEFAULT_BINDINGS;
var init_defaultBindings = __esm(() => {
  init_platform();
  IMAGE_PASTE_KEY = getPlatform() === "windows" ? "alt+v" : "ctrl+v", SUPPORTS_TERMINAL_VT_MODE = getPlatform() !== "windows" || (isRunningWithBun() ? satisfies(process.versions.bun, ">=1.2.23") : satisfies(process.versions.node, ">=22.17.0 <23.0.0 || >=24.2.0")), MODE_CYCLE_KEY = SUPPORTS_TERMINAL_VT_MODE ? "shift+tab" : "meta+m", DEFAULT_BINDINGS = [
    {
      context: "Global",
      bindings: {
        "ctrl+c": "app:interrupt",
        "ctrl+d": "app:exit",
        "ctrl+l": "app:redraw",
        "ctrl+t": "app:toggleTodos",
        "ctrl+o": "app:toggleTranscript",
        ...{ "ctrl+shift+b": "app:toggleBrief" },
        "ctrl+shift+o": "app:toggleTeammatePreview",
        "ctrl+r": "history:search",
        ...{},
        ...{}
      }
    },
    {
      context: "Chat",
      bindings: {
        escape: "chat:cancel",
        "ctrl+x ctrl+k": "chat:killAgents",
        [MODE_CYCLE_KEY]: "chat:cycleMode",
        "meta+p": "chat:modelPicker",
        "meta+o": "chat:fastMode",
        "meta+t": "chat:thinkingToggle",
        enter: "chat:submit",
        up: "history:previous",
        down: "history:next",
        "ctrl+_": "chat:undo",
        "ctrl+shift+-": "chat:undo",
        "ctrl+x ctrl+e": "chat:externalEditor",
        "ctrl+g": "chat:externalEditor",
        "ctrl+s": "chat:stash",
        [IMAGE_PASTE_KEY]: "chat:imagePaste",
        ...{},
        ...{ space: "voice:pushToTalk" }
      }
    },
    {
      context: "Autocomplete",
      bindings: {
        tab: "autocomplete:accept",
        escape: "autocomplete:dismiss",
        up: "autocomplete:previous",
        down: "autocomplete:next"
      }
    },
    {
      context: "Settings",
      bindings: {
        escape: "confirm:no",
        up: "select:previous",
        down: "select:next",
        k: "select:previous",
        j: "select:next",
        "ctrl+p": "select:previous",
        "ctrl+n": "select:next",
        space: "select:accept",
        enter: "settings:close",
        "/": "settings:search",
        r: "settings:retry"
      }
    },
    {
      context: "Confirmation",
      bindings: {
        y: "confirm:yes",
        n: "confirm:no",
        enter: "confirm:yes",
        escape: "confirm:no",
        up: "confirm:previous",
        down: "confirm:next",
        tab: "confirm:nextField",
        space: "confirm:toggle",
        "shift+tab": "confirm:cycleMode",
        "ctrl+e": "confirm:toggleExplanation",
        "ctrl+d": "permission:toggleDebug"
      }
    },
    {
      context: "Tabs",
      bindings: {
        tab: "tabs:next",
        "shift+tab": "tabs:previous",
        right: "tabs:next",
        left: "tabs:previous"
      }
    },
    {
      context: "Transcript",
      bindings: {
        "ctrl+e": "transcript:toggleShowAll",
        "ctrl+c": "transcript:exit",
        escape: "transcript:exit",
        q: "transcript:exit"
      }
    },
    {
      context: "HistorySearch",
      bindings: {
        "ctrl+r": "historySearch:next",
        escape: "historySearch:accept",
        tab: "historySearch:accept",
        "ctrl+c": "historySearch:cancel",
        enter: "historySearch:execute"
      }
    },
    {
      context: "Task",
      bindings: {
        "ctrl+b": "task:background"
      }
    },
    {
      context: "ThemePicker",
      bindings: {
        "ctrl+t": "theme:toggleSyntaxHighlighting"
      }
    },
    {
      context: "Scroll",
      bindings: {
        pageup: "scroll:pageUp",
        pagedown: "scroll:pageDown",
        wheelup: "scroll:lineUp",
        wheeldown: "scroll:lineDown",
        "ctrl+home": "scroll:top",
        "ctrl+end": "scroll:bottom",
        "ctrl+shift+c": "selection:copy",
        "cmd+c": "selection:copy"
      }
    },
    {
      context: "Help",
      bindings: {
        escape: "help:dismiss"
      }
    },
    {
      context: "Attachments",
      bindings: {
        right: "attachments:next",
        left: "attachments:previous",
        backspace: "attachments:remove",
        delete: "attachments:remove",
        down: "attachments:exit",
        escape: "attachments:exit"
      }
    },
    {
      context: "Footer",
      bindings: {
        up: "footer:up",
        "ctrl+p": "footer:up",
        down: "footer:down",
        "ctrl+n": "footer:down",
        right: "footer:next",
        left: "footer:previous",
        enter: "footer:openSelected",
        escape: "footer:clearSelection"
      }
    },
    {
      context: "MessageSelector",
      bindings: {
        up: "messageSelector:up",
        down: "messageSelector:down",
        k: "messageSelector:up",
        j: "messageSelector:down",
        "ctrl+p": "messageSelector:up",
        "ctrl+n": "messageSelector:down",
        "ctrl+up": "messageSelector:top",
        "shift+up": "messageSelector:top",
        "meta+up": "messageSelector:top",
        "shift+k": "messageSelector:top",
        "ctrl+down": "messageSelector:bottom",
        "shift+down": "messageSelector:bottom",
        "meta+down": "messageSelector:bottom",
        "shift+j": "messageSelector:bottom",
        enter: "messageSelector:select"
      }
    },
    ...[],
    {
      context: "DiffDialog",
      bindings: {
        escape: "diff:dismiss",
        left: "diff:previousSource",
        right: "diff:nextSource",
        up: "diff:previousFile",
        down: "diff:nextFile",
        enter: "diff:viewDetails"
      }
    },
    {
      context: "ModelPicker",
      bindings: {
        left: "modelPicker:decreaseEffort",
        right: "modelPicker:increaseEffort"
      }
    },
    {
      context: "Select",
      bindings: {
        up: "select:previous",
        down: "select:next",
        j: "select:next",
        k: "select:previous",
        "ctrl+n": "select:next",
        "ctrl+p": "select:previous",
        enter: "select:accept",
        escape: "select:cancel"
      }
    },
    {
      context: "Plugin",
      bindings: {
        space: "plugin:toggle",
        i: "plugin:install"
      }
    }
  ];
});
