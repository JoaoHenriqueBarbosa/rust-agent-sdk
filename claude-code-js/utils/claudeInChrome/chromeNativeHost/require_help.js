// var: require_help
var require_help = __commonJS((exports) => {
  var { humanReadableArgName } = require_argument();

  class Help {
    constructor() {
      this.helpWidth = void 0, this.minWidthToWrap = 40, this.sortSubcommands = !1, this.sortOptions = !1, this.showGlobalOptions = !1;
    }
    prepareContext(contextOptions) {
      this.helpWidth = this.helpWidth ?? contextOptions.helpWidth ?? 80;
    }
    visibleCommands(cmd) {
      let visibleCommands = cmd.commands.filter((cmd2) => !cmd2._hidden), helpCommand = cmd._getHelpCommand();
      if (helpCommand && !helpCommand._hidden)
        visibleCommands.push(helpCommand);
      if (this.sortSubcommands)
        visibleCommands.sort((a2, b) => {
          return a2.name().localeCompare(b.name());
        });
      return visibleCommands;
    }
    compareOptions(a2, b) {
      let getSortKey = (option) => {
        return option.short ? option.short.replace(/^-/, "") : option.long.replace(/^--/, "");
      };
      return getSortKey(a2).localeCompare(getSortKey(b));
    }
    visibleOptions(cmd) {
      let visibleOptions = cmd.options.filter((option) => !option.hidden), helpOption = cmd._getHelpOption();
      if (helpOption && !helpOption.hidden) {
        let removeShort = helpOption.short && cmd._findOption(helpOption.short), removeLong = helpOption.long && cmd._findOption(helpOption.long);
        if (!removeShort && !removeLong)
          visibleOptions.push(helpOption);
        else if (helpOption.long && !removeLong)
          visibleOptions.push(cmd.createOption(helpOption.long, helpOption.description));
        else if (helpOption.short && !removeShort)
          visibleOptions.push(cmd.createOption(helpOption.short, helpOption.description));
      }
      if (this.sortOptions)
        visibleOptions.sort(this.compareOptions);
      return visibleOptions;
    }
    visibleGlobalOptions(cmd) {
      if (!this.showGlobalOptions)
        return [];
      let globalOptions = [];
      for (let ancestorCmd = cmd.parent;ancestorCmd; ancestorCmd = ancestorCmd.parent) {
        let visibleOptions = ancestorCmd.options.filter((option) => !option.hidden);
        globalOptions.push(...visibleOptions);
      }
      if (this.sortOptions)
        globalOptions.sort(this.compareOptions);
      return globalOptions;
    }
    visibleArguments(cmd) {
      if (cmd._argsDescription)
        cmd.registeredArguments.forEach((argument) => {
          argument.description = argument.description || cmd._argsDescription[argument.name()] || "";
        });
      if (cmd.registeredArguments.find((argument) => argument.description))
        return cmd.registeredArguments;
      return [];
    }
    subcommandTerm(cmd) {
      let args = cmd.registeredArguments.map((arg) => humanReadableArgName(arg)).join(" ");
      return cmd._name + (cmd._aliases[0] ? "|" + cmd._aliases[0] : "") + (cmd.options.length ? " [options]" : "") + (args ? " " + args : "");
    }
    optionTerm(option) {
      return option.flags;
    }
    argumentTerm(argument) {
      return argument.name();
    }
    longestSubcommandTermLength(cmd, helper) {
      return helper.visibleCommands(cmd).reduce((max2, command19) => {
        return Math.max(max2, this.displayWidth(helper.styleSubcommandTerm(helper.subcommandTerm(command19))));
      }, 0);
    }
    longestOptionTermLength(cmd, helper) {
      return helper.visibleOptions(cmd).reduce((max2, option) => {
        return Math.max(max2, this.displayWidth(helper.styleOptionTerm(helper.optionTerm(option))));
      }, 0);
    }
    longestGlobalOptionTermLength(cmd, helper) {
      return helper.visibleGlobalOptions(cmd).reduce((max2, option) => {
        return Math.max(max2, this.displayWidth(helper.styleOptionTerm(helper.optionTerm(option))));
      }, 0);
    }
    longestArgumentTermLength(cmd, helper) {
      return helper.visibleArguments(cmd).reduce((max2, argument) => {
        return Math.max(max2, this.displayWidth(helper.styleArgumentTerm(helper.argumentTerm(argument))));
      }, 0);
    }
    commandUsage(cmd) {
      let cmdName = cmd._name;
      if (cmd._aliases[0])
        cmdName = cmdName + "|" + cmd._aliases[0];
      let ancestorCmdNames = "";
      for (let ancestorCmd = cmd.parent;ancestorCmd; ancestorCmd = ancestorCmd.parent)
        ancestorCmdNames = ancestorCmd.name() + " " + ancestorCmdNames;
      return ancestorCmdNames + cmdName + " " + cmd.usage();
    }
    commandDescription(cmd) {
      return cmd.description();
    }
    subcommandDescription(cmd) {
      return cmd.summary() || cmd.description();
    }
    optionDescription(option) {
      let extraInfo = [];
      if (option.argChoices)
        extraInfo.push(`choices: ${option.argChoices.map((choice) => JSON.stringify(choice)).join(", ")}`);
      if (option.defaultValue !== void 0) {
        if (option.required || option.optional || option.isBoolean() && typeof option.defaultValue === "boolean")
          extraInfo.push(`default: ${option.defaultValueDescription || JSON.stringify(option.defaultValue)}`);
      }
      if (option.presetArg !== void 0 && option.optional)
        extraInfo.push(`preset: ${JSON.stringify(option.presetArg)}`);
      if (option.envVar !== void 0)
        extraInfo.push(`env: ${option.envVar}`);
      if (extraInfo.length > 0)
        return `${option.description} (${extraInfo.join(", ")})`;
      return option.description;
    }
    argumentDescription(argument) {
      let extraInfo = [];
      if (argument.argChoices)
        extraInfo.push(`choices: ${argument.argChoices.map((choice) => JSON.stringify(choice)).join(", ")}`);
      if (argument.defaultValue !== void 0)
        extraInfo.push(`default: ${argument.defaultValueDescription || JSON.stringify(argument.defaultValue)}`);
      if (extraInfo.length > 0) {
        let extraDescription = `(${extraInfo.join(", ")})`;
        if (argument.description)
          return `${argument.description} ${extraDescription}`;
        return extraDescription;
      }
      return argument.description;
    }
    formatHelp(cmd, helper) {
      let termWidth = helper.padWidth(cmd, helper), helpWidth = helper.helpWidth ?? 80;
      function callFormatItem(term, description) {
        return helper.formatItem(term, termWidth, description, helper);
      }
      let output = [
        `${helper.styleTitle("Usage:")} ${helper.styleUsage(helper.commandUsage(cmd))}`,
        ""
      ], commandDescription = helper.commandDescription(cmd);
      if (commandDescription.length > 0)
        output = output.concat([
          helper.boxWrap(helper.styleCommandDescription(commandDescription), helpWidth),
          ""
        ]);
      let argumentList = helper.visibleArguments(cmd).map((argument) => {
        return callFormatItem(helper.styleArgumentTerm(helper.argumentTerm(argument)), helper.styleArgumentDescription(helper.argumentDescription(argument)));
      });
      if (argumentList.length > 0)
        output = output.concat([
          helper.styleTitle("Arguments:"),
          ...argumentList,
          ""
        ]);
      let optionList = helper.visibleOptions(cmd).map((option) => {
        return callFormatItem(helper.styleOptionTerm(helper.optionTerm(option)), helper.styleOptionDescription(helper.optionDescription(option)));
      });
      if (optionList.length > 0)
        output = output.concat([
          helper.styleTitle("Options:"),
          ...optionList,
          ""
        ]);
      if (helper.showGlobalOptions) {
        let globalOptionList = helper.visibleGlobalOptions(cmd).map((option) => {
          return callFormatItem(helper.styleOptionTerm(helper.optionTerm(option)), helper.styleOptionDescription(helper.optionDescription(option)));
        });
        if (globalOptionList.length > 0)
          output = output.concat([
            helper.styleTitle("Global Options:"),
            ...globalOptionList,
            ""
          ]);
      }
      let commandList = helper.visibleCommands(cmd).map((cmd2) => {
        return callFormatItem(helper.styleSubcommandTerm(helper.subcommandTerm(cmd2)), helper.styleSubcommandDescription(helper.subcommandDescription(cmd2)));
      });
      if (commandList.length > 0)
        output = output.concat([
          helper.styleTitle("Commands:"),
          ...commandList,
          ""
        ]);
      return output.join(`
`);
    }
    displayWidth(str2) {
      return stripColor(str2).length;
    }
    styleTitle(str2) {
      return str2;
    }
    styleUsage(str2) {
      return str2.split(" ").map((word) => {
        if (word === "[options]")
          return this.styleOptionText(word);
        if (word === "[command]")
          return this.styleSubcommandText(word);
        if (word[0] === "[" || word[0] === "<")
          return this.styleArgumentText(word);
        return this.styleCommandText(word);
      }).join(" ");
    }
    styleCommandDescription(str2) {
      return this.styleDescriptionText(str2);
    }
    styleOptionDescription(str2) {
      return this.styleDescriptionText(str2);
    }
    styleSubcommandDescription(str2) {
      return this.styleDescriptionText(str2);
    }
    styleArgumentDescription(str2) {
      return this.styleDescriptionText(str2);
    }
    styleDescriptionText(str2) {
      return str2;
    }
    styleOptionTerm(str2) {
      return this.styleOptionText(str2);
    }
    styleSubcommandTerm(str2) {
      return str2.split(" ").map((word) => {
        if (word === "[options]")
          return this.styleOptionText(word);
        if (word[0] === "[" || word[0] === "<")
          return this.styleArgumentText(word);
        return this.styleSubcommandText(word);
      }).join(" ");
    }
    styleArgumentTerm(str2) {
      return this.styleArgumentText(str2);
    }
    styleOptionText(str2) {
      return str2;
    }
    styleArgumentText(str2) {
      return str2;
    }
    styleSubcommandText(str2) {
      return str2;
    }
    styleCommandText(str2) {
      return str2;
    }
    padWidth(cmd, helper) {
      return Math.max(helper.longestOptionTermLength(cmd, helper), helper.longestGlobalOptionTermLength(cmd, helper), helper.longestSubcommandTermLength(cmd, helper), helper.longestArgumentTermLength(cmd, helper));
    }
    preformatted(str2) {
      return /\n[^\S\r\n]/.test(str2);
    }
    formatItem(term, termWidth, description, helper) {
      let itemIndentStr = " ".repeat(2);
      if (!description)
        return itemIndentStr + term;
      let paddedTerm = term.padEnd(termWidth + term.length - helper.displayWidth(term)), spacerWidth = 2, remainingWidth = (this.helpWidth ?? 80) - termWidth - spacerWidth - 2, formattedDescription;
      if (remainingWidth < this.minWidthToWrap || helper.preformatted(description))
        formattedDescription = description;
      else
        formattedDescription = helper.boxWrap(description, remainingWidth).replace(/\n/g, `
` + " ".repeat(termWidth + spacerWidth));
      return itemIndentStr + paddedTerm + " ".repeat(spacerWidth) + formattedDescription.replace(/\n/g, `
${itemIndentStr}`);
    }
    boxWrap(str2, width) {
      if (width < this.minWidthToWrap)
        return str2;
      let rawLines = str2.split(/\r\n|\n/), chunkPattern = /[\s]*[^\s]+/g, wrappedLines = [];
      return rawLines.forEach((line) => {
        let chunks = line.match(chunkPattern);
        if (chunks === null) {
          wrappedLines.push("");
          return;
        }
        let sumChunks = [chunks.shift()], sumWidth = this.displayWidth(sumChunks[0]);
        chunks.forEach((chunk2) => {
          let visibleWidth = this.displayWidth(chunk2);
          if (sumWidth + visibleWidth <= width) {
            sumChunks.push(chunk2), sumWidth += visibleWidth;
            return;
          }
          wrappedLines.push(sumChunks.join(""));
          let nextChunk = chunk2.trimStart();
          sumChunks = [nextChunk], sumWidth = this.displayWidth(nextChunk);
        }), wrappedLines.push(sumChunks.join(""));
      }), wrappedLines.join(`
`);
    }
  }
  function stripColor(str2) {
    let sgrPattern = /\x1b\[\d*(;\d*)*m/g;
    return str2.replace(sgrPattern, "");
  }
  exports.Help = Help;
  exports.stripColor = stripColor;
});
