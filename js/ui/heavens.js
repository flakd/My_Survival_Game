/* import output = require('./output');
import init = require('./init'); */
   

class Heavens {
  Celestials = new Array(); /* Array */
  constructor(arrayOfCelestials) {
    if (arrayOfCelestials instanceof Array) {
      if (arrayOfCelestials.length < 2) {
        console.log("you need to supply an Array of a min of 2 Celestials when creating Class Heavens.  Returning NULL");
        return null;
      }  
      this.Celestials = arrayOfCelestials;
    } else {
      var sun = new Celestial();
      this.Celestials.push(sun);
      var moon = new Celestial();
      this.Celestials.push(moon);
    }
  }

  passTime(hour, minute, tick){
    //if (minute === 0 && tick === 0) {
      for (var i = 0; i < this.Celestials.length - 1; i++) {
        this.Celestials[i].calculateState(hour, minute);
      }
    //}
  }
}



/*   swapCelestials(id){
    //function swapHeavens(sunMoon){    
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
      console.log("ERROR:  Heavens must be either 'sun' or 'moon' - no other values are valid");
      return; 
    } else {
      if (id === "moon") {
        //moon.style.display = "none";
        //sun.style.display = "block";
        this.currentCelestial.element.src = this.sun.element.src;
        let skybox = document.querySelector("#sky-box");
        if (!skybox) return null;
        skybox.setAttribute("style", "background-Color = skyblue");
        //Heavens = sun;      
      } else if (id === "sun"){
        //sun.style.display = "none";      
        //moon.style.display = "block";
        this.currentCelestial.element.src = this.moon.element.src;
        let skybox = document.querySelector("#sky-box");
        if (!skybox) return null;
        skybox.setAttribute("style","background-Color = #7777FF"); }
        //Heavens = moon;
    }
  } // END:   swapCelestials(id){

} // END: class Heavens */



function moveHeavens(){
  var sun = new Celestial("sun",null,"skyblue")
  sun.riseStart = 0; // 5am
  sun.moveStart = 1;
  sun.setStart = 6; //8pm
  sun.setEnd = 7;
  sun.xOffset = -75;
  sun.yRiseOffset = 120;
  sun.ySetOffset = -160;
  sun.bgColor = "skyblue";
  //sun.show();
  //sun.state = CELESTIAL_SHOWN_MIDDLE;

  var moon = new Celestial("moon","moon-overlay","7777FF")
  moon.riseStart = 21; // 5am
  moon.moveStart = 22;
  moon.setStart = 4; //8pm
  moon.setEnd = 5;
  moon.xOffset = -75;
  moon.yRiseOffset = 100;
  moon.ySetOffset = -180;
  moon.bgColor = "#7777FF";
  //moon.state = CELESTIAL_SHOWN_MIDDLE;

  var celestials = [sun,moon];
  g.myHeavens = new Heavens(celestials);
}

class Celestial {
  celestialId;overlayId;riseStart;moveStart;setStart;setEnd;bgColor;state;#celestialEl;#overlayEl;#maxHeight;#minHeight;#speedFactor;xOffset;yRiseOffset;ySetOffset;
  

