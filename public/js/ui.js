var UI = {
  seekMouseDown: false,
};

UI.play = function () {
  AV.audio.paused ? AV.audio.play() : AV.audio.pause();
};

UI.playListing = function (e) {
  var target = e.target.nodeName === "SPAN" ? e.target.parentNode : e.target;
  AV.play(target.dataset.ext, target.dataset.songID, UI.seekDuration);
};

UI.nowPlaying = function (e) {
  var ele = document.getElementById("nowPlaying");
  ele.style.zIndex = -1 * parseInt(getComputedStyle(ele).zIndex, 10);;
};

UI.volume = function (e) { AV.audio.volume = e.target.valueAsNumber; };
UI.seekDown = function () { UI.seekMouseDown = true; };
UI.seekUp = function () { UI.seekMouseDown = false; };

UI.timechange = function () {
  if (!UI.seekMouseDown) {
    document.getElementById("seek").value = AV.audio.currentTime;
  }
};

UI.seekDuration = function (audio) {
  var seek = document.getElementById("seek");
  seek.min = seek.value = audio.seekable.start(0);;
  seek.max = audio.seekable.end(0);
};

window.addEventListener("DOMContentLoaded", function () {
  var $ = document.getElementById.bind(document);
  function on (target, eventType, cb) {
    if (typeof target === "string") target = $(target);
    target.addEventListener(eventType, cb);
  };
  on("play", "click", UI.play);
  on("listing", "click", UI.playListing);
  on("playing", "click", UI.nowPlaying);
  on("volume", "click", UI.volume);
  on("seek", "mousedown", UI.seekDown);
  on("seek", "mouseup", UI.seekUp);
  on(AV.audio, "timeupdate", UI.timechange);
});

