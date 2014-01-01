var AV = {};

AV.audio = new Audio;

AV.play = function (ext, songID, cb) {
  this.audio.src = "/transcode/" + ext + "/" + songID;
  this.audio.play();
  if (typeof cb === "function") {
    this.audio.onloadedmetadata = cb.bind(null, this.audio);
  }
};