  constructor(celestialId,overlayId,bgColor) {
    this.celestialId = celestialId;                
    this.#celestialEl = document.getElementById(this.celestialId);
    this.overlayId = overlayId;
    this.#overlayEl = document.getElementById(this.overlayId);
    if (!this.#celestialEl) {
      console.log("Element does not exist in HTML page");
      //return null;
    } else if ( !(this.#celestialEl instanceof HTMLImageElement) ) {
      console.log("HTML Element is not an image");
      //return null;
    } else {
/*       this.riseStart = riseStart;
      this.moveStart = moveStart;
      this.setStart = setStart;
      this.setEnd = setEnd; 
*/
      this.bgColor = bgColor;
      //this.state = showMiddle();

/*    
      this.#maxHeight = maxHeight;
      this.#minHeight = minHeight;
      this.#speedFactor = speedFactor;
      this.#xOffset = xOffset;
      this.#yOffset = yOffset;
 */    }      
  }

  get src() {
    return this.celestialEl.src;
  }
  set src(src) {
    if (!src) {
      console.log("you must provide a non-empty string for the Celestial's(image's) src URL");
      this.celestialEl.src = "";
    } else {
      this.celestialEl.src = src;
    }

  }

  show(){
    //this.#celestialEl.element.setAttribute("style", "display: block;");
    this.#celestialEl.style.display = "block";
    if (this.#overlayEl) {
      this.#overlayEl.style.display = "block";
      //let overlay = document.getElementById("shadow-overlay");
      //if (overlay) overlay.classList.add("shadow");

    } else {
      l("overlay doesn't exist for CELESTIAL: %s", this.celestialId);
    }    
    let skybox = document.querySelector("#sky-box");
    if (!skybox) {
      l("you're missing a sky-box div.  please create/define one in your HTML page");
      return null;
    }
    if (!skybox instanceof HTMLDivElement) {
      l("sky-box found, but it's not a DIV element - please correct this");
      return null;
    }
    skybox.style.backgroundColor = this.bgColor;
  }
  hide(){
    this.#celestialEl.style.display = "none";
    if (this.#overlayEl) {
      this.#overlayEl.style.display = "none";
    } else {
      l("overlay doesn't exist for CELESTIAL: %s", this.celestialId);
    }
    let skybox = document.querySelector("#sky-box");
    if (!skybox) {
      l("you're missing a sky-box div.  please create/define one in your HTML page");
      return null;
    }
    if (!skybox instanceof HTMLDivElement) {
      l("sky-box found, but it's not a DIV element - please correct this");
      return null;
    }
    skybox.style.backgroundColor = "white";    
  }  

  resetPosition(){

  }

  calculateState(hour, minute){
    if (hour === this.riseStart && minute === 0) {
      this.show();
      this.state = CELESTIAL_RISING;
      //myHeavens.swapCelestials("moon");
      //let overlay = document.getElementById("shadow-overlay");
      //if (overlay) overlay.classList.remove("shadow");
      //else console.log("Can't remove OVERLAY, it's missing.")
    }
    //sun RISING phase
    else if (hour > this.riseStart && hour < this.moveStart) {
      //this.#celestialEl.style.left = this.xOffset + minute / 2 + "px";
      //this.#celestialEl.style.top = this.yRiseOffset + minute * 2.2 * -1 + "px";
      this.#celestialEl.style.left = this.xOffset + (60 * hour + minute) / 2.1 + "px";
      lwr(this.#celestialEl.style.top, document.querySelector("#log3"));
    }
  
    //sun MOVING across the SKY
    // sun is out there for 16 Hrs, while moon for only 8 Hrs
    else if (hour >= this.moveStart && hour < this.setStart) {
      this.#celestialEl.style.left = this.xOffset + (60 * hour + minute) / 2.1 + "px";
    }
  
    // sun SETTING phase
    else if (hour >= this.setStart && hour < this.setEnd) {
      //myHeavens.swapCelestials("sun");
      //let overlay = document.getElementById("shadow-overlay");
      //if (overlay) overlay.classList.add("shadow");
      //else console.log("Can't add OVERLAY, it's missing.")
      this.#celestialEl.style.left = this.xOffset + minute / 2 + "px";
      this.#celestialEl.style.top = this.ySetOffset + minute * 2.2 * -1 + "px";
      lwr(this.#celestialEl.style.top, document.querySelector("#log3"));
    }
  
    // sun HIDDEN phase
    else if (hour == this.setEnd) {
      this.hide();
      this.resetPosition();
    }
      
    else if (hour > this.setEnd) {      
      //this.#celestialEl.style.left = -75 + (60 * (g.t.hour - g.t.moonriseHr) + g.t.minute) / 1 + "px";
    }
  }
} // END: class Celestial




const CELESTIAL_RISING = 10;
const CELESTIAL_SETTING = 20;
const CELESTIAL_MOVING = 30;
const CELESTIAL_HIDDEN = 40;
const CELESTIAL_SHOWN = 50;
const CELESTIAL_SHOWN_MIDDLE = 60;

