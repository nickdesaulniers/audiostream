$(document).ready(function () {
  $('input[type=button]').click(function (e) {
    var filename = encodeURIComponent(this.value).replace(/\.mp3$/, '.ogg');
    var audio = document.createElement('audio');
    audio.setAttribute('controls', null);
    audio.src = '/transcode/' + filename;
    //audio.load();
    document.body.appendChild(audio);
  });
});