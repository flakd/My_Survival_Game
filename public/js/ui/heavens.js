/* import output = require('./output');
import init = require('./init'); */

class Heavens {
  #celestials = new Array(); /* Array */
  constructor(aCelestials) {
    if (aCelestials instanceof Array) {
      this.#celestials = aCelestials;
    } else {
      if (aCelestials instanceof Celestial) {
        this.#celestials.push(aCelestials);
      }
    }
  }

  passTime(hour, minute, tick) {
    if (tick === 0) {
      for (let celestial of this.#celestials) {
        celestial.calculateState(hour, minute, tick);
      }
    }
  }
}

function moveHeavens() {
  var sun = new Celestial('sun', null, 'skyblue');
  sun.riseStart = 0; // 5am
  sun.moveStart = 1;
  sun.setStart = 15; //8pm
  sun.setEnd = 16;
  sun.speedFactor = 2.1;
  //sun.startOffset_X = -120;
  sun.startOffset_X = -100;
  sun.riseOffset_Y = 120;
  sun.setOffset_Y = -160;
  //sun.bgColor = 'skyblue';
  //sun.show();
  //sun.state = CELESTIAL_SHOWN_MIDDLE;

  //var moon = new Celestial('moon', 'moon-overlay', '7777FF');
  var moon = new Celestial('moon', null, '00008B');
  moon.riseStart = 16; // 5am
  moon.moveStart = 17;
  moon.setStart = 23; //8pm
  moon.setEnd = 24;
  moon.speedFactor = 0.5;
  //moon.startOffset_X = -600;
  moon.startOffset_X = -100;
  moon.riseOffset_Y = 100;
  moon.setOffset_Y = -180;
  //moon.bgColor = '#7777FF';
  //moon.state = CELESTIAL_SHOWN_MIDDLE;

  //g.myHeavens = new Heavens([sun]);
  g.myHeavens = new Heavens([sun, moon]);
}

class Celestial {
  celestialId;
  overlayId;
  riseStart;
  moveStart;
  setStart;
  setEnd;
  bgColor;
  state;
  #celestialEl;
  #overlayEl;
  #maxHeight;
  #minHeight;
  speedFactor;
  startOffset_X;
  riseOffset_Y;
  setOffset_Y;

