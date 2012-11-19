var shell = require('shelljs');
var fs = require('fs');
var music_folders = require('../config/config.json').music_folders.map(
  escapejson);
var supported_extension_re = /\.(mp3|ogg|wav)$/;
var file_dict = {};

function escapejson (filename) {
  return filename.replace(/\\/g, '');
}

var FileMap = {
  retrieve: function (id) {
    return file_dict[id];
  },
  retrieveAll: function () {
    return file_dict;
  },
  previously_transcoded: function (file_path) {
    var lib_file_path = 'library/' + file_path;
    return fs.existsSync(lib_file_path) ? lib_file_path : '';
  },
  update: function () {
    shell.find(music_folders).filter(function (file_path) {
      return supported_extension_re.test(file_path) && fs.existsSync(file_path);
    }).forEach(function (file_path) {
      file_dict[fs.statSync(file_path).ino] = file_path;
    });
  }
};

FileMap.update();

exports.FileMap = FileMap;