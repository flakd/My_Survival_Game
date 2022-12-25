//const l = console.log;

let st = document.querySelector("#status-timeDayScore");
let sv = document.querySelector("#status-vitals");
let si = document.querySelector("#status-inventory");
let sa = document.querySelector("#status-actions");
let so = document.querySelector("#output");

lwrTDS = function(msg, target){ lwr(msg,st);}
lwlnTDS = function(msg, target){ lwln(msg,st);}

lwrVitals = function(msg, target){ lwr(msg,sv);}
lwlnVitals = function(msg, target){ lwln(msg,sv);}

lwrInventory = function(msg, target){ lwr(msg,si);}
lwlnInventory = function(msg, target){ lwln(msg,si);}

lwrActions = function(msg, target){ lwr(msg,sa);}
lwlnActions = function(msg, target){ lwln(msg,sa);}

lwrOutput = function(msg, target){ lwr(msg,so);}
lwlnOutput = function(msg, target){ lwln(msg,so);}


//let output = {
  window.output = {  
  printStats1: function printStats1(time, cObj, cols, prePadding, colWidth, verb){
    if (!cols) { cols = 7;}
    if (!prePadding) { prePadding = "";}
    if (!colWidth) { colWidth = 15;}
    var msg = "";
    if (verb) {
      msg+= "OK, you [" + verb + "].  Now, you've";
    } else {
      msg+= "You've";      
    }    
    msg+=" got the following:";
    var myDay = Math.floor(time / 24);
    var myTime = time%24
    var dayStr = myDay.toString().padStart(3,"0"); 
    var timeStr = myTime.toString().padStart(2,"0");
    lwrTDS("**   [ D A Y : %s ]   ****   [ T I M E: %s hrs ]", dayStr, timeStr );
    //lwlnVitals("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -");  

    this.printStats2("vitals", cObj.vitals, 5, "   ", 15, "| ");

    //lwlnVitals("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -");  

    if (this.printStats2("inventory", cObj.inventory) == 0) {
      lwlnInventory("No possessions at the moment!");
    }
    //lwlnInventory("=================================================================================");


    lwrActions();
    lwlnActions("~~~~~~~~~~~~~~~~~~~~~~~~~~~~  ACTIONS you can take:  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    var actions = cObj.actions;
    var numListItems=0;
    msg="  ";   //reset msg from above (it last says "You've got the following:")

    for (var actionLbl in actions) {
      numListItems++;
      var lMsg = "";
      lMsg+= actionLbl;
      lMsg = lMsg.padEnd(9," ");
      if (numListItems % 8 == 0 && numListItems != 0) {
        msg+=lMsg;
        //msg+="|\n";
        //msg+="|    ";
        msg+="\n";
        msg+="  ";
      } else {
        msg+=lMsg;
      }    

    }
    if (msg !="") lwlnActions(msg);
    lwlnActions("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    //l("=================================================================================");
    lwlnActions("\n\n");
    return numListItems;
  },

  printStats2: function printStats2(vitalsOrInventory, list, cols, prePadding, colWidth, firstChar){
    if (!cols) { cols = 7;}
    if (!prePadding) { prePadding = "";}    
    if (!colWidth) { colWidth = 15;}
    if (!firstChar) { firstChar = "";}
    var numListItems=0;

    //var msg ="|  ";
    var msg ="";
    msg+=firstChar;
    msg+="  ";
    var val, amt, visible;
    
    if (!list) {l("**ERROR**:  list is missing"); return;}
    for (key in list){
      val = list[key];
      if (!val) {l("**ERROR**:  val is missing"); return;}
      //if (key.slice(4) == "2") {
        //console.log(key);
        amt = val.bal;
        visible = val.vis;
      //} else {
      //  amt = val[0];
      //  visible = val[1];
      //  //if (visible!=null && amt > 0 ){
      //}
      if (visible == "never") continue;
      if (visible == "GTzero" && amt < 1) continue;    
      if (  (visible == "GTzero" && amt > 0)
        ||  (visible == "always")
      ){
        numListItems++;
        var lMsg = "";
        //l("%i %s %s", amt, visible, key);
        lMsg+= prePadding + key + ":" + amt;
        lMsg = lMsg.padEnd(colWidth," ");
        if (numListItems % cols == 0 && numListItems != 0) {
          msg+=lMsg;
          msg+=" |";
        } else {
          msg+=lMsg;
        }
        
      }
    }
    if (msg !="") {
      if (vitalsOrInventory==="vitals"){
        lwlnVitals(msg);
      } else if (vitalsOrInventory==="inventory"){
        lwrInventory(msg);
      }
    }        
    return numListItems;
  },

  printTitleBanner: function printTitleBanner(time, c){
    //console.log(sf);
    lwlnOutput("\n\n\n");
    lwlnOutput("Welcome to the game!");
    lwlnOutput("\n\n");
    this.printStats1(time, c);  
  }
}


//module.exports = output;