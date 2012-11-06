$(document).ready(function () {
  $('a.song_title').click(function (e) {
    e.preventDefault();
    var filename = this.href.replace(/.+\/transcode\//, '');
    //var filename = encodeURIComponent(this.value).replace(/\.mp3$/, '.ogg');
    var audio = document.createElement('audio');
    audio.setAttribute('controls', null);
    var listener = audio.addEventListener('canplay', function (e) {
      document.body.appendChild(audio);
      audio.removeEventListener('canplay', listener);
    });
    audio.src = '/transcode/' + filename;
  });
});