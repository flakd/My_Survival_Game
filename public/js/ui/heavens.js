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
    //if (tick === 0) {
    for (let celestial of this.#celestials) {
      celestial.calculateState(hour, minute, tick);
    }
    //}
  }
}

function createHeavens() {
  var sun = new Celestial('sun', null, 'skyblue');
  sun.riseStart = 0; // 5am
  sun.moveStart = 1;
  sun.setStart = 15; //8pm
  sun.setEnd = 16;
  sun.maxHeight = CELESTIAL_MAXHEIGHT;
  sun.minHeight = CELESTIAL_MINHEIGHT;
  sun.startOffset_X = CELESTIAL_OFFSET_X;
  sun.pxPerTickModifier = CELESTIAL_PXPERTICK_MOD;
  sun.distanceFactor_Y = CELESTIAL_DIST_MOD_Y * 1.8;

  //var moon = new Celestial('moon', 'moon-overlay', '7777FF');
  var moon = new Celestial('moon', null, '#00008B');
  moon.riseStart = 16; // 5am
  moon.moveStart = 17;
  moon.setStart = 23; //8pm
  moon.setEnd = 24;
  moon.maxHeight = CELESTIAL_MAXHEIGHT;
  moon.minHeight = CELESTIAL_MINHEIGHT;
  moon.startOffset_X = CELESTIAL_OFFSET_X;
  moon.pxPerTickModifier = CELESTIAL_PXPERTICK_MOD;
  moon.distanceFactor_Y = CELESTIAL_DIST_MOD_Y;

  g.myHeavens = new Heavens([sun, moon]);
  let test = true;
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
  maxHeight;
  minHeight;
  speedFactor_X;
  distanceFactor_Y;
  startOffset_X;
  position_X;
  position_Y;
  pxPerTickModifier;

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
      //this.distanceFactor = 1.7;  //see above
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
    this.position_X = this.startOffset_X;
    this.#celestialEl.style.left = this.position_X + 'px';

    this.position_Y = this.minHeight;
    this.#celestialEl.style.top = this.position_Y + 'px';
  }

  calculateState(hour, minute, tick) {
    let totalHoursInSky = this.setEnd - this.riseStart;
    let totalWidthOfSky = 400; //in pixels
    let pixelsPerHour = totalWidthOfSky / totalHoursInSky;
    let pixelsPerTick = pixelsPerHour / (60 * g.TICKS_PER_MINUTE);
    let pixelsPerTickMod = pixelsPerTick * this.pxPerTickModifier;

    if (hour === this.riseStart && minute === 0 && tick === 0) {
      this.state = CELESTIAL_SHOWN;

      this.resetPosition();
      this.show();
      this.position_Y = this.position_Y;
    }
    //sun RISING phase
    else if (hour >= this.riseStart && hour < this.moveStart) {
      this.state = CELESTIAL_RISING;
      this.position_X = this.position_X + pixelsPerTickMod;
      this.#celestialEl.style.left =
        this.startOffset_X + Math.round(this.position_X) + 'px';

      this.position_Y =
        this.position_Y - pixelsPerTickMod * this.distanceFactor_Y;
      this.#celestialEl.style.top =
        //this.startOffset_Y - Math.round(this.position_Y) + 'px';
        Math.round(this.position_Y) + 'px';

      lwr(this.#celestialEl.style.top, document.querySelector('#log3'));
    }

    //sun MOVING across the SKY
    // sun is out there for 16 Hrs, while moon for only 8 Hrs
    else if (hour >= this.moveStart && hour < this.setStart) {
      this.state = CELESTIAL_MOVING;

      this.position_X = this.position_X + pixelsPerTickMod;
      this.#celestialEl.style.left =
        this.startOffset_X + Math.round(this.position_X) + 'px';
    }

    // sun SETTING phase
    else if (hour >= this.setStart && hour < this.setEnd) {
      this.state = CELESTIAL_SETTING;
      this.position_X = this.position_X + pixelsPerTickMod;
      this.#celestialEl.style.left =
        this.startOffset_X + Math.round(this.position_X) + 'px';

      //if (minute === 0 && tick === 0) alert();
      this.position_Y =
        this.position_Y + pixelsPerTickMod * this.distanceFactor_Y;
      this.#celestialEl.style.top =
        //this.startOffset_Y + Math.round(this.position_Y) + 'px';
        Math.round(this.position_Y) + 'px';

      lwr(this.#celestialEl.style.top, document.querySelector('#log3'));
    }

    // sun HIDDEN phase
    else if (hour == this.setEnd && minute === 0 && tick === 0) {
      this.state = CELESTIAL_HIDDEN;
      this.hide();
      this.resetPosition();
    }
  }
} // END: class Celestial
