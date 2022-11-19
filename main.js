const { exit } = require('process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});
const l=console.log;

var vis = {
  "never": 0,
  "always": 1,
  "GTzero": 2
}
var inventory = {
  "wood":     [0, vis.GTzero],  //"bundles of"
  "trees":    [9999, vis.never],
  "fire":     [0, vis.GTzero],  //"hours of"
  "club":     [0, vis.GTzero],  //"weapon of"
  "bow":      [0, vis.GTzero],  //"weapon of"  
  "arrows":   [0, vis.GTzero],
  "worms":    [0, vis.GTzero],
  "fish":     [0, vis.GTzero],  //"heads of" 
  "H20":      [0, vis.GTzero],  //"cups of"
  "none":     [0, vis.never]
};
var i=inventory;

var vitals = {
  "hunger":   [10, vis.always],
  "thirst":   [10, vis.always],
  "warmth":   [100, vis.always],
  "security": [10, vis.always]
};
var time = 0;   //12 midnight
var timeInterval = 1;  //1 hour

var actions = {
  //"chop tree":  {
  "chop":  {
    "from": ["trees", "-", "1"],
    "to":   ["wood", "+", "1"],
    "verb": "chopped wood (+1)"
  },
  "light": {
    "from": ["wood", "-", "1"],
    "to":   ["fire", "+", "3"],
    "verb": "lit a fire (+3)"    
  },
  "feed": {
    "from": ["wood", "-", "1"],
    "to":   ["fire", "+", "5"],
    "verb": "fed the fire (+5)"
  },
  "make club":  {
    "from": ["wood", "-", "3"],
    "to":   ["club", "=", "1"],
    "verb": "made a club (+1)"
  },    
  "make bow":  {
    "from": ["wood", "-", "10"],
    "to":   ["bow", "=", "1"],
    "verb": "made a bow (+1)"
  },    
  "make arrows":  {
    "from": ["wood", "-", "2"],
    "to":   ["arrows", "=", "4"],
    "verb": "made arrows (+4)"    
  },    
  "douse":  {
    "from": ["none",  "=", "0"],
    "to":   ["fire", "=", "0"],
    "verb": "put out the fire"
  },
  "fish": {
    "from": ["worms",  "-", "1"],
    "to":   ["fish",  "+", "1"],
    "verb": "caught a fish (+1)"
  },
  "dig": {
    "from": ["none",  "=", "0"],
    "to":   ["worms",  "+", "1"],
    "verb": "found a worm (+1)"
  },
  "fetch": {
    "from": ["none",  "=", "0"],
    "to":   ["H20",  "+", "1"],
    "verb": "fetched some water (+1)"
  }  
};

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
    var fromGameItem = "i." + action.from[0] + "[0]";
    var fromOperator = action.from[1];
    var fromAmount = action.from[2];

    var toGameItem = "i." + action.to[0] + "[0]";
    var toOperator = action.to[1];
    var toAmount = action.to[2];  

    var fromEvalStrCond = fromGameItem + fromOperator + fromAmount;
    if (eval(fromEvalStrCond) < 0) {
      console.log("Sorry, you only have %i %s.  But, you need to have %i %s to do that.", i.wood, action.from[0], action.from[2], action.from[0] )
      return;
    } else {
      var fromEvalStrDo = fromGameItem +  ( (fromOperator != "=") ? 
                                    ("=" + fromGameItem + fromOperator + fromAmount) :
                                    (fromOperator + fromAmount)
      );   
      var toEvalStrDo = toGameItem +  ( (toOperator != "=") ? 
                                    ("=" + toGameItem + toOperator + toAmount) :
                                    (toOperator + toAmount)
      );          
      eval(fromEvalStrDo);
      eval(toEvalStrDo);
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

    if (visible == vis.never) continue;
    if (visible == vis.GTzero && amt < 1) continue;    
    if (  (visible == vis.GTzero && amt > 0)
      ||  (visible == vis.always)
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