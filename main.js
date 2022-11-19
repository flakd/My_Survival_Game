const { exit } = require('process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});
const l=console.log;

var lvl = 0;

var inventory = {
  "wood":     [0, "logs of"],
  "trees":    [9999, null],
  "fire":     [0, "hours of"],
  "club":     [0, "weapon of"],
  "livefish": [20, null],
  "fish":     [0, "heads of"], 
  "H20":      [0, "cups of"],
  "hunger":   [0, null],
  "thirst":   [0, null],
  "none":     [0, null]
};
var i=inventory;

var verbOK = false;

var actions = {
  "chop tree":  {
    "from": ["trees", "-", "1"],
    "to":   ["wood", "+", "1"]
  },
  "light fire": {
    "from": ["wood", "-", "1"],
    "to":   ["fire", "+", "3"]
  },
  "add wood": {
    "from": ["wood", "-", "1"],
    "to":   ["fire", "+", "5"]    
  },
  "make club":  {
    "from": ["wood", "-", "3"],
    "to":   ["club", "=", "1"]   
  },    
  "quelch fire":  {
    "from": ["H20",  "=", "0"],
    "to":   ["fire", "=", "0"]   
  },
  "fish": {
    "from": ["livefish",  "-", "1"],
    "to":   ["deadfish",  "+", "1"]   
  }
};

l();
printInventory();
rl.on('line', (line) => {
  if (line=="c") {
    //break;
    console.log("action canceled");
    lvl=0;
    return;
  }
  //if (!actions[line] || action[line].length==0) return;
  var action = actions[line];
  if (!action) return;
  
  var fromGameItem = "i." + action.from[0];
  var fromOperator = action.from[1];
  var fromAmount = action.from[2];

  var toGameItem = "i." + action.to[0];
  var toOperator = action.to[1];
  var toAmount = action.to[2];  

  var fromEvalStrCond = fromGameItem + fromOperator + fromAmount;
  if (eval(fromEvalStrCond) < 0) {
    console.log("Sorry, you only have %i wood.  But, you need to have %i wood to do that.", i.wood, action.from[2] )
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
  //console.log("myline=%s:  verbOK is %s", line, verbOK);
  //verbOK = false;
  printInventory();
  if (line == "CCC") {
    console.log("CCC is true");
    rl.close();
  }  
});

rl.once('close', () => {
  console.log("Thank you for playing!")
    // end of input
 });

function printInventory(){
  l("What you have left:");
  l("--------------------");
  for (key in inventory){
    var val = inventory[key];
    var amt = val[0];
    var visible = val[1];
    if (visible!=null){
      l("%i %s %s", amt, visible, key);
    }
  }
  l("===================================");
  l();
}