  // when it displays, this is the modal that holds the action/activity graphic
const activityImgModal = document.getElementById("activity-image-modal");
const activityImg = document.getElementById("activity-image");
// when it actually plays, this is the action/activity audio clip
const activityAudioClip = document.createElement("audio");
// when it displays, this is the modal that holds the RAoG graphic
const RAoGImgModal = document.getElementById("RAoG-image-modal");   
const RAoGImg = document.getElementById("RAoG-image");   
// when it actually plays, this is the RAoG audio clip
const RAoGAudioClip = document.createElement("audio");  

function playActivityMedia(activityNameStr){
  let tmpName = activityNameStr.split(" ").join("-");
  let srcFileName = "images/" + tmpName + ".gif";
  activityImg.src = srcFileName;
  activityImgModal.style.display = "block";
  activityAudioClip.src = "audio/" + tmpName + ".mp3";
  activityAudioClip.play();
  lwr(`Current Activity: ${waid.getActivityGerund()}`, document.querySelector("#log4"));
  lwrOutput(waid.getBusyMessage());  
}

function playRAoGMedia(activityNameStr){
  let tmpName = activityNameStr.split(" ").join("-");
  let srcFileName = "images/" + tmpName + ".png";
  RAoGImg.src = srcFileName;
  RAoGImgModal.style.display = "block";
  RAoGAudioClip.src = "audio/" + tmpName + ".mp3";
  RAoGAudioClip.play();
}

//function handle_activityCompleted(sender, activity, completionDuration){
function handle_activityCompleted(sender, activity){  
  // hide stuff  
  stopActivityMedia();

  //------------------------------------------------------------------------>    
  //  5. passTime() increases Hrs by action.numHrs and...
  //      increases vitals by vitals.takePerHr * action.numHrs    
  //------------------------------------------------------------------------>    
  core.doPassTime(g.c.action, g.c.inventory, g.c.vitals);  
}
function stopActivityMedia(){
  activityAudioClip.pause();
  activityImgModal.style.display = "none";
}  
function handle_btnCloseRAoGImgModal_click(sender){
  RAoGAudioClip.pause();
  RAoGImgModal.style.display = "none";  
}


class WhatAmIDoing {
  constructor() {
    //return (
      //{
      this._timeLeft = 0;
      //timeLeft = 0;
      this._activity = null;
      //activity = null;
      this._onActivityCompleted = handle_activityCompleted;          
      //onActivityCompleted = handle_activityCompleted;
      //}
    //);
  }
  startActivity(action) {
    //  Is a procedure that MUST perform the start of the activity if 
    //  possible.  It is possible if I am NOT BUSY doing anything else.
    //  RETURNS: a boolean if the activity started 
    this._timeLeft = action.numHrs * 60;
    this._activity = action;
  }
  isBusy() {
    if (this._activity !== null) {
      return true;
    } else {
      return false;
    }
  }
  getActivityName() {
    if (this.isBusy()) {
      return this._activity.key;
    }
  }
  getActivityGerund() {
    if (this.isBusy()) {
      return this._activity.gerund;
    }
  }
  getBusyMessage(message) {
    if (this.isBusy()) {
      return `You can't do that right now, you're busy ${this.getActivityGerund()} for the next ${this.getTimeLeft()} minutes`;
    } else {
      return "sure thing... you're not busy";
    }
  }
  get timeLeft() {
    if (this.isBusy()) {
      return this._timeLeft;
    } else {
      return 0;
    }
  }
  getTimeLeft() {
    if (this.isBusy()) {
      return this._timeLeft;
    } else {
      return 0;
    }
  }    
  passMinute(){
    if (this._activity === null) return;
    this._timeLeft--;
    if (this._timeLeft <= 0) {
      this._onActivityCompleted(this, this._activity);
      this._activity = null;
      this._timeLeft = 0;
    }
  }
}

(function(){
  g.waid = new WhatAmIDoing();
})();
  
