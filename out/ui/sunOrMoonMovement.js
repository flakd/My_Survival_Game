var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Celestial_srcURL, _Celestial_riseHr, _Celestial_setHr, _Celestial_maxHeight, _Celestial_minHeight, _Celestial_speedFactor, _Celestial_xOffset, _Celestial_yOffset;
class SunOrMoon {
    constructor(arrayOfElIds) {
        if (arrayOfElIds.length < 3) {
            console.log("you need to supply Array of 3 HTML elements when creating Class SunOrMoon.  Returning NULL");
            return null;
        }
        this.sunId = arrayOfElIds[0];
        this.moonId = arrayOfElIds[1];
        this.sunOrMoonId = arrayOfElIds[2];
        this. = new Celestial(this.sunId);
        this. = new Celestial(this.moonId);
        //this.#currentCelestial = this.#sun;
        this. = new Celestial(this.sunOrMoonId);
    }
    swapCelestials(id) {
        //function swapSunOrMoon(sunMoon){    
        if (!this.sunId) {
            console.log("you didn't specify a string id for the 'sun' image/element");
            return;
        }
        if (!this.moonId) {
            console.log("you didn't specify a string id for the 'moon' image/element");
            return;
        }
        if (!this.) {
            console.log("your missing the HTML element 'sun'");
            return;
        }
        if (!this.) {
            console.log("your missing the HTML element 'moon'");
            return;
        }
        if (!id) {
            console.log("ERROR:  you're missing the function's sunMoon input parameter");
            return;
            /*       } else if (sunMoon !="sun" && sunMoon !="moon" ){
                  console.log("ERROR:  sunOrMoon must be either 'sun' or 'moon' - no other values are valid");
                  return; */
        }
        else {
            if (id === "moon") {
                //moon.style.display = "none";
                //sun.style.display = "block";
                this..src = this..src;
                document.querySelector("#sky-box").style.backgroundColor = "skyblue";
                //sunOrMoon = sun;      
            }
            else if (id === "sun") {
                //sun.style.display = "none";      
                //moon.style.display = "block";
                this..src = this..src;
                document.querySelector("#sky-box").style.backgroundColor = "#7777FF";
                //sunOrMoon = moon;
            }
        }
        //return sunOrMoon;
    } // END:   public swapCelestials(id?:string){
} // END: class SunOrMoon
class Celestial {
    constructor(id, riseHr, setHr, maxHeight, minHeight, speedFactor, xOffset, yOffset) {
        _Celestial_srcURL.set(this, void 0);
        _Celestial_riseHr.set(this, void 0);
        _Celestial_setHr.set(this, void 0);
        _Celestial_maxHeight.set(this, void 0);
        _Celestial_minHeight.set(this, void 0);
        _Celestial_speedFactor.set(this, void 0);
        _Celestial_xOffset.set(this, void 0);
        _Celestial_yOffset.set(this, void 0);
        this.id = id;
        this.element = document.getElementById(this.id);
        if (!this.element) {
            console.log("Element does not exist in HTML page");
            return null;
        }
        else if (!(this.element instanceof HTMLImageElement)) {
            console.log("HTML Element is not an image");
            return null;
        }
        else {
            __classPrivateFieldSet(this, _Celestial_srcURL, this.element.src, "f");
            __classPrivateFieldSet(this, _Celestial_riseHr, riseHr, "f");
            __classPrivateFieldSet(this, _Celestial_setHr, setHr, "f");
            __classPrivateFieldSet(this, _Celestial_maxHeight, maxHeight, "f");
            __classPrivateFieldSet(this, _Celestial_minHeight, minHeight, "f");
            __classPrivateFieldSet(this, _Celestial_speedFactor, speedFactor, "f");
            __classPrivateFieldSet(this, _Celestial_xOffset, xOffset, "f");
            __classPrivateFieldSet(this, _Celestial_yOffset, yOffset, "f");
        }
    }
    get src() {
        return __classPrivateFieldGet(this, _Celestial_srcURL, "f");
    }
    set src(src) {
        if (!src) {
            console.log("you must provide a non-empty string for the Celestial's(image's) src URL");
            __classPrivateFieldSet(this, _Celestial_srcURL, "null", "f");
        }
        else {
            __classPrivateFieldSet(this, _Celestial_srcURL, src, "f");
        }
    }
} // END: class Celestial
_Celestial_srcURL = new WeakMap(), _Celestial_riseHr = new WeakMap(), _Celestial_setHr = new WeakMap(), _Celestial_maxHeight = new WeakMap(), _Celestial_minHeight = new WeakMap(), _Celestial_speedFactor = new WeakMap(), _Celestial_xOffset = new WeakMap(), _Celestial_yOffset = new WeakMap();
function moveSunOrMoon(mySunOrMoon) {
    g = window;
    if (g.t.hour === 0 && g.t.minute === 0 && g.t.tick === 0) {
        mySunOrMoon.swapCelestials("moon");
        let overlay = document.getElementById("shadow-overlay");
        overlay.classList.remove("shadow");
    }
    else if (g.t.hour < 1) {
        mySunOrMoon.currentCelestial.element.style.left = -75 + g.t.minute / 2 + "px";
        mySunOrMoon.currentCelestial.element.style.top = 120 + g.t.minute * 2.2 * -1 + "px";
        lwr(mySunOrMoon.currentCelestial.element.style.top, document.querySelector("#log3"));
    }
    //sun MOVING across the SKY
    // sun is out there for 16 Hrs, while moon for only 8 Hrs
    else if (g.t.hour >= 1 && g.t.hour < g.t.moonriseHr) {
        mySunOrMoon.currentCelestial.element.style.left = -75 + (60 * g.t.hour + g.t.minute) / 2.1 + "px";
    }
    // sun SETTING PHASE
    else if (g.t.hour == g.t.moonriseHr && g.t.minute === 0 && g.t.tick) {
        mySunOrMoon.swapCelestials("sun");
        let overlay = document.getElementById("shadow-overlay");
        overlay.classList.add("shadow");
    }
    else if (g.t.hour > g.t.moonriseHr && g.t.hour < 24) {
        mySunOrMoon.currentCelestial.element.style.left = -75 + (60 * (g.t.hour - g.t.moonriseHr) + g.t.minute) / 1 + "px";
    }
    //return sunOrMoon;
} // END: function moveSunOrMoon(sunOrMoon)
//# sourceMappingURL=sunOrMoonMovement.js.map