const { exit } = require('process');
const readline = require('readline');
const parseJSONs = require('./parseJSONs');


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true  //true: gives term emul like UP-ARROW for prev command
});
const l=console.log;

var vis = {
  "never": 0,
  "always": 1,
  "GTzero": 2
}

var time = 0;   //12 midnight
var timeInterval = 1;  //1 hour

parseJSONs.print();
parseJSONs.loadJSONs();
var inventory = parseJSONs.Objects.inventory;
var i = inventory;
var actions = parseJSONs.Objects.actions; 
var vitals = parseJSONs.Objects.vitals; 

l();
l("Welcome to the game!");
l();
printStats1();
rl.on('line', (line) => {
  if (line=="c") {
    //break;
    console.log("action canceled");
    printStats1();
    return;
  }
  //if (!actions[line] || action[line].length==0) return;
  var action = actions[line];
  if (action) {
    var fromInvGameItem = action.fromInv[0];
    var fromInvGameItemFull = "i." + fromInvGameItem + "[0]";    
    var fromInvOperator = action.fromInv[1];
    var fromInvAmount = action.fromInv[2];

    var toInvGameItem = action.toInv[0];
    var toInvGameItemFull = "i." + toInvGameItem + "[0]";
    var toInvOperator = action.toInv[1];
    var toInvAmount = action.toInv[2];  

    var toInvGameItem = action.toInv[0];
    var toInvGameItemFull = "i." + toInvGameItem + "[0]";
    var toInvOperator = action.toInv[1];
    var toInvAmount = action.toInv[2];  
        
    var fromInvEvalStrCond = fromInvGameItemFull + fromInvOperator + fromInvAmount;
    if (eval(fromInvEvalStrCond) < 0) {
      console.log("Sorry, you need to have at least %i %s to do that - but, you (only) have %i %s!", fromInvAmount, fromInvGameItem, i[fromInvGameItem], fromInvGameItem )
      return;
    } else {
      var fromInvEvalStrDo  = fromInvGameItemFull 
                            + ( (fromInvOperator != "=") 
                              ? ("=" + fromInvGameItemFull + fromInvOperator + fromInvAmount) 
                              : (fromInvOperator + fromInvAmount)
      );   
      var toInvEvalStrDo    = toInvGameItemFull 
                            + ( (toInvOperator != "=") 
                              ? ("=" + toInvGameItemFull + toInvOperator + toInvAmount) 
                              : (toInvOperator + toInvAmount)
      );          
      eval(fromInvEvalStrDo);
      eval(toInvEvalStrDo);
    }
    time+=timeInterval;
    printStats1(action.verb);
    return;
  }


  if (line == "QUIT") {
    console.log("QUIT is true");
    rl.close();
    return; //skip the rest of the conditions
  }
  
  //CATCH Default/Else: whatever input("line") is, it's unrecognized
  l("'%s' command is not recognized. Please try again\n",line);
  printStats1();
  return; //loop again into another readline
});

rl.once('close', () => {
  console.log("Thank you for playing!")
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
  
  for (key in list){
    var val = list[key];
    var amt = val[0];
    var visible = val[1];
    //if (visible!=null && amt > 0 ){

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