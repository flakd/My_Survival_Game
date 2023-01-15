function initGameTimeDefaults() {
  g.t.todayStart = g.t.start = Date.now();
  g.t.tick = 0;
  g.t.totalTicks = 0;
  g.t.minute = 0;
  g.t.totalMinutes = 0;
  g.t.hour = 0;
  g.t.totalHours = 0;
  g.t.day = 0;
} // END: function initGameTimeDefaults

class GameTimer {
  constructor(numticks /*number*/){
    this.numticks = numticks;
    this.timePaused = false;
    this.todayStart = this.start = Date.now();
    this.tick = 0;
    this.totalTicks = 0;
    this.minute = 0;
    this.totalMinutes = 0;
    this.hour = 0;
    this.totalHours = 0;
    this.day = 0;    
  }
  increment() {
    if (!this.timePaused) {
      this.tick++;
      this.totalTicks++;
    }
    if (this.tick > this.numticks){
      this.tick = 0;
      this.minute ++;
      g.waid.passMinute();
      if (waid.isBusy()){
        playActivityMedia(g.c.action.gerund);
      }
      this.totalMinutes++;
      if (this.minute > 59) {
        this.minute = 0;
        this.hour++;
        this.totalHours++;
        if (this.hour > 23){
          this.hour = 0;
          this.day++;
        }
      }
    }
  }
}
function incrementGameHour(numticks) {
  g.timePaused = false;
  if (!g.timePaused) {
    g.t.tick++;
    g.t.totalTicks++;
  }
  if (g.t.tick > numticks) { // TimerInterval = 50ms right now
    g.t.tick = 0;
    g.t.minute++;
    /*       let wasIbusy = g.whatImDoing.isBusy();
     */ 
    
    //g.whatImDoing.passMinute();
    //g.waid = new WhatAmIDoing();
    g.waid.passMinute();
    if (waid.isBusy()){
      playActivityMedia(g.c.action.gerund);
    }       
    //WhatAmIDoing.passMinute();
    
    /*       if (g.whatImDoing.isBusy()===false && wasIbusy===true) {
            stopActivityMedia();
          } */
    g.t.totalMinutes++;
    if (g.t.minute > 59) {
      g.t.minute = 0;
      g.t.hour++;
      g.t.totalHours++;
      if (g.t.hour > 23) {
        g.t.hour = 0;
        g.t.day++;
      }
    }
  }
} // END: function incrementGameHour

function logTimeForDebugging() {
  g.t.passed = Date.now() - g.t.start;
  lwr((
    `MINUTE: ${g.t.minute}<br>\n` +
    `HOUR: ${g.t.hour}<br>\n` +
    `DAY: ${g.t.day}<br>\n` +

    `TIME PASSED: ${g.t.passed}<br>\n` +
    `totMINUTEs: ${g.t.totalMinutes}<br>\n` +
    `totHOURs: ${g.t.totalHours}<br>\n`

  ), document.querySelector("#log2")
  );
} // END: function logTimeForDebugging