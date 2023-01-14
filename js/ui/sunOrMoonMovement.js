  
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

function swapSunOrMoon(sunMoon){
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

function moveSunOrMoon(sunOrMoon) {
  if (g.t.hour === 0 && g.t.minute === 0 && g.t.tick === 0) {
    sunOrMoon = swapSunOrMoon("moon");
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
    sunOrMoon = swapSunOrMoon("sun");
    let overlay = document.getElementById("shadow-overlay");
    overlay.classList.add("shadow");
  }

  else if (g.t.hour > g.t.moonriseHr && g.t.hour < 24) {
    sunOrMoon.style.left = -75 + (60 * (g.t.hour - g.t.moonriseHr) + g.t.minute) / 1 + "px";
  }
  return sunOrMoon;
} // END: function moveSunOrMoon(sunOrMoon)