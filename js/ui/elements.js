function focusCommandInputCursor() {
  document.getElementById("command-input").focus();
} // END: function focusCommandInputCursor

function updateDayUI() {
  let dayStr = g.t.day.toString().padStart(3, "0");
  lwrDay(`DAY:${dayStr}`);
  //return dayStr;
} // END: function updateDayUI()

function updateHourUI() {
  let hrStr = g.t.hour.toString().padStart(2, "0");
  lwrTime(`${hrStr}Hrs`);
} // END: function updateHourUI()