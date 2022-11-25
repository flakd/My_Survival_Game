const l = console.log;

let core = {
  check: function check(inventory, vitals, action, time, timeInterval) {
    var gameItemToChange_shortStr,
        gameItemToChange_fullStr,
        gameItemToChange,
        Operator_Str,
        changeAmt    
    ;    
    var doAction_evalStrs = {};
    var inventoryDflt_cond_evalStr = {};
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

    var isDead = core.doCounters(action,vitals);
    if (isDead) { return {time, isDead};}

    for (var attribsLbl in action) { // e.g. attribsLbl = "inventory" or "vitals"
      var attribs = action[attribsLbl];

      for (var attribLbl in attribs) { //e.g. attrib = "calcs" or "msgs"
        //take, give, msgs
        var attrib = attribs[attribLbl];

        if (attribLbl == "take" || attribLbl == "give") {
          numCalcs++;
          gameItemToChange_shortStr = attrib.gameItem; // e.g. "wood" (string)
          gameItemToChange_fullStr = attribsLbl + "." + gameItemToChange_shortStr;
          gameItemToChange = eval(gameItemToChange_fullStr);
          Operator_Str = attrib.operator;
          changeAmt = attrib.changeAmt;

          var doAction_evalStr = "";
          if (Operator_Str == "=") {
            //doAction_evalStr = "gameItemToChange.bal" + Operator_Str + changeAmt;
            doAction_evalStr = gameItemToChange_fullStr + ".bal" + Operator_Str + changeAmt; 
            var tmp = 0;
          } else {
            if (Operator_Str == "+" || Operator_Str == "-") {
              if (attribsLbl=="inventory"){
                doAction_evalStr  = gameItemToChange_fullStr + ".bal" + "=" 
                                  + gameItemToChange_fullStr + ".bal" 
                                  + Operator_Str + changeAmt;
              } else
              if (attribsLbl=="vitals"){
                doAction_evalStr  = gameItemToChange_fullStr + ".bal" + "=" 
                                  + gameItemToChange_fullStr + ".bal" 
                                  + Operator_Str + " (" + changeAmt + " * " + action.duration + ") ";
              }
            }
          }

          var tmpCondEval =  "gameItemToChange.bal" + Operator_Str + changeAmt;
          eval(tmpCondEval);
          inventoryDflt_cond_evalStr[attribsLbl+"_"+attribLbl] = tmpCondEval + ">= 0"
          var vitalsTake_cond1_evalStr;
          var vitalsTake_cond2_evalStr;
          var vitalsGive_cond1_evalStr;
          var vitalsGive_cond2_evalStr;


          //if (attribsLbl=="vitals" && gameItemToChange.key != "none"){
          if (gameItemToChange.key == "none"){
            doAction_evalStrs[attribsLbl+"_"+attribLbl] = doAction_evalStr;
            numTrue++;
            continue;
          }

          if (attribsLbl=="inventory"){
            if (attribLbl=="take"){
              if ( !eval(inventoryDflt_cond_evalStr[attribsLbl+"_"+attribLbl]) ){
                l(attribs.msgs.errMsg, changeAmt, gameItemToChange_shortStr, gameItemToChange.bal, gameItemToChange_shortStr);                
                return {time};
              } else {
                doAction_evalStrs[attribsLbl+"_"+attribLbl] = doAction_evalStr;
                numTrue++;
                continue;
              }
            } else
            if (attribLbl=="give"){
              if ( !eval(inventoryDflt_cond_evalStr[attribsLbl+"_"+attribLbl]) ){
                l(attribs.msgs.errMsg, changeAmt, gameItemToChange_shortStr, gameItemToChange.bal, gameItemToChange_shortStr);                
                return {time};
              } else {
                doAction_evalStrs[attribsLbl+"_"+attribLbl] = doAction_evalStr;
                numTrue++;
                continue;
              }
            }                
          } else          
          if (attribsLbl=="vitals") {              
            if (attribLbl=="take"){
              vitalsTake_cond1_evalStr = "gameItemToChange.bal" + Operator_Str + changeAmt + gameItemToChange.dieOper + gameItemToChange.dieLimit;
              if (gameItemToChange.key == "none"){
                numTrue = numTrue + 1;
                doAction_evalStrs[attribsLbl+"_"+attribLbl] = doAction_evalStr;
                continue;
              }
              if (eval(vitalsTake_cond1_evalStr)) {

                //  You died HERE so, we want to immediately set this VITAL to 100, 
                //  otherwise the action fails and we don't INCREASE the VITAL by 
                //  whatever we were supposed to from the action/anything at all
                gameItemToChange.bal = 100;

                l( gameItemToChange.dieMsg );   //e.g. you died... "of exhaustion", "by freezing to death", etc.
                return {time};;   // TODO:  change to EXIT (game over)
              } else {
                doAction_evalStrs[attribsLbl+"_"+attribLbl] = doAction_evalStr;
                numTrue = numTrue + 1;
                continue;
              }
            } else 
            if (attribLbl=="give"){
              vitalsGive_cond1_evalStr  = gameItemToChange_fullStr + ".bal"
                                        + Operator_Str + " (" + changeAmt + " * " + action.duration + ") "
                                        + " < 0";

              //vitalsGive_cond1_evalStr = "gameItemToChange.bal" + Operator_Str + changeAmt + gameItemToChange.doOper + gameItemToChange.doLimit;
              vitalsGive_cond2_evalStr = "gameItemToChange.bal == 0";
              if (gameItemToChange.key == "none"){
                numTrue = numTrue + 1;
                doAction_evalStrs[attribsLbl+"_"+attribLbl] = doAction_evalStr;
                continue;
              }
              if (eval(vitalsGive_cond2_evalStr) && gameItemToChange.key != "none"){  
                // the vitals you're trying to satisfy (hunger) is already ZERO, so you're NOT HUNGRY -- DISALLOW

                l( gameItemToChange.doErrMsg );    //e.g. "you're not cold", "you're not hungry"
                numTrue = numTrue;                // no increment, should cause ENTIRE ACTION to FAIL
                return {time};                    // TODO:  change to EXIT (game over) ??
              } else                              // nonZERO, so some positive number in this vitals value
              if (eval(vitalsGive_cond1_evalStr)) {  // the vitals you're trying to satisfy (hunger) - hunger cost < ZERO, so set to ZERO -- ALLOW
                doAction_evalStrs[attribsLbl+"_"+attribLbl] = gameItemToChange_fullStr + ".bal" + " = 0";
                numTrue = numTrue + 1;
                continue;                  
              } else {
                doAction_evalStrs[attribsLbl+"_"+attribLbl] = doAction_evalStr;
                numTrue = numTrue + 1;
                continue;
              }
            } 
          }
        
        }
        
      }
    }
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

  doCounters: function doCounters(action,vitals,isDead){
    var counterIncrement = action.duration;
    var numDeath = 0;
    for (var vital in vitals){
      if(vital!="none"){
        vitals[vital].bal+= vitals[vital].dfltInc * action.duration;
        if (vitals[vital].bal > 100) {

          // DEAD message.   e.g.  You've died from exhaustion!!
          l(vitals[vital].dieMsg);
          l();
          vitals[vital].bal = 100;
          numDeath++;
        }
      }
      if (numDeath > 0) {
        isDead = true;
        return isDead;
      }
    }
  }

} //END Core Object



module.exports = core;
