
  function logWrite(msg){
    log.innerHTML += msg;
  }
  function logWriteF(msg){
    log.innerHTML += msg + "; ";
  }
  function logWriteLn(msg){
    if (msg===undefined) msg = "";
    log.innerHTML += msg + "<br>\n";
  }  
  function logWriteFull(msg){
    log.innerHTML = msg;
  }    
  lw=logWrite;
  lwf=logWriteF;
  lwln=logWriteLn;
  lwFull=logWriteFull;
