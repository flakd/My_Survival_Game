let g;  //create my global object;
if (global) { 
    g=global;
} else
if (window) { 
  g=window;
}const l = console.log;

let core = {
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
    for (var attribsLbl in action) { // e.g. attribsLbl = "inventory" or "vitals"

      if (attribsLbl == "inventory" || attribsLbl == "vitals") {
        var attribs = action[attribsLbl];
        core.innerLoop1(line,inventory, vitals, action, attribs, attribsLbl, doAction_evalStrs, numTrue, numCalcs);
      }

    } 

  },

  innerLoop1: function innerLoop1(line, inventory, vitals, action, attribs, attribsLbl, doAction_evalStrs, numTrue, numCalcs){ 
    for (var attribLbl in attribs) { //e.g. attribLbl = each "take", "give", or "msgs"
      //take, give, msgs
      var attrib = attribs[attribLbl];

      if (attribLbl == "take" || attribLbl == "give") {
        var togResult = core.doTakeOrGive(line,inventory, vitals, action, attrib, attribs, attribsLbl, attribLbl, doAction_evalStrs, numTrue, numCalcs);
        if (togResult.didSucceed) numTrue = numTrue + 1;
      }
      
    }    
  },

  getCalcStrings: function getCalcStrings(inventory, vitals, attrib, attribsLbl, numCalcs){
    numCalcs = numCalcs + 1;

    var gameItemToChange_shortStr;    
    var gameItemToChange_fullStr;
    var gameItemToChange;
    var Operator_Str;
    var changeAmt;

    gameItemToChange_shortStr = attrib.gameItem; // e.g. "wood" (string)
    gameItemToChange_fullStr = attribsLbl + "." + gameItemToChange_shortStr;
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

  doTakeOrGive: function doTakeOrGive(line,inventory, vitals, action, attrib, attribs, attribsLbl, attribLbl, doAction_evalStrs, numTrue, numCalcs){
    var inventoryDflt_cond_evalStr = {};
    var calcStrings, cs = core.getCalcStrings(inventory, vitals, attrib, attribsLbl, numCalcs);
    var doAction_evalStr = getDoAction_evalStr(cs,action);

    var tmpCondEval =  "cs.gameItemToChange.bal" + cs.Operator_Str + cs.changeAmt;
    eval(tmpCondEval);
    inventoryDflt_cond_evalStr[attribsLbl+"_"+attribLbl] = tmpCondEval + ">= 0"
    var vitalsTake_cond1_evalStr;
    var vitalsGive_cond1_evalStr;
    var vitalsGive_cond2_evalStr;


    //if (attribsLbl=="vitals" && cs.gameItemToChange.key != "none"){
    if (cs.gameItemToChange.key == "none"){
      doAction_evalStrs[attribsLbl+"_"+attribLbl] = doAction_evalStr;
      numTrue++;
      //continue;
      return {didSucceed: true};
    }

    if (attribsLbl=="inventory"){
      return doTakeOrGive_inventory();       
    } else          
    if (attribsLbl=="vitals") {              
      return doTakeOrGive_vitals();
    }

    function doTakeOrGive_inventory(){
      if (attribLbl=="take"){
        if ( !eval(inventoryDflt_cond_evalStr[attribsLbl+"_"+attribLbl]) ){
          l(attribs.msgs.errMsg, cs.changeAmt, cs.gameItemToChange_shortStr, cs.gameItemToChange.bal, cs.gameItemToChange_shortStr);                
          return {didSucceed: false};
        } else {
          doAction_evalStrs[attribsLbl+"_"+attribLbl] = doAction_evalStr;
          return {didSucceed: true};
        }
      } else
      if (attribLbl=="give"){
        if ( !eval(inventoryDflt_cond_evalStr[attribsLbl+"_"+attribLbl]) ){
          l(attribs.msgs.errMsg, cs.changeAmt, cs.gameItemToChange_shortStr, cs.gameItemToChange.bal, cs.gameItemToChange_shortStr);                
          return {didSucceed: false};
        } else {
          doAction_evalStrs[attribsLbl+"_"+attribLbl] = doAction_evalStr;
          return {didSucceed: true};
        }
      }             
    }   // END doTakeOrGiveInventory          
    function doTakeOrGive_vitals(){
      if (attribLbl=="take"){
        vitalsTake_cond1_evalStr = "cs.gameItemToChange.bal" + cs.Operator_Str + cs.changeAmt + cs.gameItemToChange.dieOper + cs.gameItemToChange.dieLimit;
        if (cs.gameItemToChange.key == "none"){
          doAction_evalStrs[attribsLbl+"_"+attribLbl] = doAction_evalStr;
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
          doAction_evalStrs[attribsLbl+"_"+attribLbl] = doAction_evalStr;
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
          doAction_evalStrs[attribsLbl+"_"+attribLbl] = doAction_evalStr;
          return {didSucceed: true};
        }
        if (eval(vitalsGive_cond2_evalStr) && cs.gameItemToChange.key != "none"){  
          // the vitals you're trying to satisfy (hunger) is already ZERO, so you're NOT HUNGRY -- DISALLOW

          l( cs.gameItemToChange.keydoErrMsg );    //e.g. "you're not cold", "you're not hungry"
          return {didSucceed: false};                // no increment, should cause ENTIRE ACTION to FAIL
        } else                              // nonZERO, so some positive number in this vitals value
        if (eval(vitalsGive_cond1_evalStr)) {  // the vitals you're trying to satisfy (hunger) - hunger cost < ZERO, so set to ZERO -- ALLOW
          doAction_evalStrs[attribsLbl+"_"+attribLbl] = cs.gameItemToChange_fullStr + ".bal" + " = 0";
          return {didSucceed: true};                
        } else {
          doAction_evalStrs[attribsLbl+"_"+attribLbl] = doAction_evalStr;
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
          if (attribsLbl == "inventory") {
            doAction_evalStr = cs.gameItemToChange_fullStr + ".bal" + "="
              + cs.gameItemToChange_fullStr + ".bal"
              + cs.Operator_Str + cs.changeAmt;
          }
          else if (attribsLbl == "vitals") {
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


