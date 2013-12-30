var AV = {};

AV.audio = new Audio;

AV.play = function (ext, songID) {
  this.audio.src = "/transcode/" + ext + "/" + songID;
  this.audio.play();
};

