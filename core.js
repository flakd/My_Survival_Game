let g;  //create my global object;
if (global) { 
    g=global;
} else
if (window) { 
  g=window;
}
const l = console.log;
const e = console.error;

let core = {
  gameMainLoop: function gameMainLoop(userInput, inventory, vitals, actions){
    //  ** ANY FAILURE below immediately jumps out of function **
    
    //  0. print "status" 
    core.printStatus();

    //  1. read inputs from user
    //readInput: function readInput(){}
    //  WE ALREADY HAVE an input (that's being handled by rl.on() in main.js)
    //    so, we don't need to write a function/nor call it here

    //  2. check if input is a LEGIT input
    //     a. EXECUTE valid Game COMMANDS
    //     b. check to see if this is a LEGIT game-play action
    
    
/*
    if (!core.isInputValid(userInput,actions)) {
      l("invalid input");
      return true;    // RETURNing TRUE here b/c we ARE NOT DEAD and want 
                      //   to continue code execution
                      //   (REMEMBER:  return false would mean we died)
    }
*/

    if (core.isInputACommand(userInput)) return core.doCommandWithResult(userInput);
    if (!core.isInputAnAction(userInput, actions)) return true;

    var action=actions[userInput];
    // if below is false, then skip to NEXT input READLINE, which requires a return of true
    if (!core.canPerformAction(action, inventory, vitals)) return true;

    // else do not return and we continue to the next line of code...


    //  4. perform action by:
    //     a. perform "give"s... THEN
    //     b. perform "take"s (perform 3b, but on REAL inventory )
    doPerformAction: function doPerformAction(action, inventory, vitals){}

    //  5. pass time (update any time-dependent variables )
    //     a. based on action.duration * vitals.COST
    doPassTime: function doPassTime(action, inventory, vitals){}

    //  6. TODO: perform random events
    //     a. update values (e.g. inventory and/or vitals)
    doRandomActOfGod: function doRandomActOfGod(inventory, vitals){}
    
    //  7. check for death    ==>  TODO:  Game Over / Play Again
    //     a. verify that all VITALS are < 100
    isDead: function isDead(vitals){}

    //  8. loop back to beginning

    return true;


  },

  printStatus: function printStatus(){
    l("printing status");
  },

  isInputACommand: function isInputACommand(userInput){
    switch (userInput.toLowerCase()){
      case "q":     //TODO:  comment out for production      
      case "quit": 
      case "h", "help": 
      case "about": 
      case "list": 
        break;
      default:
        return false;        
    }
    l(" <= '%s' is a VALID Command =>\n", userInput);
    return true;
  },

  isInputAnAction: function isInputAnAction(userInput, actions){
    if (!actions) {e("**ERROR**:  actions is missing"); return false;}

    var action = actions[userInput];     // e.g.  line = "light"
    if (!action) {
      e("**ERROR**:  ACTION (actions[line]) is NOT present (empty or undefined)"); return false;
    }

    //if no errors, then let's print a 2 empty lines to give us some room on the screen
    l(" <= '%s' is a VALID Action =>\n", userInput);
    return true;
  },

  isInputValid: function isInputValid(userInput, actions){
    if (this.isInputACommand(userInput)) return true;
    if (this.isInputAnAction(userInput, actions)) return true;    
    
    //  it's not valid in either of the ABOVE cases, so
    //  therefore, it's FALSE (not a valid input)
    return false;
  },

  doCommandWithResult: function doCommand(userInput){
    // RETURN True will terminate execution -- see main 
    //  "CALLER" function/loop
    switch (userInput.toLowerCase()){
      case "q":     //TODO:  comment out for production      
        return false;
        break;
      case "quit": 
        return false;        
        break;
      case "h", "help": 
        l("Here's your help (e.g. help, quite, list, about")
        return true;        
        break;          
      case "about": 
        l("Game Goals:  About this game")
        return true;        
        break;          
      case "list": 
        //  print list of available game commands   
        l("list of commands you can execute HERE");        
        //  TODO:  core.printActions(actions);       
        return true;        
        break;                    
      default:
        return true;
    }
  },    

  //  3. check if action can be performed
  //     a. copy inventory
  //     b. perform "take" (requirement) calcs on copy (action.duration * action.COST)
  //     c. verify all TAKE inventory is >= zero (i.e. otherwise at least ONE requirment failed)
  //        i.  IF false => print ERROR message (and NEXT LOOP) for EACH inventory item < 0
  //     d. verify TAKE vital > zero (i.e. otherwise at least ONE requirment failed)
  //        i.  IF false => print ERROR message (i.e. you're not hungry && NEXT LOOP)
  canPerformAction: function canPerformAction(action, inventory, vitals){
    // lets clone these so that we can make changes without 
    //  affecting the real/originals
    var invClone = structuredClone(inventory);
    var vitClone = structuredClone(vitals);
    var numTakeCalcs = 0;
    var numValidConds = 0;

    //  starting with INVENTORY:
    for (var invItem_lbl in invClone) {
      // let's look through each (e.g. wood, fish, H20) inventory item
      var invItem = invClone[invItem_lbl];

      // we're only looking at the calc property, we don't care about 
      //  the other properties !="calcs" (e.g. key, duration, msgs)
      
      // action.calcs was an object ==> now I've made it an array 
      //  (see code below this to iterate through the array)
      //for(var calc_lbl in action.calcs) {

      for (var calcIdx in action.calcs){   // array iteration instead of object iteration
        // let's look through each "calc" property 

        // more specifically let's first look at all the "take" calcs/ops
        //if (calc_lbl == "take"){  // array iteration instead of object iteration
        var calc = action.calcs[calcIdx];
        if (calc.type == "take"){ // array iteration instead of object iteration

          //reference the whole "take" object
          //var take = invClone.calcs[calc_lbl];
          var take = calc;

          // store the name of the GameItem we want to TAKE FROM as a string
          var takeItem_lbl = take.item;

          // now store a reference to the ACTUAL GameItem by 'eval'ing the 
          //  string name of the GameItem
          var gameItem = eval(takeItem_lbl);

          // set up the ACTUAL 'perform calculation' statement
          var doTakeCalc_evalStr = gameItem + "=" + gameItem + take.operator + take.changeAmt.toString();
          // e.g. var doTakeCalc_evalStr = "inventory.wood=inventory.wood-5"

          // go RIGHT AHEAD and perform the operation on THIS CLONED copy
          eval (doTakeCalc_evalStr);
        } // END:  if (calc_lbl == "take"){
      } // END:  for(var calc_lbl in invItem.calcs) {
    } // END:  for (var invItem_lbl in invClone) {

    // REPEAT part of the loop logic to CHECK if any of the operations failed

    //  starting with INVENTORY:
    for (var invItem_lbl in invClone) {
      // let's look through each (e.g. wood, fish, H20) inventory item
      var invItem = invClone[invItem_lbl];

      //skip other properties !="calcs" (e.g. key, duration, msgs)
      for(var calc_lbl in invItem.calcs) {
        // let's look through each "calc" property 

        // more specifically let's first look at all the "take" calcs/ops
        if (calc_lbl == "take"){
          numTakeCalcs++;

          //check this for every take item in this cloned inventory object
          var takeCalcCond_evalStr = gameItem + " >= 0";
          // e.g. var takeCalcCond_evalStr = "inventory.wood >= 0"  ==> we 
          //  already performed the subtraction, so now just make sure it's > 0

          //evaluate the condition string and store TRUE or FALSE in a boolean var
          var isTakeCalcCondValid = eval(takeCalcCond_evalStr);

          // test/see if this PARTICULAR (remember we're looping through all 
          //  the ones we've already done) "take calc" was valid
          if (!isTakeCalcCondValid){
            // if ANY of these tests fail then RETURN FALSE
            l(takeCalcCond_evalStr + "=" + isTakeCalcCondValid);
            continue;
          } else {
            numValidConds++;
            continue;   // else NEXT LOOP (NEXT "take" calc)
          } // END:  for (var invItem_lbl in invClone) {

        } // END:  if (calc_lbl == "take"){

      } // END:  for(var calc_lbl in invItem.calcs) {

    } // END:  for (var invItem_lbl in invClone) {
    if (numValidConds == numTakeCalcs) return true;
    else return false

  }, // END:  function canPerformAction(action, inventory, vitals){

  check: function check(line,inventory, vitals, action, time, timeInterval) {
 
    var doAction_evalStrs = {};
    var numTrue=0;
    var numCalcs=0;

    //  **********************
    //  ASSUMING that this action is valid, we increment vitals by:
    //        vitals[vital].bal+= vitals[vital].dfltInc * action.duration;
    //  BUT before we do that, we need to save the original values so that 
    //  we can REVERSE/ROLLBACK the operation if the vitals are too low or 
    //  too high... b/c the operation itself depends on the vital LEVELS at 
    //  the begining of the round, BUT we need the levels AFTER the 
    //  natural / default_incr * duration
    var vitalsTmpStorage = {};
    vitalsTmpStorage = core.storeVitals(vitals);

    var isDead = core.doCounters(line,action,vitals);
    if (isDead) { return {time, isDead};}

    core.outerLoop(line,inventory, vitals, action, doAction_evalStrs, numTrue, numCalcs);
    
    //if (numTrue == numCalcs){
    if (numTrue == numCalcs){      
      for (var doAction_evalStr2 in doAction_evalStrs){
        eval(doAction_evalStrs[doAction_evalStr2]);
        //time+=timeInterval;
      }
      time = core.incrementTime(action,time).time;
    } else {
      core.rollbackCounters(vitalsTmpStorage,vitals);
    }
    return {time};

  }, //END check()

  outerLoop: function outerLoop(line,inventory, vitals, action, doAction_evalStrs, numTrue, numCalcs){  
    for (var invOrVitals_lbl in action) { // e.g. invOrVitals_lbl = "inventory" or "vitals"

      if (invOrVitals_lbl == "inventory" || invOrVitals_lbl == "vitals") {
        var invOrVitals = action[invOrVitals_lbl];
        core.innerLoop1(line,inventory, vitals, action, invOrVitals, invOrVitals_lbl, doAction_evalStrs, numTrue, numCalcs);
      }

    } 

  },

  innerLoop1: function innerLoop1(line, inventory, vitals, action, invOrVitals, invOrVitals_lbl, doAction_evalStrs, numTrue, numCalcs){ 
    for (var giveOrTake_lbl in invOrVitals) { //e.g. attribLbl = each "take", "give", or "msgs"
      //take, give, msgs
      var giveOrTake = invOrVitals[giveOrTake_lbl];

      if (giveOrTake_lbl == "take" || giveOrTake_lbl == "give") {
        var togResult = core.doTakeOrGive(line,inventory, vitals, action, giveOrTake, invOrVitals, invOrVitals_lbl, giveOrTake_lbl, doAction_evalStrs, numTrue, numCalcs);
        if (togResult.didSucceed) numTrue = numTrue + 1;
      }
      
    }    
  },

  getCalcStrings: function getCalcStrings(inventory, vitals, attrib, invOrVitals_lbl, numCalcs){
    numCalcs = numCalcs + 1;

    var gameItemToChange_shortStr;    
    var gameItemToChange_fullStr;
    var gameItemToChange;
    var Operator_Str;
    var changeAmt;

    gameItemToChange_shortStr = attrib.gameItem; // e.g. "wood" (string)
    gameItemToChange_fullStr = invOrVitals_lbl + "." + gameItemToChange_shortStr;
    gameItemToChange = eval(gameItemToChange_fullStr);
    Operator_Str = attrib.operator;
    changeAmt = attrib.changeAmt;

    return { 
      gameItemToChange_shortStr, 
      gameItemToChange_fullStr,
      gameItemToChange,
      Operator_Str, 
      changeAmt,
      numCalcs
    };
  },

  doTakeOrGive: function doTakeOrGive(line,inventory, vitals, action, attrib, invOrVitals, invOrVitals_lbl, attribLbl, doAction_evalStrs, numTrue, numCalcs){
    var inventoryDflt_cond_evalStr = {};
    var calcStrings, cs = core.getCalcStrings(inventory, vitals, attrib, invOrVitals_lbl, numCalcs);
    var doAction_evalStr = getDoAction_evalStr(cs,action);

    var tmpCondEval =  "cs.gameItemToChange.bal" + cs.Operator_Str + cs.changeAmt;
    eval(tmpCondEval);
    inventoryDflt_cond_evalStr[invOrVitals_lbl+"_"+attribLbl] = tmpCondEval + ">= 0"
    var vitalsTake_cond1_evalStr;
    var vitalsGive_cond1_evalStr;
    var vitalsGive_cond2_evalStr;


    //if (invOrVitals_lbl=="vitals" && cs.gameItemToChange.key != "none"){
    if (cs.gameItemToChange.key == "none"){
      doAction_evalStrs[invOrVitals_lbl+"_"+attribLbl] = doAction_evalStr;
      numTrue++;
      //continue;
      return {didSucceed: true};
    }

    if (invOrVitals_lbl=="inventory"){
      return doTakeOrGive_inventory();       
    } else          
    if (invOrVitals_lbl=="vitals") {              
      return doTakeOrGive_vitals();
    }

    function doTakeOrGive_inventory(){
      if (attribLbl=="take"){
        if ( !eval(inventoryDflt_cond_evalStr[invOrVitals_lbl+"_"+attribLbl]) ){
          l(attribs.msgs.errMsg, cs.changeAmt, cs.gameItemToChange_shortStr, cs.gameItemToChange.bal, cs.gameItemToChange_shortStr);                
          return {didSucceed: false};
        } else {
          doAction_evalStrs[invOrVitals_lbl+"_"+attribLbl] = doAction_evalStr;
          return {didSucceed: true};
        }
      } else
      if (attribLbl=="give"){
        if ( !eval(inventoryDflt_cond_evalStr[invOrVitals_lbl+"_"+attribLbl]) ){
          l(attribs.msgs.errMsg, cs.changeAmt, cs.gameItemToChange_shortStr, cs.gameItemToChange.bal, cs.gameItemToChange_shortStr);                
          return {didSucceed: false};
        } else {
          doAction_evalStrs[invOrVitals_lbl+"_"+attribLbl] = doAction_evalStr;
          return {didSucceed: true};
        }
      }             
    }   // END doTakeOrGiveInventory          
    function doTakeOrGive_vitals(){
      if (attribLbl=="take"){
        vitalsTake_cond1_evalStr = "cs.gameItemToChange.bal" + cs.Operator_Str + cs.changeAmt + cs.gameItemToChange.dieOper + cs.gameItemToChange.dieLimit;
        if (cs.gameItemToChange.key == "none"){
          doAction_evalStrs[invOrVitals_lbl+"_"+attribLbl] = doAction_evalStr;
          return {didSucceed: true};
        }
        if (eval(vitalsTake_cond1_evalStr)) {

          //  You died HERE so, we want to immediately set this VITAL to 100, 
          //  otherwise the action fails and we don't INCREASE the VITAL by 
          //  whatever we were supposed to from the action/anything at all
          cs.gameItemToChange.bal = 100;

          var vital = cs.gameItemToChange;
          core.doYouDied(vital,line);
          return {didSucceed: false};
        } else {
          doAction_evalStrs[invOrVitals_lbl+"_"+attribLbl] = doAction_evalStr;
          return {didSucceed: true};
        }
      } else 
      if (attribLbl=="give"){
        vitalsGive_cond1_evalStr  = cs.gameItemToChange_fullStr + ".bal"
                                  + cs.Operator_Str + " (" + cs.changeAmt + " * " + action.duration + ") "
                                  + " < 0";

        //vitalsGive_cond1_evalStr = "cs.gameItemToChange.bal" + cs.Operator_Str + cs.changeAmt + cs.gameItemToChange.keydoOper + cs.gameItemToChange.keydoLimit;
        vitalsGive_cond2_evalStr = "cs.gameItemToChange.bal == 0";
        if (cs.gameItemToChange.key == "none"){
          doAction_evalStrs[invOrVitals_lbl+"_"+attribLbl] = doAction_evalStr;
          return {didSucceed: true};
        }
        if (eval(vitalsGive_cond2_evalStr) && cs.gameItemToChange.key != "none"){  
          // the vitals you're trying to satisfy (hunger) is already ZERO, so you're NOT HUNGRY -- DISALLOW

          l( cs.gameItemToChange.doErrMsg );    //e.g. "you're not cold", "you're not hungry"
          return {didSucceed: false};                // no increment, should cause ENTIRE ACTION to FAIL
        } else                              // nonZERO, so some positive number in this vitals value
        if (eval(vitalsGive_cond1_evalStr)) {  // the vitals you're trying to satisfy (hunger) - hunger cost < ZERO, so set to ZERO -- ALLOW
          doAction_evalStrs[invOrVitals_lbl+"_"+attribLbl] = cs.gameItemToChange_fullStr + ".bal" + " = 0";
          return {didSucceed: true};                
        } else {
          doAction_evalStrs[invOrVitals_lbl+"_"+attribLbl] = doAction_evalStr;
          return {didSucceed: true};
        }
      }         
    }   // END doTakeOrGive_vitals

    function getDoAction_evalStr(cs,action) {
      var doAction_evalStr = "";
      if (cs.Operator_Str == "=") {
        //doAction_evalStr = "cs.gameItemToChange.bal" + cs.Operator_Str + cs.changeAmt;
        doAction_evalStr = cs.gameItemToChange_fullStr + ".bal" + cs.Operator_Str + cs.changeAmt;
        var tmp = 0;
      } else {
        if (cs.Operator_Str == "+" || cs.Operator_Str == "-") {
          if (invOrVitals_lbl == "inventory") {
            doAction_evalStr = cs.gameItemToChange_fullStr + ".bal" + "="
              + cs.gameItemToChange_fullStr + ".bal"
              + cs.Operator_Str + cs.changeAmt;
          }
          else if (invOrVitals_lbl == "vitals") {
            doAction_evalStr = cs.gameItemToChange_fullStr + ".bal" + "="
              + cs.gameItemToChange_fullStr + ".bal"
              + cs.Operator_Str + " (" + cs.changeAmt + " * " + action.duration + ") ";
          }
        }
      }
      return doAction_evalStr;
    }
  },   // END  doTakeOrGive()

  storeVitals: function storeVitals(vitals) {
    var vitalsTmpStorage = {
      "hunger_bal": vitals.hunger.bal,
      "thirst_bal": vitals.thirst.bal,
      "cold_bal": vitals.cold.bal,
      "fatigue_bal": vitals.fatigue.bal
    };
    return vitalsTmpStorage;
  },

  resetAllStats: function resetAllStats(vitals, inventory) {
    for (var vital in vitals){
      vitals[vital].bal = 0;
    }
    for (var invItem in inventory){
      if (invItem == "trees") {
        inventory[invItem].bal = 9999;
      } else {
        inventory[invItem].bal = 0;
      }
    }
  },

  rollbackCounters: function rollbackCounters(vitalsTmpStorage,vitals) {
    vitals.hunger.bal = vitalsTmpStorage.hunger_bal;
    vitals.thirst.bal = vitalsTmpStorage.thirst_bal;
    vitals.cold.bal = vitalsTmpStorage.cold_bal;
    vitals.fatigue.bal = vitalsTmpStorage.fatigue_bal;
  },

  incrementTime: function incrementTime(action,time){
    time += action.duration;
    return { time };
  },

  doCounters: function doCounters(line, action,vitals){
    for (var vitalLbl in vitals){
      var vital = vitals[vitalLbl];

      if(vitalLbl!="none"){
        if (line=="sleep" && vitalLbl=="fatigue"){
          continue;
        } else {
          vital.bal+= vital.dfltInc * action.duration;
        }

        if (vital.bal >= 100) {

          this.doYouDied(vital, line);
          g.isGameOver = true;
          g.isDead = true;
          global.isDeadCheck(line);
        }
      }
    }
  },

  doYouDied: function doYouDied(vital,line){
    l(vital.dieMsg);
    l();
    vital.bal = 100;        
  }

} //END Core Object



module.exports = core;


