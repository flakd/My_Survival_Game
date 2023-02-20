if (g.isBrowserOrNode === 'node') {
  const {exit} = require('process');
  const readline = require('readline');
  const parseJSONs = require('./parseJSONs');
  const core = require('./core');
  const output = require('./output').default;
  var rl;
  window.parseJSONs.loadJSONs();
  g.c.inventory = parseJSONs.Objects.inventory;
  g.c.vitals = parseJSONs.Objects.vitals;
  g.c.actions = parseJSONs.Objects.actions;
}

const runGameLoop = () => {
  incrementGameHour(g.TICKS_PER_MINUTE); //time.js
  //myGameTimer.increment();

  // (re)focus the cursor upon EVERY timer tick/interval event
  focusCommandInputCursor();

  // sun RISING PHASE

  everyHourDoCheck();
  // check to see a RAoG will/did occur EVERY HOUR otherwise, it will
  //  happen too often and it's constantly killing the player
  if (g.t.minute === 0 && g.t.tick === 0) {
    g.RAoGOccurredRecently = core.doRandomActOfGod(g.c.inventory, g.c.vitals);
  }

  // keep Vitals and Inventory stats updated each tick (timer interval)
  output.printStats1(g.t.gameHr, g.c);

  // keep Game Day updated each tick (timer interval)
  updateDayUI();

  // keep Game Hour updated each tick (timer nterval)
  updateHourUI();

  // keep log of all time/day/tick changes updated on each tick
  logTimeForDebugging();

  // If I've made it this far in this iteration of the loop, then how
  //  do my vitals look??  => Am I still alive?
  if (core.isDead(g.c.vitals)) {
    // check for diedRecently so that I don't get stuck in a loop once I am dead
    if (!g.diedRecently) {
      handleDeath(); // message & do you want to play again modal?
      g.diedRecently = true;
    }
  }

  // If I'm still alive, let's check to see if I've been rescued
  if (core.haveIBeenRescued()) {
    // check for diedRecently so that I don't get stuck in a loop once I am dead
    if (!g.rescuedRecently) {
      handleRescue(); // message - congrats & do you want to play again
      g.rescuedRecently = true;
    }
  }
}; // END:  runGameLoop = () =>

function resetAllStats(vitals, inventory) {
  objectMap(vitals, (v) => 0);
  l(vitals);
  objectMap(inventory, (v) => 0);
  l(inventory);
  //const myObject = { a: 1, b: 2, c: 3 }
  //console.log(objectMap(myObject, v => 2 * v))
}

function everyHourDoCheck() {
  /*  
  - UpdateHourUI/UpdateDayUI
  - IncrementVitals
  - RAoG?
  - printstats everyHour (vitals def change)
  - AmIDead?
  - AmIRescued?
  
  - doGameAction on ActivityCompletion (calculate inv & vital changes) 
  - printstats on ActivityCompletion (changes:  inv def, & vitals maybe)
  
*/
}

//******* EVERYTHING STARTS HERE!!! ******/
(function initGame() {
  //should I be using LOCAL vars anywhere here?
  g.isDead = false;
  g.isGameOver = false;
  g.diedRecently = false;
  g.rescuedRecently = false;

  //not sure this is needed
  //g.swappedHeavensRecently = false;

  //not sure this is needed - I think it is until I have an object with a "isBusy" blocker
  g.RAoGOccurredRecently = false;

  output.printTitleBanner(g.t.gameHr, g.c);
  setAllEventListeners();
  initGameTimeDefaults();
  //initMoveHeavensDefaults();
})();
//**********  RIGHT HERE!!!!  ************/

// THE FOLLOWING is called from the starting Modal close
//  event handler: handleMyModalClose_BeginGame()
// *********************************************************
function runMainGameLoop() {
  g.t.sunriseHr = 0;
  g.t.sunsetHr = 5;
  g.t.moonriseHr = 16;
  g.t.moonsetHr = 12;

  g.t.sunMoonHeight = 3;
  g.t.sunMoonHeightStr = g.t.sunMoonHeight + 'px';
  g.t.xSpeedInterval = 300;
  g.t.ySpeedInterval = 30;
  //g.t.xOffset = -70;
  g.t.xOffset = 0;
  //g.t.yOffset = -110;
  g.t.yOffset = 0;

  //myGameTimer = new GameTimer(g.TICKS_PER_MINUTE); //10 ticks per minute

  /************************************************************/
  //***************  START: MAIN TIMER LOOP *******************/
  /************************************************************/
  createHeavens(); //heavens.js
  let timer = setInterval(runGameLoop, 1); //in this file
  /****************** END: MAIN TIMER LOOP *******************/
} // END: function runMainGameLoop()
