
  function logWrite(msg, logTarget){
    if ( (logTarget) && (logTarget instanceof Element) ) {
      log = logTarget;
    } else {
      log = document.querySelector("#log");
      if (!log) {
        console.log("You're missing/you need to specify an element with 'id=#log'");
        return;
      }
    } 
    log.innerHTML += msg;
  }
  function logWriteF(msg, logTarget){
    if ( (logTarget) && (logTarget instanceof Element) ) {
      log = logTarget;
    } else {
      log = document.querySelector("#log");
      if (!log) {
        console.log("You're missing/you need to specify an element with 'id=#log'");
        return;
      }
    }
    log.innerHTML += msg + "; ";
  }
  function logWriteLn(msg, logTarget){
    if ( (logTarget) && (logTarget instanceof Element) ) {
      log = logTarget;
    } else {
      log = document.querySelector("#log");
      if (!log) {
        console.log("You're missing/you need to specify an element with 'id=#log'");
        return;
      }
    }
    if (msg===undefined) msg = "";
    log.innerHTML += msg + "<br>\n";
  }  
  function logWriteReplace(msg, logTarget){
    if ( (logTarget) && (logTarget instanceof Element) ) {
      log = logTarget;
    } else {
      log = document.querySelector("#log");
      if (!log) {
        console.log("You're missing/you need to specify an element with 'id=#log'");
        return;
      }
    }
    log.innerHTML = msg;
  }    
  lw=logWrite;
  lwf=logWriteF;
  lwln=logWriteLn;
  lwr=logWriteReplace;
