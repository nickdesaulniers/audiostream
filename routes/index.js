var fs = require('fs');
var child_process = require('child_process');
var musicmetadata = require('musicmetadata');
var dirs = require('../config/config').music_folders.map(escapejson);
var FileMap = require('../lib/filemap').FileMap;

var supported_extension_re = /\.(mp3|ogg|wav|aac)$/;
var file_extension_re = /\.([0-9a-z]+)(?:[\?#]|$)/i;

function escapejson (filename) {
  return filename.replace(/\\/g, '');
}

function escapeshell (cmd) {
  return cmd.replace(/(["\s'$`\\\(\)])/g,'\\$1');
}

function flatten (obj) {
  return '' + obj.no + ' of ' + obj.of;
}

exports.index = function(req, res){
  var filemap = FileMap.retrieveAll();
  var filemapKeys = Object.keys(filemap);
  var files = [];
  
  filemapKeys.forEach(function (id) {
    var filename = filemap[id];
    var parser = new musicmetadata(fs.createReadStream(filename));
    parser.on('metadata', function (result) {
      // clean up (lots of object modification: bad)
      delete result.picture;
      result.track = flatten(result.track);
      result.disk = flatten(result.disk);
      result.songID = id;
      result.ext = filename.replace(/.+\./, '');

      files.push(result);

      // On the last file
      if (files.length === filemapKeys.length) {
        res.render('index', {
          title: 'Jukebox',
          files: files
        });
      }
    });
  });
};

exports.transcode = function (req, res) {
  // Check if original file ext is in filemap
  var file_path = FileMap.retrieve(req.params.fileID);
  if (!file_path) {
    console.log('original file was not in filemap');
    return res.send(404);
  }
  
  // was the requested extension the file's current extension?
  var requested_extension = req.params.extension;
  var actual_extension = file_path.replace(/.+\./, '');
  if (requested_extension === actual_extension) {
    console.log('The file\'s actual extension was requested');
    return res.sendfile(file_path);
  }
  
  // was the requested extension previously encoded?
  var previous_file_name = req.params.fileID + '.' + requested_extension;
  var previous_file_path = FileMap.previously_transcoded(previous_file_name);
  if (previous_file_path) {
    console.log('Found previously encoded version in library/');
    return res.sendfile(previous_file_path);
  }
  
  // Transcoding needed
  console.log('Transcoding ' + actual_extension + ' to ' + requested_extension);
  
  // encoding library
  // ogg -> libvorbis
  // aac -> libvo_aacenc // m4a
  // wav -> don't need -acodec anything, just .wav
  // mp3 -> libmp3lame
  var encoder = '';
  switch (req.params.extension) {
    case 'ogg': encoder = ' -acodec libvorbis'; break;
    case 'aac': encoder = ' -acodec libvo_aacenc'; break;
    case 'wav': break;
    case 'mp3': encoder = ' -acodec libmp3lame'; break;
  }
  
  var command =
    'ffmpeg -i ' + escapeshell(file_path) + encoder + ' -map 0:0 library/' +
    previous_file_name;

  child = child_process.exec(command, function (error, stdout, stderr) {
    if (error) return console.log(error);
    //if (stderr) return console.log(stderr);
    console.log('transcoded');
    res.sendfile('library/' + previous_file_name);
    child.kill('SIGTERM');
  });
}