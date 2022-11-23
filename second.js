const l = console.log;

let second = {
  check: function check(inventory, vitals, action, time, timeInterval) {
    var calcSet, 
        gameItemToChange_shortStr,
        gameItemToChange_fullStr,
        gameItemToChange,
        Operator_Str,
        changeAmt    
    ;    
    var doAction_evalStrs = {};
    var inventoryDflt_cond_evalStr = {};
    var gameItemsToChange_evalStrs = {};
    var numTrue=0;
    var numCalcs=0;


    for (var attribsLbl in action) { // e.g. attribsLbl = "inventory" or "vitals"
      var attribs = action[attribsLbl];

      for (var attribLbl in attribs) { //e.g. attrib = "calcs" or "msgs"
        var attrib = attribs[attribLbl];

        if (attribLbl == "calcs") {
          var calcs = attrib; // calcs=attrib = obj of subs and adds to inventory or vitals

          for (var calcLbl in calcs) { //e.g. calcLbl (string) = "take" or "give"
            numCalcs++;
            calcSet = calcs[calcLbl]; // e.g. ENTIRE add or sub PROPERTY
            gameItemToChange_shortStr = calcSet.gameItem; // e.g. "wood" (string)
            gameItemToChange_fullStr = attribsLbl + "." + gameItemToChange_shortStr;
            gameItemToChange = eval(gameItemToChange_fullStr);
            Operator_Str = calcSet.operator;
            changeAmt = calcSet.changeAmt;

            var doAction_evalStr = "";
            if (Operator_Str == "=") {
              //doAction_evalStr = "gameItemToChange.bal" + Operator_Str + changeAmt;
              doAction_evalStr = gameItemToChange_fullStr + ".bal" + Operator_Str + changeAmt; 
              var tmp = 0;
            }
            else if (Operator_Str == "+" || Operator_Str == "-") {
              doAction_evalStr = gameItemToChange_fullStr + ".bal" + "=" + gameItemToChange_fullStr + ".bal" + Operator_Str + changeAmt;
            }

            var tmpCondEval =  "gameItemToChange.bal" + Operator_Str + changeAmt;
            eval(tmpCondEval);
            inventoryDflt_cond_evalStr[attribsLbl+"_"+calcLbl] = tmpCondEval + ">= 0"
            var vitalsTake_cond_evalStr;
            var vitalsGive_cond_evalStr;

            if ( !eval(inventoryDflt_cond_evalStr[attribsLbl+"_"+calcLbl]) ){
              if (attribsLbl=="inventory"){
                l(attribs.msgs.errMsg, changeAmt, gameItemToChange_shortStr, gameItemToChange.bal, gameItemToChange_shortStr);                
                return;
              }          
            } else {
              doAction_evalStrs[attribsLbl+"_"+calcLbl] = doAction_evalStr;
            }          
            if (attribsLbl=="vitals"){
              if (calcSet=="take"){
                vitalsTake_cond_evalStr = "gameItemToChange.bal" + Operator_Str + changeAmt + "gameItemToChange.dieOper" + "gameItemToChange.dieLimit";
                if (eval(vitalsTake_cond_evalStr)) {
                  l( eval("gameItemToChange.dieMsg") );   //e.g. you died... "of exhaustion", "by freezing to death", etc.
                  return;   // TODO:  change to EXIT (game over)
                } else {
                  doAction_evalStrs[attribsLbl+"_"+calcLbl] = doAction_evalStr;
                }
              }
              if (calcSet=="give"){
                vitalsGive_cond_evalStr = "gameItemToChange.bal" + Operator_Str + changeAmt + "gameItemToChange.doOper" + "gameItemToChange.doLimit";
                if (eval(vitalsGive_cond_evalStr)) {
                  l( eval("gameItemToChange.doErr") );    //e.g. "you're not cold", "you're not hungry"
                  return;   // TODO:  change to EXIT (game over)
                } else {
                  doAction_evalStrs[attribsLbl+"_"+calcLbl] = doAction_evalStr;
                }
              } 
            }
 
            
            /*none of those caused a return do to failure, so add 
              THE ONE doAction_evalStr (there is onely one generic 
              for all 4 possibilities) to the object
            */
            //doAction_evalStrs[attribsLbl+"_"+calcLbl] = doAction_evalStr;
            numTrue++;
          
          }
        }
      }
    }
    if (numTrue == numCalcs){
      for (var doAction_evalStr2 in doAction_evalStrs){
        eval(doAction_evalStrs[doAction_evalStr2]);
        //time+=timeInterval;
      }
      //eval(doAction_evalStr);
    }
    //return { calcSet, gameItemToChange_shortStr, gameItemToChange_fullStr, gameItemToChange, Operator_Str, changeAmt };
    time = incrementTime(action,time).time;
    doCounters(action,vitals);
    return {time};

  } //END check()

} //END second Object

function incrementTime(action,time){
  time += action.timeIncrement;
  return { time };
}

function doCounters(action,vitals){
  var counterIncrement = action.timeIncrement;
  for (var vital in vitals){
    if(vital!="none"){
      vitals[vital].bal+= vitals[vital].ctr * action.timeIncrement;
    }
  }
}


module.exports = second;
