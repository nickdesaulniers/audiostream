var fs = require('fs');
var child_process = require('child_process');
var ffmpeg = require('fluent-ffmpeg');
var FileMap = require('../lib/filemap').FileMap;
var convert = require('../lib/convert');

exports.index = function (req, res) {
  res.sendfile('public/pages/index.html');
}

exports.list = function(req, res){
  var filemap = FileMap.retrieveAll();
  var filemapKeys = Object.keys(filemap);
  var files = [];

  filemapKeys.forEach(function (id) {
    var filename = filemap[id];
    ffmpeg.ffprobe(filename, function (err, metadata) {
      if (err) return console.error(err);
      var format = metadata.format;
      var tags = format.tags;

      files.push({
        songID: id,
        ext: filename.replace(/.+\./, ''),
        title: tags.title || filename.replace(/.+\//, ''),
        artist: tags.artist,
        album: tags.album,
        year: tags.date,
        track: tags.track,
        duration: format.duration,
      });

      // On the last file
      if (files.length === filemapKeys.length) {
        res.send(files);
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

  // Was the requested extension the file's current extension?
  var requested_extension = req.params.extension;
  var actual_extension = file_path.replace(/.+\./, '');
  if (requested_extension === actual_extension) {
    console.log('The file\'s actual extension was requested');
    return res.sendfile(file_path);
  }

  // Was the requested extension previously encoded?
  var previous_file_name = req.params.fileID + '.' + requested_extension;
  var previous_file_path = FileMap.previously_transcoded(previous_file_name);
  if (previous_file_path) {
    console.log('Found previously encoded version in library/');
    return res.sendfile(previous_file_path);
  }

  // Transcoding needed
  console.log('Transcoding ' + actual_extension + ' to ' + requested_extension);
  var transcode_args = {
    file_path: file_path,
    requested_extension: requested_extension,
    transcoded_fstream: fs.createWriteStream('./library/' + previous_file_name),
    res: res,
    cb: function cb (code, stderr) {
      if (code) {
        console.error(stderr);
      } else {
        console.log('transcoded');
      }
    },
  };
  convert(transcode_args);
}

