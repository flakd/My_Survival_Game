window.c = {};
window.c.actions = 
{
  "light": {
    "key":        "light",
    "gerund":     "lighting a fire",
    "numHrs":     2,
    "successMsg": "You lit a fire (%s).  Ahhhh, you feel warmer, that's nice! (%s)",
    "calcs":  [
      { "type":   "give",   "list": "inventory",  "item": "fire",     "operator":   "+",  "changeAmt":  3,  "message":true   },
      { "type":   "take",   "list": "inventory",  "item": "wood",     "operator":   "-",  "changeAmt":  2   },
      { "type":   "give",   "list": "vitals",     "item": "cold",     "operator":   "-",  "changeAmt":  10,   "override": true,  "message":true   },
      { "type":   "take",   "list": "vitals",     "item": "fatigue",  "operator":   "+",  "changeAmt":  5,    "override": true   }
    ],
    "doActMsg_1":  "let's light a/the fire",
    "doActMsg_2":  "let's try lighting a/the fire"
  },
 
  "chop": {
    "key":        "chop",
    "gerund":     "chopping some wood",
    "numHrs":     1,
    "successMsg": "You chopped wood (%s). You feel a bit more tired (%s)",    
    "calcs":  [
      { "type":   "give",   "list": "inventory",  "item": "wood",     "operator":   "+",  "changeAmt":  5,  "message":true   },
      { "type":   "take",   "list": "inventory",  "item": "trees",    "operator":   "-",  "changeAmt":  1   },
      { "type":   "take",   "list": "vitals",     "item": "fatigue",  "operator":   "+",  "changeAmt":  15,   "override": true,  "message":true   }
    ],
    "doActMsg_1":  "let's try chopping some wood"
  },

  "braid": {
    "key":        "braid",
    "gerund":     "braiding some cordage",
    "numHrs":     3,
    "successMsg": "You made cordage (%s). That was pretty tiring (%s)",
    "calcs":  [
      { "type":   "give",   "list": "inventory",  "item": "cord",     "operator":   "+",  "changeAmt":  1,  "message":true   },
      { "type":   "take",   "list": "inventory",  "item": "trees",    "operator":   "-",  "changeAmt":  1   },
      { "type":   "take",   "list": "vitals",     "item": "fatigue",  "operator":   "+",  "changeAmt":  20,   "override": true,  "message":true   }
    ]
  },

  "make": {
    "key":        "make",
    "gerund":     "making some arrows",
    "numHrs":     4,
    "successMsg": "You made arrows (%s). Wow, making arrows is harder than you thought (%s)",
    "calcs":  [
      { "type":   "give",   "list": "inventory",  "item": "arrows",   "operator":   "+",  "changeAmt":  4,  "message":true   },
      { "type":   "take",   "list": "inventory",  "item": "wood",     "operator":   "-",  "changeAmt":  2   },
      { "type":   "take",   "list": "vitals",     "item": "fatigue",  "operator":   "+",  "changeAmt":  7,   "override": true,  "message":true   }
    ]
  },  

  "forge": {
    "key":        "forge",
    "gerund":     "forging a hammer",
    "numHrs":     3,
    "successMsg": "You forged yourseld a hammer for building (%s), (%s)",
    "calcs":  [
      { "type":   "give",   "list": "inventory",  "item": "hammer",   "operator":   "+",  "changeAmt":  1,  "message":true   },
      { "type":   "take",   "list": "inventory",  "item": "wood",     "operator":   "-",  "changeAmt":  2   },
      { "type":   "take",   "list": "inventory",  "item": "stone",    "operator":   "-",  "changeAmt":  1   },
      { "type":   "take",   "list": "vitals",     "item": "fatigue",  "operator":   "+",  "changeAmt":  7,   "override": true,  "message":true   }
    ]
  },  

  "find": {
    "key":        "find",
    "gerund":     "trying to find a stone",
    "numHrs":     1,
    "successMsg": "You found yourself a stone (%s)... what can you use this for? (%s)",
    "calcs":  [
      { "type":   "give",   "list": "inventory",  "item": "stone",    "operator":   "+",  "changeAmt":  1,  "message":true   },
      { "type":   "take",   "list": "vitals",     "item": "fatigue",  "operator":   "+",  "changeAmt":  7,   "override": true,  "message":true   }
    ]
  },  

  "fashion":  {
    "key":        "fashion",
    "gerund":     "fashioning",
    "numHrs":     5,
    "successMsg": "You fashioned a bow (%s), but that was really tiring (%s)",
    "calcs":  [
      { "type":   "give",   "list": "inventory",  "item": "bows",     "operator":   "+",  "changeAmt":  1,  "message":true   },
      { "type":   "take",   "list": "inventory",  "item": "wood",     "operator":   "-",  "changeAmt":  2   },
      { "type":   "take",   "list": "inventory",  "item": "cord",     "operator":   "-",  "changeAmt":  1   },
      { "type":   "take",   "list": "vitals",     "item": "fatigue",  "operator":   "+",  "changeAmt":  10,   "override": true,  "message":true   }
    ]
  },

  "sleep": {
    "key":        "sleep",
    "gerund":     "sleeping",
    "numHrs":     8,
    "successMsg": "Ahhhh, you feel rested (%s) and healed (%s).  But, it's much later in the day",
    "calcs":  [
      { "type":   "give",   "list": "vitals",     "item": "fatigue",  "operator":   "-",  "changeAmt":  25, "override": true,  "message":true   },
      { "type":   "give",   "list": "vitals",     "item": "injury",   "operator":   "-",  "changeAmt":  10, "override": true,  "message":true   }
    ]
  },    

  "hunt": {
    "key":        "hunt",
    "gerund":     "hunting",
    "numHrs":   6,
    "successMsg": "You caught/killed a rabbit (%s). You feel tired (%s), but accomplished - you're a warrior!", 
    "calcs":  [
      { "type":   "give",   "list": "inventory",  "item": "bows",     "operator":   "+",  "changeAmt":  1   },
      { "type":   "give",   "list": "inventory",  "item": "meat",     "operator":   "+",  "changeAmt":  1,  "message":true   },
      { "type":   "give",   "list": "vitals",     "item": "hunger",   "operator":   "-",  "changeAmt":  6,  "override": true   },
      { "type":   "take",   "list": "inventory",  "item": "bows",     "operator":   "-",  "changeAmt":  1   },
      { "type":   "take",   "list": "inventory",  "item": "arrows",   "operator":   "-",  "changeAmt":  3   },
      { "type":   "take",   "list": "vitals",     "item": "fatigue",  "operator":   "+",  "changeAmt":  10, "override": true,   "message":true   }
    ]
  },

  "build": {
    "key":        "build",
    "gerund":     "building",
    "numHrs":     8,
    "successMsg": "You built a small hut (%s) - a major accomplishment.  You're exhausted... (%s)", 
    "calcs":  [
      { "type":   "give",   "list": "inventory",  "item": "hut",      "operator":   "+",  "changeAmt":  1,  "message":true   },
      { "type":   "give",   "list": "inventory",  "item": "hammer",   "operator":   "+",  "changeAmt":  1   },
      { "type":   "give",   "list": "inventory",  "item": "hammer",   "operator":   "-",  "changeAmt":  1   },
      { "type":   "take",   "list": "inventory",  "item": "meat",     "operator":   "-",  "changeAmt":  1   },
      { "type":   "take",   "list": "inventory",  "item": "wood",     "operator":   "-",  "changeAmt":  10   },
      { "type":   "take",   "list": "inventory",  "item": "cord",     "operator":   "-",  "changeAmt":  2   },
      { "type":   "take",   "list": "vitals",     "item": "fatigue",  "operator":   "+",  "changeAmt":  75,   "override": true,  "message":true   }
    ]
  },

  "fish": {
    "key":        "fish",
    "gerund":     "fishing",
    "numHrs":     1,    
    "successMsg": "just caught a fish (%s) - luckily not too tiring (%s)", 
    "calcs":  [
      { "type":   "give",   "list": "inventory",  "item": "fish",     "operator":   "+",  "changeAmt":  1,  "message":true   },
      { "type":   "take",   "list": "inventory",  "item": "worms",    "operator":   "-",  "changeAmt":  1   },
      { "type":   "take",   "list": "vitals",     "item": "fatigue",  "operator":   "+",  "changeAmt":  1,   "override": true,  "message":true   }
    ]
  },
  
  "dig": {
    "key":        "dig",
    "gerund":     "digging",
    "numHrs":     1,    
    "successMsg":  "found a worm (%s), That wasn't too tiring (%s)", 
    "calcs":  [
      { "type":   "give",   "list": "inventory",  "item": "worms",    "operator":   "+",  "changeAmt":  1,  "message":true   },
      { "type":   "take",   "list": "vitals",     "item": "fatigue",  "operator":   "+",  "changeAmt":  1,   "override": true,  "message":true   }
    ]
  },

  "fetch": {
    "key":        "fetch",
    "gerund":     "fetching",
    "numHrs":     1,    
    "successMsg": "fetched some water (%s). That took some effort (%s)",
    "calcs":  [
      { "type":   "give",   "list": "inventory",  "item": "H20",      "operator":   "+",  "changeAmt":  5,  "message":true   },
      { "type":   "take",   "list": "vitals",     "item": "fatigue",  "operator":   "+",  "changeAmt":  1,   "override": true,  "message":true   }
    ]
  }, 
  
  "drink": {
    "key":        "drink",
    "gerund":     "drinking",
    "numHrs":     1,    
    "successMsg": "have a little less water for yourself (%s). Ahh... that water was refreshing! (%s)",
    "calcs":  [
      { "type":   "take",   "list": "inventory",  "item": "H20",      "operator":   "-",  "changeAmt":  1,  "message":true   },
      { "type":   "give",   "list": "vitals",     "item": "thirst",   "operator":   "-",  "changeAmt":  20,   "override": true,  "message":true   },
      { "type":   "give",   "list": "vitals",     "item": "fatigue",  "operator":   "-",  "changeAmt":  1,   "override": true   }
    ]
  },

  "eatfish": {
    "key":        "eatfish",
    "gerund":     "eating fish",
    "numHrs":     1,    
    "successMsg": "Ah, you're tummy is fuller (%s), (%s)",
    "calcs":  [
      { "type":   "take",   "list": "inventory",  "item": "fish",     "operator":   "-",  "changeAmt":  1,  "message":true   },
      { "type":   "give",   "list": "vitals",     "item": "hunger",   "operator":   "-",  "changeAmt":  15,   "override": true,  "message":true   },
      { "type":   "give",   "list": "vitals",     "item": "fatigue",  "operator":   "-",  "changeAmt":  3,    "override": true   }
    ]
  },

  "eatmeat": {
    "key":        "eatmeat",
    "gerund":     "eating meat",
    "numHrs":     1,    
    "successMsg": "Ah, you're tummy is fuller (%s), (%s)",
    "calcs":  [
      { "type":   "take",   "list": "inventory",  "item": "meat",     "operator":   "-",  "changeAmt":  1,  "message":true   },
      { "type":   "give",   "list": "vitals",     "item": "hunger",   "operator":   "-",  "changeAmt":  35,   "override": true,  "message":true   },
      { "type":   "give",   "list": "vitals",     "item": "fatigue",  "operator":   "-",  "changeAmt":  5,    "override": true   }
    ]
  },

  "skin": {
    "key":        "skin",
    "gerund":     "skinning a game animal",
    "numHrs":     2,    
    "successMsg": "You skinned this small animal (%s), but it's no longer edible (%s)!",
    "calcs":  [
      { "type":   "take",   "list": "inventory",  "item": "meat",     "operator":   "-",  "changeAmt":  1,  "message":true   },
      { "type":   "give",   "list": "vitals",     "item": "fatigue",  "operator":   "-",  "changeAmt":  5,    "override": true,  "message":true   }
    ]
  },

  "cobble": {
    "key":        "cobble",
    "gerund":     "cobbling a pair of shoes",
    "numHrs":     10,    
    "successMsg": "Ah, look at these shoes... you feel very proud of your work! (%s), (%s)",
    "calcs":  [
      { "type":   "take",   "list": "inventory",  "item": "meat",     "operator":   "-",  "changeAmt":  1   },
      { "type":   "give",   "list": "vitals",     "item": "hunger",   "operator":   "-",  "changeAmt":  35,   "override": true   },
      { "type":   "give",   "list": "vitals",     "item": "fatigue",  "operator":   "-",  "changeAmt":  5,    "override": true   }
    ]
  },

  "tailor": {
    "key":        "tailor",
    "gerund":     "tailoring",
    "numHrs":     10,    
    "successMsg": "Wow... you tailored some clothes (%s)! These will help keep you warm (%s)",
    "calcs":  [
      { "type":   "take",   "list": "inventory",  "item": "meat",     "operator":   "-",  "changeAmt":  1   },
      { "type":   "give",   "list": "vitals",     "item": "hunger",   "operator":   "-",  "changeAmt":  35,   "override": true   },
      { "type":   "give",   "list": "vitals",     "item": "fatigue",  "operator":   "-",  "changeAmt":  5,    "override": true   }
    ]
  }

}
