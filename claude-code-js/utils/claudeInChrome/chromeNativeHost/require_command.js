// var: require_command
var require_command = __commonJS((exports) => {
  var EventEmitter5 = __require("events").EventEmitter, childProcess3 = __require("child_process"), path25 = __require("path"), fs18 = __require("fs"), process24 = __require("process"), { Argument, humanReadableArgName } = require_argument(), { CommanderError } = require_error(), { Help, stripColor } = require_help(), { Option, DualOptions } = require_option(), { suggestSimilar } = require_suggestSimilar();

  class Command5 extends EventEmitter5 {
    constructor(name3) {
      super();
      this.commands = [], this.options = [], this.parent = null, this._allowUnknownOption = !1, this._allowExcessArguments = !1, this.registeredArguments = [], this._args = this.registeredArguments, this.args = [], this.rawArgs = [], this.processedArgs = [], this._scriptPath = null, this._name = name3 || "", this._optionValues = {}, this._optionValueSources = {}, this._storeOptionsAsProperties = !1, this._actionHandler = null, this._executableHandler = !1, this._executableFile = null, this._executableDir = null, this._defaultCommandName = null, this._exitCallback = null, this._aliases = [], this._combineFlagAndOptionalValue = !0, this._description = "", this._summary = "", this._argsDescription = void 0, this._enablePositionalOptions = !1, this._passThroughOptions = !1, this._lifeCycleHooks = {}, this._showHelpAfterError = !1, this._showSuggestionAfterError = !0, this._savedState = null, this._outputConfiguration = {
        writeOut: (str2) => process24.stdout.write(str2),
        writeErr: (str2) => process24.stderr.write(str2),
        outputError: (str2, write) => write(str2),
        getOutHelpWidth: () => process24.stdout.isTTY ? process24.stdout.columns : void 0,
        getErrHelpWidth: () => process24.stderr.isTTY ? process24.stderr.columns : void 0,
        getOutHasColors: () => useColor() ?? (process24.stdout.isTTY && process24.stdout.hasColors?.()),
        getErrHasColors: () => useColor() ?? (process24.stderr.isTTY && process24.stderr.hasColors?.()),
        stripColor: (str2) => stripColor(str2)
      }, this._hidden = !1, this._helpOption = void 0, this._addImplicitHelpCommand = void 0, this._helpCommand = void 0, this._helpConfiguration = {};
    }
    copyInheritedSettings(sourceCommand) {
      return this._outputConfiguration = sourceCommand._outputConfiguration, this._helpOption = sourceCommand._helpOption, this._helpCommand = sourceCommand._helpCommand, this._helpConfiguration = sourceCommand._helpConfiguration, this._exitCallback = sourceCommand._exitCallback, this._storeOptionsAsProperties = sourceCommand._storeOptionsAsProperties, this._combineFlagAndOptionalValue = sourceCommand._combineFlagAndOptionalValue, this._allowExcessArguments = sourceCommand._allowExcessArguments, this._enablePositionalOptions = sourceCommand._enablePositionalOptions, this._showHelpAfterError = sourceCommand._showHelpAfterError, this._showSuggestionAfterError = sourceCommand._showSuggestionAfterError, this;
    }
    _getCommandAndAncestors() {
      let result = [];
      for (let command19 = this;command19; command19 = command19.parent)
        result.push(command19);
      return result;
    }
    command(nameAndArgs, actionOptsOrExecDesc, execOpts) {
      let desc = actionOptsOrExecDesc, opts = execOpts;
      if (typeof desc === "object" && desc !== null)
        opts = desc, desc = null;
      opts = opts || {};
      let [, name3, args] = nameAndArgs.match(/([^ ]+) *(.*)/), cmd = this.createCommand(name3);
      if (desc)
        cmd.description(desc), cmd._executableHandler = !0;
      if (opts.isDefault)
        this._defaultCommandName = cmd._name;
      if (cmd._hidden = !!(opts.noHelp || opts.hidden), cmd._executableFile = opts.executableFile || null, args)
        cmd.arguments(args);
      if (this._registerCommand(cmd), cmd.parent = this, cmd.copyInheritedSettings(this), desc)
        return this;
      return cmd;
    }
    createCommand(name3) {
      return new Command5(name3);
    }
    createHelp() {
      return Object.assign(new Help, this.configureHelp());
    }
    configureHelp(configuration) {
      if (configuration === void 0)
        return this._helpConfiguration;
      return this._helpConfiguration = configuration, this;
    }
    configureOutput(configuration) {
      if (configuration === void 0)
        return this._outputConfiguration;
      return Object.assign(this._outputConfiguration, configuration), this;
    }
    showHelpAfterError(displayHelp = !0) {
      if (typeof displayHelp !== "string")
        displayHelp = !!displayHelp;
      return this._showHelpAfterError = displayHelp, this;
    }
    showSuggestionAfterError(displaySuggestion = !0) {
      return this._showSuggestionAfterError = !!displaySuggestion, this;
    }
    addCommand(cmd, opts) {
      if (!cmd._name)
        throw Error(`Command passed to .addCommand() must have a name
- specify the name in Command constructor or using .name()`);
      if (opts = opts || {}, opts.isDefault)
        this._defaultCommandName = cmd._name;
      if (opts.noHelp || opts.hidden)
        cmd._hidden = !0;
      return this._registerCommand(cmd), cmd.parent = this, cmd._checkForBrokenPassThrough(), this;
    }
    createArgument(name3, description) {
      return new Argument(name3, description);
    }
    argument(name3, description, fn, defaultValue) {
      let argument = this.createArgument(name3, description);
      if (typeof fn === "function")
        argument.default(defaultValue).argParser(fn);
      else
        argument.default(fn);
      return this.addArgument(argument), this;
    }
    arguments(names) {
      return names.trim().split(/ +/).forEach((detail) => {
        this.argument(detail);
      }), this;
    }
    addArgument(argument) {
      let previousArgument = this.registeredArguments.slice(-1)[0];
      if (previousArgument && previousArgument.variadic)
        throw Error(`only the last argument can be variadic '${previousArgument.name()}'`);
      if (argument.required && argument.defaultValue !== void 0 && argument.parseArg === void 0)
        throw Error(`a default value for a required argument is never used: '${argument.name()}'`);
      return this.registeredArguments.push(argument), this;
    }
    helpCommand(enableOrNameAndArgs, description) {
      if (typeof enableOrNameAndArgs === "boolean")
        return this._addImplicitHelpCommand = enableOrNameAndArgs, this;
      enableOrNameAndArgs = enableOrNameAndArgs ?? "help [command]";
      let [, helpName, helpArgs] = enableOrNameAndArgs.match(/([^ ]+) *(.*)/), helpDescription = description ?? "display help for command", helpCommand = this.createCommand(helpName);
      if (helpCommand.helpOption(!1), helpArgs)
        helpCommand.arguments(helpArgs);
      if (helpDescription)
        helpCommand.description(helpDescription);
      return this._addImplicitHelpCommand = !0, this._helpCommand = helpCommand, this;
    }
    addHelpCommand(helpCommand, deprecatedDescription) {
      if (typeof helpCommand !== "object")
        return this.helpCommand(helpCommand, deprecatedDescription), this;
      return this._addImplicitHelpCommand = !0, this._helpCommand = helpCommand, this;
    }
    _getHelpCommand() {
      if (this._addImplicitHelpCommand ?? (this.commands.length && !this._actionHandler && !this._findCommand("help"))) {
        if (this._helpCommand === void 0)
          this.helpCommand(void 0, void 0);
        return this._helpCommand;
      }
      return null;
    }
    hook(event, listener2) {
      let allowedValues = ["preSubcommand", "preAction", "postAction"];
      if (!allowedValues.includes(event))
        throw Error(`Unexpected value for event passed to hook : '${event}'.
Expecting one of '${allowedValues.join("', '")}'`);
      if (this._lifeCycleHooks[event])
        this._lifeCycleHooks[event].push(listener2);
      else
        this._lifeCycleHooks[event] = [listener2];
      return this;
    }
    exitOverride(fn) {
      if (fn)
        this._exitCallback = fn;
      else
        this._exitCallback = (err2) => {
          if (err2.code !== "commander.executeSubCommandAsync")
            throw err2;
        };
      return this;
    }
    _exit(exitCode, code, message) {
      if (this._exitCallback)
        this._exitCallback(new CommanderError(exitCode, code, message));
      process24.exit(exitCode);
    }
    action(fn) {
      let listener2 = (args) => {
        let expectedArgsCount = this.registeredArguments.length, actionArgs = args.slice(0, expectedArgsCount);
        if (this._storeOptionsAsProperties)
          actionArgs[expectedArgsCount] = this;
        else
          actionArgs[expectedArgsCount] = this.opts();
        return actionArgs.push(this), fn.apply(this, actionArgs);
      };
      return this._actionHandler = listener2, this;
    }
    createOption(flags, description) {
      return new Option(flags, description);
    }
    _callParseArg(target, value, previous, invalidArgumentMessage) {
      try {
        return target.parseArg(value, previous);
      } catch (err2) {
        if (err2.code === "commander.invalidArgument") {
          let message = `${invalidArgumentMessage} ${err2.message}`;
          this.error(message, { exitCode: err2.exitCode, code: err2.code });
        }
        throw err2;
      }
    }
    _registerOption(option) {
      let matchingOption = option.short && this._findOption(option.short) || option.long && this._findOption(option.long);
      if (matchingOption) {
        let matchingFlag = option.long && this._findOption(option.long) ? option.long : option.short;
        throw Error(`Cannot add option '${option.flags}'${this._name && ` to command '${this._name}'`} due to conflicting flag '${matchingFlag}'
-  already used by option '${matchingOption.flags}'`);
      }
      this.options.push(option);
    }
    _registerCommand(command19) {
      let knownBy = (cmd) => {
        return [cmd.name()].concat(cmd.aliases());
      }, alreadyUsed = knownBy(command19).find((name3) => this._findCommand(name3));
      if (alreadyUsed) {
        let existingCmd = knownBy(this._findCommand(alreadyUsed)).join("|"), newCmd = knownBy(command19).join("|");
        throw Error(`cannot add command '${newCmd}' as already have command '${existingCmd}'`);
      }
      this.commands.push(command19);
    }
    addOption(option) {
      this._registerOption(option);
      let oname = option.name(), name3 = option.attributeName();
      if (option.negate) {
        let positiveLongFlag = option.long.replace(/^--no-/, "--");
        if (!this._findOption(positiveLongFlag))
          this.setOptionValueWithSource(name3, option.defaultValue === void 0 ? !0 : option.defaultValue, "default");
      } else if (option.defaultValue !== void 0)
        this.setOptionValueWithSource(name3, option.defaultValue, "default");
      let handleOptionValue = (val, invalidValueMessage, valueSource) => {
        if (val == null && option.presetArg !== void 0)
          val = option.presetArg;
        let oldValue = this.getOptionValue(name3);
        if (val !== null && option.parseArg)
          val = this._callParseArg(option, val, oldValue, invalidValueMessage);
        else if (val !== null && option.variadic)
          val = option._concatValue(val, oldValue);
        if (val == null)
          if (option.negate)
            val = !1;
          else if (option.isBoolean() || option.optional)
            val = !0;
          else
            val = "";
        this.setOptionValueWithSource(name3, val, valueSource);
      };
      if (this.on("option:" + oname, (val) => {
        let invalidValueMessage = `error: option '${option.flags}' argument '${val}' is invalid.`;
        handleOptionValue(val, invalidValueMessage, "cli");
      }), option.envVar)
        this.on("optionEnv:" + oname, (val) => {
          let invalidValueMessage = `error: option '${option.flags}' value '${val}' from env '${option.envVar}' is invalid.`;
          handleOptionValue(val, invalidValueMessage, "env");
        });
      return this;
    }
    _optionEx(config11, flags, description, fn, defaultValue) {
      if (typeof flags === "object" && flags instanceof Option)
        throw Error("To add an Option object use addOption() instead of option() or requiredOption()");
      let option = this.createOption(flags, description);
      if (option.makeOptionMandatory(!!config11.mandatory), typeof fn === "function")
        option.default(defaultValue).argParser(fn);
      else if (fn instanceof RegExp) {
        let regex2 = fn;
        fn = (val, def2) => {
          let m4 = regex2.exec(val);
          return m4 ? m4[0] : def2;
        }, option.default(defaultValue).argParser(fn);
      } else
        option.default(fn);
      return this.addOption(option);
    }
    option(flags, description, parseArg, defaultValue) {
      return this._optionEx({}, flags, description, parseArg, defaultValue);
    }
    requiredOption(flags, description, parseArg, defaultValue) {
      return this._optionEx({ mandatory: !0 }, flags, description, parseArg, defaultValue);
    }
    combineFlagAndOptionalValue(combine = !0) {
      return this._combineFlagAndOptionalValue = !!combine, this;
    }
    allowUnknownOption(allowUnknown = !0) {
      return this._allowUnknownOption = !!allowUnknown, this;
    }
    allowExcessArguments(allowExcess = !0) {
      return this._allowExcessArguments = !!allowExcess, this;
    }
    enablePositionalOptions(positional = !0) {
      return this._enablePositionalOptions = !!positional, this;
    }
    passThroughOptions(passThrough = !0) {
      return this._passThroughOptions = !!passThrough, this._checkForBrokenPassThrough(), this;
    }
    _checkForBrokenPassThrough() {
      if (this.parent && this._passThroughOptions && !this.parent._enablePositionalOptions)
        throw Error(`passThroughOptions cannot be used for '${this._name}' without turning on enablePositionalOptions for parent command(s)`);
    }
    storeOptionsAsProperties(storeAsProperties = !0) {
      if (this.options.length)
        throw Error("call .storeOptionsAsProperties() before adding options");
      if (Object.keys(this._optionValues).length)
        throw Error("call .storeOptionsAsProperties() before setting option values");
      return this._storeOptionsAsProperties = !!storeAsProperties, this;
    }
    getOptionValue(key3) {
      if (this._storeOptionsAsProperties)
        return this[key3];
      return this._optionValues[key3];
    }
    setOptionValue(key3, value) {
      return this.setOptionValueWithSource(key3, value, void 0);
    }
    setOptionValueWithSource(key3, value, source) {
      if (this._storeOptionsAsProperties)
        this[key3] = value;
      else
        this._optionValues[key3] = value;
      return this._optionValueSources[key3] = source, this;
    }
    getOptionValueSource(key3) {
      return this._optionValueSources[key3];
    }
    getOptionValueSourceWithGlobals(key3) {
      let source;
      return this._getCommandAndAncestors().forEach((cmd) => {
        if (cmd.getOptionValueSource(key3) !== void 0)
          source = cmd.getOptionValueSource(key3);
      }), source;
    }
    _prepareUserArgs(argv, parseOptions) {
      if (argv !== void 0 && !Array.isArray(argv))
        throw Error("first parameter to parse must be array or undefined");
      if (parseOptions = parseOptions || {}, argv === void 0 && parseOptions.from === void 0) {
        if (process24.versions?.electron)
          parseOptions.from = "electron";
        let execArgv2 = process24.execArgv ?? [];
        if (execArgv2.includes("-e") || execArgv2.includes("--eval") || execArgv2.includes("-p") || execArgv2.includes("--print"))
          parseOptions.from = "eval";
      }
      if (argv === void 0)
        argv = process24.argv;
      this.rawArgs = argv.slice();
      let userArgs;
      switch (parseOptions.from) {
        case void 0:
        case "node":
          this._scriptPath = argv[1], userArgs = argv.slice(2);
          break;
        case "electron":
          if (process24.defaultApp)
            this._scriptPath = argv[1], userArgs = argv.slice(2);
          else
            userArgs = argv.slice(1);
          break;
        case "user":
          userArgs = argv.slice(0);
          break;
        case "eval":
          userArgs = argv.slice(1);
          break;
        default:
          throw Error(`unexpected parse option { from: '${parseOptions.from}' }`);
      }
      if (!this._name && this._scriptPath)
        this.nameFromFilename(this._scriptPath);
      return this._name = this._name || "program", userArgs;
    }
    parse(argv, parseOptions) {
      this._prepareForParse();
      let userArgs = this._prepareUserArgs(argv, parseOptions);
      return this._parseCommand([], userArgs), this;
    }
    async parseAsync(argv, parseOptions) {
      this._prepareForParse();
      let userArgs = this._prepareUserArgs(argv, parseOptions);
      return await this._parseCommand([], userArgs), this;
    }
    _prepareForParse() {
      if (this._savedState === null)
        this.saveStateBeforeParse();
      else
        this.restoreStateBeforeParse();
    }
    saveStateBeforeParse() {
      this._savedState = {
        _name: this._name,
        _optionValues: { ...this._optionValues },
        _optionValueSources: { ...this._optionValueSources }
      };
    }
    restoreStateBeforeParse() {
      if (this._storeOptionsAsProperties)
        throw Error(`Can not call parse again when storeOptionsAsProperties is true.
- either make a new Command for each call to parse, or stop storing options as properties`);
      this._name = this._savedState._name, this._scriptPath = null, this.rawArgs = [], this._optionValues = { ...this._savedState._optionValues }, this._optionValueSources = { ...this._savedState._optionValueSources }, this.args = [], this.processedArgs = [];
    }
    _checkForMissingExecutable(executableFile, executableDir, subcommandName) {
      if (fs18.existsSync(executableFile))
        return;
      let executableDirMessage = executableDir ? `searched for local subcommand relative to directory '${executableDir}'` : "no directory for search for local subcommand, use .executableDir() to supply a custom directory", executableMissing = `'${executableFile}' does not exist
 - if '${subcommandName}' is not meant to be an executable command, remove description parameter from '.command()' and use '.description()' instead
 - if the default executable name is not suitable, use the executableFile option to supply a custom name or path
 - ${executableDirMessage}`;
      throw Error(executableMissing);
    }
    _executeSubCommand(subcommand, args) {
      args = args.slice();
      let launchWithNode = !1, sourceExt = [".js", ".ts", ".tsx", ".mjs", ".cjs"];
      function findFile(baseDir, baseName) {
        let localBin = path25.resolve(baseDir, baseName);
        if (fs18.existsSync(localBin))
          return localBin;
        if (sourceExt.includes(path25.extname(baseName)))
          return;
        let foundExt = sourceExt.find((ext) => fs18.existsSync(`${localBin}${ext}`));
        if (foundExt)
          return `${localBin}${foundExt}`;
        return;
      }
      this._checkForMissingMandatoryOptions(), this._checkForConflictingOptions();
      let executableFile = subcommand._executableFile || `${this._name}-${subcommand._name}`, executableDir = this._executableDir || "";
      if (this._scriptPath) {
        let resolvedScriptPath;
        try {
          resolvedScriptPath = fs18.realpathSync(this._scriptPath);
        } catch {
          resolvedScriptPath = this._scriptPath;
        }
        executableDir = path25.resolve(path25.dirname(resolvedScriptPath), executableDir);
      }
      if (executableDir) {
        let localFile = findFile(executableDir, executableFile);
        if (!localFile && !subcommand._executableFile && this._scriptPath) {
          let legacyName = path25.basename(this._scriptPath, path25.extname(this._scriptPath));
          if (legacyName !== this._name)
            localFile = findFile(executableDir, `${legacyName}-${subcommand._name}`);
        }
        executableFile = localFile || executableFile;
      }
      launchWithNode = sourceExt.includes(path25.extname(executableFile));
      let proc;
      if (process24.platform !== "win32")
        if (launchWithNode)
          args.unshift(executableFile), args = incrementNodeInspectorPort(process24.execArgv).concat(args), proc = childProcess3.spawn(process24.argv[0], args, { stdio: "inherit" });
        else
          proc = childProcess3.spawn(executableFile, args, { stdio: "inherit" });
      else
        this._checkForMissingExecutable(executableFile, executableDir, subcommand._name), args.unshift(executableFile), args = incrementNodeInspectorPort(process24.execArgv).concat(args), proc = childProcess3.spawn(process24.execPath, args, { stdio: "inherit" });
      if (!proc.killed)
        ["SIGUSR1", "SIGUSR2", "SIGTERM", "SIGINT", "SIGHUP"].forEach((signal) => {
          process24.on(signal, () => {
            if (proc.killed === !1 && proc.exitCode === null)
              proc.kill(signal);
          });
        });
      let exitCallback = this._exitCallback;
      proc.on("close", (code) => {
        if (code = code ?? 1, !exitCallback)
          process24.exit(code);
        else
          exitCallback(new CommanderError(code, "commander.executeSubCommandAsync", "(close)"));
      }), proc.on("error", (err2) => {
        if (err2.code === "ENOENT")
          this._checkForMissingExecutable(executableFile, executableDir, subcommand._name);
        else if (err2.code === "EACCES")
          throw Error(`'${executableFile}' not executable`);
        if (!exitCallback)
          process24.exit(1);
        else {
          let wrappedError = new CommanderError(1, "commander.executeSubCommandAsync", "(error)");
          wrappedError.nestedError = err2, exitCallback(wrappedError);
        }
      }), this.runningCommand = proc;
    }
    _dispatchSubcommand(commandName, operands, unknown3) {
      let subCommand = this._findCommand(commandName);
      if (!subCommand)
        this.help({ error: !0 });
      subCommand._prepareForParse();
      let promiseChain;
      return promiseChain = this._chainOrCallSubCommandHook(promiseChain, subCommand, "preSubcommand"), promiseChain = this._chainOrCall(promiseChain, () => {
        if (subCommand._executableHandler)
          this._executeSubCommand(subCommand, operands.concat(unknown3));
        else
          return subCommand._parseCommand(operands, unknown3);
      }), promiseChain;
    }
    _dispatchHelpCommand(subcommandName) {
      if (!subcommandName)
        this.help();
      let subCommand = this._findCommand(subcommandName);
      if (subCommand && !subCommand._executableHandler)
        subCommand.help();
      return this._dispatchSubcommand(subcommandName, [], [this._getHelpOption()?.long ?? this._getHelpOption()?.short ?? "--help"]);
    }
    _checkNumberOfArguments() {
      if (this.registeredArguments.forEach((arg, i5) => {
        if (arg.required && this.args[i5] == null)
          this.missingArgument(arg.name());
      }), this.registeredArguments.length > 0 && this.registeredArguments[this.registeredArguments.length - 1].variadic)
        return;
      if (this.args.length > this.registeredArguments.length)
        this._excessArguments(this.args);
    }
    _processArguments() {
      let myParseArg = (argument, value, previous) => {
        let parsedValue = value;
        if (value !== null && argument.parseArg) {
          let invalidValueMessage = `error: command-argument value '${value}' is invalid for argument '${argument.name()}'.`;
          parsedValue = this._callParseArg(argument, value, previous, invalidValueMessage);
        }
        return parsedValue;
      };
      this._checkNumberOfArguments();
      let processedArgs = [];
      this.registeredArguments.forEach((declaredArg, index) => {
        let value = declaredArg.defaultValue;
        if (declaredArg.variadic) {
          if (index < this.args.length) {
            if (value = this.args.slice(index), declaredArg.parseArg)
              value = value.reduce((processed, v2) => {
                return myParseArg(declaredArg, v2, processed);
              }, declaredArg.defaultValue);
          } else if (value === void 0)
            value = [];
        } else if (index < this.args.length) {
          if (value = this.args[index], declaredArg.parseArg)
            value = myParseArg(declaredArg, value, declaredArg.defaultValue);
        }
        processedArgs[index] = value;
      }), this.processedArgs = processedArgs;
    }
    _chainOrCall(promise3, fn) {
      if (promise3 && promise3.then && typeof promise3.then === "function")
        return promise3.then(() => fn());
      return fn();
    }
    _chainOrCallHooks(promise3, event) {
      let result = promise3, hooks2 = [];
      if (this._getCommandAndAncestors().reverse().filter((cmd) => cmd._lifeCycleHooks[event] !== void 0).forEach((hookedCommand) => {
        hookedCommand._lifeCycleHooks[event].forEach((callback) => {
          hooks2.push({ hookedCommand, callback });
        });
      }), event === "postAction")
        hooks2.reverse();
      return hooks2.forEach((hookDetail) => {
        result = this._chainOrCall(result, () => {
          return hookDetail.callback(hookDetail.hookedCommand, this);
        });
      }), result;
    }
    _chainOrCallSubCommandHook(promise3, subCommand, event) {
      let result = promise3;
      if (this._lifeCycleHooks[event] !== void 0)
        this._lifeCycleHooks[event].forEach((hook) => {
          result = this._chainOrCall(result, () => {
            return hook(this, subCommand);
          });
        });
      return result;
    }
    _parseCommand(operands, unknown3) {
      let parsed = this.parseOptions(unknown3);
      if (this._parseOptionsEnv(), this._parseOptionsImplied(), operands = operands.concat(parsed.operands), unknown3 = parsed.unknown, this.args = operands.concat(unknown3), operands && this._findCommand(operands[0]))
        return this._dispatchSubcommand(operands[0], operands.slice(1), unknown3);
      if (this._getHelpCommand() && operands[0] === this._getHelpCommand().name())
        return this._dispatchHelpCommand(operands[1]);
      if (this._defaultCommandName)
        return this._outputHelpIfRequested(unknown3), this._dispatchSubcommand(this._defaultCommandName, operands, unknown3);
      if (this.commands.length && this.args.length === 0 && !this._actionHandler && !this._defaultCommandName)
        this.help({ error: !0 });
      this._outputHelpIfRequested(parsed.unknown), this._checkForMissingMandatoryOptions(), this._checkForConflictingOptions();
      let checkForUnknownOptions = () => {
        if (parsed.unknown.length > 0)
          this.unknownOption(parsed.unknown[0]);
      }, commandEvent = `command:${this.name()}`;
      if (this._actionHandler) {
        checkForUnknownOptions(), this._processArguments();
        let promiseChain;
        if (promiseChain = this._chainOrCallHooks(promiseChain, "preAction"), promiseChain = this._chainOrCall(promiseChain, () => this._actionHandler(this.processedArgs)), this.parent)
          promiseChain = this._chainOrCall(promiseChain, () => {
            this.parent.emit(commandEvent, operands, unknown3);
          });
        return promiseChain = this._chainOrCallHooks(promiseChain, "postAction"), promiseChain;
      }
      if (this.parent && this.parent.listenerCount(commandEvent))
        checkForUnknownOptions(), this._processArguments(), this.parent.emit(commandEvent, operands, unknown3);
      else if (operands.length) {
        if (this._findCommand("*"))
          return this._dispatchSubcommand("*", operands, unknown3);
        if (this.listenerCount("command:*"))
          this.emit("command:*", operands, unknown3);
        else if (this.commands.length)
          this.unknownCommand();
        else
          checkForUnknownOptions(), this._processArguments();
      } else if (this.commands.length)
        checkForUnknownOptions(), this.help({ error: !0 });
      else
        checkForUnknownOptions(), this._processArguments();
    }
    _findCommand(name3) {
      if (!name3)
        return;
      return this.commands.find((cmd) => cmd._name === name3 || cmd._aliases.includes(name3));
    }
    _findOption(arg) {
      return this.options.find((option) => option.is(arg));
    }
    _checkForMissingMandatoryOptions() {
      this._getCommandAndAncestors().forEach((cmd) => {
        cmd.options.forEach((anOption) => {
          if (anOption.mandatory && cmd.getOptionValue(anOption.attributeName()) === void 0)
            cmd.missingMandatoryOptionValue(anOption);
        });
      });
    }
    _checkForConflictingLocalOptions() {
      let definedNonDefaultOptions = this.options.filter((option) => {
        let optionKey = option.attributeName();
        if (this.getOptionValue(optionKey) === void 0)
          return !1;
        return this.getOptionValueSource(optionKey) !== "default";
      });
      definedNonDefaultOptions.filter((option) => option.conflictsWith.length > 0).forEach((option) => {
        let conflictingAndDefined = definedNonDefaultOptions.find((defined) => option.conflictsWith.includes(defined.attributeName()));
        if (conflictingAndDefined)
          this._conflictingOption(option, conflictingAndDefined);
      });
    }
    _checkForConflictingOptions() {
      this._getCommandAndAncestors().forEach((cmd) => {
        cmd._checkForConflictingLocalOptions();
      });
    }
    parseOptions(argv) {
      let operands = [], unknown3 = [], dest = operands, args = argv.slice();
      function maybeOption(arg) {
        return arg.length > 1 && arg[0] === "-";
      }
      let activeVariadicOption = null;
      while (args.length) {
        let arg = args.shift();
        if (arg === "--") {
          if (dest === unknown3)
            dest.push(arg);
          dest.push(...args);
          break;
        }
        if (activeVariadicOption && !maybeOption(arg)) {
          this.emit(`option:${activeVariadicOption.name()}`, arg);
          continue;
        }
        if (activeVariadicOption = null, maybeOption(arg)) {
          let option = this._findOption(arg);
          if (option) {
            if (option.required) {
              let value = args.shift();
              if (value === void 0)
                this.optionMissingArgument(option);
              this.emit(`option:${option.name()}`, value);
            } else if (option.optional) {
              let value = null;
              if (args.length > 0 && !maybeOption(args[0]))
                value = args.shift();
              this.emit(`option:${option.name()}`, value);
            } else
              this.emit(`option:${option.name()}`);
            activeVariadicOption = option.variadic ? option : null;
            continue;
          }
        }
        if (arg.length > 2 && arg[0] === "-" && arg[1] !== "-") {
          let option = this._findOption(`-${arg[1]}`);
          if (option) {
            if (option.required || option.optional && this._combineFlagAndOptionalValue)
              this.emit(`option:${option.name()}`, arg.slice(2));
            else
              this.emit(`option:${option.name()}`), args.unshift(`-${arg.slice(2)}`);
            continue;
          }
        }
        if (/^--[^=]+=/.test(arg)) {
          let index = arg.indexOf("="), option = this._findOption(arg.slice(0, index));
          if (option && (option.required || option.optional)) {
            this.emit(`option:${option.name()}`, arg.slice(index + 1));
            continue;
          }
        }
        if (maybeOption(arg))
          dest = unknown3;
        if ((this._enablePositionalOptions || this._passThroughOptions) && operands.length === 0 && unknown3.length === 0) {
          if (this._findCommand(arg)) {
            if (operands.push(arg), args.length > 0)
              unknown3.push(...args);
            break;
          } else if (this._getHelpCommand() && arg === this._getHelpCommand().name()) {
            if (operands.push(arg), args.length > 0)
              operands.push(...args);
            break;
          } else if (this._defaultCommandName) {
            if (unknown3.push(arg), args.length > 0)
              unknown3.push(...args);
            break;
          }
        }
        if (this._passThroughOptions) {
          if (dest.push(arg), args.length > 0)
            dest.push(...args);
          break;
        }
        dest.push(arg);
      }
      return { operands, unknown: unknown3 };
    }
    opts() {
      if (this._storeOptionsAsProperties) {
        let result = {}, len = this.options.length;
        for (let i5 = 0;i5 < len; i5++) {
          let key3 = this.options[i5].attributeName();
          result[key3] = key3 === this._versionOptionName ? this._version : this[key3];
        }
        return result;
      }
      return this._optionValues;
    }
    optsWithGlobals() {
      return this._getCommandAndAncestors().reduce((combinedOptions, cmd) => Object.assign(combinedOptions, cmd.opts()), {});
    }
    error(message, errorOptions) {
      if (this._outputConfiguration.outputError(`${message}
`, this._outputConfiguration.writeErr), typeof this._showHelpAfterError === "string")
        this._outputConfiguration.writeErr(`${this._showHelpAfterError}
`);
      else if (this._showHelpAfterError)
        this._outputConfiguration.writeErr(`
`), this.outputHelp({ error: !0 });
      let config11 = errorOptions || {}, exitCode = config11.exitCode || 1, code = config11.code || "commander.error";
      this._exit(exitCode, code, message);
    }
    _parseOptionsEnv() {
      this.options.forEach((option) => {
        if (option.envVar && option.envVar in process24.env) {
          let optionKey = option.attributeName();
          if (this.getOptionValue(optionKey) === void 0 || ["default", "config", "env"].includes(this.getOptionValueSource(optionKey)))
            if (option.required || option.optional)
              this.emit(`optionEnv:${option.name()}`, process24.env[option.envVar]);
            else
              this.emit(`optionEnv:${option.name()}`);
        }
      });
    }
    _parseOptionsImplied() {
      let dualHelper = new DualOptions(this.options), hasCustomOptionValue = (optionKey) => {
        return this.getOptionValue(optionKey) !== void 0 && !["default", "implied"].includes(this.getOptionValueSource(optionKey));
      };
      this.options.filter((option) => option.implied !== void 0 && hasCustomOptionValue(option.attributeName()) && dualHelper.valueFromOption(this.getOptionValue(option.attributeName()), option)).forEach((option) => {
        Object.keys(option.implied).filter((impliedKey) => !hasCustomOptionValue(impliedKey)).forEach((impliedKey) => {
          this.setOptionValueWithSource(impliedKey, option.implied[impliedKey], "implied");
        });
      });
    }
    missingArgument(name3) {
      let message = `error: missing required argument '${name3}'`;
      this.error(message, { code: "commander.missingArgument" });
    }
    optionMissingArgument(option) {
      let message = `error: option '${option.flags}' argument missing`;
      this.error(message, { code: "commander.optionMissingArgument" });
    }
    missingMandatoryOptionValue(option) {
      let message = `error: required option '${option.flags}' not specified`;
      this.error(message, { code: "commander.missingMandatoryOptionValue" });
    }
    _conflictingOption(option, conflictingOption) {
      let findBestOptionFromValue = (option2) => {
        let optionKey = option2.attributeName(), optionValue = this.getOptionValue(optionKey), negativeOption = this.options.find((target) => target.negate && optionKey === target.attributeName()), positiveOption = this.options.find((target) => !target.negate && optionKey === target.attributeName());
        if (negativeOption && (negativeOption.presetArg === void 0 && optionValue === !1 || negativeOption.presetArg !== void 0 && optionValue === negativeOption.presetArg))
          return negativeOption;
        return positiveOption || option2;
      }, getErrorMessage4 = (option2) => {
        let bestOption = findBestOptionFromValue(option2), optionKey = bestOption.attributeName();
        if (this.getOptionValueSource(optionKey) === "env")
          return `environment variable '${bestOption.envVar}'`;
        return `option '${bestOption.flags}'`;
      }, message = `error: ${getErrorMessage4(option)} cannot be used with ${getErrorMessage4(conflictingOption)}`;
      this.error(message, { code: "commander.conflictingOption" });
    }
    unknownOption(flag) {
      if (this._allowUnknownOption)
        return;
      let suggestion = "";
      if (flag.startsWith("--") && this._showSuggestionAfterError) {
        let candidateFlags = [], command19 = this;
        do {
          let moreFlags = command19.createHelp().visibleOptions(command19).filter((option) => option.long).map((option) => option.long);
          candidateFlags = candidateFlags.concat(moreFlags), command19 = command19.parent;
        } while (command19 && !command19._enablePositionalOptions);
        suggestion = suggestSimilar(flag, candidateFlags);
      }
      let message = `error: unknown option '${flag}'${suggestion}`;
      this.error(message, { code: "commander.unknownOption" });
    }
    _excessArguments(receivedArgs) {
      if (this._allowExcessArguments)
        return;
      let expected = this.registeredArguments.length, s2 = expected === 1 ? "" : "s", message = `error: too many arguments${this.parent ? ` for '${this.name()}'` : ""}. Expected ${expected} argument${s2} but got ${receivedArgs.length}.`;
      this.error(message, { code: "commander.excessArguments" });
    }
    unknownCommand() {
      let unknownName = this.args[0], suggestion = "";
      if (this._showSuggestionAfterError) {
        let candidateNames = [];
        this.createHelp().visibleCommands(this).forEach((command19) => {
          if (candidateNames.push(command19.name()), command19.alias())
            candidateNames.push(command19.alias());
        }), suggestion = suggestSimilar(unknownName, candidateNames);
      }
      let message = `error: unknown command '${unknownName}'${suggestion}`;
      this.error(message, { code: "commander.unknownCommand" });
    }
    version(str2, flags, description) {
      if (str2 === void 0)
        return this._version;
      this._version = str2, flags = flags || "-V, --version", description = description || "output the version number";
      let versionOption = this.createOption(flags, description);
      return this._versionOptionName = versionOption.attributeName(), this._registerOption(versionOption), this.on("option:" + versionOption.name(), () => {
        this._outputConfiguration.writeOut(`${str2}
`), this._exit(0, "commander.version", str2);
      }), this;
    }
    description(str2, argsDescription) {
      if (str2 === void 0 && argsDescription === void 0)
        return this._description;
      if (this._description = str2, argsDescription)
        this._argsDescription = argsDescription;
      return this;
    }
    summary(str2) {
      if (str2 === void 0)
        return this._summary;
      return this._summary = str2, this;
    }
    alias(alias) {
      if (alias === void 0)
        return this._aliases[0];
      let command19 = this;
      if (this.commands.length !== 0 && this.commands[this.commands.length - 1]._executableHandler)
        command19 = this.commands[this.commands.length - 1];
      if (alias === command19._name)
        throw Error("Command alias can't be the same as its name");
      let matchingCommand = this.parent?._findCommand(alias);
      if (matchingCommand) {
        let existingCmd = [matchingCommand.name()].concat(matchingCommand.aliases()).join("|");
        throw Error(`cannot add alias '${alias}' to command '${this.name()}' as already have command '${existingCmd}'`);
      }
      return command19._aliases.push(alias), this;
    }
    aliases(aliases2) {
      if (aliases2 === void 0)
        return this._aliases;
      return aliases2.forEach((alias) => this.alias(alias)), this;
    }
    usage(str2) {
      if (str2 === void 0) {
        if (this._usage)
          return this._usage;
        let args = this.registeredArguments.map((arg) => {
          return humanReadableArgName(arg);
        });
        return [].concat(this.options.length || this._helpOption !== null ? "[options]" : [], this.commands.length ? "[command]" : [], this.registeredArguments.length ? args : []).join(" ");
      }
      return this._usage = str2, this;
    }
    name(str2) {
      if (str2 === void 0)
        return this._name;
      return this._name = str2, this;
    }
    nameFromFilename(filename) {
      return this._name = path25.basename(filename, path25.extname(filename)), this;
    }
    executableDir(path26) {
      if (path26 === void 0)
        return this._executableDir;
      return this._executableDir = path26, this;
    }
    helpInformation(contextOptions) {
      let helper = this.createHelp(), context7 = this._getOutputContext(contextOptions);
      helper.prepareContext({
        error: context7.error,
        helpWidth: context7.helpWidth,
        outputHasColors: context7.hasColors
      });
      let text2 = helper.formatHelp(this, helper);
      if (context7.hasColors)
        return text2;
      return this._outputConfiguration.stripColor(text2);
    }
    _getOutputContext(contextOptions) {
      contextOptions = contextOptions || {};
      let error44 = !!contextOptions.error, baseWrite, hasColors2, helpWidth;
      if (error44)
        baseWrite = (str2) => this._outputConfiguration.writeErr(str2), hasColors2 = this._outputConfiguration.getErrHasColors(), helpWidth = this._outputConfiguration.getErrHelpWidth();
      else
        baseWrite = (str2) => this._outputConfiguration.writeOut(str2), hasColors2 = this._outputConfiguration.getOutHasColors(), helpWidth = this._outputConfiguration.getOutHelpWidth();
      return { error: error44, write: (str2) => {
        if (!hasColors2)
          str2 = this._outputConfiguration.stripColor(str2);
        return baseWrite(str2);
      }, hasColors: hasColors2, helpWidth };
    }
    outputHelp(contextOptions) {
      let deprecatedCallback;
      if (typeof contextOptions === "function")
        deprecatedCallback = contextOptions, contextOptions = void 0;
      let outputContext = this._getOutputContext(contextOptions), eventContext = {
        error: outputContext.error,
        write: outputContext.write,
        command: this
      };
      this._getCommandAndAncestors().reverse().forEach((command19) => command19.emit("beforeAllHelp", eventContext)), this.emit("beforeHelp", eventContext);
      let helpInformation = this.helpInformation({ error: outputContext.error });
      if (deprecatedCallback) {
        if (helpInformation = deprecatedCallback(helpInformation), typeof helpInformation !== "string" && !Buffer.isBuffer(helpInformation))
          throw Error("outputHelp callback must return a string or a Buffer");
      }
      if (outputContext.write(helpInformation), this._getHelpOption()?.long)
        this.emit(this._getHelpOption().long);
      this.emit("afterHelp", eventContext), this._getCommandAndAncestors().forEach((command19) => command19.emit("afterAllHelp", eventContext));
    }
    helpOption(flags, description) {
      if (typeof flags === "boolean") {
        if (flags)
          this._helpOption = this._helpOption ?? void 0;
        else
          this._helpOption = null;
        return this;
      }
      return flags = flags ?? "-h, --help", description = description ?? "display help for command", this._helpOption = this.createOption(flags, description), this;
    }
    _getHelpOption() {
      if (this._helpOption === void 0)
        this.helpOption(void 0, void 0);
      return this._helpOption;
    }
    addHelpOption(option) {
      return this._helpOption = option, this;
    }
    help(contextOptions) {
      this.outputHelp(contextOptions);
      let exitCode = Number(process24.exitCode ?? 0);
      if (exitCode === 0 && contextOptions && typeof contextOptions !== "function" && contextOptions.error)
        exitCode = 1;
      this._exit(exitCode, "commander.help", "(outputHelp)");
    }
    addHelpText(position, text2) {
      let allowedValues = ["beforeAll", "before", "after", "afterAll"];
      if (!allowedValues.includes(position))
        throw Error(`Unexpected value for position to addHelpText.
Expecting one of '${allowedValues.join("', '")}'`);
      let helpEvent = `${position}Help`;
      return this.on(helpEvent, (context7) => {
        let helpStr;
        if (typeof text2 === "function")
          helpStr = text2({ error: context7.error, command: context7.command });
        else
          helpStr = text2;
        if (helpStr)
          context7.write(`${helpStr}
`);
      }), this;
    }
    _outputHelpIfRequested(args) {
      let helpOption = this._getHelpOption();
      if (helpOption && args.find((arg) => helpOption.is(arg)))
        this.outputHelp(), this._exit(0, "commander.helpDisplayed", "(outputHelp)");
    }
  }
  function incrementNodeInspectorPort(args) {
    return args.map((arg) => {
      if (!arg.startsWith("--inspect"))
        return arg;
      let debugOption, debugHost = "127.0.0.1", debugPort = "9229", match;
      if ((match = arg.match(/^(--inspect(-brk)?)$/)) !== null)
        debugOption = match[1];
      else if ((match = arg.match(/^(--inspect(-brk|-port)?)=([^:]+)$/)) !== null)
        if (debugOption = match[1], /^\d+$/.test(match[3]))
          debugPort = match[3];
        else
          debugHost = match[3];
      else if ((match = arg.match(/^(--inspect(-brk|-port)?)=([^:]+):(\d+)$/)) !== null)
        debugOption = match[1], debugHost = match[3], debugPort = match[4];
      if (debugOption && debugPort !== "0")
        return `${debugOption}=${debugHost}:${parseInt(debugPort) + 1}`;
      return arg;
    });
  }
  function useColor() {
    if (process24.env.NO_COLOR || process24.env.FORCE_COLOR === "0" || process24.env.FORCE_COLOR === "false")
      return !1;
    if (process24.env.FORCE_COLOR || process24.env.CLICOLOR_FORCE !== void 0)
      return !0;
    return;
  }
  exports.Command = Command5;
  exports.useColor = useColor;
});
