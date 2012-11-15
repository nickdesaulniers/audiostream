$(document).ready(function () {
  $('#table_id').dataTable({
    // This is super brittle
    aaSorting: [[1, 'asc'], [3, 'asc']]
  });
  $(document).on('click', 'a.song_title', function (e) {
    var div = document.getElementById('controls');
    e.preventDefault();
    div.innerHTML = '';
    div.appendChild(document.createElement('progress'));
    var audio = document.createElement('audio');
    audio.setAttribute('controls', null);
    var listener = audio.addEventListener('canplay', function (e) {
      div.innerHTML = '';
      div.appendChild(audio);
      audio.removeEventListener('canplay', listener);
    });
    var supported_extension = 'ogg';
    audio.src = '/transcode/' + supported_extension + '/' + this.dataset.filename;
  });
});