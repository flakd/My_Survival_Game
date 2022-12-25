let g;  //create my global object;
//if (global) { 
//    g=global;
//} else
if (window) { 
  g=window;
}
/* const { exit } = require('process');
const readline = require('readline');
const parseJSONs = require('./parseJSONs');
const core =  require('./core');
const output =  require('./output'); */

var rl;
//const l=console.log;
//const e=function(msg){console.error("**ERROR**: %s",msg)};

g.isQuit = false;
g.gameHour = 0;   //12 midnight
//g.totalGameHoursPlayed = 0;
g.gameDay = 0;
g.isGameOver = false;
g.isDead = false;
g.isDeadCheck = isDeadCheck;
g.startGame = startGame;
//g.resetAllStats = resetAllStats

//window.parseJSONs.loadJSONs();
//window.c = {};
g.c = window.c;
/* g.c.inventory = parseJSONs.Objects.inventory;
g.c.vitals = parseJSONs.Objects.vitals;
g.c.actions = parseJSONs.Objects.actions;  */

//  EVERYTHING STARTS HERE!!!!!
g.startGame();
//  RIGHT HERE!!!!



function isDeadCheck(line){
  if (g.isGameOver) {
    l("\n");
    l("=================================");         
    l("<<<<<<<<    GAME OVER    >>>>>>>>")
    l("=================================");     
    l(); 
    l("Would you like to play again? (y/n or Y/N)")
    rl.close();
    rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true  //true: gives term emul like UP-ARROW for prev command
    });    
    rl.on('line', (line) => {

      if (line=="n" || line=="N") {
        l();
        l("==============================================================");     
        l("OK then.  Thank you for playing!  Goodbye and play again soon!");
        l("==============================================================");             
        l();
        l();
        rl.close();
      } else 
      if (line=="y" || line=="Y") {
        rl.close();
        g.startGame();
        //return;
      } else {
        //CATCH Default/Else: whatever input("line") is, it's unrecognized
        //l("'%s' line is not recognized. Please try again\n",line);
        l("Would you like to play again? (y/n or Y/N)")
        return; //loop again into another readline
      }        
    });
  }   
};

//const objectMap = (obj, fn) =>
function objectMap(obj, fn) {
  Object.fromEntries(
    Object.entries(obj).map(
      ([k, v], i) => [k, fn(v, k, i)]
    )
  );
}

function resetAllStats(vitals, inventory) {
  objectMap(vitals, v => 0);
  l(vitals);
  objectMap(inventory, v => 0); 
  l(inventory);
  //const myObject = { a: 1, b: 2, c: 3 }
  //console.log(objectMap(myObject, v => 2 * v)) 
}


    

function startGame() {
  g.isGameOver = false;
  //resetAllStats(g.c.vitals, g.c.inventory);
  window.output.printTitleBanner(g.gameHour, c);
/*   rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true  //true: gives term emul like UP-ARROW for prev command
  }); */  
  //rl.on('line', (line) => {

  document.addEventListener("keydown", (event) => {

    let line = "";
    if (event.key === "Enter")  {
      line = document.querySelector("#command-input").value;

      //As long as the following remains TRUE, then we are alive => so therefore
      //  afterwards we RETURN (RETURN = jump to the next "RL loop")
      if (core.isStillAliveGameLoop(line, g.c.inventory, g.c.vitals, g.c.actions)) {
        l();
        return;   // don't return TRUE or FALSE, just RETURN so that we continue
                  //  this rl.on() "event" function
      } else {    // ELSE core.isStillAliveGameLoop has returned FALSE which means
                  //  the game is trying to END -- i.e. 1) you're dead,  or  
                  //  2) you entered the q/quit command -- so we need to dbl-chk

                          // gameSTATE:  +before play, 
                          //              +playing, 
                          //              +playing skip turn (bad command), 
                          //              +died - replay? 
                          //              +dead +quit - verify quit 
        
                  if (isDead) {
          g.isGameOver = true;
          return isDeadCheck();
        }
      }
    }
    //otherwise close and END the game
    //rl.close();
  }); 

}  // END startGame()

/* rl.once('close', () => {
  // end of input
  exit();  
}); */



