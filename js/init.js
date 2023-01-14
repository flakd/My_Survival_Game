
//import sound from "audio/survival_game_intro.mp3";
//    the following in combination with the import above did not work
//      const gameLoadMusic = new Audio(sound);


let isBrowserOrNode = "";
const g = (function getGlobalObject(){
  if (typeof global !== 'undefined') {
    if (typeof module === "object" && typeof module.exports === "object") {
      if (typeof process === 'object') {
        if (typeof process.versions === 'object') {
          if (typeof process.versions.node !== 'undefined') {
            // this is running in NODE.JS
            isBrowserOrNode = "node";
            return global;
          }
        }
      }
    }
  } else
  if (typeof window !== "undefined" && typeof window.document !== "undefined") {
    // browser
    isBrowserOrNode = "browser";
    return window;
  }
})();
g.isBrowserOrNode = isBrowserOrNode;


//============== START: Helpers ==============
//============================================
const logWriters = {
  checkLog: function checkLog(logTarget){
    let log;
    if ( (logTarget) && (logTarget instanceof Element) ) {
      log = logTarget;
    } else {
      log = document.querySelector("#log");
      if (!log) {
        console.log("You're missing/you need to specify an element with 'id=#log'");
        return false;
      }
    }     
    return log;
  },
  lw: function lw(msg, logTarget){
    let log = logWriters.checkLog(logTarget)
    log.innerHTML += msg;
  },
  lwFormat: function lwFormat(msg, logTarget){
    let log = logWriters.checkLog(logTarget)
    log.innerHTML += msg + "; ";
  },
  lwLn: function lwLn(msg, logTarget){
    if (msg===undefined) msg = "";    
    let log = logWriters.checkLog(logTarget)
    log.innerHTML += msg + "<br>\n";
  },  
  lwReplace: function lwReplace(msg, logTarget){
    if (msg===undefined) msg = "";    
    let log = logWriters.checkLog(logTarget)
    log.innerHTML = msg;
  }    

};

const e=function(msg){console.error("**ERROR**: %s",msg)};
const l = console.log;

lw=logWriters.lw;
lwf=logWriters.lwFormat;
lwln=logWriters.lwLn;
lwr=logWriters.lwReplace;

//const objectMap = (obj, fn) =>
function objectMap(obj, fn) {
  Object.fromEntries(
    Object.entries(obj).map(
      ([k, v], i) => [k, fn(v, k, i)]
    )
  );
}
//============== End: Helpers ==============


g.t = {};
g.c = window.c;

const myModal = document.getElementsByName("flakModal")[0];
const myInput = document.getElementById('myInput')
const gameLoadMusic = document.createElement("audio");

// focus on my one main input for typing commands for the game
//  we will do this every time we do the main loop anyway, but
//  I think it's good practice to focus it there to start
document.getElementById("command-input").focus();