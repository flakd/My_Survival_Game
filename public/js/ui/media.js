// when it actually plays, this is the action/activity audio clip
const activityAudioClip = document.createElement('audio');
// when it actually plays, this is the RAoG audio clip
const RAoGAudioClip = document.createElement('audio');

$(document).ready(function () {
  // when it displays, this is the modal that holds the action/activity graphic
  g.activityImgModal = document.getElementById('activity-image-modal');
  g.activityImg = document.getElementById('activity-image');

  // when it displays, this is the modal that holds the RAoG graphic
  g.RAoGImgModal = document.getElementById('RAoG-image-modal');
  g.RAoGImg = document.getElementById('RAoG-image');
});

function playActivityMedia(activityNameStr) {
  let tmpName = activityNameStr.split(' ').join('-');
  let srcFileName = 'images/' + tmpName + '.gif';
  g.activityImg.src = srcFileName;
  //activityImgModal.style.display = 'block';
  g.activityImg.style.display = 'block';
  activityAudioClip.src = 'audio/' + tmpName + '.mp3';
  activityAudioClip.play();
  lwr(
    `Current Activity: ${waid.getActivityGerund()}`,
    document.querySelector('#log4')
  );
  lwrOutput(waid.getBusyMessage());
}

function playRAoGMedia(activityNameStr) {
  let tmpName = activityNameStr.split(' ').join('-');
  let srcFileName = 'images/' + tmpName + '.png';
  RAoGImg.src = srcFileName;
  RAoGImgModal.style.display = 'block';
  RAoGAudioClip.src = 'audio/' + tmpName + '.mp3';
  RAoGAudioClip.play();
}

function stopActivityMedia() {
  activityAudioClip.pause();
  //activityImgModal.style.display = 'none';
  g.activityImg.style.display = ' none';
  playActivityMedia('Indy nonanim trans');
}

function toggleMusicPlay(audioClip, btn) {
  if (isAudioPlaying(audioClip)) {
    audioClip.pause();
    btn.innerText = 'Music On';
  } else {
    audioClip.play();
    btn.innerText = 'Music Off';
  }
}

function isAudioPlaying(audioClip) {
  return (
    audioClip &&
    audioClip.currentTime > 0 &&
    !audioClip.paused &&
    !audioClip.ended &&
    audioClip.readyState > 2
  );
}

function playDeathMusic() {
  // add this later
}

function playGameOverAnimation() {
  // TODO
  alert("I'm now playing the GAME OVER animation!");
}
