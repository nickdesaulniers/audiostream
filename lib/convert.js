// Each exported function in this module takes an absolute file path, an
// extension to encode to, and a callback.  It transcodes the existing file
// into the new container/codec based on the extension argument, and drops it in
// the cache_dir.
var ffmpeg = require('fluent-ffmpeg');
var cache_dir = './library/'
var timeout = 2 * 60; // 2 minutes
var codecs = {
  ogg: 'libvorbis',
  m4a: 'libvo_aacenc',
  mp3: 'libmp3lame',
  wav: ''
};

module.exports = function (file_path, ext, target_file_name, cb) {
  var dst = cache_dir + target_file_name;
  new ffmpeg({
    source: file_path,
    timeout: timeout
  })
  .withAudioCodec(codecs[ext])
  .toFormat(ext)
  .withNoVideo()
  .saveToFile(dst, function (retcode, error) {
    cb(retcode === ffmpeg.E_PROCESSTIMEOUT ? true : false, dst);
  })
}