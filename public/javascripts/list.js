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

$(document).ready(function () {
  var table = document.getElementById('table_id');
  var target = table.getElementsByTagName('tbody')[0];
  $.getJSON('/list', function (data) {
    for (var i = 0, len = data.length; i < len; i++) {
      var row = document.createElement('tr');
      var song = data[i];
      row.appendChild(insertSongInNewTd(song.title, song.songId, song.ext));
      row.appendChild(insertTextInNewTd(song.artist));
      row.appendChild(insertTextInNewTd(song.albumartist));
      row.appendChild(insertTextInNewTd(song.album));
      row.appendChild(insertTextInNewTd(song.year));
      row.appendChild(insertTextInNewTd(song.track));
      row.appendChild(insertTextInNewTd(song.genre));
      row.appendChild(insertTextInNewTd(song.disk));
      target.appendChild(row);
    }
    $('#table_id').dataTable({
      aaSorting: [[1, 'asc'], [3, 'asc']]
    }).fadeIn(500);
    $('div#controls progress:first').remove();
  });
});