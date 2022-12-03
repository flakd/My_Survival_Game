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
  //  1. read inputs from user
  //readInput: function readInput(){}
  //  WE ALREADY HAVE an input (that's being handled by rl.on() in main.js)
  //    so, we don't need to write a function/nor call it here  
  isStillAliveGameLoop: function isStillAliveGameLoop(userInput, inventory, vitals, actions){
    //  ** ANY FAILURE (return false) below immediately jumps out of function **
    
    //  2. check if input is a LEGIT input
    //     a. EXECUTE valid Game COMMANDS
    if ( core.isInputAValidGameCommand(userInput.toLowerCase()) ) return core.doCommandWithResult(userInput.toLowerCase());

    //     b. check to see if this is a LEGIT game-play action
    if (!core.isInputAValidGameAction(userInput.toLowerCase(), actions)) 
    return true;      // RETURNing TRUE here b/c we ARE NOT DEAD and want 
                      //   to continue code execution
                      //   (REMEMBER:  return false would mean we died)

    // now that we know it's valid, set action for further processing/use
    g.c.action=actions[userInput.toLowerCase()];

    // if below is false, then skip to NEXT input READLINE, which requires a return of true
    if (!core.canDoGameAction(g.c.action, inventory, vitals)) {
      return true;
    }

    // else do not return and we continue to the next line of code...
    //  which is to ACTUALLY execute the command
    core.doGameAction(g.c.action, inventory, vitals);

    //  5. -------------------------------------------------------------------->
    // passTime() increases hours by action.numHours and...
    //   increases vitals by vitals.takePerHour * action.numHours    
    core.doPassTime(g.c.action, inventory, vitals);

    // print status at the end... AFTER the command is executed, 
    //  so we can see the results/new numbers, otherwise we are always looking
    //  at the previous numbers each time we execute a command
    output.printStats1(g.gameHour,g.c);

    //  6. -------------------------------------------------------------------->
    // doRandomActOfGod() randomly adds elements like storms, bears, falls, etc.
    //  that cause injury (or maybe later damage to equipment as well)
    //  increases vitals by vitals.takePerHour * action.numHours    
    if ( core.doRandomActOfGod(inventory, vitals) ) {
      output.printStats1(g.gameHour,g.c);
    }
    return (!core.isDead(vitals)); // if you're dead, this is FALSE, which triggers 
                              //  an rl.close() of the main  game READLINE 
                              //  loop - but we want to confirm that you are 
                              //  dead, or that you've quit

    //==========================================================================>
    //  8. loop back to beginning
    //==========================================================================>
    return true;

  },


  //==========================================================================>
  //  5. pass time (update any time-dependent variables )
  //     a. based on action.duration * vitals.COST
  //==========================================================================>    
  doPassTime: function doPassTime(action, inventory, vitals){
    for (var vitalLbl in vitals){     //loop through vitals
      var vital = vitals[vitalLbl];

      if (vitalLbl != "none") {   // skip the "none" vital, that's just 
                                  //  used for default values/storage

        for (var calcIdx in action.calcs) {
          var calc = action.calcs[calcIdx];

          // can I use getSpecificCalcs() here ??
          if (calc.list == "vitals")

            //  do dflt vital.takePerHour -
            //    EXCEPT for action.calcs.take.vitals => override dflt vital.takePerHour      
            if (vitalLbl == calc.item) {
              if (calc.operator == "-"){
                vital.bal = vital.bal - calc.changeAmt;
              } else 
              if (calc.operator == "+"){
                vital.bal = vital.bal + calc.changeAmt;
              }
            } else {
              vital.bal+= vital.takePerHour * action.numHours;              
            }

            if (vital.bal < 0) vital.bal = 0;

            if (vital.bal > vital.dangerLimit) {
              l();
              if (!vitals.none.dflt_dangerMsg) e("missing vitals.none.dflt_dangerMsg");
              l(vitals.none.dflt_dangerMsg,vitalLbl,vitalLbl);
              l();
                          // if above danger, we don't want to ALSO print 
                          //  WARNING MSG, so skip to next iteration/vital
                          //  otherwise, fall through to below and then 
                          //  check for warningLimit instead
            } else
            if (vital.bal > vital.warningLimit) {
              l();
              l(vital.warningMsg,vital.dieMsg2);
              l();
            }            
          }
        }
    }
    g.gameHour+=action.numHours;
  },

  //==========================================================================>  
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
    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
    }
    var randomNumber = getRandomInt(0, actsOfGod.length);
    var actChoice =  randomNumber;
    var actOfGod = actsOfGod[actChoice];
    var chance = getRandomInt(0,100);
    if (chance <= actOfGod.probability) { 
      var actualDamage = actOfGod.injury * getRandomInt(0,100) / 100;
      var actualDamageInt = Math.round(actualDamage);
      vitals.injury.bal = vitals.injury.bal + (actualDamageInt);
      l(" *** Oh NO!  BAD LUCK!!! *** ==>  %s: injury: %i", actOfGod.event.toUpperCase(), actualDamageInt);
      l();      
      return true;
    }
    else return false;
  },

  //==========================================================================>
  //  7. check for death    ==>  TODO:  Game Over / Play Again
  //     a. verify that all VITALS are < 100
  //==========================================================================>    
  isDead: function isDead(vitals){
    var numDeaths =0;

    for (var vitalLbl in vitals){
      var vital = vitals[vitalLbl];

      if (vitalLbl != "none") {   // skip the "none" vital, that's just 
                                  //  used for default values/storage
        if (vital.bal >= 100) {
          l(vital.dieMsg);
          numDeaths++;
        }
      }

    }
    if (numDeaths > 0) {
      g.isDead = true;
      return true;  // we are returning TRUE for this function - isDead()
                    //  - which will trigger a return of false to the main 
                    //  loop (see above:  "return (!isDead(vitals));"
    }
  },
  
  doSecretTestCalc: function doSecretTestCalc(userInput, inventory, vitals){
    if ( userInput.toLowerCase() == "/p" ) {
      output.printStats1(g.gameHour,g.c);
      return true;
    }
    if ( userInput.toLowerCase() == "/p2" ) {
      output.printStats1(g.gameHour,g.c2);
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
      //e("**ERROR**:  ACTION (actions[line]) is NOT present (empty or undefined)");
      l();
      l("Sorry, that's not a VALID ACTION, try something else");
      l();
      return false;
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
  canDoGameAction: function canDoGameAction(action, inventory, vitals){
    // lets clone these so that we can make changes without 
    //  affecting the real/originals


    if (canDoInvTakeCalcs(action)) { 
      canDoGameAction = true;
      return canDoGameAction;
      // we don't return false b/c that means we died
    }

    function canDoInvTakeCalcs(action) {
      //prepare for keeping tracking of ANY of these InvTakeCalc conditions fail
      var numInValidTakeConds = 0;   // a successful command means this > 0 when we're done

      // we're only looking at the CALCS prop of the ACTION object, we don't
      //  care about the other properties !="calcs" (e.g. key, duration, msgs)
      var invTakeCalcs = core.getSpecificCalcs("inventory","take");

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

      // set up the ACTUAL 'perform calculation' statement  ==>  ****** BUT DO NOT EVAL/EXECUTE it !!!!      
      var doTakeCalc_evalStr = gameItemBal_evalStr + "=" + gameItemBal_evalStr + calc.operator + calc.changeAmt;
      // e.g. (doTakeCalc_evalStr = "inventory.wood = inventory.wood - 5"  or  "vitals.hunger = vitals.hunger + 10"

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
    } // END:  canDoInvTakeCalc
  }, // END:  function canPerformAction(action, inventory, vitals){


  //  4. perform action by:
  //     a. perform "give"s... THEN
  //     b. perform "take"s (perform 3b, but on REAL inventory )
  //==========================================================================>    
  doGameAction: function doGameAction(action, inventory, vitals){
    doAllInvTakeCalcs(action,inventory);
    doAllInvGiveCalcs(action,inventory);
    doAllVitGiveCalcs(action, vitals);



    function doAllInvTakeCalcs(action, inventory) {
      //prepare for keeping tracking of ANY of these InvTakeCalc conditions fail
      var numInValidTakeConds = 0;   // a successful command means this > 0 when we're done

      // we're only looking at the CALCS prop of the ACTION object, we don't
      //  care about the other properties !="calcs" (e.g. key, duration, msgs)
      var invTakeCalcs = core.getSpecificCalcs("inventory","take");

      // if we don't find any invTakeCalcs (null/undefined) then print a developer error??
      if (!(invTakeCalcs)) { e("missing invTakeCalcs"); }
            
      for (var calcIdx in invTakeCalcs){
        if (!doInvTakeCalc(invTakeCalcs[calcIdx]))         
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


      function doInvTakeCalc(calc) {
        // store the full string/name which we need to use to build an 
        //  actual code reference to the gameItem object
        var gameItem_fullEvalStr = calc.list + "." + calc.item;
        var gameItemBal_evalStr = gameItem_fullEvalStr + ".bal";

        // now store a reference to the ACTUAL GameItem by 'eval'ing the 
        //  STRING NAME of the GameItem, which is the string in calc.itemStr/calcItem_fullLbl
        calc.gameItem = eval(gameItem_fullEvalStr);
        if (!calc.gameItem) {e("possible misspelling of gameItem in JSON");}

        calc.preCalcBal = calc.gameItem.bal;
        l("preCalcBal:"+calc.preCalcBal);            
        l();                          

        // set up the ACTUAL 'perform calculation' statement      
        var doTakeCalc_evalStr = gameItemBal_evalStr + "=" + gameItemBal_evalStr + calc.operator + calc.changeAmt;
        // e.g. (doTakeCalc_evalStr = "inventory.wood = inventory.wood - 5"  or  "vitals.hunger = vitals.hunger + 10"

        // go RIGHT AHEAD and perform the operation on THIS CLONED copy by EVALing the "doTakeCalc string"
        eval (doTakeCalc_evalStr);

        calc.postCalcBal = calc.gameItem.bal;
        l("postCalcBal:"+calc.postCalcBal);            
        l();


      } // END:  doInvTakeCalc
    } // END:  doInvTakeCalcs




    function doAllInvGiveCalcs(action, inventory){
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
    function doAllVitGiveCalcs(action, vitals){
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


  getSpecificCalcs: function getSpecificCalcs(list, type) {
    // prepare to store all the "inventory takes" in an array
    var specificCalcs = [];

    for (var calcIdx in g.c.action.calcs) { // array iteration instead of object iteration
      // let's look through each item in the "calcs" property/subObject
      // lets make it easier to refer to the actual indicidual "calc item"
      //  that we're looking at, at the moment
      var calc = g.c.action.calcs[calcIdx];

      // the name of the GameItem we want to CALC FROM as a string is 
      //  stored in calc.list and calc.item combined
      if (!calc.list || !calc.item) { e("missing ITEM or LIST name"); }

      if (calc.list==list && calc.type==type) {
        specificCalcs.push(calc);
      }
    }
    return specificCalcs;
  }, // END: getInvTakeCalcs(calcs)



} //END Core Object



module.exports = core;


