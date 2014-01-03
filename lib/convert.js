// Each exported function in this module takes an absolute file path, an
// extension to encode to, and a callback.  It transcodes the existing file
// into the new container/codec based on the extension argument, and drops it
// in the cache_dir.
var Writable = require('stream').Writable;
var ffmpeg = require('fluent-ffmpeg');
var timeout = 2 * 60; // 2 minutes
var codecs = {
  ogg: 'libvorbis',
  m4a: 'libvo_aacenc',
  mp3: 'libmp3lame',
  wav: ''
};

module.exports = function (params) {
  var writer = new Writable();
  writer._write = function (chunk, encoding, callback) {
    return params.res.write(chunk, encoding) &&
           params.transcoded_fstream.write(chunk, encoding, callback);
  };
  writer.end = function (chunk, encoding, callback) {
    params.res.end(chunk, encoding, callback);
    params.transcoded_fstream.end(chunk, encoding, callback);
  };

  new ffmpeg({
    source: params.file_path,
    timeout: timeout
  })
  .withAudioCodec(codecs[params.requested_extension])
  .toFormat(params.requested_extension)
  .withNoVideo()
  .writeToStream(writer, params.cb)
};

