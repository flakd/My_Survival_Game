const setupPlayerMovement = () => {
  g.p = {};
  const startXIdx = 5; // out of 10 squares wide
  const startYIdx = 6; // out of 10 squares high
  const playerLabel = `player_${startYIdx}${startXIdx}`;
  g.p.player = document.getElementById(playerLabel);
  if (!player) {
    console.log(`ERROR: Can't find **${playerLabel}**`);
    //breakpoint;
  } else {
    g.p.player.style.display = 'block';
  }
  g.p.xInt = startXIdx;
  g.p.yInt = startYIdx;
};
function setupPlayerMovement_old() {
  // this doesn't seem to get me a reference to the first cell/square
  //        WHY????
  var startXname = (g.startX + 1).toString();
  var startYname = (g.startY + 1).toString();
  var startName = startXname + ',' + startYname;
  //lwf(startName);

  //START
  // set currentCellNum to start Cell Num - which
  //  we set when  we filled the very first cell
  //////let currentCellNum = startCellNum;

  // get this number as a string, so we can use it to retrieve the element
  //  this anon function self-call should store the value of the
  //  function as a var to make it easier to use
  /* let currCellIdStrByNum = (function(){
    return currentCellNum.toString();
  })(); */

  // similar concept to the above.  now getting the actual document element -
  //  the cell itself (the div)
  let currCellElByIdStr = (function () {
    //return document.getElementById(currCellIdStrByNum);
    console.log(g.startCellNumStr);
    return document.getElementById('player_' + g.startCellNumStr).parentElement;
  })();

  let currentCell = currCellElByIdStr;
  //let idStr = currCellElByIdStr.getAttribute("id");
  //lwf("idStr: " + idStr);
  //lwln();

  // the player is the SPAN element, *inside* the DIV
  //let player = currCellElByIdStr.firstChild;
  g.player = currentCell.firstChild;
  g.player.setAttribute('style', 'display:inline');

  let nameStr = currentCell.getAttribute('name');
  lwf('nameStr: ' + nameStr);
  lwln();

  let XYStrings = [];
  XYStrings = nameStr.split(',');
  g.pos = {};
  g.pos.xStr = XYStrings[0];
  g.pos.yStr = XYStrings[1];
  g.pos.xInt = parseInt(g.pos.xStr);
  g.pos.yInt = parseInt(g.pos.yStr);
} // END: function handleMovement()
