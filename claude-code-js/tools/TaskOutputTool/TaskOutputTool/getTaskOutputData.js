// function: getTaskOutputData
async function getTaskOutputData(task) {
  let output;
  if (task.type === "local_bash") {
    let taskOutputObj = task.shellCommand?.taskOutput;
    if (taskOutputObj) {
      let stdout = await taskOutputObj.getStdout(), stderr = taskOutputObj.getStderr();
      output = [stdout, stderr].filter(Boolean).join(`
`);
    } else
      output = await getTaskOutput(task.id);
  } else
    output = await getTaskOutput(task.id);
  let baseOutput = {
    task_id: task.id,
    task_type: task.type,
    status: task.status,
    description: task.description,
    output
  };
  if (task.type === "local_bash")
    return {
      ...baseOutput,
      exitCode: task.result?.code ?? null
    };
  if (task.type === "local_agent") {
    let agentTask = task, cleanResult = agentTask.result ? extractTextContent(agentTask.result.content, `
`) : void 0;
    return {
      ...baseOutput,
      prompt: agentTask.prompt,
      result: cleanResult || output,
      output: cleanResult || output,
      error: agentTask.error
    };
  }
  if (task.type === "remote_agent")
    return {
      ...baseOutput,
      prompt: task.command
    };
  return baseOutput;
}
