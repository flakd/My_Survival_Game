const { exit } = require('process');
const readline = require('readline');
const parseJSONs = require('./parseJSONs');


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true  //true: gives term emul like UP-ARROW for prev command
});
const l=console.log;
const e=console.error

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
var actions = parseJSONs.Objects.actions; 
var vitals = parseJSONs.Objects.vitals; 
var i = inventory;
var a = actions;
var v = vitals;

l();
l("Welcome to the game!");
l();
printStats1();
rl.on('line', (command) => {
  if (command=="c") {
    //break;
    console.log("action canceled");
    printStats1();
    return;
  }  
  if (!actions) {
    e("**ERROR**:  actions is missing"); 
    return;
  }
  if (actions[command] && action[command].length==0) {
    e("**ERROR**:  actions[command] is present, but empty/undefined"); 
    return;
  }
  var action = actions[command];     // e.g.  command = "light"
  if (action) {   //e.g. action = actions["light"] or actions.light = the "light" command's entire object

    // attribSet is what stats/attributes we're going to change:  AON either inventory or vitals
    for (var attribSetLbl in action) {  // e.g. attribSet = "inventory"

      for (var attrib in attribSetLbl) {   //e.g. attrib = "calcs" or "msgs"
        var calcs;

        if (attrib == "calcs") { 
          calcs = attrib;   // calcs=attrib = obj of subs and adds to inventory or vitals
        } else continue;

        for (var calcLbl in calcs) {   //e.g. calcLbl (string) = "sub" or "add"
          var calcSet = calcs[calcLbl];   // e.g. ENTIRE add or sub PROPERTY
          var gameItemToChange_shortStr = calcSet[0];  // e.g. "wood" (string)
          var gameItemToChange_fullStr = attribSetLbl + "." + gameItemToChange_shortStr;
          var gameItemToChange = eval(gameItemToChange_fullStr);
          
          var GameItemBal = gameItemToChange[0];
          var Operator_Str = gameItemToChange[1];
          var AmtChange = gameItemToChange[2];
        }
      }
      var doAction_evalStr = "";      
      if (Operator_Str == "=") {
        doAction_evalStr = gameItemToChange + Operator_Str + AmtChange;
      } else
      if (Operator_Str == "+" || Operator_Str == "-") {
        doAction_evalStr  = gameItemToChange + "=" + gameItemToChange + Operator_Str + AmtChange;
      }
    }
    


  {
    var fromInvGameItem = action.fromInv[0];
    var fromInvGameItemFull = "i." + fromInvGameItem + "[0]";    
    var fromInvOperator = action.fromInv[1];
    var fromInvAmount = action.fromInv[2];

    var toInvGameItem = action.toInv[0];
    var toInvGameItemFull = "i." + toInvGameItem + "[0]";
    var toInvOperator = action.toInv[1];
    var toInvAmount = action.toInv[2];  

    var vitalsGameItem = action.vitals[0];
    var vitalsGameItemFull = "vitals." + vitalsGameItem + "[0]";
    var vitalsOperator = action.vitals[1];
    var vitalsAmount = action.vitals[2];  
  }
  {
    var fromInvEvalStrCond = fromInvGameItemFull + fromInvOperator + fromInvAmount;
    var vitalsEvalStrCond = vitalsGameItemFull + vitalsOperator + vitalsAmount;
    if (eval(fromInvEvalStrCond) < 0) {
      console.log("Sorry, you need to have at least %i %s to do that - but, you (only) have %i %s!", fromInvAmount, fromInvGameItem, i[fromInvGameItem], fromInvGameItem )
      return;
    } 
    if (eval(vitalsEvalStrCond) < 0)  {
      console.log("You don't feel like doing that -- you have no %s", vitalsGameItem )
      return;
    }       
  } 
    {
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
      var vitalsEvalStrDo    = vitalsGameItemFull 
                            + ( (vitalsOperator != "=") 
                              ? ("=" + vitalsGameItemFull + vitalsOperator + vitalsAmount) 
                              : (vitalsOperator + vitalsAmount)
      );                
      eval(fromInvEvalStrDo);
      eval(toInvEvalStrDo);
      eval(vitalsEvalStrDo);
    }
    time+=timeInterval;
    printStats1(action.verb);
    return;
  }


  if (command == "QUIT") {
    console.log("QUIT is true");
    rl.close();
    return; //skip the rest of the conditions
  }
  
  //CATCH Default/Else: whatever input("command") is, it's unrecognized
  l("'%s' command is not recognized. Please try again\n",command);
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