
const g = (function isBrowserOrNode(){
  if (typeof global !== 'undefined') {
    if (typeof module === "object" && typeof module.exports === "object") {
      if (typeof process === 'object') {
        if (typeof process.versions === 'object') {
          if (typeof process.versions.node !== 'undefined') {
            // this is running in NODE.JS
            return global;
          }
        }
      }
    }
  } else
  if (typeof window !== "undefined" && typeof window.document !== "undefined") {
    // browser
    return window;
  }
})();

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

lw=logWriters.lw;
lwf=logWriters.lwFormat;
lwln=logWriters.lwLn;
lwr=logWriters.lwReplace;

g.t = {};
//g.t.gameHr = 0;   //12 midnight
//g.totalGameHrsPlayed = 0;
//g.gameDay = 0;