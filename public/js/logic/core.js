if (g.isBrowserOrNode === 'node') {
  const {exit} = require('process');
  const output = require('./output').default;
}

let core = {
  //------------------------------------------------------------------------>
  //  1. read inputs from user
  //      readInput: function readInput(){}
  //      WE ALREADY HAVE an input (that's being handled by rl.on()
  //      in main.js) so we don't need to write a function/nor call it here
  //------------------------------------------------------------------------>
  isStillAliveGameLoop: function isStillAliveGameLoop(
    userInput,
    inventory,
    vitals,
    actions
  ) {
    //  ** ANY FAILURE (return false) below immediately jumps out of function **

    //------------------------------------------------------------------------>
    //  2. check if input is a LEGIT input (commands not actions)
    //     a. EXECUTE valid Game COMMANDS like [quit, help, about] etc.
    //------------------------------------------------------------------------>
    if (core.isInputAValidGameCommand(userInput.toLowerCase()))
      return core.doCommandWithResult(userInput.toLowerCase());

    //------------------------------------------------------------------------>
    //  2.b. check to see if this is a valid Game play ACTIONS
    //------------------------------------------------------------------------>
    if (!core.isInputAValidGameAction(userInput.toLowerCase(), actions))
      return true; // RETURNing TRUE here b/c we ARE NOT DEAD and want
    //   to continue code execution
    //   (REMEMBER:  return false would mean we died)

    // now that we know it's valid, set action for further processing/use
    g.c.action = actions[userInput.toLowerCase()];

    //------------------------------------------------------------------------>
    //  3. canDoGameAction() - essentially checking InvTakeCalcs to see if
    //      we have the ALL the required amounts of inventory items.
    //      If below is false, then skip to NEXT input READLINE, which
    //      requires a return of true
    //------------------------------------------------------------------------>
    if (!core.canDoGameAction(g.c.action, inventory, vitals)) {
      return true;
    }

    //------------------------------------------------------------------------>
    //  4.b. startGameActionActivityMedia(g.c.action) - this proc displays the
    //    image and sound for the GAME ACTION that the user has inputted/
    //    chosen executes along with next line - do GameAction (which performs
    //    calcs)
    //------------------------------------------------------------------------>
    //g.whatImDoing.startActivity(g.c.action);
    g.waid.startActivity(g.c.action);

    //------------------------------------------------------------------------>
    //  4.a. DoGameAction() - else do not return and we continue to the next
    //      line of code...  which is to ACTUALLY executes the GAME ACTION
    //      i.e. it performs all the calculations and changes the amounts of
    //      inventory items.
    //------------------------------------------------------------------------>
    core.doGameAction(g.c.action, inventory, vitals);

    /*     //------------------------------------------------------------------------>    
    //  5. passTime() increases Hrs by action.numHrs and...
    //      increases vitals by vitals.takePerHr * action.numHrs    
    //------------------------------------------------------------------------>    
    core.doPassTime(g.c.action, inventory, vitals); */

    /*     //------------------------------------------------------------------------>
    //  6.  print status at the end... AFTER the command is executed, 
    //  so we can see the results/new numbers, otherwise we are always looking
    //  at the previous numbers each time we execute a command
    //------------------------------------------------------------------------>
    output.printStats1(g.t.gameHr,g.c); */

    //------------------------------------------------------------------------>
    //  7. doRandomActOfGod() randomly adds elements like storms, bears, falls, etc.
    //  that cause injury (or maybe later damage to equipment as well)
    //  increases vitals by vitals.takePerHr * action.numHrs
    //------------------------------------------------------------------------>
    /*     if ( core.doRandomActOfGod(inventory, vitals) ) {
      output.printStats1(g.t.gameHr,g.c);
    } */

    /*     //------------------------------------------------------------------------>
    //  8. function isDead() to check if any of the VITALS are above 100
    //------------------------------------------------------------------------>
    if (core.isDead(vitals))  { // if you're dead, then RETURN FALSE, which triggers 
      return false;             //  an rl.close() of the main  game READLINE loop
    }  */

    /*     //------------------------------------------------------------------------>
    //  9. haveIBeenRescued() performs a random function check to see if you 
    //  have been rescued
    //------------------------------------------------------------------------>
    if (core.haveIBeenRescued()){    // similar to above (the previous if-else 
      return false;             //  with isDead()), RETURN FALSE here, which 
    }                           //  triggers an rl.close() of the main game 
                                //  READLINE loop */

    //------------------------------------------------------------------------>
    //  10. loop back to beginning
    //------------------------------------------------------------------------>
    return true;
  },

  //  3. check if action can be performed
  //     a. copy inventory
  //     b. perform "take" (requirement) calcs on copy (action.duration * action.COST)
  //     c. verify all TAKE inventory is >= zero (i.e. otherwise at least ONE requirment failed)
  //        i.  IF false => print ERROR message (and NEXT LOOP) for EACH inventory item < 0
  //     d. verify TAKE vital > zero (i.e. otherwise at least ONE requirment failed)
  //        i.  IF false => print ERROR message (i.e. you're not hungry && NEXT LOOP)
  //==========================================================================>
  canDoGameAction: function canDoGameAction(action, inventory, vitals) {
    // lets clone these so that we can make changes without
    //  affecting the real/originals

    function didPassTerrainRestrictions() {
      if (action.key === 'fish' && !amNearWater()) return false;
      else return true;
    }

    function amNearWater() {
      const y = g.p.yInt;
      const x = g.p.xInt;
      // if not AT LEAST 1 adjacent sqaure is FRESH WATER or OCEAN
      if (
        g.map[y + 1][x] === 0 ||
        g.map[y + 1][x] === 2 ||
        g.map[y][x + 1] === 0 ||
        g.map[y][x + 1] === 2 ||
        g.map[y - 1][x] === 0 ||
        g.map[y - 1][x] === 2 ||
        g.map[y][x - 1] === 0 ||
        g.map[y][x - 1] === 2
      ) {
        return true;
      } else {
        g.msgQueue.push('cannot fish here');
        alert('cannot fish here');
        return false;
      }
    }

    if (!didPassTerrainRestrictions()) return;

    if (canDoInvTakeCalcs(action)) {
      canDoGameAction = true;
      return canDoGameAction;
      // we don't return false b/c that means we died
    }

    function canDoInvTakeCalcs(action) {
      //prepare for keeping tracking of ANY of these InvTakeCalc conditions fail
      var numInValidTakeConds = 0; // a successful command means this > 0 when we're done

      // we're only looking at the CALCS prop of the ACTION object, we don't
      //  care about the other properties !="calcs" (e.g. key, duration, msgs)
      var invTakeCalcs = core.getSpecificCalcs('inventory', 'take');

      // if we don't find any invTakeCalcs (null/undefined) then print a developer error??
      if (!invTakeCalcs) {
        e('missing invTakeCalcs');
      }

      for (var calcIdx in invTakeCalcs) {
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
      return numInValidTakeConds == 0;
    }

    function canDoInvTakeCalc(calc) {
      // store the full string/name which we need to use to build an
      //  actual code reference to the gameItem object
      var gameItem_fullEvalStr = calc.list + '.' + calc.item;
      var gameItemBal_evalStr = gameItem_fullEvalStr + '.bal';

      // now store a reference to the ACTUAL GameItem by 'eval'ing the
      //  STRING NAME of the GameItem, which is the string in calc.itemStr/calcItem_fullLbl
      calc.gameItem = eval(gameItem_fullEvalStr);
      if (!calc.gameItem) {
        e('possible misspelling of gameItem in JSON');
      }

      // store original balance to use in error message, in case this calculation fails
      calc.preCalcBal = calc.gameItem.bal;

      // if the preCalcBal MINUS the amount to change (subtract, since
      //  this is a TAKE operation) equals less than ZERO, then we didn't
      //  have enough of this inventory item/resource to perform this
      //  in the first place => NOW => store True/False in boolean var
      calc.willCalcCondFail_str = '(preCalcBal - calc.changeAmt < 0)';
      calc.willCalcCondFail_str2 =
        '(' + calc.preCalcBal + '-' + calc.changeAmt + ' < 0' + ')';
      calc.willCalcCondFail = calc.preCalcBal - calc.changeAmt < 0;

      // set up the ACTUAL 'perform calculation' statement  ==>  ****** BUT DO NOT EVAL/EXECUTE it !!!!
      var doTakeCalc_evalStr =
        gameItemBal_evalStr +
        '=' +
        gameItemBal_evalStr +
        calc.operator +
        calc.changeAmt;
      // e.g. (doTakeCalc_evalStr = "inventory.wood = inventory.wood - 5"  or  "vitals.hunger = vitals.hunger + 10"

      if (!calc.willCalcCondFail) {
        // it's FALSE, that means the calc SUCCEEDED,
        /*         l("This calc (%s) SUCCEEDED: %s[%s] is %s", 
            doTakeCalc_evalStr, calc.willCalcCondFail_str, 
            calc.willCalcCondFail_str2, calc.willCalcCondFail
        );     */
        return true; // return true if that calc succeeds
      } else {
        // it's TRUE, that means the calc FAILED
        //  so print error msg and increase
        //  failure number by one (if we have
        //  even 1 failure, then we won't allow
        //  this ACTION [i.e. we won't copy
        //  this clone back to the original])

        /*         l("This calc (%s) FAILED: %s[%s] is %s", 
            doTakeCalc_evalStr, calc.willCalcCondFail_str, 
            calc.willCalcCondFail_str2, calc.willCalcCondFail
        );       */
        lwlnOutput(
          inventory.default.noMeetReqs_msg,
          g.c.action.key,
          calc.preCalcBal,
          calc.item,
          calc.changeAmt,
          calc.item
        );
        let msgArray = [
          inventory.default.noMeetReqs_msg,
          g.c.action.key,
          calc.preCalcBal,
          calc.item,
          calc.changeAmt,
          calc.item,
        ];
        g.msgQueue.push(msgArray);
        return false; // return false b/c this calc failed
      }
    } // END:  canDoInvTakeCalc
  }, // END:  function canDoGameAction(action, inventory, vitals){

  //  4. perform action by:
  //     a. perform "give"s... THEN
  //     b. perform "take"s (perform 3b, but on REAL inventory )
  //==========================================================================>
  doGameAction: function doGameAction(action, inventory, vitals) {
    doAllInvTakeCalcs(action, inventory);
    doAllInvGiveCalcs(action, inventory);
    doAllVitGiveCalcs(action, vitals);

    function doAllInvTakeCalcs(action, inventory) {
      //prepare for keeping tracking of ANY of these InvTakeCalc conditions fail
      var numInValidTakeConds = 0; // a successful command means this > 0 when we're done

      // we're only looking at the CALCS prop of the ACTION object, we don't
      //  care about the other properties !="calcs" (e.g. key, duration, msgs)
      var invTakeCalcs = core.getSpecificCalcs('inventory', 'take');

      // if we don't find any invTakeCalcs (null/undefined) then print a developer error??
      if (!invTakeCalcs) {
        e('missing invTakeCalcs');
      }

      for (var calcIdx in invTakeCalcs) {
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
      return numInValidTakeConds == 0;

      function doInvTakeCalc(calc) {
        // store the full string/name which we need to use to build an
        //  actual code reference to the gameItem object
        var gameItem_fullEvalStr = calc.list + '.' + calc.item;
        var gameItemBal_evalStr = gameItem_fullEvalStr + '.bal';

        // now store a reference to the ACTUAL GameItem by 'eval'ing the
        //  STRING NAME of the GameItem, which is the string in calc.itemStr/calcItem_fullLbl
        calc.gameItem = eval(gameItem_fullEvalStr);
        if (!calc.gameItem) {
          e('possible misspelling of gameItem in JSON');
        }

        calc.preCalcBal = calc.gameItem.bal;
        /*        lwlnOutput("preCalcBal:"+calc.preCalcBal);            
       lwlnOutput();        */

        // set up the ACTUAL 'perform calculation' statement
        var doTakeCalc_evalStr =
          gameItemBal_evalStr +
          '=' +
          gameItemBal_evalStr +
          calc.operator +
          calc.changeAmt;
        // e.g. (doTakeCalc_evalStr = "inventory.wood = inventory.wood - 5"  or  "vitals.hunger = vitals.hunger + 10"

        // go RIGHT AHEAD and perform the operation on THIS CLONED copy by EVALing the "doTakeCalc string"
        eval(doTakeCalc_evalStr);

        calc.postCalcBal = calc.gameItem.bal;
        /*        lwlnOutput("postCalcBal:"+calc.postCalcBal);            
       lwlnOutput();
 */
      } // END:  doInvTakeCalc
    } // END:  doInvTakeCalcs

    function doAllInvGiveCalcs(action, inventory) {
      // we're only looking at the CALCS prop of the ACTION object, we don't
      //  care about the other properties !="calcs" (e.g. key, duration, msgs)
      var invGiveCalcs = getInvGiveCalcs(action.calcs);

      // if we don't find any invGiveCalcs (null/undefined) then print a developer error??
      if (!invGiveCalcs) {
        e('missing invGiveCalcs');
      }

      for (var calcIdx in invGiveCalcs) {
        doInvGiveCalc(invGiveCalcs[calcIdx]);
      }
      function getInvGiveCalcs(calcs) {
        // prepare to store all the "inventory takes" in an array
        var invGiveCalcs = [];

        for (var calcIdx in action.calcs) {
          // array iteration instead of object iteration
          // let's look through each item in the "calcs" property/subObject
          // lets make it easier to refer to the actual indicidual "calc item"
          //  that we're looking at, at the moment
          var calc = action.calcs[calcIdx];

          // the name of the GameItem we want to CALC FROM as a string is
          //  stored in calc.list and calc.item combined
          if (!calc.list || !calc.item) {
            e('missing ITEM NAME (list & item)');
          }

          if (calc.list == 'inventory' && calc.type == 'give') {
            invGiveCalcs.push(calc);
          }
        }
        return invGiveCalcs;
      }
      function doInvGiveCalc(calc) {
        // store the full string/name which we need to use to build an
        //  actual code reference to the gameItem object
        var gameItem_fullEvalStr = calc.list + '.' + calc.item;
        var gameItemBal_evalStr = gameItem_fullEvalStr + '.bal';

        // now store a reference to the ACTUAL GameItem by 'eval'ing the
        //  STRING NAME of the GameItem, which is the string in calc.itemStr/calcItem_fullLbl
        calc.gameItem = eval(gameItem_fullEvalStr);
        if (!calc.gameItem) {
          e('possible misspelling of gameItem in JSON');
        }

        // set up the ACTUAL 'perform calculation' statement
        var doTakeCalc_evalStr =
          gameItemBal_evalStr +
          '=' +
          gameItemBal_evalStr +
          calc.operator +
          calc.changeAmt;
        // e.g. (doTakeCalc_evalStr = "inventory.wood = inventory.wood - 5"  or  "vitals.hunger = vitals.hunger + 10"

        // go RIGHT AHEAD and perform the operation on THIS CLONED copy by EVALing the "doTakeCalc string"
        eval(doTakeCalc_evalStr);

        // store post calculation balance for comparison (?)
        calc.postCalcBal = calc.gameItem.bal;
        // not sure we use this ????

        //print these regardless of whether it's false(succeeded) or true(failed)
        //l("postCalcBal:"+calc.postCalcBal);
        //l();
      } // END: function doInvGiveCalc(calc) {
    } // END: function doInvGiveCalcs(action, inventory)
    function doAllVitGiveCalcs(action, vitals) {
      // we're only looking at the CALCS prop of the ACTION object, we don't
      //  care about the other properties !="calcs" (e.g. key, duration, msgs)
      var vitGiveCalcs = getVitGiveCalcs(action.calcs);

      // if we don't find any invGiveCalcs (null/undefined) then print a developer error??
      if (!vitGiveCalcs) {
        e('missing vitGiveCalcs');
      }

      for (var calcIdx in vitGiveCalcs) {
        doVitGiveCalc(vitGiveCalcs[calcIdx]);
      }
      function getVitGiveCalcs(calcs) {
        // prepare to store all the "inventory takes" in an array
        var vitGiveCalcs = [];

        for (var calcIdx in action.calcs) {
          // array iteration instead of object iteration
          // let's look through each item in the "calcs" property/subObject
          // lets make it easier to refer to the actual indicidual "calc item"
          //  that we're looking at, at the moment
          var calc = action.calcs[calcIdx];

          // the name of the GameItem we want to CALC FROM as a string is
          //  stored in calc.list and calc.item combined
          if (!calc.list || !calc.item) {
            e('missing ITEM NAME (list & item)');
          }

          if (calc.list == 'vitals' && calc.type == 'give') {
            vitGiveCalcs.push(calc);
          }
        }
        return vitGiveCalcs;
      }
      function doVitGiveCalc(calc) {
        // store the full string/name which we need to use to build an
        //  actual code reference to the gameItem object
        var gameItem_fullEvalStr = calc.list + '.' + calc.item;
        var gameItemBal_evalStr = gameItem_fullEvalStr + '.bal';

        // now store a reference to the ACTUAL GameItem by 'eval'ing the
        //  STRING NAME of the GameItem, which is the string in calc.itemStr/calcItem_fullLbl
        calc.gameItem = eval(gameItem_fullEvalStr);
        if (!calc.gameItem) {
          e('possible misspelling of gameItem in JSON');
        }

        // store original balance to use to set bal to ZERO if it drops BELOW ZERO from
        //  the calculation - i.e. you can't have LESS THAN ZERO hunger, thirst, etc.
        calc.preCalcBal = calc.gameItem.bal;

        // set up the ACTUAL 'perform calculation' statement
        var doTakeCalc_evalStr =
          gameItemBal_evalStr +
          '=' +
          gameItemBal_evalStr +
          calc.operator +
          calc.changeAmt;
        // e.g. (doTakeCalc_evalStr = "inventory.wood = inventory.wood - 5"  or  "vitals.hunger = vitals.hunger + 10"

        // go RIGHT AHEAD and perform the operation on THIS CLONED copy by EVALing the "doTakeCalc string"
        eval(doTakeCalc_evalStr);

        // store post calculation balance for comparison (?)
        calc.postCalcBal = calc.gameItem.bal;

        /////////////////////
        //zeroOutVitalsIfBelowZero
        /////////////////////

        // set bal to ZERO if it drops BELOW ZERO from the calculation -
        //  i.e. you can't have LESS THAN ZERO hunger, thirst, etc.
        if (calc.postCalcBal < 0) calc.gameItem.bal = 0;

        //print these regardless of whether it's false(succeeded) or true(failed)
        //l("postCalcBal:"+calc.postCalcBal);
        //l();
      } // END: function doInvGiveCalc(calc) {
    } // END: function doVitGiveCalcs(action, vitals)
  }, // END:  function doGameAction(action, inventory, vitals){

  //  5. doPassTime() ========================================================>
  //    pass time (update any time-dependent variables )
  //     a. based on action.duration * vitals.COST
  //==========================================================================>
  /*
      JavaScript function that is responsible for updating the values of 
      various "vital" objects, such as thirst, hunger, and fatigue, based on 
      some kind of action taken. The function takes three parameters:

        action:     an object that contains information about the action being 
                    taken, including an array of calculations to be performed 
                    (calcs) and the number of Hrs that the action takes 
                    (numHrs).

        inventory:  an object that represents the player's inventory. It is 
                    not used in this function.

        vitals:     an object that contains the vital objects (e.g. thirst, 
                    hunger, fatigue) as properties.

      1. The function first loops through all of the vital objects and stores 
          the current vital object in a variable called vital. 
      2. Then, it loops through the calculations defined in the action.calcs 
          array and checks if the calculation is related to the vitals 
          (calc.list == "vitals"). 
      3. If it is, the function checks whether the vital being updated 
          (vitalLbl) is the same as the item specified in the calculation 
          (calc.item). 
      4. If it is, the function applies the change specified in the 
          calculation using the specified operator (+ or -). If the vital 
          being updated is not the same as the item specified in the 
          calculation, the function adds the default change per Hr for 
          that vital (vital.takePerHr * action.numHrs) to the vital's 
          balance (vital.bal).
      5. After all of the calculations have been applied, the function checks 
          whether the vital's balance is below 0 or above the danger or 
          warning limits. If it is, it prints a corresponding message. 
      6. Finally, the function increments the game Hr by the number of Hrs 
          the action took.  
  */
  doPassTime: function doPassTime(action, inventory, vitals) {
    for (var vitalLbl in vitals) {
      //loop through all vital objects, e.g. thirst, hunger, fatigue
      if (vitalLbl == 'default') continue; // skip the "default" vital, we
      //  only use it as a storage
      //  placeholder

      var vital = vitals[vitalLbl]; // store the actual current vital
      //  object e.g. thirst we're (only)
      //  looking at ALL 5 vitals and
      //  not the 'default' vital

      var messageArray = [];
      for (var calcIdx in action.calcs) {
        var calc = action.calcs[calcIdx];

        // can I use getSpecificCalcs() here ??
        if (calc.list == 'vitals') {
          //  do dflt vital.takePerHr -
          //    EXCEPT for action.calcs.take.vitals => override dflt vital.takePerHr
          /*           if (vitalLbl == calc.item) {
              if (calc.operator == "-"){
                vital.bal = vital.bal - calc.changeAmt;
              } else if (calc.operator == "+"){
                vital.bal = vital.bal + calc.changeAmt;
              }
            } else if (vitalLbl != calc.item) {
              vital.bal = vital.bal + (vital.takePerHr * action.numHrs);              
            } */

          /*             if (vitalLbl == calc.item) {
              if (calc.operator == "-"){
                vital.bal = vital.bal - calc.changeAmt;
              } else if (calc.operator == "+"){
                vital.bal = vital.bal + calc.changeAmt;
              }
            } else if (calc.list == "vitals") {
              vital.bal = vital.bal + (vital.takePerHr * action.numHrs);
            } */

          if (vitalLbl == calc.item) {
            if (calc.operator == '-') {
              vital.bal = vital.bal - calc.changeAmt;
            } else if (calc.operator == '+') {
              vital.bal = vital.bal + calc.changeAmt;
            }
            if (calc.override) {
              vital.overridden = true;
            }
          }

          if (vital.bal < 0) vital.bal = 0;

          if (vital.bal > vital.dangerLimit) {
            lwlnOutput();
            if (!vitals.default.dflt_dangerMsg)
              e('missing vitals.default.dflt_dangerMsg');
            lwlnOutput(vitals.default.dflt_dangerMsg, vitalLbl, vitalLbl);
            lwlnOutput();
            // if above danger, we don't want to ALSO print
            //  WARNING MSG, so skip to next iteration/vital
            //  otherwise, fall through to below and then
            //  check for warningLimit instead
          } else if (vital.bal > vital.warningLimit) {
            lwlnOutput();
            lwlnOutput(vital.warningMsg, vital.dieMsg2);
            lwlnOutput();
          }
        } // END: if (calc.list == "vitals") {

        if (calc.message) {
          var msgElement = calc.item + ' ' + calc.operator + calc.changeAmt;
          //messageArray.push(new Array[action.item, action.operator, action.changeAmt]);
          messageArray.push(msgElement);
        }
      } // END: for (var calcIdx in action.calcs) {

      if (!vital.overridden) {
        vital.bal = vital.bal + vital.takePerHr * action.numHrs;
      } else {
        vital.overridden = false;
      } // END: if (!vital.overridden) {
    } // END: for (var vitalLbl in vitals){

    if (messageArray.length > 2) {
      e("CHECK actions.json, possible more than 2 'message' elements");
      return false;
    }

    g.gameHr += action.numHrs;

    //l("OK, that's a valid action... so, let's %s", g.c.action.key);
    lwlnOutput(action.successMsg, messageArray[0], messageArray[1]);
    lwlnOutput();
    lwlnOutput();
    let msgArray = [action.successMsg, messageArray[0], messageArray[1]];
    g.msgQueue.push(msgArray);
  }, // END:  function doPassTime(action, inventory, vitals){

  /*  6. call to output.printStats1(g.gameHr,g.c); =========================> 
  //=========================================================================*/

  //  7. doRandomActOfGod() ==================================================>
  //  TODO: perform random events
  //     a. update values (e.g. inventory and/or vitals)
  //==========================================================================>
  doRandomActOfGod: function doRandomActOfGod(inventory, vitals) {
    var actsOfGod = [
      {event: 'had a Bear Attack', probability: 1, injury: 5},
      {event: 'had a Thunder Storm', probability: 1, injury: 10},
      {event: 'had a Wolf Attack', probability: 1, injury: 5},
      {event: 'Fallen Down badly', probability: 1, injury: 5},
      {event: 'Cut Yourself severely', probability: 1, injury: 5},
    ];
    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
    }
    var randomNumber = getRandomInt(0, actsOfGod.length);
    var actChoice = randomNumber;
    var actOfGod = actsOfGod[actChoice];
    var chance = getRandomInt(0, 100);
    if (chance <= actOfGod.probability) {
      var actualDamage = (actOfGod.injury * getRandomInt(0, 100)) / 100;
      var actualDamageInt = Math.round(actualDamage);
      vitals.injury.bal = vitals.injury.bal + actualDamageInt;
      lwlnOutput(
        ' *** Oh NO!  BAD LUCK!!! *** ==>  %s: injury: %i',
        actOfGod.event.toUpperCase(),
        actualDamageInt
      );
      lwlnOutput();
      playRAoGMedia(actOfGod.event);
      return true;
    } else return false;
  }, // END:  function doRandomActOfGod(inventory, vitals){

  //  8. isDead()  ===========================================================>
  //        check for death    ==>  TODO:  Game Over / Play Again
  //     a. verify that all VITALS are < 100
  //==========================================================================>
  isDead: function isDead(vitals) {
    var numDeaths = 0;

    for (var vitalLbl in vitals) {
      var vital = vitals[vitalLbl];

      if (vitalLbl != 'default') {
        // skip the "default" vital, that's just
        //  used for default values/storage
        if (vital.bal >= 100) {
          lwlnOutput(vital.dieMsg);
          numDeaths++;
        }
      }
    }
    if (numDeaths > 0) {
      g.isDead = true;
      return true; // we are returning TRUE for this function - isDead()
      //  - which will trigger a return of false to the main
      //  loop (see above:  "return (!isDead(vitals));"
    }
  }, // END:  function isDead(vitals){

  //  9. haveIBeenRescued() ==================================================>
  //    performs a random function check to see if you have been rescued
  //==========================================================================>
  haveIBeenRescued: function haveIBeenRescued() {
    var chancesOfRescue = [
      {startDay: 0, endDay: 3, probability: 0},
      {startDay: 4, endDay: 4, probability: 10},
      {startDay: 5, endDay: 5, probability: 20},
      {startDay: 6, endDay: 6, probability: 30},
      {startDay: 7, endDay: 7, probability: 40},
      {startDay: 8, endDay: 8, probability: 50},
      {startDay: 9, endDay: 9, probability: 60},
      {startDay: 10, endDay: 10, probability: 80},
      {startDay: 11, endDay: 11, probability: 100},
    ];
    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
    }
    var prob = getRandomInt(1, 100);
    for (var chanceIdx in chancesOfRescue) {
      var chance = chancesOfRescue[chanceIdx];
      var gameDay = Math.floor(g.gameHr / 24);

      if (gameDay >= chance.startDay && gameDay <= chance.endDay) {
        if (prob <= chance.probability) {
          lwlnOutput(
            "YOU'VE BEEN RESCUED.  CONGRATULATIONS!  YOU WON THE GAME!"
          );
          return true;
        }
      }
    }
    return false;
  }, // END:  function function haveIBeenRescued(){

  doSecretTestCalc: function doSecretTestCalc(userInput, inventory, vitals) {
    if (userInput.toLowerCase() == '/p') {
      output.printStats1(g.t.gameHr, g.c);
      return true;
    }
    if (userInput.toLowerCase() == '/p2') {
      output.printStats1(g.t.gameHr, g.c2);
      return true;
    }
    if (userInput.toLowerCase().startsWith('/a ')) {
      var words = userInput.toLowerCase().split(' ');
      var targetListAbbr = words[1].split('.')[0];
      var targetList = '';
      var targetItem = words[1].split('.')[1];
      if (targetListAbbr == 'i') targetList = 'inventory';
      if (targetListAbbr == 'v') targetList = 'vitals';
      var evalStr =
        'targetList.targetItem.bal = targetList.targetItem.bal ' + words[2];
      l(evalStr);
      // add to inventory or vital
      l(targetList);
      l(targetItem);
      //var tList = eval(targetList);
      //var tItem = eval(targetList + "." + targetItem);
      l(g.c[targetList]);
      var tList = g.c[targetList];
      var tItem = eval('tList.' + targetItem);

      l(tItem.bal);
      tItem.bal = tItem.bal + eval(words[2]);
      //eval(evalStr);
      l(tItem.bal);
      return true;
    } else {
      //l("invalid input to FUNCTION doSecretTestCalc(userInput)");
      return false;
    }
  },

  isInputAValidGameCommand: function isInputAValidGameCommand(
    userInput,
    inventory,
    vitals
  ) {
    switch (userInput.toLowerCase()) {
      case 'q': //TODO:  comment out for production
      case 'quit':
      case ('h', 'help'):
      case 'about':
      case 'list':
        break;
      default:
        //      case "~a", "~s":
        return core.doSecretTestCalc(
          userInput.toLowerCase(),
          inventory,
          vitals
        );
      //return false;
    }
    //l(" <= '%s' is a VALID Command =>\n", userInput);
    return true;
  },

  isInputAValidGameAction: function isInputAValidGameAction(
    userInput,
    actions
  ) {
    if (!actions) {
      e('**ERROR**:  actions is missing');
      return false;
    }

    var action = actions[userInput]; // e.g.  line = "light"
    if (!action) {
      //e("**ERROR**:  ACTION (actions[line]) is NOT present (empty or undefined)");
      l();
      l("Sorry, that's not a VALID ACTION, try something else");
      l();
      return false;
    }

    //if no errors, then let's print a 2 empty lines to give us some room on the screen
    //l(" <= '%s' is a VALID Action =>\n", userInput);
    return true;
  },

  isInputValid: function isInputValid(userInput, actions) {
    if (this.isInputAValidGameCommand(userInput)) return true;
    if (this.isInputAValidGameAction(userInput, actions)) return true;

    //  it's not valid in either of the ABOVE cases, so
    //  therefore, it's FALSE (not a valid input)
    return false;
  },

  doCommandWithResult: function doCommand(userInput) {
    // RETURN True will terminate execution -- see main
    //  "CALLER" function/loop
    switch (userInput.toLowerCase()) {
      case 'q': //TODO:  comment out for production
        return false;
        break;
      case 'quit':
        return false;
        break;
      case ('h', 'help'):
        l("Here's your help (e.g. help, quite, list, about");
        return true;
        break;
      case 'about':
        l('Game Goals:  About this game');
        return true;
        break;
      case 'list':
        //  print list of available game commands
        l('list of commands you can execute HERE');
        //  TODO:  core.printActions(actions);
        return true;
        break;
      default:
        return true;
    }
  },

  getSpecificCalcs: function getSpecificCalcs(list, type) {
    // prepare to store all the "inventory takes" in an array
    var specificCalcs = [];

    for (var calcIdx in g.c.action.calcs) {
      // array iteration instead of object iteration
      // let's look through each item in the "calcs" property/subObject
      // lets make it easier to refer to the actual indicidual "calc item"
      //  that we're looking at, at the moment
      var calc = g.c.action.calcs[calcIdx];

      // the name of the GameItem we want to CALC FROM as a string is
      //  stored in calc.list and calc.item combined
      if (!calc.list || !calc.item) {
        e('missing ITEM or LIST name');
      }

      if (calc.list == list && calc.type == type) {
        specificCalcs.push(calc);
      }
    }
    return specificCalcs;
  }, // END: getInvTakeCalcs(calcs)
}; //END Core Object

if (g.isBrowserOrNode === 'node') {
  module.exports = core;
}
g.core = core;
