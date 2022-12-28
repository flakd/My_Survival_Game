
function swapSunMoon(sunMoon){
  let sun = document.getElementById("sun");
  let moon = document.getElementById("moon");
  let sunOrMoon;

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



function moveSunOrMoon(sunOrMoon){
  let didSwapRecently = false;
  
  g.t.todayStart = g.t.start = Date.now();
  g.t.tick = 0;
  g.t.totalTicks = 0;
  g.t.minute = 0;
  g.t.totalMinutes = 0;
  g.t.hour = 0;
  g.t.totalHours = 0;
  g.t.day = 0;

  g.t.gameDay = 0;
  g.t.hours = 5;
  
  g.t.hours = 0;  

  var dayStr = g.t.gameDay.toString().padStart(3,"0");
  lwrDay(`DAY:${dayStr}`);  


  g.t.oneHr = 1500;     
  g.t.riseSetDur = 500;
  g.t.dayStartHr = 0;   
  g.t.dayEndHr = 24;
  
  g.t.sunriseHr = 0;    g.t.sunriseStart = g.t.sunriseHr * g.t.oneHr;
                        g.t.sunriseDone = (g.t.sunriseHr * g.t.oneHr) + g.t.riseSetDur;    
  
  g.t.sunsetHr = 15;    g.t.sunsetStart = g.t.sunsetHr * g.t.oneHr;
                        g.t.sunsetDone = (g.t.sunsetHr * g.t.oneHr) + g.t.riseSetDur;    

  g.t.moonriseHr = 16;  g.t.moonriseStart = g.t.moonriseHr * g.t.oneHr;
                        g.t.moonriseDone = (g.t.moonriseHr * g.t.oneHr) + g.t.riseSetDur;    

  g.t.moonsetHr = 23;   g.t.moonsetStart = g.t.moonsetHr * g.t.oneHr;
                        g.t.moonsetDone = (g.t.moonsetHr * g.t.oneHr) + g.t.riseSetDur;
  
  g.t.sunMoonHeight = 3;
  g.t.sunMoonHeightStr = g.t.sunMoonHeight + "px";
  g.t.xSpeedInterval = 100;
  g.t.ySpeedInterval = 10;
  //g.t.xOffset = -70;
  g.t.xOffset = 0;
  //g.t.yOffset = -110; 
  g.t.yOffset = 0; 

  let timer = setInterval(function() {
    g.t.tick++;
    g.t.totalTicks++;
    if (g.t.tick > 1) {   // TimerInterval = 100ms right now, so this will be 1500 ms or 1.5 seconds
      g.t.tick = 0;
      g.t.minute++;
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
    g.t.passed = Date.now() - g.t.start;
    lwr(  (
            `MINUTE: ${g.t.minute}<br>\n` +
            `HOUR: ${g.t.hour}<br>\n` +
            `DAY: ${g.t.day}<br>\n` +

            `TIME PASSED: ${g.t.passed}<br>\n` +            
            `totMINUTEs: ${g.t.totalMinutes}<br>\n` +
            `totHOURs: ${g.t.totalHours}<br>\n`


          ), document.querySelector("#log2")
    );

    g.t.gameHr = Math.floor(g.t.passed / g.t.oneHr) + g.t.sunriseHr;

    let hrStr = g.t.gameHr.toString().padStart(2,"0");
    lwrTime(`${hrStr}Hrs`);

    document.getElementById("command-input").focus();

    // sun RISING PHASE
    if (g.t.passed >= g.t.sunriseStart && g.t.passed <= g.t.sunriseDone ) {
    //if (g.gameHr < 0) {}
      sunOrMoon.style.left = ((g.t.passed / g.t.xSpeedInterval) + g.t.xOffset) + 'px';
      sunOrMoon.style.top = (48 + (g.t.passed / g.t.ySpeedInterval * -1))  + 'px';
      lwr(sunOrMoon.style.top, document.querySelector("#log3"));
    } 
    
    //sun MOVING across the SKY
    // sun is out there for 16 Hrs, while moon for only 8 Hrs
    else if (g.t.passed >= g.t.sunriseDone && g.t.passed <= g.t.sunsetStart ) {
      sunOrMoon.style.left = ((g.t.passed / g.t.xSpeedInterval) + g.t.xOffset) + 'px';
      lwr(`sun moving right: ${sunOrMoon.style.top}`, document.querySelector("#log3"));
    } 
    
    // sun SETTING PHASE
    else if ( g.t.passed >= g.t.sunsetStart && g.t.passed <= g.t.sunsetDone ) {
      var actualSunSetTime = g.t.passed - g.t.sunsetHr * g.t.oneHr;
      lwln(sunOrMoon.style.top);
      sunOrMoon.style.left = ((g.t.passed / g.t.xSpeedInterval) + g.t.xOffset) + 'px';
      //sunOrMoon.style.top = ( (g.t.passed / 75) - 744)  + 'px';
      sunOrMoon.style.top = -2 + actualSunSetTime / g.t.ySpeedInterval + 'px';
      lwr(sunOrMoon.style.top, document.querySelector("#log3"));
    }

    else if (g.t.passed >= g.t.sunsetDone && g.t.passed <= g.t.moonriseStart){
    //else if (g.t.passed == g.t.moonriseStart) {
      if (!didSwapRecently) {
        //sunOrMoon = swapSunMoon(sunOrMoon);
        sunOrMoon = swapSunMoon("sun");
        didSwapRecently = true;
      }
    } 

    
    else if (g.t.passed >= g.t.moonriseStart && g.t.passed <= g.t.moonriseDone) {
      didSwapRecently = false;

      lwr(sunOrMoon.style.top, document.querySelector("#log3"));
      sunOrMoon.style.left = ((g.t.passed / g.t.xSpeedInterval) + g.t.xOffset) + 'px';
      //sunOrMoon.style.top = (110 + (g.t.passed / g.t.ySpeedInterval * -1))  + 'px';
      lwr(sunOrMoon.style.top, document.querySelector("#log3"));
    } 
/*
    else if (g.t.passed >= (g.t.moonriseDone) && (g.t.passed <= g.t.moonsetStart) ) {
      
      sunOrMoon.style.left = ((g.t.passed / g.t.xSpeedInterval) + g.t.xOffset) + 'px';
      lwr(sunOrMoon.style.top, document.querySelector("#log3"));
    }     

    // sun/moon SETTING PHASE
    else if ( g.t.passed >= g.t.moonsetStart &&  (g.t.passed <= g.t.moonsetDone) ) {
      var actualSunSetTime = g.t.passed - g.t.moonsetHr * g.t.oneHr;
      lwln(sunOrMoon.style.top);
      sunOrMoon.style.left = ((g.t.passed / g.t.xSpeedInterval) + g.t.xOffset) + 'px';
      //sunOrMoon.style.top = ( (g.t.passed / 75) - 744)  + 'px';
      //sunOrMoon.style.top = -2 + actualSunSetTime / g.t.ySpeedInterval + 'px';
      lwr(sunOrMoon.style.top, document.querySelector("#log3"));
    } */

    else if ( g.t.passed >= g.t.oneHr *24) {
      //clearInterval(timer);
      g.t.start = Date.now();
      g.t.gameDay++;
      sunOrMoon = swapSunMoon("moon");

      dayStr = g.t.gameDay.toString().padStart(3,"0");
      lwrDay(`DAY:${dayStr}`);

    }

  }, 100);
}
