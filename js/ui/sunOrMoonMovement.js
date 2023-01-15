/* import output = require('./output');
import init = require('./init'); */
   

class SunOrMoon {
  sunId; moonId; sunOrMoonId; sun; moon; currentCelestial; state;

  constructor(arrayOfElIds) {
    if (arrayOfElIds.length < 3) {
      console.log("you need to supply Array of 3 HTML elements when creating Class SunOrMoon.  Returning NULL");
      //return null;
    }
    this.sunId = arrayOfElIds[0];
    this.moonId = arrayOfElIds[1];
    this.sunOrMoonId = arrayOfElIds[2];
    this.sun = new Celestial(this.sunId);
    this.moon = new Celestial(this.moonId);
    //this.#currentCelestial = this.#sun;
    this.currentCelestial = new Celestial(this.sunOrMoonId);
  }

  swapCelestials(id){
    //function swapSunOrMoon(sunMoon){    
    if (!this.sunId) {
      console.log("you didn't specify a string id for the 'sun' image/element");
      return;
    }
    if (!this.moonId) {
      console.log("you didn't specify a string id for the 'moon' image/element");
      return;
    }      
    if (!this.sun) {
      console.log("your missing the HTML element 'sun'");
      return;
    }
    if (!this.moon) {
      console.log("your missing the HTML element 'moon'");
      return;
    }      
    if (!id) {
      console.log("ERROR:  you're missing the function's sunMoon input parameter");
      return;
/*       } else if (sunMoon !="sun" && sunMoon !="moon" ){
      console.log("ERROR:  sunOrMoon must be either 'sun' or 'moon' - no other values are valid");
      return; */
    } else {
      if (id === "moon") {
        //moon.style.display = "none";
        //sun.style.display = "block";
        this.currentCelestial.element.src = this.sun.element.src;
        let skybox = document.querySelector("#sky-box");
        if (!skybox) return null;
        skybox.setAttribute("style", "background-Color = skyblue");
        //sunOrMoon = sun;      
      } else if (id === "sun"){
        //sun.style.display = "none";      
        //moon.style.display = "block";
        this.currentCelestial.element.src = this.moon.element.src;
        let skybox = document.querySelector("#sky-box");
        if (!skybox) return null;
        skybox.setAttribute("style","background-Color = #7777FF"); }
        //sunOrMoon = moon;
    }
  } // END:   swapCelestials(id){

} // END: class SunOrMoon



class Celestial {
  id;element;#srcURL;#riseStart;MoveStart;#setStart;#setEnd;#maxHeight;#minHeight;#speedFactor;#xOffset;#yOffset;state;

  constructor(id, riseHr, setHr, maxHeight, 
              minHeight, speedFactor, xOffset, yOffset) {
    this.id = id;                
    this.element = document.getElementById(this.id);
    if (!this.element) {
      console.log("Element does not exist in HTML page");
      //return null;
    } else if ( !(this.element instanceof HTMLImageElement) ) {
      console.log("HTML Element is not an image");
      //return null;
    } else {
       this.#srcURL = this.element.src;
/*
      this.#riseHr = riseHr;
      this.#setHr = setHr;
      this.#maxHeight = maxHeight;
      this.#minHeight = minHeight;
      this.#speedFactor = speedFactor;
      this.#xOffset = xOffset;
      this.#yOffset = yOffset; */
    }      
  }

  get src() {
    return this.#srcURL;
  }
  set src(src) {
    if (!src) {
      console.log("you must provide a non-empty string for the Celestial's(image's) src URL");
      this.#srcURL = "null";
    } else {
      this.#srcURL = src;
    }

  }
} // END: class Celestial




const CELESTIAL_RISING = 0;
const CELESTIAL_SETTING = 1;
const CELESTIAL_MOVING = 2;
const CELESTIAL_HIDDEN = 3;




function moveSunOrMoon(mySunOrMoon) {
  if (g.t.hour === 0 && g.t.minute === 0 && g.t.tick === 0) {
    mySunOrMoon.state = CELESTIAL_RISING;
    mySunOrMoon.swapCelestials("moon");
    let overlay = document.getElementById("shadow-overlay");
    if (!overlay) return;
    overlay.classList.remove("shadow");
  }
  else if (g.t.hour < 1) {
    mySunOrMoon.currentCelestial.element.style.left = -75 + g.t.minute / 2 + "px";
    mySunOrMoon.currentCelestial.element.style.top = 120 + g.t.minute * 2.2 * -1 + "px";
    lwr(mySunOrMoon.currentCelestial.element.style.top, document.querySelector("#log3"));
  }
/*   else if (g.t.hour > 1 && g.t.hour < 5 ){
    mySunOrMoon.swapCelestials("sun");
  } */

  //sun MOVING across the SKY
  // sun is out there for 16 Hrs, while moon for only 8 Hrs
  else if (g.t.hour >= 1 && g.t.hour < g.t.moonriseHr) {
    mySunOrMoon.currentCelestial.element.style.left = -75 + (60 * g.t.hour + g.t.minute) / 2.1 + "px";
  }

  // sun SETTING PHASE
  else if (g.t.hour == g.t.moonriseHr && g.t.minute === 0 && g.t.tick) {
    mySunOrMoon.swapCelestials("sun");
    let overlay = document.getElementById("shadow-overlay");
    if (!overlay) return;    
    overlay.classList.add("shadow");
  }

  else if (g.t.hour > g.t.moonriseHr && g.t.hour < 24) {
    mySunOrMoon.currentCelestial.element.style.left = -75 + (60 * (g.t.hour - g.t.moonriseHr) + g.t.minute) / 1 + "px";
  }
  //return sunOrMoon;
} // END: function moveSunOrMoon(sunOrMoon)