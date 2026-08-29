// function: renderModelsToAnsi
function renderModelsToAnsi(stats) {
  let lines2 = [], modelEntries = Object.entries(stats.modelUsage).sort(([, a2], [, b]) => b.inputTokens + b.outputTokens - (a2.inputTokens + a2.outputTokens));
  if (modelEntries.length === 0)
    return lines2.push(source_default.gray("No model usage data available")), lines2;
  let favoriteModel = modelEntries[0], totalTokens = modelEntries.reduce((sum, [, usage]) => sum + usage.inputTokens + usage.outputTokens, 0), chartOutput = generateTokenChart(stats.dailyModelTokens, modelEntries.map(([model]) => model), 80);
  if (chartOutput) {
    lines2.push(source_default.bold("Tokens per Day")), lines2.push(chartOutput.chart), lines2.push(source_default.gray(chartOutput.xAxisLabels));
    let legendLine = chartOutput.legend.map((item) => `${item.coloredBullet} ${item.model}`).join(" \xB7 ");
    lines2.push(legendLine), lines2.push("");
  }
  lines2.push(`${figures_default.star} Favorite: ${source_default.magenta.bold(renderModelName(favoriteModel?.[0] || ""))} \xB7 ${figures_default.circle} Total: ${source_default.magenta(formatNumber(totalTokens))} tokens`), lines2.push("");
  let topModels = modelEntries.slice(0, 3);
  for (let [model, usage] of topModels) {
    let percentage = ((usage.inputTokens + usage.outputTokens) / totalTokens * 100).toFixed(1);
    lines2.push(`${figures_default.bullet} ${source_default.bold(renderModelName(model))} ${source_default.gray(`(${percentage}%)`)}`), lines2.push(source_default.dim(`  In: ${formatNumber(usage.inputTokens)} \xB7 Out: ${formatNumber(usage.outputTokens)}`));
  }
  return lines2;
}
