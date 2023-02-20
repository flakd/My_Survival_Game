  // when it displays, this is the modal that holds the action/activity graphic
  const activityImgModal = document.getElementById("activity-image-modal");
  const activityImg = document.getElementById("activity-image");
  // when it actually plays, this is the action/activity audio clip
  const activityAudioClip = document.createElement("audio");
  // when it displays, this is the modal that holds the RAoG graphic
  const RAoGImgModal = document.getElementById("RAoG-image-modal");   
  const RAoGImg = document.getElementById("RAoG-image");   
  // when it actually plays, this is the RAoG audio clip
  const RAoGAudioClip = document.createElement("audio");  
  
  function playActivityMedia(activityNameStr){
    let tmpName = activityNameStr.split(" ").join("-");
    let srcFileName = "images/" + tmpName + ".gif";
    activityImg.src = srcFileName;
    activityImgModal.style.display = "block";
    activityAudioClip.src = "audio/" + tmpName + ".mp3";
    activityAudioClip.play();
    lwr(`Current Activity: ${waid.getActivityGerund()}`, document.querySelector("#log4"));
    lwrOutput(waid.getBusyMessage());  
  }
  
  function playRAoGMedia(activityNameStr){
    let tmpName = activityNameStr.split(" ").join("-");
    let srcFileName = "images/" + tmpName + ".png";
    RAoGImg.src = srcFileName;
    RAoGImgModal.style.display = "block";
    RAoGAudioClip.src = "audio/" + tmpName + ".mp3";
    RAoGAudioClip.play();
  }
  
  function stopActivityMedia(){
    activityAudioClip.pause();
    activityImgModal.style.display = "none";
  }  
  
  function toggleMusicPlay(audioClip, btn) {
  if (isAudioPlaying(audioClip)) {
    audioClip.pause();
    btn.innerText = "Music On"
  } else {
    audioClip.play();
    btn.innerText = "Music Off"
  }
}

function isAudioPlaying(audioClip) {
  return (
    audioClip
    && audioClip.currentTime > 0
    && !audioClip.paused
    && !audioClip.ended
    && audioClip.readyState > 2
  );
}

function playDeathMusic() {
  // add this later
}

function playGameOverAnimation(){
  // TODO
  alert("I'm now playing the GAME OVER animation!");
}