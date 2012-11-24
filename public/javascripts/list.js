function insertInNewTd (text) {
  var td = document.createElement('td');
  td.appendChild(document.createTextNode(text));
  return td;
}

$(document).ready(function () {
  var table = document.getElementById('table_id');
  var target = table.getElementsByTagName('tbody')[0];
  $.getJSON('/list', function (data) {
    for (var i = 0, len = data.length; i < len; i++) {
      var row = document.createElement('tr');
      row.appendChild(insertInNewTd(data[i].title));
      row.appendChild(insertInNewTd(data[i].artist));
      row.appendChild(insertInNewTd(data[i].albumartist));
      row.appendChild(insertInNewTd(data[i].album));
      row.appendChild(insertInNewTd(data[i].year));
      row.appendChild(insertInNewTd(data[i].track));
      row.appendChild(insertInNewTd(data[i].genre));
      row.appendChild(insertInNewTd(data[i].disk));
      target.appendChild(row);
    }
    $('#table_id').dataTable({
      aaSorting: [[1, 'asc'], [3, 'asc']]
    }).fadeIn(500);
    $('div#controls progress:first').remove();
  });
});