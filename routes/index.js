var fs = require('fs');
var child_process = require('child_process');
var musicmetadata = require('musicmetadata');
var path = require('path');
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
      // clean up
      delete result.picture;
      result.track = flatten(result.track);
      result.disk = flatten(result.disk);
      result.filename = path.basename(filename);
      //result.songID = id;

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
  var child = null;
  var actualFile = req.params.filename;
  var requestedFile = actualFile.replace(supported_extension_re, '.' +
  req.params.extension);
  
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
  
  var find_command = 'find ' + dirs.map(escapeshell).join(' ') + ' -name ' +
    escapeshell(actualFile);
  var transcode_command =  find_command + ' -print0 | ' +
    'xargs -0 -J actualFile ffmpeg -i actualFile' + encoder + ' -map 0:0 ' +
    'library/' + escapeshell(requestedFile);
  var chosen_command = transcode_command;
  var needsTranscoding = true;
  
  console.log('Requested File: ' + requestedFile);
  console.log('Actual File: ' + actualFile);
  
  // Check if the file has been transcoded, doesn't need to, or does
  fs.exists('library/' + requestedFile, function (exists) {
    if (exists) {
      console.log('found ' + requestedFile + ' in library/');
      res.sendfile('library/' + requestedFile);
      console.log('sent');
    } else {
      console.log('did not find ' + requestedFile + ' in library/');
      
      // Check if file doesn't need transcoding
      if (actualFile === requestedFile) {
        chosen_command = find_command;
        needsTranscoding = false;
      }
      
      console.log(needsTranscoding ? 'Transcoding' : 'Symlinking');
      child = child_process.exec(chosen_command,
      function (error, stdout, stderr) {
        var filename;
        if (error) return console.log(error);
        //if (stderr) return console.log(stderr);
        
        // Symlink it!
        if (!needsTranscoding) {
          filepath = stdout.split('\n')[0];
          fs.symlinkSync(filepath, 'library/' + requestedFile);
        }
        
        res.sendfile('library/' + requestedFile);
        console.log('sent');
        child.kill('SIGTERM');
      });
    }
  });
}