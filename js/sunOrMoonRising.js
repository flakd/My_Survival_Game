
function moveSunOrMoon(sunMoon){
  let sun = document.getElementById("sun");
  let moon = document.getElementById("moon");
  let sunOrMoon = sun;
  if (!sunMoon) {
    console.log("ERROR:  you're missing sunOrMoon");
    return;
  } else if (sunMoon !="sun" && sunMoon !="moon" ){
    console.log("ERROR:  sunOrMoon must be either 'sun' or 'moon' - no other values are valid");
    return;
  } else {
    if (sunMoon === "sun") {
      moon.style.display = "none";
      sun.style.display = "block";
      document.querySelector("#sky-box").style.backgroundColor = "skyblue";
      sunOrMoon = sun;
    } else if (sunMoon === "moon"){
      moon.style.display = "block";
      document.querySelector("#sky-box").style.backgroundColor = "#7777FF";
      sun.style.display = "none";
      sunOrMoon = moon;
    }
  }

  g.time.start = Date.now();
  g.time.gameDay = 1;
  var dayStr = g.time.gameDay.toString().padStart(3,"0");
  lwrDay(`DAY:${dayStr}`);  

  let timer = setInterval(function() {
    g.time.passed = Date.now() - g.time.start;
    lwr(g.time.passed,document.querySelector("#log2"));

    g.time.oneHour = 5300;
    g.time.gameHour = Math.floor(g.time.passed / g.time.oneHour);
    g.time.dayStartHour = 0;
    g.time.dayEndHour = 24;
    g.time.sunriseHour = 5; // 5am
    g.time.sunsetHour = 20; // 9pm
    g.time.riseSetDuration = 4500;    

    var hourStr = g.time.gameHour.toString().padStart(2,"0");
    lwrTime(`${hourStr}Hrs`);

    document.getElementById("command-input").focus();


    // sun/moon RISING PHASE
    if (g.time.passed < g.time.riseSetDuration) {
    //if (g.gameHour < 0) {}
      sunOrMoon.style.left = ((g.time.passed / 200) -70) + 'px';
      sunOrMoon.style.top = (110 + (g.time.passed / 40 * -1))  + 'px';
    } 
    
    //else if (timePassed >= 9000 && timePassed < 55000) {
    else if (g.time.passed >= g.time.riseSetDuration && (g.time.passed < g.time.sunsetHour * 5300) ) {
      sunOrMoon.style.left = ((g.time.passed / 200) -70) + 'px';
    } 
    
    // sun/moon SETTING PHASE
    else if (g.time.passed >= 55000 && g.time.passed < 82800) {
      lwln(sunOrMoon.style.top);
      sunOrMoon.style.left = ((g.time.passed / 200) -70) + 'px';
      sunOrMoon.style.top = ( (g.time.passed / 75) - 744)  + 'px';
    }

    // sun or moon (day or night) lasts 64 seconds, then we switch to the other
    if (g.time.passed >= 82800) {
      //clearInterval(timer);
      g.time.start = Date.now();
      g.time.gameDay++;

      dayStr = g.time.gameDay.toString().padStart(3,"0");
      lwrDay(`DAY:${dayStr}`);

      if (sunMoon=="sun") {
        sunMoon="moon";
      } else if (sunMoon=="moon") {
        sunMoon="sun";
      }
      moveSunOrMoon(sunMoon);
    }

  }, 20);
}
