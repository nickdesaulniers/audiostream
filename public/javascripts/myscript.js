// Detect what containers are supported
// http://diveintohtml5.com/everything.html
var audio_supported = mp3_supported = vorbis_supported = wav_supported =
  aac_supported = false;

function redirect (message) {
  alert(message);
  window.location = 'http://browsehappy.com/';
}

audio_supported = !!document.createElement('audio').canPlayType;
if (audio_supported) {
  var a = document.createElement('audio');
  mp3_supported = !!a.canPlayType('audio/mpeg').replace(/no/, '');
  ogg_supported =
    !!a.canPlayType('audio/ogg; codecs="vorbis"').replace(/no/, '');
  wav_supported = !!a.canPlayType('audio/wav; codecs="1"').replace(/no/, '');
  aac_supported =
    !!a.canPlayType('audio/mp4; codecs="mp4a.40.2"').replace(/no/, '');
} else {
  redirect('HTML5 audio not supported.');
}

// Preferred transcoded extension
var supported_extension = '';
(function () {
  if (ogg_supported) return supported_extension = 'ogg';
  if (mp3_supported) return supported_extension = 'mp3';
  if (aac_supported) return supported_extension = 'aac'; // m4a, .mp4 ???
  if (wav_supported) return supported_extension = 'ogg';
  redirect('No support for ogg, mp3, aac, or wav');
})();

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
    audio.src = '/transcode/' + supported_extension + '/' + this.dataset.filename;
  });
});