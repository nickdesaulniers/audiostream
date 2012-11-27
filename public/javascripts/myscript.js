// Detect what containers are supported
// http://diveintohtml5.com/everything.html
var audio_supported = mp3_supported = vorbis_supported = wav_supported =
  m4a_supported = false;

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
  m4a_supported =
    !!a.canPlayType('audio/mp4; codecs="mp4a.40.2"').replace(/no/, '');
} else {
  redirect('HTML5 audio not supported.');
}

// Preferred transcoded extension
var preferred_extension = '';
(function () {
  if (ogg_supported) return preferred_extension = 'ogg';
  if (mp3_supported) return preferred_extension = 'mp3';
  if (m4a_supported) return preferred_extension = 'm4a';
  if (wav_supported) return preferred_extension = 'ogg';
  redirect('No support for ogg, mp3, m4a, or wav');
})();

function isSupported (extString) {
  switch (extString) {
    case 'ogg': return ogg_supported;
    case 'mp3': return mp3_supported;
    case 'm4a': return m4a_supported;
    case 'wav': return wav_supported;
    default: return false;
  }
}

function getSupportedExt (ext) {
  return isSupported(ext) ? ext : preferred_extension;
}

function getAudioSrc (dataset) {
  return '/transcode/' + getSupportedExt(dataset.ext) + '/' + dataset.songid;
}

$(document).ready(function () {
  $(document).on('click', 'a.song_title', function (e) {
    e.preventDefault();
    var div = document.getElementById('controls');
    div.innerHTML = '';
    var img = document.createElement('img');
    img.setAttribute('src', '/images/ajax-loader.gif');
    img.setAttribute('alt', 'loading');
    div.appendChild(img);
    var audio = document.createElement('audio');
    audio.setAttribute('controls', null);
    var listener = audio.addEventListener('canplay', function (e) {
      div.innerHTML = '';
      div.appendChild(audio);
      audio.removeEventListener('canplay', listener);
    });
    audio.addEventListener('error', function (e) {
      div.innerHTML = '';
      var p = document.createElement('p');
      p.appendChild(document.createTextNode('Error loading file'));
      p.setAttribute('class', 'error');
      div.appendChild(p);
    });
    audio.src = getAudioSrc(this.dataset);
    // Necessary for iPhone
    audio.load();
  });
});