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

window.addEventListener("DOMContentLoaded", function () {
  document.getElementById("listing").parentElement.addEventListener("scroll", function (evt) {
    console.log(evt.target.scrollTop);
    if (evt.target.scrollTop === evt.target.scrollTopMax) {
      console.log("Reached Bottom");
    } else if (evt.target.scrollTop === 0) {
      console.log("Reached Top");
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
    console.log(songs);
    var frag = document.createDocumentFragment();
    songs.forEach(function (song) {
      frag.appendChild(createSongListing(song.title, song.artist, song.duration));
    });
    document.getElementById("listing").appendChild(frag);
  };
  xhr.send();
});