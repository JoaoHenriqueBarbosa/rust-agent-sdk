// Original: src/utils/githubRepoPathMapping.ts
import { realpath as realpath11 } from "fs/promises";
async function updateGithubRepoPathMapping() {
  try {
    let repo = await detectCurrentRepository();
    if (!repo) {
      logForDebugging("Not in a GitHub repository, skipping path mapping update");
      return;
    }
    let cwd2 = getOriginalCwd(), basePath = findGitRoot(cwd2) ?? cwd2, currentPath;
    try {
      currentPath = (await realpath11(basePath)).normalize("NFC");
    } catch {
      currentPath = basePath;
    }
    let repoKey = repo.toLowerCase(), existingPaths = getGlobalConfig().githubRepoPaths?.[repoKey] ?? [];
    if (existingPaths[0] === currentPath) {
      logForDebugging(`Path ${currentPath} already tracked for repo ${repoKey}`);
      return;
    }
    let withoutCurrent = existingPaths.filter((p4) => p4 !== currentPath), updatedPaths = [currentPath, ...withoutCurrent];
    saveGlobalConfig((current) => ({
      ...current,
      githubRepoPaths: {
        ...current.githubRepoPaths,
        [repoKey]: updatedPaths
      }
    })), logForDebugging(`Added ${currentPath} to tracked paths for repo ${repoKey}`);
  } catch (error44) {
    logForDebugging(`Error updating repo path mapping: ${error44}`);
  }
}
function getKnownPathsForRepo(repo) {
  let config11 = getGlobalConfig(), repoKey = repo.toLowerCase();
  return config11.githubRepoPaths?.[repoKey] ?? [];
}
async function filterExistingPaths(paths2) {
  let results = await Promise.all(paths2.map(pathExists));
  return paths2.filter((_, i5) => results[i5]);
}
async function validateRepoAtPath(path27, expectedRepo) {
  try {
    let remoteUrl = await getRemoteUrlForDir(path27);
    if (!remoteUrl)
      return !1;
    let actualRepo = parseGitHubRepository(remoteUrl);
    if (!actualRepo)
      return !1;
    return actualRepo.toLowerCase() === expectedRepo.toLowerCase();
  } catch {
    return !1;
  }
}
function removePathFromRepo(repo, pathToRemove) {
  let config11 = getGlobalConfig(), repoKey = repo.toLowerCase(), existingPaths = config11.githubRepoPaths?.[repoKey] ?? [], updatedPaths = existingPaths.filter((path27) => path27 !== pathToRemove);
  if (updatedPaths.length === existingPaths.length)
    return;
  let updatedMapping = { ...config11.githubRepoPaths };
  if (updatedPaths.length === 0)
    delete updatedMapping[repoKey];
  else
    updatedMapping[repoKey] = updatedPaths;
  saveGlobalConfig((current) => ({
    ...current,
    githubRepoPaths: updatedMapping
  })), logForDebugging(`Removed ${pathToRemove} from tracked paths for repo ${repoKey}`);
}
var init_githubRepoPathMapping = __esm(() => {
  init_state();
  init_config4();
  init_debug();
  init_detectRepository();
  init_file();
  init_gitFilesystem();
  init_git();
});
