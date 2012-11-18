var shell = require('shelljs');
var fs = require('fs');
var music_folders = require('../config/config.json').music_folders.map(
  escapejson);
var supported_extension_re = /\.(mp3|ogg|wav)$/;
var file_dict = {};

function escapejson (filename) {
  return filename.replace(/\\/g, '');
}

// Make this a constructor next
var FileMap = {
  retrieve: function (id) {
    return file_dict[id];
  },
  retrieveAll: function () {
    return file_dict;
  },
  store: function (path) {
    // TODO
  },
  update: function () {
    shell.find(music_folders).filter(function (file_name) {
      return supported_extension_re.test(file_name) && fs.existsSync(file_name);
    }).forEach(function (file_name) {
      file_dict[fs.statSync(file_name).ino] = file_name;
    });
  }
};

FileMap.update();

exports.FileMap = FileMap;