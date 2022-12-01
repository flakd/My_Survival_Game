let g;  //create my global object;
if (global) { 
    g=global;
} else
if (window) { 
  g=window;
}
const { exit } = require('process');
const readline = require('readline');
const parseJSONs = require('./parseJSONs');
const core =  require('./core');
const output =  require('./output');

var rl;
const l=console.log;
const e=function(msg){console.error("**ERROR**: %s",msg)};

var gameHour = 0;   //12 midnight
var isQuit = false;
var isGameOver = false;
g.gameHour = gameHour;
g.totalGameHoursPlayed = 0;
g.gameDay = 0;
g.isGameOver = isGameOver;
g.isDeadCheck = isDeadCheck;
g.startGame = startGame;

parseJSONs.loadJSONs();
var inventory = parseJSONs.Objects.inventory;
var vitals = parseJSONs.Objects.vitals;
var actions = parseJSONs.Objects.actions; 
var c = {
  "inventory": inventory,
  "vitals": vitals,
  "actions": actions
}
g.c = c;

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

function startGame() {
  g.isGameOver = false;
  core.resetAllStats(vitals, inventory);
  output.printTitleBanner(gameHour, c);
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true  //true: gives term emul like UP-ARROW for prev command
  });  
  rl.on('line', (line) => {

    //if (TRUE), we are alive => then RETURN (RETURN = jump to the next "RL loop")
    if (core.gameMainLoop(line, inventory, vitals, actions)) return;

    //otherwise close and END the game
    rl.close();



    if (!actions) {e("**ERROR**:  actions is missing"); return;}

    var action = actions[line];     // e.g.  line = "light"
    if (action) {
      if (action.length==0) { 
        e("**ERROR**:  action(actions[line]) is present, but empty or undefined"); return;
      }

      //if no errors, then let's print a 2 empty lines to give us some room on the screen
      l(" ==>\n");

      if ( (ret=core.check(line,inventory, vitals, action, gameHour)) === undefined
          ||  ret.time === undefined || ret.time===null
      ){
        e("while executing core.check()");
      }
      //g.isGameOver = ret.isDead;
      //if (isDeadCheck(line)){
      //  return;
      //}    
      // attribs is what stats/attributes we're going to change:  AON either inventory or vitals
      if (!g.isGameOver) output.printStats1(gameHour,c);
      return;
    } else {
      //e("**ERROR**:  action/actions[line] is missing"); return;
      if (line == "q" || line == "Q") {
        //console.log("QUIT is true");
        l("Are you sure you want to quit? (y/n, Y/N");
        isQuit = true;
      }    
      if (isQuit) {
        if (line=="y" || line=="Y") {
          console.log("OK then.  Thank you for playing!  Goodbye and play again soon!");
          rl.close();
        } else 
        if (line=="n" || line=="N") {
          isQuit = false;
          output.printStats1(gameHour,c);
          return;
        }
      } else {

        //CATCH Default/Else: whatever input("line") is, it's unrecognized
        l("'%s' line is not recognized. Please try again\n",line);
        //output.printStats1(time,c);
        return; //loop again into another readline
      }
    }
  }); 
}  // END startGame()

rl.once('close', () => {
  // end of input
  exit();  
});



