function insertTextInNewTd (text) {
  var td = document.createElement('td');
  td.appendChild(document.createTextNode(text));
  return td;
}

function insertSongInNewTd (title, id, ext) {
  var td = document.createElement('td');
  var a = document.createElement('a');
  a.setAttribute('href', '#');
  a.setAttribute('class', 'song_title');
  a.setAttribute('data-songid', id);
  a.setAttribute('data-ext', ext);
  a.appendChild(document.createTextNode(title));
  td.appendChild(a);
  return td;
}

// redoTable is new data for invalid cache
function list (songs, redoTable) {
  var table = document.getElementById('table_id');
  var target = table.getElementsByTagName('tbody')[0];
  var fragment = document.createDocumentFragment();
  for (var i = 0, len = songs.length; i < len; i++) {
    var row = document.createElement('tr');
    var song = songs[i];
    row.appendChild(insertSongInNewTd(song.title, song.songID, song.ext));
    row.appendChild(insertTextInNewTd(song.artist));
    row.appendChild(insertTextInNewTd(song.albumartist));
    row.appendChild(insertTextInNewTd(song.album));
    row.appendChild(insertTextInNewTd(song.year));
    row.appendChild(insertTextInNewTd(song.track));
    row.appendChild(insertTextInNewTd(song.genre));
    row.appendChild(insertTextInNewTd(song.disk));
    fragment.appendChild(row);
  }
  
  if (redoTable) {
    redoTable.fnDestroy();
    target.innerHTML = '';
  }
  
  target.appendChild(fragment);
  $('div#controls img:first').remove();
  return $('#table_id').dataTable({
    aaSorting: [[1, 'asc'], [3, 'asc']]
  }).css('width', '').fadeIn(500);
}

// Cache miss
function noCache (data) {
  list(data);
  localStorage.setItem('song_cache', JSON.stringify(data));
}

function validateCache (cached_songs, dataTable) {
  $.getJSON('/list', function (server_songs) {
    if (server_songs.length !== cached_songs.length ||
    server_songs.toString().length !== cached_songs.toString().length) {
      // Invalid Cache
      list(server_songs, dataTable);
      localStorage.setItem('song_cache', JSON.stringify(server_songs));
    }
    // Valid Cache
  });
}

function clearCache (songs) {
  list(songs, true);
}

$(document).ready(function () {
  var songs, song_cache, song_cache_string = localStorage.getItem('song_cache');
  if (!song_cache_string) return $.getJSON('/list', noCache);
  try {
    song_cache = JSON.parse(song_cache_string);
  } catch (e) {
    // Unparseable cache
    localStorage.removeItem('song_cache');
    return $.getJSON('/list', list);
  }
  // Cache hit
  var dataTable = list(song_cache);
  validateCache(song_cache, dataTable);
  // Manually clear cache, for now
  $(document).on('click', 'button#reset_cache', function (e) {
    localStorage.removeItem('song_cache');
    validateCache([], dataTable);
  });
});