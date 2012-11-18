var fs = require('fs');
var child_process = require('child_process');
var musicmetadata = require('musicmetadata');
var path = require('path');
var dirs = require('../config/config').music_folders.map(escapejson);
var supported_extension_re = /\.(mp3|ogg|wav)$/;
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
  child_process.execFile('find', dirs, function (error, stdout, stderr) {
    var dir_list = stdout.split('\n');
    var filenames = [];
    var files = [];
    
    dir_list.forEach(function (file) {
      if (supported_extension_re.test(file)) {
        filenames.push(file);
      }
    });
    
    filenames.forEach(function (filename) {
      var parser = new musicmetadata(fs.createReadStream(filename));
      parser.on('metadata', function (result) {
        // clean up
        delete result.picture;
        result.track = flatten(result.track);
        result.disk = flatten(result.disk);
        result.filename = path.basename(filename);

        files.push(result);

        // On the last file
        if (files.length === filenames.length) {
          res.render('index', {
            title: 'Jukebox',
            files: files
          });
        }
      });
    });
  });
};

exports.transcode = function (req, res) {
  var child = null;
  var actualFile = req.params.filename;
  var requestedFile = actualFile.replace(supported_extension_re, '.' +
  req.params.extension);
  
  var find_command = 'find ' + dirs.map(escapeshell).join(' ') + ' -name ' +
    escapeshell(actualFile);
  var transcode_command =  find_command + ' -print0 | ' +
    'xargs -0 -J actualFile ffmpeg -i actualFile -acodec libvorbis -map 0:0 ' +
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