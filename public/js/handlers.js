function setAllEventListeners() {
  $(document).ready(handleDocumentReady_setupInitialAudio);
  $(document).ready(handleDocumentReady_setupInitialModal);
  document.addEventListener('keydown', handleKeyDown_Enter);
  document.addEventListener('keydown', handleKeyDown_Esc);
  document.addEventListener('keydown', handleKeyDown_ArrowKeys);

  $(document).ready(function () {
    g.myModal = document.getElementsByName('flakModal')[0];

    g.myModal.addEventListener('hidden.bs.modal', handleMyModalClose_BeginGame);
    g.myModal.addEventListener('shown.bs.modal', () => {
      myInput.focus();
    });
  });
  document.addEventListener('keydown', handleKeyDown_ArrowKeys);
  $(document).ready(function () {
    let closeButton = document.getElementById('btnClose_RAoG-image-modal');
    closeButton.addEventListener('click', handleBtnCloseRAoGImgModal_click);
  });
}

function handleKeyDown_Esc(event) {
  //lwln(event.key);
  switch (event.key) {
    case 'Escape':
      console.log('Esc');
      handleBtnCloseRAoGImgModal_click();
    default:
      console.log('handleKeyDown_Esc: keydown: ' + event.key);
    //  return;
  }
  return;
}

function handleKeyDown_ArrowKeys(event) {
  if (g.p.isMoving) return;

  lwln(event.key);
  lwln('g.p.xInt: ' + g.p.xInt);
  lwln('g.p.yInt: ' + g.p.yInt);

  g.p.lastYInt = g.p.yInt;
  g.p.lastXInt = g.p.xInt;
  g.p.dirLegend = {
    up: {
      key: 'up',
      char1: 'ArrowUp',
      char2: 'w',
      move: -1,
      axis: 'y',
      CSS: 'top',
    },
    left: {
      key: 'left',
      char1: 'ArrowLeft',
      char2: 'a',
      move: -1,
      axis: 'x',
      CSS: 'left',
    },
    down: {
      key: 'down',
      char1: 'ArrowDown',
      char2: 's',
      move: 1,
      axis: 'y',
      CSS: 'top',
    },
    right: {
      key: 'right',
      char1: 'ArrowRight',
      char2: 'd',
      move: 1,
      axis: 'x',
      CSS: 'left',
    },
  };

  let isValidMove = false;
  let nextCellName;
  //let playerId = 'player_65_b';
  let playerIdAnimStr = 'player_anim';
  let playerIdStaticStr = 'player_static';
  g.p.playerAnim = document.getElementById(playerIdAnimStr);
  g.p.playerStatic = document.getElementById(playerIdStaticStr);
  if (!g.p.playerAnim) console.log("can't find player animated gif");
  if (!g.p.playerStatic) console.log("can't find player static gif");
  switch (event.key) {
    //case 'ArrowUp':
    case 'w':
      g.p.dir = 'up';
      event.preventDefault();
      if (g.p.yInt - 1 < 0) return;
      if (g.map[g.p.yInt - 1][g.p.xInt] === 0) return;
      g.p.yInt = g.p.yInt - move;
      isValidMove = true;
      axis = 'top';
      g.p.direction = 'up';
      g.p.directionCSS_Y = null;
      squaresMoved = -1;
      break;
    //case 'ArrowDown':
    case 's':
      event.preventDefault();
      if (g.p.yInt + 1 > g.MAP_HEIGHT - 1) return;
      if (g.map[g.p.yInt + 1][g.p.xInt] === 0) return;
      g.p.yInt++;
      isValidMove = true;
      axis = 'top';
      g.p.direction = 'down';
      g.p.directionCSS_Y = null;
      squaresMoved = 1;
      break;
    //case 'ArrowLeft':
    case 'a':
      event.preventDefault();
      if (g.p.xInt - 1 < 0) return;
      if (g.map[g.p.yInt][g.p.xInt - 1] === 0) return;
      g.p.xInt--;
      isValidMove = true;
      axis = 'left';
      g.p.direction = 'left';
      g.p.directionCSS_X = 'scaleX(-1)';

      squaresMoved = -1;
      g.p.playerAnim.style.transform = g.p.directionCSS_X;
      g.p.playerAnim.style.webkitTransform = g.p.directionCSS_X;
      g.p.playerStatic.style.transform = g.p.directionCSS_X;
      g.p.playerStatic.style.webkitTransform = g.p.directionCSS_X;
      break;
    //case 'ArrowRight':
    case 'd':
      event.preventDefault();
      //if (g.p.xInt +1 < 0) return;
      if (g.p.xInt + 1 > g.MAP_WIDTH - 1) return;
      if (g.map[g.p.yInt][g.p.xInt + 1] === 0) return;
      g.p.xInt++;
      isValidMove = true;
      axis = 'left';
      g.p.direction = 'right';
      g.p.directionCSS_X = 'scaleX(1)';

      squaresMoved = 1;
      g.p.playerAnim.style.transform = g.p.directionCSS_X;
      g.p.playerAnim.style.webkitTransform = g.p.directionCSS_X;
      g.p.playerStatic.style.transform = g.p.directionCSS_X;
      g.p.playerStatic.style.webkitTransform = g.p.directionCSS_X;
      break;
    default:
    //  return;
  }
  console.log('wtf');
  //g.p.player = document.getElementById(playerId);

  if (isValidMove) {
    let lastTop = g.p.lastYInt * 40 + 108;
    let lastLeft = g.p.lastXInt * 40 + 70;
    g.p.newTop = lastTop;
    g.p.newLeft = lastLeft;

    g.p.playerAnim.style.display = 'block';
    g.p.playerStatic.style.display = 'none';
    g.p.intervalID = setInterval(function () {
      if (axis === 'top') {
        g.p.newTop = g.p.newTop + squaresMoved;
      } else if (axis === 'left') {
        g.p.newLeft = g.p.newLeft + squaresMoved;
      }

      let topStr = `${g.p.newTop}px`;
      let leftStr = `${g.p.newLeft}px`;

      g.p.playerAnim.style.top = topStr;
      g.p.playerStatic.style.top = topStr;
      g.p.playerAnim.style.left = leftStr;
      g.p.playerStatic.style.left = leftStr;

      g.p.isMoving = true;
    }, 25);
    g.p.timeoutID = setTimeout(() => {
      g.p.isMoving = false;
      g.p.playerAnim.style.display = 'none';
      g.p.playerStatic.style.display = 'block';
      clearInterval(g.p.intervalID);
    }, 1000);

    nextCellName = g.p.xInt + ',' + g.p.yInt;
    console.log(nextCellName);
    lwln(nextCellName);
  }
  var outputDiv = document.getElementById('log');
  //outputDiv.scrollTop = outputDiv.scrollHeight;
  outputDiv.scrollIntoView(false);
  //$('#log').scrollTop($('#log')[0].scrollHeight);
  //$('#log').scrollTop(99999);

  return;
}

