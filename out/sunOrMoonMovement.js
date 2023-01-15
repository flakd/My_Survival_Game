"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Celestial_srcURL, _Celestial_riseHr, _Celestial_setHr, _Celestial_maxHeight, _Celestial_minHeight, _Celestial_speedFactor, _Celestial_xOffset, _Celestial_yOffset;
exports.__esModule = true;
var output = require("./output");
var SunOrMoon = /** @class */ (function () {
    function SunOrMoon(arrayOfElIds) {
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
    SunOrMoon.prototype.swapCelestials = function (id) {
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
        }
        else {
            if (id === "moon") {
                //moon.style.display = "none";
                //sun.style.display = "block";
                this.currentCelestial.src = this.sun.src;
                var skybox = document.querySelector("#sky-box");
                if (!skybox)
                    return null;
                skybox.setAttribute("style", "background-Color = skyblue");
                //sunOrMoon = sun;      
            }
            else if (id === "sun") {
                //sun.style.display = "none";      
                //moon.style.display = "block";
                this.currentCelestial.src = this.moon.src;
                var skybox = document.querySelector("#sky-box");
                if (!skybox)
                    return null;
                skybox.setAttribute("style", "background-Color = #7777FF");
            }
            //sunOrMoon = moon;
        }
    }; // END:   public swapCelestials(id?:string){
    return SunOrMoon;
}()); // END: class SunOrMoon
var Celestial = /** @class */ (function () {
    function Celestial(id, riseHr, setHr, maxHeight, minHeight, speedFactor, xOffset, yOffset) {
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
            //return null;
        }
        else if (!(this.element instanceof HTMLImageElement)) {
            console.log("HTML Element is not an image");
            //return null;
        }
        else {
            /*       this.#srcURL = this.element.src;
                  this.#riseHr = riseHr;
                  this.#setHr = setHr;
                  this.#maxHeight = maxHeight;
                  this.#minHeight = minHeight;
                  this.#speedFactor = speedFactor;
                  this.#xOffset = xOffset;
                  this.#yOffset = yOffset; */
        }
    }
    Object.defineProperty(Celestial.prototype, "src", {
        get: function () {
            return __classPrivateFieldGet(this, _Celestial_srcURL, "f");
        },
        set: function (src) {
            if (!src) {
                console.log("you must provide a non-empty string for the Celestial's(image's) src URL");
                __classPrivateFieldSet(this, _Celestial_srcURL, "null", "f");
            }
            else {
                __classPrivateFieldSet(this, _Celestial_srcURL, src, "f");
            }
        },
        enumerable: false,
        configurable: true
    });
    return Celestial;
}()); // END: class Celestial
_Celestial_srcURL = new WeakMap(), _Celestial_riseHr = new WeakMap(), _Celestial_setHr = new WeakMap(), _Celestial_maxHeight = new WeakMap(), _Celestial_minHeight = new WeakMap(), _Celestial_speedFactor = new WeakMap(), _Celestial_xOffset = new WeakMap(), _Celestial_yOffset = new WeakMap();
(function () {
    var myGameTimer = new GameTimer(10);
})();
function moveSunOrMoon(mySunOrMoon) {
    if (g.t.hour === 0 && g.t.minute === 0 && g.t.tick === 0) {
        mySunOrMoon.swapCelestials("moon");
        var overlay = document.getElementById("shadow-overlay");
        if (!overlay)
            return;
        overlay.classList.remove("shadow");
    }
    else if (g.t.hour < 1) {
        mySunOrMoon.currentCelestial.element.style.left = -75 + g.t.minute / 2 + "px";
        mySunOrMoon.currentCelestial.element.style.top = 120 + g.t.minute * 2.2 * -1 + "px";
        output.lwr(mySunOrMoon.currentCelestial.element.style.top, document.querySelector("#log3"));
    }
    //sun MOVING across the SKY
    // sun is out there for 16 Hrs, while moon for only 8 Hrs
    else if (g.t.hour >= 1 && g.t.hour < g.t.moonriseHr) {
        mySunOrMoon.currentCelestial.element.style.left = -75 + (60 * g.t.hour + g.t.minute) / 2.1 + "px";
    }
    // sun SETTING PHASE
    else if (g.t.hour == g.t.moonriseHr && g.t.minute === 0 && g.t.tick) {
        mySunOrMoon.swapCelestials("sun");
        var overlay = document.getElementById("shadow-overlay");
        if (!overlay)
            return;
        overlay.classList.add("shadow");
    }
    else if (g.t.hour > g.t.moonriseHr && g.t.hour < 24) {
        mySunOrMoon.currentCelestial.element.style.left = -75 + (60 * (g.t.hour - g.t.moonriseHr) + g.t.minute) / 1 + "px";
    }
    //return sunOrMoon;
} // END: function moveSunOrMoon(sunOrMoon)
//# sourceMappingURL=sunOrMoonMovement.js.map