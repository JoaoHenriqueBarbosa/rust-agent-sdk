// var: init_readOnlyCommandValidation
var init_readOnlyCommandValidation = __esm(() => {
  init_platform();
  GIT_REF_SELECTION_FLAGS = {
    "--all": "none",
    "--branches": "none",
    "--tags": "none",
    "--remotes": "none"
  }, GIT_DATE_FILTER_FLAGS = {
    "--since": "string",
    "--after": "string",
    "--until": "string",
    "--before": "string"
  }, GIT_LOG_DISPLAY_FLAGS = {
    "--oneline": "none",
    "--graph": "none",
    "--decorate": "none",
    "--no-decorate": "none",
    "--date": "string",
    "--relative-date": "none"
  }, GIT_COUNT_FLAGS = {
    "--max-count": "number",
    "-n": "number"
  }, GIT_STAT_FLAGS = {
    "--stat": "none",
    "--numstat": "none",
    "--shortstat": "none",
    "--name-only": "none",
    "--name-status": "none"
  }, GIT_COLOR_FLAGS = {
    "--color": "none",
    "--no-color": "none"
  }, GIT_PATCH_FLAGS = {
    "--patch": "none",
    "-p": "none",
    "--no-patch": "none",
    "--no-ext-diff": "none",
    "-s": "none"
  }, GIT_AUTHOR_FILTER_FLAGS = {
    "--author": "string",
    "--committer": "string",
    "--grep": "string"
  }, GIT_READ_ONLY_COMMANDS = {
    "git diff": {
      safeFlags: {
        ...GIT_STAT_FLAGS,
        ...GIT_COLOR_FLAGS,
        "--dirstat": "none",
        "--summary": "none",
        "--patch-with-stat": "none",
        "--word-diff": "none",
        "--word-diff-regex": "string",
        "--color-words": "none",
        "--no-renames": "none",
        "--no-ext-diff": "none",
        "--check": "none",
        "--ws-error-highlight": "string",
        "--full-index": "none",
        "--binary": "none",
        "--abbrev": "number",
        "--break-rewrites": "none",
        "--find-renames": "none",
        "--find-copies": "none",
        "--find-copies-harder": "none",
        "--irreversible-delete": "none",
        "--diff-algorithm": "string",
        "--histogram": "none",
        "--patience": "none",
        "--minimal": "none",
        "--ignore-space-at-eol": "none",
        "--ignore-space-change": "none",
        "--ignore-all-space": "none",
        "--ignore-blank-lines": "none",
        "--inter-hunk-context": "number",
        "--function-context": "none",
        "--exit-code": "none",
        "--quiet": "none",
        "--cached": "none",
        "--staged": "none",
        "--pickaxe-regex": "none",
        "--pickaxe-all": "none",
        "--no-index": "none",
        "--relative": "string",
        "--diff-filter": "string",
        "-p": "none",
        "-u": "none",
        "-s": "none",
        "-M": "none",
        "-C": "none",
        "-B": "none",
        "-D": "none",
        "-l": "none",
        "-S": "string",
        "-G": "string",
        "-O": "string",
        "-R": "none"
      }
    },
    "git log": {
      safeFlags: {
        ...GIT_LOG_DISPLAY_FLAGS,
        ...GIT_REF_SELECTION_FLAGS,
        ...GIT_DATE_FILTER_FLAGS,
        ...GIT_COUNT_FLAGS,
        ...GIT_STAT_FLAGS,
        ...GIT_COLOR_FLAGS,
        ...GIT_PATCH_FLAGS,
        ...GIT_AUTHOR_FILTER_FLAGS,
        "--abbrev-commit": "none",
        "--full-history": "none",
        "--dense": "none",
        "--sparse": "none",
        "--simplify-merges": "none",
        "--ancestry-path": "none",
        "--source": "none",
        "--first-parent": "none",
        "--merges": "none",
        "--no-merges": "none",
        "--reverse": "none",
        "--walk-reflogs": "none",
        "--skip": "number",
        "--max-age": "number",
        "--min-age": "number",
        "--no-min-parents": "none",
        "--no-max-parents": "none",
        "--follow": "none",
        "--no-walk": "none",
        "--left-right": "none",
        "--cherry-mark": "none",
        "--cherry-pick": "none",
        "--boundary": "none",
        "--topo-order": "none",
        "--date-order": "none",
        "--author-date-order": "none",
        "--pretty": "string",
        "--format": "string",
        "--diff-filter": "string",
        "-S": "string",
        "-G": "string",
        "--pickaxe-regex": "none",
        "--pickaxe-all": "none"
      }
    },
    "git show": {
      safeFlags: {
        ...GIT_LOG_DISPLAY_FLAGS,
        ...GIT_STAT_FLAGS,
        ...GIT_COLOR_FLAGS,
        ...GIT_PATCH_FLAGS,
        "--abbrev-commit": "none",
        "--word-diff": "none",
        "--word-diff-regex": "string",
        "--color-words": "none",
        "--pretty": "string",
        "--format": "string",
        "--first-parent": "none",
        "--raw": "none",
        "--diff-filter": "string",
        "-m": "none",
        "--quiet": "none"
      }
    },
    "git shortlog": {
      safeFlags: {
        ...GIT_REF_SELECTION_FLAGS,
        ...GIT_DATE_FILTER_FLAGS,
        "-s": "none",
        "--summary": "none",
        "-n": "none",
        "--numbered": "none",
        "-e": "none",
        "--email": "none",
        "-c": "none",
        "--committer": "none",
        "--group": "string",
        "--format": "string",
        "--no-merges": "none",
        "--author": "string"
      }
    },
    "git reflog": {
      safeFlags: {
        ...GIT_LOG_DISPLAY_FLAGS,
        ...GIT_REF_SELECTION_FLAGS,
        ...GIT_DATE_FILTER_FLAGS,
        ...GIT_COUNT_FLAGS,
        ...GIT_AUTHOR_FILTER_FLAGS
      },
      additionalCommandIsDangerousCallback: (_rawCommand, args) => {
        let DANGEROUS_SUBCOMMANDS = /* @__PURE__ */ new Set(["expire", "delete", "exists"]);
        for (let token of args) {
          if (!token || token.startsWith("-"))
            continue;
          if (DANGEROUS_SUBCOMMANDS.has(token))
            return !0;
          return !1;
        }
        return !1;
      }
    },
    "git stash list": {
      safeFlags: {
        ...GIT_LOG_DISPLAY_FLAGS,
        ...GIT_REF_SELECTION_FLAGS,
        ...GIT_COUNT_FLAGS
      }
    },
    "git ls-remote": {
      safeFlags: {
        "--branches": "none",
        "-b": "none",
        "--tags": "none",
        "-t": "none",
        "--heads": "none",
        "-h": "none",
        "--refs": "none",
        "--quiet": "none",
        "-q": "none",
        "--exit-code": "none",
        "--get-url": "none",
        "--symref": "none",
        "--sort": "string"
      }
    },
    "git status": {
      safeFlags: {
        "--short": "none",
        "-s": "none",
        "--branch": "none",
        "-b": "none",
        "--porcelain": "none",
        "--long": "none",
        "--verbose": "none",
        "-v": "none",
        "--untracked-files": "string",
        "-u": "string",
        "--ignored": "none",
        "--ignore-submodules": "string",
        "--column": "none",
        "--no-column": "none",
        "--ahead-behind": "none",
        "--no-ahead-behind": "none",
        "--renames": "none",
        "--no-renames": "none",
        "--find-renames": "string",
        "-M": "string"
      }
    },
    "git blame": {
      safeFlags: {
        ...GIT_COLOR_FLAGS,
        "-L": "string",
        "--porcelain": "none",
        "-p": "none",
        "--line-porcelain": "none",
        "--incremental": "none",
        "--root": "none",
        "--show-stats": "none",
        "--show-name": "none",
        "--show-number": "none",
        "-n": "none",
        "--show-email": "none",
        "-e": "none",
        "-f": "none",
        "--date": "string",
        "-w": "none",
        "--ignore-rev": "string",
        "--ignore-revs-file": "string",
        "-M": "none",
        "-C": "none",
        "--score-debug": "none",
        "--abbrev": "number",
        "-s": "none",
        "-l": "none",
        "-t": "none"
      }
    },
    "git ls-files": {
      safeFlags: {
        "--cached": "none",
        "-c": "none",
        "--deleted": "none",
        "-d": "none",
        "--modified": "none",
        "-m": "none",
        "--others": "none",
        "-o": "none",
        "--ignored": "none",
        "-i": "none",
        "--stage": "none",
        "-s": "none",
        "--killed": "none",
        "-k": "none",
        "--unmerged": "none",
        "-u": "none",
        "--directory": "none",
        "--no-empty-directory": "none",
        "--eol": "none",
        "--full-name": "none",
        "--abbrev": "number",
        "--debug": "none",
        "-z": "none",
        "-t": "none",
        "-v": "none",
        "-f": "none",
        "--exclude": "string",
        "-x": "string",
        "--exclude-from": "string",
        "-X": "string",
        "--exclude-per-directory": "string",
        "--exclude-standard": "none",
        "--error-unmatch": "none",
        "--recurse-submodules": "none"
      }
    },
    "git config --get": {
      safeFlags: {
        "--local": "none",
        "--global": "none",
        "--system": "none",
        "--worktree": "none",
        "--default": "string",
        "--type": "string",
        "--bool": "none",
        "--int": "none",
        "--bool-or-int": "none",
        "--path": "none",
        "--expiry-date": "none",
        "-z": "none",
        "--null": "none",
        "--name-only": "none",
        "--show-origin": "none",
        "--show-scope": "none"
      }
    },
    "git remote show": {
      safeFlags: {
        "-n": "none"
      },
      additionalCommandIsDangerousCallback: (_rawCommand, args) => {
        let positional = args.filter((a2) => a2 !== "-n");
        if (positional.length !== 1)
          return !0;
        return !/^[a-zA-Z0-9_-]+$/.test(positional[0]);
      }
    },
    "git remote": {
      safeFlags: {
        "-v": "none",
        "--verbose": "none"
      },
      additionalCommandIsDangerousCallback: (_rawCommand, args) => {
        return args.some((a2) => a2 !== "-v" && a2 !== "--verbose");
      }
    },
    "git merge-base": {
      safeFlags: {
        "--is-ancestor": "none",
        "--fork-point": "none",
        "--octopus": "none",
        "--independent": "none",
        "--all": "none"
      }
    },
    "git rev-parse": {
      safeFlags: {
        "--verify": "none",
        "--short": "string",
        "--abbrev-ref": "none",
        "--symbolic": "none",
        "--symbolic-full-name": "none",
        "--show-toplevel": "none",
        "--show-cdup": "none",
        "--show-prefix": "none",
        "--git-dir": "none",
        "--git-common-dir": "none",
        "--absolute-git-dir": "none",
        "--show-superproject-working-tree": "none",
        "--is-inside-work-tree": "none",
        "--is-inside-git-dir": "none",
        "--is-bare-repository": "none",
        "--is-shallow-repository": "none",
        "--is-shallow-update": "none",
        "--path-prefix": "none"
      }
    },
    "git rev-list": {
      safeFlags: {
        ...GIT_REF_SELECTION_FLAGS,
        ...GIT_DATE_FILTER_FLAGS,
        ...GIT_COUNT_FLAGS,
        ...GIT_AUTHOR_FILTER_FLAGS,
        "--count": "none",
        "--reverse": "none",
        "--first-parent": "none",
        "--ancestry-path": "none",
        "--merges": "none",
        "--no-merges": "none",
        "--min-parents": "number",
        "--max-parents": "number",
        "--no-min-parents": "none",
        "--no-max-parents": "none",
        "--skip": "number",
        "--max-age": "number",
        "--min-age": "number",
        "--walk-reflogs": "none",
        "--oneline": "none",
        "--abbrev-commit": "none",
        "--pretty": "string",
        "--format": "string",
        "--abbrev": "number",
        "--full-history": "none",
        "--dense": "none",
        "--sparse": "none",
        "--source": "none",
        "--graph": "none"
      }
    },
    "git describe": {
      safeFlags: {
        "--tags": "none",
        "--match": "string",
        "--exclude": "string",
        "--long": "none",
        "--abbrev": "number",
        "--always": "none",
        "--contains": "none",
        "--first-match": "none",
        "--exact-match": "none",
        "--candidates": "number",
        "--dirty": "none",
        "--broken": "none"
      }
    },
    "git cat-file": {
      safeFlags: {
        "-t": "none",
        "-s": "none",
        "-p": "none",
        "-e": "none",
        "--batch-check": "none",
        "--allow-undetermined-type": "none"
      }
    },
    "git for-each-ref": {
      safeFlags: {
        "--format": "string",
        "--sort": "string",
        "--count": "number",
        "--contains": "string",
        "--no-contains": "string",
        "--merged": "string",
        "--no-merged": "string",
        "--points-at": "string"
      }
    },
    "git grep": {
      safeFlags: {
        "-e": "string",
        "-E": "none",
        "--extended-regexp": "none",
        "-G": "none",
        "--basic-regexp": "none",
        "-F": "none",
        "--fixed-strings": "none",
        "-P": "none",
        "--perl-regexp": "none",
        "-i": "none",
        "--ignore-case": "none",
        "-v": "none",
        "--invert-match": "none",
        "-w": "none",
        "--word-regexp": "none",
        "-n": "none",
        "--line-number": "none",
        "-c": "none",
        "--count": "none",
        "-l": "none",
        "--files-with-matches": "none",
        "-L": "none",
        "--files-without-match": "none",
        "-h": "none",
        "-H": "none",
        "--heading": "none",
        "--break": "none",
        "--full-name": "none",
        "--color": "none",
        "--no-color": "none",
        "-o": "none",
        "--only-matching": "none",
        "-A": "number",
        "--after-context": "number",
        "-B": "number",
        "--before-context": "number",
        "-C": "number",
        "--context": "number",
        "--and": "none",
        "--or": "none",
        "--not": "none",
        "--max-depth": "number",
        "--untracked": "none",
        "--no-index": "none",
        "--recurse-submodules": "none",
        "--cached": "none",
        "--threads": "number",
        "-q": "none",
        "--quiet": "none"
      }
    },
    "git stash show": {
      safeFlags: {
        ...GIT_STAT_FLAGS,
        ...GIT_COLOR_FLAGS,
        ...GIT_PATCH_FLAGS,
        "--word-diff": "none",
        "--word-diff-regex": "string",
        "--diff-filter": "string",
        "--abbrev": "number"
      }
    },
    "git worktree list": {
      safeFlags: {
        "--porcelain": "none",
        "-v": "none",
        "--verbose": "none",
        "--expire": "string"
      }
    },
    "git tag": {
      safeFlags: {
        "-l": "none",
        "--list": "none",
        "-n": "number",
        "--contains": "string",
        "--no-contains": "string",
        "--merged": "string",
        "--no-merged": "string",
        "--sort": "string",
        "--format": "string",
        "--points-at": "string",
        "--column": "none",
        "--no-column": "none",
        "-i": "none",
        "--ignore-case": "none"
      },
      additionalCommandIsDangerousCallback: (_rawCommand, args) => {
        let flagsWithArgs = /* @__PURE__ */ new Set([
          "--contains",
          "--no-contains",
          "--merged",
          "--no-merged",
          "--points-at",
          "--sort",
          "--format",
          "-n"
        ]), i4 = 0, seenListFlag = !1, seenDashDash = !1;
        while (i4 < args.length) {
          let token = args[i4];
          if (!token) {
            i4++;
            continue;
          }
          if (token === "--" && !seenDashDash) {
            seenDashDash = !0, i4++;
            continue;
          }
          if (!seenDashDash && token.startsWith("-")) {
            if (token === "--list" || token === "-l")
              seenListFlag = !0;
            else if (token[0] === "-" && token[1] !== "-" && token.length > 2 && !token.includes("=") && token.slice(1).includes("l"))
              seenListFlag = !0;
            if (token.includes("="))
              i4++;
            else if (flagsWithArgs.has(token))
              i4 += 2;
            else
              i4++;
          } else {
            if (!seenListFlag)
              return !0;
            i4++;
          }
        }
        return !1;
      }
    },
    "git branch": {
      safeFlags: {
        "-l": "none",
        "--list": "none",
        "-a": "none",
        "--all": "none",
        "-r": "none",
        "--remotes": "none",
        "-v": "none",
        "-vv": "none",
        "--verbose": "none",
        "--color": "none",
        "--no-color": "none",
        "--column": "none",
        "--no-column": "none",
        "--abbrev": "number",
        "--no-abbrev": "none",
        "--contains": "string",
        "--no-contains": "string",
        "--merged": "none",
        "--no-merged": "none",
        "--points-at": "string",
        "--sort": "string",
        "--show-current": "none",
        "-i": "none",
        "--ignore-case": "none"
      },
      additionalCommandIsDangerousCallback: (_rawCommand, args) => {
        let flagsWithArgs = /* @__PURE__ */ new Set([
          "--contains",
          "--no-contains",
          "--points-at",
          "--sort"
        ]), flagsWithOptionalArgs = /* @__PURE__ */ new Set(["--merged", "--no-merged"]), i4 = 0, lastFlag = "", seenListFlag = !1, seenDashDash = !1;
        while (i4 < args.length) {
          let token = args[i4];
          if (!token) {
            i4++;
            continue;
          }
          if (token === "--" && !seenDashDash) {
            seenDashDash = !0, lastFlag = "", i4++;
            continue;
          }
          if (!seenDashDash && token.startsWith("-")) {
            if (token === "--list" || token === "-l")
              seenListFlag = !0;
            else if (token[0] === "-" && token[1] !== "-" && token.length > 2 && !token.includes("=") && token.slice(1).includes("l"))
              seenListFlag = !0;
            if (token.includes("="))
              lastFlag = token.split("=")[0] || "", i4++;
            else if (flagsWithArgs.has(token))
              lastFlag = token, i4 += 2;
            else
              lastFlag = token, i4++;
          } else {
            let lastFlagHasOptionalArg = flagsWithOptionalArgs.has(lastFlag);
            if (!seenListFlag && !lastFlagHasOptionalArg)
              return !0;
            i4++;
          }
        }
        return !1;
      }
    }
  };
  GH_READ_ONLY_COMMANDS = {
    "gh pr view": {
      safeFlags: {
        "--json": "string",
        "--comments": "none",
        "--repo": "string",
        "-R": "string"
      },
      additionalCommandIsDangerousCallback: ghIsDangerousCallback
    },
    "gh pr list": {
      safeFlags: {
        "--state": "string",
        "-s": "string",
        "--author": "string",
        "--assignee": "string",
        "--label": "string",
        "--limit": "number",
        "-L": "number",
        "--base": "string",
        "--head": "string",
        "--search": "string",
        "--json": "string",
        "--draft": "none",
        "--app": "string",
        "--repo": "string",
        "-R": "string"
      },
      additionalCommandIsDangerousCallback: ghIsDangerousCallback
    },
    "gh pr diff": {
      safeFlags: {
        "--color": "string",
        "--name-only": "none",
        "--patch": "none",
        "--repo": "string",
        "-R": "string"
      },
      additionalCommandIsDangerousCallback: ghIsDangerousCallback
    },
    "gh pr checks": {
      safeFlags: {
        "--watch": "none",
        "--required": "none",
        "--fail-fast": "none",
        "--json": "string",
        "--interval": "number",
        "--repo": "string",
        "-R": "string"
      },
      additionalCommandIsDangerousCallback: ghIsDangerousCallback
    },
    "gh issue view": {
      safeFlags: {
        "--json": "string",
        "--comments": "none",
        "--repo": "string",
        "-R": "string"
      },
      additionalCommandIsDangerousCallback: ghIsDangerousCallback
    },
    "gh issue list": {
      safeFlags: {
        "--state": "string",
        "-s": "string",
        "--assignee": "string",
        "--author": "string",
        "--label": "string",
        "--limit": "number",
        "-L": "number",
        "--milestone": "string",
        "--search": "string",
        "--json": "string",
        "--app": "string",
        "--repo": "string",
        "-R": "string"
      },
      additionalCommandIsDangerousCallback: ghIsDangerousCallback
    },
    "gh repo view": {
      safeFlags: {
        "--json": "string"
      },
      additionalCommandIsDangerousCallback: ghIsDangerousCallback
    },
    "gh run list": {
      safeFlags: {
        "--branch": "string",
        "-b": "string",
        "--status": "string",
        "-s": "string",
        "--workflow": "string",
        "-w": "string",
        "--limit": "number",
        "-L": "number",
        "--json": "string",
        "--repo": "string",
        "-R": "string",
        "--event": "string",
        "-e": "string",
        "--user": "string",
        "-u": "string",
        "--created": "string",
        "--commit": "string",
        "-c": "string"
      },
      additionalCommandIsDangerousCallback: ghIsDangerousCallback
    },
    "gh run view": {
      safeFlags: {
        "--log": "none",
        "--log-failed": "none",
        "--exit-status": "none",
        "--verbose": "none",
        "-v": "none",
        "--json": "string",
        "--repo": "string",
        "-R": "string",
        "--job": "string",
        "-j": "string",
        "--attempt": "number",
        "-a": "number"
      },
      additionalCommandIsDangerousCallback: ghIsDangerousCallback
    },
    "gh auth status": {
      safeFlags: {
        "--active": "none",
        "-a": "none",
        "--hostname": "string",
        "-h": "string",
        "--json": "string"
      },
      additionalCommandIsDangerousCallback: ghIsDangerousCallback
    },
    "gh pr status": {
      safeFlags: {
        "--conflict-status": "none",
        "-c": "none",
        "--json": "string",
        "--repo": "string",
        "-R": "string"
      },
      additionalCommandIsDangerousCallback: ghIsDangerousCallback
    },
    "gh issue status": {
      safeFlags: {
        "--json": "string",
        "--repo": "string",
        "-R": "string"
      },
      additionalCommandIsDangerousCallback: ghIsDangerousCallback
    },
    "gh release list": {
      safeFlags: {
        "--exclude-drafts": "none",
        "--exclude-pre-releases": "none",
        "--json": "string",
        "--limit": "number",
        "-L": "number",
        "--order": "string",
        "-O": "string",
        "--repo": "string",
        "-R": "string"
      },
      additionalCommandIsDangerousCallback: ghIsDangerousCallback
    },
    "gh release view": {
      safeFlags: {
        "--json": "string",
        "--repo": "string",
        "-R": "string"
      },
      additionalCommandIsDangerousCallback: ghIsDangerousCallback
    },
    "gh workflow list": {
      safeFlags: {
        "--all": "none",
        "-a": "none",
        "--json": "string",
        "--limit": "number",
        "-L": "number",
        "--repo": "string",
        "-R": "string"
      },
      additionalCommandIsDangerousCallback: ghIsDangerousCallback
    },
    "gh workflow view": {
      safeFlags: {
        "--ref": "string",
        "-r": "string",
        "--yaml": "none",
        "-y": "none",
        "--repo": "string",
        "-R": "string"
      },
      additionalCommandIsDangerousCallback: ghIsDangerousCallback
    },
    "gh label list": {
      safeFlags: {
        "--json": "string",
        "--limit": "number",
        "-L": "number",
        "--order": "string",
        "--search": "string",
        "-S": "string",
        "--sort": "string",
        "--repo": "string",
        "-R": "string"
      },
      additionalCommandIsDangerousCallback: ghIsDangerousCallback
    },
    "gh search repos": {
      safeFlags: {
        "--archived": "none",
        "--created": "string",
        "--followers": "string",
        "--forks": "string",
        "--good-first-issues": "string",
        "--help-wanted-issues": "string",
        "--include-forks": "string",
        "--json": "string",
        "--language": "string",
        "--license": "string",
        "--limit": "number",
        "-L": "number",
        "--match": "string",
        "--number-topics": "string",
        "--order": "string",
        "--owner": "string",
        "--size": "string",
        "--sort": "string",
        "--stars": "string",
        "--topic": "string",
        "--updated": "string",
        "--visibility": "string"
      }
    },
    "gh search issues": {
      safeFlags: {
        "--app": "string",
        "--assignee": "string",
        "--author": "string",
        "--closed": "string",
        "--commenter": "string",
        "--comments": "string",
        "--created": "string",
        "--include-prs": "none",
        "--interactions": "string",
        "--involves": "string",
        "--json": "string",
        "--label": "string",
        "--language": "string",
        "--limit": "number",
        "-L": "number",
        "--locked": "none",
        "--match": "string",
        "--mentions": "string",
        "--milestone": "string",
        "--no-assignee": "none",
        "--no-label": "none",
        "--no-milestone": "none",
        "--no-project": "none",
        "--order": "string",
        "--owner": "string",
        "--project": "string",
        "--reactions": "string",
        "--repo": "string",
        "-R": "string",
        "--sort": "string",
        "--state": "string",
        "--team-mentions": "string",
        "--updated": "string",
        "--visibility": "string"
      }
    },
    "gh search prs": {
      safeFlags: {
        "--app": "string",
        "--assignee": "string",
        "--author": "string",
        "--base": "string",
        "-B": "string",
        "--checks": "string",
        "--closed": "string",
        "--commenter": "string",
        "--comments": "string",
        "--created": "string",
        "--draft": "none",
        "--head": "string",
        "-H": "string",
        "--interactions": "string",
        "--involves": "string",
        "--json": "string",
        "--label": "string",
        "--language": "string",
        "--limit": "number",
        "-L": "number",
        "--locked": "none",
        "--match": "string",
        "--mentions": "string",
        "--merged": "none",
        "--merged-at": "string",
        "--milestone": "string",
        "--no-assignee": "none",
        "--no-label": "none",
        "--no-milestone": "none",
        "--no-project": "none",
        "--order": "string",
        "--owner": "string",
        "--project": "string",
        "--reactions": "string",
        "--repo": "string",
        "-R": "string",
        "--review": "string",
        "--review-requested": "string",
        "--reviewed-by": "string",
        "--sort": "string",
        "--state": "string",
        "--team-mentions": "string",
        "--updated": "string",
        "--visibility": "string"
      }
    },
    "gh search commits": {
      safeFlags: {
        "--author": "string",
        "--author-date": "string",
        "--author-email": "string",
        "--author-name": "string",
        "--committer": "string",
        "--committer-date": "string",
        "--committer-email": "string",
        "--committer-name": "string",
        "--hash": "string",
        "--json": "string",
        "--limit": "number",
        "-L": "number",
        "--merge": "none",
        "--order": "string",
        "--owner": "string",
        "--parent": "string",
        "--repo": "string",
        "-R": "string",
        "--sort": "string",
        "--tree": "string",
        "--visibility": "string"
      }
    },
    "gh search code": {
      safeFlags: {
        "--extension": "string",
        "--filename": "string",
        "--json": "string",
        "--language": "string",
        "--limit": "number",
        "-L": "number",
        "--match": "string",
        "--owner": "string",
        "--repo": "string",
        "-R": "string",
        "--size": "string"
      }
    }
  }, DOCKER_READ_ONLY_COMMANDS = {
    "docker logs": {
      safeFlags: {
        "--follow": "none",
        "-f": "none",
        "--tail": "string",
        "-n": "string",
        "--timestamps": "none",
        "-t": "none",
        "--since": "string",
        "--until": "string",
        "--details": "none"
      }
    },
    "docker inspect": {
      safeFlags: {
        "--format": "string",
        "-f": "string",
        "--type": "string",
        "--size": "none",
        "-s": "none"
      }
    }
  }, RIPGREP_READ_ONLY_COMMANDS = {
    rg: {
      safeFlags: {
        "-e": "string",
        "--regexp": "string",
        "-f": "string",
        "-i": "none",
        "--ignore-case": "none",
        "-S": "none",
        "--smart-case": "none",
        "-F": "none",
        "--fixed-strings": "none",
        "-w": "none",
        "--word-regexp": "none",
        "-v": "none",
        "--invert-match": "none",
        "-c": "none",
        "--count": "none",
        "-l": "none",
        "--files-with-matches": "none",
        "--files-without-match": "none",
        "-n": "none",
        "--line-number": "none",
        "-o": "none",
        "--only-matching": "none",
        "-A": "number",
        "--after-context": "number",
        "-B": "number",
        "--before-context": "number",
        "-C": "number",
        "--context": "number",
        "-H": "none",
        "-h": "none",
        "--heading": "none",
        "--no-heading": "none",
        "-q": "none",
        "--quiet": "none",
        "--column": "none",
        "-g": "string",
        "--glob": "string",
        "-t": "string",
        "--type": "string",
        "-T": "string",
        "--type-not": "string",
        "--type-list": "none",
        "--hidden": "none",
        "--no-ignore": "none",
        "-u": "none",
        "-m": "number",
        "--max-count": "number",
        "-d": "number",
        "--max-depth": "number",
        "-a": "none",
        "--text": "none",
        "-z": "none",
        "-L": "none",
        "--follow": "none",
        "--color": "string",
        "--json": "none",
        "--stats": "none",
        "--help": "none",
        "--version": "none",
        "--debug": "none",
        "--": "none"
      }
    }
  }, PYRIGHT_READ_ONLY_COMMANDS = {
    pyright: {
      respectsDoubleDash: !1,
      safeFlags: {
        "--outputjson": "none",
        "--project": "string",
        "-p": "string",
        "--pythonversion": "string",
        "--pythonplatform": "string",
        "--typeshedpath": "string",
        "--venvpath": "string",
        "--level": "string",
        "--stats": "none",
        "--verbose": "none",
        "--version": "none",
        "--dependencies": "none",
        "--warnings": "none"
      },
      additionalCommandIsDangerousCallback: (_rawCommand, args) => {
        return args.some((t2) => t2 === "--watch" || t2 === "-w");
      }
    }
  }, EXTERNAL_READONLY_COMMANDS = [
    "docker ps",
    "docker images"
  ];
  FLAG_PATTERN = /^-[a-zA-Z0-9_-]/;
});
