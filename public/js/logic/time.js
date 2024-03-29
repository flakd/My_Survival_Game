class GameTimer {
  constructor(numticks /*number*/) {
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
    if (this.tick > this.numticks) {
      this.tick = 0;
      this.minute++;
      g.waid.passMinute();
      myHeavens.passTime();
      this.totalMinutes++;
      if (this.minute > 59) {
        this.minute = 0;
        this.hour++;
        this.totalHours++;
        if (this.hour > 23) {
          this.hour = 0;
          this.day++;
        }
      }
    }
  }
}

//moveHeavens();

function incrementGameHour(numticks) {
  g.timePaused = false;
  if (!g.timePaused) {
    g.t.tick++;
    g.t.totalTicks++;
  }
  if (g.t.tick > numticks) {
    // TimerInterval = 50ms right now
    /*********************************************************
     * Place stuff that NEEDS to run EVERY MINUTE or TICK here
     ********************************************************/
    g.t.tick = 0;
    g.myHeavens.passTime(g.t.hour, g.t.minute, g.t.tick);
    g.t.minute++;
    g.waid.passMinute();
    /*********************************************************
     * Place stuff that NEEDS to run EVERY MINUTE or TICK here
     ********************************************************/

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
  lwr(
    `MINUTE: ${g.t.minute}<br>\n` +
      `HOUR: ${g.t.hour}<br>\n` +
      `DAY: ${g.t.day}<br>\n` +
      `TIME PASSED: ${g.t.passed}<br>\n` +
      `totMINUTEs: ${g.t.totalMinutes}<br>\n` +
      `totHOURs: ${g.t.totalHours}<br>\n`,

    document.querySelector('#log2')
  );
} // END: function logTimeForDebugging
