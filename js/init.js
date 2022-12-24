
  function checkLog(logTarget){
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
  }
  function logWrite(msg, logTarget){
    let log = checkLog(logTarget)
    log.innerHTML += msg;
  }
  function logWriteF(msg, logTarget){
    let log = checkLog(logTarget)
    log.innerHTML += msg + "; ";
  }
  function logWriteLn(msg, logTarget){
    if (msg===undefined) msg = "";    
    let log = checkLog(logTarget)
    log.innerHTML += msg + "<br>\n";
  }  
  function logWriteReplace(msg, logTarget){
    if (msg===undefined) msg = "";    
    let log = checkLog(logTarget)
    log.innerHTML = msg;
  }    
  lw=logWrite;
  lwf=logWriteF;
  lwln=logWriteLn;
  lwr=logWriteReplace;

