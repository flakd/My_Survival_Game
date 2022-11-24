const l = console.log;

let output = {
  printStats1: function printStats1(time, c, cols, prePadding, colWidth, verb){
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
    l("**  TIME: %s  ********  %s", ( ('0' + (time%24)).slice(-2) + ':00 hrs' ), msg  );
    //l("=================================================================================");
    l("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -");  

    this.printStats2(c.vitals, 4, "   ", 19, "|");

    l("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -");  

    if (this.printStats2(c.inventory) == 0) {
      l("No possessions at the moment!");
    }
    l("=================================================================================");


    //l("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    l();
    l("~~~~~~~~~~~~~~~~~~~~~~~~~~~~  ACTIONS you can take:  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    //l("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    var actions = c.actions;
    var numListItems=0;
    //msg="|    ";   //reset msg from above (it last says "You've got the following:")
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
    if (msg !="") l(msg);
    l("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    //l("=================================================================================");
    l("\n\n");
    return numListItems;
  },

  printStats2: function printStats2(list, cols, prePadding, colWidth, firstChar){
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
          //l(msg);
        } else {
          msg+=lMsg;
        }
        
      }
    }
    if (msg !="") l(msg);
    return numListItems;
  },

  printTitleBanner: function printTitleBanner(time, c){
    l("\n\n\n");
    l("Welcome to the game!");
    l("\n\n");
    this.printStats1(time, c);  
  }
}


module.exports = output;