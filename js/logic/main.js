
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



//******* EVERYTHING STARTS HERE!!! ******/
(function initGame(){
  //should I be using LOCAL vars anywhere here?
  g.isDead = false;
  g.isGameOver = false;
  g.diedRecently = false;
  g.swappedSunOrMoonRecently = false;
  g.RAoGOccurredRecently = false;
  output.printTitleBanner(g.t.gameHr, g.c);
  setAllEventListeners();
  initGameTimeDefaults();
  initMoveSunOrMoonDefaults(); 

  
  // compiler complaining that the next line - sunOrMoon is already declard, but where???
  //const sunOrMoon = document.getElementById("sunOrMoon");
  sunOrMoon = document.getElementById("sunOrMoon");

})();
//**********  RIGHT HERE!!!!  ************/    


// THE FOLLOWING is called from the starting Modal close 
//  event handler: handleMyModalClose_BeginGame()
// *********************************************************
function runMainGameLoop(){


  /************************************************************/  
  //***************  START: MAIN TIMER LOOP *******************/  
  /************************************************************/
  let timer = setInterval(function() {

    incrementGameHour(10);    

    // (re)focus the cursor upong EVERY timer tick/interval event 
    focusCommandInputCursor();

    // sun RISING PHASE
    moveSunOrMoon(sunOrMoon);
    
    everyHourDoCheck();
    // check to see a RAoG will/did occur EVERY HOUR otherwise, it will 
    //  happen too often and it's constantly killing the player
    if (g.t.minute ===0 && g.t.tick ===0) {
      g.RAoGOccurredRecently = core.doRandomActOfGod(g.c.inventory, g.c.vitals);
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
      if (!g.diedRecently){
        handleDeath();    // message & do you want to play again modal?
        g.diedRecently = true;
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
  /****************** END: MAIN TIMER LOOP *******************/
} // END: function runMainGameLoop()


function resetAllStats(vitals, inventory) {
  objectMap(vitals, v => 0);
  l(vitals);
  objectMap(inventory, v => 0); 
  l(inventory);
  //const myObject = { a: 1, b: 2, c: 3 }
  //console.log(objectMap(myObject, v => 2 * v)) 
}

function everyHourDoCheck(){
/*  
  - UpdateHour
  - IncrementVitals
  - RAoG?
  - printstats everyHour (vitals def change)
  - AmIDead?
  - AmIRescued?
  
  - doGameAction on ActivityCompletion (calculate inv & vital changes) 
  - printstats on ActivityCompletion (changes:  inv def, & vitals maybe)
  
*/
}
