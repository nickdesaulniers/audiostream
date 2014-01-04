var shell = require('shelljs');
var fs = require('fs');
var Metalib = require('fluent-ffmpeg').Metadata;
var music_folders = require('../config/config.json').music_folders
                                                    .map(escapejson);
var supported_extension_re = /\.(mp3|ogg|wav|m4a|flac)$/i;
var file_dict = {};
var file_metadata = [];

function escapejson (filename) { return filename.replace(/\\/g, ''); };

module.exports = {
  retrieve: function (id) { return file_dict[id]; },
  retrieveAll: function () { return file_metadata; },
  previously_transcoded: function (file_path) {
    var lib_file_path = 'library/' + file_path;
    return fs.existsSync(lib_file_path) ? lib_file_path : '';
  },
  update: function (cb) {
    var counter = file_metadata.length = 0;
    shell.find(music_folders).filter(function (file_path) {
      return supported_extension_re.test(file_path) && fs.existsSync(file_path);
    }).forEach(function (file_path, i, all_songs) {
      if (i === 0) console.log('Parsing ' + all_songs.length + ' songs.');
      var songID = fs.statSync(file_path).ino;
      file_dict[songID] = file_path;
      new Metalib(file_path, function (metadata, err) {
        if (err) return console.error(err);
        file_metadata.push({
          songID: songID,
          ext: file_path.replace(/.+\./, ''),
          title: metadata.title || file_path.replace(/.+\//, ''),
          artist: metadata.artist,
          album: metadata.album,
          year: metadata.date,
          track: metadata.track,
          duration: metadata.durationraw,
        });
        if (++counter === all_songs.length && typeof cb === 'function') {
          console.log('Done parsing.');
          cb();
        }
      });
    });
  }
};

