
if (g.isBrowserOrNode==="node"){
  const { exit } = require('process');
  const readline = require('readline');
  const parseJSONs = require('./parseJSONs');
  const core =  require('./core');
  const output =  require('./output');
  var rl;
  window.parseJSONs.loadJSONs();
  g.c.inventory = parseJSONs.Objects.inventory;
  g.c.vitals = parseJSONs.Objects.vitals;
  g.c.actions = parseJSONs.Objects.actions;
}

g.isDead = false;

//  EVERYTHING STARTS HERE!!!!!
g.startGame();
//  RIGHT HERE!!!!    


function startGame() {
  g.isGameOver = false;
  //resetAllStats(g.c.vitals, g.c.inventory);
  window.output.printTitleBanner(g.t.gameHr, g.c);
  setAllEventListeners();
}  // END startGame()

function runMainGameLoop(sunOrMoon){
  g.c.isDead = false;
  g.c.justDied = false;

  let didSwapRecently = false;

  initGameTimeDefaults();
  updateDayUI();
  initMoveSunOrMoonDefaults(); 

  let RAoGOccurredRecently = false;
  // compiler complaining that the next line - sunOrMoon is already declard, but where???
  //const sunOrMoon = document.getElementById("sunOrMoon");
  sunOrMoon = document.getElementById("sunOrMoon");

  let timer = setInterval(function() {

    incrementGameHour(10);    

    // (re)focus the cursor upong EVERY timer click/event 
    focusCommandInputCursor();

    // sun RISING PHASE
    moveSunOrMoon(sunOrMoon);
    
    // check to see a RAoG will/did occur EVERY HOUR otherwise, it will 
    //  happen too often and it's constantly killing the player
    if (g.t.minute ===0 && g.t.tick ===0) {
      RAoGOccurredRecently = core.doRandomActOfGod(g.c.inventory, g.c.vitals);
    }

    // keep Vitals and Inventory stats updated each tick (timer interval)
    output.printStats1(g.t.gameHr,g.c);

    // keep Game Day updated each tick (timer interval)
    updateDayUI();

    // keep Game Hour updated each tick (timer nterval)
    updateHourUI();

    // keep log of all time/day/tick changes updated on each tick
    logTimeForDebugging();      

    // If I've made it this far in this iteration of the loop, then how 
    //  do my vitals look??  => Am I still alive?
    if (core.isDead(g.c.vitals))  { 
      if (!g.justDied){
        handleDeath();    // message & do you want to play again modal?
        g.justDied = true;
      }
    }

    // If I'm still alive, let's check to see if I've been rescued
    if (core.haveIBeenRescued()) {
      if (!g.justRescued){
        handleRescue();   // message - congrats & do you want to play again
        g.justRescued = true;
      }
    }      

  }, 5);  // END: let timer = setInterval(function()

} // END: function moveSunOrMoon(sunOrMoon)

function focusCommandInputCursor() {
  document.getElementById("command-input").focus();
} // END: function focusCommandInputCursor

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

function updateDayUI() {
  let dayStr = g.t.day.toString().padStart(3, "0");
  lwrDay(`DAY:${dayStr}`);
  //return dayStr;
} // END: function updateDayUI()

function updateHourUI() {
  let hrStr = g.t.hour.toString().padStart(2, "0");
  lwrTime(`${hrStr}Hrs`);
} // END: function updateHourUI()

function incrementGameHour(numticks) {
  g.timePaused = false;
  if (!timePaused) {
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

function resetAllStats(vitals, inventory) {
  objectMap(vitals, v => 0);
  l(vitals);
  objectMap(inventory, v => 0); 
  l(inventory);
  //const myObject = { a: 1, b: 2, c: 3 }
  //console.log(objectMap(myObject, v => 2 * v)) 
}