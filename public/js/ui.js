var UI = {
  seekMouseDown: false,
};

UI.play = function () {
  AV.audio.paused ? AV.audio.play() : AV.audio.pause();
};

UI.playListing = function (e) {
  var target = e.target.nodeName === "SPAN" ? e.target.parentNode : e.target;
  document.getElementById("seek").disabled = true;
  UI.nowPlaying();
  AV.play(target.dataset.ext, target.dataset.songID);
};

UI.nowPlaying = function (e) {
  var ele = document.getElementById("nowPlaying");
  ele.style.opacity = Number(!Boolean(parseInt(ele.style.opacity, 10)));
  ele.style.zIndex = -1 * parseInt(getComputedStyle(ele).zIndex, 10);
};

UI.volume = function (e) { AV.audio.volume = e.target.valueAsNumber; };
UI.seekDown = function () { UI.seekMouseDown = true; };
UI.seekUp = function () { UI.seekMouseDown = false; };
UI.seek = function (e) { AV.audio.currentTime = e.target.value; };

UI.timechange = function () {
  if (!UI.seekMouseDown) {
    document.getElementById("seek").value = AV.audio.currentTime;
  }
};

UI.seekDuration = function () {
  var seek = document.getElementById("seek");
  if (isFinite(AV.audio.duration) && AV.audio.seekable.length > 0) {
    seek.min = seek.value = AV.audio.seekable.start(0);
    seek.max = AV.audio.seekable.end(0);
    seek.disabled = false;
  } else {
    seek.min = seek.value = 0;
    seek.max = 1;
  }
};

window.addEventListener("DOMContentLoaded", function () {
  var $ = document.getElementById.bind(document);
  function on (target, eventType, cb) {
    if (typeof target === "string") target = $(target);
    target.addEventListener(eventType, cb);
  };
  var seek = $("seek");
  seek.value = 0;
  on("play", "click", UI.play);
  on("listing", "click", UI.playListing);
  on("playing", "click", UI.nowPlaying);
  on("volume", "click", UI.volume);
  on(seek, "mousedown", UI.seekDown);
  on(seek, "mouseup", UI.seekUp);
  on(seek, "change", UI.seek);
  on(AV.audio, "timeupdate", UI.timechange);
  on(AV.audio, "loadedmetadata", UI.seekDuration);
});

