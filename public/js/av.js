var AV = {};

AV.audio = new Audio;

AV.support = {
  mp3: !!AV.audio.canPlayType("audio/mpeg").replace(/no/, ""),
  ogg: !!AV.audio.canPlayType('audio/ogg; codecs="vorbis"').replace(/no/, ""),
  m4a: !!AV.audio.canPlayType('audio/mp4; codecs="mp4a.40.2"').replace(/no/, ""),
  wav: !!AV.audio.canPlayType('audio/wav; codecs="1"').replace(/no/, ""),
};

AV.preferred = Object.keys(AV.support).filter(function (key) {
  return AV.support[key];
});

AV.getSupportedExt = function (ext) {
  return AV.support[ext] ? ext : AV.preferred[0];
};

AV.play = function (ext, songID, cb) {
  this.audio.src = "/transcode/" + AV.getSupportedExt(ext) + "/" + songID;
  this.audio.play();
  if (typeof cb === "function") {
    this.audio.onloadedmetadata = cb.bind(null, this.audio);
  }
};

