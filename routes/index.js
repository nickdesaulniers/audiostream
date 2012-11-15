var fs = require('fs');
var child_process = require('child_process');
var musicmetadata = require('musicmetadata');
var path = require('path');
var dirs = require('../config/config').music_folders.map(escapejson);
var dir = escapejson(dirs[0]);
var find = command('find');
var grep = command('grep');
var xargs = command('xargs');

function escapejson (filename) {
  return filename.replace(/\\/g, '');
}

function escapeshell (cmd) {
  return cmd.replace(/(["\s'$`\\\(\)])/g,'\\$1');
};

function flatten (obj) {
  return '' + obj.no + ' of ' + obj.of;
}

function command (command_name) {
  return function (args) {
    child_process.spawn(command_name, args);
  }
}

exports.index = function(req, res){
  child_process.execFile('find', dirs, function (error, stdout, stderr) {
    var dir_list = stdout.split('\n');
    var filenames = [];
    var files = [];
    
    dir_list.forEach(function (file) {
      if (/\.(mp3|ogg|wav)$/.test(file)) {
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
  var requestedFile = req.params.filename;
  var actualFile = requestedFile.replace(/\.(mp3|ogg|wav)$/, '.mp3');
  
  
  //var command = 'ffmpeg -i ' + escapeshell(dir + actualFile) +
  //  ' -acodec libvorbis -map 0:0 library/' + escapeshell(requestedFile);
  //console.log('command to run: \n', command);

  fs.exists('library/' + requestedFile, function (exists) {
    if (exists) {
      res.sendfile('library/' + requestedFile);
      console.log('file sent');
    } else {
      console.log('file does not exist, transcoding needed');
      child = child_process.exec(command, function (error, stdout, stderr) {
        console.log('in child process');
        res.sendfile('library/' + requestedFile);
        console.log('sent');
        child.kill('SIGTERM');
      });
    }
  });
}