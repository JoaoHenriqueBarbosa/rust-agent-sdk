// function: generateTokenChart
function generateTokenChart(dailyTokens, models, terminalWidth) {
  if (dailyTokens.length < 2 || models.length === 0)
    return null;
  let yAxisWidth = 7, availableWidth = terminalWidth - yAxisWidth, chartWidth = Math.min(52, Math.max(20, availableWidth)), recentData;
  if (dailyTokens.length >= chartWidth)
    recentData = dailyTokens.slice(-chartWidth);
  else {
    let repeatCount = Math.floor(chartWidth / dailyTokens.length);
    recentData = [];
    for (let day of dailyTokens)
      for (let i5 = 0;i5 < repeatCount; i5++)
        recentData.push(day);
  }
  let theme2 = getTheme(resolveThemeSetting(getGlobalConfig().theme)), colors4 = [themeColorToAnsi(theme2.suggestion), themeColorToAnsi(theme2.success), themeColorToAnsi(theme2.warning)], series = [], legend = [], topModels = models.slice(0, 3);
  for (let i5 = 0;i5 < topModels.length; i5++) {
    let model = topModels[i5], data = recentData.map((day) => day.tokensByModel[model] || 0);
    if (data.some((v2) => v2 > 0)) {
      series.push(data);
      let bulletColors = [theme2.suggestion, theme2.success, theme2.warning];
      legend.push({
        model: renderModelName(model),
        coloredBullet: applyColor(figures_default.bullet, bulletColors[i5 % bulletColors.length])
      });
    }
  }
  if (series.length === 0)
    return null;
  let chart = import_asciichart.plot(series, {
    height: 8,
    colors: colors4.slice(0, series.length),
    format: (x4) => {
      let label;
      if (x4 >= 1e6)
        label = (x4 / 1e6).toFixed(1) + "M";
      else if (x4 >= 1000)
        label = (x4 / 1000).toFixed(0) + "k";
      else
        label = x4.toFixed(0);
      return label.padStart(6);
    }
  }), xAxisLabels = generateXAxisLabels(recentData, recentData.length, yAxisWidth);
  return {
    chart,
    legend,
    xAxisLabels
  };
}
