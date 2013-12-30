function createSongListing (song) {
  var li = document.createElement("li");
  li.dataset.songID = song.songID;
  li.dataset.ext = song.ext;
  ["title", "artist", "duration"].forEach(function (klass) {
    var span = document.createElement("span");
    span.classList.add(klass);
    span.textContent = song[klass];
    li.appendChild(span);
  });
  return li;
};

function buildSort () {
  var fields = arguments, len = fields.length;
  return function (a, b) {
    for (var i = 0, af, bf, field; i < len; ++i) {
      field = fields[i];
      af = a[field];
      bf = b[field];
      if (af < bf) return -1;
      if (af > bf) return 1;
      if (i === len - 1) return 0;
    }
  };
};

function play (audio, ext, songID) {
  audio.src = "/transcode/" + ext + "/" + songID;
  audio.play();
};

function setupPlayback (audio, listing) {
  var $ = document.getElementById.bind(document);
  var playEle = $("play");
  var pause = $("pause");
  var next = $("next");
  var previous = $("previous");
  var volume = $("volume");
  var seek = $("seek");
  listing.addEventListener("click", function (e) {
    var target = e.target.nodeName === "SPAN" ? e.target.parentNode : e.target;
    play(audio, target.dataset.ext, target.dataset.songID);
  });
  playEle.addEventListener("click", function () {});
  pause.addEventListener("click", function () {
    audio.pause();
  });
};

window.addEventListener("DOMContentLoaded", function () {
  var audio = new Audio;
  var listing = document.getElementById("listing");
  listing.parentElement.addEventListener("scroll", function (evt) {
    console.log(evt.target.scrollTop);
    if (evt.target.scrollTop === evt.target.scrollTopMax) {
      console.log("Reached Bottom");
    } else if (evt.target.scrollTop === 0) {
      console.log("Reached Top");
    }
  });

  setupPlayback(audio, listing);

  var xhr = new XMLHttpRequest;
  xhr.open("GET", "list");
  xhr.overrideMimeType("application/json");
  xhr.onload = function () {
    var songs = null;
    try {
      songs = JSON.parse(this.response);
    } catch (e) {
      return console.error(e);
    }
    var frag = document.createDocumentFragment();
    songs.sort(buildSort("artist", "album", "track")).forEach(function (song) {
      frag.appendChild(createSongListing(song));
    });
    listing.appendChild(frag);
  };
  xhr.send();
});
