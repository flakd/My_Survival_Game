window.c.vitals = 
{
  "hunger":    {
    "key":          "hunger",
    "bal":          0,
    "vis":          "always",
    "doFailMsg":    "You're not hungry",
    "dieMsg":       "You've died from lack of food!!!",    
    "takePerHr":    1,
    "warningLimit": 80,
    "dangerLimit":  90,
    "warningMsg":   "You're really, really hungry thirsty, you might want to fish/eatfish, or hunt/eatmeat%s!",
    "dieMsg2":      " before you starve to death"
  },    
  "thirst":    {
    "key":          "thirst",
    "bal":          0,
    "vis":          "always",
    "doFailMsg":    "You're not thirsty at all",
    "dieMsg":       "You've died from lack of water!!!",    
    "takePerHr":    50,
    "warningLimit": 70,
    "dangerLimit":  85,
    "warningMsg":   "You're really, really thirsty, you might want to fetch/drink some water%s!",
    "dieMsg2":      " before you die of thirst"
  },    
  "cold":    {
    "key":          "cold",
    "bal":          0,
    "vis":          "always",
    "doFailMsg":    "You're not cold",
    "dieMsg":       "You've frozen to death!!!",
    "takePerHr":    5,
    "warningLimit": 70,
    "dangerLimit":  85,
    "warningMsg":   "You're really, really cold, you might want to light/feed the fire%s!",
    "dieMsg2":      " before you die of hypothermia"    
  },    
  "fatigue": {
    "key":          "fatigue",
    "bal":          0,
    "vis":          "always",
    "doFailMsg":    "You're completely rested",
    "doFailMsg_2":  "You don't feel tired",
    "dieMsg":       "You've died from exhaustion!!!",
    "takePerHr":  1,
    "warningLimit": 60,
    "dangerLimit":  80,
    "warningMsg":   "You're becoming exhausted, you won't be able to go on much longer without some rest%s!",
    "dieMsg2":      " before you die of exhaustion"    
  },    
  "injury": {
    "key":          "injury",
    "bal":          0,
    "vis":          "always",
    "doFailMsg":    "You're completely healed",
    "doFailMsg_2":  "You don't requiring healing",
    "dieMsg":       "You've died from all the injuries you've sustained!!!",
    "takePerHr":  0,
    "warningLimit": 60,
    "dangerLimit":  80,
    "warningMsg":   "You've sustained some significant injuries, you might want to rest and heal up a bit%s!",
    "dieMsg2":      " before you die from your injuries"    
  },      
  "default":     {
    "key":          "default",
    "bal":          0, 
    "vis":          "never",
    "noMeetReqs_msg": "Sorry, but you don't need any of that right now, you have %i of vital:%s",
    "dflt_dieMsg":    "Sorry, but you just died of too much %s",
    "dflt_dangerMsg": "You're %s amount/number is really high.  You're really in danger of dying from %s",    
    "noMeetReqs_condEvalStr": "balance < 0",
    "die_condEvalStr": "balance >= 100"
  }
}