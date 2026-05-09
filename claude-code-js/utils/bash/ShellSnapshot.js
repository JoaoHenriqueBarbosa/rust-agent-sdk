// Original: src/utils/bash/ShellSnapshot.ts
import { execFile as execFile10 } from "child_process";
import { mkdir as mkdir17, stat as stat22 } from "fs/promises";
import * as os6 from "os";
import { join as join80 } from "path";
function createArgv0ShellFunction(funcName, argv0, binaryPath, prependArgs = []) {
  let quotedPath = quote([binaryPath]), argSuffix = prependArgs.length > 0 ? `${prependArgs.join(" ")} "$@"` : '"$@"';
  return [
    `function ${funcName} {`,
    "  if [[ -n $ZSH_VERSION ]]; then",
    `    ARGV0=${argv0} ${quotedPath} ${argSuffix}`,
    '  elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "win32" ]]; then',
    `    ARGV0=${argv0} ${quotedPath} ${argSuffix}`,
    "  elif [[ $BASHPID != $$ ]]; then",
    `    exec -a ${argv0} ${quotedPath} ${argSuffix}`,
    "  else",
    `    (exec -a ${argv0} ${quotedPath} ${argSuffix})`,
    "  fi",
    "}"
  ].join(`
`);
}
function createRipgrepShellIntegration() {
  let rgCommand = ripgrepCommand();
  if (rgCommand.argv0)
    return {
      type: "function",
      snippet: createArgv0ShellFunction("rg", rgCommand.argv0, rgCommand.rgPath)
    };
  let quotedPath = quote([rgCommand.rgPath]), quotedArgs = rgCommand.rgArgs.map((arg) => quote([arg]));
  return { type: "alias", snippet: rgCommand.rgArgs.length > 0 ? `${quotedPath} ${quotedArgs.join(" ")}` : quotedPath };
}
function createFindGrepShellIntegration() {
  if (!hasEmbeddedSearchTools())
    return null;
  let binaryPath = embeddedSearchToolsBinaryPath();
  return [
    "unalias find 2>/dev/null || true",
    "unalias grep 2>/dev/null || true",
    createArgv0ShellFunction("find", "bfs", binaryPath, [
      "-regextype",
      "findutils-default"
    ]),
    createArgv0ShellFunction("grep", "ugrep", binaryPath, [
      "-G",
      "--ignore-files",
      "--hidden",
      "-I",
      ...VCS_DIRECTORIES_TO_EXCLUDE.map((d) => `--exclude-dir=${d}`)
    ])
  ].join(`
`);
}
function getConfigFile(shellPath) {
  let fileName = shellPath.includes("zsh") ? ".zshrc" : shellPath.includes("bash") ? ".bashrc" : ".profile";
  return join80(os6.homedir(), fileName);
}
function getUserSnapshotContent(configFile) {
  let isZsh = configFile.endsWith(".zshrc"), content = "";
  if (isZsh)
    content += `
      echo "# Functions" >> "$SNAPSHOT_FILE"

      # Force autoload all functions first
      typeset -f > /dev/null 2>&1

      # Now get user function names - filter completion functions (single underscore prefix)
      # but keep double-underscore helpers (e.g. __zsh_like_cd from mise, __pyenv_init)
      typeset +f | grep -vE '^_[^_]' | while read func; do
        typeset -f "$func" >> "$SNAPSHOT_FILE"
      done
    `;
  else
    content += `
      echo "# Functions" >> "$SNAPSHOT_FILE"

      # Force autoload all functions first
      declare -f > /dev/null 2>&1

      # Now get user function names - filter completion functions (single underscore prefix)
      # but keep double-underscore helpers (e.g. __zsh_like_cd from mise, __pyenv_init)
      declare -F | cut -d' ' -f3 | grep -vE '^_[^_]' | while read func; do
        # Encode the function to base64, preserving all special characters
        encoded_func=$(declare -f "$func" | base64 )
        # Write the function definition to the snapshot
        echo "eval ${LITERAL_BACKSLASH}"${LITERAL_BACKSLASH}$(echo '$encoded_func' | base64 -d)${LITERAL_BACKSLASH}" > /dev/null 2>&1" >> "$SNAPSHOT_FILE"
      done
    `;
  if (isZsh)
    content += `
      echo "# Shell Options" >> "$SNAPSHOT_FILE"
      setopt | sed 's/^/setopt /' | head -n 1000 >> "$SNAPSHOT_FILE"
    `;
  else
    content += `
      echo "# Shell Options" >> "$SNAPSHOT_FILE"
      shopt -p | head -n 1000 >> "$SNAPSHOT_FILE"
      set -o | grep "on" | awk '{print "set -o " $1}' | head -n 1000 >> "$SNAPSHOT_FILE"
      echo "shopt -s expand_aliases" >> "$SNAPSHOT_FILE"
    `;
  return content += `
      echo "# Aliases" >> "$SNAPSHOT_FILE"
      # Filter out winpty aliases on Windows to avoid "stdin is not a tty" errors
      # Git Bash automatically creates aliases like "alias node='winpty node.exe'" for
      # programs that need Win32 Console in mintty, but winpty fails when there's no TTY
      if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
        alias | grep -v "='winpty " | sed 's/^alias //g' | sed 's/^/alias -- /' | head -n 1000 >> "$SNAPSHOT_FILE"
      else
        alias | sed 's/^alias //g' | sed 's/^/alias -- /' | head -n 1000 >> "$SNAPSHOT_FILE"
      fi
  `, content;
}
async function getClaudeCodeSnapshotContent() {
  let pathValue = process.env.PATH;
  if (getPlatform() === "windows") {
    let cygwinResult = await execa("echo $PATH", {
      shell: !0,
      reject: !1
    });
    if (cygwinResult.exitCode === 0 && cygwinResult.stdout)
      pathValue = cygwinResult.stdout.trim();
  }
  let rgIntegration = createRipgrepShellIntegration(), content = "";
  if (content += `
      # Check for rg availability
      echo "# Check for rg availability" >> "$SNAPSHOT_FILE"
      echo "if ! (unalias rg 2>/dev/null; command -v rg) >/dev/null 2>&1; then" >> "$SNAPSHOT_FILE"
  `, rgIntegration.type === "function")
    content += `
      cat >> "$SNAPSHOT_FILE" << 'RIPGREP_FUNC_END'
  ${rgIntegration.snippet}
RIPGREP_FUNC_END
    `;
  else {
    let escapedSnippet = rgIntegration.snippet.replace(/'/g, "'\\''");
    content += `
      echo '  alias rg='"'${escapedSnippet}'" >> "$SNAPSHOT_FILE"
    `;
  }
  content += `
      echo "fi" >> "$SNAPSHOT_FILE"
  `;
  let findGrepIntegration = createFindGrepShellIntegration();
  if (findGrepIntegration !== null)
    content += `
      # Shadow find/grep with embedded bfs/ugrep (ant-native only)
      echo "# Shadow find/grep with embedded bfs/ugrep" >> "$SNAPSHOT_FILE"
      cat >> "$SNAPSHOT_FILE" << 'FIND_GREP_FUNC_END'
${findGrepIntegration}
FIND_GREP_FUNC_END
    `;
  return content += `

      # Add PATH to the file
      echo "export PATH=${quote([pathValue || ""])}" >> "$SNAPSHOT_FILE"
  `, content;
}
async function getSnapshotScript(shellPath, snapshotFilePath, configFileExists) {
  let configFile = getConfigFile(shellPath), isZsh = configFile.endsWith(".zshrc"), userContent = configFileExists ? getUserSnapshotContent(configFile) : !isZsh ? 'echo "shopt -s expand_aliases" >> "$SNAPSHOT_FILE"' : "", claudeCodeContent = await getClaudeCodeSnapshotContent();
  return `SNAPSHOT_FILE=${quote([snapshotFilePath])}
      ${configFileExists ? `source "${configFile}" < /dev/null` : "# No user config file to source"}

      # First, create/clear the snapshot file
      echo "# Snapshot file" >| "$SNAPSHOT_FILE"

      # When this file is sourced, we first unalias to avoid conflicts
      # This is necessary because aliases get "frozen" inside function definitions at definition time,
      # which can cause unexpected behavior when functions use commands that conflict with aliases
      echo "# Unset all aliases to avoid conflicts with functions" >> "$SNAPSHOT_FILE"
      echo "unalias -a 2>/dev/null || true" >> "$SNAPSHOT_FILE"

      ${userContent}

      ${claudeCodeContent}

      # Exit silently on success, only report errors
      if [ ! -f "$SNAPSHOT_FILE" ]; then
        echo "Error: Snapshot file was not created at $SNAPSHOT_FILE" >&2
        exit 1
      fi
    `;
}
var LITERAL_BACKSLASH = "\\", SNAPSHOT_CREATION_TIMEOUT = 1e4, VCS_DIRECTORIES_TO_EXCLUDE, createAndSaveSnapshot = async (binShell) => {
  let shellType = binShell.includes("zsh") ? "zsh" : binShell.includes("bash") ? "bash" : "sh";
  return logForDebugging(`Creating shell snapshot for ${shellType} (${binShell})`), new Promise(async (resolve29) => {
    try {
      let configFile = getConfigFile(binShell);
      logForDebugging(`Looking for shell config file: ${configFile}`);
      let configFileExists = await pathExists(configFile);
      if (!configFileExists)
        logForDebugging(`Shell config file not found: ${configFile}, creating snapshot with Claude Code defaults only`);
      let timestamp = Date.now(), randomId = Math.random().toString(36).substring(2, 8), snapshotsDir = join80(getClaudeConfigHomeDir(), "shell-snapshots");
      logForDebugging(`Snapshots directory: ${snapshotsDir}`);
      let shellSnapshotPath = join80(snapshotsDir, `snapshot-${shellType}-${timestamp}-${randomId}.sh`);
      await mkdir17(snapshotsDir, { recursive: !0 });
      let snapshotScript = await getSnapshotScript(binShell, shellSnapshotPath, configFileExists);
      logForDebugging(`Creating snapshot at: ${shellSnapshotPath}`), logForDebugging(`Execution timeout: ${SNAPSHOT_CREATION_TIMEOUT}ms`), execFile10(binShell, ["-c", "-l", snapshotScript], {
        env: {
          ...process.env.CLAUDE_CODE_DONT_INHERIT_ENV ? {} : subprocessEnv(),
          SHELL: binShell,
          GIT_EDITOR: "true",
          CLAUDECODE: "1"
        },
        timeout: SNAPSHOT_CREATION_TIMEOUT,
        maxBuffer: 1048576,
        encoding: "utf8"
      }, async (error44, stdout, stderr) => {
        if (error44) {
          let execError = error44;
          if (logForDebugging(`Shell snapshot creation failed: ${error44.message}`), logForDebugging("Error details:"), logForDebugging(`  - Error code: ${execError?.code}`), logForDebugging(`  - Error signal: ${execError?.signal}`), logForDebugging(`  - Error killed: ${execError?.killed}`), logForDebugging(`  - Shell path: ${binShell}`), logForDebugging(`  - Config file: ${getConfigFile(binShell)}`), logForDebugging(`  - Config file exists: ${configFileExists}`), logForDebugging(`  - Working directory: ${getCwd()}`), logForDebugging(`  - Claude home: ${getClaudeConfigHomeDir()}`), logForDebugging(`Full snapshot script:
${snapshotScript}`), stdout)
            logForDebugging(`stdout output (${stdout.length} chars):
${stdout}`);
          else
            logForDebugging("No stdout output captured");
          if (stderr)
            logForDebugging(`stderr output (${stderr.length} chars): ${stderr}`);
          else
            logForDebugging("No stderr output captured");
          logError2(Error(`Failed to create shell snapshot: ${error44.message}`));
          let signalNumber = execError?.signal ? os6.constants.signals[execError.signal] : void 0;
          logEvent("tengu_shell_snapshot_failed", {
            stderr_length: stderr?.length || 0,
            has_error_code: !!execError?.code,
            error_signal_number: signalNumber,
            error_killed: execError?.killed
          }), resolve29(void 0);
        } else {
          let snapshotSize;
          try {
            snapshotSize = (await stat22(shellSnapshotPath)).size;
          } catch {}
          if (snapshotSize !== void 0)
            logForDebugging(`Shell snapshot created successfully (${snapshotSize} bytes)`), registerCleanup(async () => {
              try {
                await getFsImplementation().unlink(shellSnapshotPath), logForDebugging(`Cleaned up session snapshot: ${shellSnapshotPath}`);
              } catch (error45) {
                logForDebugging(`Error cleaning up session snapshot: ${error45}`);
              }
            }), resolve29(shellSnapshotPath);
          else {
            logForDebugging(`Shell snapshot file not found after creation: ${shellSnapshotPath}`), logForDebugging(`Checking if parent directory still exists: ${snapshotsDir}`);
            try {
              let dirContents = await getFsImplementation().readdir(snapshotsDir);
              logForDebugging(`Directory contains ${dirContents.length} files`);
            } catch {
              logForDebugging(`Parent directory does not exist or is not accessible: ${snapshotsDir}`);
            }
            logEvent("tengu_shell_unknown_error", {}), resolve29(void 0);
          }
        }
      });
    } catch (error44) {
      if (logForDebugging(`Unexpected error during snapshot creation: ${error44}`), error44 instanceof Error)
        logForDebugging(`Error stack trace: ${error44.stack}`);
      logError2(error44), logEvent("tengu_shell_snapshot_error", {}), resolve29(void 0);
    }
  });
};
var init_ShellSnapshot = __esm(() => {
  init_execa();
  init_cleanupRegistry();
  init_cwd2();
  init_debug();
  init_embeddedTools();
  init_envUtils();
  init_file();
  init_fsOperations();
  init_log3();
  init_platform();
  init_ripgrep();
  init_subprocessEnv();
  init_shellQuote();
  VCS_DIRECTORIES_TO_EXCLUDE = [
    ".git",
    ".svn",
    ".hg",
    ".bzr",
    ".jj",
    ".sl"
  ];
});
