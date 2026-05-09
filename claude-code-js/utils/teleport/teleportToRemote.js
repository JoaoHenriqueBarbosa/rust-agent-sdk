// function: teleportToRemote
async function teleportToRemote(options2) {
  let {
    initialMessage,
    signal
  } = options2;
  try {
    await checkAndRefreshOAuthTokenIfNeeded();
    let accessToken = getClaudeAIOAuthTokens()?.accessToken;
    if (!accessToken)
      return logError2(Error("No access token found for remote session creation")), null;
    let orgUUID = await getOrganizationUUID();
    if (!orgUUID)
      return logError2(Error("Unable to get organization UUID for remote session creation")), null;
    if (options2.environmentId) {
      let url4 = `${getOauthConfig().BASE_API_URL}/v1/sessions`, headers2 = {
        ...getOAuthHeaders(accessToken),
        "anthropic-beta": "ccr-byoc-2025-07-29",
        "x-organization-uuid": orgUUID
      }, envVars = {
        CLAUDE_CODE_OAUTH_TOKEN: accessToken,
        ...options2.environmentVariables ?? {}
      }, gitSource2 = null, seedBundleFileId2 = null;
      if (options2.useBundle) {
        let bundle = await createAndUploadGitBundle({
          oauthToken: accessToken,
          sessionId: getSessionId(),
          baseUrl: getOauthConfig().BASE_API_URL
        }, {
          signal
        });
        if (!bundle.success)
          return logError2(Error(`Bundle upload failed: ${bundle.error}`)), null;
        seedBundleFileId2 = bundle.fileId, logEvent("tengu_teleport_bundle_mode", {
          size_bytes: bundle.bundleSizeBytes,
          scope: bundle.scope,
          has_wip: bundle.hasWip,
          reason: "explicit_env_bundle"
        });
      } else {
        let repoInfo2 = await detectCurrentRepositoryWithHost();
        if (repoInfo2)
          gitSource2 = {
            type: "git_repository",
            url: `https://${repoInfo2.host}/${repoInfo2.owner}/${repoInfo2.name}`,
            revision: options2.branchName
          };
      }
      let requestBody2 = {
        title: options2.title || options2.description || "Remote task",
        events: [],
        session_context: {
          sources: gitSource2 ? [gitSource2] : [],
          ...seedBundleFileId2 && {
            seed_bundle_file_id: seedBundleFileId2
          },
          outcomes: [],
          environment_variables: envVars
        },
        environment_id: options2.environmentId
      };
      logForDebugging(`[teleportToRemote] explicit env ${options2.environmentId}, ${Object.keys(envVars).length} env vars, ${seedBundleFileId2 ? `bundle=${seedBundleFileId2}` : `source=${gitSource2?.url ?? "none"}@${options2.branchName ?? "default"}`}`);
      let response8 = await axios_default.post(url4, requestBody2, {
        headers: headers2,
        signal
      });
      if (response8.status !== 200 && response8.status !== 201)
        return logError2(Error(`CreateSession ${response8.status}: ${jsonStringify(response8.data)}`)), null;
      let sessionData2 = response8.data;
      if (!sessionData2 || typeof sessionData2.id !== "string")
        return logError2(Error(`No session id in response: ${jsonStringify(response8.data)}`)), null;
      return {
        id: sessionData2.id,
        title: sessionData2.title || requestBody2.title
      };
    }
    let gitSource = null, gitOutcome = null, seedBundleFileId = null, repoInfo = await detectCurrentRepositoryWithHost(), sessionTitle, sessionBranch;
    if (options2.title && options2.reuseOutcomeBranch)
      sessionTitle = options2.title, sessionBranch = options2.reuseOutcomeBranch;
    else {
      let generated = await generateTitleAndBranch(options2.description || initialMessage || "Background task", signal);
      sessionTitle = options2.title || generated.title, sessionBranch = options2.reuseOutcomeBranch || generated.branchName;
    }
    let ghViable = !1, sourceReason = "no_git_at_all", gitRoot = findGitRoot(getCwd()), forceBundle = !options2.skipBundle && isEnvTruthy(process.env.CCR_FORCE_BUNDLE), bundleSeedGateOn = !options2.skipBundle && gitRoot !== null && isEnvTruthy(process.env.CCR_ENABLE_BUNDLE);
    if (repoInfo && !forceBundle)
      if (repoInfo.host === "github.com")
        ghViable = await checkGithubAppInstalled(repoInfo.owner, repoInfo.name, signal), sourceReason = ghViable ? "github_preflight_ok" : "github_preflight_failed";
      else
        ghViable = !0, sourceReason = "ghes_optimistic";
    else if (forceBundle)
      sourceReason = "forced_bundle";
    else if (gitRoot)
      sourceReason = "no_github_remote";
    if (!ghViable && !bundleSeedGateOn && repoInfo)
      ghViable = !0;
    if (ghViable && repoInfo) {
      let {
        host,
        owner,
        name: name3
      } = repoInfo, revision = options2.branchName ?? await getDefaultBranch() ?? void 0;
      logForDebugging(`[teleportToRemote] Git source: ${host}/${owner}/${name3}, revision: ${revision ?? "none"}`), gitSource = {
        type: "git_repository",
        url: `https://${host}/${owner}/${name3}`,
        revision,
        ...options2.reuseOutcomeBranch && {
          allow_unrestricted_git_push: !0
        }
      }, gitOutcome = {
        type: "git_repository",
        git_info: {
          type: "github",
          repo: `${owner}/${name3}`,
          branches: [sessionBranch]
        }
      };
    }
    if (!gitSource && bundleSeedGateOn) {
      logForDebugging(`[teleportToRemote] Bundling (reason: ${sourceReason})`);
      let bundle = await createAndUploadGitBundle({
        oauthToken: accessToken,
        sessionId: getSessionId(),
        baseUrl: getOauthConfig().BASE_API_URL
      }, {
        signal
      });
      if (!bundle.success) {
        logError2(Error(`Bundle upload failed: ${bundle.error}`));
        let setup = repoInfo ? ". Please setup GitHub on https://claude.ai/code" : "", msg;
        switch (bundle.failReason) {
          case "empty_repo":
            msg = 'Repository has no commits \u2014 run `git add . && git commit -m "initial"` then retry';
            break;
          case "too_large":
            msg = `Repo is too large to teleport${setup}`;
            break;
          case "git_error":
            msg = `Failed to create git bundle (${bundle.error})${setup}`;
            break;
          case void 0:
            msg = `Bundle upload failed: ${bundle.error}${setup}`;
            break;
          default: {
            let _exhaustive = bundle.failReason;
            msg = `Bundle upload failed: ${bundle.error}`;
          }
        }
        return options2.onBundleFail?.(msg), null;
      }
      seedBundleFileId = bundle.fileId, logEvent("tengu_teleport_bundle_mode", {
        size_bytes: bundle.bundleSizeBytes,
        scope: bundle.scope,
        has_wip: bundle.hasWip,
        reason: sourceReason
      });
    }
    if (logEvent("tengu_teleport_source_decision", {
      reason: sourceReason,
      path: gitSource ? "github" : seedBundleFileId ? "bundle" : "empty"
    }), !gitSource && !seedBundleFileId)
      logForDebugging("[teleportToRemote] No repository detected \u2014 session will have an empty sandbox");
    let environments = await fetchEnvironments();
    if (!environments || environments.length === 0)
      return logError2(Error("No environments available for session creation")), null;
    logForDebugging(`Available environments: ${environments.map((e) => `${e.environment_id} (${e.name}, ${e.kind})`).join(", ")}`);
    let settings = getSettings_DEPRECATED(), defaultEnvironmentId = options2.useDefaultEnvironment ? void 0 : settings?.remote?.defaultEnvironmentId, cloudEnv = environments.find((env5) => env5.kind === "anthropic_cloud");
    if (options2.useDefaultEnvironment && !cloudEnv) {
      logForDebugging(`No anthropic_cloud in env list (${environments.length} envs); retrying fetchEnvironments`);
      let retried = await fetchEnvironments();
      if (cloudEnv = retried?.find((env5) => env5.kind === "anthropic_cloud"), !cloudEnv)
        return logError2(Error(`No anthropic_cloud environment available after retry (got: ${(retried ?? environments).map((e) => `${e.name} (${e.kind})`).join(", ")}). Silent byoc fallthrough would launch into a dead env \u2014 fail fast instead.`)), null;
      if (retried)
        environments = retried;
    }
    let selectedEnvironment = defaultEnvironmentId && environments.find((env5) => env5.environment_id === defaultEnvironmentId) || cloudEnv || environments.find((env5) => env5.kind !== "bridge") || environments[0];
    if (!selectedEnvironment)
      return logError2(Error("No environments available for session creation")), null;
    if (defaultEnvironmentId) {
      let matchedDefault = selectedEnvironment.environment_id === defaultEnvironmentId;
      logForDebugging(matchedDefault ? `Using configured default environment: ${defaultEnvironmentId}` : `Configured default environment ${defaultEnvironmentId} not found, using first available`);
    }
    let environmentId = selectedEnvironment.environment_id;
    logForDebugging(`Selected environment: ${environmentId} (${selectedEnvironment.name}, ${selectedEnvironment.kind})`);
    let url3 = `${getOauthConfig().BASE_API_URL}/v1/sessions`, headers = {
      ...getOAuthHeaders(accessToken),
      "anthropic-beta": "ccr-byoc-2025-07-29",
      "x-organization-uuid": orgUUID
    }, sessionContext = {
      sources: gitSource ? [gitSource] : [],
      ...seedBundleFileId && {
        seed_bundle_file_id: seedBundleFileId
      },
      outcomes: gitOutcome ? [gitOutcome] : [],
      model: options2.model ?? getMainLoopModel(),
      ...options2.reuseOutcomeBranch && {
        reuse_outcome_branches: !0
      },
      ...options2.githubPr && {
        github_pr: options2.githubPr
      }
    }, events2 = [];
    if (options2.permissionMode)
      events2.push({
        type: "event",
        data: {
          type: "control_request",
          request_id: `set-mode-${randomUUID13()}`,
          request: {
            subtype: "set_permission_mode",
            mode: options2.permissionMode,
            ultraplan: options2.ultraplan
          }
        }
      });
    if (initialMessage)
      events2.push({
        type: "event",
        data: {
          uuid: randomUUID13(),
          session_id: "",
          type: "user",
          parent_tool_use_id: null,
          message: {
            role: "user",
            content: initialMessage
          }
        }
      });
    let requestBody = {
      title: options2.ultraplan ? `ultraplan: ${sessionTitle}` : sessionTitle,
      events: events2,
      session_context: sessionContext,
      environment_id: environmentId
    };
    logForDebugging(`Creating session with payload: ${jsonStringify(requestBody, null, 2)}`);
    let response7 = await axios_default.post(url3, requestBody, {
      headers,
      signal
    });
    if (!(response7.status === 200 || response7.status === 201))
      return logError2(Error(`API request failed with status ${response7.status}: ${response7.statusText}

Response data: ${jsonStringify(response7.data, null, 2)}`)), null;
    let sessionData = response7.data;
    if (!sessionData || typeof sessionData.id !== "string")
      return logError2(Error(`Cannot determine session ID from API response: ${jsonStringify(response7.data)}`)), null;
    return logForDebugging(`Successfully created remote session: ${sessionData.id}`), {
      id: sessionData.id,
      title: sessionData.title || requestBody.title
    };
  } catch (error44) {
    let err2 = toError(error44);
    return logError2(err2), null;
  }
}