  constructor(celestialId, overlayId, bgColor) {
    this.celestialId = celestialId;
    this.#celestialEl = document.getElementById(this.celestialId);
    this.overlayId = overlayId;
    this.#overlayEl = document.getElementById(this.overlayId);
    if (!this.#celestialEl) {
      console.log('Element does not exist in HTML page');
      return null;
    } else if (!(this.#celestialEl instanceof HTMLImageElement)) {
      console.log('HTML Element is not an image');
      return null;
    } else {
      this.bgColor = bgColor;

      /*    this.riseStart = riseStart;
      this.moveStart = moveStart;
      this.setStart = setStart;
      this.setEnd = setEnd; 
*/
      //this.state = showMiddle();
      /*    
      this.#maxHeight = maxHeight;
      this.#minHeight = minHeight;
      this.speedFactor = speedFactor;
      this.#xOffset = xOffset;
      this.#yOffset = yOffset;
 */
    }
  }

  get src() {
    return this.celestialEl.src;
  }
  set src(src) {
    if (!src) {
      console.log(
        "you must provide a non-empty string for the Celestial's(image's) src URL"
      );
      this.celestialEl.src = '';
    } else {
      this.celestialEl.src = src;
    }
  }

  show() {
    //this.#celestialEl.element.setAttribute("style", "display: block;");
    this.#celestialEl.style.display = 'block';
    if (this.#overlayEl) {
      this.#overlayEl.style.display = 'block';
      //let overlay = document.getElementById("shadow-overlay");
      //if (overlay) overlay.classList.add("shadow");
    } else {
      l("overlay doesn't exist for CELESTIAL: %s", this.celestialId);
    }
    let skybox = document.querySelector('#sky-box');
    if (!skybox) {
      l(
        "you're missing a sky-box div.  please create/define one in your HTML page"
      );
      return null;
    }
    if (!skybox instanceof HTMLDivElement) {
      l("sky-box found, but it's not a DIV element - please correct this");
      return null;
    }
    skybox.style.backgroundColor = this.bgColor;
  }
  hide() {
    this.#celestialEl.style.display = 'none';
    if (this.#overlayEl) {
      this.#overlayEl.style.display = 'none';
    } else {
      l("overlay doesn't exist for CELESTIAL: %s", this.celestialId);
    }
    let skybox = document.querySelector('#sky-box');
    if (!skybox) {
      l(
        "you're missing a sky-box div.  please create/define one in your HTML page"
      );
      return null;
    }
    if (!skybox instanceof HTMLDivElement) {
      l("sky-box found, but it's not a DIV element - please correct this");
      return null;
    }
    //skybox.style.backgroundColor = 'white';
    skybox.style.backgroundColor = this.bgColor;
  }

  resetPosition() {
    //if (this.celestialId === 'sun') {
    this.#celestialEl.style.left =
      this.startOffset_X + (60 * 0 + 0) / this.speedFactor + 'px';

    //this.#celestialEl.style.top = '20px';
    //}
  }

  calculateState(hour, minute, tick) {
    let totalHoursInSky = this.setEnd - this.riseStart;
    let totalWidthOfSky = 400; //in pixels
    let pixelsPerHour = totalWidthOfSky / totalHoursInSky;
    //let pixelsPerTick = pixelsPerHour / (60 * g.TICKS_PER_MINUTE);

    let moduloFactor = 2;
    let pixelsPerTimePeriod = 0;
    if (this.#celestialEl.id === 'moon') {
      pixelsPerTimePeriod = 2;
    } else if (this.#celestialEl.id === 'sun') {
      pixelsPerTimePeriod = 1;
    }

    //if (pixelsPerTick < 1) {
    //  pixelsPerTick = 1;
    //}
    let left = this.#celestialEl.style.left;
    let previousLeft = parseInt(left.substring(0, left.length - 2));
    let newLeft = 0;
    let newLeftPx = '';

    let top = this.#celestialEl.style.top;
    let previousTop = parseInt(top.substring(0, top.length - 2));
    let newTop = 0;
    let newTopPx = '';

    if (hour === this.riseStart && minute === 0 && tick === 0) {
      this.resetPosition();
      this.show();
      this.state = CELESTIAL_RISING;
      //myHeavens.swapCelestials("moon");
      //let overlay = document.getElementById("shadow-overlay");
      //if (overlay) overlay.classList.remove("shadow");
      //else console.log("Can't remove OVERLAY, it's missing.")
    }
    //sun RISING phase
    else if (
      hour > this.riseStart &&
      hour < this.moveStart &&
      minute % moduloFactor === 0 &&
      tick === 0
    ) {
      //this.#celestialEl.style.left = this.xOffset + minute / 2 + "px";
      //this.#celestialEl.style.top = this.yRiseOffset + minute * 2.2 * -1 + "px";
      /*       this.#celestialEl.style.left =
        this.startOffset_X + (60 * hour + minute) / this.speedFactor + 'px'; */
      newLeft = previousLeft + pixelsPerTimePeriod;
      newLeftPx = newLeft + 'px';
      this.#celestialEl.style.left = newLeftPx;

      newTop = previousTop + pixelsPerTimePeriod;
      newTopPx = newTop + 'px';
      this.#celestialEl.style.top = newTopPx;
      lwr(this.#celestialEl.style.top, document.querySelector('#log3'));
    }

    //sun MOVING across the SKY
    // sun is out there for 16 Hrs, while moon for only 8 Hrs
    else if (
      hour >= this.moveStart &&
      hour < this.setStart &&
      minute % moduloFactor === 0 &&
      tick === 0
    ) {
      newLeft = previousLeft + pixelsPerTimePeriod;
      newLeftPx = newLeft + 'px';
      this.#celestialEl.style.left = newLeftPx;
      //this.startOffset_X + (60 * hour + minute) / 2 + 'px';
    }

    // sun SETTING phase
    else if (
      hour >= this.setStart &&
      hour < this.setEnd &&
      /*       (minute === 0 ||
        minute === 5 ||
        minute === 10 ||
        minute === 15 ||
        minute === 20 ||
        minute === 25 ||
        minute === 30 ||
        minute === 35 ||
        minute === 40 ||
        minute === 45 ||
        minute === 50 ||
        minute === 55) && */
      minute % moduloFactor === 0 &&
      tick === 0
    ) {
      //myHeavens.swapCelestials("sun");
      //let overlay = document.getElementById("shadow-overlay");
      //if (overlay) overlay.classList.add("shadow");
      //else console.log("Can't add OVERLAY, it's missing.")
      newLeft = previousLeft + pixelsPerTimePeriod;
      newLeftPx = newLeft + 'px';
      this.#celestialEl.style.left = newLeftPx;
      //this.startOffset_X + (60 * hour + minute) / 2 + 'px';
      //this.#celestialEl.style.top = this.ySetOffset + minute * 2.2 * -1 + "px";
      lwr(this.#celestialEl.style.top, document.querySelector('#log3'));
    }

    // sun HIDDEN phase
    else if (hour == this.setEnd && minute === 0 && tick === 0) {
      this.hide();
      this.resetPosition();
    }
  }
} // END: class Celestial

const CELESTIAL_RISING = 10;
const CELESTIAL_SETTING = 20;
const CELESTIAL_MOVING = 30;
const CELESTIAL_HIDDEN = 40;
const CELESTIAL_SHOWN = 50;
const CELESTIAL_SHOWN_MIDDLE = 60;
