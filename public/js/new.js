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

window.addEventListener("DOMContentLoaded", function () {
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
    document.getElementById("listing").appendChild(frag);
  };
  xhr.send();
});

