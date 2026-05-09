// function: formatTaskAsPrompt
function formatTaskAsPrompt(task) {
  let prompt = `Complete all open tasks. Start with task #${task.id}: 

 ${task.subject}`;
  if (task.description)
    prompt += `

${task.description}`;
  return prompt;
}
