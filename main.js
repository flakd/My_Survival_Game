const { exit } = require('process');
const readline = require('readline');
const parseJSONs = require('./parseJSONs');
const second =  require('./second');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true  //true: gives term emul like UP-ARROW for prev command
});
const l=console.log;
const e=console.error

var time = 0;   //12 midnight
var timeInterval = 1;  //1 hour
var isQuit = false;

parseJSONs.loadJSONs();
var inventory = parseJSONs.Objects.inventory;
var actions = parseJSONs.Objects.actions; 
var vitals = parseJSONs.Objects.vitals;
printTitleBanner();

rl.on('line', (line) => {
  
  if (!actions) {e("**ERROR**:  actions is missing"); return;}

  var action = actions[line];     // e.g.  line = "light"
  if (action) {
    if (action.length==0) { 
      e("**ERROR**:  action(actions[line]) is present, but empty or undefined"); return;
    }
    second.check(inventory, vitals, action, time, timeInterval);
    // attribs is what stats/attributes we're going to change:  AON either inventory or vitals
    printStats1();
    return;
  } else {
    //e("**ERROR**:  action/actions[line] is missing"); return;
    if (line == "QUIT") {
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
        printStats1();
        return;
      }
    } else {

      //CATCH Default/Else: whatever input("line") is, it's unrecognized
      l("'%s' line is not recognized. Please try again\n",line);
      printStats1();
      return; //loop again into another readline
    }
  }
});

rl.once('close', () => {
  // end of input
  exit();  
});




function printStats1(verb){
  l("**********  TIME: %s", ( ('0' + (time%24)).slice(-2) + ':00 hrs' )  );
  var msg = "";
  if (verb) {
    msg+= "OK, you " + verb + ".  Now, you've got:"; 
  } else {
    msg+= "You've got:";
  }
  l(msg);
  l("---------------------------------");  
  printStats2(vitals);
  l("==========================================================================");
  if (printStats2(inventory) == 0) {
    l("No possessions at the moment!");
  }
  l("==========================================================================");
  l();
}

function printStats2(list){
  var numListItems=0;

  var msg ="  ";
  var val, amt, visible;
  
  if (!list) {l("**ERROR**:  list is missing"); return;}
  for (key in list){
    val = list[key];
    if (!val) {l("**ERROR**:  val is missing"); return;}
    //if (key.slice(4) == "2") {
      //console.log(key);
      amt = val.bal;
      visible = val.vis;
    //} else {
    //  amt = val[0];
    //  visible = val[1];
    //  //if (visible!=null && amt > 0 ){
    //}
    if (visible == "never") continue;
    if (visible == "GTzero" && amt < 1) continue;    
    if (  (visible == "GTzero" && amt > 0)
      ||  (visible == "always")
    ){
      numListItems++;
      var lMsg = "";
      //l("%i %s %s", amt, visible, key);
      lMsg+= key + ": " + amt;
      lMsg = lMsg.padEnd(14," ");
      if (numListItems % 5 == 0 && numListItems != 0) {
        msg+=lMsg;
        msg+="\n  ";
        //l(msg);
      } else {
        msg+=lMsg;
      }
      
    }
  }
  if (msg !="") l(msg);
  return numListItems;
}

function printTitleBanner(){
  l();
  l("Welcome to the game!");
  l();
  printStats1();  
}