function swapSunMoon(sunMoon){
  let sun = document.getElementById("sun");
  let moon = document.getElementById("moon");
  let sunOrMoon = document.getElementById("sunOrMoon");

  if (!sun) {
    console.log("your missing the HTML element 'sun'");
    return;
  }
  if (!moon) {
    console.log("your missing the HTML element 'sun'");
    return;
  }
  if (!sunMoon) {
    console.log("ERROR:  you're missing the function's sunMoon input parameter");
    return;
  } else if (sunMoon !="sun" && sunMoon !="moon" ){
    console.log("ERROR:  sunOrMoon must be either 'sun' or 'moon' - no other values are valid");
    return;
  } else {
    if (sunMoon === "moon") {
      //moon.style.display = "none";
      //sun.style.display = "block";
      sunOrMoon.src = sun.src;
      document.querySelector("#sky-box").style.backgroundColor = "skyblue";
      //sunOrMoon = sun;      
    } else if (sunMoon === "sun"){
      //sun.style.display = "none";      
      //moon.style.display = "block";
      sunOrMoon.src = moon.src;
      document.querySelector("#sky-box").style.backgroundColor = "#7777FF";
      //sunOrMoon = moon;
    }
  }
  return sunOrMoon;
}

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


function initMoveSunOrMoonDefaults() {
  g.t.sunriseHr = 0;
  g.t.sunsetHr = 5;
  g.t.moonriseHr = 16;
  g.t.moonsetHr = 12;

  g.t.sunMoonHeight = 3;
  g.t.sunMoonHeightStr = g.t.sunMoonHeight + "px";
  g.t.xSpeedInterval = 300;
  g.t.ySpeedInterval = 30;
  //g.t.xOffset = -70;
  g.t.xOffset = 0;
  //g.t.yOffset = -110; 
  g.t.yOffset = 0;
}

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

function moveSunOrMoon(sunOrMoon) {
  if (g.t.hour === 0 && g.t.minute === 0 && g.t.tick === 0) {
    sunOrMoon = swapSunMoon("moon");
    let overlay = document.getElementById("shadow-overlay");
    overlay.classList.remove("shadow");

  }
  else if (g.t.hour < 1) {
    sunOrMoon.style.left = -75 + g.t.minute / 2 + "px";
    sunOrMoon.style.top = 120 + g.t.minute * 2.2 * -1 + "px";
    lwr(sunOrMoon.style.top, document.querySelector("#log3"));
  }

  //sun MOVING across the SKY
  // sun is out there for 16 Hrs, while moon for only 8 Hrs
  else if (g.t.hour >= 1 && g.t.hour < g.t.moonriseHr) {
    sunOrMoon.style.left = -75 + (60 * g.t.hour + g.t.minute) / 2.1 + "px";
  }

  // sun SETTING PHASE
  else if (g.t.hour == g.t.moonriseHr && g.t.minute === 0 && g.t.tick) {
    sunOrMoon = swapSunMoon("sun");
    let overlay = document.getElementById("shadow-overlay");
    overlay.classList.add("shadow");
  }

  else if (g.t.hour > g.t.moonriseHr && g.t.hour < 24) {
    sunOrMoon.style.left = -75 + (60 * (g.t.hour - g.t.moonriseHr) + g.t.minute) / 1 + "px";
  }
  return sunOrMoon;
} // END: function moveSunOrMoon(sunOrMoon)

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

function playDeathMusic() {
  // add this later
}
function handleDeath() {
  playDeathMusic();
  console.log("I'm sorry but you died!  Would you like to play again?");
  if (showConfirmModal("I'm sorry but you died!  Would you like to play again?")) { 
    runMainGameLoop();          
  } else {
    playGameOverAnimation();
  } 
}

function handleRescue() {
  playResuceMusic();
  //myModal.removeEventListener("hidden.bs.modal", handleMyModalClose_BeginGame);
  //$(".modal-body").text("Yay!  You've been rescued!  You won the game!");
  //myModal.addEventListener("hidden.bs.modal", handleMyModalClose_YouWereRescued);  
  //$(".modal").modal('show');  
  console.log("closed modal - you were rescued - Would you like to play again?");
  if ( showConfirmModal("Yay!  You've been rescued!  You won the game!  Would you like to play again?") ) {
    runMainGameLoop();          
  } else {
    playGameOverAnimation();
  } 
}

function playGameOverAnimation(){
  // TODO
}

function showConfirmModal(msg) {
  bootbox.confirm({
      message: msg,
      centerVertical: true,
      buttons: {
          confirm: {
              label: 'Yes',
              className: 'btn-success'
          },
          cancel: {
              label: 'No',
              className: 'btn-danger'
          }
      },
      callback: function (result) {
          console.log('This was logged in the callback: ' + result);
          return result;
      }
  })
  return result;
}
