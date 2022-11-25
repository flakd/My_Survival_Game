const { exit } = require('process');
const readline = require('readline');
const parseJSONs = require('./parseJSONs');
const core =  require('./core');
const output =  require('./output');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true  //true: gives term emul like UP-ARROW for prev command
});
const l=console.log;
const e=function(msg){console.error("**ERROR**: %s",msg)};

var time = 0;   //12 midnight
var timeInterval = 1;  //1 hour
var isQuit = false;
var isGameOver = false;

parseJSONs.loadJSONs();
var inventory = parseJSONs.Objects.inventory;
var actions = parseJSONs.Objects.actions; 
var vitals = parseJSONs.Objects.vitals;
var c = {
  "inventory": inventory,
  "actions": actions,
  "vitals": vitals
}
output.printTitleBanner(time,c);

rl.on('line', (line) => {
  if (isGameOver) {
    l("\n");
    l("GAME OVER")
    l("=============================");      
    l("Would you like to play again?")          
    l("=============================");      
    if (line=="n" || line=="N") {
      console.log("OK then.  Thank you for playing!  Goodbye and play again soon!");
      rl.close();
    } else 
    if (line=="y" || line=="Y") {
      isGameOver = false;
      core.resetAllStats(vitals, inventory);
      output.printTitleBanner(time,c);
      return;
    }
  }     

  
  if (!actions) {e("**ERROR**:  actions is missing"); return;}

  var action = actions[line];     // e.g.  line = "light"
  if (action) {
    if (action.length==0) { 
      e("**ERROR**:  action(actions[line]) is present, but empty or undefined"); return;
    }

    //if no errors, then let's print a 2 empty lines to give us some room on the screen
    l(" ==>\n");

    if ( (ret=core.check(inventory, vitals, action, time)) === undefined
        ||  ret.time === undefined || ret.time===null
    ){
      e("while executing core.check()");
    }
    isGameOver = ret.isDead;
    // attribs is what stats/attributes we're going to change:  AON either inventory or vitals
    output.printStats1(time,c);
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
        output.printStats1(time,c);
        return;
      }
    } else {

      //CATCH Default/Else: whatever input("line") is, it's unrecognized
      l("'%s' line is not recognized. Please try again\n",line);
      output.printStats1(time,c);
      return; //loop again into another readline
    }
  }
});

rl.once('close', () => {
  // end of input
  exit();  
});