function handleKeyDown_Enter(event) {
  let line = '';
  if (event.key === 'Enter') {
    line = document.querySelector('#command-input').value;

    //As long as the following remains TRUE, then we are alive => so therefore
    //  afterwards we RETURN (RETURN = jump to the next "RL loop")
    if (
      core.isStillAliveGameLoop(line, g.c.inventory, g.c.vitals, g.c.actions)
    ) {
      //l();

      let elem = document.querySelector('#output');
      elem.scrollTop = elem.scrollHeight;
      console.log('command entered: ' + event.key);
      return; // don't return TRUE or FALSE, just RETURN so that we continue
      //  this rl.on() "event" function
    } else {
      // ELSE core.isStillAliveGameLoop has returned FALSE which means
      //  the game is trying to END -- i.e. 1) you're dead,  or
      //  2) you entered the q/quit command -- so we need to dbl-chk

      // gameSTATE:  +before play,
      //              +playing,
      //              +playing skip turn (bad command),
      //              +died - replay?
      //              +dead +quit - verify quit

      if (isDead) {
        g.isGameOver = true;
        return isDeadCheck();
      }
    }
  }
}

//function handle_activityCompleted(sender, activity, completionDuration){
function handle_activityCompleted(sender, activity) {
  // hide stuff
  stopActivityMedia();

  //------------------------------------------------------------------------>
  //  5. passTime() increases Hrs by action.numHrs and...
  //      increases vitals by vitals.takePerHr * action.numHrs
  //------------------------------------------------------------------------>
  core.doPassTime(g.c.action, g.c.inventory, g.c.vitals);
}

function handleBtnCloseRAoGImgModal_click(sender) {
  RAoGAudioClip.pause();
  RAoGImgModal.style.display = 'none';
}

function handleMyModalClose_BeginGame() {
  gameLoadMusic.play();
  console.log('closed modal - begin game');
  runMainGameLoop();
}

function handleDocumentReady_setupInitialModal() {
  $('.modal').modal('show');

  $(document).on('click', '#music_off_btn', function (evt) {
    //alert('dude2');
    //console.log("evt.currentTarget=" + evt.currentTarget);
    console.log(evt);
    toggleMusicPlay(gameLoadMusic, evt.currentTarget);
  });
}

function handleDocumentReady_setupInitialAudio() {
  gameLoadMusic.src = 'audio/survival_game_intro.mp3';
  gameLoadMusic.loop = true;
}

function handleDeath() {
  playDeathMusic();
  console.log("I'm sorry but you died!  Would you like to play again?");
  showConfirmModal("I'm sorry but you died!  Would you like to play again?");
}

function handleRescue() {
  playResuceMusic();
  console.log(
    'closed modal - you were rescued - Would you like to play again?'
  );
  showConfirmModal(
    "Yay!  You've been rescued!  You won the game!  Would you like to play again?"
  );
}

function showConfirmModal(msg) {
  bootbox.confirm({
    message: msg,
    buttons: {
      confirm: {
        label: 'Yes',
        className: 'btn-success',
      },
      cancel: {
        label: 'No',
        className: 'btn-danger',
      },
    },
    callback: function (result) {
      console.log('This was logged in the callback: ' + result);
      if (result) runMainGameLoop();
      else playGameOverAnimation();
    },
  });
  //return result;
}
