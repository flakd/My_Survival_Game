
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
      sunOrMoon = sun;
    } else if (sunMoon === "moon"){
      moon.style.display = "block";
      sun.style.display = "none";
      sunOrMoon = moon;
    }
  }
  let start = Date.now();

  let timer = setInterval(function() {
    let timePassed = Date.now() - start;
    lwr(timePassed,document.querySelector("#log2"));

    // sun/moon RISING PHASE
    if (timePassed < 9000) {
      sunOrMoon.style.left = ((timePassed / 150) -70) + 'px';
      sunOrMoon.style.top = (110 + (timePassed / 75 * -1))  + 'px';
    } 
    
    else if (timePassed >= 9000 && timePassed < 55000) {
      sunOrMoon.style.left = ((timePassed / 150) -70) + 'px';
      //sunOrMoon.style.top = ( (timePassed / 75) - 90)  + 'px';
    } 
    
    // sun/moon SETTING PHASE
    else if (timePassed >= 55000 && timePassed < 64000) {
      lwln(sunOrMoon.style.top);
      sunOrMoon.style.left = ((timePassed / 150) -70) + 'px';
      sunOrMoon.style.top = ( (timePassed / 75) - 744)  + 'px';
    }

    // sun or moon (day or night) lasts 64 seconds, then we switch to the other
    if (timePassed >= 64000) {
      clearInterval(timer);
      if (sunMoon=="sun") {
        sunMoon="moon";
      } else if (sunMoon=="moon") {
        sunMoon="sun";
      }
      moveSunOrMoon(sunMoon);
    }

  }, 20);
}
