// function: getProject
function getProject() {
  if (!project) {
    if (project = new Project, !cleanupRegistered5)
      registerCleanup(async () => {
        await project?.flush();
        try {
          project?.reAppendSessionMetadata();
        } catch {}
      }), cleanupRegistered5 = !0;
  }
  return project;
}
