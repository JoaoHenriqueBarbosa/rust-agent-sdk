// function: createPrompt
function createPrompt(view) {
  return (config9, context3 = {}) => {
    let { input = process.stdin, signal } = context3, cleanups = /* @__PURE__ */ new Set, output = new import_mute_stream.default;
    output.pipe(context3.output ?? process.stdout);
    let rl = readline2.createInterface({
      terminal: !0,
      input,
      output
    }), screen = new ScreenManager(rl), { promise: promise2, resolve: resolve19, reject: reject2 } = PromisePolyfill.withResolver(), cancel = () => reject2(new CancelPromptError);
    if (signal) {
      let abort7 = () => reject2(new AbortPromptError({ cause: signal.reason }));
      if (signal.aborted)
        return abort7(), Object.assign(promise2, { cancel });
      signal.addEventListener("abort", abort7), cleanups.add(() => signal.removeEventListener("abort", abort7));
    }
    cleanups.add(onExit((code, signal2) => {
      reject2(new ExitPromptError(`User force closed the prompt with ${code} ${signal2}`));
    }));
    let checkCursorPos = () => screen.checkCursorPos();
    return rl.input.on("keypress", checkCursorPos), cleanups.add(() => rl.input.removeListener("keypress", checkCursorPos)), withHooks(rl, (cycle) => {
      let hooksCleanup = AsyncResource3.bind(() => effectScheduler.clearAll());
      return rl.on("close", hooksCleanup), cleanups.add(() => rl.removeListener("close", hooksCleanup)), cycle(() => {
        try {
          let nextView = view(config9, (value) => {
            setImmediate(() => resolve19(value));
          }), [content, bottomContent] = typeof nextView === "string" ? [nextView] : nextView;
          screen.render(content, bottomContent), effectScheduler.run();
        } catch (error44) {
          reject2(error44);
        }
      }), Object.assign(promise2.then((answer) => {
        return effectScheduler.clearAll(), answer;
      }, (error44) => {
        throw effectScheduler.clearAll(), error44;
      }).finally(() => {
        cleanups.forEach((cleanup) => cleanup()), screen.done({ clearContent: Boolean(context3?.clearPromptOnDone) }), output.end();
      }).then(() => promise2), { cancel });
    });
  };
}
