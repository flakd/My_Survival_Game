//const fs = require('fs');

window.parseJSONs = {
  path: "./json/",
  Objects: {
    "inventory":{},
    "vitals":   {}, 
    "actions":  {}
  },
  loadJSONs: function loadJSONs(debug){
    //   FIGURE OUT THE BELOW for Typescript
    //var fileNames: String[]  = new Array(this.fileInfo.JSONfileNames);

    var names;   //declared but undefined at this point
    names = this.Objects;  //assigned 'Objects', and obj of game obj names    
    //names.forEach((name, idx)=> {    // an obj, not an array so this won't work
    for (var name in names) {
      // write each array item (indiv fileName) to console
      var fileName = name + ".json";
      var fullPath = this.path + fileName;
      if (debug) {
        l("%s: %s", name, fileName);
        l(fullPath);
      }
      var fsRead = fs.readFileSync(fullPath);
      names[name] = JSON.parse(fsRead);
    //});
    }
  }
};

parseJSONs.print = () => {
  console.log("I just executed parseJSONs.print()@parseJSONs.js");
}

//module.exports = parseJSONs;


