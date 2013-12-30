function createSongListing (song_name, artist, duration) {
  var li = document.createElement("li");
  var args = arguments;
  ["song_name", "artist", "duration"].forEach(function (klass, index) {
    var span = document.createElement("span");
    span.classList.add(klass);
    span.textContent = args[index];
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

window.addEventListener("DOMContentLoaded", function () {
  var listing = document.getElementById("listing");
  listing.parentElement.addEventListener("scroll", function (evt) {
    console.log(evt.target.scrollTop);
    if (evt.target.scrollTop === evt.target.scrollTopMax) {
      console.log("Reached Bottom");
    } else if (evt.target.scrollTop === 0) {
      console.log("Reached Top");
    }
  });

  listing.addEventListener("click", function (e) {
    if (e.target.nodeName === "SPAN") {
      console.log(e.target.parentNode);
    } else {
      console.log(e.target);
    }
  });

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
      frag.appendChild(createSongListing(song.title, song.artist, song.duration));
    });
    listing.appendChild(frag);
  };
  xhr.send();
});
