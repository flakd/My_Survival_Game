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
  lwln(event.key);
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
  //player.setAttribute("style","display:inline");

  //lw(event.keyCode);
  //lw(event.code);
  //lw(event.key);
  let xPosInt = g.p.xInt;
  let yPosInt = g.p.yInt;
  lwln(event.key);
  lwln('xPosInt: ' + xPosInt);
  lwln('yPosInt: ' + yPosInt);
  console.log(xPosInt);
  console.log(yPosInt);
  let top = yPosInt * 40 - 20;
  let left = xPosInt * 40 + 20;
  let topStr = top + 'px';
  let leftStr = left + 'px';

  let isValidMove = false;
  let nextCell;
  let nextPlayerVisible;
  let nextCellName;
  let playerId;
  switch (event.key) {
    case 'ArrowUp':
      event.preventDefault();
      if (yPosInt - 1 < 0) return;
      if (g.map[yPosInt - 1][xPosInt] === 0) return;
      yPosInt--;
      isValidMove = true;
      break;
    case 'ArrowDown':
      event.preventDefault();
      if (yPosInt + 1 > g.map_HEIGHT - 1) return;
      if (g.map[yPosInt + 1][xPosInt] === 0) return;
      yPosInt++;
      isValidMove = true;
      break;
    case 'ArrowLeft':
      event.preventDefault();
      if (xPosInt - 1 < 0) return;
      if (g.map[yPosInt][xPosInt - 1] === 0) return;
      xPosInt--;
      isValidMove = true;
      break;
    case 'ArrowRight':
      event.preventDefault();
      //if (xPosInt +1 < 0) return;
      if (xPosInt + 1 > g.map_WIDTH - 1) return;
      if (g.map[yPosInt][xPosInt + 1] === 0) return;
      xPosInt++;
      isValidMove = true;
      break;
    default:
    //  return;
  }
  console.log('wtf');
  g.p.player = document.getElementById(playerId);
  if (!g.player) console.log("can't find player");
  if (isValidMove) {
    let top = yPosInt * 40 - 20;
    let left = xPosInt * 40 + 20;
    let topStr = top + 'px';
    let leftStr = left + 'px';
    nextCellName = xPosInt + ',' + yPosInt;
    //playerId = 'player_' + yPosInt + xPosInt;
    playerId = 'player_65_b';
    lwln(nextCellName);
    lwln(playerId);
    //nextPlayerVisible = document.getElementById(playerId);

    //nextPlayerVisible.setAttribute('style', 'display:inline');
    g.p.player.style.top = topStr;
    g.p.player.style.left = leftStr;
    //g.player.setAttribute('style', 'display:none');
    //g.player = nextPlayerVisible;
  }
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
