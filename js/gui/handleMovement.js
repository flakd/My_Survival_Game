function handleMovement(){
  // this doesn't seem to get me a reference to the first cell/square
  //        WHY????
      var startXname = (startX + 1).toString();
      var startYname = (startY + 1).toString();
      var startName = startXname + "," + startYname;
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
  let currCellElByIdStr = (function(){
    //return document.getElementById(currCellIdStrByNum);
    console.log(startCellNumStr);
    return document.getElementById("player_"+startCellNumStr).parentElement;
  })();

  let currentCell = currCellElByIdStr; 
  //let idStr = currCellElByIdStr.getAttribute("id");
  //lwf("idStr: " + idStr);
  //lwln();

  // the player is the SPAN element, *inside* the DIV
  //let player = currCellElByIdStr.firstChild;
  let player = currentCell.firstChild;
  player.setAttribute("style","display:inline");  

  let nameStr = currentCell.getAttribute("name");
  lwf("nameStr: " + nameStr);
  lwln();

  let XYStrings = [];
  XYStrings = nameStr.split(","); 
  let xPosStr = XYStrings[0];
  let yPosStr = XYStrings[1];
  let xPosInt = parseInt(xPosStr);
  let yPosInt = parseInt(yPosStr);  
  
  document.addEventListener("keydown", (event) => {

    //player.setAttribute("style","display:inline");
    
    //lw(event.keyCode);
    //lw(event.code);
    //lw(event.key);
    lwln(event.key);
    lwln("xPosInt: " + xPosInt);
    lwln("yPosInt: " + yPosInt);

    let isValidMove = false;
    let nextCell;
    let nextPlayerVisible;
    let nextCellName;    
    let playerId;
    switch (event.key){      
      case "Escape":
        console.log("Esc");
        handle_btnCloseRAoGImgModal_click();
      case "ArrowUp":
        event.preventDefault()
        if (yPosInt-1 < 0) return;
        if (map[yPosInt-1][xPosInt] === 0) return;
        yPosInt--;        
        isValidMove = true;
        break;
      case "ArrowDown":       
        event.preventDefault() 
        if (yPosInt+1 > (MAP_HEIGHT - 1)) return;
        if (map[yPosInt + 1][xPosInt] === 0) return;
        yPosInt++;
        isValidMove = true;
        break;
      case "ArrowLeft":
        event.preventDefault()
        if (xPosInt-1 < 0) return;
        if (map[yPosInt][xPosInt-1] === 0) return;
        xPosInt--;
        isValidMove = true;
        break;
      case "ArrowRight":
        event.preventDefault()
        //if (xPosInt +1 < 0) return;
        if (xPosInt+1 > (MAP_WIDTH - 1)) return;
        if (map[yPosInt][xPosInt+1] === 0) return;
        xPosInt++;
        isValidMove = true;
        break;
      default:
        console.log("keydown: " + event.key);
      //  return;
    }    
    if (isValidMove){
      nextCellName = xPosInt + "," + yPosInt;    
      playerId = "player_" + yPosInt + xPosInt;  
      lwln(nextCellName);      
      lwln(playerId);
      nextPlayerVisible = document.getElementById(playerId);        
      nextPlayerVisible.setAttribute("style","display:inline");
      player.setAttribute("style","display:none");
      player = nextPlayerVisible;
    }
    return;
  });

} // END: function handleMovement()