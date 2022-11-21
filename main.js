const { checkPrime } = require('crypto');
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
rl.on('line', (line) => {
  if (line=="c") {
    //break;
    console.log("action canceled");
    printStats1();
    return;
  }  
  if (!actions) {
    e("**ERROR**:  actions is missing"); 
    return;
  }
  if (actions[line]){
    if (actions[line].length==0) {
      e("**ERROR**:  actions[line] is present, but empty/undefined"); 
      return;
    }
  }
  var action = actions[line];     // e.g.  line = "light"
  if (action) {   //e.g. action = actions["light"] or actions.light = the "light" line's entire object

    var calcSet, 
        gameItemToChange_shortStr,
        gameItemToChange_fullStr,
        gameItemToChange,
//        gameItemToChange_bal,
//        gameItemToChange_vis,
        Operator_Str,
        changeAmt
    ;

    //if (line in ["light2", "drink2"]){
    if (line == "light2"){      
      check(action, calcSet, gameItemToChange_shortStr, gameItemToChange_fullStr, gameItemToChange, Operator_Str, changeAmt);
      // attribs is what stats/attributes we're going to change:  AON either inventory or vitals
      //({ calcSet, gameItemToChange_shortStr, gameItemToChange_fullStr, gameItemToChange, Operator_Str, changeAmt } = newFunction(action, calcSet, gameItemToChange_shortStr, gameItemToChange_fullStr, gameItemToChange, Operator_Str, changeAmt));
      printStats1();
    } else {
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
        printStats1(action.verb);
        time+=timeInterval;
      }
    } //elseIF (line != "light2")
    return;
  }


  if (line == "QUIT") {
    console.log("QUIT is true");
    rl.close();
    return; //skip the rest of the conditions
  }
  
  //CATCH Default/Else: whatever input("line") is, it's unrecognized
  l("'%s' line is not recognized. Please try again\n",line);
  printStats1();
  return; //loop again into another readline
});

rl.once('close', () => {
  console.log("Thank you for playing!")
    // end of input
  exit();
 });



function check(action, calcSet, gameItemToChange_shortStr, gameItemToChange_fullStr, gameItemToChange, Operator_Str, changeAmt) {
  for (var attribsLbl in action) { // e.g. attribsLbl = "inventory"
    var attribs = action[attribsLbl];

    for (var attribLbl in attribs) { //e.g. attrib = "calcs" or "msgs"
      var attrib = attribs[attribLbl];

      if (attribLbl == "calcs") {
        var calcs = attrib; // calcs=attrib = obj of subs and adds to inventory or vitals

        for (var calcLbl in calcs) { //e.g. calcLbl (string) = "sub" or "add"
          calcSet = calcs[calcLbl]; // e.g. ENTIRE add or sub PROPERTY
          gameItemToChange_shortStr = calcSet.gameItem; // e.g. "wood" (string)
          gameItemToChange_fullStr = attribsLbl + "." + gameItemToChange_shortStr;
          gameItemToChange = eval(gameItemToChange_fullStr);
          //var gameItemToChange_bal = gameItemToChange.bal;
          //var gameItemToChange_vis = gameItemToChange.vis;
          Operator_Str = calcSet.operator;
          changeAmt = calcSet.changeAmt;

          var doAction_evalStr = "";
          //var doAction = function(){};
          if (Operator_Str == "=") {
            doAction_evalStr = "gameItemToChange.bal" + Operator_Str + changeAmt;
            var tmp = 0;
          }
          else if (Operator_Str == "+" || Operator_Str == "-") {
            doAction_evalStr = "gameItemToChange.bal" + "=" + "gameItemToChange.bal" + Operator_Str + changeAmt;
          }
          var doActionCond_evalStrs = {
            "inventory":  "gameItemToChange.bal" + Operator_Str + changeAmt + " >= 0 ",
            "vitals":     "gameItemToChange.bal" + gameItemToChange.doOper
          }
          var errMsg = "";

          if ( !eval(doActionCond_evalStrs[attribsLbl]) ){
            if (attribsLbl=="inventory"){
              l(attribs.msgs.errMsg, changeAmt, gameItemToChange_shortStr, gameItemToChange.bal, gameItemToChange_shortStr);                
            } else 
            if (attribsLbl=="vitals"){
              l(attribs.msgs.errMsg);
            }
            return;
          } else {
            eval(doAction_evalStr);
          }          
        }
      }
    }
  }
  time+=timeInterval;        
  //return { calcSet, gameItemToChange_shortStr, gameItemToChange_fullStr, gameItemToChange, Operator_Str, changeAmt };
}



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
  
  for (key in list){
    val = list[key];
    if (key.slice(4) == "2") {
      //console.log(key);
      amt = val.bal;
      visible = val.vis;
    } else {
      amt = val[0];
      visible = val[1];
      //if (visible!=null && amt > 0 ){
    }
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