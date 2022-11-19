const fs = require('fs');
const l = console.log;

let parseJSONs = {
  path: "./json/",
  Objects: {
    "inventory": {}//,
    //"vitals": {}, 
    //"actions": {}
  },
  loadJSONs: function loadJSONs(){
    //   FIGURE OUT THE BELOW
    //fileNames = new Array<String>(this.fileInfo.JSONfileNames);

    var names, fileNames;   //undefined
    names = this.Objects;  //assigned 'Objects', and obj of game obj names    
    //names.forEach((name, idx)=> {    
    for (var name in names) {
      // write each array item (indiv fileName) to console
      var fileName = name + ".json";
      var fullPath = this.path + fileName;
      l("%s: %s", name, fileName);
      l(fullPath);
      var fsRead = fs.readFileSync(fullPath);
      names[name] = JSON.parse(fsRead);
    //});
    }
  }
};

parseJSONs.print = () => {
  console.log("I just executed parseJSONs.print()@parseJSONs.js");
}

module.exports = parseJSONs;


