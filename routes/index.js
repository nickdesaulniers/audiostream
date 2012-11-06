var fs = require('fs');
var exec = require('child_process').exec;
var musicmetadata = require('musicmetadata');

var dir = '/Users/wangstabill/Downloads/A\ Perfect\ Circle\ \(Thirteenth\ Step\)/';

function escapeshell (cmd) {
  return cmd.replace(/(["\s'$`\\\(\)])/g,'\\$1');
};

function flatten (obj) {
  return '' + obj.no + ' of ' + obj.of;
}

exports.index = function(req, res){
  var filenames = fs.readdirSync(dir);
  var files = [];
  
  filenames.forEach(function (filename) {
    var parser = new musicmetadata(fs.createReadStream(dir + filename));
    parser.on('metadata', function (result) {
      // clean up
      delete result.picture;
      result.track = flatten(result.track);
      result.disk = flatten(result.disk);
      result.filename = filename;
      
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
};

exports.transcode = function (req, res) {
  var child = null;
  var requestedFile = req.params.filename;
  var actualFile = requestedFile.replace(/\.ogg$/, '.mp3');
  var command = 'ffmpeg -i ' + escapeshell(dir + actualFile) +
    ' -acodec libvorbis -map 0:0 library/' + escapeshell(requestedFile);
  //console.log('command to run: \n', command);

  fs.exists('library/' + requestedFile, function (exists) {
    if (exists) {
      res.sendfile('library/' + requestedFile);
      console.log('file sent');
    } else {
      console.log('file does not exist, transcoding needed');
      child = exec(command, function (error, stdout, stderr) {
        console.log('in child process');
        res.sendfile('library/' + requestedFile);
        console.log('sent');
        child.kill('SIGTERM');
      });
    }
  });
}