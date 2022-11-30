let g;  //create my global object;
if (global) { 
    g=global;
} else
if (window) { 
  g=window;
}
const { exit } = require('process');
const output =  require('./output');
const l=console.log;
const e=function(msg){console.error("**ERROR**: %s",msg)};

let core = {
  gameMainLoop: function gameMainLoop(userInput, inventoryOrig, vitalsOrig, actions){
    //  ** ANY FAILURE below immediately jumps out of function **
    
    //  0. print "status" 
    //core.printStatus();
    //output.printStats1(g.time,g.c);


    //  1. read inputs from user
    //readInput: function readInput(){}
    //  WE ALREADY HAVE an input (that's being handled by rl.on() in main.js)
    //    so, we don't need to write a function/nor call it here

    //  2. check if input is a LEGIT input
    //     a. EXECUTE valid Game COMMANDS
        if ( core.isInputAValidGameCommand(userInput.toLowerCase()) ) return core.doCommandWithResult(userInput.toLowerCase());

    //     b. check to see if this is a LEGIT game-play action
    if (!core.isInputAValidGameAction(userInput.toLowerCase(), actions)) 
    return true;      // RETURNing TRUE here b/c we ARE NOT DEAD and want 
                      //   to continue code execution
                      //   (REMEMBER:  return false would mean we died)

    // now that we know it's valid, set action for further processing/use
    var action=actions[userInput.toLowerCase()];
    
    //var inventory = structuredClone(inventoryOrig);
    //var vitals = structuredClone(vitalsOrig);
    var inventory = inventoryOrig;
    var vitals = vitalsOrig;

    g.c2 = {};
    g.c2.inventory = inventory;
    g.c2.vitals = vitals;

    // if below is false, then skip to NEXT input READLINE, which requires a return of true
    if (!core.canPerformAction(action, inventory, vitals)) {
    }

    // else do not return and we continue to the next line of code...
    //  which is to ACTUALLY execute the command
    core.doGameAction(action, inventory, vitals);
    doMakeGameActionPermanent();
    function doMakeGameActionPermanent(){
      doCopyBackToOrig();

      //
      //
      //    THIS ISN'T WORKING
      //
      //
      function doCopyBackToOrig(){
        //inventoryOrig = inventory;
        //vitalsOrig = vitals;
        //inventoryOrig = structuredClone(inventory);
        //vitalsOrig = structuredClone(vitals);        
        g.c.inventory = structuredClone(inventory);
        g.c.vitals = structuredClone(vitals);
      }    
    }
    output.printStats1(g.time,g.c);
    return true;

    //  5. pass time (update any time-dependent variables )
    //     a. based on action.duration * vitals.COST
    //==========================================================================>    
    doPassTime: function doPassTime(action, inventory, vitals){}
      //loop through vitals
      //  do dflt vital.takePerHour -
      //    EXCEPT for action.calcs.take.vitals => override dflt vital.takePerHour

    //  6. TODO: perform random events
    //     a. update values (e.g. inventory and/or vitals)
    //==========================================================================>    
    doRandomActOfGod: function doRandomActOfGod(inventory, vitals){
      var actsOfGod = [
        { event: "storm",   probability: 40,  injury: 10  },
        { event: "bear",    probability: 5,   injury: 70  },
        { event: "wolves",  probability: 10,  injury: 45  },
        { event: "fall",    probability: 20,  injury: 25  },
        { event: "cut",     probability: 15,  injury: 32  },                        
      ];
      var actChoice = Math.random() * actsOfGod.length;
      var act = actsOfGod[actChoice];
      var chance = Math.random() * 100;
      if (chance <= act.probability) { 
        l(act.event);
        vitals.injury = vitals.injury + act.injury;
      }
    }
    
    //  7. check for death    ==>  TODO:  Game Over / Play Again
    //     a. verify that all VITALS are < 100
    //==========================================================================>    
    isDead: function isDead(vitals){

    }

    // print status at the end... AFTER the command is executed, 
    //  so we can see the results/new numbers, otherwise we are always looking
    //  at the previous numbers each time we execute a command
    output.printStats1(g.time,g.c);

    //  8. loop back to beginning
    return true;


  },

  printStatus: function printStatus(){
    l("printing status");
  },

  doSecretTestCalc: function doSecretTestCalc(userInput, inventory, vitals){
    if ( userInput.toLowerCase() == "/p" ) {
      output.printStats1(g.time,g.c);
      return true;
    }
    if ( userInput.toLowerCase() == "/p2" ) {
      output.printStats1(g.time,g.c2);
      return true;
    }    
    if (  userInput.toLowerCase().startsWith("/a ") ){
      var words = userInput.toLowerCase().split(" ");
      var targetListAbbr = words[1].split(".")[0];
      var targetList = "";
      var targetItem = words[1].split(".")[1];      
      if (targetListAbbr == "i") targetList = "inventory";
      if (targetListAbbr == "v") targetList = "vitals";
      var evalStr = "targetList.targetItem.bal = targetList.targetItem.bal " +  words[2];   
      l(evalStr);
      // add to inventory or vital
      l(targetList);
      l(targetItem);
      //var tList = eval(targetList);
      //var tItem = eval(targetList + "." + targetItem);
      l(g.c[targetList]);
      var tList = g.c[targetList];
      var tItem = eval("tList." + targetItem);

      l(tItem.bal );
      tItem.bal = tItem.bal + eval(words[2]);
      //eval(evalStr);
      l( tItem.bal );
      return true;
    } else {
      //l("invalid input to FUNCTION doSecretTestCalc(userInput)"); 
      return false;
    }
  },


  isInputAValidGameCommand: function isInputAValidGameCommand(userInput, inventory, vitals){
    switch (userInput.toLowerCase()){
      case "q":     //TODO:  comment out for production      
      case "quit": 
      case "h", "help": 
      case "about": 
      case "list": 
        break;
      default:
        //      case "~a", "~s":
        return core.doSecretTestCalc(userInput.toLowerCase(), inventory, vitals);
        //return false;        
    }
    l(" <= '%s' is a VALID Command =>\n", userInput);
    return true;
  },

  isInputAValidGameAction: function isInputAValidGameAction(userInput, actions){
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
    if (this.isInputAValidGameCommand(userInput)) return true;
    if (this.isInputAValidGameAction(userInput, actions)) return true;    
    
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
  //==========================================================================>
  canPerformAction: function canPerformAction(action, inventory, vitals){
    // lets clone these so that we can make changes without 
    //  affecting the real/originals


    if (canDoInvTakeCalcs(action)) { 
      canPerformAction = true;
      return canPerformAction;
      // we don't return false b/c that means we died
    }

    function canDoInvTakeCalcs(action) {
      //prepare for keeping tracking of ANY of these InvTakeCalc conditions fail
      var numInValidTakeConds = 0;   // a successful command means this > 0 when we're done

      // we're only looking at the CALCS prop of the ACTION object, we don't
      //  care about the other properties !="calcs" (e.g. key, duration, msgs)
      var invTakeCalcs = getInvTakeCalcs(action.calcs);

      // if we don't find any invTakeCalcs (null/undefined) then print a developer error??
      if (!(invTakeCalcs)) { e("missing invTakeCalcs"); }
            
      for (var calcIdx in invTakeCalcs){
        if (!canDoInvTakeCalc(invTakeCalcs[calcIdx]))         
        // TRUE: numInValidConds++  (now it will be greater than 0 if 
        //  false (meaning at least one failed)
        numInValidTakeConds++;

        //  => this means we don't perform the actiion [all have to be 
        //  successful, i.e. you need to have enough of EACH AND EVERY/ALL
        //   if the inventory and vitals to perform this calculation/action])    
      }          
      // if ANY of these tests fail then RETURN FALSE ==>
      //  this means we CANNOT perform the action
      return (numInValidTakeConds == 0)
    }

    function getInvTakeCalcs(calcs) {
      // prepare to store all the "inventory takes" in an array
      var invTakeCalcs = [];

      for (var calcIdx in action.calcs) { // array iteration instead of object iteration
        // let's look through each item in the "calcs" property/subObject
        // lets make it easier to refer to the actual indicidual "calc item"
        //  that we're looking at, at the moment
        var calc = action.calcs[calcIdx];

        // the name of the GameItem we want to CALC FROM as a string is 
        //  stored in calc.list and calc.item combined
        if (!calc.list || !calc.item) { e("missing ITEM NAME (list & item)"); }

        if (calc.list=="inventory" && calc.type=="take") {
          invTakeCalcs.push(calc);
        }
      }
      return invTakeCalcs;
    }

    function canDoInvTakeCalc(calc) {
      // store the full string/name which we need to use to build an 
      //  actual code reference to the gameItem object
      var gameItem_fullEvalStr = calc.list + "." + calc.item;
      var gameItemBal_evalStr = gameItem_fullEvalStr + ".bal";

      // now store a reference to the ACTUAL GameItem by 'eval'ing the 
      //  STRING NAME of the GameItem, which is the string in calc.itemStr/calcItem_fullLbl
      calc.gameItem = eval(gameItem_fullEvalStr);
      if (!calc.gameItem) {e("possible misspelling of gameItem in JSON");}

      // store original balance to use in error message, in case this calculation fails
      calc.preCalcBal = calc.gameItem.bal;
                        
      // if the preCalcBal MINUS the amount to change (subtract, since 
      //  this is a TAKE operation) equals less than ZERO, then we didn't
      //  have enough of this inventory item/resource to perform this
      //  in the first place => NOW => store True/False in boolean var
      calc.willCalcCondFail_str = "(preCalcBal - calc.changeAmt < 0)";
      calc.willCalcCondFail_str2 = "(" + calc.preCalcBal + "-" + calc.changeAmt + " < 0" + ")";
      calc.willCalcCondFail = (calc.preCalcBal - calc.changeAmt < 0);

      // set up the ACTUAL 'perform calculation' statement      
      var doTakeCalc_evalStr = gameItemBal_evalStr + "=" + gameItemBal_evalStr + calc.operator + calc.changeAmt;
      // e.g. (doTakeCalc_evalStr = "inventory.wood = inventory.wood - 5"  or  "vitals.hunger = vitals.hunger + 10"

      // go RIGHT AHEAD and perform the operation on THIS CLONED copy by EVALing the "doTakeCalc string"
      eval (doTakeCalc_evalStr);

      // store post calculation balance for comparison (?)                    
      calc.postCalcBal = calc.gameItem.bal;
      // not sure we use this ????

      //print these regardless of whether it's false(succeeded) or true(failed)
      l("postCalcBal:"+calc.postCalcBal);            
      l();
      if (!calc.willCalcCondFail){ // it's FALSE, that means the calc SUCCEEDED, 
        l("This calc (%s) SUCCEEDED: %s[%s] is %s", 
            doTakeCalc_evalStr, calc.willCalcCondFail_str, 
            calc.willCalcCondFail_str2, calc.willCalcCondFail
        );                  
        return true;  // return true if that calc succeeds
      } else  { // it's TRUE, that means the calc FAILED
                //  so print error msg and increase 
                //  failure number by one (if we have 
                //  even 1 failure, then we won't allow 
                //  this ACTION [i.e. we won't copy 
                //  this clone back to the original])
                
        l("This calc (%s) FAILED: %s[%s] is %s", 
            doTakeCalc_evalStr, calc.willCalcCondFail_str, 
            calc.willCalcCondFail_str2, calc.willCalcCondFail
        );      
        l(inventory.none.dflt_doFailMsg, calc.changeAmt, calc.item, calc.preCalcBal, calc.item);
        return false;   // return false b/c this calc failed        
      }
    } // END:  doInvTakeCalc
  }, // END:  function canPerformAction(action, inventory, vitals){


  //  4. perform action by:
  //     a. perform "give"s... THEN
  //     b. perform "take"s (perform 3b, but on REAL inventory )
  //==========================================================================>    
  doGameAction: function doGameAction(action, inventory, vitals){
    doInvGiveCalcs(action,inventory);
    doVitGiveCalcs(action, vitals);
    function doInvGiveCalcs(action, inventory){
     // we're only looking at the CALCS prop of the ACTION object, we don't
      //  care about the other properties !="calcs" (e.g. key, duration, msgs)
      var invGiveCalcs = getInvGiveCalcs(action.calcs);

      // if we don't find any invGiveCalcs (null/undefined) then print a developer error??
      if (!(invGiveCalcs)) { e("missing invGiveCalcs"); }
            
      for (var calcIdx in invGiveCalcs){
        doInvGiveCalc(invGiveCalcs[calcIdx]);
      }                
      function getInvGiveCalcs(calcs) {
        // prepare to store all the "inventory takes" in an array
        var invGiveCalcs = [];

        for (var calcIdx in action.calcs) { // array iteration instead of object iteration
          // let's look through each item in the "calcs" property/subObject
          // lets make it easier to refer to the actual indicidual "calc item"
          //  that we're looking at, at the moment
          var calc = action.calcs[calcIdx];

          // the name of the GameItem we want to CALC FROM as a string is 
          //  stored in calc.list and calc.item combined
          if (!calc.list || !calc.item) { e("missing ITEM NAME (list & item)"); }

          if (calc.list=="inventory" && calc.type=="give") {
            invGiveCalcs.push(calc);
          }
        }
        return invGiveCalcs;
      }
      function doInvGiveCalc(calc) {
        // store the full string/name which we need to use to build an 
        //  actual code reference to the gameItem object
        var gameItem_fullEvalStr = calc.list + "." + calc.item;
        var gameItemBal_evalStr = gameItem_fullEvalStr + ".bal";

        // now store a reference to the ACTUAL GameItem by 'eval'ing the 
        //  STRING NAME of the GameItem, which is the string in calc.itemStr/calcItem_fullLbl
        calc.gameItem = eval(gameItem_fullEvalStr);
        if (!calc.gameItem) {e("possible misspelling of gameItem in JSON");}

        // set up the ACTUAL 'perform calculation' statement      
        var doTakeCalc_evalStr = gameItemBal_evalStr + "=" + gameItemBal_evalStr + calc.operator + calc.changeAmt;
        // e.g. (doTakeCalc_evalStr = "inventory.wood = inventory.wood - 5"  or  "vitals.hunger = vitals.hunger + 10"

        // go RIGHT AHEAD and perform the operation on THIS CLONED copy by EVALing the "doTakeCalc string"
        eval (doTakeCalc_evalStr);

        // store post calculation balance for comparison (?)                    
        calc.postCalcBal = calc.gameItem.bal;
        // not sure we use this ????
                
        //print these regardless of whether it's false(succeeded) or true(failed)
        l("postCalcBal:"+calc.postCalcBal);            
        l();
      } // END: function doInvGiveCalc(calc) {
    } // END: function doInvGiveCalcs(action, inventory)
    function doVitGiveCalcs(action, vitals){
      // we're only looking at the CALCS prop of the ACTION object, we don't
      //  care about the other properties !="calcs" (e.g. key, duration, msgs)
      var vitGiveCalcs = getVitGiveCalcs(action.calcs);    
      
      // if we don't find any invGiveCalcs (null/undefined) then print a developer error??
      if (!(vitGiveCalcs)) { e("missing vitGiveCalcs"); }
            
      for (var calcIdx in vitGiveCalcs){
        doVitGiveCalc(vitGiveCalcs[calcIdx]);
      }     
      function getVitGiveCalcs(calcs) {
        // prepare to store all the "inventory takes" in an array
        var vitGiveCalcs = [];

        for (var calcIdx in action.calcs) { // array iteration instead of object iteration
          // let's look through each item in the "calcs" property/subObject
          // lets make it easier to refer to the actual indicidual "calc item"
          //  that we're looking at, at the moment
          var calc = action.calcs[calcIdx];

          // the name of the GameItem we want to CALC FROM as a string is 
          //  stored in calc.list and calc.item combined
          if (!calc.list || !calc.item) { e("missing ITEM NAME (list & item)"); }

          if (calc.list=="vitals" && calc.type=="give") {
            vitGiveCalcs.push(calc);
          }
        }
        return vitGiveCalcs;
      }             
      function doVitGiveCalc(calc) {
        // store the full string/name which we need to use to build an 
        //  actual code reference to the gameItem object
        var gameItem_fullEvalStr = calc.list + "." + calc.item;
        var gameItemBal_evalStr = gameItem_fullEvalStr + ".bal";

        // now store a reference to the ACTUAL GameItem by 'eval'ing the 
        //  STRING NAME of the GameItem, which is the string in calc.itemStr/calcItem_fullLbl
        calc.gameItem = eval(gameItem_fullEvalStr);
        if (!calc.gameItem) {e("possible misspelling of gameItem in JSON");}

        // store original balance to use to set bal to ZERO if it drops BELOW ZERO from 
        //  the calculation - i.e. you can't have LESS THAN ZERO hunger, thirst, etc.
        calc.preCalcBal = calc.gameItem.bal;
                
        // set up the ACTUAL 'perform calculation' statement      
        var doTakeCalc_evalStr = gameItemBal_evalStr + "=" + gameItemBal_evalStr + calc.operator + calc.changeAmt;
        // e.g. (doTakeCalc_evalStr = "inventory.wood = inventory.wood - 5"  or  "vitals.hunger = vitals.hunger + 10"

        // go RIGHT AHEAD and perform the operation on THIS CLONED copy by EVALing the "doTakeCalc string"
        eval (doTakeCalc_evalStr);

        // store post calculation balance for comparison (?)                    
        calc.postCalcBal = calc.gameItem.bal;

    /////////////////////
    //zeroOutVitalsIfBelowZero
    /////////////////////

        // set bal to ZERO if it drops BELOW ZERO from the calculation - 
        //  i.e. you can't have LESS THAN ZERO hunger, thirst, etc.        
        if (calc.postCalcBal < 0) calc.gameItem.bal = 0;

        //print these regardless of whether it's false(succeeded) or true(failed)
        l("postCalcBal:"+calc.postCalcBal);            
        l();
      } // END: function doInvGiveCalc(calc) {      

    } // END: function doVitGiveCalcs(action, vitals)
  },






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


