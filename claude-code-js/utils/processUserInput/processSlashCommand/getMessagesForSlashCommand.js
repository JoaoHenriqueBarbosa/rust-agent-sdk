// function: getMessagesForSlashCommand
async function getMessagesForSlashCommand(commandName, args, setToolJSX, context6, precedingInputBlocks, imageContentBlocks, _isAlreadyProcessing, canUseTool, uuid8) {
  let command12 = getCommand(commandName, context6.options.commands);
  if (command12.type === "prompt" && command12.userInvocable !== !1)
    recordSkillUsage(commandName);
  if (command12.userInvocable === !1)
    return {
      messages: [createUserMessage({
        content: prepareUserContent({
          inputString: `/${commandName}`,
          precedingInputBlocks
        })
      }), createUserMessage({
        content: `This skill can only be invoked by Claude, not directly by users. Ask Claude to use the "${commandName}" skill for you.`
      })],
      shouldQuery: !1,
      command: command12
    };
  try {
    switch (command12.type) {
      case "local-jsx":
        return new Promise((resolve27) => {
          let doneWasCalled = !1, onDone = (result, options2) => {
            if (doneWasCalled = !0, options2?.display === "skip") {
              resolve27({
                messages: [],
                shouldQuery: !1,
                command: command12,
                nextInput: options2?.nextInput,
                submitNextInput: options2?.submitNextInput
              });
              return;
            }
            let metaMessages = (options2?.metaMessages ?? []).map((content) => createUserMessage({
              content,
              isMeta: !0
            })), skipTranscript = isFullscreenEnvEnabled() && typeof result === "string" && result.endsWith(" dismissed");
            resolve27({
              messages: options2?.display === "system" ? skipTranscript ? metaMessages : [createCommandInputMessage(formatCommandInput(command12, args)), createCommandInputMessage(`<local-command-stdout>${result}</local-command-stdout>`), ...metaMessages] : [createUserMessage({
                content: prepareUserContent({
                  inputString: formatCommandInput(command12, args),
                  precedingInputBlocks
                })
              }), result ? createUserMessage({
                content: `<local-command-stdout>${result}</local-command-stdout>`
              }) : createUserMessage({
                content: `<local-command-stdout>${NO_CONTENT_MESSAGE}</local-command-stdout>`
              }), ...metaMessages],
              shouldQuery: options2?.shouldQuery ?? !1,
              command: command12,
              nextInput: options2?.nextInput,
              submitNextInput: options2?.submitNextInput
            });
          };
          command12.load().then((mod) => mod.call(onDone, {
            ...context6,
            canUseTool
          }, args)).then((jsx) => {
            if (jsx == null)
              return;
            if (context6.options.isNonInteractiveSession) {
              resolve27({
                messages: [],
                shouldQuery: !1,
                command: command12
              });
              return;
            }
            if (doneWasCalled)
              return;
            setToolJSX({
              jsx,
              shouldHidePromptInput: !0,
              showSpinner: !1,
              isLocalJSXCommand: !0,
              isImmediate: command12.immediate === !0
            });
          }).catch((e) => {
            if (logError2(e), doneWasCalled)
              return;
            doneWasCalled = !0, setToolJSX({
              jsx: null,
              shouldHidePromptInput: !1,
              clearLocalJSX: !0
            }), resolve27({
              messages: [],
              shouldQuery: !1,
              command: command12
            });
          });
        });
      case "local": {
        let displayArgs = command12.isSensitive && args.trim() ? "***" : args, userMessage = createUserMessage({
          content: prepareUserContent({
            inputString: formatCommandInput(command12, displayArgs),
            precedingInputBlocks
          })
        });
        try {
          let syntheticCaveatMessage = createSyntheticUserCaveatMessage(), result = await (await command12.load()).call(args, context6);
          if (result.type === "skip")
            return {
              messages: [],
              shouldQuery: !1,
              command: command12
            };
          if (result.type === "compact") {
            let slashCommandMessages = [syntheticCaveatMessage, userMessage, ...result.displayText ? [createUserMessage({
              content: `<local-command-stdout>${result.displayText}</local-command-stdout>`,
              timestamp: new Date(Date.now() + 100).toISOString()
            })] : []], compactionResultWithSlashMessages = {
              ...result.compactionResult,
              messagesToKeep: [...result.compactionResult.messagesToKeep ?? [], ...slashCommandMessages]
            };
            return resetMicrocompactState(), {
              messages: buildPostCompactMessages(compactionResultWithSlashMessages),
              shouldQuery: !1,
              command: command12
            };
          }
          return {
            messages: [userMessage, createCommandInputMessage(`<local-command-stdout>${result.value}</local-command-stdout>`)],
            shouldQuery: !1,
            command: command12,
            resultText: result.value
          };
        } catch (e) {
          return logError2(e), {
            messages: [userMessage, createCommandInputMessage(`<local-command-stderr>${String(e)}</local-command-stderr>`)],
            shouldQuery: !1,
            command: command12
          };
        }
      }
      case "prompt":
        try {
          if (command12.context === "fork")
            return await executeForkedSlashCommand(command12, args, context6, precedingInputBlocks, setToolJSX, canUseTool ?? hasPermissionsToUseTool);
          return await getMessagesForPromptSlashCommand(command12, args, context6, precedingInputBlocks, imageContentBlocks, uuid8);
        } catch (e) {
          if (e instanceof AbortError)
            return {
              messages: [createUserMessage({
                content: prepareUserContent({
                  inputString: formatCommandInput(command12, args),
                  precedingInputBlocks
                })
              }), createUserInterruptionMessage({
                toolUse: !1
              })],
              shouldQuery: !1,
              command: command12
            };
          return {
            messages: [createUserMessage({
              content: prepareUserContent({
                inputString: formatCommandInput(command12, args),
                precedingInputBlocks
              })
            }), createUserMessage({
              content: `<local-command-stderr>${String(e)}</local-command-stderr>`
            })],
            shouldQuery: !1,
            command: command12
          };
        }
    }
  } catch (e) {
    if (e instanceof MalformedCommandError)
      return {
        messages: [createUserMessage({
          content: prepareUserContent({
            inputString: e.message,
            precedingInputBlocks
          })
        })],
        shouldQuery: !1,
        command: command12
      };
    throw e;
  }
}
