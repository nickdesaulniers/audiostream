var UI = {};

UI.play = function () { AV.audio.paused ? AV.audio.play() : AV.audio.pause(); };

UI.playListing = function (e) {
  var target = e.target.nodeName === "SPAN" ? e.target.parentNode : e.target;
  AV.play(target.dataset.ext, target.dataset.songID);
};

UI.nowPlaying = function (e) {
  var ele = document.getElementById("nowPlaying");
  ele.style.zIndex = -1 * parseInt(getComputedStyle(ele).zIndex, 10);;
};

UI.volume = function (e) { AV.audio.volume = parseFloat(e.target.value); };

window.addEventListener("DOMContentLoaded", function () {
  var $ = document.getElementById.bind(document);
  function clicked (id, cb) { $(id).addEventListener("click", cb); };
  clicked("play", UI.play);
  clicked("listing", UI.playListing);
  clicked("playing", UI.nowPlaying);
  clicked("volume", UI.volume);
});

