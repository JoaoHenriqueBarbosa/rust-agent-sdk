// var: getStartTime
var getStartTime = () => hrtime.bigint(), getDurationMs = (startTime) => Number(hrtime.bigint() - startTime) / 1e6;
var init_duration = () => {};
